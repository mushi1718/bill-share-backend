import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { GroupMember } from "./group-member.entity";
import { Expense } from "./expense.entity";

@Entity()
export class ExpenseGroup {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ default: 'TWD' })
    currency!: string;

    @CreateDateColumn()
    created_at!: Date;

    @OneToMany(() => GroupMember, (member: GroupMember) => member.group)
    members!: GroupMember[];

    @OneToMany(() => Expense, (expense: Expense) => expense.group)
    expenses!: Expense[];
}