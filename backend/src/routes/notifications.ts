import { Router } from 'express';
import authMiddleware from '../middleware/auth';
import Notification from '../models/Notification';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  const { filter = 'all' } = req.query;
  let query: any = { userId: (req as any).userId };
  if (filter === 'unread') query.read = false;
  else if (filter === 'read') query.read = true;

  const notifications = await Notification.find(query).sort({ createdAt: -1 });
  const unreadCount = await Notification.countDocuments({ userId: (req as any).userId, read: false });
  res.json({ notifications, total: notifications.length, unreadCount });
});

router.patch('/:id/read', authMiddleware, async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: (req as any).userId },
    { read: true }
  );
  res.json({ success: true });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, userId: (req as any).userId });
  res.json({ success: true });
});

router.post('/mark-all-read', authMiddleware, async (req, res) => {
  await Notification.updateMany({ userId: (req as any).userId, read: false }, { read: true });
  res.json({ success: true });
});

export default router;