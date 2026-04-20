import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import your route files
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import transferRoutes from './routes/transfer';
import buyRoutes from './routes/buy';
import notificationRoutes from './routes/notifications';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend running' });
});

// ============================================
// CARD ROUTES (your existing ones)
// ============================================

const cardSchema = new mongoose.Schema({
  cardHolder: { type: String, default: "Deolyn East" },
  cardNumber: String,
  lastFour: String,
  expiry: String,
  cvv: String,
  tier: { type: String, default: "Platinum Member" },
  status: { type: String, default: 'active' },
  atmLimit: { type: Number, default: 5000 },
}, { collection: 'cards' });

const Card = mongoose.model('Card', cardSchema);

app.get('/api/cards', async (req, res) => {
  const cards = await Card.find({});
  res.json(cards);
});

app.post('/api/cards', async (req, res) => {
  try {
    const { cardNumber, expiry, cvv } = req.body;
    const newCard = new Card({
      cardHolder: "Deolyn East",
      cardNumber,
      lastFour: cardNumber.slice(-4),
      expiry,
      cvv,
      tier: "Platinum Member"
    });
    const saved = await newCard.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Database save failed" });
  }
});

app.patch('/api/cards/:id/toggle-status', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Not found" });
    card.status = card.status === 'active' ? 'frozen' : 'active';
    await card.save();
    res.json(card);
  } catch (err) { 
    res.status(500).send("Error"); 
  }
});

app.patch('/api/cards/:id/limit', async (req, res) => {
  const updated = await Card.findByIdAndUpdate(req.params.id, { atmLimit: req.body.limit }, { new: true });
  res.json(updated);
});

// ============================================
// AUTH & USER ROUTES (ADD THESE)
// ============================================

// Mount your authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transfer', transferRoutes);
app.use('/api/buy', buyRoutes);
app.use('/api/notifications', notificationRoutes);

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📌 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📌 Login endpoint: POST http://localhost:${PORT}/api/auth/login`);
        console.log(`📚 Connected to database: ${mongoose.connection.name}`);
  console.log(`📚 Collections:`, mongoose.connection.collections);
    });
  })
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));