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
import { createRoutine } from '@/lib/actions/routines';

interface CreateRoutineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateRoutineModal({ open, onOpenChange, onSuccess }: CreateRoutineModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    routine_type: 'custom',
    difficulty: 'intermediate',
    estimated_duration_minutes: 60,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createRoutine(formData);

    if (result.success) {
      onSuccess();
      onOpenChange(false);
      setFormData({
        name: '',
        description: '',
        routine_type: 'custom',
        difficulty: 'intermediate',
        estimated_duration_minutes: 60,
      });
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Rutina</DialogTitle>
          <DialogDescription>
            Crea una rutina personalizada desde cero
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Mi Push Day Personalizado"
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe tu rutina..."
              rows={3}
            />
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Rutina *</Label>
            <Select
              value={formData.routine_type}
              onValueChange={(value) => setFormData({ ...formData, routine_type: value })}
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

          {/* Dificultad */}
          <div className="space-y-2">
            <Label htmlFor="difficulty">Dificultad *</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
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

          {/* Duración */}
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
              {loading ? 'Creando...' : 'Crear Rutina'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
