import express from 'express';
import User from '../models/Users'; 
import mongoose from 'mongoose';

const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, accountId, amount } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid session" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Find account by string 'id' (e.g. "1" or "2")
    const account = user.accounts.find(acc => acc.id === accountId);
    if (!account) return res.status(404).json({ error: "Account not found" });

    const numericAmount = parseFloat(amount);
    if (account.balance < numericAmount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    // Process deduction
    account.balance -= numericAmount;

    // Optional: Sync top-level user balance
    user.balance = user.accounts.reduce((sum, acc) => sum + acc.balance, 0);

    await user.save();

    res.status(200).json({ 
      message: "Withdrawal successful", 
      newBalance: account.balance 
    });
  } catch (err) {
    res.status(500).json({ error: "Transaction failed" });
  }
});

export default router;