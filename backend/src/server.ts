import express from 'express';
import mongoose from 'mongoose';
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