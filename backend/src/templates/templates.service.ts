import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoutineTemplate } from './entities/routine-template.entity';
import { TemplateBlock } from './entities/template-block.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { TasksService } from '../tasks/tasks.service';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { TaskCategory, TimeBlock, TaskStatus } from '../tasks/entities/task.entity';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(RoutineTemplate)
    private templateRepository: Repository<RoutineTemplate>,
    @InjectRepository(TemplateBlock)
    private blockRepository: Repository<TemplateBlock>,
    private tasksService: TasksService,
  ) {}

  async create(userId: number, createTemplateDto: CreateTemplateDto) {
    const template = this.templateRepository.create({
      ...createTemplateDto,
      userId,
    });

    const savedTemplate = await this.templateRepository.save(template);

    // Create template blocks
    const blocks = createTemplateDto.blocks.map((blockDto) =>
      this.blockRepository.create({
        templateId: savedTemplate.id,
        timeBlock: blockDto.timeBlock,
        defaultTasks: blockDto.defaultTasks,
      }),
    );

    savedTemplate.blocks = await this.blockRepository.save(blocks);

    return savedTemplate;
  }

  async findAll(userId: number) {
    return this.templateRepository.find({
      where: [{ userId }, { isGlobal: true }],
      relations: ['blocks'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: number, id: number) {
    const template = await this.templateRepository.findOne({
      where: [{ id, userId }, { id, isGlobal: true }],
      relations: ['blocks'],
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return template;
  }

  async remove(userId: number, id: number) {
    const template = await this.findOne(userId, id);
    await this.templateRepository.remove(template);
  }

  async applyTemplate(userId: number, templateId: number, date: string) {
    const template = await this.findOne(userId, templateId);

    // Create tasks from template blocks
    const tasksToCreate: CreateTaskDto[] = [];

    for (const block of template.blocks) {
      for (const defaultTask of block.defaultTasks) {
        tasksToCreate.push({
          title: defaultTask.title,
          category: defaultTask.category as TaskCategory,
          date,
          timeBlock: block.timeBlock as TimeBlock,
          effort: defaultTask.effort || 30,
          startTime: defaultTask.startTime,
          endTime: defaultTask.endTime,
          status: TaskStatus.PENDING,
        });
      }
    }

    if (tasksToCreate.length === 0) {
      return { tasks: [], count: 0 };
    }

    const tasks = await this.tasksService.bulkCreate(userId, {
      tasks: tasksToCreate,
    });

    return { tasks, count: tasks.length };
  }
}

