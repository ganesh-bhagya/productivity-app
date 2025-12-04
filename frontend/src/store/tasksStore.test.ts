import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTasksStore } from './tasksStore';
import { apiService } from '../services/api';
import { Task, TaskStatus, TaskCategory, TimeBlock, TaskPriority } from '../types';

// Mock the API service
vi.mock('../services/api', () => ({
  apiService: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    bulkCreateTasks: vi.fn(),
  },
}));

describe('TasksStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTasksStore.setState({
      tasks: [],
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  describe('fetchTasks', () => {
    it('should fetch tasks successfully', async () => {
      const mockTasks: Task[] = [
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

      (apiService.getTasks as any).mockResolvedValue({
        tasks: mockTasks,
        count: 1,
      });

      const store = useTasksStore.getState();
      await store.fetchTasks({ date: '2024-01-01' });

      expect(apiService.getTasks).toHaveBeenCalledWith({ date: '2024-01-01' });
      expect(useTasksStore.getState().tasks).toEqual(mockTasks);
      expect(useTasksStore.getState().isLoading).toBe(false);
    });

    it('should handle fetch errors', async () => {
      const errorMessage = 'Failed to fetch tasks';
      (apiService.getTasks as any).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const store = useTasksStore.getState();
      await store.fetchTasks();

      expect(useTasksStore.getState().error).toBe(errorMessage);
      expect(useTasksStore.getState().isLoading).toBe(false);
    });
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const newTask: Task = {
        id: 1,
        userId: 1,
        title: 'New Task',
        category: TaskCategory.WORK,
        date: '2024-01-01',
        status: TaskStatus.PENDING,
        timeBlock: TimeBlock.MORNING,
        effort: 30,
        priority: TaskPriority.MEDIUM,
      };

      (apiService.createTask as any).mockResolvedValue(newTask);

      const store = useTasksStore.getState();
      await store.createTask({
        title: 'New Task',
        category: TaskCategory.WORK,
        date: '2024-01-01',
        timeBlock: TimeBlock.MORNING,
        effort: 30,
        priority: TaskPriority.MEDIUM,
      });

      expect(apiService.createTask).toHaveBeenCalled();
      expect(useTasksStore.getState().tasks).toContainEqual(newTask);
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const existingTask: Task = {
        id: 1,
        userId: 1,
        title: 'Original Task',
        category: TaskCategory.WORK,
        date: '2024-01-01',
        status: TaskStatus.PENDING,
        timeBlock: TimeBlock.MORNING,
        effort: 30,
        priority: TaskPriority.MEDIUM,
      };

      const updatedTask: Task = {
        ...existingTask,
        title: 'Updated Task',
        status: TaskStatus.DONE,
      };

      useTasksStore.setState({ tasks: [existingTask] });
      (apiService.updateTask as any).mockResolvedValue(updatedTask);

      const store = useTasksStore.getState();
      await store.updateTask(1, {
        title: 'Updated Task',
        status: TaskStatus.DONE,
      });

      expect(apiService.updateTask).toHaveBeenCalledWith(1, {
        title: 'Updated Task',
        status: TaskStatus.DONE,
      });
      expect(useTasksStore.getState().tasks[0]).toEqual(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const task: Task = {
        id: 1,
        userId: 1,
        title: 'Task to Delete',
        category: TaskCategory.WORK,
        date: '2024-01-01',
        status: TaskStatus.PENDING,
        timeBlock: TimeBlock.MORNING,
        effort: 30,
        priority: TaskPriority.MEDIUM,
      };

      useTasksStore.setState({ tasks: [task] });
      (apiService.deleteTask as any).mockResolvedValue(undefined);

      const store = useTasksStore.getState();
      await store.deleteTask(1);

      expect(apiService.deleteTask).toHaveBeenCalledWith(1);
      expect(useTasksStore.getState().tasks).not.toContainEqual(task);
    });
  });
});

