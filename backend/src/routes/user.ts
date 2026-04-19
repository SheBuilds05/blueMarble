import { Router } from 'express';
import authMiddleware from '../middleware/auth';

const router = Router();

// Mock user data (same as above)
const userData = {
  id: '1',
  name: 'Demo User',
  email: 'demo@openbank.com',
  balance: 5234.56,
  accounts: [
    { id: '1', name: 'Main Savings', type: 'savings', balance: 12500.75, accountNumber: 'SAV-****-1234' },
    { id: '2', name: 'Everyday Cheque', type: 'cheque', balance: 3450.50, accountNumber: 'CHQ-****-5678' },
    { id: '3', name: 'Investment Portfolio', type: 'investment', balance: 50000.00, accountNumber: 'INV-****-9012' }
  ]
};

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: userData });
});

export default router;