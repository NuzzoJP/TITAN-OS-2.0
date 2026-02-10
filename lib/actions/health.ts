'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  created_at: string;
}

export interface WorkoutSession {
  id: string;
  date: string;
  notes: string | null;
  duration_minutes: number | null;
  created_at: string;
}

export interface Set {
  id: string;
  session_id: string;
  exercise_id: string;
  weight_kg: number;
  reps: number;
  rpe: number | null;
  one_rep_max_est: number | null;
  created_at: string;
}

export interface GhostData {
  weight: number;
  reps: number;
  rpe: number | null;
  date: string;
  one_rep_max_est: number | null;
}

// Obtener todos los ejercicios
export async function getExercises() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('health_exercises')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error getting exercises:', error);
    return [];
  }
  
  return data as Exercise[];
}

// Obtener sesiones recientes
export async function getRecentSessions(limit = 10) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('health_workout_sessions')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
  
  return data as WorkoutSession[];
}

// Obtener sets de una sesión
export async function getSetsBySession(sessionId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('health_sets')
    .select(`
      *,
      health_exercises (
        name,
        muscle_group
      )
    `)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error getting sets:', error);
    return [];
  }
  
  return data;
}

// Obtener Ghost Mode data (último registro del ejercicio)
export async function getPreviousLog(exerciseId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.rpc('get_previous_log', {
    p_exercise_id: exerciseId,
  });
  
  if (error) {
    console.error('Error getting previous log:', error);
    return null;
  }
  
  return data as GhostData | null;
}

// Crear sesión de entrenamiento
export async function createWorkoutSession(formData: {
  date: string;
  notes?: string;
  duration_minutes?: number;
}) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('health_workout_sessions')
    .insert([formData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating session:', error);
    throw new Error('Error al crear la sesión');
  }
  
  revalidatePath('/dashboard/health');
  return data;
}

// Crear set
export async function createSet(formData: {
  session_id: string;
  exercise_id: string;
  weight_kg: number;
  reps: number;
  rpe?: number;
}) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('health_sets')
    .insert([formData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating set:', error);
    throw new Error('Error al crear el set');
  }
  
  revalidatePath('/dashboard/health');
  return data;
}

// Crear ejercicio
export async function createExercise(formData: {
  name: string;
  muscle_group: string;
}) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('health_exercises')
    .insert([formData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating exercise:', error);
    throw new Error('Error al crear el ejercicio');
  }
  
  revalidatePath('/dashboard/health');
  return data;
}

// Obtener estadísticas de progreso
export async function getProgressStats() {
  const supabase = await createClient();
  
  // Total de sesiones
  const { count: totalSessions } = await supabase
    .from('health_workout_sessions')
    .select('*', { count: 'exact', head: true });
  
  // Sesiones este mes
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const { count: monthSessions } = await supabase
    .from('health_workout_sessions')
    .select('*', { count: 'exact', head: true })
    .gte('date', startOfMonth.toISOString().split('T')[0]);
  
  // Total de sets
  const { count: totalSets } = await supabase
    .from('health_sets')
    .select('*', { count: 'exact', head: true });
  
  // Ejercicios únicos
  const { data: uniqueExercises } = await supabase
    .from('health_sets')
    .select('exercise_id')
    .limit(1000);
  
  const uniqueCount = uniqueExercises
    ? new Set(uniqueExercises.map((s) => s.exercise_id)).size
    : 0;
  
  return {
    totalSessions: totalSessions || 0,
    monthSessions: monthSessions || 0,
    totalSets: totalSets || 0,
    uniqueExercises: uniqueCount,
  };
}

// Obtener datos para gráfica de progreso (1RM por ejercicio)
export async function getExerciseProgress(exerciseId: string, limit = 20) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('health_sets')
    .select(`
      one_rep_max_est,
      weight_kg,
      reps,
      created_at,
      health_workout_sessions!inner (
        date
      )
    `)
    .eq('exercise_id', exerciseId)
    .order('created_at', { ascending: true })
    .limit(limit);
  
  if (error) {
    console.error('Error getting exercise progress:', error);
    return [];
  }
  
  return data;
}

// Obtener top ejercicios por volumen
export async function getTopExercises(limit = 5) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('health_sets')
    .select(`
      exercise_id,
      weight_kg,
      reps,
      health_exercises (
        name,
        muscle_group
      )
    `)
    .limit(1000);
  
  if (error || !data) {
    console.error('Error getting top exercises:', error);
    return [];
  }
  
  // Calcular volumen por ejercicio
  const volumeMap = new Map<string, { name: string; muscle_group: string; volume: number; sets: number }>();
  
  data.forEach((set: any) => {
    const exerciseId = set.exercise_id;
    const volume = set.weight_kg * set.reps;
    const name = set.health_exercises?.name || 'Unknown';
    const muscle_group = set.health_exercises?.muscle_group || 'Unknown';
    
    if (volumeMap.has(exerciseId)) {
      const current = volumeMap.get(exerciseId)!;
      volumeMap.set(exerciseId, {
        name,
        muscle_group,
        volume: current.volume + volume,
        sets: current.sets + 1,
      });
    } else {
      volumeMap.set(exerciseId, { name, muscle_group, volume, sets: 1 });
    }
  });
  
  // Convertir a array y ordenar
  return Array.from(volumeMap.values())
    .sort((a, b) => b.volume - a.volume)
    .slice(0, limit);
}

// Obtener asistencia semanal al gym
export async function getWeeklyGymAttendance() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No autenticado' };
    }

    const { data, error } = await supabase.rpc('get_weekly_gym_attendance');
    
    if (error) {
      console.error('Error getting weekly attendance:', error);
      return { success: false, error: 'Error al obtener asistencia' };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in getWeeklyGymAttendance:', error);
    return { success: false, error: 'Error al obtener asistencia' };
  }
}

// ============================================
// STRENGTH METRICS & 1RM FUNCTIONS
// ============================================

export interface StrengthMetrics {
  totalStrength: number; // Sum of top 3 1RMs
  monthlyVolume: number; // Total kg lifted this month
  prsThisMonth: number; // Number of PRs this month
  topLifts: {
    exercise: string;
    max1rm: number;
    date: string;
  }[];
}

export interface ExercisePR {
  exercise_id: string;
  exercise_name: string;
  category: string;
  max_1rm: number;
  max_weight: number;
  max_reps: number;
  total_sessions: number;
  total_sets: number;
}

export interface WorkoutHistoryItem {
  id: string;
  date: string;
  routine_name: string | null;
  duration_minutes: number | null;
  total_sets: number;
  total_volume: number;
  exercises: {
    name: string;
    sets: {
      weight_kg: number;
      reps: number;
      rpe: number | null;
      estimated_1rm: number | null;
    }[];
  }[];
}

// Obtener métricas de fuerza
export async function getStrengthMetrics(): Promise<StrengthMetrics> {
  const supabase = await createClient();
  
  try {
    // Obtener PRs de todos los ejercicios
    const { data: prs, error: prsError } = await supabase
      .from('exercise_prs')
      .select('*')
      .order('max_1rm', { ascending: false });
    
    if (prsError) throw prsError;
    
    // Top 3 1RMs para fuerza total (Bench, Squat, Deadlift/RDL)
    const topLifts = (prs || [])
      .filter(pr => pr.max_1rm > 0)
      .slice(0, 3)
      .map(pr => ({
        exercise: pr.exercise_name,
        max1rm: pr.max_1rm,
        date: new Date().toISOString(), // TODO: Get actual date from sets
      }));
    
    const totalStrength = topLifts.reduce((sum, lift) => sum + lift.max1rm, 0);
    
    // Volumen mensual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const { data: monthlySets, error: volumeError } = await supabase
      .from('health_sets')
      .select('weight_kg, reps, created_at')
      .gte('created_at', startOfMonth.toISOString());
    
    if (volumeError) throw volumeError;
    
    const monthlyVolume = (monthlySets || []).reduce(
      (sum, set) => sum + (set.weight_kg * set.reps),
      0
    );
    
    // PRs este mes (sets donde 1RM es el máximo histórico)
    // TODO: Implementar detección de PRs
    const prsThisMonth = 0;
    
    return {
      totalStrength: Math.round(totalStrength),
      monthlyVolume: Math.round(monthlyVolume),
      prsThisMonth,
      topLifts,
    };
  } catch (error) {
    console.error('Error getting strength metrics:', error);
    return {
      totalStrength: 0,
      monthlyVolume: 0,
      prsThisMonth: 0,
      topLifts: [],
    };
  }
}

// Obtener PRs por ejercicio
export async function getExercisePRs(): Promise<ExercisePR[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('exercise_prs')
    .select('*')
    .order('max_1rm', { ascending: false });
  
  if (error) {
    console.error('Error getting exercise PRs:', error);
    return [];
  }
  
  return (data || []) as ExercisePR[];
}

// Obtener historial de entrenamientos con detalles
export async function getWorkoutHistory(limit = 20): Promise<WorkoutHistoryItem[]> {
  const supabase = await createClient();
  
  try {
    // Obtener sesiones
    const { data: sessions, error: sessionsError } = await supabase
      .from('health_workout_sessions')
      .select(`
        id,
        date,
        duration_minutes,
        health_routines (
          name
        )
      `)
      .order('date', { ascending: false })
      .limit(limit);
    
    if (sessionsError) throw sessionsError;
    
    // Para cada sesión, obtener sets agrupados por ejercicio
    const history: WorkoutHistoryItem[] = [];
    
    for (const session of sessions || []) {
      const { data: sets, error: setsError } = await supabase
        .from('health_sets')
        .select(`
          weight_kg,
          reps,
          rpe,
          estimated_1rm,
          health_exercises (
            name
          )
        `)
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });
      
      if (setsError) continue;
      
      // Agrupar sets por ejercicio
      const exerciseMap = new Map<string, any[]>();
      
      (sets || []).forEach((set: any) => {
        const exerciseName = set.health_exercises?.name || 'Unknown';
        if (!exerciseMap.has(exerciseName)) {
          exerciseMap.set(exerciseName, []);
        }
        exerciseMap.get(exerciseName)!.push({
          weight_kg: set.weight_kg,
          reps: set.reps,
          rpe: set.rpe,
          estimated_1rm: set.estimated_1rm,
        });
      });
      
      const exercises = Array.from(exerciseMap.entries()).map(([name, sets]) => ({
        name,
        sets,
      }));
      
      const totalSets = (sets || []).length;
      const totalVolume = (sets || []).reduce(
        (sum: number, set: any) => sum + (set.weight_kg * set.reps),
        0
      );
      
      history.push({
        id: session.id,
        date: session.date,
        routine_name: (session as any).health_routines?.name || null,
        duration_minutes: session.duration_minutes,
        total_sets: totalSets,
        total_volume: Math.round(totalVolume),
        exercises,
      });
    }
    
    return history;
  } catch (error) {
    console.error('Error getting workout history:', error);
    return [];
  }
}

// Eliminar sesión de entrenamiento
export async function deleteWorkoutSession(sessionId: string) {
  const supabase = await createClient();
  
  try {
    // Primero eliminar los sets (por RLS)
    const { error: setsError } = await supabase
      .from('health_sets')
      .delete()
      .eq('session_id', sessionId);
    
    if (setsError) throw setsError;
    
    // Luego eliminar la sesión
    const { error: sessionError } = await supabase
      .from('health_workout_sessions')
      .delete()
      .eq('id', sessionId);
    
    if (sessionError) throw sessionError;
    
    revalidatePath('/dashboard/health');
    return { success: true };
  } catch (error) {
    console.error('Error deleting workout session:', error);
    return { success: false, error: 'Error al eliminar la sesión' };
  }
}

// Obtener progreso de 1RM por ejercicio (para gráficas)
export async function get1RMProgress(exerciseId: string, days = 90) {
  const supabase = await createClient();
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from('health_sets')
    .select(`
      estimated_1rm,
      weight_kg,
      reps,
      created_at,
      health_workout_sessions!inner (
        date
      )
    `)
    .eq('exercise_id', exerciseId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error getting 1RM progress:', error);
    return [];
  }
  
  // Agrupar por fecha y tomar el máximo 1RM de cada día
  const progressMap = new Map<string, number>();
  
  (data || []).forEach((set: any) => {
    const date = set.health_workout_sessions?.date || set.created_at.split('T')[0];
    const current1RM = set.estimated_1rm || 0;
    
    if (!progressMap.has(date) || progressMap.get(date)! < current1RM) {
      progressMap.set(date, current1RM);
    }
  });
  
  return Array.from(progressMap.entries())
    .map(([date, max1rm]) => ({ date, max1rm }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Export types from nutrition
export type {
  NutritionLog,
  MetabolicProfile,
  HealthStat,
} from './nutrition';
