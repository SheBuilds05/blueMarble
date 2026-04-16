import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'deposit' | 'withdraw' | 'transfer' | 'purchase';
  amount: number;
  description?: string;
  fromAccount?: string;
  toAccount?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit', 'withdraw', 'transfer', 'purchase'], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  fromAccount: { type: String },
  toAccount: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);