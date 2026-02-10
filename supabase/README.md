# Configuración de Supabase para Titan OS

## Instrucciones de Instalación

1. Ve a tu proyecto de Supabase: https://mjdxpsocskalzhkctnyf.supabase.co
2. Navega a **SQL Editor** en el panel lateral
3. Copia y pega el contenido completo de `schema.sql`
4. Ejecuta el script (botón "Run")

## Estructura de la Base de Datos

### MÓDULO 1: FINANCE
- `finance_accounts`: Cuentas bancarias y efectivo
- `finance_transactions`: Movimientos de dinero
- `finance_budgets`: Presupuestos mensuales
- **Función RPC**: `get_daily_safe_to_spend()` - Calcula cuánto puedes gastar hoy

### MÓDULO 2: HEALTH
- `health_exercises`: Catálogo de ejercicios
- `health_workout_sessions`: Sesiones de entrenamiento
- `health_sets`: Series individuales con peso/reps
- **Trigger**: Calcula automáticamente el 1RM (One Rep Max) usando fórmula Epley
- **Función RPC**: `get_previous_log(exercise_id)` - Ghost Mode para ver último registro

### MÓDULO 3: WISDOM
- `wisdom_terms`: Semestres universitarios
- `wisdom_subjects`: Materias (con UC y proyección)
- `wisdom_evaluations`: Evaluaciones individuales
- **Triggers**: Recalcula automáticamente proyecciones y promedios ponderados
- **Sincronización**: Crea eventos en Chronos cuando hay evaluaciones con fecha

### MÓDULO 4: CHRONOS
- `chronos_events`: Calendario de eventos
- **Categorías**: Hard Block (no movible) / Soft Block (flexible)
- **Sincronización**: Recibe eventos automáticos de Wisdom y Finance

## Características Técnicas

### Triggers Implementados
1. **1RM Automático**: Calcula One Rep Max en cada set
2. **Balance Automático**: Actualiza saldo de cuentas al crear transacciones
3. **Proyección Académica**: Recalcula notas al actualizar evaluaciones
4. **Promedio Ponderado**: Actualiza promedio del semestre (Nota × UC)
5. **Sincronización Chronos**: Crea/actualiza/elimina eventos automáticamente
6. **Timestamps**: Actualiza `updated_at` automáticamente

### Funciones RPC
- `get_daily_safe_to_spend()`: Gasto diario seguro
- `get_previous_log(exercise_id)`: Último registro de ejercicio
- `calculate_one_rep_max(weight, reps)`: Fórmula Epley

## Validaciones
- Notas: 0-20 (escala venezolana)
- RPE: 1-10
- Tipos de cuenta: banco, efectivo, tarjeta, inversión
- Categorías de eventos: hard, soft

## Datos Iniciales
El script incluye ejercicios básicos pre-cargados (Press Banca, Sentadilla, etc.)

## Row Level Security (RLS)
Las políticas RLS están comentadas. Descoméntalas si implementas autenticación de usuarios.
