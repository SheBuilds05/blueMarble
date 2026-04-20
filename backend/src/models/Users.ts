import mongoose, { Schema, Document } from 'mongoose';

const AccountSchema = new Schema({
  type: { type: String, required: true }, // e.g., 'Savings', 'Check'
  balance: { type: Number, default: 0 },
  mask: { type: String }, // e.g., '**** 1234'
});

// Interface for type safety
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  // Profile fields (left open for later editing)
  bio?: string;
  phoneNumber?: string;
  profilePic?: string;
  accounts: any[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  bio: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  profilePic: { type: String, default: "" },
  accounts: [AccountSchema],
});

export default mongoose.model<IUser>('User', UserSchema);