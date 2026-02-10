'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface NutritionLog {
  id: string;
  logged_at: string;
  meal_type: string;
  food_name: string | null;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  image_url: string | null;
  ai_provider: string | null;
  is_verified: boolean;
}

export interface MetabolicProfile {
  id: string;
  age: number;
  height_cm: number;
  gender: string;
  activity_level: string;
  current_weight_kg: number | null;
  bmr: number | null;
  tdee: number | null;
  daily_calorie_target: number | null;
  daily_protein_target_g: number | null;
  daily_carbs_target_g: number | null;
  daily_fats_target_g: number | null;
  goal: string;
}

export interface HealthStat {
  id: string;
  measured_at: string;
  weight_kg: number;
  body_fat_percent: number | null;
  muscle_mass_kg: number | null;
  source: string;
}

// Crear log de nutrición
export async function createNutritionLog(formData: {
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  ai_provider?: string;
  ai_analysis_json?: any;
  image_url?: string;
  notes?: string;
}) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('health_nutrition_logs')
    .insert([formData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating nutrition log:', error);
    throw new Error('Error al registrar la comida');
  }
  
  revalidatePath('/dashboard/health');
  return data;
}

// Obtener logs de nutrición del día
export async function getTodayNutritionLogs() {
  const supabase = await createClient();
  
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('health_nutrition_logs')
    .select('*')
    .gte('logged_at', `${today}T00:00:00`)
    .lte('logged_at', `${today}T23:59:59`)
    .order('logged_at', { ascending: false });
  
  if (error) {
    console.error('Error getting nutrition logs:', error);
    return [];
  }
  
  return data as NutritionLog[];
}

// Obtener resumen nutricional del día (usando RPC)
export async function getDailyNutritionSummary(date?: string) {
  const supabase = await createClient();
  
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase.rpc('get_daily_nutrition_summary', {
    target_date: targetDate,
  });
  
  if (error) {
    console.error('Error getting daily summary:', error);
    return {
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fats: 0,
      meal_count: 0,
    };
  }
  
  return data;
}

// Obtener perfil metabólico
export async function getMetabolicProfile() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('health_metabolic_profile')
    .select('*')
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error getting metabolic profile:', error);
    return null;
  }
  
  return data as MetabolicProfile | null;
}

// Crear o actualizar perfil metabólico
export async function upsertMetabolicProfile(formData: {
  age: number;
  height_cm: number;
  gender: 'male' | 'female';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'cut' | 'maintain' | 'bulk';
}) {
  const supabase = await createClient();
  
  // Verificar si existe un perfil
  const { data: existing } = await supabase
    .from('health_metabolic_profile')
    .select('id')
    .single();
  
  if (existing) {
    // Actualizar
    const { data, error } = await supabase
      .from('health_metabolic_profile')
      .update(formData)
      .eq('id', existing.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating metabolic profile:', error);
      throw new Error('Error al actualizar el perfil');
    }
    
    revalidatePath('/dashboard/health');
    return data;
  } else {
    // Crear
    const { data, error } = await supabase
      .from('health_metabolic_profile')
      .insert([formData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating metabolic profile:', error);
      throw new Error('Error al crear el perfil');
    }
    
    revalidatePath('/dashboard/health');
    return data;
  }
}

// Registrar peso (trigger actualizará perfil metabólico automáticamente)
export async function createHealthStat(formData: {
  weight_kg: number;
  body_fat_percent?: number;
  muscle_mass_kg?: number;
  source?: string;
}) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('health_stats')
    .insert([{
      ...formData,
      source: formData.source || 'manual',
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating health stat:', error);
    throw new Error('Error al registrar el peso');
  }
  
  revalidatePath('/dashboard/health');
  return data;
}

// Obtener progreso de peso (últimos 30 días)
export async function getWeightProgress(days = 30) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.rpc('get_weight_progress', {
    days,
  });
  
  if (error) {
    console.error('Error getting weight progress:', error);
    return [];
  }
  
  return data;
}

// Obtener últimas estadísticas de salud
export async function getRecentHealthStats(limit = 10) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('health_stats')
    .select('*')
    .order('measured_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error getting health stats:', error);
    return [];
  }
  
  return data as HealthStat[];
}
