import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { WorkspaceApp } from './workspace-app.entity';

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: string;

  @Column()
  name!: string;  // 'life', 'work', or custom name

  @Column({ nullable: true })
  icon?: string;

  @Column({ default: 0 })
  order!: number;

  @Column({ default: false })
  isDefault!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => WorkspaceApp, (workspaceApp) => workspaceApp.workspace)
  workspaceApps!: WorkspaceApp[];
}
