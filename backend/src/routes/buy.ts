import { Router } from 'express';
import authMiddleware from '../middleware/auth';
import User from '../models/User';
import Transaction from '../models/Transaction';
import Notification from '../models/Notification';
import Purchase from '../models/Purchase';

const router = Router();

// Buy Airtime
router.post('/airtime', authMiddleware, async (req, res) => {
  const { provider, phoneNumber, amount } = req.body;
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId);
    
    // ✅ Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const savings = user.accounts.find(acc => acc.type === 'savings');
    if (!savings) {
      return res.status(400).json({ error: 'Savings account not found' });
    }
    if (savings.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Deduct amount
    savings.balance -= amount;
    await user.save();

    // Create transaction record
    const transaction = await Transaction.create({
      userId: user._id,
      type: 'purchase',
      amount: -amount,
      description: `${provider} airtime for ${phoneNumber}`,
      status: 'completed'
    });

    // Create purchase record
    await Purchase.create({
      userId: user._id,
      category: 'airtime',
      provider,
      amount,
      details: { phoneNumber },
      status: 'completed',
      transactionId: transaction._id
    });

    // Create notification
    await Notification.create({
      userId: user._id,
      title: 'Airtime Purchase',
      message: `R${amount} airtime purchased for ${phoneNumber}`,
      type: 'transaction'
    });

    res.json({
      success: true,
      message: `R${amount} airtime purchased for ${phoneNumber}`,
      newBalance: savings.balance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Buy Electricity (similar pattern)
router.post('/electricity', authMiddleware, async (req, res) => {
  const { provider, meterNumber, amount } = req.body;
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const savings = user.accounts.find(acc => acc.type === 'savings');
    if (!savings || savings.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    savings.balance -= amount;
    await user.save();

    const transaction = await Transaction.create({
      userId: user._id,
      type: 'purchase',
      amount: -amount,
      description: `${provider} electricity for meter ${meterNumber}`,
      status: 'completed'
    });

    await Purchase.create({
      userId: user._id,
      category: 'electricity',
      provider,
      amount,
      details: { meterNumber },
      status: 'completed',
      transactionId: transaction._id
    });

    await Notification.create({
      userId: user._id,
      title: 'Electricity Purchase',
      message: `R${amount} electricity for meter ${meterNumber}`,
      type: 'transaction'
    });

    res.json({
      success: true,
      message: `R${amount} electricity purchased for meter ${meterNumber}`,
      newBalance: savings.balance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Buy Voucher
router.post('/voucher', authMiddleware, async (req, res) => {
  const { voucherType, amount, email } = req.body;
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const savings = user.accounts.find(acc => acc.type === 'savings');
    if (!savings || savings.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    savings.balance -= amount;
    await user.save();

    const voucherCode = `VCH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const transaction = await Transaction.create({
      userId: user._id,
      type: 'purchase',
      amount: -amount,
      description: `${voucherType} voucher`,
      status: 'completed'
    });

    await Purchase.create({
      userId: user._id,
      category: 'voucher',
      provider: voucherType,
      amount,
      details: { email, voucherCode },
      status: 'completed',
      transactionId: transaction._id
    });

    await Notification.create({
      userId: user._id,
      title: 'Voucher Purchase',
      message: `${voucherType} voucher worth R${amount} sent to ${email}`,
      type: 'transaction'
    });

    res.json({
      success: true,
      message: `${voucherType} voucher sent to ${email}`,
      newBalance: savings.balance,
      voucherCode
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;