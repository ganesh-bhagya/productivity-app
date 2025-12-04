import { useState, useEffect } from 'react';

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const [showOnMount, setShowOnMount] = useState(false);

  useEffect(() => {
    // Show help on first visit (stored in localStorage)
    const hasSeenHelp = localStorage.getItem('has-seen-keyboard-shortcuts');
    if (!hasSeenHelp) {
      setShowOnMount(true);
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setShowOnMount(false);
    localStorage.setItem('has-seen-keyboard-shortcuts', 'true');
  };

  if (!isOpen && !showOnMount) return null;

  const shortcuts = [
    { keys: ['Alt', '1'], description: 'Go to Today' },
    { keys: ['Alt', '2'], description: 'Go to Week' },
    { keys: ['Alt', '3'], description: 'Go to Habits' },
    { keys: ['Alt', '4'], description: 'Go to Analytics' },
    { keys: ['Alt', '5'], description: 'Go to Settings' },
    { keys: ['Esc'], description: 'Close modals/dialogs' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass rounded-2xl max-w-md w-full shadow-2xl border-white/20 animate-scale-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold gradient-text">Keyboard Shortcuts</h2>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white text-2xl hover:bg-white/5 rounded-lg p-1 transition-all duration-200 w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
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
            <button onClick={handleClose} className="btn-primary w-full">
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

