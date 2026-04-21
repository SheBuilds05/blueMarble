import mongoose, { Schema, Document } from 'mongoose';
// DELETE THIS LINE: import { User } from '../models/Users'; <--- This was the culprit!

// 1. Define the Interface
export interface IUser extends Document {
  email: string;
  password: string;
}

// 2. Define the Schema
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// 3. Create the Model
const User = mongoose.model<IUser>('User', UserSchema);

// 4. Export it so authController can use it
export default User;