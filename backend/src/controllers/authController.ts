import { Request, Response } from 'express';
<<<<<<< HEAD
import User from '../models/User';
import bcrypt from 'bcryptjs';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
=======
import User from '../models/Users';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// 1. THE GENERATOR FUNCTION
const generateBankDetails = () => {
  const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const cardNumber = "4558" + Math.floor(100000000000 + Math.random() * 900000000000).toString();
  const cvv = Math.floor(100 + Math.random() * 900).toString();
  const registerCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  const now = new Date();
  const expiryDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${(now.getFullYear() + 5).toString().slice(-2)}`;
  
  return { accountNumber, cardNumber, expiryDate, cvv, registerCode };
};

// --- 2. OPEN ACCOUNT (Step 1) ---
export const openAccount = async (req: Request, res: Response): Promise<void> => {
  try {

    console.log("Incoming Body:", req.body);
    console.log("Incoming File:", req.file);
    
    const { firstName, surname, idNumber, phone, address, employment, balance } = req.body;

    let user = await User.findOne({ idNumber });
    if (user) {
      res.status(400).json({ message: "A client with this ID already exists." });
      return;
    }

    const bankDetails = generateBankDetails();

    const newUser = new User({
      firstName,
      surname,
      email: undefined,
      idNumber,
      address,
      employment,
      balance: balance || 0,
      isRegistered: false, 
      password: await bcrypt.hash(Math.random().toString(36), 10),
      registerCode: bankDetails.registerCode,
      
      // ADD THESE FIELDS BELOW - They were missing in your code!
      accountNumber: bankDetails.accountNumber,
      cardNumber: bankDetails.cardNumber,
      expiryDate: bankDetails.expiryDate,
      cvv: bankDetails.cvv,
      
      accounts: [{
        id: new mongoose.Types.ObjectId().toString(),
        name: "Primary Savings",
        type: "savings",
        balance: balance || 0,
        accountNumber: bankDetails.accountNumber
      }]
    });

    await newUser.save(); // Now it actually has data to save!

    res.status(201).json({
      message: "Account created successfully",
      accountNumber: bankDetails.accountNumber,
      cardNumber: bankDetails.cardNumber,
      expiryDate: bankDetails.expiryDate,
      cvv: bankDetails.cvv
    });

  } catch (err) {
    console.error("Account Opening Error:", err);
    res.status(500).json({ message: "Server error during account opening" });
  }

  
};

// 3. VERIFY ID (Used in Registration Step 1)
export const verifyID = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idNumber } = req.body;
    const user = await User.findOne({ idNumber });

    if (!user) {
      res.status(404).json({ message: "ID not found. Please open an account first." });
      return;
    }

    if (user.isRegistered) {
      res.status(409).json({ message: "This ID is already registered for mobile banking." });
      return;
    }

    res.status(200).json({ 
      message: "ID Verified", 
      firstName: user.firstName 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during verification" });
  }
};

// 4. REGISTER (Step 2: Update existing profile with password/email)
// 4. REGISTER (Step 2)
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idNumber, email, password, phone } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findOneAndUpdate(
      { idNumber: idNumber },
      { 
        $set: { 
          email: email, // Email is saved here for the first time
          password: hashedPassword, 
          phone: phone, 
          isRegistered: true 
        } 
      },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "Account not found." });
      return;
    }

    res.status(200).json({ message: "Mobile banking activated!" });
  } catch (err: any) {
    res.status(500).json({ message: "Registration failed." });
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
  }
};