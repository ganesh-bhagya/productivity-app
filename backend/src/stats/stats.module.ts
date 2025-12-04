import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { Task } from '../tasks/entities/task.entity';
import { Habit } from '../habits/entities/habit.entity';
import { HabitCheckin } from '../habits/entities/habit-checkin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Habit, HabitCheckin])],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}

