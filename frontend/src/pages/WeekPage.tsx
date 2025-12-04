import { useEffect, useState } from 'react';
import { format, startOfWeek, addDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { useTasksStore } from '../store/tasksStore';
import { Task, TaskStatus } from '../types';
import TaskCard from '../components/TaskCard';

export default function WeekPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { tasks, fetchTasks, updateTask, deleteTask } = useTasksStore();

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
  const weekStartStr = format(weekStart, 'yyyy-MM-dd'); // Use string for dependency
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  });

  useEffect(() => {
    const startDate = format(weekStart, 'yyyy-MM-dd');
    const endDate = format(addDays(weekStart, 6), 'yyyy-MM-dd');
    fetchTasks({ start_date: startDate, end_date: endDate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStartStr]); // Only depend on the string representation

  const getTasksForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter((task) => task.date === dateStr);
  };

  const handleTaskComplete = async (task: Task) => {
    await updateTask(task.id, {
      status: task.status === TaskStatus.DONE ? TaskStatus.PENDING : TaskStatus.DONE,
    });
  };

  const handleTaskDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedDate(addDays(selectedDate, direction === 'next' ? 7 : -7));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Week View</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={() => navigateWeek('prev')} className="btn-secondary flex-1 sm:flex-none text-xs sm:text-sm">
            ← Prev
          </button>
          <button onClick={() => setSelectedDate(new Date())} className="btn-secondary flex-1 sm:flex-none text-xs sm:text-sm">
            Today
          </button>
          <button onClick={() => navigateWeek('next')} className="btn-secondary flex-1 sm:flex-none text-xs sm:text-sm">
            Next →
          </button>
        </div>
      </div>

      {/* Week Summary */}
      <div className="card animate-slide-up">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
          {weekDays.map((day) => {
            const dayTasks = getTasksForDay(day);
            const completed = dayTasks.filter((t) => t.status === TaskStatus.DONE).length;
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`p-2 sm:p-3 rounded-xl text-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                    : isToday
                    ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/30'
                    : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/30'
                }`}
              >
                <div className="text-xs font-medium">{format(day, 'EEE')}</div>
                <div className="text-base sm:text-lg font-bold mt-1">{format(day, 'd')}</div>
                <div className="text-xs mt-1">
                  {completed} / {dayTasks.length}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Tasks */}
      <div className="card animate-slide-up">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h2>
        <div className="space-y-3">
          {getTasksForDay(selectedDate).length === 0 ? (
            <p className="text-slate-400 text-center py-12">No tasks for this day</p>
          ) : (
            getTasksForDay(selectedDate).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => {}}
                onComplete={() => handleTaskComplete(task)}
                onDelete={() => handleTaskDelete(task.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

