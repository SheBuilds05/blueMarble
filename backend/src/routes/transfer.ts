import { Router, Request, Response } from 'express';
import authMiddleware from '../middleware/auth';
import User from '../models/User';
import Transaction from '../models/Transaction';
import Notification from '../models/Notification';

const router = Router();

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { fromAccountId, toAccountId, amount, description } = req.body;
  const userId = (req as any).userId;
  const transferAmount = Number(amount);

  try {
    console.log('--- 💸 Transfer Process Started ---');
    console.log('🔍 Auth Token UserID:', userId);

    // 1. Fetch User Document
    const user = await User.findById(userId);

    if (!user) {
      console.log('❌ DATABASE: No user found with ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    // 2. CRITICAL FIX: Defensive check for accounts property
    // If user.accounts is undefined, the next line will crash without this check.
    if (!user.accounts || !Array.isArray(user.accounts)) {
      console.log('🚨 FIELD ERROR: "accounts" is missing/undefined in DB for user:', user.email);
      return res.status(400).json({ error: 'Accounts not initialized for this user.' });
    }

    // 3. Find accounts in the sub-document array
    // We use String() to ensure we match "1" vs 1 or MongooseObjectIDs
    const fromAccount = user.accounts.find((acc: any) => String(acc.id) === String(fromAccountId));
    const toAccount = user.accounts.find((acc: any) => String(acc.id) === String(toAccountId));

    if (!fromAccount || !toAccount) {
      console.log('❌ Account mismatch. Details:', { 
        fromFound: !!fromAccount, 
        toFound: !!toAccount,
        dbIds: user.accounts.map((a: any) => a.id) 
      });
      return res.status(400).json({ error: 'Invalid source or destination account.' });
    }

    // 4. Validate Funds
    if (transferAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than zero.' });
    }

    if (fromAccount.balance < transferAmount) {
      return res.status(400).json({ error: `Insufficient funds in ${fromAccount.name}` });
    }

    // 5. Perform Math directly on the Mongoose sub-documents
    fromAccount.balance -= transferAmount;
    toAccount.balance += transferAmount;

    // 6. Sync Top-Level Balance & Save
    // Ensure the root "balance" field matches the sum of accounts
    user.balance = user.accounts.reduce((sum, acc) => sum + acc.balance, 0);

    // Tell Mongoose the nested array has changed
    user.markModified('accounts');
    await user.save();

    console.log('✅ Balances updated successfully in MongoDB');

    // 7. Background Tasks: Create Records
    // Using try/catch so a failed notification doesn't roll back the money transfer
    try {
      await Promise.all([
        Transaction.create({
          userId: user._id,
          type: 'transfer',
          amount: transferAmount
        }),
        Notification.create({
          userId: user._id,
          title: 'Transfer Successful',
          message: `R${transferAmount.toFixed(2)} moved to ${toAccount.name}`,
          type: 'transaction',
          read: false
        })
      ]);
    } catch (recordError) {
      console.error('⚠️ Logging failed (Tx/Notif), but transfer succeeded:', recordError);
    }

    // 8. Success Response
    return res.status(200).json({
      success: true,
      message: 'Transfer completed successfully!',
      newBalances: {
        [fromAccountId]: fromAccount.balance,
        [toAccountId]: toAccount.balance
      },
      totalBalance: user.balance
    });

  } catch (error) {
    console.error('🔥 Server Error during transfer:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;