import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { ExpenseGroup } from "./expense-group.entity";
import { GroupMember } from "./group-member.entity";
import { ExpenseSplit } from "./expense-split.entity";

@Entity()
export class Expense {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar', length: 36 })
    group_id!: string;

    @ManyToOne(() => ExpenseGroup, (group: ExpenseGroup) => group.expenses)
    @JoinColumn({ name: "group_id" })
    group!: ExpenseGroup;

    @Column({ type: 'varchar', length: 36 })
    payer_member_id!: string;

    @ManyToOne(() => GroupMember)
    @JoinColumn({ name: "payer_member_id" })
    payer!: GroupMember;

    @Column('decimal', { precision: 10, scale: 2 })
    amount!: number;

    @Column({ type: 'varchar', length: 20, default: 'GENERAL' })
    category!: string; // 'GENERAL' | 'SETTLEMENT'

    @Column()
    description!: string;

    @CreateDateColumn()
    date!: Date;

    @OneToMany(() => ExpenseSplit, (split: ExpenseSplit) => split.expense, { cascade: true })
    splits!: ExpenseSplit[];
}