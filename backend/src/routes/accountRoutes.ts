// src/routes/accountRoutes.ts
import { Router } from 'express';
import { getDashboardSummary, getFullHistory } from '../controllers/accountController';
import { protect } from '../middleware/auth'; // Adjust name if yours is different

const router = Router();

// Now these routes are "Guarded" - the Landing and History pages are safe!
router.get('/dashboard', protect, getDashboardSummary);
router.get('/history/:accountId', protect, getFullHistory);

export default router;