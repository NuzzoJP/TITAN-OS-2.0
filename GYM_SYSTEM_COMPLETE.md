# 🏋️ TITAN GYM - Sistema Completo (Jeff Nippard Style)

## 📋 Resumen Ejecutivo

Sistema avanzado de tracking de gym basado en metodología científica (Jeff Nippard).
Incluye rutinas PPL A/B, progresión dual (peso + volumen), análisis semanal, y cronómetro inteligente.

---

## ✅ Archivos Creados

### SQL (Base de Datos)
1. **`gym_advanced_system.sql`** - Sistema completo con:
   - Librería de ejercicios expandida (60+ ejercicios)
   - Metadata avanzada (tipo, patrón, dificultad, músculos)
   - Sistema de rutinas con superseries y dropsets
   - Tracking de RPE, RIR, tempo
   - Análisis semanal automático
   - Predicción de objetivos
   - Comparación con estándares de fuerza

2. **`ppl_routines_jeff_nippard.sql`** - 6 rutinas pre-hechas:
   - Push Day A (Chest Focus)
   - Push Day B (Shoulder Focus)
   - Pull Day A (Width Focus)
   - Pull Day B (Thickness + Deadlift)
   - Leg Day A (Quad Focus)
   - Leg Day B (Glute/Ham Focus)

### Componentes
3. **`rest-timer-overlay.tsx`** - Cronómetro pantalla completa con:
   - Progress ring animado
   - Ajuste de tiempo (+/- 15s)
   - Botones rápidos (1:00, 1:30, 2:00, 3:00)
   - Notificación al terminar
   - Vibración (móvil)

---

## 🎯 Funcionalidades Implementadas

### 1. Librería de Ejercicios Avanzada

Cada ejercicio tiene:
- **Tipo**: Compound, Isolation, Accessory
- **Patrón**: Push, Pull, Legs, Core
- **Dificultad**: Beginner, Intermediate, Advanced
- **Músculos primarios y secundarios**
- **Rango de reps recomendado** (ej: 6-10)
- **Tiempo de descanso** (60s-240s según músculo)
- **Variantes** (ej: Incline Bench es variante de Bench Press)

### 2. Rutinas PPL Estilo Jeff Nippard

**Push Day A** (Chest Focus):
1. Bench Press - 4×6-8 @ RPE 8.5
2. Incline DB Press - 3×8-10 @ RPE 8.0
3. Cable Fly - 3×12-15 @ RPE 8.0
4. Overhead Press - 3×8-10 @ RPE 8.0
5. Lateral Raises - 3×12-15 @ RPE 8.5
6. Tricep Pushdown - 3×10-12 @ RPE 8.0
7. Overhead Extension - 2×12-15 @ RPE 8.0

**Push Day B** (Shoulder Focus):
1. Overhead Press - 4×6-8 @ RPE 8.5
2. Incline Bench - 3×8-10 @ RPE 8.0
3. DB Press - 3×10-12 @ RPE 7.5
4. Lateral Raises - 4×12-15 @ RPE 8.5
5. Face Pulls - 3×15-20 @ RPE 7.5
6. Cable Fly - 3×12-15 @ RPE 8.0
7. Tricep Rope - 3×12-15 @ RPE 8.0

**Pull Day A** (Width Focus):
1. Pull-ups - 4×6-10 @ RPE 8.5
2. Lat Pulldown - 3×8-12 @ RPE 8.0
3. Barbell Row - 4×8-10 @ RPE 8.0
4. Face Pulls - 3×15-20 @ RPE 7.5
5. Barbell Curl - 3×8-12 @ RPE 8.0
6. Hammer Curl - 3×10-15 @ RPE 8.0

**Pull Day B** (Thickness + Deadlift):
1. Deadlift - 3×5-8 @ RPE 8.5
2. Cable Row - 4×8-12 @ RPE 8.0
3. DB Row - 3×10-12 @ RPE 8.0
4. Lat Pulldown - 3×10-15 @ RPE 7.5
5. DB Curl - 3×10-12 @ RPE 8.0
6. Cable Curl - 3×12-15 @ RPE 8.0

**Leg Day A** (Quad Focus):
1. Squat - 4×6-8 @ RPE 8.5
2. Leg Press - 3×10-12 @ RPE 8.0
3. Leg Extension - 3×12-15 @ RPE 8.5
4. RDL - 3×8-10 @ RPE 8.0
5. Leg Curl - 3×10-15 @ RPE 8.0
6. Calf Raises - 4×12-20 @ RPE 8.5

**Leg Day B** (Glute/Ham Focus):
1. RDL - 4×6-8 @ RPE 8.5
2. Hip Thrust - 4×8-12 @ RPE 8.5
3. Bulgarian Split Squat - 3×10-12 @ RPE 8.0
4. Leg Curl - 4×10-15 @ RPE 8.5
5. Leg Extension - 3×12-15 @ RPE 7.5
6. Seated Calf Raise - 4×15-20 @ RPE 8.5

### 3. Sistema de Progresión Dual

**Progresión por Peso**:
- Aumenta peso cuando completes el rango alto de reps con RPE <8
- Ejemplo: Si haces 12 reps @ RPE 7.5, sube peso

**Progresión por Volumen**:
- Aumenta sets cuando te estanques en peso
- Ejemplo: De 3 sets a 4 sets

**Auto-sugerencia de Peso**:
```sql
SELECT suggest_weight_for_rpe('exercise_id', 10, 8.0);
-- Retorna: { suggested_weight: 82.5, percentage_1rm: 85, last_1rm: 97 }
```

### 4. Cronómetro Inteligente

**Tiempos por Músculo**:
- Pecho/Espalda/Piernas (Compounds): 180-240s
- Hombros/Brazos (Isolation): 90-120s
- Pantorrillas/Abdomen: 60-90s

**Funcionalidades**:
- Pantalla completa con progress ring
- Ajuste rápido (+/- 15s)
- Botones preset (1:00, 1:30, 2:00, 3:00)
- Notificación + vibración al terminar
- Pausa/Resume

### 5. Análisis Semanal Automático

**Métricas Trackeadas**:
- Volumen total por grupo muscular (kg × reps)
- Frecuencia (días entrenados)
- Sets totales por músculo
- Intensidad promedio (RPE)

**Función SQL**:
```sql
SELECT calculate_weekly_volume('2026-02-10');
-- Retorna: { chest: 12500, back: 15000, legs: 18000, ... }
```

**Recomendaciones Automáticas**:
- "Aumenta volumen en piernas (solo 8 sets esta semana, objetivo: 12-16)"
- "Llevas 3 semanas sin progresar en Bench Press. Prueba variante o deload."
- "Excelente frecuencia: 6 días esta semana"

### 6. Predicción de Objetivos

**Función SQL**:
```sql
SELECT predict_weight_achievement('bench_press_id', 100, 5);
-- Retorna: {
--   possible: true,
--   current_1rm: 95,
--   target_1rm: 116,
--   weeks_needed: 8,
--   predicted_date: '2026-04-07',
--   weekly_gain: 2.6
-- }
```

### 7. Comparación con Estándares

**Niveles de Fuerza** (basados en Strength Level):
- Beginner: Primeros 6 meses
- Novice: 6-12 meses
- Intermediate: 1-2 años
- Advanced: 2-5 años
- Elite: 5+ años

**Ejemplo para 60kg de peso corporal**:
- Bench Press: Beginner (40kg) → Elite (120kg)
- Squat: Beginner (50kg) → Elite (170kg)
- Deadlift: Beginner (60kg) → Elite (200kg)

---

## 🔧 Pasos de Implementación

### Paso 1: Ejecutar SQL
```bash
# En Supabase SQL Editor:
1. gym_advanced_system.sql
2. ppl_routines_jeff_nippard.sql
```

### Paso 2: Crear Componentes Faltantes

**Componentes a crear**:
1. `routine-selector.tsx` - Seleccionar rutina al iniciar sesión
2. `workout-session-active.tsx` - Sesión activa con cronómetro
3. `exercise-log-form.tsx` - Formulario mejorado con Ghost Mode
4. `weekly-analysis-dashboard.tsx` - Dashboard de análisis
5. `weight-goal-tracker.tsx` - Tracker de objetivos
6. `strength-standards-comparison.tsx` - Comparación con estándares

### Paso 3: Integrar en Health Page

Agregar tabs:
- Gym (actual)
- Rutinas (nuevo)
- Análisis (nuevo)
- Progreso (Cubitt)
- Nutrition

---

## 📊 Métricas que Trackea el Sistema

### Por Sesión:
- Ejercicios realizados
- Sets × Reps × Peso
- RPE por set
- Tiempo de descanso
- Duración total

### Por Semana:
- Volumen total (kg)
- Volumen por músculo
- Frecuencia (días)
- Sets totales
- Intensidad promedio

### Por Mes:
- Progreso de 1RM por ejercicio
- Ganancia de fuerza (%)
- Comparación con mes anterior
- Predicción de objetivos

---

## 🎓 Conceptos Clave (Jeff Nippard)

### RPE (Rate of Perceived Exertion)
- 10: Fallo muscular
- 9: 1 rep en reserva (RIR 1)
- 8: 2 reps en reserva (RIR 2)
- 7: 3 reps en reserva (RIR 3)

**Recomendación**: Entrenar entre RPE 7-9 para hipertrofia.

### Volumen Óptimo (Sets por Semana)
- Pecho: 12-20 sets
- Espalda: 14-22 sets
- Piernas: 14-24 sets
- Hombros: 12-18 sets
- Brazos: 12-18 sets

### Deload (cada 4-6 semanas)
- Reducir volumen 50% (mitad de sets)
- Mantener intensidad (mismo peso)
- O reducir intensidad 20% (menos peso)
- Duración: 1 semana

### Periodización
- **Semanas 1-3**: Volumen alto, intensidad moderada
- **Semana 4**: Deload
- **Semanas 5-7**: Volumen moderado, intensidad alta
- **Semana 8**: Deload

---

## 🚀 Próximos Pasos

### Inmediato:
1. Ejecutar SQL
2. Crear componente de rutinas
3. Integrar cronómetro
4. Probar flujo completo

### Corto Plazo:
1. Dashboard de análisis semanal
2. Sistema de objetivos
3. Comparación con estándares
4. Integración con Cubitt

### Largo Plazo:
1. IA para sugerir rutinas personalizadas
2. Detección automática de estancamiento
3. Recomendaciones de deload
4. Social features (comparar con amigos)

---

**Última actualización**: 10 de Febrero, 2026
**Basado en**: Metodología Jeff Nippard + Ciencia del entrenamiento
