import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes'; // Adjust this path to your routes file
import withdrawRoutes from './routes/withdrawals';
import profileRoutes from './routes/profile';
import notification from './routes/notifications'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://blue-marble-three.vercel.app"
  ],
  credentials: true
}));
app.use(express.json()); // Allows reading JSON data in requests

// 2. Routes
app.get('/', (req, res) => res.status(200).send("blueMarble API is live"));
app.use('/api/withdraw', withdrawRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notification)
// 3. Database Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined in .env file');
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
    
    // 4. Start the Server ONLY after DB connects
    app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:', error);
  });
