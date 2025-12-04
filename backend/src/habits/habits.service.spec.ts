import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitsService } from './habits.service';
import { Habit, TargetType } from './entities/habit.entity';
import { HabitCheckin } from './entities/habit-checkin.entity';
import { NotFoundException } from '@nestjs/common';

describe('HabitsService', () => {
  let service: HabitsService;
  let habitRepository: Repository<Habit>;
  let checkinRepository: Repository<HabitCheckin>;

  const mockHabitRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  const mockCheckinRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabitsService,
        {
          provide: getRepositoryToken(Habit),
          useValue: mockHabitRepository,
        },
        {
          provide: getRepositoryToken(HabitCheckin),
          useValue: mockCheckinRepository,
        },
      ],
    }).compile();

    service = module.get<HabitsService>(HabitsService);
    habitRepository = module.get<Repository<Habit>>(getRepositoryToken(Habit));
    checkinRepository = module.get<Repository<HabitCheckin>>(
      getRepositoryToken(HabitCheckin),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a habit successfully', async () => {
      const userId = 1;
      const createHabitDto = {
        name: 'Daily Exercise',
        description: 'Exercise for 30 minutes',
        targetType: TargetType.DAILY,
        targetValue: 1,
      };

      const mockHabit = {
        id: 1,
        userId,
        ...createHabitDto,
        active: true,
      };

      mockHabitRepository.create.mockReturnValue(mockHabit);
      mockHabitRepository.save.mockResolvedValue(mockHabit as Habit);

      const result = await service.create(userId, createHabitDto);

      expect(mockHabitRepository.create).toHaveBeenCalledWith({
        ...createHabitDto,
        userId,
      });
      expect(mockHabitRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockHabit);
    });
  });

  describe('checkin', () => {
    it('should create a check-in successfully', async () => {
      const userId = 1;
      const habitId = 1;
      const checkinDto = {
        date: '2024-01-01',
        value: 1,
        notes: 'Did it!',
      };

      const mockHabit = {
        id: habitId,
        userId,
        name: 'Daily Exercise',
      };

      const mockCheckin = {
        id: 1,
        habitId,
        userId,
        ...checkinDto,
        date: new Date(checkinDto.date),
      };

      mockHabitRepository.findOne.mockResolvedValue(mockHabit);
      mockCheckinRepository.findOne.mockResolvedValue(null);
      mockCheckinRepository.create.mockReturnValue(mockCheckin);
      mockCheckinRepository.save.mockResolvedValue(mockCheckin as HabitCheckin);

      const result = await service.checkin(userId, habitId, checkinDto);

      expect(mockCheckinRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockCheckin);
    });

    it('should throw NotFoundException if habit not found', async () => {
      const userId = 1;
      const habitId = 999;

      mockHabitRepository.findOne.mockResolvedValue(null);

      await expect(
        service.checkin(userId, habitId, { date: '2024-01-01' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCheckins', () => {
    it('should return check-ins with streak calculation', async () => {
      const userId = 1;
      const habitId = 1;
      const startDate = '2024-01-01';
      const endDate = '2024-01-07';

      const mockHabit = {
        id: habitId,
        userId,
        name: 'Daily Exercise',
      };

      const mockCheckins = [
        {
          id: 1,
          habitId,
          userId,
          date: new Date('2024-01-07'),
          value: 1,
        },
        {
          id: 2,
          habitId,
          userId,
          date: new Date('2024-01-06'),
          value: 1,
        },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockCheckins),
      };

      mockHabitRepository.findOne.mockResolvedValue(mockHabit);
      mockCheckinRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getCheckins(userId, habitId, startDate, endDate);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'checkin.habitId = :habitId',
        { habitId },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'checkin.date BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
      expect(result.checkins).toEqual(mockCheckins);
      expect(result.streak).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateStreak', () => {
    it('should return 0 for empty check-ins', () => {
      const streak = (service as any).calculateStreak([]);
      expect(streak).toBe(0);
    });

    it('should calculate streak correctly for consecutive days', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const checkins = [
        { date: today, value: 1 },
        { date: yesterday, value: 1 },
      ] as HabitCheckin[];

      const streak = (service as any).calculateStreak(checkins);
      expect(streak).toBeGreaterThanOrEqual(1);
    });
  });
});

