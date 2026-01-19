import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { ExpenseGroup } from "./expense-group.entity";

@Entity()
export class GroupMember {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar', length: 36 })
    group_id!: string;

    @ManyToOne(() => ExpenseGroup, (group: ExpenseGroup) => group.members)
    @JoinColumn({ name: "group_id" })
    group!: ExpenseGroup;

    // Logic link to AppCenter User (No FK)
    @Column({ nullable: true })
    user_id!: string;

    // For guests or cache
    @Column({ nullable: true })
    guest_name!: string;

    @Column({ nullable: true })
    avatar_url!: string;

    @CreateDateColumn()
    created_at!: Date;
}