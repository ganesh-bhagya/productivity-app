import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskStatus, TaskCategory, TimeBlock, TaskPriority } from './entities/task.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createSubtask: jest.fn(),
    updateSubtask: jest.fn(),
    removeSubtask: jest.fn(),
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        category: TaskCategory.WORK,
        date: '2024-01-01',
        timeBlock: TimeBlock.MORNING,
        priority: TaskPriority.MEDIUM,
        effort: 30,
      };

      const mockTask = {
        id: 1,
        userId: mockUser.id,
        ...createTaskDto,
        status: TaskStatus.PENDING,
      };

      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create(mockUser as any, createTaskDto);

      expect(service.create).toHaveBeenCalledWith(mockUser.id, createTaskDto);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return tasks with filters', async () => {
      const mockTasks = [
        {
          id: 1,
          userId: mockUser.id,
          title: 'Task 1',
          category: TaskCategory.WORK,
          date: '2024-01-01',
          status: TaskStatus.PENDING,
        },
      ];

      mockTasksService.findAll.mockResolvedValue({
        tasks: mockTasks,
        count: 1,
      });

      const result = await controller.findAll(
        mockUser as any,
        '2024-01-01',
        TaskCategory.WORK,
        TaskStatus.PENDING,
      );

      expect(service.findAll).toHaveBeenCalledWith(mockUser.id, {
        date: '2024-01-01',
        category: TaskCategory.WORK,
        status: TaskStatus.PENDING,
      });
      expect(result).toEqual({ tasks: mockTasks, count: 1 });
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const taskId = 1;
      const mockTask = {
        id: taskId,
        userId: mockUser.id,
        title: 'Test Task',
      };

      mockTasksService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne(mockUser as any, taskId);

      expect(service.findOne).toHaveBeenCalledWith(mockUser.id, taskId);
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskId = 1;
      const updateDto = {
        title: 'Updated Task',
        status: TaskStatus.DONE,
      };

      const updatedTask = {
        id: taskId,
        userId: mockUser.id,
        ...updateDto,
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(
        mockUser as any,
        taskId,
        updateDto,
      );

      expect(service.update).toHaveBeenCalledWith(
        mockUser.id,
        taskId,
        updateDto,
      );
      expect(result).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      const taskId = 1;

      mockTasksService.remove.mockResolvedValue(undefined);

      await controller.remove(mockUser as any, taskId);

      expect(service.remove).toHaveBeenCalledWith(mockUser.id, taskId);
    });
  });
});

