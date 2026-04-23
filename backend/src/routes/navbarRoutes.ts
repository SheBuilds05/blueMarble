import { Router } from 'express';
import { getNavbarData } from '../controllers/navbarController.js';
const router = Router();

// GET: /api/navbar
router.get('/', getNavbarData);

export default router;