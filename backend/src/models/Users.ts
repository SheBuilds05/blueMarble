import mongoose, { Schema, Document } from 'mongoose';

// 1. Define the Interface for Beneficiaries
export interface IBeneficiary {
  name: string;
  type: 'bank' | 'cell' | 'payshap' | 'company'; 
  detail: string; 
  initials: string;
  lastPaid: Date;
}

// 2. Define the Interface for the User
export interface IUser extends Document {
  firstName: string;
  surname: string;
  email: string;
  idNumber: string;
  phone: string;
  password: string;
  registerCode: string;
  phone?: string;
  balance: number;
  accounts: Array<{
    id: string;
    name: string;
    type: 'savings' | 'cheque' | 'investment';
    balance: number;
    accountNumber: string;
  }>;
  preferences: {
    emailNotifications: boolean;
    transactionAlerts: boolean;
    language: string;
  };
  createdAt: Date;
}
 
const UserSchema = new Schema<IUser>({
  balance: number;
  registerCode?: string;
  isRegistered: boolean; // Added this to the interface
  beneficiaries: IBeneficiary[]; 
  createdAt: Date;
}

// 3. Define the Sub-Schema for Beneficiaries
const beneficiarySchema = new Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['bank', 'cell', 'payshap', 'company'], 
    default: 'bank',
    required: true 
  },
  detail: { type: String, required: true }, 
  initials: { type: String },
  lastPaid: { type: Date, default: Date.now }
});

// Automatically generate initials (e.g., "Khensani M" -> "KM")
// Using any for 'this' context in the hook to avoid TS issues with subdocuments
beneficiarySchema.pre('save', async function() {
  const doc = this as any;
  if (doc.name) {
    const names = doc.name.trim().split(/\s+/);
    const initials = names.map((n: string) => n[0]).join('').toUpperCase();
    doc.initials = initials.substring(0, 2); 
  }
});

// 4. Define the Main User Schema
const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  idNumber: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  registerCode: { type: String, required: true },
  phone: String,
  balance: { type: Number, default: 1000 },
  accounts: [{
    _id: false, // 👈 Prevents Mongoose from looking for a sub-doc _id
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    balance: { type: Number, default: 0 },
    accountNumber: { type: String }
  }],
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    transactionAlerts: { type: Boolean, default: true },
    language: { type: String, default: 'en' }
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  strict: true // Ensures Mongoose only allows defined fields
});
 
// Explicitly export and map to the 'users' collection
export default mongoose.model<IUser>('User', UserSchema, 'users');
  balance: { type: Number, default: 0 },
  registerCode: { type: String },
  isRegistered: { type: Boolean, default: false },
  accountNumber: { type: String },
  cardNumber: { type: String },
  expiryDate: { type: String },
  cvv: { type: String },
  // Link the array of sub-documents
  beneficiaries: [beneficiarySchema] 

}, { timestamps: true });

// 5. Export the Model
export default mongoose.model<IUser>('User', UserSchema);
