import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../common/entities/user.entity';

@Controller('templates')
@UseGuards(JwtAuthGuard)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() createTemplateDto: CreateTemplateDto) {
    return this.templatesService.create(user.id, createTemplateDto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.templatesService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.templatesService.findOne(user.id, id);
  }

  @Post(':id/apply')
  applyTemplate(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Query('date') date: string,
  ) {
    return this.templatesService.applyTemplate(user.id, id, date);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.templatesService.remove(user.id, id);
  }
}

