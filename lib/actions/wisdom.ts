'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Term {
  id: string;
  name: string;
  is_active: boolean;
  term_average: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export interface Subject {
  id: string;
  term_id: string;
  name: string;
  credit_units: number;
  status: string;
  current_projection: number;
  accumulated_points: number;
  created_at: string;
}

export interface Evaluation {
  id: string;
  subject_id: string;
  name: string;
  weight_percentage: number;
  obtained_grade: number | null;
  is_completed: boolean;
  due_date: string | null;
  created_at: string;
}

// Obtener todos los términos
export async function getTerms() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('wisdom_terms')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error getting terms:', error);
    return [];
  }
  
  return data as Term[];
}

// Obtener término activo
export async function getActiveTerm() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('wisdom_terms')
    .select('*')
    .eq('is_active', true)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error getting active term:', error);
    return null;
  }
  
  return data as Term | null;
}

// Obtener materias de un término
export async function getSubjectsByTerm(termId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('wisdom_subjects')
    .select('*')
    .eq('term_id', termId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error getting subjects:', error);
    return [];
  }
  
  return data as Subject[];
}

// Obtener evaluaciones de una materia
export async function getEvaluationsBySubject(subjectId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('wisdom_evaluations')
    .select('*')
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error getting evaluations:', error);
    return [];
  }
  
  return data as Evaluation[];
}

// Crear término
export async function createTerm(formData: {
  name: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}) {
  const supabase = await createClient();
  
  // Si el nuevo término es activo, desactivar los demás
  if (formData.is_active) {
    await supabase
      .from('wisdom_terms')
      .update({ is_active: false })
      .eq('is_active', true);
  }
  
  const { data, error } = await supabase
    .from('wisdom_terms')
    .insert([formData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating term:', error);
    throw new Error('Error al crear el semestre');
  }
  
  revalidatePath('/dashboard/wisdom');
  return data;
}

// Crear materia
export async function createSubject(formData: {
  term_id: string;
  name: string;
  credit_units: number;
  status?: string;
}) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('wisdom_subjects')
    .insert([{
      ...formData,
      status: formData.status || 'cursando',
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating subject:', error);
    throw new Error('Error al crear la materia');
  }
  
  revalidatePath('/dashboard/wisdom');
  return data;
}

// Crear evaluación
export async function createEvaluation(formData: {
  subject_id: string;
  name: string;
  weight_percentage: number;
  obtained_grade?: number;
  is_completed?: boolean;
  due_date?: string;
}) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('wisdom_evaluations')
    .insert([{
      ...formData,
      is_completed: formData.is_completed || false,
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating evaluation:', error);
    throw new Error('Error al crear la evaluación');
  }
  
  revalidatePath('/dashboard/wisdom');
  return data;
}

// Actualizar nota de evaluación
export async function updateEvaluationGrade(
  evaluationId: string,
  grade: number
) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('wisdom_evaluations')
    .update({
      obtained_grade: grade,
      is_completed: true,
    })
    .eq('id', evaluationId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating evaluation grade:', error);
    throw new Error('Error al actualizar la nota');
  }
  
  revalidatePath('/dashboard/wisdom');
  return data;
}


