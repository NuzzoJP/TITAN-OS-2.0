'use client';

import { useEffect, useState } from 'react';
import { Plus, Copy, Edit, Trash2, Play, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRoutines, cloneRoutine, deleteRoutine, setActiveRoutine, startWorkoutFromRoutine } from '@/lib/actions/routines';
import { CreateRoutineModal } from './create-routine-modal';
import { EditRoutineModal } from './edit-routine-modal';
import type { Routine } from '@/lib/actions/routines';

export function RoutinesManager() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    setLoading(true);
    const result = await getRoutines();
    if (result.success && result.data) {
      setRoutines(result.data);
    }
    setLoading(false);
  };

  const handleClone = async (routine: Routine) => {
    const result = await cloneRoutine(routine.id);
    if (result.success) {
      loadRoutines();
    }
  };

  const handleDelete = async (routineId: string) => {
    if (!confirm('¿Eliminar esta rutina?')) return;
    
    const result = await deleteRoutine(routineId);
    if (result.success) {
      loadRoutines();
    }
  };

  const handleSetActive = async (routineId: string) => {
    const result = await setActiveRoutine(routineId);
    if (result.success) {
      loadRoutines();
    }
  };

  const handleStartWorkout = async (routineId: string) => {
    const result = await startWorkoutFromRoutine(routineId);
    if (result.success && result.data) {
      // Redirect to gym tab with workout params
      const params = new URLSearchParams({
        sessionId: result.data.sessionId,
        routineId: result.data.routineId,
        routineName: result.data.routineName,
      });
      window.location.href = `/dashboard/health?${params.toString()}`;
    } else {
      alert(result.error || 'Error al iniciar entrenamiento');
    }
  };

  const templates = routines.filter(r => r.is_template);
  const myRoutines = routines.filter(r => !r.is_template);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rutinas</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona tus rutinas de entrenamiento
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Rutina
        </Button>
      </div>

      {/* Mis Rutinas */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Mis Rutinas</h3>
        {myRoutines.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground mb-4">No tienes rutinas personalizadas</p>
            <Button variant="outline" onClick={() => setCreateModalOpen(true)}>
              Crear Primera Rutina
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myRoutines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                onEdit={() => {
                  setSelectedRoutine(routine);
                  setEditModalOpen(true);
                }}
                onClone={() => handleClone(routine)}
                onDelete={() => handleDelete(routine.id)}
                onSetActive={() => handleSetActive(routine.id)}
                onStart={() => handleStartWorkout(routine.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Rutinas Template (Jeff Nippard) */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Rutinas PPL (Jeff Nippard)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Clona estas rutinas para personalizarlas según tus necesidades
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              isTemplate
              onClone={() => handleClone(routine)}
              onStart={() => handleStartWorkout(routine.id)}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <CreateRoutineModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={loadRoutines}
      />

      {selectedRoutine && (
        <EditRoutineModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          routine={selectedRoutine}
          onSuccess={loadRoutines}
        />
      )}
    </div>
  );
}

interface RoutineCardProps {
  routine: Routine;
  isTemplate?: boolean;
  onEdit?: () => void;
  onClone?: () => void;
  onDelete?: () => void;
  onSetActive?: () => void;
  onStart?: () => void;
}

function RoutineCard({
  routine,
  isTemplate = false,
  onEdit,
  onClone,
  onDelete,
  onSetActive,
  onStart,
}: RoutineCardProps) {
  const typeColors = {
    push: 'bg-red-500/20 text-red-500',
    pull: 'bg-blue-500/20 text-blue-500',
    legs: 'bg-green-500/20 text-green-500',
    upper: 'bg-purple-500/20 text-purple-500',
    lower: 'bg-yellow-500/20 text-yellow-500',
    full_body: 'bg-cyan-500/20 text-cyan-500',
    custom: 'bg-gray-500/20 text-gray-500',
  };

  const difficultyLabels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  };

  return (
    <div className={`bg-card border rounded-lg p-6 space-y-4 ${
      routine.is_active ? 'border-primary' : 'border-border'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold">{routine.name}</h4>
            {routine.is_active && (
              <span className="flex items-center gap-1 text-xs text-primary">
                <Check className="h-3 w-3" />
                Activa
              </span>
            )}
          </div>
          {routine.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {routine.description}
            </p>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[routine.routine_type]}`}>
          {routine.routine_type.toUpperCase()}
        </span>
        <span className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
          {difficultyLabels[routine.difficulty]}
        </span>
        <span className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
          ~{routine.estimated_duration_minutes} min
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button
          size="lg"
          className="w-full h-14 text-base font-bold"
          onClick={onStart}
        >
          <Play className="mr-2 h-5 w-5" />
          Iniciar Entrenamiento
        </Button>

        <div className="grid grid-cols-3 gap-2">
          {!isTemplate && !routine.is_active && (
            <Button
              size="sm"
              variant="outline"
              className="h-12"
              onClick={onSetActive}
            >
              Activar
            </Button>
          )}
          
          {!isTemplate && (
            <Button
              size="sm"
              variant="outline"
              className="h-12"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            className="h-12"
            onClick={onClone}
          >
            <Copy className="h-4 w-4" />
          </Button>

          {!isTemplate && (
            <Button
              size="sm"
              variant="outline"
              className="h-12"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
