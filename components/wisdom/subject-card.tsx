'use client';

import { useState, useEffect } from 'react';
import { Lock, AlertTriangle, TrendingUp, Plus } from 'lucide-react';
import { getEvaluationsBySubject } from '@/lib/actions/wisdom';
import type { Subject, Evaluation } from '@/lib/actions/wisdom';
import { calculateSimulation, getGradeColor } from '@/lib/utils/wisdom-utils';
import { AddEvaluationModal } from '@/components/wisdom/add-evaluation-modal';

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvaluations();
  }, [subject.id]);

  const loadEvaluations = async () => {
    setLoading(true);
    const data = await getEvaluationsBySubject(subject.id);
    setEvaluations(data);
    setLoading(false);
  };

  const simulation = calculateSimulation(subject.accumulated_points, evaluations);
  const gradeColor = getGradeColor(subject.current_projection);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-500/10 border-green-500/30 text-green-500';
      case 'yellow':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500';
      case 'orange':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-500';
      case 'red':
        return 'bg-red-500/10 border-red-500/30 text-red-500';
      default:
        return 'bg-muted border-border text-muted-foreground';
    }
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    loadEvaluations();
  };

  return (
    <>
      <div className={`bg-card border-2 rounded-lg p-6 ${getColorClasses(gradeColor)}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{subject.name}</h3>
            <p className="text-sm opacity-70">{subject.credit_units} UC</p>
          </div>
          {simulation.isSafe && (
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <Lock size={20} className="text-green-500" />
            </div>
          )}
          {!simulation.isPossible && (
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
          )}
        </div>

        {/* Projection */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold">
              {subject.current_projection.toFixed(1)}
            </span>
            <span className="text-lg opacity-70">/ 20</span>
          </div>
          <p className="text-sm opacity-70">
            Acumulado: {subject.accumulated_points.toFixed(2)} pts
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-background/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full transition-all"
              style={{
                width: `${Math.min((subject.current_projection / 20) * 100, 100)}%`,
                backgroundColor: gradeColor === 'green' ? '#22c55e' : 
                                gradeColor === 'yellow' ? '#eab308' : 
                                gradeColor === 'orange' ? '#f97316' : '#ef4444',
              }}
            />
          </div>
        </div>

        {/* Simulator */}
        {!simulation.isSafe && simulation.remainingWeight > 0 && (
          <div className="bg-background/50 rounded-lg p-3 mb-4 space-y-1">
            <p className="text-sm font-medium flex items-center gap-2">
              <TrendingUp size={16} />
              Simulador
            </p>
            {simulation.isPossible ? (
              <>
                <p className="text-xs opacity-70">
                  Te faltan <span className="font-bold">{simulation.pointsNeeded.toFixed(1)} pts</span> netos
                </p>
                <p className="text-xs opacity-70">
                  Necesitas promediar{' '}
                  <span className="font-bold">{simulation.gradeNeeded.toFixed(1)}</span> en lo que falta
                </p>
              </>
            ) : (
              <p className="text-xs font-bold text-red-500">
                ⚠️ Matemáticamente imposible aprobar. Considera retiro.
              </p>
            )}
          </div>
        )}

        {simulation.isSafe && (
          <div className="bg-green-500/10 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-green-500 flex items-center gap-2">
              <Lock size={16} />
              ¡Materia Salvada!
            </p>
            <p className="text-xs text-green-500/70 mt-1">
              Ya tienes los 10 puntos necesarios para aprobar
            </p>
          </div>
        )}

        {/* Evaluations */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Evaluaciones</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs px-2 py-1 bg-primary/20 hover:bg-primary/30 rounded transition-colors flex items-center gap-1"
            >
              <Plus size={14} />
              Agregar
            </button>
          </div>
          {loading ? (
            <p className="text-xs opacity-50">Cargando...</p>
          ) : evaluations.length === 0 ? (
            <p className="text-xs opacity-50">No hay evaluaciones registradas</p>
          ) : (
            <div className="space-y-1">
              {evaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="flex items-center justify-between text-xs bg-background/50 rounded px-2 py-1"
                >
                  <span className="flex-1 truncate">{evaluation.name}</span>
                  <span className="opacity-70 mx-2">
                    {(evaluation.weight_percentage * 100).toFixed(0)}%
                  </span>
                  <span className={evaluation.is_completed ? 'font-bold' : 'opacity-50'}>
                    {evaluation.is_completed ? evaluation.obtained_grade?.toFixed(1) : '--'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 bg-background/50 rounded">
            {subject.status}
          </span>
          <span className="text-xs opacity-50">
            {evaluations.filter((e) => e.is_completed).length} / {evaluations.length} completadas
          </span>
        </div>
      </div>

      <AddEvaluationModal
        isOpen={showAddModal}
        onClose={handleModalClose}
        subjectId={subject.id}
      />
    </>
  );
}
