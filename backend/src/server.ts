import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import withdrawRoutes from './routes/withdrawals';
import profileRoutes from './routes/profile';
import buy from './routes/buy';
import notification from './routes/notifications';
import accountRoutes from './routes/accountRoutes';
import cardRoutes from './routes/cardRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed frontend URLs
const allowedOrigins = [
  'http://localhost:5173',
  'https://blue-marble-three.vercel.app',
  'https://bluemarble-frontend10-nokulungaokuhle43-dev.apps.rm1.0a51.p1.openshiftapps.com'
];

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests like Postman or server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors());
app.use(express.json());

// ROUTES
app.use('/api/auth', accountRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/withdraw', withdrawRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notifications', notification);
app.use('/api/buy', buy);
app.use('/api/cards', cardRoutes);

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined in .env file');
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:', error);
  });
