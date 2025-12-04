import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      // Ctrl/Cmd + K for quick search (could be implemented)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Could open a command palette here
      }

      // Number keys for navigation
      if (e.altKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            navigate('/');
            break;
          case '2':
            e.preventDefault();
            navigate('/week');
            break;
          case '3':
            e.preventDefault();
            navigate('/habits');
            break;
          case '4':
            e.preventDefault();
            navigate('/analytics');
            break;
          case '5':
            e.preventDefault();
            navigate('/settings');
            break;
        }
      }

      // Escape to close modals (handled by individual components)
      if (e.key === 'Escape') {
        // This is handled by individual modal components
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);
}

