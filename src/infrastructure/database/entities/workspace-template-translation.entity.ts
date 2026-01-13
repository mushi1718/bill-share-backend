import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Template } from './workspace-template.entity';

@Entity('templates_trans')
export class TemplateTrans {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  templateId!: number;

  @Column()
  lang!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @ManyToOne(() => Template, (template) => template.translations)
  @JoinColumn({ name: 'templateId' })
  template!: Template;
}
