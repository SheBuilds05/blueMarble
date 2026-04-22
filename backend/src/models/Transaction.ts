import mongoose, { Schema, Document } from 'mongoose';

// Interface for TypeScript type-checking
export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  beneficiaryName?: string;
  amount: number;
  reference?: string;
  type: string;
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
    default: 'Payment' 
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
  timestamps: true 
});

// Export the model only once
export default mongoose.model<ITransaction>('Transaction', TransactionSchema);