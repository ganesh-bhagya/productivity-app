import { useState } from 'react';
import { useTasksStore } from '../store/tasksStore';
import { TaskCategory, TimeBlock, TaskPriority, CreateTaskDto } from '../types';
import { format } from 'date-fns';

interface QuickTaskFormProps {
  defaultDate?: string;
  onClose: () => void;
}

export default function QuickTaskForm({ defaultDate, onClose }: QuickTaskFormProps) {
  const { createTask } = useTasksStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.MISC);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData: CreateTaskDto = {
      title: title.trim(),
      category,
      date: defaultDate || format(new Date(), 'yyyy-MM-dd'),
      timeBlock: TimeBlock.WORK_HOURS,
      priority,
      effort: 30,
      status: 'pending' as any,
    };

    try {
      await createTask(taskData);
      onClose();
      setTitle('');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass rounded-2xl max-w-md w-full shadow-2xl border-white/20 animate-scale-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold gradient-text">Quick Add Task</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl hover:bg-white/5 rounded-lg p-1 transition-all duration-200 w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="input-field text-lg"
                autoFocus
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="input-field text-sm"
                >
                  {Object.values(TaskCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="input-field text-sm"
                >
                  {Object.values(TaskPriority).map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary text-sm py-2 px-4">
                Cancel
              </button>
              <button type="submit" className="btn-primary text-sm py-2 px-4">
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

