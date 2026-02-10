'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  updateRoutine,
  getRoutineExercises,
  removeExerciseFromRoutine,
  type Routine,
  type RoutineExercise,
} from '@/lib/actions/routines';
import { AddExerciseToRoutineModal } from './add-exercise-to-routine-modal';
import { EditRoutineExerciseModal } from './edit-routine-exercise-modal';

interface EditRoutineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routine: Routine;
  onSuccess: () => void;
}

export function EditRoutineModal({ open, onOpenChange, routine, onSuccess }: EditRoutineModalProps) {
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const [addExerciseModalOpen, setAddExerciseModalOpen] = useState(false);
  const [editExerciseModalOpen, setEditExerciseModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<RoutineExercise | null>(null);
  const [formData, setFormData] = useState({
    name: routine.name,
    description: routine.description || '',
    routine_type: routine.routine_type,
    difficulty: routine.difficulty,
    estimated_duration_minutes: routine.estimated_duration_minutes,
  });

  useEffect(() => {
    if (open) {
      loadExercises();
    }
  }, [open]);

  const loadExercises = async () => {
    const result = await getRoutineExercises(routine.id);
    if (result.success && result.data) {
      setExercises(result.data);
    }
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateRoutine(routine.id, formData);

    if (result.success) {
      onSuccess();
    }

    setLoading(false);
  };

  const handleRemoveExercise = async (exerciseId: string) => {
    if (!confirm('¿Eliminar este ejercicio de la rutina?')) return;

    const result = await removeExerciseFromRoutine(exerciseId);
    if (result.success) {
      loadExercises();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Rutina</DialogTitle>
            <DialogDescription>
              Modifica la información y ejercicios de tu rutina
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="exercises">Ejercicios ({exercises.length})</TabsTrigger>
            </TabsList>

            {/* Tab: Información */}
            <TabsContent value="info" className="space-y-4">
              <form onSubmit={handleUpdateInfo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Rutina *</Label>
                  <Select
                    value={formData.routine_type}
                    onValueChange={(value) => setFormData({ ...formData, routine_type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="push">Push (Empuje)</SelectItem>
                      <SelectItem value="pull">Pull (Tirón)</SelectItem>
                      <SelectItem value="legs">Legs (Piernas)</SelectItem>
                      <SelectItem value="upper">Upper (Tren Superior)</SelectItem>
                      <SelectItem value="lower">Lower (Tren Inferior)</SelectItem>
                      <SelectItem value="full_body">Full Body (Cuerpo Completo)</SelectItem>
                      <SelectItem value="custom">Custom (Personalizada)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Dificultad *</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Principiante</SelectItem>
                      <SelectItem value="intermediate">Intermedio</SelectItem>
                      <SelectItem value="advanced">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duración Estimada (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.estimated_duration_minutes}
                    onChange={(e) => setFormData({ ...formData, estimated_duration_minutes: parseInt(e.target.value) })}
                    min={15}
                    max={180}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </form>
            </TabsContent>

            {/* Tab: Ejercicios */}
            <TabsContent value="exercises" className="space-y-4">
              <Button
                onClick={() => setAddExerciseModalOpen(true)}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Ejercicio
              </Button>

              {exercises.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">No hay ejercicios en esta rutina</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {exercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg"
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      
                      <div className="flex-1">
                        <p className="font-medium">{exercise.exercise?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {exercise.target_sets} × {exercise.target_reps_min}-{exercise.target_reps_max} reps
                          {exercise.rpe_target && ` @ RPE ${exercise.rpe_target}`}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedExercise(exercise);
                          setEditExerciseModalOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveExercise(exercise.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <AddExerciseToRoutineModal
        open={addExerciseModalOpen}
        onOpenChange={setAddExerciseModalOpen}
        routineId={routine.id}
        exerciseOrder={exercises.length + 1}
        onSuccess={loadExercises}
      />

      {selectedExercise && (
        <EditRoutineExerciseModal
          open={editExerciseModalOpen}
          onOpenChange={setEditExerciseModalOpen}
          exercise={selectedExercise}
          onSuccess={loadExercises}
        />
      )}
    </>
  );
}
