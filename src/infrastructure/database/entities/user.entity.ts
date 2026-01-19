import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true, nullable: true })
  firebaseUid!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column('json', { nullable: true })
  preferences?: {
    allowMove?: boolean;
    // can extend for theme/lang if needed later
    theme?: string;
    language?: string;
  };

  @Column({ default: false })
  isPro!: boolean;
}
