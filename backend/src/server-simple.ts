import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bluemarble';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  beneficiaryName: String,
  amount: Number,
  reference: String,
  type: String,
  category: String,
  status: String,
  date: Date
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    console.log(`Found ${transactions.length} transactions`);
    res.json(transactions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Test: http://localhost:${PORT}/test`);
  console.log(`✅ Transactions: http://localhost:${PORT}/api/transactions`);
});