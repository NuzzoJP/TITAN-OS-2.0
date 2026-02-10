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

// Calcular métricas metabólicas usando fórmula Mifflin-St Jeor
export function calculateMetabolics(data: {
  weight_kg: number;
  height_cm: number;
  age: number;
  gender: 'male' | 'female';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'cut' | 'maintain' | 'bulk';
}) {
  // 1. BMR (Mifflin-St Jeor)
  const bmr = data.gender === 'male'
    ? (10 * data.weight_kg) + (6.25 * data.height_cm) - (5 * data.age) + 5
    : (10 * data.weight_kg) + (6.25 * data.height_cm) - (5 * data.age) - 161;
  
  // 2. TDEE (Total Daily Energy Expenditure)
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const tdee = bmr * multipliers[data.activity_level];
  
  // 3. Target Calories según objetivo
  const adjustments = { 
    cut: -500,      // Déficit para perder grasa
    maintain: 0,    // Mantener peso
    bulk: 300       // Superávit para ganar músculo
  };
  const target_calories = tdee + adjustments[data.goal];
  
  // 4. Macros
  // Proteína: 2g/kg (cut: 2.2g/kg para preservar músculo)
  const protein_g = data.goal === 'cut' ? data.weight_kg * 2.2 : data.weight_kg * 2.0;
  
  // Grasas: 1g/kg (esencial para hormonas)
  const fat_g = data.weight_kg * 1.0;
  
  // Carbos: llenar el resto de calorías
  const protein_kcal = protein_g * 4;
  const fat_kcal = fat_g * 9;
  const carbs_g = (target_calories - protein_kcal - fat_kcal) / 4;
  
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    daily_calorie_target: Math.round(target_calories),
    daily_protein_target_g: Math.round(protein_g),
    daily_carbs_target_g: Math.round(carbs_g),
    daily_fats_target_g: Math.round(fat_g),
  };
}

// Calcular y guardar perfil metabólico completo
export async function calculateAndSaveMetabolicProfile(formData: {
  height_cm: number;
  age: number;
  gender: 'male' | 'female';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'cut' | 'maintain' | 'bulk';
}) {
  const supabase = await createClient();
  
  // Obtener peso actual del usuario (última medición)
  const { data: latestStat } = await supabase
    .from('health_stats')
    .select('weight_kg')
    .order('measured_at', { ascending: false })
    .limit(1)
    .single();
  
  // Si no hay peso, usar un peso por defecto de 70kg para calcular
  const weight_kg = latestStat?.weight_kg || 70;
  
  // Calcular métricas
  const metrics = calculateMetabolics({
    weight_kg,
    ...formData,
  });
  
  // Verificar si existe un perfil
  const { data: existing } = await supabase
    .from('health_metabolic_profile')
    .select('id')
    .single();
  
  const profileData = {
    ...formData,
    current_weight_kg: weight_kg,
    ...metrics,
  };
  
  if (existing) {
    // Actualizar
    const { data, error } = await supabase
      .from('health_metabolic_profile')
      .update(profileData)
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
      .insert([profileData])
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

// Recalcular perfil metabólico cuando cambia el peso
export async function recalculateMetabolicProfile(newWeight: number) {
  const supabase = await createClient();
  
  // Obtener perfil actual
  const { data: profile, error: profileError } = await supabase
    .from('health_metabolic_profile')
    .select('*')
    .single();
  
  if (profileError || !profile) {
    console.error('No metabolic profile found');
    return null;
  }
  
  // Recalcular con nuevo peso
  const metrics = calculateMetabolics({
    weight_kg: newWeight,
    height_cm: profile.height_cm,
    age: profile.age,
    gender: profile.gender as 'male' | 'female',
    activity_level: profile.activity_level as any,
    goal: profile.goal as 'cut' | 'maintain' | 'bulk',
  });
  
  // Actualizar perfil
  const { data, error } = await supabase
    .from('health_metabolic_profile')
    .update({
      current_weight_kg: newWeight,
      ...metrics,
    })
    .eq('id', profile.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error recalculating profile:', error);
    throw new Error('Error al recalcular el perfil');
  }
  
  revalidatePath('/dashboard/health');
  return data;
}
