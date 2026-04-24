// backend/src/routes/accountRoutes.ts
import express from 'express';
import { createAccount, getAccounts } from '../controllers/accountController';
import { verifyToken } from '../middleware/authMiddleware'; // Your JWT middleware

const router = express.Router();

// POST /api/auth/accounts
router.post('/accounts', verifyToken, createAccount);
router.get('/accounts', verifyToken, getAccounts);

export default router;