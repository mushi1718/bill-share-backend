import { Router } from 'express';
import { appController } from '../controllers/app.controller';

const router = Router();

router.get('/', appController.getAllApps);
router.get('/:id', appController.getAppById);
router.post('/', appController.createApp);
router.patch('/:id', appController.updateApp);

export default router;
