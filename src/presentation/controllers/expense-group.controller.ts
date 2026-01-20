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
}