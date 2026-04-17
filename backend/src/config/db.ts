import mongoose from 'mongoose';

// src/config/db.ts
export const connectDB = async () => {
  try {
    const uri = "your_actual_mongodb_connection_string_here"; 
    const conn = await mongoose.connect(uri);
    console.log(`✅ Blue Marble DB Connected`);
  } catch (error) {
    // ...
  }
};