import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
const router = Router();

// GET: /api/dashboard
router.get('/', getDashboardSummary);

export default router;