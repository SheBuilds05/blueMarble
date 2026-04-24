import mongoose, { Schema, Document } from 'mongoose';

// 1. Define the Interface for Beneficiaries
export interface IBeneficiary {
  name: string;
  type: 'bank' | 'cell' | 'payshap' | 'company'; 
  detail: string; 
  initials: string;
  lastPaid: Date;
}

// 2. Define the Interface for the User (merged from both versions)
export interface IUser extends Document {
  // From version 1
  firstName: string;
  surname: string;
  idNumber: string;
  
  // From version 2 (added optional phone from version 2's optional definition)
  name?: string; // Made optional as version 1 uses firstName+surname
  phone?: string; // Merged optional from version 2
  
  // Common fields (both versions)
  email: string;
  password: string;
  registerCode: string;
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
  
  // Version 1 specific fields
  isRegistered: boolean;
  beneficiaries: IBeneficiary[];
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
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
beneficiarySchema.pre('save', async function() {
  const doc = this as any;
  if (doc.name) {
    const names = doc.name.trim().split(/\s+/);
    const initials = names.map((n: string) => n[0]).join('').toUpperCase();
    doc.initials = initials.substring(0, 2); 
  }
});

// 4. Define the Main User Schema (merged from both versions)
const UserSchema: Schema = new Schema({
  // From version 1
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  
  // From version 2 (optional field)
  name: { type: String }, // Made optional to maintain backward compatibility
  
  // Common fields
  email: { 
    type: String, 
    unique: true, 
    sparse: true, 
    default: null 
  },
  password: { type: String, required: true },
  registerCode: { type: String, required: true },
  phone: { type: String }, // Merged from version 2 (optional)
  
  // From version 1
  balance: { type: Number, default: 1000 },
  accounts: [{
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
  createdAt: { type: Date, default: Date.now },
  
  // Version 1 specific fields
  isRegistered: { type: Boolean, default: false },
  cardNumber: { type: String },
  expiryDate: { type: String },
  cvv: { type: String },
  address: { type: String },
  employment: { type: String },
  beneficiaries: [beneficiarySchema]
  
}, { 
  timestamps: true,
  strict: true
});

// 5. Export the Model
export default mongoose.model<IUser>('User', UserSchema, 'users');