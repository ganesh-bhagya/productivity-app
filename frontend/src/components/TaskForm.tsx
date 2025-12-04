import { useState, useEffect } from 'react';
import { useTasksStore } from '../store/tasksStore';
import { Task, TaskCategory, TaskStatus, TimeBlock, TaskPriority, RecurrencePattern, CreateTaskDto } from '../types';
import SubtaskList from './SubtaskList';
import PomodoroTimer from './PomodoroTimer';
import { apiService } from '../services/api';

interface TaskFormProps {
  task?: Task | null;
  defaultDate?: string;
  onClose: () => void;
}

export default function TaskForm({ task, defaultDate, onClose }: TaskFormProps) {
  const { createTask, updateTask } = useTasksStore();
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [showTimer, setShowTimer] = useState(false);
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    category: TaskCategory.MISC,
    date: defaultDate || new Date().toISOString().split('T')[0],
    timeBlock: TimeBlock.MORNING,
    status: TaskStatus.PENDING,
    effort: 30,
    priority: TaskPriority.MEDIUM,
    recurrencePattern: undefined,
    recurrenceEndDate: undefined,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        category: task.category,
        date: task.date,
        startTime: task.startTime || '',
        endTime: task.endTime || '',
        timeBlock: task.timeBlock,
        status: task.status,
        effort: task.effort,
        priority: task.priority || TaskPriority.MEDIUM,
        recurrencePattern: task.recurrencePattern || undefined,
        recurrenceEndDate: task.recurrenceEndDate || undefined,
        notes: task.notes || '',
      });
      loadSubtasks();
    }
  }, [task]);

  const loadSubtasks = async () => {
    if (task) {
      try {
        const fullTask = await apiService.getTask(task.id);
        setSubtasks(fullTask.subtasks || []);
      } catch (error) {
        console.error('Failed to load subtasks:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (task) {
        await updateTask(task.id, formData);
      } else {
        await createTask(formData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-white/20 animate-scale-in">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold gradient-text">
              {task ? 'Edit Task' : 'New Task'}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-3xl hover:bg-white/5 rounded-lg p-1 transition-all duration-200 w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="input-field"
                placeholder="Task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Task description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as TaskCategory })
                  }
                  className="input-field"
                  required
                >
                  {Object.values(TaskCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Time Block *
                </label>
                <select
                  value={formData.timeBlock}
                  onChange={(e) =>
                    setFormData({ ...formData, timeBlock: e.target.value as TimeBlock })
                  }
                  className="input-field"
                  required
                >
                  {Object.values(TimeBlock).map((block) => (
                    <option key={block} value={block}>
                      {block.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Start Time</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">End Time</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value as TaskPriority })
                  }
                  className="input-field"
                  required
                >
                  {Object.values(TaskPriority).map((priority) => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Effort (minutes)
                </label>
                <input
                  type="number"
                  value={formData.effort}
                  onChange={(e) =>
                    setFormData({ ...formData, effort: parseInt(e.target.value) || 30 })
                  }
                  className="input-field"
                  min={1}
                />
              </div>
            </div>

            {task && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as TaskStatus })
                  }
                  className="input-field"
                >
                  {Object.values(TaskStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Recurring</label>
              <div className="space-y-3">
                <select
                  value={formData.recurrencePattern || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurrencePattern: e.target.value ? (e.target.value as RecurrencePattern) : undefined,
                    })
                  }
                  className="input-field"
                >
                  <option value="">No recurrence</option>
                  {Object.values(RecurrencePattern).map((pattern) => (
                    <option key={pattern} value={pattern}>
                      {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                    </option>
                  ))}
                </select>
                {formData.recurrencePattern && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Repeat until
                    </label>
                    <input
                      type="date"
                      value={formData.recurrenceEndDate || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, recurrenceEndDate: e.target.value || undefined })
                      }
                      className="input-field"
                      min={formData.date}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Additional notes or reminders..."
              />
            </div>

            {task && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-300">Focus Timer</h4>
                  <button
                    type="button"
                    onClick={() => setShowTimer(!showTimer)}
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    {showTimer ? 'Hide Timer' : 'Show Timer'}
                  </button>
                </div>
                {showTimer && (
                  <div className="mb-4">
                    <PomodoroTimer taskId={task.id} taskTitle={task.title} />
                  </div>
                )}
                <div>
                  <SubtaskList taskId={task.id} subtasks={subtasks} onUpdate={loadSubtasks} />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {task ? 'Update' : 'Create'} Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

