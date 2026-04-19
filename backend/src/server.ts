import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes/banking'));

function getMongoURI(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('❌ MONGODB_URI is not defined in .env file');
  }
  return uri;
}

async function connectToDatabase() {
  try {
    const MONGODB_URI = getMongoURI();
    console.log('🔄 Attempting to connect to MongoDB...');
    
    const maskedUri = MONGODB_URI.replace(/\/\/(.*)@/, '//***:***@');
    console.log(`📡 Connection string: ${maskedUri}`);

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to blueMarble DB!');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectToDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
    
    // Optional: Log collections after connection
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`📚 Available collections: ${collections.map(c => c.name).join(', ') || 'none'}`);
    }
    
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('🔌 MongoDB connection closed.');
  process.exit(0);
});

startServer();