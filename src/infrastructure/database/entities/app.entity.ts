import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AppTranslation } from './app-translation.entity';
import { WorkspaceApp } from './workspace-app.entity';

@Entity('apps')
export class App {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  url!: string;

  @Column()
  category!: string;

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  iconUrl?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ default: 0 })
  order!: number;

  @Column({ name: 'isGlobal', default: false })
  isGlobal!: boolean;

  @Column({ nullable: true })
  name?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => AppTranslation, (translation) => translation.app, {
    cascade: true
  })
  translations!: AppTranslation[];

  @OneToMany(() => WorkspaceApp, (workspaceApp) => workspaceApp.app)
  workspaceApps!: WorkspaceApp[];


}
