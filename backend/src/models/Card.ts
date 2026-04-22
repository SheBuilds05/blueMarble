import mongoose, { Schema, Document } from 'mongoose';
 
export interface ICard extends Document {
  userId: mongoose.Types.ObjectId;
  cardHolder: string;
  cardNumber: string; // Stored encrypted or hashed in production
  lastFour: string;
  expiry: string;
  cvv: string;
  tier: 'Gold' | 'Platinum' | 'Black';
  status: 'Active' | 'Frozen';
  atmLimit: number;
}
 
const CardSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cardHolder: { type: String, required: true },
  cardNumber: { type: String, required: true, unique: true },
  lastFour: { type: String, required: true },
  expiry: { type: String, required: true },
  cvv: { type: String, required: true },
  tier: { type: String, enum: ['Gold', 'Platinum', 'Black'], default: 'Gold' },
  status: { type: String, enum: ['Active', 'Frozen'], default: 'Active' },
  atmLimit: { type: Number, default: 5000 }
}, { timestamps: true });
 
export default mongoose.model<ICard>('Card', CardSchema);
 