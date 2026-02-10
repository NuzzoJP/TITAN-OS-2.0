'use client';

import { useState } from 'react';
import { Plus, X, DollarSign, Utensils, Dumbbell, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const commands = [
    {
      icon: DollarSign,
      label: 'Nuevo Gasto',
      description: 'Registrar transacción',
      color: 'text-green-500',
      action: () => {
        router.push('/dashboard/finance');
        onClose();
      },
    },
    {
      icon: Utensils,
      label: 'Log Comida',
      description: 'Escanear con IA',
      color: 'text-cyan-500',
      action: () => {
        router.push('/dashboard/health?tab=nutrition');
        onClose();
      },
    },
    {
      icon: Dumbbell,
      label: 'Log Workout',
      description: 'Registrar entrenamiento',
      color: 'text-emerald-500',
      action: () => {
        router.push('/dashboard/health?tab=gym');
        onClose();
      },
    },
    {
      icon: Calendar,
      label: 'Nuevo Evento',
      description: 'Agregar a calendario',
      color: 'text-purple-500',
      action: () => {
        router.push('/dashboard/chronos');
        onClose();
      },
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Palette */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg p-4">
        <div className="bg-card border border-border rounded-lg shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold">Acción Rápida</h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Commands */}
          <div className="p-2">
            {commands.map((command, index) => {
              const Icon = command.icon;
              return (
                <button
                  key={index}
                  onClick={command.action}
                  className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-full bg-background flex items-center justify-center ${command.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{command.label}</p>
                    <p className="text-sm text-muted-foreground">{command.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export function OmniFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center z-30"
        title="Acción Rápida"
      >
        <Plus size={28} />
      </button>

      <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
