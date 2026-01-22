import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Expense } from "./expense.entity";

/**
 * 帳務修改日誌實體
 * 記錄每一筆帳務的新增、修改、刪除歷史
 */
@Entity()
export class ExpenseLog {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar', length: 36 })
    expense_id!: string;

    @ManyToOne(() => Expense)
    @JoinColumn({ name: "expense_id" })
    expense!: Expense;

    @Column({ type: 'varchar', length: 20 })
    action!: 'CREATE' | 'UPDATE' | 'DELETE';

    @Column({ type: 'varchar', length: 36, nullable: true })
    changed_by!: string; // memberId 或 userId

    @Column('json', { nullable: true })
    previous_data!: Record<string, any> | null;

    @Column('json', { nullable: true })
    new_data!: Record<string, any> | null;

    @Column({ type: 'text', nullable: true })
    change_reason?: string;

    @CreateDateColumn()
    created_at!: Date;
}
