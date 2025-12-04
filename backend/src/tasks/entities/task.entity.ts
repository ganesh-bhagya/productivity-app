import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from '../../common/entities/user.entity';
import { Subtask } from './subtask.entity';

export enum TaskCategory {
  WORK = 'work',
  FREELANCING = 'freelancing',
  GYM = 'gym',
  READING = 'reading',
  CLASS = 'class',
  REST = 'rest',
  MISC = 'misc',
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export enum TimeBlock {
  MORNING = 'morning',
  WORK_HOURS = 'work-hours',
  EVENING = 'evening',
  LATE_NIGHT = 'late-night',
  WEEKEND = 'weekend',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum RecurrencePattern {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  WEEKDAYS = 'weekdays',
  WEEKENDS = 'weekends',
}

@Entity('tasks')
@Index(['userId', 'date'])
@Index(['userId', 'category'])
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskCategory,
  })
  category: TaskCategory;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time', nullable: true, name: 'start_time' })
  startTime: string;

  @Column({ type: 'time', nullable: true, name: 'end_time' })
  endTime: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TimeBlock,
    name: 'time_block',
  })
  timeBlock: TimeBlock;

  @Column({ type: 'int', default: 30 })
  effort: number; // estimated minutes

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({
    type: 'enum',
    enum: RecurrencePattern,
    nullable: true,
    name: 'recurrence_pattern',
  })
  recurrencePattern: RecurrencePattern | null;

  @Column({ type: 'int', nullable: true, name: 'parent_task_id' })
  parentTaskId: number | null;

  @Column({ type: 'date', nullable: true, name: 'recurrence_end_date' })
  recurrenceEndDate: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Subtask, (subtask) => subtask.task)
  subtasks: Subtask[];
}

