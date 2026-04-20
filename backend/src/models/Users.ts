import mongoose, { Schema, Document } from 'mongoose';

// 1. Define an Interface for the User
export interface IUser extends Document {
  firstName: string;
  surname: string;
  email: string;
  idNumber: string;
  phone: string;
  password: string;
  balance: number;
  registerCode?: string; // Optional field
  createdAt: Date;
}

// 2. Define the Schema
const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  idNumber: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  registerCode: { type: String },
}, { timestamps: true });


// Example of how your Schema could look for multiple accounts
accounts: [
  {
    accountType: String, // 'Savings', 'Cheque'
    balance: Number,
    accountNumber: String
  }
]
// 3. Export the Model
export default mongoose.model<IUser>('User', UserSchema);