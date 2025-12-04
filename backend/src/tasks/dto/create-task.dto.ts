import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { TaskCategory, TaskStatus, TimeBlock, TaskPriority, RecurrencePattern } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskCategory)
  category: TaskCategory;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TimeBlock)
  timeBlock: TimeBlock;

  @IsInt()
  @Min(1)
  @Max(1440)
  @IsOptional()
  effort?: number;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsEnum(RecurrencePattern)
  @IsOptional()
  recurrencePattern?: RecurrencePattern;

  @IsDateString()
  @IsOptional()
  recurrenceEndDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

