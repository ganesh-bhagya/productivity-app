export enum TaskCategory {
  WORK = 'work',
  FREELANCING = 'freelancing',
  GYM = 'gym',
  READING = 'reading',
  CLASS = 'class',
  REST = 'rest',
  MISC = 'misc',
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export enum TimeBlock {
  MORNING = 'morning',
  WORK_HOURS = 'work-hours',
  EVENING = 'evening',
  LATE_NIGHT = 'late-night',
  WEEKEND = 'weekend',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum RecurrencePattern {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  WEEKDAYS = 'weekdays',
  WEEKENDS = 'weekends',
}

export enum TargetType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

export interface User {
  id: number;
  email: string;
  name: string;
  timezone: string;
  created_at?: string;
}

export interface Subtask {
  id: number;
  taskId: number;
  title: string;
  completed: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: number;
  userId: number;
  title: string;
  description?: string;
  category: TaskCategory;
  date: string;
  startTime?: string;
  endTime?: string;
  status: TaskStatus;
  timeBlock: TimeBlock;
  effort: number;
  priority: TaskPriority;
  recurrencePattern?: RecurrencePattern | null;
  parentTaskId?: number | null;
  recurrenceEndDate?: string | null;
  notes?: string;
  subtasks?: Subtask[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  category: TaskCategory;
  date: string;
  startTime?: string;
  endTime?: string;
  status?: TaskStatus;
  timeBlock: TimeBlock;
  effort?: number;
  priority?: TaskPriority;
  recurrencePattern?: RecurrencePattern;
  recurrenceEndDate?: string;
  notes?: string;
}

export interface Habit {
  id: number;
  userId: number;
  name: string;
  description?: string;
  targetType: TargetType;
  targetValue: number;
  category?: TaskCategory;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HabitCheckin {
  id: number;
  habitId: number;
  userId: number;
  date: string;
  value: number;
  notes?: string;
  createdAt?: string;
}

export interface RoutineTemplate {
  id: number;
  userId?: number;
  name: string;
  dayType: 'weekday' | 'weekend' | 'custom';
  isGlobal: boolean;
  blocks: TemplateBlock[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateBlock {
  id: number;
  templateId: number;
  timeBlock: TimeBlock;
  defaultTasks: Array<{
    title: string;
    category: string;
    effort?: number;
    startTime?: string;
    endTime?: string;
  }>;
}

