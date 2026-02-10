'use client';

import { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Target } from 'lucide-react';
import { getWeeklyGymAttendance } from '@/lib/actions/health';
import { format, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeeklyData {
  days_attended: number;
  goal: number;
  week_start: string;
  week_end: string;
  dates: string[];
}

export function WeeklyGymTracker() {
  const [weeklyData, setWeeklyData] = useState<WeeklyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await getWeeklyGymAttendance();
    if (result.success && result.data) {
      setWeeklyData(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!weeklyData) {
    return null;
  }

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Lunes
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const attendedDates = new Set(weeklyData.dates.map(d => format(new Date(d), 'yyyy-MM-dd')));

  const progress = (weeklyData.days_attended / weeklyData.goal) * 100;
  const isOnTrack = weeklyData.days_attended >= weeklyData.goal;
  const remaining = Math.max(0, weeklyData.goal - weeklyData.days_attended);

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Asistencia Semanal</h3>
        </div>
        <div className="flex items-center gap-2">
          {isOnTrack ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Target className="h-5 w-5 text-yellow-500" />
          )}
          <span className="text-sm font-medium">
            {weeklyData.days_attended}/{weeklyData.goal} días
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isOnTrack ? 'bg-green-500' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        {!isOnTrack && remaining > 0 && (
          <p className="text-sm text-muted-foreground">
            Te faltan {remaining} {remaining === 1 ? 'día' : 'días'} para cumplir tu meta
          </p>
        )}
        {isOnTrack && (
          <p className="text-sm text-green-500">
            ¡Meta cumplida! 🎉
          </p>
        )}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day, index) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isAttended = attendedDates.has(dateStr);
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          const isPast = day < new Date() && !isToday;

          return (
            <div
              key={index}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                isAttended
                  ? 'bg-green-500/20 border-green-500/50'
                  : isPast
                  ? 'bg-red-500/10 border-red-500/20'
                  : isToday
                  ? 'bg-primary/20 border-primary/50'
                  : 'bg-muted border-border'
              }`}
            >
              <span className="text-xs text-muted-foreground mb-1">
                {format(day, 'EEE', { locale: es }).toUpperCase()}
              </span>
              <span className={`text-lg font-bold ${isToday ? 'text-primary' : ''}`}>
                {format(day, 'd')}
              </span>
              <div className="mt-1">
                {isAttended ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : isPast ? (
                  <XCircle className="h-4 w-4 text-red-500/50" />
                ) : (
                  <div className="h-4 w-4" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-mono font-bold text-green-500">
            {weeklyData.days_attended}
          </p>
          <p className="text-xs text-muted-foreground">Completados</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-mono font-bold text-yellow-500">
            {remaining}
          </p>
          <p className="text-xs text-muted-foreground">Restantes</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-mono font-bold text-primary">
            {Math.round(progress)}%
          </p>
          <p className="text-xs text-muted-foreground">Progreso</p>
        </div>
      </div>
    </div>
  );
}
