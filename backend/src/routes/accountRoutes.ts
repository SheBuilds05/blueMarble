<<<<<<< HEAD
// src/routes/accountRoutes.ts
import { Router } from 'express';
import { getDashboardSummary, getFullHistory } from '../controllers/accountController';
import { protect } from '../middleware/auth'; // Adjust name if yours is different

const router = Router();

// Now these routes are "Guarded" - the Landing and History pages are safe!
router.get('/dashboard', protect, getDashboardSummary);
router.get('/history/:accountId', protect, getFullHistory);
=======
// backend/src/routes/accountRoutes.ts
import express from 'express';
import { createAccount, getAccounts } from '../controllers/accountController';
import { verifyToken } from '../middleware/authMiddleware'; // Your JWT middleware

const router = express.Router();

// POST /api/auth/accounts
router.post('/accounts', verifyToken, createAccount);
router.get('/accounts', verifyToken, getAccounts);
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35

export default router;