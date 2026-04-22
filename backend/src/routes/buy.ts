import { Router, Response } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import User from '../models/Users';
import Transaction from '../models/Transaction';
import Notification from '../models/Notification';
import Purchase from '../models/Purchase';

const router = Router();

const processPurchase = async (
  req: any, 
  res: Response, 
  category: 'airtime' | 'electricity' | 'voucher',
  data: { provider: string; amount: any; identifier: string; extraDetails: any }
) => {
  const { provider, amount, identifier, extraDetails } = data;
  const numAmount = parseFloat(amount);

  try {
    const userId = req.user?.id || req.user?.userId;
    
    // 1. Fetch the user first to check balance
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Identify the account index
    const accountIndex = user.accounts?.findIndex(acc => acc.type === 'savings');
    if (accountIndex === -1 || accountIndex === undefined) {
      return res.status(400).json({ message: 'Savings account not found' });
    }

    const currentBalance = Number(user.accounts[accountIndex].balance);
    if (currentBalance < numAmount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    const newBalance = parseFloat((currentBalance - numAmount).toFixed(2));

    // 3. ATOMIC UPDATE: Use findOneAndUpdate with positional operator ($)
    // This targets the specific account inside the array and updates only the balance
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "accounts.type": "savings" },
      { $set: { "accounts.$.balance": newBalance } },
      { new: true } // Returns the updated document
    );

    if (!updatedUser) {
      return res.status(500).json({ message: 'Failed to update balance in database' });
    }

    // 4. Create secondary records (Transaction, Purchase, Notification)
    const transaction = await Transaction.create({
      userId: userId,
      beneficiaryName: provider,
      amount: numAmount,
      reference: `${category.toUpperCase()}: ${identifier}`,
      type: 'Purchase',
      status: 'completed'
    });

    await Purchase.create({
      userId: userId,
      category,
      provider,
      amount: numAmount,
      details: extraDetails,
      status: 'completed',
      transactionId: transaction._id
    });

    await Notification.create({
      userId: userId,
      title: 'Purchase Successful',
      message: `R${numAmount} for ${category} (${provider})`,
      type: 'transaction'
    });

    return res.json({ 
      message: 'Purchase successful', 
      newBalance: newBalance,
      transactionId: transaction._id
    });

  } catch (err) {
    console.error('Final attempt error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// --- Standard Routes ---
router.post('/airtime', verifyToken, (req, res) => 
  processPurchase(req, res, 'airtime', { provider: req.body.provider, amount: req.body.amount, identifier: req.body.phone, extraDetails: { phone: req.body.phone } }));

router.post('/electricity', verifyToken, (req, res) => 
  processPurchase(req, res, 'electricity', { provider: req.body.provider, amount: req.body.amount, identifier: req.body.meter, extraDetails: { meter: req.body.meter } }));

router.post('/voucher', verifyToken, (req, res) => 
  processPurchase(req, res, 'voucher', { provider: req.body.provider, amount: req.body.amount, identifier: req.body.email, extraDetails: { email: req.body.email, voucherCode: `VCH-${Math.random().toString(36).toUpperCase().slice(2,10)}` } }));

export default router;