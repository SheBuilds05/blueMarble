import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } // In a production app, use bcrypt to hash this!
});

export default mongoose.model('User', UserSchema);