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

// Export types from nutrition
export type {
  NutritionLog,
  MetabolicProfile,
  HealthStat,
} from './nutrition';
