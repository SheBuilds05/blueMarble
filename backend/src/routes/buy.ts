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
    
<<<<<<< HEAD
    // 1. Fetch the user first to check balance
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Identify the account index
    const accountIndex = user.accounts?.findIndex(acc => acc.type === 'savings');
=======
    // 1. Fetch user to check current state
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Locate the savings account index
    const accountIndex = user.accounts?.findIndex(acc => acc.type === 'savings');
    
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    if (accountIndex === -1 || accountIndex === undefined) {
      return res.status(400).json({ message: 'Savings account not found' });
    }

<<<<<<< HEAD
=======
    // 3. Validate Funds
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    const currentBalance = Number(user.accounts[accountIndex].balance);
    if (currentBalance < numAmount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    const newBalance = parseFloat((currentBalance - numAmount).toFixed(2));

<<<<<<< HEAD
    // 3. ATOMIC UPDATE: Use findOneAndUpdate with positional operator ($)
    // This targets the specific account inside the array and updates only the balance
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "accounts.type": "savings" },
      { $set: { "accounts.$.balance": newBalance } },
      { new: true } // Returns the updated document
=======
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
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    );

    if (!updatedUser) {
      return res.status(500).json({ message: 'Failed to update balance in database' });
    }

<<<<<<< HEAD
    // 4. Create secondary records (Transaction, Purchase, Notification)
=======
    // 5. Create Transaction Record
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    const transaction = await Transaction.create({
      userId: userId,
      beneficiaryName: provider,
      amount: numAmount,
      reference: `${category.toUpperCase()}: ${identifier}`,
      type: 'Purchase',
<<<<<<< HEAD
      status: 'completed'
    });

=======
      status: 'completed',
      date: new Date()
    });

    // 6. Create Purchase Record
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    await Purchase.create({
      userId: userId,
      category,
      provider,
      amount: numAmount,
      details: extraDetails,
      status: 'completed',
      transactionId: transaction._id
    });

<<<<<<< HEAD
    await Notification.create({
      userId: userId,
      title: 'Purchase Successful',
      message: `R${numAmount} for ${category} (${provider})`,
      type: 'transaction'
    });

    return res.json({ 
      message: 'Purchase successful', 
      newBalance: newBalance,
=======
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
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
      transactionId: transaction._id
    });

  } catch (err) {
<<<<<<< HEAD
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
=======
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
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35

export default router;