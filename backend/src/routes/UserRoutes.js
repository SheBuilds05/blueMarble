// routes/account.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Fetch user profile and accounts
router.get('/profile/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user);
});

// Update profile
router.put('/profile/:userId', async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
  res.json(updatedUser);
});

// Handle Withdrawal
router.post('/withdraw', async (req, res) => {
  const { userId, accountId, amount } = req.body;
  const user = await User.findById(userId);
  const account = user.accounts.id(accountId);

  if (account.balance >= amount) {
    account.balance -= amount;
    await user.save();
    res.json({ success: true, newBalance: account.balance });
  } else {
    res.status(400).json({ error: 'Insufficient funds' });
  }
});