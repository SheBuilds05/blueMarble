import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboardController';

const router = Router();

// GET: /api/dashboard
router.get('/', getDashboardSummary);

export default router;