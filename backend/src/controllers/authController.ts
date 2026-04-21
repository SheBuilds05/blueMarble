import { Request, Response } from 'express';
import User from '../models/Users';
// import Account from '../models/Account'; // If you created the separate table

// 1. THE GENERATOR FUNCTION
const generateBankDetails = () => {
  const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const cardNumber = "4558" + Math.floor(100000000000 + Math.random() * 900000000000).toString();
  const cvv = Math.floor(100 + Math.random() * 900).toString();
  
  const now = new Date();
  const expiryDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${(now.getFullYear() + 5).toString().slice(-2)}`;
  
  return { accountNumber, cardNumber, expiryDate, cvv };
};

// 2. THE OPEN ACCOUNT CONTROLLER (This handles the form you just built)
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
      isRegistered: false, // They haven't set a password/mobile login yet
      // Add these to your Schema if you aren't using a separate Account table yet:
      accountNumber: bankDetails.accountNumber,
      cardNumber: bankDetails.cardNumber,
      expiryDate: bankDetails.expiryDate,
      cvv: bankDetails.cvv
    });

    await newUser.save();

    // SEND RESPONSE BACK (This fixes the 'undefined' error)
    res.status(201).json({
      message: "Account created successfully",
      ...bankDetails // Spreads accountNumber, cardNumber, etc. into the JSON
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during account opening" });
  }
};