import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Habit } from '../../habits/entities/habit.entity';
import { HabitCheckin } from '../../habits/entities/habit-checkin.entity';
import { RoutineTemplate } from '../../templates/entities/routine-template.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ default: 'Asia/Colombo' })
  timezone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Habit, (habit) => habit.user)
  habits: Habit[];

  @OneToMany(() => HabitCheckin, (checkin) => checkin.user)
  habitCheckins: HabitCheckin[];

  @OneToMany(() => RoutineTemplate, (template) => template.user)
  templates: RoutineTemplate[];
}

