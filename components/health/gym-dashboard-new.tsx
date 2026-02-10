'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { RoutinesManager } from './routines-manager';
import { WeeklyGymTracker } from './weekly-gym-tracker';
import { StrengthMetricsDashboard } from './strength-metrics';
import { WorkoutHistory } from './workout-history';
import { ActiveWorkout } from './active-workout';

export function GymDashboardNew() {
  // Active Workout State
  const [activeWorkout, setActiveWorkout] = useState<{
    sessionId: string;
    routineId: string;
    routineName: string;
  } | null>(null);

  useEffect(() => {
    // Check for active workout in URL params
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('sessionId');
    const routineId = params.get('routineId');
    const routineName = params.get('routineName');
    
    if (sessionId && routineId && routineName) {
      setActiveWorkout({ sessionId, routineId, routineName });
    }
  }, []);

  const handleFinishWorkout = () => {
    setActiveWorkout(null);
    // Clear URL params
    window.history.replaceState({}, '', '/dashboard/health');
  };

  const handleCancelWorkout = () => {
    if (confirm('¿Cancelar el entrenamiento? Se perderán los sets no guardados.')) {
      setActiveWorkout(null);
      window.history.replaceState({}, '', '/dashboard/health');
    }
  };

  // Show Active Workout if there is one
  if (activeWorkout) {
    return (
      <ActiveWorkout
        sessionId={activeWorkout.sessionId}
        routineId={activeWorkout.routineId}
        routineName={activeWorkout.routineName}
        onFinish={handleFinishWorkout}
        onCancel={handleCancelWorkout}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="routines" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="routines" className="flex items-center gap-2 py-3">
            <Dumbbell size={18} />
            <span className="hidden sm:inline">Rutinas</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2 py-3">
            <TrendingUp size={18} />
            <span className="hidden sm:inline">Métricas</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2 py-3">
            <Calendar size={18} />
            <span className="hidden sm:inline">Historial</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2 py-3">
            <BarChart3 size={18} />
            <span className="hidden sm:inline">Progreso</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Rutinas */}
        <TabsContent value="routines" className="space-y-6 mt-6">
          <RoutinesManager />
        </TabsContent>

        {/* Tab: Métricas de Fuerza */}
        <TabsContent value="metrics" className="space-y-6 mt-6">
          <StrengthMetricsDashboard />
        </TabsContent>

        {/* Tab: Historial */}
        <TabsContent value="history" className="space-y-6 mt-6">
          <WorkoutHistory />
        </TabsContent>

        {/* Tab: Progreso Semanal */}
        <TabsContent value="progress" className="space-y-6 mt-6">
          <WeeklyGymTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}
