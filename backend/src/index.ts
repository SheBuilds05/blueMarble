import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import accountRoutes from './routes/accountRoutes';
// 1. IMPORT the missing routes (adjust name if your file is different)
import transactionRoutes from './routes/transactionRoutes'; 

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// 2. ROUTE REGISTRATION
app.use('/api/accounts', accountRoutes);
// THIS IS THE FIX: Link the /api/transactions path to your logic
app.use('/api/transactions', transactionRoutes); 

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Blue Marble Server on port ${PORT}`));