import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config(); // This MUST be called before you try to use any process.env variables
// backend/src/index.ts
import { connectDB } from './config/db';
import accountRoutes from './routes/accountRoutes';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Apply the routes
app.use('/api/accounts', accountRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Blue Marble Server on port ${PORT}`));