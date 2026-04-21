import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { email, code } = req.body;
  
  console.log('--- Login Attempt ---');
  console.log('Email:', email);

  try {
    // 1. Find User
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2. Validate Code (Plain or Bcrypt)
    let valid = false;
    if (user.registerCode.startsWith('$2a$')) {
      valid = await bcrypt.compare(code, user.registerCode);
    } else {
      valid = (code === user.registerCode);
    }

    if (!valid) {
      console.log('❌ Invalid code for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ Password valid, generating token...');

    // 3. Generate JWT
    // We cast to string to ensure TypeScript is happy. 
    // Ensure this matches the secret used in your auth middleware!
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error('❌ CRITICAL ERROR: JWT_SECRET is not defined in .env');
      return res.status(500).json({ error: 'Internal server configuration error' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      secret,
      { expiresIn: '24h' }
    );

    // 4. Send Successful Response
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name || 'User'
      }
    });

  } catch (err) {
    console.error('💥 Login Error:', err);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

export default router;