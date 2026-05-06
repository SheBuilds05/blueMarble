import mongoose from 'mongoose';

// src/config/db.ts
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || '');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error}`);
    // Don't use process.exit(1) here while debugging, 
    // so the server stays up even if the DB is down.
  }
};