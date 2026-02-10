'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
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
import { addExerciseToRoutine } from '@/lib/actions/routines';
import { getExercises, type Exercise } from '@/lib/actions/health';

interface AddExerciseToRoutineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routineId: string;
  exerciseOrder: number;
  onSuccess: () => void;
}

export function AddExerciseToRoutineModal({
  open,
  onOpenChange,
  routineId,
  exerciseOrder,
  onSuccess,
}: AddExerciseToRoutineModalProps) {
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [formData, setFormData] = useState({
    target_sets: 3,
    target_reps_min: 8,
    target_reps_max: 12,
    rest_seconds: 120,
    rpe_target: 8.0,
    notes: '',
  });

  useEffect(() => {
    if (open) {
      loadExercises();
    }
  }, [open]);

  const loadExercises = async () => {
    const data = await getExercises();
    setExercises(data);
  };

  const filteredExercises = exercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.muscle_group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExercise) return;

    setLoading(true);

    const result = await addExerciseToRoutine({
      routine_id: routineId,
      exercise_id: selectedExercise.id,
      exercise_order: exerciseOrder,
      target_sets: formData.target_sets,
      target_reps_min: formData.target_reps_min,
      target_reps_max: formData.target_reps_max,
      rest_seconds: formData.rest_seconds,
      rpe_target: formData.rpe_target,
      notes: formData.notes,
    });

    if (result.success) {
      onSuccess();
      onOpenChange(false);
      setSelectedExercise(null);
      setSearchTerm('');
      setFormData({
        target_sets: 3,
        target_reps_min: 8,
        target_reps_max: 12,
        rest_seconds: 120,
        rpe_target: 8.0,
        notes: '',
      });
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Ejercicio</DialogTitle>
          <DialogDescription>
            Selecciona un ejercicio y configura sus parámetros
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selector de Ejercicio */}
          {!selectedExercise ? (
            <div className="space-y-3">
              <Label>Buscar Ejercicio</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o músculo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 border border-border rounded-lg p-2">
                {filteredExercises.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No se encontraron ejercicios
                  </p>
                ) : (
                  filteredExercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => setSelectedExercise(exercise)}
                      className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exercise.muscle_group}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Ejercicio Seleccionado */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{selectedExercise.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedExercise.muscle_group}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedExercise(null)}
                  >
                    Cambiar
                  </Button>
                </div>
              </div>

              {/* Sets */}
              <div className="space-y-2">
                <Label htmlFor="sets">Sets *</Label>
                <Input
                  id="sets"
                  type="number"
                  value={formData.target_sets}
                  onChange={(e) =>
                    setFormData({ ...formData, target_sets: parseInt(e.target.value) })
                  }
                  min={1}
                  max={10}
                  required
                />
              </div>

              {/* Reps Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reps-min">Reps Mínimas *</Label>
                  <Input
                    id="reps-min"
                    type="number"
                    value={formData.target_reps_min}
                    onChange={(e) =>
                      setFormData({ ...formData, target_reps_min: parseInt(e.target.value) })
                    }
                    min={1}
                    max={50}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reps-max">Reps Máximas *</Label>
                  <Input
                    id="reps-max"
                    type="number"
                    value={formData.target_reps_max}
                    onChange={(e) =>
                      setFormData({ ...formData, target_reps_max: parseInt(e.target.value) })
                    }
                    min={1}
                    max={50}
                    required
                  />
                </div>
              </div>

              {/* RPE Target */}
              <div className="space-y-2">
                <Label htmlFor="rpe">RPE Objetivo</Label>
                <Select
                  value={formData.rpe_target.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, rpe_target: parseFloat(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6.0">6.0 - Muy fácil</SelectItem>
                    <SelectItem value="6.5">6.5</SelectItem>
                    <SelectItem value="7.0">7.0 - Moderado</SelectItem>
                    <SelectItem value="7.5">7.5</SelectItem>
                    <SelectItem value="8.0">8.0 - Difícil</SelectItem>
                    <SelectItem value="8.5">8.5</SelectItem>
                    <SelectItem value="9.0">9.0 - Muy difícil</SelectItem>
                    <SelectItem value="9.5">9.5</SelectItem>
                    <SelectItem value="10.0">10.0 - Fallo</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  RPE 8-9 recomendado para hipertrofia
                </p>
              </div>

              {/* Descanso */}
              <div className="space-y-2">
                <Label htmlFor="rest">Descanso (segundos)</Label>
                <Select
                  value={formData.rest_seconds.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, rest_seconds: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">1:00 - Aislamiento pequeño</SelectItem>
                    <SelectItem value="90">1:30 - Aislamiento</SelectItem>
                    <SelectItem value="120">2:00 - Compound ligero</SelectItem>
                    <SelectItem value="150">2:30 - Compound</SelectItem>
                    <SelectItem value="180">3:00 - Compound pesado</SelectItem>
                    <SelectItem value="240">4:00 - Compound muy pesado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ej: Mantener codos pegados, squeeze al final..."
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedExercise}
              className="flex-1"
            >
              {loading ? 'Agregando...' : 'Agregar Ejercicio'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
