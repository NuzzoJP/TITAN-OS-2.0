'use client';

import { calculateStrengthLevel, getStrengthLevelBadge } from '@/lib/utils/strength-standards';
import { TrendingUp, Target } from 'lucide-react';

interface StrengthLevelBadgeProps {
  exerciseName: string;
  oneRepMax: number;
  bodyWeight: number;
  gender?: 'male' | 'female';
  showDetails?: boolean;
}

export function StrengthLevelBadge({
  exerciseName,
  oneRepMax,
  bodyWeight,
  gender = 'male',
  showDetails = false,
}: StrengthLevelBadgeProps) {
  const strengthLevel = calculateStrengthLevel(exerciseName, oneRepMax, bodyWeight, gender);

  if (!strengthLevel) {
    return null;
  }

  const badge = getStrengthLevelBadge(strengthLevel.level);

  if (!showDetails) {
    // Badge simple
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
      >
        {strengthLevel.label}
      </span>
    );
  }

  // Vista detallada con progreso
  return (
    <div className="space-y-4">
      {/* Badge principal */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Nivel de Fuerza</p>
          <span
            className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
          >
            {strengthLevel.label}
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Ratio</p>
          <p className="text-2xl font-bold">{strengthLevel.ratio}x</p>
          <p className="text-xs text-muted-foreground">BW</p>
        </div>
      </div>

      {/* Próximo nivel */}
      {strengthLevel.nextLevel && (
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-primary" />
            <p className="text-sm font-semibold">Próximo Nivel: {strengthLevel.nextLevel.label}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Objetivo</p>
              <p className="text-lg font-bold">{strengthLevel.nextLevel.targetWeight} kg</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Faltan</p>
              <p className="text-lg font-bold text-primary">
                +{strengthLevel.nextLevel.difference} kg
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Barra de progreso entre niveles */}
      {strengthLevel.nextLevel && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{strengthLevel.label}</span>
            <span>{strengthLevel.nextLevel.label}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all"
              style={{
                width: `${Math.min(
                  ((oneRepMax - strengthLevel.standards[strengthLevel.level]) /
                    (strengthLevel.nextLevel.targetWeight - strengthLevel.standards[strengthLevel.level])) *
                    100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Estándares de todos los niveles */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">Estándares para tu peso ({bodyWeight}kg)</p>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(strengthLevel.standards).map(([level, weight]) => {
            const levelBadge = getStrengthLevelBadge(level as any);
            const isCurrent = level === strengthLevel.level;
            const isPassed = oneRepMax >= weight;

            return (
              <div
                key={level}
                className={`text-center p-2 rounded-lg border ${
                  isCurrent
                    ? `${levelBadge.bg} ${levelBadge.border}`
                    : isPassed
                    ? 'bg-muted/30 border-muted'
                    : 'bg-background border-border'
                }`}
              >
                <p
                  className={`text-xs font-semibold mb-1 ${
                    isCurrent ? levelBadge.text : isPassed ? 'text-muted-foreground' : 'text-muted-foreground/50'
                  }`}
                >
                  {level === 'beginner'
                    ? 'Prin'
                    : level === 'novice'
                    ? 'Nov'
                    : level === 'intermediate'
                    ? 'Int'
                    : level === 'advanced'
                    ? 'Adv'
                    : 'Elite'}
                </p>
                <p className={`text-sm font-bold ${isCurrent ? levelBadge.text : 'text-foreground'}`}>
                  {weight}kg
                </p>
                {isPassed && (
                  <div className="mt-1">
                    <span className="text-green-500">✓</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
