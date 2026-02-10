'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createSubject } from '@/lib/actions/wisdom';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  termId: string;
}

export function AddSubjectModal({ isOpen, onClose, termId }: AddSubjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    credit_units: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createSubject({
        term_id: termId,
        name: formData.name,
        credit_units: parseInt(formData.credit_units),
      });

      setFormData({
        name: '',
        credit_units: '',
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear la materia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Nueva Materia</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre de la Materia</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: Cálculo I"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Unidades Crédito (UC)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.credit_units}
              onChange={(e) => setFormData({ ...formData, credit_units: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: 4"
              required
            />
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
            {loading ? 'Guardando...' : 'Crear Materia'}
          </button>
        </form>
      </div>
    </div>
  );
}
