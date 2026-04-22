import express from 'express';
import mongoose from 'mongoose';
import User from '../models/Users'; // Ensure this path matches your folder structure

const router = express.Router();

// GET /api/profile/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Validate the format of the ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID format." });
    }

    // 2. Fetch user from DB (excluding sensitive password field)
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: "User not found in database." });
    }

    // 3. Send the full document (Alice's name, email, phone, etc.)
    res.status(200).json(user);
  } catch (err) {
    console.error("Profile Route Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;