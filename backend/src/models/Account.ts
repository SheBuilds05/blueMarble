import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  owner: mongoose.Types.ObjectId;
  accountNumber: string;
  balance: number;
}

const AccountSchema: Schema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accountNumber: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 }
});

export default mongoose.model<IAccount>('Account', AccountSchema);