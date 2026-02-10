'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ChronosEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  is_all_day: boolean;
  category: string;
  source_type: string | null;
  source_id: string | null;
  created_at: string;
  updated_at: string;
}

// Obtener todos los eventos
export async function getAllEvents() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('chronos_events')
    .select('*')
    .order('start_time', { ascending: true });
  
  if (error) {
    console.error('Error getting events:', error);
    return [];
  }
  
  return data as ChronosEvent[];
}

// Obtener eventos de un rango de fechas
export async function getEventsByDateRange(startDate: string, endDate: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('chronos_events')
    .select('*')
    .gte('start_time', startDate)
    .lte('start_time', endDate)
    .order('start_time', { ascending: true });
  
  if (error) {
    console.error('Error getting events by date range:', error);
    return [];
  }
  
  return data as ChronosEvent[];
}

// Obtener eventos del mes actual
export async function getCurrentMonthEvents() {
  const supabase = await createClient();
  
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const { data, error } = await supabase
    .from('chronos_events')
    .select('*')
    .gte('start_time', startOfMonth.toISOString())
    .lte('start_time', endOfMonth.toISOString())
    .order('start_time', { ascending: true });
  
  if (error) {
    console.error('Error getting current month events:', error);
    return [];
  }
  
  return data as ChronosEvent[];
}

// Crear evento manual
export async function createEvent(formData: {
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  is_all_day?: boolean;
  category?: string;
}) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('chronos_events')
    .insert([{
      ...formData,
      category: formData.category || 'soft',
      source_type: 'manual',
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating event:', error);
    throw new Error('Error al crear el evento');
  }
  
  revalidatePath('/dashboard/chronos');
  return data;
}

// Actualizar evento
export async function updateEvent(
  eventId: string,
  formData: {
    title?: string;
    description?: string;
    start_time?: string;
    end_time?: string;
    is_all_day?: boolean;
    category?: string;
  }
) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('chronos_events')
    .update(formData)
    .eq('id', eventId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating event:', error);
    throw new Error('Error al actualizar el evento');
  }
  
  revalidatePath('/dashboard/chronos');
  return data;
}

// Eliminar evento
export async function deleteEvent(eventId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('chronos_events')
    .delete()
    .eq('id', eventId);
  
  if (error) {
    console.error('Error deleting event:', error);
    throw new Error('Error al eliminar el evento');
  }
  
  revalidatePath('/dashboard/chronos');
}

// Obtener próximos eventos (para dashboard)
export async function getUpcomingEvents(limit = 5) {
  const supabase = await createClient();
  
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('chronos_events')
    .select('*')
    .gte('start_time', now)
    .order('start_time', { ascending: true })
    .limit(limit);
  
  if (error) {
    console.error('Error getting upcoming events:', error);
    return [];
  }
  
  return data as ChronosEvent[];
}

// Obtener eventos de hoy
export async function getTodayEvents() {
  const supabase = await createClient();
  
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
  
  const { data, error } = await supabase
    .from('chronos_events')
    .select('*')
    .gte('start_time', startOfDay)
    .lte('start_time', endOfDay)
    .order('start_time', { ascending: true });
  
  if (error) {
    console.error('Error getting today events:', error);
    return [];
  }
  
  return data as ChronosEvent[];
}

// Obtener estadísticas
export async function getEventStats() {
  const supabase = await createClient();
  
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  
  // Total de eventos
  const { count: totalEvents } = await supabase
    .from('chronos_events')
    .select('*', { count: 'exact', head: true });
  
  // Eventos este mes
  const { count: monthEvents } = await supabase
    .from('chronos_events')
    .select('*', { count: 'exact', head: true })
    .gte('start_time', startOfMonth);
  
  // Eventos de Wisdom (hard blocks)
  const { count: wisdomEvents } = await supabase
    .from('chronos_events')
    .select('*', { count: 'exact', head: true })
    .eq('source_type', 'wisdom');
  
  // Eventos de Finance
  const { count: financeEvents } = await supabase
    .from('chronos_events')
    .select('*', { count: 'exact', head: true })
    .eq('source_type', 'finance');
  
  return {
    totalEvents: totalEvents || 0,
    monthEvents: monthEvents || 0,
    wisdomEvents: wisdomEvents || 0,
    financeEvents: financeEvents || 0,
  };
}


