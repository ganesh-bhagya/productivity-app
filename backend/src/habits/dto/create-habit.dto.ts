import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';
import { TargetType } from '../entities/habit.entity';
import { TaskCategory } from '../../tasks/entities/task.entity';

export class CreateHabitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TargetType)
  targetType: TargetType;

  @IsInt()
  @Min(1)
  targetValue: number;

  @IsEnum(TaskCategory)
  @IsOptional()
  category?: TaskCategory;
}

