import { useEffect, useState } from 'react';
import { format, startOfWeek } from 'date-fns';
import { apiService } from '../services/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [habitsStats, setHabitsStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    loadStats();
  }, [selectedWeek]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const weekStart = startOfWeek(new Date(selectedWeek), { weekStartsOn: 1 });
      const weekStartStr = format(weekStart, 'yyyy-MM-dd');
      const weekEndStr = format(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

      const [weekly, habits] = await Promise.all([
        apiService.getWeeklyStats(weekStartStr),
        apiService.getHabitsStats(weekStartStr, weekEndStr),
      ]);

      setWeeklyStats(weekly);
      setHabitsStats(habits);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const current = new Date(selectedWeek);
    setSelectedWeek(format(new Date(current.getTime() + (direction === 'next' ? 7 : -7) * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading analytics...</div>
      </div>
    );
  }

  const categoryChartData = weeklyStats?.tasks_by_category?.map((cat: any) => ({
    name: cat.category,
    tasks: cat.count,
    effort: Math.round(cat.total_effort / 60), // Convert to hours
  })) || [];

  const habitsChartData = habitsStats.map((habit) => ({
    name: habit.name,
    completion: Math.round(habit.completion_rate),
    streak: habit.current_streak,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Analytics</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={() => navigateWeek('prev')} className="btn-secondary flex-1 sm:flex-none text-xs sm:text-sm">
            ← Prev Week
          </button>
          <button onClick={() => setSelectedWeek(format(new Date(), 'yyyy-MM-dd'))} className="btn-secondary flex-1 sm:flex-none text-xs sm:text-sm">
            This Week
          </button>
          <button onClick={() => navigateWeek('next')} className="btn-secondary flex-1 sm:flex-none text-xs sm:text-sm">
            Next Week →
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-sm text-slate-400 mb-1">Completion Rate</div>
          <div className="text-3xl font-bold text-white">
            {weeklyStats?.completion_rate?.toFixed(1) || 0}%
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-400 mb-1">Total Tasks</div>
          <div className="text-3xl font-bold text-white">
            {weeklyStats?.total_tasks || 0}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-400 mb-1">Completed Tasks</div>
          <div className="text-3xl font-bold text-white">
            {weeklyStats?.completed_tasks || 0}
          </div>
        </div>
      </div>

      {/* Tasks by Category */}
      {categoryChartData.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Tasks by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Legend />
              <Bar dataKey="tasks" fill="#0ea5e9" name="Tasks" />
              <Bar dataKey="effort" fill="#8b5cf6" name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Habits Performance */}
      {habitsChartData.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Habits Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={habitsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="completion"
                stroke="#10b981"
                name="Completion %"
              />
              <Line type="monotone" dataKey="streak" stroke="#f59e0b" name="Streak (days)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Habits List */}
      {habitsStats.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Habits Details</h2>
          <div className="space-y-3">
            {habitsStats.map((habit) => (
              <div key={habit.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <div>
                  <div className="font-medium text-white">{habit.name}</div>
                  <div className="text-sm text-slate-400">
                    {habit.checkins_count} check-ins | Target: {habit.target_value}x
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-bold">{habit.current_streak} 🔥</div>
                  <div className="text-sm text-slate-400">{habit.completion_rate.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

