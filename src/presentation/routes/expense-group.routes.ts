import { Router } from 'express';
import { ExpenseGroupController } from '../controllers/expense-group.controller';
import { BalanceController } from '../controllers/balance.controller';
import { firebaseAuthMiddleware } from '../middlewares/firebase-auth.middleware';

const router = Router();
const controller = new ExpenseGroupController();
const balanceController = new BalanceController();

// POST /api/expense-groups (Protected)
router.post('/', firebaseAuthMiddleware, controller.createGroup);

// GET /api/expense-groups/:id (Public or Protected? Let's make it protected for now or optional)
router.get('/:id', firebaseAuthMiddleware, controller.getGroupDetails);

// POST /api/expense-groups/:id/members
router.post('/:id/members', firebaseAuthMiddleware, controller.addMember);

// POST /api/expense-groups/:id/expenses
router.post('/:id/expenses', firebaseAuthMiddleware, controller.addExpense);

// ===== Balance & Settlement Routes =====
// GET /api/expense-groups/:id/balances - 取得群組餘額
router.get('/:id/balances', firebaseAuthMiddleware, balanceController.getGroupBalances);

// GET /api/expense-groups/:id/settlements - 取得建議還款路徑
router.get('/:id/settlements', firebaseAuthMiddleware, balanceController.getSettlements);

// ===== CRUD: 帳務修改與刪除 =====
// PUT /api/expense-groups/:id/expenses/:expenseId - 更新帳務
router.put('/:id/expenses/:expenseId', firebaseAuthMiddleware, controller.updateExpense);

// DELETE /api/expense-groups/:id/expenses/:expenseId - 刪除帳務 (邏輯刪除)
router.delete('/:id/expenses/:expenseId', firebaseAuthMiddleware, controller.deleteExpense);

// GET /api/expense-groups/:id/expenses/:expenseId/history - 取得帳務修改歷史
router.get('/:id/expenses/:expenseId/history', firebaseAuthMiddleware, controller.getExpenseHistory);

// ===== Identity Linking: 訪客轉正 =====
// GET /api/expense-groups/:id/members/:memberId/summary - 取得成員摘要 (合併前確認)
router.get('/:id/members/:memberId/summary', firebaseAuthMiddleware, controller.getMemberSummary);

// POST /api/expense-groups/:id/members/:memberId/link - 連結訪客到會員帳號
router.post('/:id/members/:memberId/link', firebaseAuthMiddleware, controller.linkMember);

export default router;


