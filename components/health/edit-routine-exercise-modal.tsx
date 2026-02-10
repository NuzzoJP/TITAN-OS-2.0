'use client';

import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { updateRoutineExercise, type RoutineExercise } from '@/lib/actions/routines';

interface EditRoutineExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: RoutineExercise;
  onSuccess: () => void;
}

export function EditRoutineExerciseModal({
  open,
  onOpenChange,
  exercise,
  onSuccess,
}: EditRoutineExerciseModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    target_sets: exercise.target_sets,
    target_reps_min: exercise.target_reps_min,
    target_reps_max: exercise.target_reps_max,
    rest_seconds: exercise.rest_seconds,
    rpe_target: exercise.rpe_target || 8.0,
    is_superset: exercise.is_superset,
    is_dropset: exercise.is_dropset,
    notes: exercise.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateRoutineExercise(exercise.id, formData);

    if (result.success) {
      onSuccess();
      onOpenChange(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Ejercicio</DialogTitle>
          <DialogDescription>
            {exercise.exercise?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Técnicas Avanzadas */}
          <div className="space-y-3">
            <Label>Técnicas Avanzadas</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="superset"
                checked={formData.is_superset}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_superset: checked as boolean })
                }
              />
              <label
                htmlFor="superset"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Superserie
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="dropset"
                checked={formData.is_dropset}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_dropset: checked as boolean })
                }
              />
              <label
                htmlFor="dropset"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Dropset
              </label>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ej: Mantener codos pegados, squeeze al final..."
              rows={3}
            />
          </div>

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
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
