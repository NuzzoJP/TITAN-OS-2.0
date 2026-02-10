'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Ghost } from 'lucide-react';
import { createWorkoutSession, createSet, getPreviousLog } from '@/lib/actions/health';
import type { Exercise } from '@/lib/actions/health';

interface LogWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
}

interface SetData {
  exercise_id: string;
  weight_kg: string;
  reps: string;
  rpe: string;
  ghostData?: any;
}

export function LogWorkoutModal({ isOpen, onClose, exercises }: LogWorkoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [sets, setSets] = useState<SetData[]>([
    { exercise_id: '', weight_kg: '', reps: '', rpe: '' },
  ]);

  if (!isOpen) return null;

  const handleAddSet = () => {
    setSets([...sets, { exercise_id: '', weight_kg: '', reps: '', rpe: '' }]);
  };

  const handleRemoveSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  const handleSetChange = (index: number, field: keyof SetData, value: string) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  const loadGhostData = async (index: number, exerciseId: string) => {
    if (!exerciseId) return;
    
    try {
      const ghostData = await getPreviousLog(exerciseId);
      if (ghostData) {
        const newSets = [...sets];
        newSets[index] = {
          ...newSets[index],
          ghostData,
        };
        setSets(newSets);
      }
    } catch (error) {
      console.error('Error loading ghost data:', error);
    }
  };

  const handleExerciseChange = (index: number, exerciseId: string) => {
    handleSetChange(index, 'exercise_id', exerciseId);
    loadGhostData(index, exerciseId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Crear sesión
      const session = await createWorkoutSession({
        date,
        notes: notes || undefined,
      });

      // Crear sets
      for (const set of sets) {
        if (set.exercise_id && set.weight_kg && set.reps) {
          await createSet({
            session_id: session.id,
            exercise_id: set.exercise_id,
            weight_kg: parseFloat(set.weight_kg),
            reps: parseInt(set.reps),
            rpe: set.rpe ? parseInt(set.rpe) : undefined,
          });
        }
      }

      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setSets([{ exercise_id: '', weight_kg: '', reps: '', rpe: '' }]);

      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al registrar el entrenamiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-semibold">Registrar Entrenamiento</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notas (Opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: Buen entrenamiento, me sentí fuerte"
              rows={2}
            />
          </div>

          {/* Sets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium">Series</label>
              <button
                type="button"
                onClick={handleAddSet}
                className="text-sm px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded transition-colors flex items-center gap-1"
              >
                <Plus size={16} />
                Agregar Serie
              </button>
            </div>

            <div className="space-y-3">
              {sets.map((set, index) => (
                <div
                  key={index}
                  className="bg-background border border-border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Serie {index + 1}</span>
                    {sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSet(index)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Exercise */}
                  <div>
                    <label className="block text-xs font-medium mb-1">Ejercicio</label>
                    <select
                      value={set.exercise_id}
                      onChange={(e) => handleExerciseChange(index, e.target.value)}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      required
                    >
                      <option value="">Seleccionar ejercicio</option>
                      {exercises.map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                          {exercise.name} ({exercise.muscle_group})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ghost Mode Indicator */}
                  {set.ghostData && (
                    <div className="bg-primary/10 border border-primary/20 rounded-md p-2 flex items-center gap-2">
                      <Ghost size={16} className="text-primary" />
                      <span className="text-xs text-primary">
                        Último: {set.ghostData.weight}kg × {set.ghostData.reps} reps
                        {set.ghostData.rpe && ` @ RPE ${set.ghostData.rpe}`}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3">
                    {/* Weight */}
                    <div>
                      <label className="block text-xs font-medium mb-1">Peso (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={set.weight_kg}
                        onChange={(e) => handleSetChange(index, 'weight_kg', e.target.value)}
                        placeholder={set.ghostData?.weight?.toString() || '0'}
                        className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        required
                      />
                    </div>

                    {/* Reps */}
                    <div>
                      <label className="block text-xs font-medium mb-1">Reps</label>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                        placeholder={set.ghostData?.reps?.toString() || '0'}
                        className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        required
                      />
                    </div>

                    {/* RPE */}
                    <div>
                      <label className="block text-xs font-medium mb-1">RPE (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={set.rpe}
                        onChange={(e) => handleSetChange(index, 'rpe', e.target.value)}
                        placeholder={set.ghostData?.rpe?.toString() || ''}
                        className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Guardar Entrenamiento'}
          </button>
        </form>
      </div>
    </div>
  );
}
