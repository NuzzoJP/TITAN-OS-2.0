import type { ChronosEvent } from '@/lib/actions/chronos';

// Obtener color según categoría/source
export function getEventColor(event: ChronosEvent): string {
  // Hard blocks (Wisdom) = Rojo
  if (event.source_type === 'wisdom' || event.category === 'hard') {
    return '#ef4444'; // Red
  }
  
  // Finance = Amarillo/Amber
  if (event.source_type === 'finance') {
    return '#f59e0b'; // Amber
  }
  
  // Health = Verde
  if (event.source_type === 'health') {
    return '#10b981'; // Emerald
  }
  
  // Soft blocks = Azul
  return '#3b82f6'; // Blue
}
