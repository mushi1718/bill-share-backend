import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TemplateTrans } from './workspace-template-translation.entity';

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;


  @Column({ nullable: true })
  icon!: string;

  @Column('json')
  appIds!: string[];

  @OneToMany(() => TemplateTrans, (translation) => translation.template, {
    cascade: true
  })
  translations!: TemplateTrans[];
}
