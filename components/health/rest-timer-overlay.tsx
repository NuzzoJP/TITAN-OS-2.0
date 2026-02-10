'use client';

import { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RestTimerOverlayProps {
  isActive: boolean;
  initialSeconds: number;
  exerciseName: string;
  onComplete: () => void;
  onSkip: () => void;
}

export function RestTimerOverlay({
  isActive,
  initialSeconds,
  exerciseName,
  onComplete,
  onSkip,
}: RestTimerOverlayProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (isActive) {
      setSecondsLeft(initialSeconds);
      setTotalSeconds(initialSeconds);
      setIsPaused(false);
    }
  }, [isActive, initialSeconds]);

  useEffect(() => {
    if (!isActive || isPaused || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Timer completado
          clearInterval(interval);
          onComplete();
          
          // Vibración si está disponible
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
          
          // Notificación
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('¡Descanso terminado!', {
              body: `Listo para el siguiente set de ${exerciseName}`,
              icon: '/icon-192.png',
            });
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, secondsLeft, exerciseName, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const adjustTime = (delta: number) => {
    setSecondsLeft((prev) => Math.max(0, prev + delta));
    setTotalSeconds((prev) => Math.max(0, prev + delta));
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center">
      {/* Progress Ring */}
      <div className="relative w-80 h-80 mb-8">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-muted/20"
          />
          {/* Progress Circle */}
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 140}`}
            strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
            className={`transition-all duration-1000 ${
              secondsLeft <= 10 ? 'text-red-500' : 'text-primary'
            }`}
            strokeLinecap="round"
          />
        </svg>

        {/* Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground mb-2">Descansando</p>
          <p
            className={`text-8xl font-mono font-bold transition-colors ${
              secondsLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-foreground'
            }`}
          >
            {formatTime(secondsLeft)}
          </p>
          <p className="text-lg text-muted-foreground mt-4">{exerciseName}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12"
          onClick={() => adjustTime(-15)}
        >
          <Minus className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? (
            <Play className="h-6 w-6" />
          ) : (
            <Pause className="h-6 w-6" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12"
          onClick={() => adjustTime(15)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Skip Button */}
      <Button
        variant="ghost"
        size="lg"
        onClick={onSkip}
        className="text-muted-foreground hover:text-foreground"
      >
        <SkipForward className="mr-2 h-5 w-5" />
        Saltar descanso
      </Button>

      {/* Quick Adjust */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSecondsLeft(60);
            setTotalSeconds(60);
          }}
        >
          1:00
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSecondsLeft(90);
            setTotalSeconds(90);
          }}
        >
          1:30
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSecondsLeft(120);
            setTotalSeconds(120);
          }}
        >
          2:00
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSecondsLeft(180);
            setTotalSeconds(180);
          }}
        >
          3:00
        </Button>
      </div>
    </div>
  );
}
