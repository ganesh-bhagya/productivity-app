import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './TaskCard';
import { Task, TaskStatus, TaskCategory, TimeBlock, TaskPriority } from '../types';

const mockTask: Task = {
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
  startTime: '09:00:00',
  endTime: '10:00:00',
};

describe('TaskCard', () => {
  const mockOnClick = vi.fn();
  const mockOnComplete = vi.fn();
  const mockOnDelete = vi.fn();

  it('should render task title and description', () => {
    render(
      <TaskCard
        task={mockTask}
        onClick={mockOnClick}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should display priority indicator', () => {
    render(
      <TaskCard
        task={mockTask}
        onClick={mockOnClick}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByTitle(/Priority: HIGH/i)).toBeInTheDocument();
  });

  it('should display category badge', () => {
    render(
      <TaskCard
        task={mockTask}
        onClick={mockOnClick}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByText(TaskCategory.WORK)).toBeInTheDocument();
  });

  it('should display time range when available', () => {
    render(
      <TaskCard
        task={mockTask}
        onClick={mockOnClick}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByText(/09:00 - 10:00/)).toBeInTheDocument();
  });

  it('should show completed state when task is done', () => {
    const completedTask = {
      ...mockTask,
      status: TaskStatus.DONE,
    };

    render(
      <TaskCard
        task={completedTask}
        onClick={mockOnClick}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
      />,
    );

    const title = screen.getByText('Test Task');
    expect(title).toHaveClass('line-through');
  });

  it('should call onClick when card is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onClick={mockOnClick}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
      />,
    );

    const card = screen.getByText('Test Task').closest('div');
    if (card) {
      fireEvent.click(card);
    }

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onComplete when checkbox is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onClick={mockOnClick}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
      />,
    );

    const checkbox = screen.getAllByRole('button')[0];
    fireEvent.click(checkbox);

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });
});

