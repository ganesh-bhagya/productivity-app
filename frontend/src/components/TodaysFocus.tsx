import { useTasksStore } from '../store/tasksStore';
import { useHabitsStore } from '../store/habitsStore';
import { TaskStatus, TaskPriority } from '../types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function TodaysFocus() {
  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayTasks = tasks.filter((task) => task.date === today);
  
  // Get high priority pending tasks
  const highPriorityTasks = todayTasks.filter(
    (task) => task.priority === TaskPriority.HIGH && task.status === TaskStatus.PENDING
  );

  // Get tasks starting soon (within next 2 hours)
  const now = new Date();
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const upcomingTasks = todayTasks.filter((task) => {
    if (!task.startTime || task.status !== TaskStatus.PENDING) return false;
    const [hours, minutes] = task.startTime.split(':').map(Number);
    const taskTime = new Date();
    taskTime.setHours(hours, minutes, 0, 0);
    return taskTime > now && taskTime <= twoHoursFromNow;
  });

  // Get pending tasks
  const pendingTasks = todayTasks.filter((task) => task.status === TaskStatus.PENDING);

  // Get habits that need check-in today
  const activeHabits = habits.filter((habit) => habit.active);
  const habitsToCheckIn = activeHabits.filter(() => {
    // Simple check - in a real app, you'd check if they've checked in today
    return true; // For now, show all active habits
  });

  // Get completed tasks count
  const completedCount = todayTasks.filter((task) => task.status === TaskStatus.DONE).length;
  const completionRate = todayTasks.length > 0 ? (completedCount / todayTasks.length) * 100 : 0;

  const getTimeUntil = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const taskTime = new Date();
    taskTime.setHours(hours, minutes, 0, 0);
    const diff = taskTime.getTime() - now.getTime();
    const hoursUntil = Math.floor(diff / (1000 * 60 * 60));
    const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursUntil > 0) {
      return `in ${hoursUntil}h ${minutesUntil}m`;
    } else if (minutesUntil > 0) {
      return `in ${minutesUntil}m`;
    } else {
      return 'now';
    }
  };

  const getGreeting = (): string => {
    const hour = now.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text mb-1">
            {getGreeting()}! 👋
          </h2>
          <p className="text-slate-400 text-sm">Here's what you should focus on today</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-cyan-400">{completedCount}</div>
          <div className="text-xs text-slate-400">of {todayTasks.length} done</div>
        </div>
      </div>

      {/* Progress Bar */}
      {todayTasks.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-400">Today's Progress</span>
            <span className="text-cyan-400 font-bold">{Math.round(completionRate)}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}

      {/* High Priority Tasks */}
      {highPriorityTasks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              🔥 High Priority
            </h3>
            <Link to="/" className="text-xs text-cyan-400 hover:text-cyan-300">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {highPriorityTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/15 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">{task.title}</div>
                    {task.startTime && (
                      <div className="text-xs text-slate-400 mt-1">
                        🕐 {task.startTime.split(':').slice(0, 2).join(':')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              ⏰ Coming Up Soon
            </h3>
            <Link to="/" className="text-xs text-cyan-400 hover:text-cyan-300">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/15 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">{task.title}</div>
                    {task.startTime && (
                      <div className="text-xs text-cyan-400 mt-1">
                        🕐 {task.startTime.split(':').slice(0, 2).join(':')} ({getTimeUntil(task.startTime)})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Habits to Check In */}
      {habitsToCheckIn.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              ✅ Habits to Check In
            </h3>
            <Link to="/habits" className="text-xs text-cyan-400 hover:text-cyan-300">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {habitsToCheckIn.slice(0, 3).map((habit) => (
              <div
                key={habit.id}
                className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/15 transition-colors"
              >
                <div className="font-medium text-white text-sm">{habit.name}</div>
                {habit.description && (
                  <div className="text-xs text-slate-400 mt-1">{habit.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="border-t border-slate-700/50 pt-4">
        <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/"
            className="p-3 bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50 rounded-lg text-center transition-colors"
          >
            <div className="text-2xl mb-1">📝</div>
            <div className="text-xs text-slate-300">Add Task</div>
          </Link>
          <Link
            to="/habits"
            className="p-3 bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50 rounded-lg text-center transition-colors"
          >
            <div className="text-2xl mb-1">✅</div>
            <div className="text-xs text-slate-300">Check Habits</div>
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {pendingTasks.length === 0 && habitsToCheckIn.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🎉</div>
          <div className="text-white font-medium mb-1">All caught up!</div>
          <div className="text-sm text-slate-400">You have no pending tasks for today</div>
          <Link to="/" className="btn-primary mt-4 inline-block">
            Add Your First Task
          </Link>
        </div>
      )}
    </div>
  );
}

