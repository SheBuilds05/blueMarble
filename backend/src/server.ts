import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection (optional - will work even if MongoDB fails)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bluemarble';

// Try to connect to MongoDB, but don't fail if it doesn't work
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.log('⚠️ MongoDB not available:', err.message));

// Transaction Schema (if MongoDB is available)
let Transaction: any = null;
try {
  const transactionSchema = new mongoose.Schema({
    beneficiaryName: String,
    amount: Number,
    reference: String,
    type: String,
    category: String,
    status: String,
    date: Date
  });
  Transaction = mongoose.model('Transaction', transactionSchema);
} catch (err) {
  console.log('⚠️ Transaction model not created');
}

// Mock data (fallback if MongoDB is not available)
const mockTransactions = [
  {
    _id: '1',
    beneficiaryName: 'Salary Deposit',
    amount: 25000,
    type: 'Deposit',
    category: 'Income',
    status: 'completed',
    date: new Date()
  },
  {
    _id: '2',
    beneficiaryName: 'Checkers Groceries',
    amount: 3500,
    type: 'Payment',
    category: 'Food',
    status: 'completed',
    date: new Date()
  },
  {
    _id: '3',
    beneficiaryName: 'Freelance Work',
    amount: 5000,
    type: 'Deposit',
    category: 'Income',
    status: 'completed',
    date: new Date()
  },
  {
    _id: '4',
    beneficiaryName: 'Eskom',
    amount: 1200,
    type: 'Payment',
    category: 'Utilities',
    status: 'completed',
    date: new Date()
  },
  {
    _id: '5',
    beneficiaryName: 'MTN Airtime',
    amount: 299,
    type: 'Purchase',
    category: 'Mobile',
    status: 'completed',
    date: new Date()
  }
];

// Routes
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.get('/api/transactions', async (req, res) => {
  try {
    // Try to get real data from MongoDB
    if (Transaction) {
      const transactions = await Transaction.find().sort({ date: -1 });
      if (transactions.length > 0) {
        console.log(`✅ Found ${transactions.length} transactions in database`);
        return res.json(transactions);
      }
    }
    // Fallback to mock data
    console.log('📊 Using mock transaction data');
    res.json(mockTransactions);
  } catch (error) {
    console.error('Error:', error);
    res.json(mockTransactions);
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    if (Transaction) {
      const transaction = new Transaction(req.body);
      await transaction.save();
      res.status(201).json(transaction);
    } else {
      res.status(201).json({ ...req.body, _id: Date.now().toString() });
    }
  } catch (error) {
    res.status(400).json({ error: 'Failed to create transaction' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Test: http://localhost:${PORT}/test`);
  console.log(`✅ Transactions: http://localhost:${PORT}/api/transactions\n`);
});