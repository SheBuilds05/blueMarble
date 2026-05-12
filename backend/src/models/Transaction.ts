import mongoose, { Schema, Document } from 'mongoose';

// Interface for TypeScript type-checking
export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  beneficiaryName?: string;
  amount: number;
  reference?: string;
  type: string;
  category?: string; // e.g., 'airtime', 'electricity', 'transfer'
  status: string;    // e.g., 'completed', 'pending', 'failed'
  status: 'pending' | 'completed' | 'failed';
  date: Date;
}

// The clean Schema definition
const TransactionSchema: Schema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  beneficiaryName: { 
    type: String 
  },

  amount: { 
    type: Number, 
    required: true 
  },

  reference: { 
    type: String 
  },

  type: { 
    type: String, 
    enum: ['Payment', 'Purchase', 'Transfer', 'Deposit'],
    default: 'Payment' 
  },
  category: {
    type: String,
    required: false
  },

  // ✅ ADDED STATUS (FIX FOR YOUR ERROR)
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },

  date: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true // This automatically adds createdAt and updatedAt
});

// Export the model only once
export default mongoose.model<ITransaction>('Transaction', TransactionSchema);