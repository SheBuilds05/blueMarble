// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  idNumber: String,
  mobile: String,
  // ... other profile fields
  accounts: [{
    type: { type: String, default: 'Savings Account' },
    balance: { type: Number, default: 0 },
    mask: String,
    color: String
  }]
});

module.exports = mongoose.model('User', UserSchema);