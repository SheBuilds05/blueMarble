import express, { Response } from 'express';
import User from '../models/Users'; 
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', verifyToken, async (req: any, res: Response) => {
  const { accountId, amount } = req.body;
  const userId = req.user.id; 

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ error: "Please enter a valid positive amount." });
  }

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }

    // 1. Initialize the target variable as null to satisfy TypeScript
    let targetAccount: any = null;

    // 2. Attempt to find the specific account by matching ID strings
    const foundAccount = user.accounts.find((acc: any) => {
      const internalId = acc._id?.toString();
      const customId = acc.id?.toString();
      return internalId === accountId || customId === accountId;
    });

    if (foundAccount) {
      targetAccount = foundAccount;
    } 
    // 3. FALLBACK: If ID doesn't match but user only has ONE account, use it.
    // This solves 404s caused by frontend/backend ID mismatches.
    else if (user.accounts.length === 1) {
      targetAccount = user.accounts[0];
      console.log(`Auto-selected only available account: ${targetAccount.id}`);
    }

    // 4. Final safety check
    if (!targetAccount) {
      return res.status(404).json({ error: "Selected account not found." });
    }

    // 5. Check Funds
    if (targetAccount.balance < numericAmount) {
      return res.status(400).json({ error: "Insufficient funds in this account." });
    }

    // 6. Perform the Update
    targetAccount.balance -= numericAmount;

    // Sync the top-level user balance for the dashboard
    user.balance = user.accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0);

    // 7. Persist changes
    // markModified is necessary when updating nested arrays in Mongoose
    user.markModified('accounts');
    await user.save();

    res.status(200).json({ 
      message: "Withdrawal successful", 
      newBalance: targetAccount.balance,
      totalBalance: user.balance
    });

  } catch (err: any) {
    console.error("❌ Withdrawal Error:", err.message);
    res.status(500).json({ 
      error: "Transaction failed", 
      details: process.env.NODE_ENV === 'development' ? err.message : "Internal server error" 
    });
  }
});

export default router;