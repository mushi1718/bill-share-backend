
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Expense } from "./expense.entity";
import { GroupMember } from "./group-member.entity";

@Entity()
export class ExpenseStrategyInput {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar', length: 36 })
    expense_id!: string;

    @ManyToOne(() => Expense, (expense: Expense) => expense.strategy_inputs)
    @JoinColumn({ name: "expense_id" })
    expense!: Expense;

    @Column({ type: 'varchar', length: 36 })
    member_id!: string;

    @ManyToOne(() => GroupMember)
    @JoinColumn({ name: "member_id" })
    member!: GroupMember;

    // 'PERCENTAGE' | 'AMOUNT'
    @Column({ type: 'varchar', length: 20 })
    type!: string;

    // Stores either the percentage number or the currency amount
    @Column('decimal', { precision: 10, scale: 2 })
    value!: number;

    // Optional name for Itemized entries
    @Column({ type: 'varchar', nullable: true })
    name!: string | null;
}
