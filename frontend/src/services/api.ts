import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type {
  User,
  Task,
  CreateTaskDto,
  Habit,
  HabitCheckin,
  RoutineTemplate,
} from '../types';

// Ensure API_URL is properly formatted
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return 'http://localhost:3000/api';
  }
  
  // Remove trailing slash if present
  let url = envUrl.trim().replace(/\/$/, '');
  
  // Ensure it starts with http:// or https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // If it's a relative path, make it absolute
    if (url.startsWith('/')) {
      url = window.location.origin + url;
    } else {
      // Assume https for production
      url = 'https://' + url;
    }
  }
  
  return url;
};

const API_URL = getApiUrl();

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await axios.post(`${API_URL}/auth/refresh`, {
                refresh_token: refreshToken,
              });

              const { access_token } = response.data;
              localStorage.setItem('access_token', access_token);

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
              }

              return this.api(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  // Auth
  async register(email: string, password: string, name: string, timezone?: string) {
    const response = await this.api.post('/auth/register', {
      email,
      password,
      name,
      timezone,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async getMe(): Promise<User> {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // Tasks
  async getTasks(filters?: {
    date?: string;
    category?: string;
    status?: string;
    time_block?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<{ tasks: Task[]; count: number }> {
    const response = await this.api.get('/tasks', { params: filters });
    return response.data;
  }

  async getTask(id: number): Promise<Task> {
    const response = await this.api.get(`/tasks/${id}`);
    return response.data;
  }

  async createTask(task: CreateTaskDto): Promise<Task> {
    const response = await this.api.post('/tasks', task);
    return response.data;
  }

  async updateTask(id: number, task: Partial<CreateTaskDto>): Promise<Task> {
    const response = await this.api.patch(`/tasks/${id}`, task);
    return response.data;
  }

  async deleteTask(id: number): Promise<void> {
    await this.api.delete(`/tasks/${id}`);
  }

  async bulkCreateTasks(tasks: CreateTaskDto[]): Promise<Task[]> {
    const response = await this.api.post('/tasks/bulk-create', { tasks });
    return response.data.tasks;
  }

  // Subtasks
  async createSubtask(taskId: number, subtask: { title: string; completed?: boolean }) {
    const response = await this.api.post(`/tasks/${taskId}/subtasks`, subtask);
    return response.data;
  }

  async updateSubtask(taskId: number, subtaskId: number, subtask: { title?: string; completed?: boolean }) {
    const response = await this.api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`, subtask);
    return response.data;
  }

  async deleteSubtask(taskId: number, subtaskId: number): Promise<void> {
    await this.api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
  }

  // Habits
  async getHabits(activeOnly = false): Promise<Habit[]> {
    const response = await this.api.get('/habits', {
      params: { active_only: activeOnly },
    });
    return response.data;
  }

  async getHabit(id: number): Promise<Habit> {
    const response = await this.api.get(`/habits/${id}`);
    return response.data;
  }

  async createHabit(habit: {
    name: string;
    description?: string;
    targetType: string;
    targetValue: number;
    category?: string;
  }): Promise<Habit> {
    const response = await this.api.post('/habits', habit);
    return response.data;
  }

  async updateHabit(id: number, habit: Partial<Habit>): Promise<Habit> {
    const response = await this.api.patch(`/habits/${id}`, habit);
    return response.data;
  }

  async deleteHabit(id: number): Promise<void> {
    await this.api.delete(`/habits/${id}`);
  }

  async checkinHabit(
    id: number,
    checkin: { date: string; value?: number; notes?: string },
  ): Promise<HabitCheckin> {
    const response = await this.api.post(`/habits/${id}/checkin`, checkin);
    return response.data;
  }

  async getHabitCheckins(
    id: number,
    startDate?: string,
    endDate?: string,
  ): Promise<{ checkins: HabitCheckin[]; streak: number }> {
    const response = await this.api.get(`/habits/${id}/checkins`, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  }

  // Stats
  async getWeeklyStats(week: string) {
    const response = await this.api.get('/stats/weekly', { params: { week } });
    return response.data;
  }

  async getHabitsStats(startDate: string, endDate: string) {
    const response = await this.api.get('/stats/habits', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  }

  async getMonthlyStats(month: string) {
    const response = await this.api.get('/stats/monthly', { params: { month } });
    return response.data;
  }

  // Templates
  async getTemplates(): Promise<RoutineTemplate[]> {
    const response = await this.api.get('/templates');
    return response.data;
  }

  async getTemplate(id: number): Promise<RoutineTemplate> {
    const response = await this.api.get(`/templates/${id}`);
    return response.data;
  }

  async createTemplate(template: {
    name: string;
    dayType: string;
    blocks: Array<{
      timeBlock: string;
      defaultTasks: Array<{
        title: string;
        category: string;
        effort?: number;
        startTime?: string;
        endTime?: string;
      }>;
    }>;
  }): Promise<RoutineTemplate> {
    const response = await this.api.post('/templates', template);
    return response.data;
  }

  async deleteTemplate(id: number): Promise<void> {
    await this.api.delete(`/templates/${id}`);
  }

  async applyTemplate(id: number, date: string): Promise<{ tasks: Task[]; count: number }> {
    const response = await this.api.post(`/templates/${id}/apply`, null, {
      params: { date },
    });
    return response.data;
  }
}

export const apiService = new ApiService();

