'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { usePrivacy } from '@/lib/contexts/privacy-context';

export function Header() {
  const [greeting, setGreeting] = useState('');
  const { privacyMode, togglePrivacyMode } = usePrivacy();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-8">
      {/* Greeting */}
      <div>
        <h2 className="text-xl font-semibold">{greeting}</h2>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Privacy Toggle */}
      <button
        onClick={togglePrivacyMode}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
          ${
            privacyMode
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border hover:bg-accent'
          }
        `}
        title={privacyMode ? 'Desactivar Modo Privado' : 'Activar Modo Privado'}
      >
        {privacyMode ? <EyeOff size={18} /> : <Eye size={18} />}
        <span className="text-sm font-medium">
          {privacyMode ? 'Privado' : 'Visible'}
        </span>
      </button>
    </header>
  );
}
