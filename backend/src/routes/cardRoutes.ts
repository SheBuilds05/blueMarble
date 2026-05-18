import { Router } from 'express';
// Remove .js extension - TypeScript handles this automatically
import User from '../models/Users';

const router = Router();

// GET: Fetch the user's card info
router.get('/', async (req, res) => {
  try {
    const user = await User.findOne({ email: "malwela@gmail.com" });
    
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json([user]); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching card data" });
  }
});

// PATCH: Update the limit inside the User document
router.patch('/:id/limits', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { atmLimit: req.body.atmLimit },
      { new: true }
    );
    
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Database update error" });
  }
});

export default router;