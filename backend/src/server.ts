import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import withdrawRoutes from './routes/withdrawals';
import profileRoutes from './routes/profile';
import buy from './routes/buy';
import notification from './routes/notifications'
import accountRoutes from './routes/accountRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- STEP 1: MIDDLEWARE (MUST COME FIRST) ---
app.use(cors({
  origin: 'http://localhost:5173', // Be specific to your Vite frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Essential for reading req.body in createAccount

// --- STEP 2: ROUTES ---
// Register accountRoutes here AFTER middleware
app.use('/api/auth', accountRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/withdraw', withdrawRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notification)
app.use('/api/buy', buy)
// 3. Database Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined in .env file');
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:', error);
  });