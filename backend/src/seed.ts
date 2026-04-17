import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
// Import your models
import Account from './models/Account';
import Transaction from './models/Transaction';

// 1. Force the script to look one level up from 'src' for the .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    // Log this to your terminal so you can see if it's working
    console.log("Attempting to connect with URI:", uri ? "Found (String)" : "NOT FOUND (Undefined)");

    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(uri);
    console.log("🌱 Connected to MongoDB...");

    // ... (Your seeding logic goes here)

    console.log("✅ Database Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();