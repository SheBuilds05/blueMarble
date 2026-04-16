import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchase extends Document {
  userId: mongoose.Types.ObjectId;
  category: 'airtime' | 'electricity' | 'voucher';
  provider: string;
  amount: number;
  details: {
    phoneNumber?: string;
    meterNumber?: string;
    email?: string;
    voucherCode?: string;
  };
  status: 'pending' | 'completed' | 'failed';
  transactionId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['airtime', 'electricity', 'voucher'], required: true },
  provider: { type: String, required: true },
  amount: { type: Number, required: true },
  details: {
    phoneNumber: String,
    meterNumber: String,
    email: String,
    voucherCode: String
  },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPurchase>('Purchase', PurchaseSchema);