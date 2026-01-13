import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';
import { Workspace } from './workspace.entity';
import { App } from './app.entity';

@Entity('workspace_apps')
export class WorkspaceApp {
  @PrimaryColumn()
  workspaceId!: number;

  @PrimaryColumn()
  appId!: string;

  @Column({ default: 0 })
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Workspace, (workspace) => workspace.workspaceApps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace!: Workspace;

  @ManyToOne(() => App, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appId' })
  app!: App;
}
