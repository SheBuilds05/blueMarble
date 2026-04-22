import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware';  // ✅ Correct path
import Notification from '../models/Notification';

const router = Router();

// GET all notifications for the logged-in user
router.get('/', verifyToken, async (req: any, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Mark a notification as read
router.patch('/:id/read', verifyToken, async (req: any, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId },
      { read: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

// Delete a notification
router.delete('/:id', verifyToken, async (req: any, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    await Notification.findOneAndDelete({ _id: req.params.id, userId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete notification' });
  }
});

// Mark all as read
router.post('/mark-all-read', verifyToken, async (req: any, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    await Notification.updateMany({ userId, read: false }, { read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark all as read' });
  }
});

export default router;