import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../common/entities/user.entity';
import { TemplateBlock } from './template-block.entity';

export enum DayType {
  WEEKDAY = 'weekday',
  WEEKEND = 'weekend',
  CUSTOM = 'custom',
}

@Entity('routine_templates')
@Index(['userId', 'dayType'])
export class RoutineTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number | null;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: DayType,
    name: 'day_type',
  })
  dayType: DayType;

  @Column({ name: 'is_global', default: false })
  isGlobal: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.templates, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @OneToMany(() => TemplateBlock, (block) => block.template, { cascade: true })
  blocks: TemplateBlock[];
}

