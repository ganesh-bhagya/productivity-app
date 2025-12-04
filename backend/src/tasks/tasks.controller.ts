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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BulkCreateTasksDto } from './dto/bulk-create-tasks.dto';
import { CreateSubtaskDto, UpdateSubtaskDto } from './dto/create-subtask.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../common/entities/user.entity';
import { TaskCategory, TaskStatus } from './entities/task.entity';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(user.id, createTaskDto);
  }

  @Post('bulk-create')
  bulkCreate(
    @CurrentUser() user: User,
    @Body() bulkCreateDto: BulkCreateTasksDto,
  ) {
    return this.tasksService.bulkCreate(user.id, bulkCreateDto);
  }

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query('date') date?: string,
    @Query('category') category?: TaskCategory,
    @Query('status') status?: TaskStatus,
    @Query('time_block') timeBlock?: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    return this.tasksService.findAll(user.id, {
      date,
      category,
      status,
      timeBlock,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.id, id, updateTaskDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(user.id, id);
  }

  // Subtasks endpoints
  @Post(':id/subtasks')
  createSubtask(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() createSubtaskDto: CreateSubtaskDto,
  ) {
    return this.tasksService.createSubtask(taskId, user.id, createSubtaskDto);
  }

  @Patch(':taskId/subtasks/:subtaskId')
  updateSubtask(
    @CurrentUser() user: User,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('subtaskId', ParseIntPipe) subtaskId: number,
    @Body() updateSubtaskDto: UpdateSubtaskDto,
  ) {
    return this.tasksService.updateSubtask(subtaskId, taskId, user.id, updateSubtaskDto);
  }

  @Delete(':taskId/subtasks/:subtaskId')
  removeSubtask(
    @CurrentUser() user: User,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('subtaskId', ParseIntPipe) subtaskId: number,
  ) {
    return this.tasksService.removeSubtask(subtaskId, taskId, user.id);
  }
}

