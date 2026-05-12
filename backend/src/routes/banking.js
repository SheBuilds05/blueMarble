const express = require('express');
const router = express.Router();
const { User, Transaction } = require('../models/User');

// GET: Fetch all accounts for a specific user
router.get('/accounts/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Return just the accounts array
    res.json(user.accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch transactions for a specific account
router.get('/transactions/:accountId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      accountId: req.params.accountId 
    }).sort({ date: -1 }); // Newest first
    
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;