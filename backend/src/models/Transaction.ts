import mongoose, { Schema, Document } from 'mongoose';

// Interface for TypeScript type-checking
export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  beneficiaryName: string;
  amount: number;
  reference: string;
  type: string;
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
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  reference: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    default: 'Payment' 
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