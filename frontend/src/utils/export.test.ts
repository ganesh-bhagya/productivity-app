import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportTasksToCSV, exportTasksToJSON, exportHabitsToCSV } from './export';
import { Task, TaskCategory, TaskStatus, TimeBlock, TaskPriority } from '../types';
import { Habit, TargetType } from '../types';

// Mock date-fns format
vi.mock('date-fns', () => ({
  format: vi.fn(() => '2024-01-01'),
}));

describe('Export Utilities', () => {
  let createElementSpy: any;
  let appendChildSpy: any;
  let removeChildSpy: any;
  let clickSpy: any;

  beforeEach(() => {
    // Mock DOM methods
    clickSpy = vi.fn();

    // Mock URL.createObjectURL
    (globalThis as any).URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    (globalThis as any).URL.revokeObjectURL = vi.fn();

    // Mock link element with proper Node structure
    const mockLink = document.createElement('a');
    mockLink.setAttribute = vi.fn();
    mockLink.click = clickSpy;
    mockLink.style = {} as any;

    createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('exportTasksToCSV', () => {
    it('should export tasks to CSV format', () => {
      const tasks: Task[] = [
        {
          id: 1,
          userId: 1,
          title: 'Test Task',
          description: 'Test Description',
          category: TaskCategory.WORK,
          date: '2024-01-01',
          status: TaskStatus.PENDING,
          timeBlock: TimeBlock.MORNING,
          effort: 30,
          priority: TaskPriority.HIGH,
        },
      ];

      exportTasksToCSV(tasks);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });

    it('should handle empty tasks array', () => {
      exportTasksToCSV([]);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('exportTasksToJSON', () => {
    it('should export tasks to JSON format', () => {
      const tasks: Task[] = [
        {
          id: 1,
          userId: 1,
          title: 'Test Task',
          category: TaskCategory.WORK,
          date: '2024-01-01',
          status: TaskStatus.PENDING,
          timeBlock: TimeBlock.MORNING,
          effort: 30,
          priority: TaskPriority.MEDIUM,
        },
      ];

      exportTasksToJSON(tasks);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('exportHabitsToCSV', () => {
    it('should export habits to CSV format', () => {
      const habits: Habit[] = [
        {
          id: 1,
          userId: 1,
          name: 'Daily Exercise',
          description: 'Exercise daily',
          targetType: TargetType.DAILY,
          targetValue: 1,
          active: true,
        },
      ];

      exportHabitsToCSV(habits);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(clickSpy).toHaveBeenCalled();
    });
  });
});

