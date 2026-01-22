import { BillShareDataSource } from "../../infrastructure/config/bill-share-data-source";
import { ExpenseGroup } from "../../infrastructure/database/entities/expense-group.entity";
import { GroupMember } from "../../infrastructure/database/entities/group-member.entity";
import { Expense } from "../../infrastructure/database/entities/expense.entity";
import { ExpenseSplit } from "../../infrastructure/database/entities/expense-split.entity";
import { ExpenseLog } from "../../infrastructure/database/entities/expense-log.entity";
import { v4 as uuidv4 } from 'uuid';
import { BalanceService } from "./balance.service";

export class ExpenseGroupService {
    private groupRepo = BillShareDataSource.getRepository(ExpenseGroup);
    private memberRepo = BillShareDataSource.getRepository(GroupMember);
    private expenseRepo = BillShareDataSource.getRepository(Expense);
    private splitRepo = BillShareDataSource.getRepository(ExpenseSplit);
    private logRepo = BillShareDataSource.getRepository(ExpenseLog);
    private balanceService = new BalanceService();

    // 建立一個新的分帳群組
    async createGroup(name: string, currency: string = 'TWD'): Promise<ExpenseGroup> {
        const group = this.groupRepo.create({
            name,
            currency
        });
        return await this.groupRepo.save(group);
    }

    // 新增群組成員 (可以是已註冊的使用者，也可以是單純的訪客名稱)
    async addMember(groupId: string, name: string, userId?: string, avatarUrl?: string): Promise<GroupMember> {
        const group = await this.groupRepo.findOneBy({ id: groupId });
        if (!group) {
            throw new Error("Group not found");
        }

        const member = this.memberRepo.create({
            group,
            guest_name: name,
            user_id: userId, // 邏輯上關聯到 AppCenter 的 User ID
            avatar_url: avatarUrl
        });

        return await this.memberRepo.save(member);
    }

    // 新增一筆帳務紀錄 (包含總金額、付款人、以及分帳細節)
    async addExpense(groupId: string, payerMemberId: string, amount: number, description: string, splits: { memberId: string, amount: number }[], category: string = 'GENERAL'): Promise<Expense> {
        // 1. 驗證群組是否存在
        const group = await this.groupRepo.findOneBy({ id: groupId });
        if (!group) throw new Error("Group not found");

        // 2. 驗證付款人是否存在
        const payer = await this.memberRepo.findOneBy({ id: payerMemberId });
        if (!payer) throw new Error("Payer not found");

        // 3. 建立帳務實體
        const expense = this.expenseRepo.create({
            group,
            payer,
            payer_member_id: payerMemberId,
            amount,
            description,
            category,
            is_deleted: false,
            version: 1,
            // 4. 處理分帳明細 (Splits)
            splits: splits.map(s => {
                const split = new ExpenseSplit();
                split.member_id = s.memberId;
                split.amount = s.amount;
                return split;
            })
        });

        // 儲存帳務 (Cascading 會一併儲存 Splits)
        const savedExpense = await this.expenseRepo.save(expense);

        // 記錄建立日誌
        await this.createLog(savedExpense.id, 'CREATE', payerMemberId, null, this.expenseToJson(savedExpense));

        return savedExpense;
    }

    // ===== CRUD: 更新帳務 =====
    async updateExpense(
        expenseId: string,
        data: { amount?: number; description?: string; payerMemberId?: string; splits?: { memberId: string, amount: number }[] },
        changedBy: string,
        expectedVersion?: number
    ): Promise<Expense> {
        const expense = await this.expenseRepo.findOne({
            where: { id: expenseId, is_deleted: false },
            relations: ["splits"]
        });

        if (!expense) throw new Error("Expense not found or deleted");

        // 樂觀鎖檢查
        if (expectedVersion !== undefined && expense.version !== expectedVersion) {
            throw new Error(`Version conflict: expected ${expectedVersion}, got ${expense.version}`);
        }

        const previousData = this.expenseToJson(expense);

        // 更新欄位
        if (data.amount !== undefined) expense.amount = data.amount;
        if (data.description !== undefined) expense.description = data.description;
        if (data.payerMemberId !== undefined) expense.payer_member_id = data.payerMemberId;

        // 更新分帳明細
        if (data.splits) {
            // 刪除舊的 splits
            await this.splitRepo.delete({ expense_id: expenseId });

            // 建立新的 splits
            expense.splits = data.splits.map(s => {
                const split = new ExpenseSplit();
                split.expense_id = expenseId;
                split.member_id = s.memberId;
                split.amount = s.amount;
                return split;
            });
        }

        // 增加版本號
        expense.version += 1;

        const savedExpense = await this.expenseRepo.save(expense);

        // 記錄更新日誌
        await this.createLog(expenseId, 'UPDATE', changedBy, previousData, this.expenseToJson(savedExpense));

        return savedExpense;
    }

    // ===== CRUD: 刪除帳務 (邏輯刪除) =====
    async deleteExpense(expenseId: string, changedBy: string, reason?: string): Promise<void> {
        const expense = await this.expenseRepo.findOne({
            where: { id: expenseId, is_deleted: false },
            relations: ["splits"]
        });

        if (!expense) throw new Error("Expense not found or already deleted");

        const previousData = this.expenseToJson(expense);

        // 邏輯刪除
        expense.is_deleted = true;
        expense.version += 1;

        await this.expenseRepo.save(expense);

        // 記錄刪除日誌
        await this.createLog(expenseId, 'DELETE', changedBy, previousData, null, reason);
    }

    // ===== CRUD: 取得帳務修改歷史 =====
    async getExpenseHistory(expenseId: string): Promise<ExpenseLog[]> {
        return await this.logRepo.find({
            where: { expense_id: expenseId },
            order: { created_at: 'DESC' }
        });
    }

    // 取得群組詳細資料 (包含成員、帳務、以及分帳細節)
    async getGroupDetails(groupId: string): Promise<ExpenseGroup | null> {
        const group = await this.groupRepo.findOne({
            where: { id: groupId },
            relations: ["members", "expenses", "expenses.splits", "expenses.payer"]
        });

        if (group && group.expenses) {
            // 過濾掉已刪除的帳務
            group.expenses = group.expenses.filter(e => !e.is_deleted);
        }

        return group;
    }

    // 根據 UserID 查找他參與的所有群組
    async getGroupsByUserId(userId: string): Promise<ExpenseGroup[]> {
        // 因為沒有直接關聯 (No FK)，我們必須先找出該 User 參與的所有 Member 實體
        const members = await this.memberRepo.find({
            where: { user_id: userId },
            relations: ["group"]
        });
        // 再從 Member 實體中取出 Group
        return members.map(m => m.group);
    }

    // ===== Identity Linking: 取得成員摘要 (合併前確認) =====
    async getMemberSummary(memberId: string): Promise<{
        member: GroupMember;
        balance: number;
        expenseCount: number;
        totalPaid: number;
        totalOwed: number;
    }> {
        const member = await this.memberRepo.findOne({
            where: { id: memberId },
            relations: ["group"]
        });

        if (!member) throw new Error("Member not found");

        // 取得該成員在群組中的餘額
        const balances = await this.balanceService.getGroupBalances(member.group_id);
        const memberBalance = balances.find(b => b.memberId === memberId);

        // 計算該成員參與的帳務數量
        const expenseCount = await this.expenseRepo.count({
            where: [
                { payer_member_id: memberId, is_deleted: false }
            ]
        });

        const splitCount = await this.splitRepo.count({
            where: { member_id: memberId }
        });

        return {
            member,
            balance: memberBalance?.balance || 0,
            expenseCount: expenseCount + splitCount,
            totalPaid: memberBalance?.totalPaid || 0,
            totalOwed: memberBalance?.totalOwed || 0
        };
    }

    // ===== Identity Linking: 連結訪客到會員帳號 =====
    async linkMemberToUser(guestMemberId: string, userId: string, linkedBy: string): Promise<GroupMember> {
        const member = await this.memberRepo.findOneBy({ id: guestMemberId });

        if (!member) throw new Error("Member not found");

        // 驗證是否為訪客帳號（沒有 user_id）
        if (member.user_id) {
            throw new Error("Member is already linked to a user account");
        }

        // 更新 user_id
        const previousUserId = member.user_id;
        member.user_id = userId;

        const savedMember = await this.memberRepo.save(member);

        // 記錄連結動作 (使用特殊的 log)
        // 這裡我們建立一個虛擬的 expense log 來記錄此動作
        // 或者可以考慮建立獨立的 MemberLog 表格
        console.log(`[LINK] Member ${guestMemberId} linked to user ${userId} by ${linkedBy}`);

        return savedMember;
    }

    // ===== Helper: 建立日誌 =====
    private async createLog(
        expenseId: string,
        action: 'CREATE' | 'UPDATE' | 'DELETE',
        changedBy: string,
        previousData: Record<string, any> | null,
        newData: Record<string, any> | null,
        reason?: string
    ): Promise<ExpenseLog> {
        const log = this.logRepo.create({
            expense_id: expenseId,
            action,
            changed_by: changedBy,
            previous_data: previousData,
            new_data: newData,
            change_reason: reason
        });
        return await this.logRepo.save(log);
    }

    // ===== Helper: 將 Expense 轉換為 JSON =====
    private expenseToJson(expense: Expense): Record<string, any> {
        return {
            id: expense.id,
            group_id: expense.group_id,
            payer_member_id: expense.payer_member_id,
            amount: expense.amount,
            description: expense.description,
            category: expense.category,
            version: expense.version,
            splits: expense.splits?.map(s => ({
                member_id: s.member_id,
                amount: s.amount
            }))
        };
    }
}
