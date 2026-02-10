'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateAndSaveMetabolicProfile } from '@/lib/actions/nutrition';
import { Loader2, Target, Activity, TrendingUp } from 'lucide-react';

interface MetabolicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingProfile?: any;
}

export function MetabolicProfileModal({ isOpen, onClose, existingProfile }: MetabolicProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    height_cm: existingProfile?.height_cm || '',
    age: existingProfile?.age || '',
    gender: existingProfile?.gender || 'male',
    activity_level: existingProfile?.activity_level || 'moderate',
    goal: existingProfile?.goal || 'bulk',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validaciones
      if (!formData.height_cm || !formData.age) {
        throw new Error('Por favor completa todos los campos');
      }

      const height = parseInt(formData.height_cm);
      const age = parseInt(formData.age);

      if (height < 100 || height > 250) {
        throw new Error('Altura debe estar entre 100 y 250 cm');
      }

      if (age < 10 || age > 100) {
        throw new Error('Edad debe estar entre 10 y 100 años');
      }

      await calculateAndSaveMetabolicProfile({
        height_cm: height,
        age,
        gender: formData.gender as 'male' | 'female',
        activity_level: formData.activity_level as any,
        goal: formData.goal as 'cut' | 'maintain' | 'bulk',
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {existingProfile ? 'Editar Perfil Metabólico' : 'Configurar Perfil Metabólico'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Altura y Edad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height" className="text-base">
                Altura (cm) *
              </Label>
              <Input
                id="height"
                type="number"
                inputMode="numeric"
                placeholder="175"
                value={formData.height_cm}
                onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                className="h-14 text-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-base">
                Edad (años) *
              </Label>
              <Input
                id="age"
                type="number"
                inputMode="numeric"
                placeholder="25"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="h-14 text-xl"
                required
              />
            </div>
          </div>

          {/* Género */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-base">
              Género *
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
            >
              <SelectTrigger className="h-14 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male" className="text-lg py-3">
                  Masculino
                </SelectItem>
                <SelectItem value="female" className="text-lg py-3">
                  Femenino
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nivel de Actividad */}
          <div className="space-y-2">
            <Label htmlFor="activity" className="text-base flex items-center gap-2">
              <Activity size={18} />
              Nivel de Actividad *
            </Label>
            <Select
              value={formData.activity_level}
              onValueChange={(value) => setFormData({ ...formData, activity_level: value })}
            >
              <SelectTrigger className="h-14 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary" className="text-lg py-3">
                  Sedentario (poco o ningún ejercicio)
                </SelectItem>
                <SelectItem value="light" className="text-lg py-3">
                  Ligero (1-3 días/semana)
                </SelectItem>
                <SelectItem value="moderate" className="text-lg py-3">
                  Moderado (3-5 días/semana)
                </SelectItem>
                <SelectItem value="active" className="text-lg py-3">
                  Activo (6-7 días/semana)
                </SelectItem>
                <SelectItem value="very_active" className="text-lg py-3">
                  Muy Activo (atleta/trabajo físico)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Objetivo */}
          <div className="space-y-2">
            <Label htmlFor="goal" className="text-base flex items-center gap-2">
              <Target size={18} />
              Objetivo *
            </Label>
            <Select
              value={formData.goal}
              onValueChange={(value) => setFormData({ ...formData, goal: value })}
            >
              <SelectTrigger className="h-14 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cut" className="text-lg py-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="rotate-180" size={16} />
                    <div>
                      <div className="font-semibold">Cut (Perder Grasa)</div>
                      <div className="text-xs text-muted-foreground">Déficit de 500 kcal</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="maintain" className="text-lg py-3">
                  <div className="flex items-center gap-2">
                    <Target size={16} />
                    <div>
                      <div className="font-semibold">Maintain (Mantener)</div>
                      <div className="text-xs text-muted-foreground">TDEE exacto</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="bulk" className="text-lg py-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} />
                    <div>
                      <div className="font-semibold">Bulk (Ganar Músculo)</div>
                      <div className="text-xs text-muted-foreground">Superávit de 300 kcal</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Info Box */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Tus macros se calcularán automáticamente usando la fórmula Mifflin-St Jeor.
              Cuando escanees tu peso con Cubitt, todo se recalculará automáticamente.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-14 text-lg"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-14 text-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Calculando...
                </>
              ) : (
                'Calcular y Guardar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
