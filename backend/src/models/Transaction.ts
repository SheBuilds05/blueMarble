import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  accountId: mongoose.Types.ObjectId;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  date: Date;
}

const TransactionSchema: Schema = new Schema({
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['INCOME', 'EXPENSE'], required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);