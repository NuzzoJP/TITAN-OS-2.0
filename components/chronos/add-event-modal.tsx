'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createEvent } from '@/lib/actions/chronos';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: Date;
}

export function AddEventModal({ isOpen, onClose, defaultDate }: AddEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: defaultDate
      ? new Date(defaultDate.setHours(9, 0, 0, 0)).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    end_time: defaultDate
      ? new Date(defaultDate.setHours(10, 0, 0, 0)).toISOString().slice(0, 16)
      : new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    is_all_day: false,
    category: 'soft',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createEvent({
        title: formData.title,
        description: formData.description || undefined,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: formData.is_all_day ? undefined : new Date(formData.end_time).toISOString(),
        is_all_day: formData.is_all_day,
        category: formData.category,
      });

      setFormData({
        title: '',
        description: '',
        start_time: new Date().toISOString().slice(0, 16),
        end_time: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
        is_all_day: false,
        category: 'soft',
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Nuevo Evento</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: Reunión con cliente"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripción (Opcional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Detalles adicionales"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tipo</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="soft">Soft Block (Flexible)</option>
              <option value="hard">Hard Block (No movible)</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              {formData.category === 'hard'
                ? 'No se pueden agendar otros eventos sobre este'
                : 'Puede ser movido o reprogramado'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_all_day"
              checked={formData.is_all_day}
              onChange={(e) => setFormData({ ...formData, is_all_day: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="is_all_day" className="text-sm">
              Evento de todo el día
            </label>
          </div>

          {!formData.is_all_day && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Inicio</label>
                <input
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fin</label>
                <input
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </>
          )}

          {formData.is_all_day && (
            <div>
              <label className="block text-sm font-medium mb-2">Fecha</label>
              <input
                type="date"
                value={formData.start_time.split('T')[0]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    start_time: `${e.target.value}T00:00`,
                    end_time: `${e.target.value}T23:59`,
                  })
                }
                className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          )}

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
            {loading ? 'Guardando...' : 'Crear Evento'}
          </button>
        </form>
      </div>
    </div>
  );
}
