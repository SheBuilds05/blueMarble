import mongoose, { Schema, Document } from 'mongoose';

// 1. ENSURE THERE ARE NO IMPORTS FROM './models/Transaction' HERE

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  beneficiaryName: string;
  amount: number;
  reference: string;
  type: string;
  status: string;
  date: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  beneficiaryName: { type: String, required: true },
  amount: { type: Number, required: true },
  reference: { type: String, required: true },
  type: { type: String, enum: ['Payment', 'Purchase', 'Transfer', 'Deposit'], default: 'Payment' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  date: { type: Date, default: Date.now }
});

// 2. THIS IS A NAMED EXPORT
export const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);