import { Router } from 'express';
import User from '../models/Users.js'; // Import User instead of Card

const router = Router();

// GET: Fetch the user's card info
router.get('/', async (req, res) => {
  try {
    // For now, we fetch by the email you showed. 
    // In a real app, use req.user.id from your auth middleware.
    const user = await User.findOne({ email: "malwela@gmail.com" });
    
    if (!user) return res.status(404).json({ message: "User not found" });

    // The frontend expects an ARRAY of cards. 
    // We wrap the user object in an array so the frontend doesn't crash.
    res.json([user]); 
  } catch (err) {
    res.status(500).json({ message: "Server error fetching card data" });
  }
});

// PATCH: Update the limit inside the User document
router.patch('/:id/limits', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { atmLimit: req.body.atmLimit }, // Ensure 'atmLimit' exists in your User Schema!
      { new: true }
    );
    
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Database update error" });
  }
});

export default router;
