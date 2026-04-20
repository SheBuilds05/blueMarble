import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/Users'; // Ensure this points to your User model
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'erdtfygiuhjokjuhtfrdes';

// --- REGISTER ROUTE ---
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { firstName, surname, email, idNumber, phone, password } = req.body;

    // 1. Check if user already exists (by email or ID number)
    const existingUser = await User.findOne({ $or: [{ email }, { idNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this Email or ID Number already exists" });
    }

    // 2. Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create and save the new user
    const newUser = new User({
      firstName,
      surname,
      email,
      idNumber,
      phone,
      password: hashedPassword,
      balance: 0 // Default balance for new accounts
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

// --- PROTECTED DATA ROUTE ---
router.get('/dashboard-data', verifyToken, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

// --- FETCH USER ACCOUNTS ---
router.get('/accounts', verifyToken, async (req: any, res: Response) => {
  try {
    // 1. Fetch user from DB using the ID from the token
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Generate the account list dynamically based on the user's data
    const userAccounts = [
      { 
        // Use the real MongoDB unique ID for the account key
        id: user._id, 
        type: 'Savings Account', 
        // Dynamically mask the ID number using the real data from the DB
        mask: `**** ${user.idNumber ? user.idNumber.toString().slice(-4) : 'XXXX'}`, 
        // Format the real balance from the database
        balance: `R ${user.balance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 
        color: 'from-[#3b82f6] to-[#052CE0]' 
      }
    ];

    // Optional: If you want to show a second account (like a Cheque account) 
    // you would eventually add an "accounts" array to your MongoDB User Schema.
    
    res.json(userAccounts);
  } catch (err) {
    console.error("Error fetching accounts:", err);
    res.status(500).json({ message: "Server Error fetching accounts" });
  }
});

export default router;