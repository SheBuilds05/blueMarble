import { Request, Response } from 'express';
import Account from '../models/Account';
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
  }
};