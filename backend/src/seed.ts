import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './common/entities/user.entity';
import { Task, TaskCategory, TaskStatus, TimeBlock, TaskPriority } from './tasks/entities/task.entity';
import { Habit, TargetType } from './habits/entities/habit.entity';
import { HabitCheckin } from './habits/entities/habit-checkin.entity';
import { RoutineTemplate } from './templates/entities/routine-template.entity';
import { TemplateBlock } from './templates/entities/template-block.entity';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'productivity_app',
  entities: [User, Task, Habit, HabitCheckin, RoutineTemplate, TemplateBlock],
  synchronize: true, // Create tables if they don't exist
  logging: false,
});

async function seed() {
  let dataSource: DataSource | null = null;
  try {
    dataSource = await AppDataSource.initialize();
    console.log('✅ Database connected');

    const userRepository = AppDataSource.getRepository(User);
    const taskRepository = AppDataSource.getRepository(Task);
    const habitRepository = AppDataSource.getRepository(Habit);
    const checkinRepository = AppDataSource.getRepository(HabitCheckin);

    // Check if seed data already exists
    const existingUser = await userRepository.findOne({
      where: { email: 'demo@example.com' },
    });

    if (existingUser) {
      console.log('⚠️  Seed data already exists. Skipping seed...');
      if (dataSource && dataSource.isInitialized) {
        await dataSource.destroy();
      }
      return;
    }

    // Create demo user
    const passwordHash = await bcrypt.hash('demo123', 10);
    const user = userRepository.create({
      email: 'demo@example.com',
      passwordHash,
      name: 'Demo User',
      timezone: 'Asia/Colombo',
    });
    const savedUser = await userRepository.save(user);
    console.log('✅ Created demo user: demo@example.com / demo123');

    // Create sample tasks for today and tomorrow
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = [
      {
        userId: savedUser.id,
        title: 'Morning Exercise',
        description: '30 minutes of cardio',
        category: TaskCategory.GYM,
        date: today,
        startTime: '07:00:00',
        endTime: '07:30:00',
        status: TaskStatus.PENDING,
        timeBlock: TimeBlock.MORNING,
        effort: 30,
        priority: TaskPriority.MEDIUM,
      },
      {
        userId: savedUser.id,
        title: 'Review Project Documentation',
        description: 'Go through the latest project updates',
        category: TaskCategory.WORK,
        date: today,
        startTime: '09:00:00',
        endTime: '10:30:00',
        status: TaskStatus.IN_PROGRESS,
        timeBlock: TimeBlock.WORK_HOURS,
        effort: 90,
        priority: TaskPriority.HIGH,
      },
      {
        userId: savedUser.id,
        title: 'Read Chapter 5',
        description: 'Continue reading the book',
        category: TaskCategory.READING,
        date: today,
        startTime: '20:00:00',
        endTime: '20:30:00',
        status: TaskStatus.PENDING,
        timeBlock: TimeBlock.EVENING,
        effort: 30,
        priority: TaskPriority.LOW,
      },
      {
        userId: savedUser.id,
        title: 'Team Meeting',
        description: 'Weekly sync with the team',
        category: TaskCategory.WORK,
        date: tomorrow,
        startTime: '10:00:00',
        endTime: '11:00:00',
        status: TaskStatus.PENDING,
        timeBlock: TimeBlock.WORK_HOURS,
        effort: 60,
        priority: TaskPriority.HIGH,
      },
      {
        userId: savedUser.id,
        title: 'Gym Session',
        description: 'Strength training',
        category: TaskCategory.GYM,
        date: tomorrow,
        startTime: '18:00:00',
        endTime: '19:00:00',
        status: TaskStatus.PENDING,
        timeBlock: TimeBlock.EVENING,
        effort: 60,
        priority: TaskPriority.MEDIUM,
      },
    ];

    const savedTasks = await taskRepository.save(tasks);
    console.log(`✅ Created ${savedTasks.length} sample tasks`);

    // Create sample habits
    const habits = [
      {
        userId: savedUser.id,
        name: 'Daily Reading',
        description: 'Read for at least 30 minutes every day',
        targetType: TargetType.DAILY,
        targetValue: 1,
        category: TaskCategory.READING,
        active: true,
      },
      {
        userId: savedUser.id,
        name: 'Gym Workout',
        description: 'Go to the gym 3 times per week',
        targetType: TargetType.WEEKLY,
        targetValue: 3,
        category: TaskCategory.GYM,
        active: true,
      },
      {
        userId: savedUser.id,
        name: 'Meditation',
        description: 'Meditate for 15 minutes daily',
        targetType: TargetType.DAILY,
        targetValue: 1,
        category: null,
        active: true,
      },
    ];

    const savedHabits = await habitRepository.save(habits);
    console.log(`✅ Created ${savedHabits.length} sample habits`);

    // Create some habit check-ins for the reading habit (last 7 days)
    const readingHabit = savedHabits.find((h) => h.name === 'Daily Reading');
    if (readingHabit) {
      const checkins = [];
      for (let i = 6; i >= 0; i--) {
        const checkinDate = new Date(today);
        checkinDate.setDate(checkinDate.getDate() - i);
        checkinDate.setHours(0, 0, 0, 0);

        // Skip today (no check-in yet)
        if (i === 0) continue;

        checkins.push({
          userId: savedUser.id,
          habitId: readingHabit.id,
          date: checkinDate,
          value: 1,
          notes: i % 2 === 0 ? 'Read in the morning' : 'Read in the evening',
        });
      }

      await checkinRepository.save(checkins);
      console.log(`✅ Created ${checkins.length} habit check-ins`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Email: demo@example.com');
    console.log('   Password: demo123');
    console.log('\n✨ You can now use the application with this demo account.');

    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  } catch (error: any) {
    console.error('❌ Error seeding database:', error.message);
    if (error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_NO_SUCH_TABLE') {
      console.log('⚠️  Database schema issue detected. Tables may already exist or need to be created by the backend.');
      console.log('💡 Try restarting the backend server to ensure tables are created properly.');
    }
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

// Load environment variables from .env file
import { readFileSync } from 'fs';
import { resolve } from 'path';

try {
  const envPath = resolve(__dirname, '../.env');
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch (error) {
  console.log('⚠️  .env file not found, using default values');
}

seed();

