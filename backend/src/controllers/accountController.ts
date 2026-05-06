import { Request, Response } from 'express';
import Account from '../models/Account';
<<<<<<< HEAD
import { Transaction } from '../models/Transaction';

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    // 1. Get the user ID (mock for now)
    const userId = (req as any).user?.id || "661f7c8e9b1e4d2a1c8b4567";

    const account = await Account.findOne({ owner: userId });
    if (!account) return res.status(404).json({ message: "Account not found" });

    // 2. We use 'account._id' directly without casting to string first. 
    // If TS still complains, we use 'as any' to force it through.
    const recentTransactions = await Transaction.find({ 
      accountId: account._id as any 
    })
      .sort({ date: -1 })
      .limit(5);

    res.json({
      balance: account.balance,
      accountNumber: account.accountNumber,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getFullHistory = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    
    // 3. For params (which are strings), pass them directly into the query object.
    // Mongoose is smart enough to convert a valid string ID into an ObjectId.
    const transactions = await Transaction.find({ 
      accountId: accountId as any 
    }).sort({ date: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history", error });
=======
import User from '../models/Users';

export const getAccounts = async (req: any, res: Response) => {
  try {
    // 1. Get the newly created accounts from the Account collection
    const accounts = await Account.find({ userId: req.user.id });

    // 2. Get the "Original" account data from the User model (for the registration account)
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    // 3. Combine them into one list that matches your Frontend variables
    const formattedAccounts = [
      // The primary account from registration
      {
        _id: user._id,
        accountType: 'Savings Account',
        balance: user.balance,
        accountNumber: user.idNumber || 'Primary',
        color: 'from-[#3b82f6] to-[#052CE0]',
        cardDetails: { cardNumber: '0000000000000000' } // Placeholder for primary
      },
      // Any new accounts created today
      ...accounts.map(acc => ({
        _id: acc._id,
        accountType: acc.type, // Map 'type' to 'accountType' for frontend
        balance: acc.balance,
        accountNumber: acc.accountNumber,
        color: acc.color,
        cardDetails: acc.cardDetails
      }))
    ];

    res.json(formattedAccounts);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch accounts" });
  }
};

export const createAccount = async (req: any, res: Response) => {
  try {
    // 1. Check if req.user exists (from verifyToken)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { type } = req.body;
    
    // 2. Define colors based on type to match your frontend
    const colorMap: { [key: string]: string } = {
      'Savings': 'from-blue-600 to-blue-800',
      'Cheque': 'from-emerald-500 to-teal-700',
      'Investment': 'from-purple-600 to-indigo-900'
    };

    // 3. Create the new account
    // The 'pre-validate' hook in your Account model will handle 
    // generating the accountNumber and cardDetails automatically.
    const newAccount = new Account({
      userId: req.user.id,
      type: type || 'Savings',
      balance: 0,
      color: colorMap[type] || colorMap['Savings']
    });

    const savedAccount = await newAccount.save();
    
    // 4. Return the saved account
    res.status(201).json(savedAccount);
  } catch (error: any) {
    console.error("Account Creation Error:", error.message);
    res.status(500).json({ message: "Server error during account creation", error: error.message });
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
  }
};