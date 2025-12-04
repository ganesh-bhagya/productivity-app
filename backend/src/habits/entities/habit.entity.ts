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
import { HabitCheckin } from './habit-checkin.entity';
import { TaskCategory } from '../../tasks/entities/task.entity';

export enum TargetType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

@Entity('habits')
@Index(['userId', 'active'])
export class Habit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TargetType,
    name: 'target_type',
  })
  targetType: TargetType;

  @Column({ type: 'int', name: 'target_value' })
  targetValue: number; // e.g., 3 for "3x per week", 1 for "daily"

  @Column({
    type: 'enum',
    enum: TaskCategory,
    nullable: true,
  })
  category: TaskCategory | null;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.habits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => HabitCheckin, (checkin) => checkin.habit)
  checkins: HabitCheckin[];
}

