import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/Users';
import { openAccount } from '../controllers/authController'; // Using your controller
import { verifyToken } from '../middleware/authMiddleware';
import Transaction from '../models/Transaction';
import { getAccounts, createAccount } from '../controllers/accountController';
import multer from 'multer';

const upload = multer(); // For handling the ID upload if needed
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'erdtfygiuhjokjuhtfrdes';

router.get('/accounts', verifyToken, getAccounts);
router.post('/accounts', verifyToken, createAccount);
// --- 1. VERIFY ID BEFORE REGISTRATION ---
router.post('/verify-id', async (req: Request, res: Response) => {
  try {
    const { idNumber } = req.body;
    const existingUser = await User.findOne({ idNumber });

    if (!existingUser) {
      return res.status(404).json({ message: "ID not found. Please open an account." });
    }

    if (existingUser.isRegistered) {
      return res.status(409).json({
        message: "You are already registered for mobile banking.",
        alreadyRegistered: true
      });
    }

    res.json({ message: "ID Verified", firstName: existingUser.firstName });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// --- 2. REGISTER (NOW STORES THE EMAIL) ---
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, idNumber, phone, password } = req.body;

    const user = await User.findOne({ idNumber });
    
    if (!user) {
      return res.status(404).json({ message: "User record not found." });
    }

    if (user.isRegistered) {
      return res.status(400).json({ message: "User is already registered." });
    }

    // Checking uniqueness here is correct because this is where the email is first saved
    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      return res.status(400).json({ message: "This email is already in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.email = email;
    user.phone = phone;
    user.password = hashedPassword;
    user.isRegistered = true;

    await user.save();
    res.status(201).json({ message: "Mobile banking registration successful!" });
  } catch (err: any) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// --- 3. LOGIN ROUTE ---
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isRegistered) {
      return res.status(400).json({ message: "Account not found or not registered." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        balance: user.balance
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// --- 4. OPEN ACCOUNT (CLEANED: NO EMAIL) ---
// Using upload.single('idCopy') to handle the file upload from your form
router.post('/open-account', upload.single('idCopy'), openAccount);

// --- 5. FETCH USER ACCOUNTS ---
router.get('/accounts', verifyToken, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const idStr = user.idNumber ? user.idNumber.toString() : '0000000000000';
    
    const userAccounts = [
      {
        id: user._id,
        type: 'Savings Account',
        mask: `**** ${idStr.slice(-4)}`,
        balance: `R ${user.balance.toFixed(2)}`,
        color: 'from-[#3b82f6] to-[#052CE0]'
      }
    ];
    
    res.json(userAccounts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching accounts" });
  }
});

// --- 6. GET BENEFICIARIES ---
router.get('/beneficiaries', verifyToken, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const sortedBeneficiaries = user.beneficiaries.sort((a: any, b: any) =>
      new Date(b.lastPaid).getTime() - new Date(a.lastPaid).getTime()
    );

    res.json(sortedBeneficiaries);
  } catch (err) {
    res.status(500).json({ message: "Error fetching beneficiaries" });
  }
});

// --- 7. ADD BENEFICIARY ---
router.post('/beneficiaries', verifyToken, async (req: any, res: Response) => {
  try {
    const { name, detail, type } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.beneficiaries.push({
      name,
      detail,
      type: type || 'bank',
      lastPaid: new Date()
    } as any);

    await user.save();
    res.status(201).json(user.beneficiaries);
  } catch (err) {
    res.status(500).json({ message: "Error adding beneficiary" });
  }
});

// --- 8. PROCESS PAYMENT ---
router.post('/pay', verifyToken, async (req: any, res: Response) => {
  try {
    const { amount, reference, beneficiaryId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || user.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds or user not found" });
    }

    user.balance -= amount;

    const beneficiary = (user.beneficiaries as any).id(beneficiaryId);
    if (beneficiary) {
      beneficiary.lastPaid = new Date();
    }

    const newTransaction = new Transaction({
      userId: user._id,
      beneficiaryName: beneficiary ? beneficiary.name : "Unknown",
      amount: amount,
      reference: reference,
      type: 'Payment'
    });

    await user.save();
    await newTransaction.save();

    res.json({ message: "Payment Successful", newBalance: user.balance });
  } catch (err) {
    res.status(500).json({ message: "Payment failed on server" });
  }
});

// --- 9. GET TRANSACTION HISTORY ---
router.get('/transactions', verifyToken, async (req: any, res: Response) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

// --- 10. GET PROFILE ---
router.get('/profile', verifyToken, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      firstName: user.firstName,
      surname: user.surname,
      email: user.email,
      phone: user.phone,
      balance: user.balance,
      membership: "Verified Member"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;