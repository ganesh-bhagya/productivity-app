import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Task, TaskCategory } from '../tasks/entities/task.entity';
import { Habit } from '../habits/entities/habit.entity';
import { HabitCheckin } from '../habits/entities/habit-checkin.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Habit)
    private habitRepository: Repository<Habit>,
    @InjectRepository(HabitCheckin)
    private checkinRepository: Repository<HabitCheckin>,
  ) {}

  async getWeeklyStats(userId: number, weekStart: string) {
    const startDate = new Date(weekStart);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    // Get all tasks for the week
    const tasks = await this.taskRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate),
      },
    });

    // Group by category
    const tasksByCategory = tasks.reduce((acc, task) => {
      const category = task.category;
      if (!acc[category]) {
        acc[category] = { count: 0, totalEffort: 0 };
      }
      acc[category].count++;
      acc[category].totalEffort += task.effort || 0;
      return acc;
    }, {} as Record<TaskCategory, { count: number; totalEffort: number }>);

    // Convert to array format
    const categoryStats = Object.entries(tasksByCategory).map(
      ([category, stats]) => ({
        category,
        count: stats.count,
        total_effort: stats.totalEffort,
      }),
    );

    const completedTasks = tasks.filter(
      (t) => t.status === 'done',
    ).length;
    const totalTasks = tasks.length;
    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      week_start: weekStart,
      week_end: endDate.toISOString().split('T')[0],
      tasks_by_category: categoryStats,
      completion_rate: Math.round(completionRate * 100) / 100,
      total_tasks: totalTasks,
      completed_tasks: completedTasks,
    };
  }

  async getHabitsStats(
    userId: number,
    startDate: string,
    endDate: string,
  ): Promise<
    Array<{
      id: number;
      name: string;
      checkins_count: number;
      target_value: number;
      completion_rate: number;
      current_streak: number;
    }>
  > {
    const habits = await this.habitRepository.find({
      where: { userId, active: true },
    });

    const stats = await Promise.all(
      habits.map(async (habit) => {
        const checkins = await this.checkinRepository.find({
          where: {
            habitId: habit.id,
            userId,
            date: Between(new Date(startDate), new Date(endDate)),
          },
        });

        // Calculate streak (simplified - count consecutive days from end date backwards)
        const sortedCheckins = [...checkins].sort(
          (a, b) => b.date.getTime() - a.date.getTime(),
        );
        let streak = 0;
        if (sortedCheckins.length > 0) {
          const end = new Date(endDate);
          let expectedDate = new Date(end);
          let checkinIndex = 0;

          while (checkinIndex < sortedCheckins.length) {
            const checkinDate = new Date(sortedCheckins[checkinIndex].date);
            checkinDate.setHours(0, 0, 0, 0);
            expectedDate.setHours(0, 0, 0, 0);

            if (checkinDate.getTime() === expectedDate.getTime()) {
              streak++;
              expectedDate.setDate(expectedDate.getDate() - 1);
              checkinIndex++;
            } else if (checkinDate.getTime() < expectedDate.getTime()) {
              break;
            } else {
              checkinIndex++;
            }
          }
        }

        // Calculate completion rate based on target type
        let completionRate = 0;
        const daysDiff =
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24) +
          1;

        if (habit.targetType === 'daily') {
          completionRate = (checkins.length / daysDiff) * 100;
        } else if (habit.targetType === 'weekly') {
          const weeks = Math.ceil(daysDiff / 7);
          completionRate = (checkins.length / (habit.targetValue * weeks)) * 100;
        }

        return {
          id: habit.id,
          name: habit.name,
          checkins_count: checkins.length,
          target_value: habit.targetValue,
          completion_rate: Math.min(100, Math.round(completionRate * 100) / 100),
          current_streak: streak,
        };
      }),
    );

    return stats;
  }

  async getMonthlyStats(userId: number, month: string) {
    // month format: YYYY-MM
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    const tasks = await this.taskRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate),
      },
    });

    // Tasks by category
    const tasksByCategory = tasks.reduce((acc, task) => {
      const category = task.category;
      if (!acc[category]) {
        acc[category] = { count: 0, totalEffort: 0, completed: 0 };
      }
      acc[category].count++;
      acc[category].totalEffort += task.effort || 0;
      if (task.status === 'done') {
        acc[category].completed++;
      }
      return acc;
    }, {} as Record<TaskCategory, { count: number; totalEffort: number; completed: number }>);

    const categoryStats = Object.entries(tasksByCategory).map(
      ([category, stats]) => ({
        category,
        count: stats.count,
        completed: stats.completed,
        total_effort: stats.totalEffort,
      }),
    );

    // Daily breakdown
    const dailyBreakdown = tasks.reduce((acc, task) => {
      const dateStr = task.date.toISOString().split('T')[0];
      if (!acc[dateStr]) {
        acc[dateStr] = 0;
      }
      if (task.status === 'done') {
        acc[dateStr]++;
      }
      return acc;
    }, {} as Record<string, number>);

    const dailyArray = Object.entries(dailyBreakdown).map(([date, count]) => ({
      date,
      tasks_completed: count,
    }));

    // Habits summary
    const habitsSummary = await this.getHabitsStats(
      userId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0],
    );

    return {
      month,
      tasks_by_category: categoryStats,
      habits_summary: habitsSummary,
      daily_breakdown: dailyArray,
    };
  }
}

