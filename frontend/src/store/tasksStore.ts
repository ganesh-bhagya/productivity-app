import { create } from 'zustand';
import type { Task, CreateTaskDto } from '../types';
import { apiService } from '../services/api';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (filters?: {
    date?: string;
    category?: string;
    status?: string;
    time_block?: string;
    start_date?: string;
    end_date?: string;
  }) => Promise<void>;
  createTask: (task: CreateTaskDto) => Promise<void>;
  updateTask: (id: number, task: Partial<CreateTaskDto>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  bulkCreateTasks: (tasks: CreateTaskDto[]) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiService.getTasks(filters);
      set({ tasks: data.tasks, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch tasks',
        isLoading: false,
      });
    }
  },

  createTask: async (task) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await apiService.createTask(task);
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create task',
        isLoading: false,
      });
      throw error;
    }
  },

  updateTask: async (id, task) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await apiService.updateTask(id, task);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update task',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete task',
        isLoading: false,
      });
      throw error;
    }
  },

  bulkCreateTasks: async (tasks) => {
    set({ isLoading: true, error: null });
    try {
      const newTasks = await apiService.bulkCreateTasks(tasks);
      set((state) => ({
        tasks: [...state.tasks, ...newTasks],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create tasks',
        isLoading: false,
      });
      throw error;
    }
  },
}));

