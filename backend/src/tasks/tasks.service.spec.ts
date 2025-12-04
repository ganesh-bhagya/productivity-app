import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task, TaskStatus, TaskPriority, TaskCategory, TimeBlock, RecurrencePattern } from './entities/task.entity';
import { Subtask } from './entities/subtask.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let subtaskRepository: Repository<Subtask>;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockSubtaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(Subtask),
          useValue: mockSubtaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    subtaskRepository = module.get<Repository<Subtask>>(getRepositoryToken(Subtask));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const userId = 1;
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        category: TaskCategory.WORK,
        date: '2024-01-01',
        timeBlock: TimeBlock.MORNING,
        priority: TaskPriority.HIGH,
        effort: 60,
      };

      const mockTask = {
        id: 1,
        userId,
        ...createTaskDto,
        date: new Date(createTaskDto.date),
        status: TaskStatus.PENDING,
      };

      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask as Task);

      const result = await service.create(userId, createTaskDto);

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        userId,
        date: expect.any(Date),
      });
      expect(mockTaskRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });

    it('should create a recurring task and generate instances', async () => {
      const userId = 1;
      const createTaskDto = {
        title: 'Daily Task',
        category: TaskCategory.WORK,
        date: '2024-01-01',
        timeBlock: TimeBlock.MORNING,
        recurrencePattern: RecurrencePattern.DAILY,
        recurrenceEndDate: '2024-01-03',
        priority: TaskPriority.MEDIUM,
        effort: 30,
      };

      const mockTask = {
        id: 1,
        userId,
        ...createTaskDto,
        date: new Date(createTaskDto.date),
        recurrenceEndDate: new Date(createTaskDto.recurrenceEndDate!),
        status: TaskStatus.PENDING,
      };

      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save
        .mockResolvedValueOnce(mockTask as Task)
        .mockResolvedValueOnce([]);

      const result = await service.create(userId, createTaskDto);

      expect(mockTaskRepository.save).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const userId = 1;
      const taskId = 1;
      const mockTask = {
        id: taskId,
        userId,
        title: 'Test Task',
        subtasks: [],
      };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(userId, taskId);

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId, userId },
        relations: ['subtasks'],
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      const userId = 1;
      const taskId = 999;

      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(userId, taskId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const userId = 1;
      const taskId = 1;
      const updateDto = {
        title: 'Updated Task',
        status: TaskStatus.DONE,
      };

      const existingTask = {
        id: taskId,
        userId,
        title: 'Original Task',
        status: TaskStatus.PENDING,
      };

      const updatedTask = {
        ...existingTask,
        ...updateDto,
      };

      mockTaskRepository.findOne.mockResolvedValue(existingTask);
      mockTaskRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(userId, taskId, updateDto);

      expect(mockTaskRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
      expect(result).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      const userId = 1;
      const taskId = 1;
      const mockTask = {
        id: taskId,
        userId,
        title: 'Test Task',
      };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockTaskRepository.remove.mockResolvedValue(mockTask);

      await service.remove(userId, taskId);

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId, userId },
        relations: ['subtasks'],
      });
      expect(mockTaskRepository.remove).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('createSubtask', () => {
    it('should create a subtask successfully', async () => {
      const taskId = 1;
      const userId = 1;
      const createSubtaskDto = {
        title: 'Subtask 1',
        completed: false,
      };

      const mockTask = { id: taskId, userId, title: 'Parent Task' };
      const mockSubtask = {
        id: 1,
        taskId,
        ...createSubtaskDto,
      };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockSubtaskRepository.create.mockReturnValue(mockSubtask);
      mockSubtaskRepository.save.mockResolvedValue(mockSubtask as Subtask);

      const result = await service.createSubtask(taskId, userId, createSubtaskDto);

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(mockSubtaskRepository.create).toHaveBeenCalledWith({
        ...createSubtaskDto,
        taskId,
      });
      expect(result).toEqual(mockSubtask);
    });

    it('should throw NotFoundException if parent task not found', async () => {
      const taskId = 999;
      const userId = 1;

      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createSubtask(taskId, userId, { title: 'Subtask' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

