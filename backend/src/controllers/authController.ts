import { Request, Response } from 'express';
import User from '../models/Users';
import bcrypt from 'bcryptjs';

// 1. THE GENERATOR FUNCTION
const generateBankDetails = () => {
  const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const cardNumber = "4558" + Math.floor(100000000000 + Math.random() * 900000000000).toString();
  const cvv = Math.floor(100 + Math.random() * 900).toString();
  
  // FIXED: Ensure registerCode is part of the return object
  const registerCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  const now = new Date();
  const expiryDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${(now.getFullYear() + 5).toString().slice(-2)}`;
  
  return { accountNumber, cardNumber, expiryDate, cvv, registerCode };
};

// 2. THE OPEN ACCOUNT CONTROLLER
export const openAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, surname, idNumber, email, phone, address, employment, balance } = req.body;

    // Check if client already exists
    let user = await User.findOne({ idNumber });
    if (user) {
      res.status(400).json({ message: "A client with this ID already exists." });
      return;
    }

    // Generate the details
    const bankDetails = generateBankDetails();

    // Create the user (mapping names to your Schema)
    const newUser = new User({
      firstName, 
      surname,
      idNumber,
      email,
      phone,
      address,
      employment,
      balance: balance || 0,
      isRegistered: false, 
      
      // Mapped from generator
      accountNumber: bankDetails.accountNumber,
      cardNumber: bankDetails.cardNumber,
      expiryDate: bankDetails.expiryDate,
      cvv: bankDetails.cvv,
      
      // FIXED: Added registerCode to the database save
      registerCode: bankDetails.registerCode,
      
      // NOTE: Since password is 'required' in your schema, we provide a temporary 
      // placeholder. It will be overwritten during the /register step.
      password: "PENDING_REGISTRATION" 
    });

    await newUser.save();

    // SEND RESPONSE BACK
    res.status(201).json({
      message: "Account created successfully",
      ...bankDetails // Sends all generated details (including registerCode) back to the UI
    });

  } catch (err) {
    console.error("Account Opening Error:", err);
    res.status(500).json({ message: "Server error during account opening" });
  }
};