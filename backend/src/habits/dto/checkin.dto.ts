import { IsDateString, IsInt, Min, IsOptional, IsString } from 'class-validator';

export class CheckinDto {
  @IsDateString()
  date: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  value?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

