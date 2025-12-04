import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Task, TaskCategory, TaskStatus, RecurrencePattern } from './entities/task.entity';
import { Subtask } from './entities/subtask.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BulkCreateTasksDto } from './dto/bulk-create-tasks.dto';
import { CreateSubtaskDto, UpdateSubtaskDto } from './dto/create-subtask.dto';
import { User } from '../common/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Subtask)
    private subtaskRepository: Repository<Subtask>,
  ) {}

  async create(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    const taskData: any = {
      ...createTaskDto,
      userId,
      date: new Date(createTaskDto.date),
    };

    if (createTaskDto.recurrenceEndDate) {
      taskData.recurrenceEndDate = new Date(createTaskDto.recurrenceEndDate);
    }

    const task = this.taskRepository.create(taskData);
    const savedTask = (await this.taskRepository.save(task)) as unknown as Task;

    // If recurring, generate instances
    if (createTaskDto.recurrencePattern) {
      await this.generateRecurringTasks(userId, savedTask);
    }

    return savedTask;
  }

  private async generateRecurringTasks(userId: number, parentTask: Task): Promise<void> {
    if (!parentTask.recurrencePattern || !parentTask.recurrenceEndDate) return;

    const instances: Partial<Task>[] = [];
    const startDate = new Date(parentTask.date);
    const endDate = new Date(parentTask.recurrenceEndDate);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (currentDate.getTime() !== startDate.getTime()) {
        // Skip the original task date
        let shouldInclude = false;

        switch (parentTask.recurrencePattern) {
          case RecurrencePattern.DAILY:
            shouldInclude = true;
            break;
          case RecurrencePattern.WEEKDAYS:
            const day = currentDate.getDay();
            shouldInclude = day >= 1 && day <= 5; // Monday to Friday
            break;
          case RecurrencePattern.WEEKENDS:
            const dayOfWeek = currentDate.getDay();
            shouldInclude = dayOfWeek === 0 || dayOfWeek === 6; // Saturday or Sunday
            break;
          case RecurrencePattern.WEEKLY:
            shouldInclude = currentDate.getDay() === startDate.getDay();
            break;
          case RecurrencePattern.MONTHLY:
            shouldInclude = currentDate.getDate() === startDate.getDate();
            break;
        }

        if (shouldInclude) {
          instances.push({
            userId,
            title: parentTask.title,
            description: parentTask.description,
            category: parentTask.category,
            date: new Date(currentDate),
            startTime: parentTask.startTime,
            endTime: parentTask.endTime,
            status: TaskStatus.PENDING,
            timeBlock: parentTask.timeBlock,
            effort: parentTask.effort,
            priority: parentTask.priority,
            notes: parentTask.notes,
            parentTaskId: parentTask.id,
            recurrencePattern: null, // Child tasks don't recur
          });
        }
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (instances.length > 0) {
      await this.taskRepository.save(instances);
    }
  }

  async bulkCreate(
    userId: number,
    bulkCreateDto: BulkCreateTasksDto,
  ): Promise<Task[]> {
    const tasks = bulkCreateDto.tasks.map((dto) =>
      this.taskRepository.create({
        ...dto,
        userId,
        date: new Date(dto.date),
      }),
    );

    return this.taskRepository.save(tasks);
  }

  async findAll(
    userId: number,
    filters?: {
      date?: string;
      category?: TaskCategory;
      status?: TaskStatus;
      timeBlock?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<{ tasks: Task[]; count: number }> {
    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId });

    if (filters?.date) {
      queryBuilder.andWhere('task.date = :date', {
        date: filters.date,
      });
    }

    if (filters?.startDate && filters?.endDate) {
      queryBuilder.andWhere('task.date BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    if (filters?.category) {
      queryBuilder.andWhere('task.category = :category', {
        category: filters.category,
      });
    }

    if (filters?.status) {
      queryBuilder.andWhere('task.status = :status', {
        status: filters.status,
      });
    }

    if (filters?.timeBlock) {
      queryBuilder.andWhere('task.timeBlock = :timeBlock', {
        timeBlock: filters.timeBlock,
      });
    }

    queryBuilder
      .leftJoinAndSelect('task.subtasks', 'subtasks')
      .orderBy('task.date', 'DESC')
      .addOrderBy('task.startTime', 'ASC')
      .addOrderBy('subtasks.order', 'ASC');

    const [tasks, count] = await queryBuilder.getManyAndCount();

    return { tasks, count };
  }

  async findOne(userId: number, id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId },
      relations: ['subtasks'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(
    userId: number,
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOne(userId, id);

    // Convert date string to Date object if provided
    const updateData: any = { ...updateTaskDto };
    if (updateTaskDto.date) {
      updateData.date = new Date(updateTaskDto.date);
    }

    Object.assign(task, updateData);
    return this.taskRepository.save(task);
  }

  async remove(userId: number, id: number): Promise<void> {
    const task = await this.findOne(userId, id);
    await this.taskRepository.remove(task);
  }

  // Subtasks methods
  async createSubtask(taskId: number, userId: number, createSubtaskDto: CreateSubtaskDto): Promise<Subtask> {
    // Verify task belongs to user
    const task = await this.taskRepository.findOne({ where: { id: taskId, userId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const subtask = this.subtaskRepository.create({
      ...createSubtaskDto,
      taskId,
    });

    return this.subtaskRepository.save(subtask);
  }

  async updateSubtask(
    subtaskId: number,
    taskId: number,
    userId: number,
    updateSubtaskDto: UpdateSubtaskDto,
  ): Promise<Subtask> {
    // Verify task belongs to user
    const task = await this.taskRepository.findOne({ where: { id: taskId, userId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const subtask = await this.subtaskRepository.findOne({
      where: { id: subtaskId, taskId },
    });

    if (!subtask) {
      throw new NotFoundException(`Subtask with ID ${subtaskId} not found`);
    }

    Object.assign(subtask, updateSubtaskDto);
    return this.subtaskRepository.save(subtask);
  }

  async removeSubtask(subtaskId: number, taskId: number, userId: number): Promise<void> {
    // Verify task belongs to user
    const task = await this.taskRepository.findOne({ where: { id: taskId, userId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const subtask = await this.subtaskRepository.findOne({
      where: { id: subtaskId, taskId },
    });

    if (!subtask) {
      throw new NotFoundException(`Subtask with ID ${subtaskId} not found`);
    }

    await this.subtaskRepository.remove(subtask);
  }
}

