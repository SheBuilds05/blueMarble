import { Router } from 'express';
import authMiddleware from '../middleware/auth';
import User from '../models/User';

const router = Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found in Database' });
    }

    // Debug logging
    console.log('✅ User found:', user.email);
    console.log('📊 Accounts:', JSON.stringify(user.accounts, null, 2));
    console.log('📊 Accounts count:', user.accounts?.length || 0);

    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;