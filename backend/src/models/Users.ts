import mongoose, { Schema, Document } from 'mongoose';

// 1. Define the Interface for Beneficiaries
export interface IBeneficiary {
  name: string;
  // Added 'type' to distinguish between Bank, Cell, etc.
  type: 'bank' | 'cell' | 'payshap' | 'company'; 
  detail: string; // This stores the Acc Number, Cell, or ShapID
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
  balance: number;
  registerCode?: string;
  beneficiaries: IBeneficiary[]; 
  createdAt: Date;
}

// 3. Define the Sub-Schema for Beneficiaries
const beneficiarySchema = new Schema({
  name: { type: String, required: true },
  // Added type with restricted options
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

// Automatically generate initials (e.g., "Ntsako Manganye" -> "NM")
beneficiarySchema.pre('save', function() {
  if (this.name) {
    const names = this.name.trim().split(/\s+/);
    const initials = names.map(n => n[0]).join('').toUpperCase();
    this.initials = initials.substring(0, 2); 
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
  balance: { type: Number, default: 0 },
  registerCode: { type: String },
  
  // Link the array of sub-documents
  beneficiaries: [beneficiarySchema] 

}, { timestamps: true });

// 5. Export the Model
export default mongoose.model<IUser>('User', UserSchema);