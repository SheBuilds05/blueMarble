import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  registerCode: string;
  phone?: string;
  balance: number;
  accounts: Array<{
    id: string;
    name: string;
    type: 'savings' | 'cheque' | 'investment';
    balance: number;
    accountNumber: string;
  }>;
  preferences: {
    emailNotifications: boolean;
    transactionAlerts: boolean;
    language: string;
  };
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registerCode: { type: String, required: true },
  phone: String,
  balance: { type: Number, default: 1000 },
  accounts: [{
    _id: false, // 👈 Prevents Mongoose from looking for a sub-doc _id
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    balance: { type: Number, default: 0 },
    accountNumber: { type: String }
  }],
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    transactionAlerts: { type: Boolean, default: true },
    language: { type: String, default: 'en' }
  },
  createdAt: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  strict: true // Ensures Mongoose only allows defined fields
});

// Explicitly export and map to the 'users' collection
export default mongoose.model<IUser>('User', UserSchema, 'users');