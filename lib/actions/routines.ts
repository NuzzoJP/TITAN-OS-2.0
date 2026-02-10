'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Routine {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  routine_type: 'push' | 'pull' | 'legs' | 'upper' | 'lower' | 'full_body' | 'custom';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration_minutes: number;
  is_template: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoutineExercise {
  id: string;
  routine_id: string;
  exercise_id: string;
  exercise_order: number;
  target_sets: number;
  target_reps_min: number;
  target_reps_max: number;
  rest_seconds: number;
  rpe_target: number | null;
  percentage_1rm: number | null;
  is_superset: boolean;
  superset_group: number | null;
  is_dropset: boolean;
  notes: string | null;
  exercise?: {
    name: string;
    muscle_group: string;
    equipment: string;
  };
}

// Obtener todas las rutinas del usuario (incluyendo templates)
export async function getRoutines() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No autenticado' };
    }

    const { data, error } = await supabase
      .from('health_routines')
      .select('*')
      .or(`user_id.eq.${user.id},is_template.eq.true`)
      .order('is_template', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching routines:', error);
      return { success: false, error: 'Error al obtener rutinas' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in getRoutines:', error);
    return { success: false, error: 'Error al obtener rutinas' };
  }
}

// Obtener ejercicios de una rutina
export async function getRoutineExercises(routineId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('health_routine_exercises')
      .select(`
        *,
        health_exercises (
          name,
          muscle_group,
          equipment,
          primary_muscles,
          secondary_muscles,
          rest_timer_seconds
        )
      `)
      .eq('routine_id', routineId)
      .order('exercise_order', { ascending: true });

    if (error) {
      console.error('Error fetching routine exercises:', error);
      return { success: false, error: 'Error al obtener ejercicios' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in getRoutineExercises:', error);
    return { success: false, error: 'Error al obtener ejercicios' };
  }
}

// Crear rutina nueva
export async function createRoutine(formData: {
  name: string;
  description?: string;
  routine_type: string;
  difficulty: string;
  estimated_duration_minutes?: number;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No autenticado' };
    }

    const { data, error } = await supabase
      .from('health_routines')
      .insert({
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        routine_type: formData.routine_type,
        difficulty: formData.difficulty,
        estimated_duration_minutes: formData.estimated_duration_minutes || 60,
        is_template: false,
        is_active: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating routine:', error);
      return { success: false, error: 'Error al crear rutina' };
    }

    revalidatePath('/dashboard/health');
    return { success: true, data };
  } catch (error) {
    console.error('Error in createRoutine:', error);
    return { success: false, error: 'Error al crear rutina' };
  }
}

// Clonar rutina template
export async function cloneRoutine(templateId: string, newName?: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No autenticado' };
    }

    // Obtener rutina original
    const { data: template, error: templateError } = await supabase
      .from('health_routines')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      return { success: false, error: 'Rutina no encontrada' };
    }

    // Crear nueva rutina
    const { data: newRoutine, error: routineError } = await supabase
      .from('health_routines')
      .insert({
        user_id: user.id,
        name: newName || `${template.name} (Copia)`,
        description: template.description,
        routine_type: template.routine_type,
        difficulty: template.difficulty,
        estimated_duration_minutes: template.estimated_duration_minutes,
        is_template: false,
        is_active: false,
      })
      .select()
      .single();

    if (routineError || !newRoutine) {
      return { success: false, error: 'Error al crear rutina' };
    }

    // Copiar ejercicios
    const { data: exercises, error: exercisesError } = await supabase
      .from('health_routine_exercises')
      .select('*')
      .eq('routine_id', templateId);

    if (exercisesError || !exercises) {
      return { success: false, error: 'Error al copiar ejercicios' };
    }

    const newExercises = exercises.map(ex => ({
      routine_id: newRoutine.id,
      exercise_id: ex.exercise_id,
      exercise_order: ex.exercise_order,
      target_sets: ex.target_sets,
      target_reps_min: ex.target_reps_min,
      target_reps_max: ex.target_reps_max,
      rest_seconds: ex.rest_seconds,
      rpe_target: ex.rpe_target,
      percentage_1rm: ex.percentage_1rm,
      is_superset: ex.is_superset,
      superset_group: ex.superset_group,
      is_dropset: ex.is_dropset,
      notes: ex.notes,
    }));

    const { error: insertError } = await supabase
      .from('health_routine_exercises')
      .insert(newExercises);

    if (insertError) {
      return { success: false, error: 'Error al copiar ejercicios' };
    }

    revalidatePath('/dashboard/health');
    return { success: true, data: newRoutine };
  } catch (error) {
    console.error('Error in cloneRoutine:', error);
    return { success: false, error: 'Error al clonar rutina' };
  }
}

// Actualizar rutina
export async function updateRoutine(routineId: string, updates: Partial<Routine>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No autenticado' };
    }

    const { data, error } = await supabase
      .from('health_routines')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', routineId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating routine:', error);
      return { success: false, error: 'Error al actualizar rutina' };
    }

    revalidatePath('/dashboard/health');
    return { success: true, data };
  } catch (error) {
    console.error('Error in updateRoutine:', error);
    return { success: false, error: 'Error al actualizar rutina' };
  }
}

// Eliminar rutina
export async function deleteRoutine(routineId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No autenticado' };
    }

    const { error } = await supabase
      .from('health_routines')
      .delete()
      .eq('id', routineId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting routine:', error);
      return { success: false, error: 'Error al eliminar rutina' };
    }

    revalidatePath('/dashboard/health');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteRoutine:', error);
    return { success: false, error: 'Error al eliminar rutina' };
  }
}

// Agregar ejercicio a rutina
export async function addExerciseToRoutine(formData: {
  routine_id: string;
  exercise_id: string;
  exercise_order: number;
  target_sets: number;
  target_reps_min: number;
  target_reps_max: number;
  rest_seconds?: number;
  rpe_target?: number;
  notes?: string;
}) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('health_routine_exercises')
      .insert(formData)
      .select()
      .single();

    if (error) {
      console.error('Error adding exercise to routine:', error);
      return { success: false, error: 'Error al agregar ejercicio' };
    }

    revalidatePath('/dashboard/health');
    return { success: true, data };
  } catch (error) {
    console.error('Error in addExerciseToRoutine:', error);
    return { success: false, error: 'Error al agregar ejercicio' };
  }
}

// Actualizar ejercicio de rutina
export async function updateRoutineExercise(exerciseId: string, updates: Partial<RoutineExercise>) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('health_routine_exercises')
      .update(updates)
      .eq('id', exerciseId)
      .select()
      .single();

    if (error) {
      console.error('Error updating routine exercise:', error);
      return { success: false, error: 'Error al actualizar ejercicio' };
    }

    revalidatePath('/dashboard/health');
    return { success: true, data };
  } catch (error) {
    console.error('Error in updateRoutineExercise:', error);
    return { success: false, error: 'Error al actualizar ejercicio' };
  }
}

// Eliminar ejercicio de rutina
export async function removeExerciseFromRoutine(exerciseId: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('health_routine_exercises')
      .delete()
      .eq('id', exerciseId);

    if (error) {
      console.error('Error removing exercise from routine:', error);
      return { success: false, error: 'Error al eliminar ejercicio' };
    }

    revalidatePath('/dashboard/health');
    return { success: true };
  } catch (error) {
    console.error('Error in removeExerciseFromRoutine:', error);
    return { success: false, error: 'Error al eliminar ejercicio' };
  }
}

// Activar rutina (desactiva las demás)
export async function setActiveRoutine(routineId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No autenticado' };
    }

    // Desactivar todas las rutinas del usuario
    await supabase
      .from('health_routines')
      .update({ is_active: false })
      .eq('user_id', user.id);

    // Activar la seleccionada
    const { data, error } = await supabase
      .from('health_routines')
      .update({ is_active: true })
      .eq('id', routineId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error setting active routine:', error);
      return { success: false, error: 'Error al activar rutina' };
    }

    revalidatePath('/dashboard/health');
    return { success: true, data };
  } catch (error) {
    console.error('Error in setActiveRoutine:', error);
    return { success: false, error: 'Error al activar rutina' };
  }
}

// Iniciar sesión desde rutina
export async function startWorkoutFromRoutine(routineId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No autenticado' };
    }

    // Obtener rutina
    const { data: routine, error: routineError } = await supabase
      .from('health_routines')
      .select('*')
      .eq('id', routineId)
      .single();

    if (routineError || !routine) {
      return { success: false, error: 'Rutina no encontrada' };
    }

    // Crear sesión de entrenamiento
    const { data: session, error: sessionError } = await supabase
      .from('health_workout_sessions')
      .insert({
        user_id: user.id,
        start_time: new Date().toISOString(),
        notes: `Rutina: ${routine.name}`,
      })
      .select()
      .single();

    if (sessionError || !session) {
      return { success: false, error: 'Error al crear sesión' };
    }

    revalidatePath('/dashboard/health');
    return { success: true, data: { session, routine } };
  } catch (error) {
    console.error('Error in startWorkoutFromRoutine:', error);
    return { success: false, error: 'Error al iniciar sesión' };
  }
}
