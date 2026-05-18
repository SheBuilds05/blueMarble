const mongoose = require('mongoose');
require('dotenv').config();

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

const sampleTransactions = [
  {
    beneficiaryName: 'Salary Deposit',
    amount: 25000,
    reference: 'Monthly salary',
    type: 'Deposit',
    category: 'Income',
    status: 'completed',
    date: new Date('2024-01-15')
  },
  {
    beneficiaryName: 'Checkers Groceries',
    amount: 3500,
    reference: 'Weekly shopping',
    type: 'Payment',
    category: 'Food',
    status: 'completed',
    date: new Date('2024-01-16')
  },
  {
    beneficiaryName: 'Eskom',
    amount: 1200,
    reference: 'Electricity bill',
    type: 'Payment',
    category: 'Utilities',
    status: 'completed',
    date: new Date('2024-01-17')
  },
  {
    beneficiaryName: 'Freelance Work',
    amount: 5000,
    reference: 'Web development project',
    type: 'Deposit',
    category: 'Income',
    status: 'completed',
    date: new Date('2024-01-18')
  }
];

async function seed() {
  try {
    await mongoose.connect('mongodb://localhost:27017/bluemarble');
    await Transaction.deleteMany({});
    await Transaction.insertMany(sampleTransactions);
    console.log('✅ Sample data added!');
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}

seed();