import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Expense } from "./expense.entity";
import { GroupMember } from "./group-member.entity";

// 分帳明細實體：記錄每一筆帳單中，某個成員「被分配到」的金額
@Entity()
export class ExpenseSplit {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar', length: 36 })
    expense_id!: string;

    @ManyToOne(() => Expense, (expense: Expense) => expense.splits)
    @JoinColumn({ name: "expense_id" })
    expense!: Expense;

    @Column({ type: 'varchar', length: 36 })
    member_id!: string;

    @ManyToOne(() => GroupMember)
    @JoinColumn({ name: "member_id" })
    member!: GroupMember;

    @Column('decimal', { precision: 10, scale: 2 })
    amount!: number;
}