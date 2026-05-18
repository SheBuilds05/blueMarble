import { Router } from 'express';

const router = Router();

// Temporary mock data - no database needed
const mockTransactions = [
  {
    _id: '1',
    beneficiaryName: 'Salary Deposit',
    amount: 25000,
    type: 'Deposit',
    category: 'Income',
    status: 'completed',
    date: new Date()
  },
  {
    _id: '2',
    beneficiaryName: 'Checkers Groceries',
    amount: 3500,
    type: 'Payment',
    category: 'Food',
    status: 'completed',
    date: new Date()
  },
  {
    _id: '3',
    beneficiaryName: 'Freelance Work',
    amount: 5000,
    type: 'Deposit',
    category: 'Income',
    status: 'completed',
    date: new Date()
  }
];

router.get('/transactions', async (req, res) => {
  res.json(mockTransactions);
});

export default router;