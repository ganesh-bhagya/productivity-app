import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }

    setDeferredPrompt(null);
  };

  if (!showInstallButton) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="card bg-gradient-to-r from-blue-600 to-cyan-500 p-4 shadow-2xl max-w-sm">
        <div className="flex items-center gap-3">
          <div className="text-3xl">📱</div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">Install App</h3>
            <p className="text-blue-100 text-sm">Add to home screen for quick access</p>
          </div>
          <button
            onClick={handleInstallClick}
            className="btn-secondary bg-white/20 hover:bg-white/30 text-white border-white/30 px-4 py-2 text-sm"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}

