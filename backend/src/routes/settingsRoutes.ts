import { Router } from 'express';
// Change 'updateProfile' to 'updateUserSettings' here
import { getUserSettings, updateUserSettings } from '../controllers/settingsController.js';

const router = Router();

// GET: /api/settings
router.get('/', getUserSettings);

// PUT: /api/settings
// Change updateProfile to updateUserSettings here
router.put('/', updateUserSettings);

export default router;