import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CheckinDto } from './dto/checkin.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../common/entities/user.entity';

@Controller('habits')
@UseGuards(JwtAuthGuard)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() createHabitDto: CreateHabitDto) {
    return this.habitsService.create(user.id, createHabitDto);
  }

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query('active_only') activeOnly?: string,
  ) {
    return this.habitsService.findAll(user.id, activeOnly === 'true');
  }

  // These routes must come before @Get(':id') to ensure proper matching
  @Get(':id/checkins')
  getCheckins(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    return this.habitsService.getCheckins(user.id, id, startDate, endDate);
  }

  @Post(':id/checkin')
  checkin(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() checkinDto: CheckinDto,
  ) {
    return this.habitsService.checkin(user.id, id, checkinDto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.habitsService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitsService.update(user.id, id, updateHabitDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.habitsService.remove(user.id, id);
  }
}

