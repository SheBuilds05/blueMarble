import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import transferRoutes from './routes/transfer';
import buyRoutes from './routes/buy';
import notificationRoutes from './routes/notifications';

dotenv.config();

const app = express();

// CORS
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health check (kept for convenience)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend running' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transfer', transferRoutes);
app.use('/api/buy', buyRoutes);
app.use('/api/notifications', notificationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));