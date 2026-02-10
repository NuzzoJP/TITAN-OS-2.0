'use client';

import { useEffect, useState } from 'react';
import { Check, X, Plus, ChevronRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getRoutineExercises } from '@/lib/actions/routines';
import { createSet } from '@/lib/actions/health';
import { RestTimerOverlay } from './rest-timer-overlay';

interface ActiveWorkoutProps {
  sessionId: string;
  routineId: string;
  routineName: string;
  onFinish: () => void;
  onCancel: () => void;
}

interface ExerciseSet {
  weight: number;
  reps: number;
  rpe: number;
  completed: boolean;
}

export function ActiveWorkout({
  sessionId,
  routineId,
  routineName,
  onFinish,
  onCancel,
}: ActiveWorkoutProps) {
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [sets, setSets] = useState<ExerciseSet[]>([]);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Rest Timer State
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restSeconds, setRestSeconds] = useState(90);

  useEffect(() => {
    loadRoutineExercises();
  }, [routineId]);

  const loadRoutineExercises = async () => {
    setLoading(true);
    const result = await getRoutineExercises(routineId);
    if (result.success && result.data) {
      setExercises(result.data);
      // Initialize sets for first exercise
      if (result.data.length > 0) {
        const firstEx = result.data[0];
        initializeSets(firstEx.target_sets);
        setRestSeconds(firstEx.rest_seconds || 90);
      }
    }
    setLoading(false);
  };

  const initializeSets = (targetSets: number) => {
    setSets(
      Array.from({ length: targetSets }, () => ({
        weight: 0,
        reps: 0,
        rpe: 0,
        completed: false,
      }))
    );
    setCurrentSetIndex(0);
    setWeight('');
    setReps('');
    setRpe('');
  };

  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;
  const completedSets = sets.filter(s => s.completed).length;

  const handleCompleteSet = async () => {
    if (!weight || !reps) {
      alert('Ingresa peso y repeticiones');
      return;
    }

    setSaving(true);

    try {
      // Save set to database
      await createSet({
        session_id: sessionId,
        exercise_id: currentExercise.exercise_id,
        weight_kg: parseFloat(weight),
        reps: parseInt(reps),
        rpe: rpe ? parseInt(rpe) : undefined,
      });

      // Mark set as completed
      const newSets = [...sets];
      newSets[currentSetIndex] = {
        weight: parseFloat(weight),
        reps: parseInt(reps),
        rpe: rpe ? parseInt(rpe) : 0,
        completed: true,
      };
      setSets(newSets);

      // Check if this was the last set
      if (currentSetIndex === sets.length - 1) {
        // Move to next exercise
        if (currentExerciseIndex < totalExercises - 1) {
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          const nextEx = exercises[currentExerciseIndex + 1];
          initializeSets(nextEx.target_sets);
          setRestSeconds(nextEx.rest_seconds || 90);
        } else {
          // Workout complete!
          onFinish();
          return;
        }
      } else {
        // Move to next set
        setCurrentSetIndex(currentSetIndex + 1);
        setWeight('');
        setReps('');
        setRpe('');
        
        // Start rest timer
        setShowRestTimer(true);
      }
    } catch (error) {
      console.error('Error saving set:', error);
      alert('Error al guardar el set');
    } finally {
      setSaving(false);
    }
  };

  const handleSkipExercise = () => {
    if (!confirm('¿Saltar este ejercicio?')) return;
    
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      const nextEx = exercises[currentExerciseIndex + 1];
      initializeSets(nextEx.target_sets);
      setRestSeconds(nextEx.rest_seconds || 90);
    } else {
      onFinish();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentExercise) {
    return (
      <div className="text-center py-12">
        <Trophy className="mx-auto h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">¡Entrenamiento Completado!</h2>
        <p className="text-muted-foreground mb-6">Excelente trabajo</p>
        <Button onClick={onFinish}>Finalizar</Button>
      </div>
    );
  }

  const exerciseData = currentExercise.health_exercises;
  const progress = ((currentExerciseIndex * 100) / totalExercises).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{routineName}</h2>
          <p className="text-sm text-muted-foreground">
            Ejercicio {currentExerciseIndex + 1} de {totalExercises}
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Current Exercise */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1">{exerciseData?.name}</h3>
            <p className="text-sm text-muted-foreground">
              {exerciseData?.muscle_group} • {exerciseData?.equipment}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSkipExercise}>
            Saltar
          </Button>
        </div>

        {/* Target Info */}
        <div className="flex gap-4 mb-6 p-4 bg-muted rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Sets</p>
            <p className="text-lg font-bold">{currentExercise.target_sets}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reps</p>
            <p className="text-lg font-bold">
              {currentExercise.target_reps_min}-{currentExercise.target_reps_max}
            </p>
          </div>
          {currentExercise.rpe_target && (
            <div>
              <p className="text-xs text-muted-foreground">RPE</p>
              <p className="text-lg font-bold">{currentExercise.rpe_target}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Descanso</p>
            <p className="text-lg font-bold">{currentExercise.rest_seconds}s</p>
          </div>
        </div>

        {/* Technical Notes */}
        {currentExercise.notes && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm font-medium text-primary mb-1">Notas Técnicas</p>
            <p className="text-sm whitespace-pre-line">{currentExercise.notes}</p>
          </div>
        )}

        {/* Completed Sets */}
        {completedSets > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Sets Completados ({completedSets}/{sets.length})</p>
            <div className="space-y-2">
              {sets.map((set, idx) => (
                set.completed && (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="font-medium">Set {idx + 1}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{set.weight}kg × {set.reps} reps</span>
                      {set.rpe > 0 && <span className="text-muted-foreground">RPE {set.rpe}</span>}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Current Set Input */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                {currentSetIndex + 1}
              </span>
            </div>
            <p className="font-semibold">Set {currentSetIndex + 1} de {sets.length}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Peso (kg)</label>
              <Input
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0"
                className="text-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Reps</label>
              <Input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="0"
                className="text-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">RPE (opcional)</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                placeholder="7-9"
                className="text-lg"
              />
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleCompleteSet}
            disabled={saving || !weight || !reps}
          >
            {saving ? (
              'Guardando...'
            ) : currentSetIndex === sets.length - 1 && currentExerciseIndex === totalExercises - 1 ? (
              <>
                <Trophy className="mr-2 h-5 w-5" />
                Finalizar Entrenamiento
              </>
            ) : currentSetIndex === sets.length - 1 ? (
              <>
                <ChevronRight className="mr-2 h-5 w-5" />
                Siguiente Ejercicio
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                Completar Set
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Rest Timer Overlay */}
      <RestTimerOverlay
        isActive={showRestTimer}
        initialSeconds={restSeconds}
        exerciseName={exerciseData?.name || ''}
        onComplete={() => setShowRestTimer(false)}
        onSkip={() => setShowRestTimer(false)}
      />
    </div>
  );
}
