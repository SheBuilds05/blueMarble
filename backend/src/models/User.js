const mongoose = require('mongoose');

// 1. Transaction Schema
const TransactionSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'User.accounts' },
  merchant: String,
  loc: String,
  time: String, // e.g., "14:20"
  date: { type: Date, default: Date.now },
  amount: Number, // Negative for expense, positive for deposit
  type: { type: String, enum: ['swipe', 'atm', 'deposit'] }
});

// 2. User & Accounts Schema
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  // This is what the frontend maps through
  accounts: [{
    type: { type: String, default: 'Savings Account' },
    mask: { type: String, default: '**** 0000' },
    balance: { type: Number, default: 0 }
  }]
});

const User = mongoose.model('User', UserSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = { User, Transaction };