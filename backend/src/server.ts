import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Get variables from .env
const mongoURI = process.env.mongodb+srv://nokulungabembe_db_user:<db_password>@nokulunga.sd4uyzj.mongodb.net/OpenBankDB?appName=nokulunga || '';
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to blueMarble MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});