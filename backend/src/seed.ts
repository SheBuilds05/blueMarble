import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Transaction } from './models/Transaction';

// IMPORTANT: Only one config call is needed, and it must point to the root folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGO_URI; // Matches your .env variable name
    
    console.log("Attempting to connect with URI:", uri ? "Found (String)" : "NOT FOUND (Undefined)");

    if (!uri) {
      // Updated error message to match the variable we are checking
      throw new Error("MONGO_URI is not defined in .env file");
    }

    await mongoose.connect(uri);
    console.log("🌱 Connected to MongoDB...");

    // 1. Clear existing data to avoid duplicates
    await Transaction.deleteMany({});

    // 2. Insert dummy data
    await Transaction.insertMany([
      {
        userId: new mongoose.Types.ObjectId(), // Replace with a real User ID if necessary
        beneficiaryName: "Checkers Hyper",
        amount: 450.00,
        reference: "Groceries",
        type: "Purchase",
        status: "completed",
        date: new Date()
      },
      {
        userId: new mongoose.Types.ObjectId(),
        beneficiaryName: "Company Salary",
        amount: 15000.00,
        reference: "SALARY MAY",
        type: "Deposit",
        status: "completed",
        date: new Date()
      }
    ]);

    console.log("✅ Database Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();