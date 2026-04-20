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
  accounts: [{  // ✅ Make sure this is defined
    id:{ type: String, required: true },
    name: String,
    type: String,
    balance: Number,
    accountNumber: String
  }],
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    transactionAlerts: { type: Boolean, default: true },
    language: { type: String, default: 'en' }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema, 'users');