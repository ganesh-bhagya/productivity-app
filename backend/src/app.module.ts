import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { HabitsModule } from './habits/habits.module';
import { StatsModule } from './stats/stats.module';
import { TemplatesModule } from './templates/templates.module';
import { User } from './common/entities/user.entity';
import { Task } from './tasks/entities/task.entity';
import { Habit } from './habits/entities/habit.entity';
import { HabitCheckin } from './habits/entities/habit-checkin.entity';
import { RoutineTemplate } from './templates/entities/routine-template.entity';
import { TemplateBlock } from './templates/entities/template-block.entity';
import { Subtask } from './tasks/entities/subtask.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'productivity_user'),
        password: configService.get('DB_PASSWORD', 'productivity_pass'),
        database: configService.get('DB_DATABASE', 'productivity_db'),
        entities: [User, Task, Habit, HabitCheckin, RoutineTemplate, TemplateBlock, Subtask],
        synchronize: configService.get('NODE_ENV') === 'development', // Auto-sync in dev only
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TasksModule,
    HabitsModule,
    StatsModule,
    TemplatesModule,
  ],
})
export class AppModule {}

