import { Router } from 'express';
import { getCards, toggleCardStatus } from '../controllers/cardController.js';
const router = Router();

// GET: http://localhost:5000/api/cards
router.get('/', getCards);

// PATCH: http://localhost:5000/api/cards/:cardId/status
router.patch('/:cardId/status', toggleCardStatus);

export default router;