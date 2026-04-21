import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/Users'; 
import withdrawRoutes from './routes/withdrawals';
import profileRoutes from './routes/profile';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes'; // Adjust this path to your routes file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. MIDDLEWARE
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// 2. DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Connection Error:', err));

// 3. ROUTES
app.use('/api/withdraw', withdrawRoutes);
app.use('/api/profile', profileRoutes);
// AUTH: Login using registerCode
app.post('/api/auth/login', async (req, res) => {
  const { email, registerCode } = req.body; // Changed from password to registerCode
  try {
    const user = await User.findOne({ email });

    // Verify user exists and the code matches
    if (user && user.registerCode === registerCode) {
      console.log(`✅ ${user.name} logged in successfully.`);
      res.status(200).json({ 
        message: "Login success", 
        userId: user._id 
      });
    } else {
      res.status(401).json({ error: "Invalid email or registration code" });
    }
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// ACCOUNTS: Fetch with ID Validation
app.get('/api/accounts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid session ID. Please log in again." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json(user.accounts);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
