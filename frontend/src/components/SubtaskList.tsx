import { useState } from 'react';
import { Subtask } from '../types';
import { apiService } from '../services/api';

interface SubtaskListProps {
  taskId: number;
  subtasks: Subtask[];
  onUpdate: () => void;
}

export default function SubtaskList({ taskId, subtasks, onUpdate }: SubtaskListProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;

    try {
      await apiService.createSubtask(taskId, { title: newSubtaskTitle.trim() });
      setNewSubtaskTitle('');
      setIsAdding(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to create subtask:', error);
    }
  };

  const handleToggleSubtask = async (subtask: Subtask) => {
    try {
      await apiService.updateSubtask(taskId, subtask.id, {
        completed: !subtask.completed,
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to update subtask:', error);
    }
  };

  const handleDeleteSubtask = async (subtaskId: number) => {
    try {
      await apiService.deleteSubtask(taskId, subtaskId);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-300">Subtasks</h4>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            + Add subtask
          </button>
        )}
      </div>

      {isAdding && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
            placeholder="Subtask title..."
            className="input-field text-sm py-2 flex-1"
            autoFocus
          />
          <button onClick={handleAddSubtask} className="btn-primary text-xs py-2 px-3">
            Add
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewSubtaskTitle('');
            }}
            className="btn-secondary text-xs py-2 px-3"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="space-y-1.5">
        {subtasks?.map((subtask) => (
          <div
            key={subtask.id}
            className="group flex items-center gap-2 p-2 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <button
              onClick={() => handleToggleSubtask(subtask)}
              className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                subtask.completed
                  ? 'bg-cyan-500 border-cyan-500'
                  : 'border-slate-600 hover:border-cyan-400'
              }`}
            >
              {subtask.completed && <span className="text-white text-[8px] font-bold">✓</span>}
            </button>
            <span
              className={`flex-1 text-sm ${
                subtask.completed ? 'line-through text-slate-500' : 'text-slate-300'
              }`}
            >
              {subtask.title}
            </span>
            <button
              onClick={() => handleDeleteSubtask(subtask.id)}
              className="text-slate-500 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

