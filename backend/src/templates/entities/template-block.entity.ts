import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { RoutineTemplate } from './routine-template.entity';
import { TimeBlock } from '../../tasks/entities/task.entity';

@Entity('template_blocks')
export class TemplateBlock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'template_id' })
  templateId: number;

  @Column({
    type: 'enum',
    enum: TimeBlock,
    name: 'time_block',
  })
  timeBlock: TimeBlock;

  @Column({
    type: 'json',
    name: 'default_tasks',
  })
  defaultTasks: Array<{
    title: string;
    category: string;
    effort?: number;
    startTime?: string;
    endTime?: string;
  }>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => RoutineTemplate, (template) => template.blocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'template_id' })
  template: RoutineTemplate;
}

