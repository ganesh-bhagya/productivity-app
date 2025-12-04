import { useState, useEffect, useRef } from 'react';

interface PomodoroTimerProps {
  taskId?: number;
  taskTitle?: string;
  onComplete?: () => void;
}

export default function PomodoroTimer({ taskTitle, onComplete }: PomodoroTimerProps) {

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes

  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'short-break' | 'long-break'>('pomodoro');
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Play notification sound
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Complete! 🎉', {
        body: mode === 'pomodoro' 
          ? 'Time for a break!' 
          : 'Ready to get back to work?',
        icon: '/favicon.ico',
      });
    }

    if (mode === 'pomodoro') {
      setPomodoroCount((prev) => prev + 1);
      // Auto-start short break after pomodoro
      if ((pomodoroCount + 1) % 4 === 0) {
        setMode('long-break');
        setTimeLeft(LONG_BREAK);
      } else {
        setMode('short-break');
        setTimeLeft(SHORT_BREAK);
      }
    } else {
      // Break complete, back to pomodoro
      setMode('pomodoro');
      setTimeLeft(POMODORO_DURATION);
    }

    if (onComplete) {
      onComplete();
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    switch (mode) {
      case 'pomodoro':
        setTimeLeft(POMODORO_DURATION);
        break;
      case 'short-break':
        setTimeLeft(SHORT_BREAK);
        break;
      case 'long-break':
        setTimeLeft(LONG_BREAK);
        break;
    }
  };

  const switchMode = (newMode: 'pomodoro' | 'short-break' | 'long-break') => {
    setIsRunning(false);
    setMode(newMode);
    switch (newMode) {
      case 'pomodoro':
        setTimeLeft(POMODORO_DURATION);
        break;
      case 'short-break':
        setTimeLeft(SHORT_BREAK);
        break;
      case 'long-break':
        setTimeLeft(LONG_BREAK);
        break;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (() => {
    let total;
    switch (mode) {
      case 'pomodoro':
        total = POMODORO_DURATION;
        break;
      case 'short-break':
        total = SHORT_BREAK;
        break;
      case 'long-break':
        total = LONG_BREAK;
        break;
    }
    return ((total - timeLeft) / total) * 100;
  })();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Pomodoro Timer</h3>
          {taskTitle && (
            <p className="text-sm text-slate-400">Focusing on: {taskTitle}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 mb-1">Completed</div>
          <div className="text-xl font-bold text-cyan-400">{pomodoroCount}</div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => switchMode('pomodoro')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            mode === 'pomodoro'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800/70'
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => switchMode('short-break')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            mode === 'short-break'
              ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800/70'
          }`}
        >
          Short Break
        </button>
        <button
          onClick={() => switchMode('long-break')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            mode === 'long-break'
              ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800/70'
          }`}
        >
          Long Break
        </button>
      </div>

      {/* Timer Display */}
      <div className="relative mb-6">
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-700"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                className={`transition-all duration-1000 ${
                  mode === 'pomodoro'
                    ? 'text-cyan-500'
                    : mode === 'short-break'
                    ? 'text-green-500'
                    : 'text-purple-500'
                }`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">{formatTime(timeLeft)}</div>
                <div className="text-xs text-slate-400">
                  {mode === 'pomodoro' ? 'Focus Time' : mode === 'short-break' ? 'Short Break' : 'Long Break'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!isRunning ? (
          <button onClick={startTimer} className="btn-primary flex-1">
            Start
          </button>
        ) : (
          <button onClick={pauseTimer} className="btn-secondary flex-1">
            Pause
          </button>
        )}
        <button onClick={resetTimer} className="btn-secondary">
          Reset
        </button>
      </div>
    </div>
  );
}

