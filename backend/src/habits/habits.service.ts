import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Habit } from './entities/habit.entity';
import { HabitCheckin } from './entities/habit-checkin.entity';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CheckinDto } from './dto/checkin.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private habitRepository: Repository<Habit>,
    @InjectRepository(HabitCheckin)
    private checkinRepository: Repository<HabitCheckin>,
  ) {}

  async create(userId: number, createHabitDto: CreateHabitDto): Promise<Habit> {
    const habit = this.habitRepository.create({
      ...createHabitDto,
      userId,
    });

    return this.habitRepository.save(habit);
  }

  async findAll(userId: number, activeOnly = false): Promise<Habit[]> {
    const where: any = { userId };
    if (activeOnly) {
      where.active = true;
    }

    return this.habitRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: number, id: number): Promise<Habit> {
    const habit = await this.habitRepository.findOne({
      where: { id, userId },
      relations: ['checkins'],
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found`);
    }

    return habit;
  }

  async update(
    userId: number,
    id: number,
    updateHabitDto: UpdateHabitDto,
  ): Promise<Habit> {
    const habit = await this.findOne(userId, id);
    Object.assign(habit, updateHabitDto);
    return this.habitRepository.save(habit);
  }

  async remove(userId: number, id: number): Promise<void> {
    const habit = await this.findOne(userId, id);
    await this.habitRepository.remove(habit);
  }

  async checkin(
    userId: number,
    habitId: number,
    checkinDto: CheckinDto,
  ): Promise<HabitCheckin> {
    // Verify habit exists and belongs to user
    await this.findOne(userId, habitId);

    // Check if check-in already exists for this date
    const existing = await this.checkinRepository.findOne({
      where: {
        habitId,
        date: new Date(checkinDto.date),
      },
    });

    if (existing) {
      // Update existing check-in
      existing.value = checkinDto.value ?? 1;
      existing.notes = checkinDto.notes;
      return this.checkinRepository.save(existing);
    }

    // Create new check-in
    const checkin = this.checkinRepository.create({
      habitId,
      userId,
      date: new Date(checkinDto.date),
      value: checkinDto.value ?? 1,
      notes: checkinDto.notes,
    });

    return this.checkinRepository.save(checkin);
  }

  async getCheckins(
    userId: number,
    habitId: number,
    startDate?: string,
    endDate?: string,
  ): Promise<{ checkins: HabitCheckin[]; streak: number }> {
    await this.findOne(userId, habitId);

    const queryBuilder = this.checkinRepository
      .createQueryBuilder('checkin')
      .where('checkin.habitId = :habitId', { habitId })
      .andWhere('checkin.userId = :userId', { userId });

    if (startDate && endDate) {
      queryBuilder.andWhere('checkin.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    queryBuilder.orderBy('checkin.date', 'DESC');

    const checkins = await queryBuilder.getMany();

    // Calculate current streak
    const streak = this.calculateStreak(checkins);

    return { checkins, streak };
  }

  /**
   * Calculate the current streak for a habit.
   * A streak is consecutive days with check-ins, counting backwards from today.
   */
  private calculateStreak(checkins: HabitCheckin[]): number {
    if (checkins.length === 0) return 0;

    // Helper function to normalize date (handle both Date objects and strings)
    const normalizeDate = (date: Date | string): Date => {
      const d = date instanceof Date ? date : new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    // Sort checkins by date (most recent first)
    const sorted = [...checkins].sort((a, b) => {
      const dateA = normalizeDate(a.date);
      const dateB = normalizeDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    let streak = 0;
    const today = normalizeDate(new Date());

    // Check if there's a check-in today or yesterday
    const mostRecentDate = normalizeDate(sorted[0].date);

    const daysDiff = Math.floor(
      (today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // If most recent check-in is more than 1 day ago, streak is broken
    if (daysDiff > 1) return 0;

    // Start counting from the most recent check-in
    let expectedDate = new Date(mostRecentDate);
    let checkinIndex = 0;

    while (checkinIndex < sorted.length) {
      const checkinDate = normalizeDate(sorted[checkinIndex].date);

      if (checkinDate.getTime() === expectedDate.getTime()) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
        checkinIndex++;
      } else if (checkinDate.getTime() < expectedDate.getTime()) {
        // Gap found, streak broken
        break;
      } else {
        // This check-in is older than expected, skip it
        checkinIndex++;
      }
    }

    return streak;
  }
}

