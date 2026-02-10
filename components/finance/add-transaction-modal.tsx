'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { createTransaction } from '@/lib/actions/finance';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Array<{ id: string; name: string; type: string }>;
}

export function AddTransactionModal({ isOpen, onClose, accounts }: AddTransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    account_id: '',
    amount: '',
    category: '',
    description: '',
    is_expense: true,
    date: new Date().toISOString().split('T')[0],
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.account_id) {
        throw new Error('Selecciona una cuenta');
      }

      await createTransaction({
        account_id: formData.account_id,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description || undefined,
        is_expense: formData.is_expense,
        date: formData.date,
      });

      // Reset form
      setFormData({
        account_id: '',
        amount: '',
        category: '',
        description: '',
        is_expense: true,
        date: new Date().toISOString().split('T')[0],
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear la transacción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Nueva Transacción</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_expense: true })}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                formData.is_expense
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Gasto
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_expense: false })}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                !formData.is_expense
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Ingreso
            </button>
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium mb-2">Cuenta</label>
            <select
              value={formData.account_id}
              onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Seleccionar cuenta</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.type})
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">Monto</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.00"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Categoría</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: Comida, Transporte, Salario"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Descripción (Opcional)</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Detalles adicionales"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Fecha</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
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
            className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Crear Transacción'}
          </button>
        </form>
      </div>
    </div>
  );
}
