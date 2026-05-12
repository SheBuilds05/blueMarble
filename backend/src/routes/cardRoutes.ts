import { Router } from 'express';
import { getCards, toggleCardStatus } from '../controllers/cardController.js';
const router = Router();

router.get('/', getCards);
router.patch('/:cardId/status', toggleCardStatus);

export default router;