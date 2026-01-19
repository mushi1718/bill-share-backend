import { Router } from 'express';
import { ExpenseGroupController } from '../controllers/expense-group.controller';
import { firebaseAuthMiddleware } from '../middlewares/firebase-auth.middleware';

const router = Router();
const controller = new ExpenseGroupController();

// POST /api/expense-groups (Protected)
router.post('/', firebaseAuthMiddleware, controller.createGroup);

// GET /api/expense-groups/:id (Public or Protected? Let's make it protected for now or optional)
router.get('/:id', firebaseAuthMiddleware, controller.getGroupDetails);

// POST /api/expense-groups/:id/members
router.post('/:id/members', firebaseAuthMiddleware, controller.addMember);

// POST /api/expense-groups/:id/expenses
router.post('/:id/expenses', firebaseAuthMiddleware, controller.addExpense);

export default router;
