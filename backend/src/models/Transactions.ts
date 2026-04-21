import mongoose, { Schema, Document } from 'mongoose';

// 1. The Interface: This tells TypeScript what a Transaction looks like in our code
export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  description: string;
  category: 'Groceries' | 'Rent' | 'Salary' | 'Entertainment' | 'Other';
  date: Date;
}

// 2. The Schema: This tells MongoDB how to store the data
const TransactionSchema: Schema = new Schema({
  // Linking this transaction to a specific User from your Users model
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['deposit', 'withdraw', 'transfer'], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Groceries', 'Rent', 'Salary', 'Entertainment', 'Other'], 
    default: 'Other' 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
});

// 3. Export the model
export default mongoose.model<ITransaction>('Transaction', TransactionSchema);