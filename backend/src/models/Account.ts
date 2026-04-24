import mongoose, { Schema, Document } from 'mongoose';

// 1. Update the Interface to match the Schema exactly
export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  accountNumber: string;
  type: string; // Changed from accountType to match frontend
  balance: number;
  color: string; // Added to match Schema
  cardDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardStatus: 'Active' | 'Blocked' | 'Inactive';
  };
  createdAt: Date;
  mask?: string; // Virtual field
}

const AccountSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accountNumber: { type: String, unique: true },
  // This matches your frontend 'acc.type'
  type: { type: String, default: 'Savings' }, 
  balance: { type: Number, default: 0 },
  cardDetails: {
    cardNumber: { type: String, unique: true },
    expiryDate: { type: String },
    cvv: { type: String },
    cardStatus: { type: String, enum: ['Active', 'Blocked', 'Inactive'], default: 'Active' }
  },
  // This matches your frontend 'acc.color'
  color: { type: String, default: 'from-blue-600 to-blue-800' }, 
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 2. Virtual for 'mask' - your frontend 'acc.mask' depends on this
AccountSchema.virtual('mask').get(function(this: IAccount) {
  if (this.cardDetails && this.cardDetails.cardNumber) {
    return `**** **** **** ${this.cardDetails.cardNumber.slice(-4)}`;
  }
  return '**** **** **** 0000';
});

// 3. Pre-validate hook for auto-generating details
AccountSchema.pre('validate', function (this: any) {
  // 1. Generate Account Number (10 digits)
  if (!this.accountNumber) {
    this.accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  // 2. Generate Card Details
  if (!this.cardDetails || !this.cardDetails.cardNumber) {
    const cardNum = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
    const now = new Date();
    const expiryMonth = String(now.getMonth() + 1).padStart(2, '0');
    const expiryYear = String(now.getFullYear() + 5).slice(-2);
    const cvv = Math.floor(100 + Math.random() * 899).toString();

    this.cardDetails = {
      cardNumber: cardNum,
      expiryDate: `${expiryMonth}/${expiryYear}`,
      cvv: cvv,
      cardStatus: 'Active'
    };
  }
  // Remove next(); Mongoose handles this automatically for synchronous hooks
});

export default mongoose.model<IAccount>('Account', AccountSchema);