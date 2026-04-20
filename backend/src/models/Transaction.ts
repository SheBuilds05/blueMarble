import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: string; // 👈 Add this here too
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
}

// backend/src/models/Transaction.ts

const TransactionSchema: Schema = new Schema({
  userId: { type: String, required: true }, // 👈 NEW FIELD
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);