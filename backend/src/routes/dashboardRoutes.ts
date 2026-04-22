import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
 
const router = Router();
router.get('/', verifyToken, getDashboardSummary);
 
export default router;