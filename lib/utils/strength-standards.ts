/**
 * STRENGTH STANDARDS - Clasificación de fuerza por ejercicio
 * Basado en Symmetric Strength y estándares de powerlifting
 * 
 * Fórmulas ajustadas por peso corporal usando coeficientes Wilks simplificados
 */

export type StrengthLevel = 'beginner' | 'novice' | 'intermediate' | 'advanced' | 'elite';

export interface StrengthStandard {
  level: StrengthLevel;
  label: string;
  color: string;
  multiplier: number; // Multiplicador del peso corporal
}

export const STRENGTH_LEVELS: Record<StrengthLevel, StrengthStandard> = {
  beginner: {
    level: 'beginner',
    label: 'Principiante',
    color: '#94a3b8', // slate-400
    multiplier: 0,
  },
  novice: {
    level: 'novice',
    label: 'Novato',
    color: '#60a5fa', // blue-400
    multiplier: 0,
  },
  intermediate: {
    level: 'intermediate',
    label: 'Intermedio',
    color: '#34d399', // green-400
    multiplier: 0,
  },
  advanced: {
    level: 'advanced',
    label: 'Avanzado',
    color: '#fbbf24', // yellow-400
    multiplier: 0,
  },
  elite: {
    level: 'elite',
    label: 'Elite',
    color: '#a855f7', // purple-400
    multiplier: 0,
  },
};

/**
 * Estándares de fuerza por ejercicio (multiplicadores del peso corporal)
 * Basado en hombres adultos. Para mujeres, multiplicar por ~0.65
 */
const EXERCISE_STANDARDS: Record<string, Record<StrengthLevel, number>> = {
  // PRESS (Empuje)
  'bench press': {
    beginner: 0.5,
    novice: 0.75,
    intermediate: 1.0,
    advanced: 1.5,
    elite: 2.0,
  },
  'incline bench press': {
    beginner: 0.4,
    novice: 0.65,
    intermediate: 0.85,
    advanced: 1.25,
    elite: 1.75,
  },
  'overhead press': {
    beginner: 0.35,
    novice: 0.5,
    intermediate: 0.65,
    advanced: 0.95,
    elite: 1.35,
  },
  'dumbbell press': {
    beginner: 0.25,
    novice: 0.4,
    intermediate: 0.55,
    advanced: 0.8,
    elite: 1.1,
  },

  // SQUAT (Piernas)
  'squat': {
    beginner: 0.75,
    novice: 1.0,
    intermediate: 1.5,
    advanced: 2.0,
    elite: 2.5,
  },
  'smith machine squat': {
    beginner: 0.7,
    novice: 0.95,
    intermediate: 1.4,
    advanced: 1.9,
    elite: 2.4,
  },
  'front squat': {
    beginner: 0.6,
    novice: 0.85,
    intermediate: 1.2,
    advanced: 1.7,
    elite: 2.2,
  },
  'leg press': {
    beginner: 1.5,
    novice: 2.0,
    intermediate: 2.75,
    advanced: 3.5,
    elite: 4.5,
  },

  // DEADLIFT (Tirón)
  'deadlift': {
    beginner: 0.75,
    novice: 1.25,
    intermediate: 1.75,
    advanced: 2.5,
    elite: 3.0,
  },
  'romanian deadlift': {
    beginner: 0.6,
    novice: 0.95,
    intermediate: 1.35,
    advanced: 1.9,
    elite: 2.5,
  },
  'sumo deadlift': {
    beginner: 0.7,
    novice: 1.2,
    intermediate: 1.7,
    advanced: 2.4,
    elite: 2.9,
  },

  // PULL (Jalón)
  'pull-up': {
    beginner: 0.0, // Bodyweight
    novice: 0.15,
    intermediate: 0.35,
    advanced: 0.65,
    elite: 1.0,
  },
  'chin-up': {
    beginner: 0.0,
    novice: 0.2,
    intermediate: 0.4,
    advanced: 0.7,
    elite: 1.1,
  },
  'barbell row': {
    beginner: 0.5,
    novice: 0.75,
    intermediate: 1.0,
    advanced: 1.4,
    elite: 1.9,
  },
  'dumbbell row': {
    beginner: 0.25,
    novice: 0.4,
    intermediate: 0.55,
    advanced: 0.8,
    elite: 1.1,
  },

  // ACCESORIOS
  'bicep curl': {
    beginner: 0.15,
    novice: 0.25,
    intermediate: 0.35,
    advanced: 0.5,
    elite: 0.7,
  },
  'tricep extension': {
    beginner: 0.2,
    novice: 0.3,
    intermediate: 0.45,
    advanced: 0.65,
    elite: 0.9,
  },
  'lateral raise': {
    beginner: 0.08,
    novice: 0.12,
    intermediate: 0.18,
    advanced: 0.25,
    elite: 0.35,
  },
};

/**
 * Normaliza el nombre del ejercicio para buscar en los estándares
 */
function normalizeExerciseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    // Remover variaciones comunes
    .replace(/\(.*?\)/g, '')
    .replace(/barbell|dumbbell|cable|machine/gi, '')
    .trim();
}

/**
 * Encuentra el estándar más cercano para un ejercicio
 */
function findClosestStandard(exerciseName: string): Record<StrengthLevel, number> | null {
  const normalized = normalizeExerciseName(exerciseName);
  
  // Búsqueda exacta
  if (EXERCISE_STANDARDS[normalized]) {
    return EXERCISE_STANDARDS[normalized];
  }
  
  // Búsqueda por palabras clave
  for (const [key, standards] of Object.entries(EXERCISE_STANDARDS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return standards;
    }
  }
  
  // Búsqueda por tipo de ejercicio
  if (normalized.includes('press') && normalized.includes('bench')) {
    return EXERCISE_STANDARDS['bench press'];
  }
  if (normalized.includes('press') && (normalized.includes('shoulder') || normalized.includes('overhead'))) {
    return EXERCISE_STANDARDS['overhead press'];
  }
  if (normalized.includes('squat')) {
    return EXERCISE_STANDARDS['squat'];
  }
  if (normalized.includes('deadlift') || normalized.includes('rdl')) {
    return EXERCISE_STANDARDS['romanian deadlift'];
  }
  if (normalized.includes('row')) {
    return EXERCISE_STANDARDS['barbell row'];
  }
  if (normalized.includes('pull') && normalized.includes('up')) {
    return EXERCISE_STANDARDS['pull-up'];
  }
  
  return null;
}

/**
 * Calcula el nivel de fuerza para un ejercicio
 */
export function calculateStrengthLevel(
  exerciseName: string,
  oneRepMax: number,
  bodyWeight: number,
  gender: 'male' | 'female' = 'male'
): {
  level: StrengthLevel;
  label: string;
  color: string;
  ratio: number;
  nextLevel: {
    level: StrengthLevel;
    label: string;
    targetWeight: number;
    difference: number;
  } | null;
  standards: Record<StrengthLevel, number>;
} | null {
  const standards = findClosestStandard(exerciseName);
  
  if (!standards) {
    return null;
  }
  
  // Ajustar para mujeres (aproximadamente 65% de los estándares masculinos)
  const genderMultiplier = gender === 'female' ? 0.65 : 1.0;
  
  // Calcular ratio (1RM / peso corporal)
  const ratio = oneRepMax / bodyWeight;
  
  // Determinar nivel
  let level: StrengthLevel = 'beginner';
  
  if (ratio >= standards.elite * genderMultiplier) {
    level = 'elite';
  } else if (ratio >= standards.advanced * genderMultiplier) {
    level = 'advanced';
  } else if (ratio >= standards.intermediate * genderMultiplier) {
    level = 'intermediate';
  } else if (ratio >= standards.novice * genderMultiplier) {
    level = 'novice';
  }
  
  // Calcular siguiente nivel
  let nextLevel: {
    level: StrengthLevel;
    label: string;
    targetWeight: number;
    difference: number;
  } | null = null;
  
  const levelOrder: StrengthLevel[] = ['beginner', 'novice', 'intermediate', 'advanced', 'elite'];
  const currentIndex = levelOrder.indexOf(level);
  
  if (currentIndex < levelOrder.length - 1) {
    const nextLevelKey = levelOrder[currentIndex + 1];
    const nextLevelStandard = standards[nextLevelKey] * genderMultiplier;
    const targetWeight = nextLevelStandard * bodyWeight;
    
    nextLevel = {
      level: nextLevelKey,
      label: STRENGTH_LEVELS[nextLevelKey].label,
      targetWeight: Math.round(targetWeight * 10) / 10,
      difference: Math.round((targetWeight - oneRepMax) * 10) / 10,
    };
  }
  
  // Calcular estándares absolutos para este peso corporal
  const absoluteStandards: Record<StrengthLevel, number> = {
    beginner: Math.round(standards.beginner * genderMultiplier * bodyWeight * 10) / 10,
    novice: Math.round(standards.novice * genderMultiplier * bodyWeight * 10) / 10,
    intermediate: Math.round(standards.intermediate * genderMultiplier * bodyWeight * 10) / 10,
    advanced: Math.round(standards.advanced * genderMultiplier * bodyWeight * 10) / 10,
    elite: Math.round(standards.elite * genderMultiplier * bodyWeight * 10) / 10,
  };
  
  return {
    level,
    label: STRENGTH_LEVELS[level].label,
    color: STRENGTH_LEVELS[level].color,
    ratio: Math.round(ratio * 100) / 100,
    nextLevel,
    standards: absoluteStandards,
  };
}

/**
 * Obtiene el color del badge según el nivel
 */
export function getStrengthLevelBadge(level: StrengthLevel): {
  bg: string;
  text: string;
  border: string;
} {
  const colors = {
    beginner: {
      bg: 'bg-slate-500/10',
      text: 'text-slate-400',
      border: 'border-slate-500/20',
    },
    novice: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
    },
    intermediate: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/20',
    },
    advanced: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      border: 'border-yellow-500/20',
    },
    elite: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
    },
  };
  
  return colors[level];
}
