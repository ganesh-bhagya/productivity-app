import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../common/entities/user.entity';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('weekly')
  getWeekly(@CurrentUser() user: User, @Query('week') week: string) {
    return this.statsService.getWeeklyStats(user.id, week);
  }

  @Get('habits')
  getHabits(
    @CurrentUser() user: User,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ) {
    return this.statsService.getHabitsStats(user.id, startDate, endDate);
  }

  @Get('monthly')
  getMonthly(@CurrentUser() user: User, @Query('month') month: string) {
    return this.statsService.getMonthlyStats(user.id, month);
  }
}

