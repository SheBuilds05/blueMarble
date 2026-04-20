import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/Users'; 
import { verifyToken } from '../middleware/authMiddleware';
import Transaction from '../models/Transaction';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'erdtfygiuhjokjuhtfrdes';

// --- REGISTER ROUTE ---
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { firstName, surname, email, idNumber, phone, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { idNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this Email or ID Number already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      surname,
      email,
      idNumber,
      phone,
      password: hashedPassword,
      balance: 1500.00, 
      beneficiaries: []
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err: any) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Email" });

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

// --- FETCH USER ACCOUNTS ---
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

// --- GET BENEFICIARIES ---
router.get('/beneficiaries', verifyToken, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Sort so most recently paid appear first
    const sortedBeneficiaries = user.beneficiaries.sort((a, b) => 
      new Date(b.lastPaid).getTime() - new Date(a.lastPaid).getTime()
    );

    res.json(sortedBeneficiaries);
  } catch (err) {
    res.status(500).json({ message: "Error fetching beneficiaries" });
  }
});

// --- ADD BENEFICIARY (UPDATED) ---
router.post('/beneficiaries', verifyToken, async (req: any, res: Response) => {
  try {
    // 1. Get name, detail, AND type from the request
    const { name, detail, type } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Add the new beneficiary to the list
    // Note: 'initials' will be handled automatically by our Mongoose pre-save hook
    user.beneficiaries.push({
      name,
      detail,
      type: type || 'bank', // Default to bank if not provided
      lastPaid: new Date()
    } as any);

    await user.save();
    res.status(201).json(user.beneficiaries);
  } catch (err) {
    console.error("Add Beneficiary Error:", err);
    res.status(500).json({ message: "Error adding beneficiary" });
  }
});

// --- PROCESS PAYMENT ---
router.post('/pay', verifyToken, async (req: any, res: Response) => {
  try {
  const { amount, reference, beneficiaryId } = req.body;
  const user = await User.findById(req.user.id);

  if (!user || user.balance < amount) {
    return res.status(400).json({ message: "Insufficient funds or user not found" });
  }

  // 1. Deduct balance
  user.balance -= amount;

  // 2. Find beneficiary for the name
  const beneficiary = (user.beneficiaries as any).id(beneficiaryId);
  if (beneficiary) {
    beneficiary.lastPaid = new Date();
  }

  // 3. CREATE THE TRANSACTION RECORD (This is the missing part!)
  const newTransaction = new Transaction({
    userId: user._id,
    beneficiaryName: beneficiary ? beneficiary.name : "Unknown",
    amount: amount,
    reference: reference,
    type: 'Payment'
  });

  // 4. Save both
  await user.save();
  await newTransaction.save();

  res.json({ message: "Payment Successful", newBalance: user.balance });
} catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json({ message: "Payment failed on server" });
  }
});

// --- GET TRANSACTION HISTORY ---
router.get('/transactions', verifyToken, async (req: any, res: Response) => {
  try {
    // Find all transactions for this user, newest first
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1 }); 
    
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
});


export default router;