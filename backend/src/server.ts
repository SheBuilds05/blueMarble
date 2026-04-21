// backend/scripts/test-db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testDatabaseConnection() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error('MONGODB_URI not defined');
    
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected!');
    
    const collections = await mongoose.connection.db?.listCollections().toArray();
    console.log(`📚 Collections: ${collections?.map(c => c.name).join(', ') || 'none'}`);
    
    await mongoose.disconnect();
    console.log('🔌 Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

testDatabaseConnection();