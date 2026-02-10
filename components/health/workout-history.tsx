'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, Trash2, ChevronDown, ChevronUp, Dumbbell, TrendingUp } from 'lucide-react';
import { getWorkoutHistory, deleteWorkoutSession } from '@/lib/actions/health';
import type { WorkoutHistoryItem } from '@/lib/actions/health';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function WorkoutHistory() {
  const [history, setHistory] = useState<WorkoutHistoryItem[]>([]);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getWorkoutHistory(30);
      setHistory(data);
    } catch (error) {
      console.error('Error loading workout history:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm('¿Estás seguro de eliminar este entrenamiento? Esta acción no se puede deshacer.')) {
      return;
    }

    setDeleting(sessionId);
    try {
      const result = await deleteWorkoutSession(sessionId);
      if (result.success) {
        setHistory(history.filter(item => item.id !== sessionId));
      } else {
        alert('Error al eliminar el entrenamiento');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Error al eliminar el entrenamiento');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando historial...</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No hay entrenamientos registrados</p>
        <p className="text-sm text-muted-foreground mt-2">
          Completa tu primer entrenamiento para ver el historial
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Historial de Entrenamientos</h3>
        <p className="text-sm text-muted-foreground">
          {history.length} sesiones
        </p>
      </div>

      {/* Lista de Entrenamientos */}
      <div className="space-y-3">
        {history.map((session) => {
          const isExpanded = expandedSessions.has(session.id);
          const isDeleting = deleting === session.id;

          return (
            <div
              key={session.id}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              {/* Header de la Sesión */}
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleExpanded(session.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Dumbbell className="text-primary" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {session.routine_name || 'Entrenamiento Libre'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(session.date), "EEEE, d 'de' MMMM yyyy", { locale: es })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {session.duration_minutes && (
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{session.duration_minutes} min</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <TrendingUp size={14} />
                        <span>{session.total_sets} sets</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell size={14} />
                        <span>{(session.total_volume / 1000).toFixed(1)} ton</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(session.id);
                      }}
                      disabled={isDeleting}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                    {isExpanded ? (
                      <ChevronUp className="text-muted-foreground" size={20} />
                    ) : (
                      <ChevronDown className="text-muted-foreground" size={20} />
                    )}
                  </div>
                </div>
              </div>

              {/* Detalles Expandidos */}
              {isExpanded && (
                <div className="border-t border-border p-4 bg-muted/20">
                  <div className="space-y-4">
                    {session.exercises.map((exercise, idx) => (
                      <div key={idx} className="bg-background rounded-lg p-4 border border-border">
                        <p className="font-semibold mb-3">{exercise.name}</p>
                        <div className="space-y-2">
                          {exercise.sets.map((set, setIdx) => (
                            <div
                              key={setIdx}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-muted-foreground w-16">
                                  Set {setIdx + 1}
                                </span>
                                <span className="font-mono font-semibold">
                                  {set.weight_kg} kg × {set.reps} reps
                                </span>
                                {set.rpe && (
                                  <span className="text-muted-foreground">
                                    RPE {set.rpe}
                                  </span>
                                )}
                              </div>
                              {set.estimated_1rm && (
                                <div className="text-right">
                                  <span className="text-xs text-muted-foreground">1RM: </span>
                                  <span className="font-mono font-semibold text-primary">
                                    {set.estimated_1rm.toFixed(1)} kg
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Footer */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <p>
          💡 <strong>Tip:</strong> Haz clic en un entrenamiento para ver los detalles completos.
          Puedes eliminar entrenamientos de prueba usando el botón de basura.
        </p>
      </div>
    </div>
  );
}
