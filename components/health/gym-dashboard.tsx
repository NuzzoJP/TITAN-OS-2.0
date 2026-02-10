'use client';

import { useEffect, useState } from 'react';
import { Plus, Dumbbell, TrendingUp, Activity, Target, Calendar } from 'lucide-react';
import {
  getExercises,
  getRecentSessions,
  getProgressStats,
  getTopExercises,
  getSetsBySession,
} from '@/lib/actions/health';
import type { Exercise, WorkoutSession } from '@/lib/actions/health';
import { LogWorkoutModal } from './log-workout-modal';
import { AddExerciseModal } from './add-exercise-modal';
import { ActiveWorkout } from './active-workout';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function GymDashboard() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    monthSessions: 0,
    totalSets: 0,
    uniqueExercises: 0,
  });
  const [topExercises, setTopExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [sessionSets, setSessionSets] = useState<Record<string, any[]>>({});
  
  // Active Workout State
  const [activeWorkout, setActiveWorkout] = useState<{
    sessionId: string;
    routineId: string;
    routineName: string;
  } | null>(null);

  useEffect(() => {
    loadData();
    
    // Check for active workout in URL params
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('sessionId');
    const routineId = params.get('routineId');
    const routineName = params.get('routineName');
    
    if (sessionId && routineId && routineName) {
      setActiveWorkout({ sessionId, routineId, routineName });
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [exercisesData, sessionsData, statsData, topData] = await Promise.all([
        getExercises(),
        getRecentSessions(10),
        getProgressStats(),
        getTopExercises(5),
      ]);

      setExercises(exercisesData);
      setSessions(sessionsData);
      setStats(statsData);
      setTopExercises(topData);
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowWorkoutModal(false);
    setShowExerciseModal(false);
    loadData();
  };

  const toggleSession = async (sessionId: string) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
    } else {
      setExpandedSession(sessionId);
      if (!sessionSets[sessionId]) {
        const sets = await getSetsBySession(sessionId);
        setSessionSets({ ...sessionSets, [sessionId]: sets });
      }
    }
  };

  const handleFinishWorkout = () => {
    setActiveWorkout(null);
    // Clear URL params
    window.history.replaceState({}, '', '/dashboard/health');
    loadData();
  };

  const handleCancelWorkout = () => {
    if (confirm('¿Cancelar el entrenamiento? Se perderán los sets no guardados.')) {
      setActiveWorkout(null);
      window.history.replaceState({}, '', '/dashboard/health');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Seguimiento de entrenamiento físico</p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowExerciseModal(true)}
            className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
          >
            <Dumbbell size={18} />
            <span>Nuevo Ejercicio</span>
          </button>
          <button
            onClick={() => setShowWorkoutModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Registrar Entrenamiento</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Entrenamientos</p>
            <Calendar className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold">{stats.totalSessions}</p>
          <p className="text-xs text-muted-foreground mt-1">Total registrados</p>
        </div>

        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Este Mes</p>
            <TrendingUp className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold">{stats.monthSessions}</p>
          <p className="text-xs text-muted-foreground mt-1">Sesiones completadas</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Series Totales</p>
            <Activity className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold">{stats.totalSets}</p>
          <p className="text-xs text-muted-foreground mt-1">Sets completados</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Ejercicios</p>
            <Target className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold">{stats.uniqueExercises}</p>
          <p className="text-xs text-muted-foreground mt-1">Diferentes realizados</p>
        </div>
      </div>

      {/* Top Exercises */}
      {topExercises.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Top Ejercicios por Volumen</h3>
          <div className="space-y-3">
            {topExercises.map((exercise, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-background rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-xs text-muted-foreground">{exercise.muscle_group}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{exercise.volume.toFixed(0)} kg</p>
                  <p className="text-xs text-muted-foreground">{exercise.sets} sets</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Entrenamientos Recientes</h3>
        {sessions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No hay entrenamientos registrados
          </p>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div key={session.id}>
                <button
                  onClick={() => toggleSession(session.id)}
                  className="w-full flex items-center justify-between p-4 bg-background border border-border rounded-lg hover:bg-accent transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Dumbbell className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="font-medium">
                        {format(new Date(session.date), 'EEEE, dd MMMM yyyy', { locale: es })}
                      </p>
                      {session.notes && (
                        <p className="text-sm text-muted-foreground">{session.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {session.duration_minutes && (
                      <p className="text-sm text-muted-foreground">
                        {session.duration_minutes} min
                      </p>
                    )}
                  </div>
                </button>

                {expandedSession === session.id && sessionSets[session.id] && (
                  <div className="mt-2 ml-16 space-y-1">
                    {sessionSets[session.id].map((set: any) => (
                      <div
                        key={set.id}
                        className="flex items-center justify-between p-3 bg-background/50 rounded text-sm"
                      >
                        <span className="font-medium">{set.health_exercises?.name}</span>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span>{set.weight_kg}kg × {set.reps} reps</span>
                          {set.rpe && <span>RPE {set.rpe}</span>}
                          {set.one_rep_max_est && (
                            <span className="text-primary font-medium">
                              1RM: {set.one_rep_max_est.toFixed(1)}kg
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exercise Library */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Biblioteca de Ejercicios</h3>
        {exercises.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No hay ejercicios registrados
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="p-3 bg-background border border-border rounded-lg"
              >
                <p className="font-medium">{exercise.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{exercise.muscle_group}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <LogWorkoutModal
        isOpen={showWorkoutModal}
        onClose={handleModalClose}
        exercises={exercises}
      />
      <AddExerciseModal isOpen={showExerciseModal} onClose={handleModalClose} />
    </div>
  );
}
