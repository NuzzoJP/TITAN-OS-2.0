'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createEvaluation, updateEvaluationGrade } from '@/lib/actions/wisdom';

interface AddEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
}

export function AddEvaluationModal({ isOpen, onClose, subjectId }: AddEvaluationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    weight_percentage: '',
    obtained_grade: '',
    is_completed: false,
    due_date: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const weightDecimal = parseFloat(formData.weight_percentage) / 100;

      await createEvaluation({
        subject_id: subjectId,
        name: formData.name,
        weight_percentage: weightDecimal,
        obtained_grade: formData.is_completed ? parseFloat(formData.obtained_grade) : undefined,
        is_completed: formData.is_completed,
        due_date: formData.due_date || undefined,
      });

      setFormData({
        name: '',
        weight_percentage: '',
        obtained_grade: '',
        is_completed: false,
        due_date: '',
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear la evaluación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Nueva Evaluación</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: Parcial 1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Porcentaje (%)</label>
            <input
              type="number"
              min="1"
              max="100"
              step="0.01"
              value={formData.weight_percentage}
              onChange={(e) => setFormData({ ...formData, weight_percentage: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: 30"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Peso de esta evaluación (ej: 30 = 30%)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fecha de Entrega (Opcional)</label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="is_completed"
                checked={formData.is_completed}
                onChange={(e) => setFormData({ ...formData, is_completed: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="is_completed" className="text-sm">
                Ya tengo la nota
              </label>
            </div>

            {formData.is_completed && (
              <div>
                <label className="block text-sm font-medium mb-2">Nota Obtenida (0-20)</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.01"
                  value={formData.obtained_grade}
                  onChange={(e) => setFormData({ ...formData, obtained_grade: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: 15.5"
                  required={formData.is_completed}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Crear Evaluación'}
          </button>
        </form>
      </div>
    </div>
  );
}
