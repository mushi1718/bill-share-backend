import { BillShareDataSource } from "../../infrastructure/config/bill-share-data-source";
import { ExpenseGroup } from "../../infrastructure/database/entities/expense-group.entity";
import { Expense } from "../../infrastructure/database/entities/expense.entity";
import { GroupMember } from "../../infrastructure/database/entities/group-member.entity";

// ===== 類型定義 =====

/** 成員餘額資訊 */
export interface MemberBalance {
    memberId: string;
    memberName: string;
    balance: number; // 正數=應收, 負數=應付
    totalPaid: number; // 總代墊金額
    totalOwed: number; // 總應付金額
}

/** 原始債務關係 */
export interface DebtRelation {
    from: string;       // 欠款人 memberId
    fromName: string;
    to: string;         // 債權人 memberId
    toName: string;
    amount: number;
}

/** 溯源項目 */
export interface TraceItem {
    expenseId: string;
    description: string;
    originalFrom: string;
    originalFromName: string;
    originalTo: string;
    originalToName: string;
    amount: number;
    date: Date;
}

/** 優化後的轉帳建議 (含溯源) */
export interface OptimizedTransfer extends DebtRelation {
    traces: TraceItem[];
}

/** 結算建議完整回應 */
export interface SettlementResult {
    originalDebts: DebtRelation[];
    optimizedTransfers: OptimizedTransfer[];
    summary: {
        originalTransactionCount: number;
        optimizedTransactionCount: number;
        savedTransactions: number;
    };
}

export class BalanceService {
    private groupRepo = BillShareDataSource.getRepository(ExpenseGroup);
    private expenseRepo = BillShareDataSource.getRepository(Expense);
    private memberRepo = BillShareDataSource.getRepository(GroupMember);

    /**
     * 計算群組內每位成員的餘額
     * 餘額 = 總代墊金額 - 總應付金額
     * 正數表示應收款，負數表示應付款
     */
    async getGroupBalances(groupId: string): Promise<MemberBalance[]> {
        // 取得群組與所有成員
        const group = await this.groupRepo.findOne({
            where: { id: groupId },
            relations: ["members"]
        });

        if (!group) {
            throw new Error("Group not found");
        }

        // 取得所有未刪除的帳務 (含分帳明細)
        const expenses = await this.expenseRepo.find({
            where: {
                group_id: groupId,
                // is_deleted: false  // 待 entity 更新後啟用
            },
            relations: ["splits", "payer"]
        });

        // 建立成員名稱對照表
        const memberMap = new Map<string, GroupMember>();
        for (const member of group.members) {
            memberMap.set(member.id, member);
        }

        // 計算每位成員的代墊與應付金額
        const balanceMap = new Map<string, { paid: number; owed: number }>();

        // 初始化所有成員
        for (const member of group.members) {
            balanceMap.set(member.id, { paid: 0, owed: 0 });
        }

        // 遍歷所有帳務
        for (const expense of expenses) {
            // 付款人增加代墊金額
            const payerBalance = balanceMap.get(expense.payer_member_id);
            if (payerBalance) {
                payerBalance.paid += Number(expense.amount);
            }

            // 每個分帳成員增加應付金額
            for (const split of expense.splits) {
                const memberBalance = balanceMap.get(split.member_id);
                if (memberBalance) {
                    memberBalance.owed += Number(split.amount);
                }
            }
        }

        // 組裝結果
        const results: MemberBalance[] = [];
        for (const [memberId, data] of balanceMap) {
            const member = memberMap.get(memberId);
            results.push({
                memberId,
                memberName: member?.guest_name || member?.user_id || 'Unknown',
                balance: Number((data.paid - data.owed).toFixed(2)),
                totalPaid: Number(data.paid.toFixed(2)),
                totalOwed: Number(data.owed.toFixed(2))
            });
        }

        return results;
    }

    /**
     * 計算最少轉帳次數的還款建議，並附帶溯源資料
     * 使用貪婪演算法：每次讓最大債權人與最大債務人結算
     */
    async getOptimizedSettlements(groupId: string): Promise<SettlementResult> {
        // 取得群組成員
        const group = await this.groupRepo.findOne({
            where: { id: groupId },
            relations: ["members"]
        });

        if (!group) {
            throw new Error("Group not found");
        }

        // 建立成員名稱對照表
        const memberMap = new Map<string, GroupMember>();
        for (const member of group.members) {
            memberMap.set(member.id, member);
        }

        const getMemberName = (id: string) => {
            const m = memberMap.get(id);
            return m?.guest_name || m?.user_id || 'Unknown';
        };

        // 取得所有帳務
        const expenses = await this.expenseRepo.find({
            where: {
                group_id: groupId,
            },
            relations: ["splits", "payer"]
        });

        // ===== 步驟 1: 建立原始債務關係 =====
        // 每筆帳務中，非付款人需要還給付款人
        const originalDebts: DebtRelation[] = [];
        const traceMap = new Map<string, TraceItem[]>(); // key: "from->to"

        for (const expense of expenses) {
            const payerId = expense.payer_member_id;

            for (const split of expense.splits) {
                // 跳過付款人自己的分帳部分
                if (split.member_id === payerId) continue;

                const amount = Number(split.amount);
                if (amount <= 0) continue;

                const debtKey = `${split.member_id}->${payerId}`;

                // 記錄原始債務
                originalDebts.push({
                    from: split.member_id,
                    fromName: getMemberName(split.member_id),
                    to: payerId,
                    toName: getMemberName(payerId),
                    amount
                });

                // 建立溯源資料
                const trace: TraceItem = {
                    expenseId: expense.id,
                    description: expense.description,
                    originalFrom: split.member_id,
                    originalFromName: getMemberName(split.member_id),
                    originalTo: payerId,
                    originalToName: getMemberName(payerId),
                    amount,
                    date: expense.date
                };

                if (!traceMap.has(debtKey)) {
                    traceMap.set(debtKey, []);
                }
                traceMap.get(debtKey)!.push(trace);
            }
        }

        // ===== 步驟 2: 計算淨餘額 =====
        const balances = await this.getGroupBalances(groupId);

        // 分離債權人(正餘額)與債務人(負餘額)
        const creditors: { id: string; name: string; amount: number }[] = [];
        const debtors: { id: string; name: string; amount: number }[] = [];

        for (const b of balances) {
            if (b.balance > 0.01) {
                creditors.push({ id: b.memberId, name: b.memberName, amount: b.balance });
            } else if (b.balance < -0.01) {
                debtors.push({ id: b.memberId, name: b.memberName, amount: -b.balance });
            }
        }

        // ===== 步驟 3: 貪婪演算法 - 最少轉帳次數 =====
        const optimizedTransfers: OptimizedTransfer[] = [];

        // 排序：金額大的優先處理
        creditors.sort((a, b) => b.amount - a.amount);
        debtors.sort((a, b) => b.amount - a.amount);

        let i = 0, j = 0;
        while (i < creditors.length && j < debtors.length) {
            const creditor = creditors[i];
            const debtor = debtors[j];

            const settleAmount = Math.min(creditor.amount, debtor.amount);

            if (settleAmount > 0.01) {
                // 收集相關的溯源資料
                const relatedTraces: TraceItem[] = [];

                // 找出所有從 debtor 流向 creditor 的原始債務
                const directKey = `${debtor.id}->${creditor.id}`;
                if (traceMap.has(directKey)) {
                    relatedTraces.push(...traceMap.get(directKey)!);
                }

                // 如果是間接債務（經過其他人），也收集相關溯源
                // 這裡簡化處理：列出 debtor 的所有欠款和 creditor 的所有應收
                for (const [key, traces] of traceMap) {
                    if (key.startsWith(`${debtor.id}->`) && !relatedTraces.some(t => t.expenseId === traces[0]?.expenseId)) {
                        relatedTraces.push(...traces);
                    }
                }

                optimizedTransfers.push({
                    from: debtor.id,
                    fromName: debtor.name,
                    to: creditor.id,
                    toName: creditor.name,
                    amount: Number(settleAmount.toFixed(2)),
                    traces: relatedTraces.slice(0, 10) // 限制溯源數量避免過多
                });
            }

            // 更新餘額
            creditor.amount -= settleAmount;
            debtor.amount -= settleAmount;

            // 移動指標
            if (creditor.amount < 0.01) i++;
            if (debtor.amount < 0.01) j++;
        }

        return {
            originalDebts,
            optimizedTransfers,
            summary: {
                originalTransactionCount: originalDebts.length,
                optimizedTransactionCount: optimizedTransfers.length,
                savedTransactions: originalDebts.length - optimizedTransfers.length
            }
        };
    }
}
