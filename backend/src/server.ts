import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes
import authRoutes from './routes/authRoutes';
import withdrawRoutes from './routes/withdrawals';
import profileRoutes from './routes/profile';
import notificationRoutes from './routes/notifications';
import buyRoutes from './routes/buy'; // ✅ ADDED

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ====================
// 1. MIDDLEWARE
// ====================
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://blue-marble-three.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ====================
// 2. ROUTES
// ====================

// Optional: Root route (prevents "Cannot GET /")
app.get('/', (req, res) => {
  res.send('🚀 BlueMarble API is running...');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/withdraw', withdrawRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/buy', buyRoutes); // ✅ FIXED (was missing)

// ====================
// 3. DATABASE CONNECTION
// ====================
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined in .env file');
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');

    // ====================
    // 4. START SERVER
    // ====================
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:', error);
  });
