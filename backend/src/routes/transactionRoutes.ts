import express from 'express';
import { getTransactions } from '../controllers/transactionController';

const router = express.Router();

router.get('/history', getTransactions);

export default router;