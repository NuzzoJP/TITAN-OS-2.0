import type { Evaluation } from '@/lib/actions/wisdom';

// Calcular simulación para aprobar
export function calculateSimulation(
  accumulatedPoints: number,
  evaluations: Evaluation[]
) {
  const completedWeight = evaluations
    .filter((e) => e.is_completed)
    .reduce((sum, e) => sum + e.weight_percentage, 0);
  
  const remainingWeight = 1.0 - completedWeight;
  const pointsNeeded = 10 - accumulatedPoints;
  
  if (remainingWeight <= 0) {
    return {
      pointsNeeded: 0,
      gradeNeeded: 0,
      remainingWeight: 0,
      isPossible: accumulatedPoints >= 10,
      isSafe: accumulatedPoints >= 10,
    };
  }
  
  const gradeNeeded = pointsNeeded / remainingWeight;
  
  return {
    pointsNeeded: Math.max(0, pointsNeeded),
    gradeNeeded: Math.max(0, gradeNeeded),
    remainingWeight,
    isPossible: gradeNeeded <= 20,
    isSafe: accumulatedPoints >= 10,
  };
}

// Obtener color del semáforo
export function getGradeColor(projection: number): string {
  if (projection >= 16) return 'green'; // Excelente
  if (projection >= 12) return 'yellow'; // Bien
  if (projection >= 10) return 'orange'; // Aprobando
  return 'red'; // Riesgo
}
