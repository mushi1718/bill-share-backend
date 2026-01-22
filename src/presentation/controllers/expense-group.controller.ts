import { Request, Response } from 'express';
import { ExpenseGroupService } from '../../application/services/expense-group.service';

export class ExpenseGroupController {
    private service: ExpenseGroupService;

    constructor() {
        this.service = new ExpenseGroupService();
    }

    // 建立群組 API (POST /api/expense-groups)
    createGroup = async (req: Request, res: Response) => {
        try {
            const { name, currency } = req.body;
            const group = await this.service.createGroup(name, currency);
            res.status(201).json(group);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 加入成員 API (POST /api/expense-groups/:id/members)
    addMember = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, userId, avatarUrl } = req.body;
            const member = await this.service.addMember(id, name, userId, avatarUrl);
            res.status(201).json(member);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 新增帳務 API (POST /api/expense-groups/:id/expenses)
    addExpense = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { payerMemberId, amount, description, splits, category } = req.body;
            const expense = await this.service.addExpense(id, payerMemberId, amount, description, splits, category);
            res.status(201).json(expense);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 取得群組詳細資料 API (GET /api/expense-groups/:id)
    getGroupDetails = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const group = await this.service.getGroupDetails(id);
            if (!group) {
                return res.status(404).json({ error: "Group not found" });
            }
            res.json(group);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // ===== CRUD: 更新帳務 =====
    // PUT /api/expense-groups/:id/expenses/:expenseId
    updateExpense = async (req: Request, res: Response) => {
        try {
            const { expenseId } = req.params;
            const { amount, description, payerMemberId, splits, expectedVersion } = req.body;
            const changedBy = (req as any).user?.uid || 'anonymous';

            const expense = await this.service.updateExpense(
                expenseId,
                { amount, description, payerMemberId, splits },
                changedBy,
                expectedVersion
            );
            res.json({ success: true, data: expense });
        } catch (error: any) {
            if (error.message.includes('Version conflict')) {
                return res.status(409).json({ success: false, error: error.message });
            }
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // ===== CRUD: 刪除帳務 (邏輯刪除) =====
    // DELETE /api/expense-groups/:id/expenses/:expenseId
    deleteExpense = async (req: Request, res: Response) => {
        try {
            const { expenseId } = req.params;
            const { reason } = req.body;
            const changedBy = (req as any).user?.uid || 'anonymous';

            await this.service.deleteExpense(expenseId, changedBy, reason);
            res.json({ success: true, message: 'Expense deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // ===== CRUD: 取得帳務修改歷史 =====
    // GET /api/expense-groups/:id/expenses/:expenseId/history
    getExpenseHistory = async (req: Request, res: Response) => {
        try {
            const { expenseId } = req.params;
            const history = await this.service.getExpenseHistory(expenseId);
            res.json({ success: true, data: history });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // ===== Identity Linking: 取得成員摘要 =====
    // GET /api/expense-groups/:id/members/:memberId/summary
    getMemberSummary = async (req: Request, res: Response) => {
        try {
            const { memberId } = req.params;
            const summary = await this.service.getMemberSummary(memberId);
            res.json({ success: true, data: summary });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // ===== Identity Linking: 連結訪客到會員帳號 =====
    // POST /api/expense-groups/:id/members/:memberId/link
    linkMember = async (req: Request, res: Response) => {
        try {
            const { memberId } = req.params;
            const { userId } = req.body;
            const linkedBy = (req as any).user?.uid || 'anonymous';

            if (!userId) {
                return res.status(400).json({ success: false, error: 'userId is required' });
            }

            const member = await this.service.linkMemberToUser(memberId, userId, linkedBy);
            res.json({ success: true, data: member });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
