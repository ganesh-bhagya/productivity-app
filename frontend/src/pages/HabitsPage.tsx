import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useHabitsStore } from '../store/habitsStore';
import { Habit } from '../types';
import HabitForm from '../components/HabitForm';

export default function HabitsPage() {
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const { habits, fetchHabits, deleteHabit, checkinHabit, streaks, fetchHabitCheckins } =
    useHabitsStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchHabits(true); // Only active habits
  }, [fetchHabits]);

  useEffect(() => {
    // Fetch check-ins for all habits
    habits.forEach((habit) => {
      const weekAgo = format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      fetchHabitCheckins(habit.id, weekAgo, today);
    });
  }, [habits, today, fetchHabitCheckins]);

  const handleCheckin = async (habit: Habit) => {
    try {
      await checkinHabit(habit.id, { date: today });
      await fetchHabitCheckins(habit.id, today, today);
    } catch (error) {
      console.error('Failed to check in:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      await deleteHabit(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Habits</h1>
          <p className="text-slate-300 text-lg">Track your daily habits and build streaks</p>
        </div>
        <button onClick={() => setShowHabitForm(true)} className="btn-primary text-xs sm:text-sm md:text-base">
          + New Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="card text-center py-16 animate-slide-up">
          <div className="text-6xl mb-6">🎯</div>
          <p className="text-slate-300 text-lg mb-6">No habits yet. Create your first habit!</p>
          <button onClick={() => setShowHabitForm(true)} className="btn-primary">
            Create Habit
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit, index) => {
            const streak = streaks[habit.id] || 0;
            const isCheckedIn = false; // TODO: Check if today is checked in

            return (
              <div key={habit.id} className="card animate-slide-up hover:scale-[1.02] transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{habit.name}</h3>
                    {habit.description && (
                      <p className="text-sm text-slate-300 leading-relaxed">{habit.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200 text-xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm bg-white/5 px-4 py-2.5 rounded-xl border border-white/10">
                    <span className="text-slate-400">Target:</span>
                    <span className="text-white font-semibold">
                      {habit.targetValue}x {habit.targetType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-4 py-2.5 rounded-xl border border-blue-500/30">
                    <span className="text-slate-300">Current Streak:</span>
                    <span className="text-cyan-400 font-bold text-base">{streak} days 🔥</span>
                  </div>

                  <button
                    onClick={() => handleCheckin(habit)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                      isCheckedIn
                        ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-green-500/25 hover:scale-105'
                        : 'btn-primary'
                    }`}
                  >
                    {isCheckedIn ? '✓ Checked In' : 'Check In'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showHabitForm && (
        <HabitForm
          habit={editingHabit}
          onClose={() => {
            setShowHabitForm(false);
            setEditingHabit(null);
          }}
        />
      )}
    </div>
  );
}

