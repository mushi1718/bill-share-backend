import { BillShareDataSource } from "../../infrastructure/config/bill-share-data-source";
import { ExpenseGroup } from "../../infrastructure/database/entities/expense-group.entity";
import { GroupMember } from "../../infrastructure/database/entities/group-member.entity";
import { Expense } from "../../infrastructure/database/entities/expense.entity";
import { ExpenseSplit } from "../../infrastructure/database/entities/expense-split.entity";
import { v4 as uuidv4 } from 'uuid';

export class ExpenseGroupService {
    private groupRepo = BillShareDataSource.getRepository(ExpenseGroup);
    private memberRepo = BillShareDataSource.getRepository(GroupMember);
    private expenseRepo = BillShareDataSource.getRepository(Expense);

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
            // 4. 處理分帳明細 (Splits)
            splits: splits.map(s => {
                const split = new ExpenseSplit();
                split.member_id = s.memberId;
                split.amount = s.amount;
                return split;
            })
        });

        // 儲存帳務 (Cascading 會一併儲存 Splits)
        return await this.expenseRepo.save(expense);
    }

    // 取得群組詳細資料 (包含成員、帳務、以及分帳細節)
    async getGroupDetails(groupId: string): Promise<ExpenseGroup | null> {
        return await this.groupRepo.findOne({
            where: { id: groupId },
            relations: ["members", "expenses", "expenses.splits", "expenses.payer"]
        });
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
}