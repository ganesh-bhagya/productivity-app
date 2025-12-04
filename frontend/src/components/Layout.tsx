import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useEffect, useState } from 'react';

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Press ? to show keyboard shortcuts
      if (e.key === '?' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        setShowShortcuts(true);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const navItems = [
    { path: '/', label: 'Today', icon: '📅' },
    { path: '/week', label: 'Week', icon: '📆' },
    { path: '/habits', label: 'Habits', icon: '✅' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl header-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold gradient-text">Productivity</h1>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 nav-link ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-blue-600/80 to-cyan-500/80 text-white shadow-lg shadow-blue-500/30 nav-link-active'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white nav-link-inactive'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowShortcuts(true)}
                className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all duration-200 text-sm header-button"
                title="Keyboard shortcuts (Press ?)"
              >
                ⌨️
              </button>
              <button
                onClick={toggleTheme}
                className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all duration-200 header-button"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <div className="hidden sm:flex items-center space-x-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 user-info">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm user-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-200 text-sm font-medium user-name">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-slate-300 hover:text-white text-sm px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200 header-button"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 backdrop-blur-xl mobile-nav">
        <div className="flex justify-around items-center h-20 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all duration-200 mobile-nav-link ${
                location.pathname === item.path
                  ? 'bg-gradient-to-t from-blue-600/30 to-transparent text-cyan-400 mobile-nav-link-active'
                  : 'text-slate-400 hover:text-white mobile-nav-link-inactive'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Keyboard Shortcuts Help */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass rounded-2xl max-w-md w-full shadow-2xl border-white/20 animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold gradient-text">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="text-slate-400 hover:text-white text-2xl hover:bg-white/5 rounded-lg p-1 transition-all duration-200 w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { keys: ['Alt', '1'], description: 'Go to Today' },
                  { keys: ['Alt', '2'], description: 'Go to Week' },
                  { keys: ['Alt', '3'], description: 'Go to Habits' },
                  { keys: ['Alt', '4'], description: 'Go to Analytics' },
                  { keys: ['Alt', '5'], description: 'Go to Settings' },
                  { keys: ['?'], description: 'Show this help' },
                  { keys: ['Esc'], description: 'Close modals/dialogs' },
                ].map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <span className="text-slate-300 text-sm">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex}>
                          <kbd className="px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-xs font-mono text-slate-200">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-slate-500">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <button onClick={() => setShowShortcuts(false)} className="btn-primary w-full">
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

