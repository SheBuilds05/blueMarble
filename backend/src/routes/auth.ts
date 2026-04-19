import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';   // ← import the model, name it User

const router = Router();

router.post('/login', async (req, res) => {
  const { email, code } = req.body;
  console.log('Login attempt:', { email, code });   // ✅ log credentials

  try {
    const user = await User.findOne({ email });
    console.log('Found user:', user ? user.email : 'none');   // ✅ log if user exists

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Stored registerCode:', user.registerCode);   // ✅ log stored code (hashed or plain)
    console.log('Provided code:', code);

    // Compare: if stored code is hashed (starts with $2a$), use bcrypt; else plain compare
    let valid = false;
    if (user.registerCode.startsWith('$2a$')) {
      valid = await bcrypt.compare(code, user.registerCode);
    } else {
      valid = (code === user.registerCode);
    }
    console.log('Password valid:', valid);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ... generate token and respond
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;