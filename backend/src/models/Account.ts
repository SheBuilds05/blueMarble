import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  accountNumber: string;
  accountType: string;
  balance: number;
  cardDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardStatus: 'Active' | 'Blocked' | 'Inactive';
  };
  createdAt: Date;
}

const AccountSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accountNumber: { type: String, unique: true, required: true },
  accountType: { type: String, default: 'Savings' },
  balance: { type: Number, default: 0 },
  cardDetails: {
    cardNumber: { type: String, unique: true },
    expiryDate: { type: String },
    cvv: { type: String },
    cardStatus: { type: String, enum: ['Active', 'Blocked', 'Inactive'], default: 'Active' }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAccount>('Account', AccountSchema);