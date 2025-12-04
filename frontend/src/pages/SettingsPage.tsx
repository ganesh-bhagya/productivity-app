import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useTasksStore } from '../store/tasksStore';
import { useHabitsStore } from '../store/habitsStore';
import { apiService } from '../services/api';
import { RoutineTemplate } from '../types';
import { exportTasksToCSV, exportTasksToJSON, exportHabitsToCSV } from '../utils/export';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();
  const [templates, setTemplates] = useState<RoutineTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await apiService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTemplate = async (templateId: number) => {
    const today = new Date().toISOString().split('T')[0];
    if (confirm('Apply this template to today? This will create tasks for today.')) {
      try {
        await apiService.applyTemplate(templateId, today);
        alert('Template applied successfully!');
      } catch (error) {
        alert('Failed to apply template');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Theme Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium">Theme</div>
            <div className="text-sm text-slate-400">Switch between dark and light mode</div>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 transition-all duration-200"
          >
            <span className="text-2xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
            <span className="text-white text-sm font-medium">
              {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <div className="text-white">{user?.name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <div className="text-white">{user?.email}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Timezone</label>
            <div className="text-white">{user?.timezone}</div>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Routine Templates</h2>
        {loading ? (
          <div className="text-slate-400">Loading templates...</div>
        ) : templates.length === 0 ? (
          <div className="text-slate-400">No templates yet. Create templates to quickly set up your day!</div>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex justify-between items-center p-3 bg-slate-700 rounded-lg"
              >
                <div>
                  <div className="font-medium text-white">{template.name}</div>
                  <div className="text-sm text-slate-400">
                    {template.dayType} • {template.blocks.length} time blocks
                  </div>
                </div>
                <button
                  onClick={() => handleApplyTemplate(template.id)}
                  className="btn-primary text-sm"
                >
                  Apply Today
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Export */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Export Data</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Export Tasks</div>
              <div className="text-sm text-slate-400">Download your tasks as CSV or JSON</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportTasksToCSV(tasks)}
                className="btn-secondary text-sm"
                disabled={tasks.length === 0}
              >
                CSV
              </button>
              <button
                onClick={() => exportTasksToJSON(tasks)}
                className="btn-secondary text-sm"
                disabled={tasks.length === 0}
              >
                JSON
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Export Habits</div>
              <div className="text-sm text-slate-400">Download your habits as CSV</div>
            </div>
            <button
              onClick={() => exportHabitsToCSV(habits)}
              className="btn-secondary text-sm"
              disabled={habits.length === 0}
            >
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="card">
        <button onClick={logout} className="btn-secondary w-full">
          Logout
        </button>
      </div>
    </div>
  );
}

