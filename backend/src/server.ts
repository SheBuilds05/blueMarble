import express from 'express';
import mongoose from 'mongoose';
<<<<<<< HEAD
import cors from 'cors';
import dotenv from 'dotenv';
 
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
 
// Database connection to OpenBankDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ Connected to OpenBankDB'))
  .catch((err) => console.error('❌ Connection Error:', err));
 
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
 
// GET: Fetch all cards
app.get('/api/cards', async (req, res) => {
  const cards = await Card.find({});
  res.json(cards);
});
 
// POST: Save manual card entry
app.post('/api/cards', async (req, res) => {
  try {
    const { cardNumber, expiry, cvv } = req.body;
    const newCard = new Card({
      cardHolder: "Deolyn East",
      cardNumber,
      lastFour: cardNumber.slice(-4), // Extracts last 4 digits for display
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
 
// PATCH: Toggle Freeze status
app.patch('/api/cards/:id/toggle-status', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Not found" });
    card.status = card.status === 'active' ? 'frozen' : 'active';
    await card.save();
    res.json(card);
  } catch (err) { res.status(500).send("Error"); }
});
 
// PATCH: Update ATM Limit
app.patch('/api/cards/:id/limit', async (req, res) => {
  const updated = await Card.findByIdAndUpdate(req.params.id, { atmLimit: req.body.limit }, { new: true });
  res.json(updated);
});
 
app.listen(5000, () => console.log('🚀 Server running on port 5000'));
=======
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
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
