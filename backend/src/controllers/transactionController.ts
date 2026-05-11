import { Request, Response } from 'express';
import {Transaction} from '../models/Transaction';

export const getTransactions = async (req: Request, res: Response) => {
  try {
    // For now, we fetch all. Later, we will filter by the logged-in user.
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};