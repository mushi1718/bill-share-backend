import { Router } from 'express';

import { userController } from '../controllers/user.controller';

const router = Router();

// GET /api/users/:userId/profile - Get user profile
router.get('/:userId/profile', userController.getProfile);

// PATCH /api/users/:userId/preferences - Update user preferences
router.patch('/:userId/preferences', userController.updatePreferences);

// GET /api/users/:userId/groups - Get user's groups
router.get('/:userId/groups', userController.getGroups);

export default router;


