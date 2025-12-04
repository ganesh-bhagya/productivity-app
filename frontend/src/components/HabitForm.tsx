import { useState, useEffect } from 'react';
import { useHabitsStore } from '../store/habitsStore';
import { Habit, TargetType, TaskCategory } from '../types';

interface HabitFormProps {
  habit?: Habit | null;
  onClose: () => void;
}

export default function HabitForm({ habit, onClose }: HabitFormProps) {
  const { createHabit, updateHabit } = useHabitsStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetType: TargetType.DAILY,
    targetValue: 1,
    category: '' as TaskCategory | '',
  });

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        description: habit.description || '',
        targetType: habit.targetType,
        targetValue: habit.targetValue,
        category: habit.category || '',
      });
    }
  }, [habit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (habit) {
        await updateHabit(habit.id, {
          ...formData,
          category: formData.category || undefined,
        });
      } else {
        await createHabit({
          ...formData,
          category: formData.category || undefined,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save habit:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass rounded-2xl max-w-md w-full shadow-2xl border-white/20 animate-scale-in">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold gradient-text">
              {habit ? 'Edit Habit' : 'New Habit'}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl hover:bg-white/5 rounded-lg p-1 transition-all duration-200 w-10 h-10 flex items-center justify-center">
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="input-field"
                placeholder="e.g., Gym, Reading, Sleep by 10:30"
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
                rows={2}
                placeholder="Optional description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Type *
                </label>
                <select
                  value={formData.targetType}
                  onChange={(e) =>
                    setFormData({ ...formData, targetType: e.target.value as TargetType })
                  }
                  className="input-field"
                  required
                >
                  {Object.values(TargetType).map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Value *
                </label>
                <input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) =>
                    setFormData({ ...formData, targetValue: parseInt(e.target.value) || 1 })
                  }
                  className="input-field"
                  min={1}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as TaskCategory | '' })
                }
                className="input-field"
              >
                <option value="">None</option>
                {Object.values(TaskCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {habit ? 'Update' : 'Create'} Habit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

