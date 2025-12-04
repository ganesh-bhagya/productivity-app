import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useTasksStore } from '../store/tasksStore';
import { useHabitsStore } from '../store/habitsStore';
import { Task, TaskCategory, TaskStatus, TimeBlock, TaskPriority } from '../types';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import QuickTaskForm from '../components/QuickTaskForm';
import TodaysFocus from '../components/TodaysFocus';
import { notificationService } from '../services/notifications';

const TIME_BLOCKS: { value: TimeBlock; label: string; icon: string }[] = [
  { value: TimeBlock.MORNING, label: 'Morning', icon: '🌅' },
  { value: TimeBlock.WORK_HOURS, label: 'Work Hours', icon: '💼' },
  { value: TimeBlock.EVENING, label: 'Evening', icon: '🌆' },
  { value: TimeBlock.LATE_NIGHT, label: 'Late Night', icon: '🌙' },
];

export default function TodayPage() {
  const [layout, setLayout] = useState<'timeline' | 'checklist'>('timeline');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showQuickTaskForm, setShowQuickTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'title'>('priority');
  const { tasks, fetchTasks, updateTask, deleteTask } = useTasksStore();
  
  // Also fetch habits for the focus component
  const { fetchHabits } = useHabitsStore();

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchTasks({ date: today });
    fetchHabits(true); // Fetch active habits only
    // Request notification permission on mount
    notificationService.requestPermission();
  }, [today, fetchTasks, fetchHabits]);

  // Schedule reminders for tasks with start times
  useEffect(() => {
    notificationService.cancelAllReminders();
    
    tasks.forEach((task) => {
      if (task.startTime && task.status === TaskStatus.PENDING) {
        const [hours, minutes] = task.startTime.split(':').map(Number);
        const reminderTime = new Date();
        reminderTime.setHours(hours, minutes, 0, 0);
        
        // Schedule reminder 5 minutes before task start time
        const reminder = new Date(reminderTime.getTime() - 5 * 60 * 1000);
        
        if (reminder > new Date()) {
          notificationService.scheduleTaskReminder(task.id, task.title, reminder);
        }
      }
    });

    return () => {
      notificationService.cancelAllReminders();
    };
  }, [tasks]);

  // Filter and sort tasks
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch = 
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;

    // Status filter
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;

    // Priority filter
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { [TaskPriority.HIGH]: 3, [TaskPriority.MEDIUM]: 2, [TaskPriority.LOW]: 1 };
        return (priorityOrder[b.priority || TaskPriority.MEDIUM] || 0) - (priorityOrder[a.priority || TaskPriority.MEDIUM] || 0);
      case 'time':
        if (!a.startTime && !b.startTime) return 0;
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return a.startTime.localeCompare(b.startTime);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const tasksByTimeBlock = TIME_BLOCKS.reduce((acc, block) => {
    acc[block.value] = sortedTasks.filter((task) => task.timeBlock === block.value);
    return acc;
  }, {} as Record<TimeBlock, Task[]>);

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
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

  const completedCount = filteredTasks.filter((t) => t.status === TaskStatus.DONE).length;
  const totalCount = filteredTasks.length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Today's Focus Guide */}
      <TodaysFocus />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Today's Tasks</h1>
          <p className="text-slate-300 text-lg">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="text-xs sm:text-sm text-slate-300 bg-white/5 px-3 sm:px-4 py-2 rounded-xl border border-white/10">
            <span className="font-semibold text-cyan-400">{completedCount}</span>
            <span className="text-slate-400"> / </span>
            <span className="text-slate-300">{totalCount}</span>
            <span className="text-slate-400 ml-1 hidden sm:inline">completed</span>
          </div>
          <div className="flex gap-1 sm:gap-2 bg-slate-800/60 backdrop-blur-sm rounded-xl p-1 border border-slate-700/50">
            <button
              onClick={() => setLayout('timeline')}
              className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                layout === 'timeline'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setLayout('checklist')}
              className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                layout === 'checklist'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Checklist
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowQuickTaskForm(true)} 
              className="btn-secondary text-xs sm:text-sm md:text-base"
            >
              Quick Add
            </button>
            <button onClick={() => setShowTaskForm(true)} className="btn-primary text-xs sm:text-sm md:text-base">
              + Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card animate-slide-up">
        <div className="space-y-4">
          {/* Search Bar */}
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="input-field"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as TaskCategory | 'all')}
                className="input-field text-sm py-2"
              >
                <option value="all">All</option>
                {Object.values(TaskCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
                className="input-field text-sm py-2"
              >
                <option value="all">All</option>
                {Object.values(TaskStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
                className="input-field text-sm py-2"
              >
                <option value="all">All</option>
                {Object.values(TaskPriority).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'priority' | 'time' | 'title')}
                className="input-field text-sm py-2"
              >
                <option value="priority">Priority</option>
                <option value="time">Time</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>

          {/* Active Filters Indicator */}
          {(searchQuery || filterCategory !== 'all' || filterStatus !== 'all' || filterPriority !== 'all') && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Active filters:</span>
              {searchQuery && (
                <span className="bg-slate-700/50 px-2 py-1 rounded">Search: "{searchQuery}"</span>
              )}
              {filterCategory !== 'all' && (
                <span className="bg-slate-700/50 px-2 py-1 rounded">Category: {filterCategory}</span>
              )}
              {filterStatus !== 'all' && (
                <span className="bg-slate-700/50 px-2 py-1 rounded">Status: {filterStatus}</span>
              )}
              {filterPriority !== 'all' && (
                <span className="bg-slate-700/50 px-2 py-1 rounded">Priority: {filterPriority}</span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterCategory('all');
                  setFilterStatus('all');
                  setFilterPriority('all');
                }}
                className="text-cyan-400 hover:text-cyan-300 ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="card animate-slide-up">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-slate-200 font-medium">Today's Progress</span>
            <span className="text-cyan-400 font-bold">
              {Math.round((completedCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/30"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Tasks by Time Block */}
      {layout === 'timeline' ? (
        tasks.length === 0 ? (
          <div className="card text-center py-16 animate-slide-up">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-slate-300 text-lg mb-2">No tasks for today</p>
            <p className="text-slate-400 text-sm mb-6">Get started by adding your first task!</p>
            <button onClick={() => setShowTaskForm(true)} className="btn-primary">
              + Add Your First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {TIME_BLOCKS.map((block) => {
              const blockTasks = tasksByTimeBlock[block.value];
              if (blockTasks.length === 0) return null;

              const completedInBlock = blockTasks.filter((t) => t.status === TaskStatus.DONE).length;

              return (
                <div key={block.value} className="card animate-slide-up">
                  {/* Time Block Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{block.icon}</span>
                      <h2 className="text-base font-bold text-white">{block.label}</h2>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full">
                      {completedInBlock}/{blockTasks.length}
                    </span>
                  </div>
                  {/* Tasks Grid */}
                  <div className="space-y-3">
                    {blockTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onClick={() => handleTaskClick(task)}
                        onComplete={() => handleTaskComplete(task)}
                        onDelete={() => handleTaskDelete(task.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )
        ) : (
          <div className="card">
            <div className="space-y-3">
              {sortedTasks.length === 0 ? (
                <p className="text-slate-400 text-center py-12">
                  {tasks.length === 0 ? 'No tasks for today' : 'No tasks match your filters'}
                </p>
              ) : (
                sortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => handleTaskClick(task)}
                    onComplete={() => handleTaskComplete(task)}
                    onDelete={() => handleTaskDelete(task.id)}
                  />
                ))
              )}
            </div>
          </div>
        )}

      {/* Quick Task Form Modal */}
      {showQuickTaskForm && (
        <QuickTaskForm
          defaultDate={today}
          onClose={() => setShowQuickTaskForm(false)}
        />
      )}

      {/* Full Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          defaultDate={today}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

