import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { App } from './app.entity';

@Entity('app_trans')
export class AppTranslation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  appId!: string;

  @Column()
  lang!: string;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @ManyToOne(() => App, (app) => app.translations)
  @JoinColumn({ name: 'appId' })
  app!: App;
}
