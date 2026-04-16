import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Import models (to be used in routes)
import User from './models/User';
import Transaction from './models/Transaction';
import Notification from './models/Notification';
import Purchase from './models/Purchase';

// Helper to safely extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ connected: true, userCount });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: getErrorMessage(error) });
  }
});

// Create a test user (for development)
app.post('/api/test-user', async (req, res) => {
  try {
    // Delete any existing test user
    await User.deleteOne({ email: 'test@example.com' });
    
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123', // In real app, hash with bcrypt
      registerCode: '123456',
      accounts: [
        { id: '1', name: 'Main Savings', type: 'savings', balance: 5000, accountNumber: 'SAV-****-1111' },
        { id: '2', name: 'Everyday Cheque', type: 'cheque', balance: 2000, accountNumber: 'CHQ-****-2222' },
        { id: '3', name: 'Investment Portfolio', type: 'investment', balance: 10000, accountNumber: 'INV-****-3333' }
      ]
    });
    await testUser.save();
    res.json({ success: true, user: { id: testUser._id, email: testUser.email } });
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// Transfer endpoint (simple version for testing)
app.post('/api/transfer', async (req, res) => {
  const { userId, fromAccountId, toAccountId, amount, description } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const fromAcc = user.accounts.find(acc => acc.id === fromAccountId);
    const toAcc = user.accounts.find(acc => acc.id === toAccountId);
    if (!fromAcc || !toAcc) return res.status(400).json({ error: 'Account not found' });
    if (fromAcc.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });
    
    fromAcc.balance -= amount;
    toAcc.balance += amount;
    await user.save();
    
    // Create transaction record
    const transaction = new Transaction({
      userId: user._id,
      type: 'transfer',
      amount,
      description,
      fromAccountId,
      toAccountId,
      status: 'completed'
    });
    await transaction.save();
    
    // Create notification
    const notification = new Notification({
      userId: user._id,
      title: 'Transfer Successful',
      message: `R${amount} transferred from ${fromAcc.name} to ${toAcc.name}`,
      type: 'transaction'
    });
    await notification.save();
    
    res.json({
      success: true,
      newBalances: {
        [fromAccountId]: fromAcc.balance,
        [toAccountId]: toAcc.balance
      },
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));