import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, code } = req.body;
  console.log('Login attempt:', { email, code });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Stored registerCode (first 10 chars):', user.registerCode?.substring(0, 10));
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

    // ✅ Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    // ✅ Prepare user object without sensitive data
    const { password, registerCode, ...safeUser } = user.toObject();

    // ✅ Send response
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;