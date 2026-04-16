import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount {
  id: string;              // '1', '2', '3'
  name: string;            // 'Main Savings', 'Everyday Cheque', 'Investment Portfolio'
  type: 'savings' | 'cheque' | 'investment';
  balance: number;
  accountNumber: string;   // 'SAV-****-1234'
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  registerCode: string;
  phone?: string;
  accounts: IAccount[];    // ← multiple accounts
  preferences: {
    emailNotifications: boolean;
    transactionAlerts: boolean;
    language: string;
  };
  createdAt: Date;
}

const AccountSchema = new Schema<IAccount>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['savings', 'cheque', 'investment'], required: true },
  balance: { type: Number, default: 0 },
  accountNumber: { type: String, required: true }
});

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registerCode: { type: String, required: true },
  phone: { type: String },
  accounts: [AccountSchema],   // embedded array
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    transactionAlerts: { type: Boolean, default: true },
    language: { type: String, default: 'en' }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);