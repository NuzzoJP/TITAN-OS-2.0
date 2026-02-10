'use client';

import { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import { upsertBudget, getCurrentBudget } from '@/lib/actions/finance';

interface BudgetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BudgetSettingsModal({ isOpen, onClose }: BudgetSettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    monthly_limit: '',
    savings_goal: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadCurrentBudget();
    }
  }, [isOpen]);

  const loadCurrentBudget = async () => {
    try {
      const budget = await getCurrentBudget();
      if (budget) {
        setFormData({
          monthly_limit: budget.monthly_limit.toString(),
          savings_goal: budget.savings_goal.toString(),
        });
      }
    } catch (error) {
      console.error('Error loading budget:', error);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await upsertBudget({
        monthly_limit: parseFloat(formData.monthly_limit),
        savings_goal: parseFloat(formData.savings_goal),
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el presupuesto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings size={20} />
            <h2 className="text-xl font-semibold">Configurar Presupuesto</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Límite Mensual de Gastos
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.monthly_limit}
              onChange={(e) => setFormData({ ...formData, monthly_limit: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.00"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Máximo que planeas gastar este mes
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meta de Ahorro Mensual</label>
            <input
              type="number"
              step="0.01"
              value={formData.savings_goal}
              onChange={(e) => setFormData({ ...formData, savings_goal: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.00"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Cantidad que deseas ahorrar este mes
            </p>
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
            {loading ? 'Guardando...' : 'Guardar Presupuesto'}
          </button>
        </form>
      </div>
    </div>
  );
}
