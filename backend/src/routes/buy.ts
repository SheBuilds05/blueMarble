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
    
    // 1. Fetch user to check current state
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Locate the savings account index
    const accountIndex = user.accounts?.findIndex(acc => acc.type === 'savings');
    
    if (accountIndex === -1 || accountIndex === undefined) {
      return res.status(400).json({ message: 'Savings account not found' });
    }

    // 3. Validate Funds
    const currentBalance = Number(user.accounts[accountIndex].balance);
    if (currentBalance < numAmount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    const newBalance = parseFloat((currentBalance - numAmount).toFixed(2));

    // 4. SURGICAL UPDATE: Update both the specific account and global balance
    // This uses the explicit path to ensure MongoDB precisely hits the correct array index
    const updatePath = `accounts.${accountIndex}.balance`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          [updatePath]: newBalance,
          balance: newBalance // Keeps global balance in sync with savings
        } 
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: 'Failed to update balance in database' });
    }

    // 5. Create Transaction Record
    const transaction = await Transaction.create({
      userId: userId,
      beneficiaryName: provider,
      amount: numAmount,
      reference: `${category.toUpperCase()}: ${identifier}`,
      type: 'Purchase',
      status: 'completed',
      date: new Date()
    });

    // 6. Create Purchase Record
    await Purchase.create({
      userId: userId,
      category,
      provider,
      amount: numAmount,
      details: extraDetails,
      status: 'completed',
      transactionId: transaction._id
    });

    // 7. Create Notification
    await Notification.create({
      userId: userId,
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Successful`,
      message: `R${numAmount.toFixed(2)} paid to ${provider} for ${identifier}`,
      type: 'transaction'
    });

    // 8. Return response with the actual value from the DB
    return res.json({ 
      message: 'Purchase successful', 
      newBalance: updatedUser.accounts[accountIndex].balance,
      transactionId: transaction._id
    });

  } catch (err) {
    console.error(`Purchase error (${category}):`, err);
    return res.status(500).json({ message: 'Server error during purchase process' });
  }
};

// --- API Endpoints ---

router.post('/airtime', verifyToken, (req: any, res: Response) => {
  const { provider, phone, amount } = req.body;
  processPurchase(req, res, 'airtime', { 
    provider, 
    amount, 
    identifier: phone, 
    extraDetails: { phone } 
  });
});

router.post('/electricity', verifyToken, (req: any, res: Response) => {
  const { provider, meter, amount } = req.body;
  processPurchase(req, res, 'electricity', { 
    provider, 
    amount, 
    identifier: meter, 
    extraDetails: { meter } 
  });
});

router.post('/voucher', verifyToken, (req: any, res: Response) => {
  // Destructure from req.body
  const { provider, amount, email } = req.body;

  // Validate that email exists before proceeding
  if (!email) {
    return res.status(400).json({ message: 'Recipient email is required for vouchers' });
  }

  const voucherCode = `VCH-${Math.random().toString(36).toUpperCase().slice(2, 10)}`;
  
  processPurchase(req, res, 'voucher', { 
    provider, 
    amount, 
    identifier: email, 
    extraDetails: { email, voucherCode } 
  });
});

export default router;