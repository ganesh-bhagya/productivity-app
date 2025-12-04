import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../../common/entities/user.entity';
import { Habit } from './habit.entity';

@Entity('habit_checkins')
@Unique(['habitId', 'date']) // @Unique already creates an index, so we don't need @Index for the same columns
@Index(['userId', 'date'])
export class HabitCheckin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'habit_id' })
  habitId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int', default: 1 })
  value: number; // for tracking intensity or count

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Habit, (habit) => habit.checkins, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habit_id' })
  habit: Habit;

  @ManyToOne(() => User, (user) => user.habitCheckins, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

