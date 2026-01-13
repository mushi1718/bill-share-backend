import { Router } from 'express';
import { workspaceController } from '../controllers/workspace.controller';
import { userController } from '../controllers/user.controller';

const router = Router();

// Workspace endpoints
// GET /api/users/:userId/workspaces - Get user's workspaces
// GET /api/users/:userId/workspaces - Get user's workspaces
router.get('/:userId/workspaces', workspaceController.getWorkspaces);

// GET /api/users/:userId/profile - Get user profile
router.get('/:userId/profile', userController.getProfile);

// PATCH /api/users/:userId/preferences - Update user preferences
router.patch('/:userId/preferences', userController.updatePreferences);

// POST /api/users/:userId/workspaces - Create a workspace
router.post('/:userId/workspaces', workspaceController.createWorkspace);

// GET /api/users/workspaces/templates - Get workspace templates
router.get('/workspaces/templates', workspaceController.getWorkspaceTemplates);

// DELETE /api/workspaces/:id - Delete a workspace
router.delete('/workspaces/:id', workspaceController.deleteWorkspace);

// Workspace App endpoints
// GET /api/workspaces/:workspaceId/apps - Get apps in a workspace
router.get('/workspaces/:workspaceId/apps', workspaceController.getWorkspaceApps);

// POST /api/workspaces/:workspaceId/apps - Add an app to a workspace
router.post('/workspaces/:workspaceId/apps', workspaceController.addAppToWorkspace);

// DELETE /api/workspaces/:workspaceId/apps/:appId - Remove an app from a workspace
router.delete('/workspaces/:workspaceId/apps/:appId', workspaceController.removeAppFromWorkspace);

// PATCH /api/workspaces/:workspaceId/apps/:appId/order - Update app order
router.patch('/workspaces/:workspaceId/apps/:appId/order', workspaceController.updateAppOrder);

export default router;


