import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();



function getMongoURI(): string {

const uri = process.env.MONGODB_URI;

 if (!uri) {

throw new Error('❌ MONGODB_URI is not defined in .env file');

}

 return uri;

}



async function testDatabaseConnection() {

 try {

const MONGODB_URI = getMongoURI();

console.log('🔄 Attempting to connect to MongoDB...');

const maskedUri = MONGODB_URI.replace(/\/\/(.*)@/, '//***:***@');

console.log(`📡 Connection string: ${maskedUri}`);



await mongoose.connect(MONGODB_URI);

console.log('✅ Successfully connected to MongoDB!');


if (mongoose.connection.db) {

const collections = await mongoose.connection.db.listCollections().toArray();

console.log(`📚 Collections: ${collections.map(c => c.name).join(', ') || 'none'}`);

 }


await mongoose.disconnect();

console.log('🔌 Connection closed.');

 process.exit(0);

} catch (error) {

console.error('❌ Failed:', error);

 process.exit(1);
 }

}

testDatabaseConnection();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
<<<<<<< HEAD
import User from './models/Users'; 
import withdrawRoutes from './routes/withdrawals';
import profileRoutes from './routes/profile';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes'; // Adjust this path to your routes file
=======

// Import your route files
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import transferRoutes from './routes/transfer';
import buyRoutes from './routes/buy';
import notificationRoutes from './routes/notifications';
>>>>>>> sibongokuhle

dotenv.config();

const app = express();
<<<<<<< HEAD
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
=======

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
>>>>>>> sibongokuhle
