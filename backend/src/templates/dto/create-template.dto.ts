import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayType } from '../entities/routine-template.entity';
import { TimeBlock } from '../../tasks/entities/task.entity';

class TemplateBlockDto {
  @IsEnum(TimeBlock)
  timeBlock: TimeBlock;

  @IsArray()
  defaultTasks: Array<{
    title: string;
    category: string;
    effort?: number;
    startTime?: string;
    endTime?: string;
  }>;
}

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(DayType)
  dayType: DayType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateBlockDto)
  blocks: TemplateBlockDto[];
}

