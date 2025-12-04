import { Task, TaskStatus, TaskPriority } from '../types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onComplete: () => void;
  onDelete: () => void;
}

const priorityIcons: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: '⬇️',
  [TaskPriority.MEDIUM]: '➡️',
  [TaskPriority.HIGH]: '⬆️',
};

export default function TaskCard({ task, onClick, onComplete, onDelete }: TaskCardProps) {
  const isDone = task.status === TaskStatus.DONE;

  return (
    <div
      className={`group relative cursor-pointer bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/40 hover:border-cyan-500/40 rounded-xl p-4 transition-all duration-200 animate-fade-in task-card-light ${
        isDone ? 'opacity-65' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            isDone
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-500 shadow-md shadow-cyan-500/20'
              : 'border-slate-600 hover:border-cyan-400 hover:bg-cyan-500/10'
          }`}
        >
          {isDone && <span className="text-white text-xs font-bold">✓</span>}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-base mb-1 ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-slate-300 leading-relaxed mb-2">{task.description}</p>
              )}
              {task.notes && (
                <div className="text-xs text-slate-400 bg-slate-800/40 px-2 py-1.5 rounded-lg mt-2 border border-slate-700/30">
                  <span className="font-medium text-slate-500">📝 Notes: </span>
                  <span className="text-slate-300">{task.notes}</span>
                </div>
              )}
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="text-xs text-slate-400 mt-2">
                  <span className="font-medium text-slate-500">
                    ✓ {task.subtasks.filter((s) => s.completed).length} / {task.subtasks.length} subtasks
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-all duration-200 text-lg opacity-0 group-hover:opacity-100 flex-shrink-0"
            >
              ×
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {task.recurrencePattern && (
              <span
                className="px-2 py-1 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/50"
                title={`Recurring: ${task.recurrencePattern}`}
              >
                🔁 {task.recurrencePattern}
              </span>
            )}
            <span
              className={`px-2 py-1 rounded-lg text-xs font-medium priority-badge priority-${task.priority || TaskPriority.MEDIUM}`}
              title={`Priority: ${(task.priority || TaskPriority.MEDIUM).toUpperCase()}`}
            >
              {priorityIcons[task.priority || TaskPriority.MEDIUM]}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-medium border backdrop-blur-sm category-badge category-${task.category}`}
            >
              {task.category}
            </span>
            {task.startTime && task.endTime && (
              <span className="text-xs text-slate-300 bg-slate-700/50 px-3 py-1 rounded-lg time-badge">
                🕐 {task.startTime.split(':').slice(0, 2).join(':')} - {task.endTime.split(':').slice(0, 2).join(':')}
              </span>
            )}
            {task.effort && (
              <span className="text-xs text-slate-300 bg-slate-700/50 px-3 py-1 rounded-lg time-badge">
                ⏱️ {task.effort} min
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

