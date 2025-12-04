import { Task, Habit } from '../types';
import { format } from 'date-fns';

export function exportTasksToCSV(tasks: Task[]): void {
  const headers = ['Title', 'Description', 'Category', 'Date', 'Start Time', 'End Time', 'Status', 'Priority', 'Effort (min)', 'Notes'];
  
  const rows = tasks.map((task) => [
    task.title,
    task.description || '',
    task.category,
    task.date,
    task.startTime || '',
    task.endTime || '',
    task.status,
    task.priority || 'medium',
    task.effort.toString(),
    task.notes || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `tasks_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTasksToJSON(tasks: Task[]): void {
  const data = {
    exportDate: new Date().toISOString(),
    tasks: tasks.map((task) => ({
      ...task,
      subtasks: task.subtasks || [],
    })),
  };

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `tasks_${format(new Date(), 'yyyy-MM-dd')}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportHabitsToCSV(habits: Habit[]): void {
  const headers = ['Name', 'Description', 'Target Type', 'Target Value', 'Category', 'Active'];
  
  const rows = habits.map((habit) => [
    habit.name,
    habit.description || '',
    habit.targetType,
    habit.targetValue.toString(),
    habit.category || '',
    habit.active ? 'Yes' : 'No',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `habits_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

