-- =====================================================
-- TITAN GYM - ADVANCED SYSTEM (Jeff Nippard Style)
-- =====================================================

-- =====================================================
-- 1. EXPANDIR LIBRERÍA DE EJERCICIOS
-- =====================================================

-- Agregar columnas avanzadas a health_exercises
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS exercise_type TEXT CHECK (exercise_type IN ('compound', 'isolation', 'accessory'));
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS movement_pattern TEXT CHECK (movement_pattern IN ('push', 'pull', 'legs', 'core'));
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced'));
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS primary_muscles TEXT[]; -- Array de músculos primarios
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS secondary_muscles TEXT[]; -- Array de músculos secundarios
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS rep_range_min INTEGER DEFAULT 6;
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS rep_range_max INTEGER DEFAULT 12;
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS rest_timer_seconds INTEGER DEFAULT 120;
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS is_variant_of UUID REFERENCES health_exercises(id); -- Para variantes
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS notes TEXT;

-- Actualizar ejercicios existentes con metadata
UPDATE health_exercises SET 
  exercise_type = 'compound',
  movement_pattern = 'push',
  difficulty_level = 'intermediate',
  primary_muscles = ARRAY['Chest', 'Triceps'],
  secondary_muscles = ARRAY['Shoulders'],
  rep_range_min = 6,
  rep_range_max = 10,
  rest_timer_seconds = 180
WHERE name = 'Bench Press';

UPDATE health_exercises SET 
  exercise_type = 'compound',
  movement_pattern = 'push',
  difficulty_level = 'intermediate',
  primary_muscles = ARRAY['Chest', 'Shoulders'],
  secondary_muscles = ARRAY['Triceps'],
  rep_range_min = 8,
  rep_range_max = 12,
  rest_timer_seconds = 180
WHERE name = 'Incline Bench Press';

UPDATE health_exercises SET 
  exercise_type = 'compound',
  movement_pattern = 'pull',
  difficulty_level = 'advanced',
  primary_muscles = ARRAY['Back', 'Glutes', 'Hamstrings'],
  secondary_muscles = ARRAY['Core', 'Traps'],
  rep_range_min = 5,
  rep_range_max = 8,
  rest_timer_seconds = 240
WHERE name = 'Deadlift';

UPDATE health_exercises SET 
  exercise_type = 'compound',
  movement_pattern = 'legs',
  difficulty_level = 'intermediate',
  primary_muscles = ARRAY['Quads', 'Glutes'],
  secondary_muscles = ARRAY['Core', 'Hamstrings'],
  rep_range_min = 6,
  rep_range_max = 10,
  rest_timer_seconds = 240
WHERE name = 'Squat';

UPDATE health_exercises SET 
  exercise_type = 'isolation',
  movement_pattern = 'push',
  difficulty_level = 'beginner',
  primary_muscles = ARRAY['Biceps'],
  secondary_muscles = ARRAY[],
  rep_range_min = 8,
  rep_range_max = 15,
  rest_timer_seconds = 90
WHERE name LIKE '%Curl%';

UPDATE health_exercises SET 
  exercise_type = 'isolation',
  movement_pattern = 'push',
  difficulty_level = 'beginner',
  primary_muscles = ARRAY['Shoulders'],
  secondary_muscles = ARRAY[],
  rep_range_min = 10,
  rep_range_max = 15,
  rest_timer_seconds = 90
WHERE name LIKE '%Lateral Raise%';

-- Insertar más ejercicios con metadata completa
INSERT INTO health_exercises (name, muscle_group, equipment, exercise_type, movement_pattern, difficulty_level, primary_muscles, secondary_muscles, rep_range_min, rep_range_max, rest_timer_seconds) VALUES
-- PUSH EXERCISES
('Flat Dumbbell Press', 'Chest', 'Dumbbell', 'compound', 'push', 'intermediate', ARRAY['Chest'], ARRAY['Triceps', 'Shoulders'], 8, 12, 180),
('Cable Crossover', 'Chest', 'Cable', 'isolation', 'push', 'beginner', ARRAY['Chest'], ARRAY[], 12, 15, 90),
('Machine Chest Press', 'Chest', 'Machine', 'compound', 'push', 'beginner', ARRAY['Chest'], ARRAY['Triceps'], 8, 12, 120),
('Overhead Dumbbell Press', 'Shoulders', 'Dumbbell', 'compound', 'push', 'intermediate', ARRAY['Shoulders'], ARRAY['Triceps'], 8, 12, 150),
('Cable Lateral Raise', 'Shoulders', 'Cable', 'isolation', 'push', 'beginner', ARRAY['Shoulders'], ARRAY[], 12, 15, 90),
('Face Pull', 'Shoulders', 'Cable', 'isolation', 'pull', 'beginner', ARRAY['Rear Delts'], ARRAY['Traps'], 15, 20, 60),
('Tricep Rope Pushdown', 'Arms', 'Cable', 'isolation', 'push', 'beginner', ARRAY['Triceps'], ARRAY[], 10, 15, 90),
('Overhead Cable Extension', 'Arms', 'Cable', 'isolation', 'push', 'intermediate', ARRAY['Triceps'], ARRAY[], 10, 15, 90),

-- PULL EXERCISES
('Weighted Pull-ups', 'Back', 'Bodyweight', 'compound', 'pull', 'advanced', ARRAY['Lats', 'Biceps'], ARRAY['Traps'], 6, 10, 180),
('Cable Row', 'Back', 'Cable', 'compound', 'pull', 'intermediate', ARRAY['Back'], ARRAY['Biceps'], 8, 12, 120),
('Single Arm Dumbbell Row', 'Back', 'Dumbbell', 'compound', 'pull', 'intermediate', ARRAY['Back'], ARRAY['Biceps'], 8, 12, 120),
('Chest Supported Row', 'Back', 'Machine', 'compound', 'pull', 'beginner', ARRAY['Back'], ARRAY['Biceps'], 10, 15, 120),
('Straight Arm Pulldown', 'Back', 'Cable', 'isolation', 'pull', 'beginner', ARRAY['Lats'], ARRAY[], 12, 15, 90),
('EZ Bar Curl', 'Arms', 'Barbell', 'isolation', 'pull', 'beginner', ARRAY['Biceps'], ARRAY[], 8, 12, 90),
('Incline Dumbbell Curl', 'Arms', 'Dumbbell', 'isolation', 'pull', 'intermediate', ARRAY['Biceps'], ARRAY[], 10, 15, 90),
('Cable Curl', 'Arms', 'Cable', 'isolation', 'pull', 'beginner', ARRAY['Biceps'], ARRAY[], 12, 15, 90),

-- LEG EXERCISES
('Front Squat', 'Legs', 'Barbell', 'compound', 'legs', 'advanced', ARRAY['Quads'], ARRAY['Core', 'Glutes'], 6, 10, 240),
('Hack Squat', 'Legs', 'Machine', 'compound', 'legs', 'intermediate', ARRAY['Quads'], ARRAY['Glutes'], 8, 12, 180),
('Walking Lunges', 'Legs', 'Dumbbell', 'compound', 'legs', 'intermediate', ARRAY['Quads', 'Glutes'], ARRAY['Hamstrings'], 10, 15, 120),
('Leg Press', 'Legs', 'Machine', 'compound', 'legs', 'beginner', ARRAY['Quads', 'Glutes'], ARRAY[], 10, 15, 150),
('Lying Leg Curl', 'Legs', 'Machine', 'isolation', 'legs', 'beginner', ARRAY['Hamstrings'], ARRAY[], 10, 15, 90),
('Seated Leg Curl', 'Legs', 'Machine', 'isolation', 'legs', 'beginner', ARRAY['Hamstrings'], ARRAY[], 10, 15, 90),
('Leg Extension', 'Legs', 'Machine', 'isolation', 'legs', 'beginner', ARRAY['Quads'], ARRAY[], 12, 15, 90),
('Hip Thrust', 'Legs', 'Barbell', 'compound', 'legs', 'intermediate', ARRAY['Glutes'], ARRAY['Hamstrings'], 8, 12, 120),
('Standing Calf Raise', 'Legs', 'Machine', 'isolation', 'legs', 'beginner', ARRAY['Calves'], ARRAY[], 12, 20, 60),
('Seated Calf Raise', 'Legs', 'Machine', 'isolation', 'legs', 'beginner', ARRAY['Calves'], ARRAY[], 15, 20, 60)
ON CONFLICT (name) DO UPDATE SET
  exercise_type = EXCLUDED.exercise_type,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty_level = EXCLUDED.difficulty_level,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  rep_range_min = EXCLUDED.rep_range_min,
  rep_range_max = EXCLUDED.rep_range_max,
  rest_timer_seconds = EXCLUDED.rest_timer_seconds;

-- =====================================================
-- 2. SISTEMA DE RUTINAS AVANZADO
-- =====================================================

-- Agregar columnas a health_routines
ALTER TABLE health_routines ADD COLUMN IF NOT EXISTS routine_type TEXT CHECK (routine_type IN ('push', 'pull', 'legs', 'upper', 'lower', 'full_body', 'custom'));
ALTER TABLE health_routines ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'));
ALTER TABLE health_routines ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER DEFAULT 60;
ALTER TABLE health_routines ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT false; -- Rutinas pre-hechas

-- Agregar columnas a health_routine_exercises
ALTER TABLE health_routine_exercises ADD COLUMN IF NOT EXISTS is_superset BOOLEAN DEFAULT false;
ALTER TABLE health_routine_exercises ADD COLUMN IF NOT EXISTS superset_group INTEGER; -- Agrupar ejercicios en superseries
ALTER TABLE health_routine_exercises ADD COLUMN IF NOT EXISTS is_dropset BOOLEAN DEFAULT false;
ALTER TABLE health_routine_exercises ADD COLUMN IF NOT EXISTS rpe_target DECIMAL(3,1); -- RPE objetivo (6.5, 7.0, 8.5, etc)
ALTER TABLE health_routine_exercises ADD COLUMN IF NOT EXISTS percentage_1rm INTEGER; -- % de 1RM para trabajar

-- =====================================================
-- 3. TRACKING AVANZADO DE SETS
-- =====================================================

-- Agregar columnas a health_sets
ALTER TABLE health_sets ADD COLUMN IF NOT EXISTS rpe DECIMAL(3,1); -- Rate of Perceived Exertion
ALTER TABLE health_sets ADD COLUMN IF NOT EXISTS rir INTEGER; -- Reps in Reserve
ALTER TABLE health_sets ADD COLUMN IF NOT EXISTS tempo TEXT; -- Ej: "3-1-1-0" (eccentric-pause-concentric-pause)
ALTER TABLE health_sets ADD COLUMN IF NOT EXISTS is_dropset BOOLEAN DEFAULT false;
ALTER TABLE health_sets ADD COLUMN IF NOT EXISTS is_superset BOOLEAN DEFAULT false;
ALTER TABLE health_sets ADD COLUMN IF NOT EXISTS rest_seconds INTEGER; -- Descanso real tomado

-- =====================================================
-- 4. SISTEMA DE ANÁLISIS Y MÉTRICAS
-- =====================================================

-- Tabla de análisis semanal
CREATE TABLE IF NOT EXISTS health_weekly_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  
  -- Volumen por grupo muscular
  chest_volume INTEGER DEFAULT 0,
  back_volume INTEGER DEFAULT 0,
  legs_volume INTEGER DEFAULT 0,
  shoulders_volume INTEGER DEFAULT 0,
  arms_volume INTEGER DEFAULT 0,
  
  -- Frecuencia (días entrenados)
  days_trained INTEGER DEFAULT 0,
  total_sets INTEGER DEFAULT 0,
  total_reps INTEGER DEFAULT 0,
  
  -- Análisis
  analysis_json JSONB, -- Insights generados por IA
  recommendations TEXT[],
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de objetivos de peso (predicciones)
CREATE TABLE IF NOT EXISTS health_weight_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  exercise_id UUID REFERENCES health_exercises(id),
  target_weight_kg DECIMAL(6,2) NOT NULL,
  target_reps INTEGER NOT NULL,
  target_date DATE,
  achieved BOOLEAN DEFAULT false,
  achieved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de estándares de fuerza (para comparación)
CREATE TABLE IF NOT EXISTS health_strength_standards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_name TEXT NOT NULL,
  bodyweight_kg DECIMAL(5,2) NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'novice', 'intermediate', 'advanced', 'elite')),
  one_rep_max_kg DECIMAL(6,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insertar estándares de fuerza (basados en Strength Level)
-- Ejemplo para 60kg de peso corporal
INSERT INTO health_strength_standards (exercise_name, bodyweight_kg, level, one_rep_max_kg) VALUES
-- Bench Press
('Bench Press', 60, 'beginner', 40),
('Bench Press', 60, 'novice', 55),
('Bench Press', 60, 'intermediate', 75),
('Bench Press', 60, 'advanced', 95),
('Bench Press', 60, 'elite', 120),
-- Squat
('Squat', 60, 'beginner', 50),
('Squat', 60, 'novice', 75),
('Squat', 60, 'intermediate', 105),
('Squat', 60, 'advanced', 135),
('Squat', 60, 'elite', 170),
-- Deadlift
('Deadlift', 60, 'beginner', 60),
('Deadlift', 60, 'novice', 90),
('Deadlift', 60, 'intermediate', 125),
('Deadlift', 60, 'advanced', 160),
('Deadlift', 60, 'elite', 200)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. FUNCIONES AVANZADAS
-- =====================================================

-- Función: Calcular volumen semanal por grupo muscular
CREATE OR REPLACE FUNCTION calculate_weekly_volume(target_week_start DATE)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'chest', COALESCE(SUM(CASE WHEN 'Chest' = ANY(he.primary_muscles) THEN hs.weight_kg * hs.reps ELSE 0 END), 0),
    'back', COALESCE(SUM(CASE WHEN 'Back' = ANY(he.primary_muscles) THEN hs.weight_kg * hs.reps ELSE 0 END), 0),
    'legs', COALESCE(SUM(CASE WHEN 'Quads' = ANY(he.primary_muscles) OR 'Hamstrings' = ANY(he.primary_muscles) THEN hs.weight_kg * hs.reps ELSE 0 END), 0),
    'shoulders', COALESCE(SUM(CASE WHEN 'Shoulders' = ANY(he.primary_muscles) THEN hs.weight_kg * hs.reps ELSE 0 END), 0),
    'arms', COALESCE(SUM(CASE WHEN 'Biceps' = ANY(he.primary_muscles) OR 'Triceps' = ANY(he.primary_muscles) THEN hs.weight_kg * hs.reps ELSE 0 END), 0)
  ) INTO result
  FROM health_sets hs
  JOIN health_workout_sessions hws ON hs.session_id = hws.id
  JOIN health_exercises he ON hs.exercise_id = he.id
  WHERE DATE(hws.start_time) BETWEEN target_week_start AND target_week_start + INTERVAL '6 days';
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Función: Predecir cuándo alcanzarás un peso objetivo
CREATE OR REPLACE FUNCTION predict_weight_achievement(
  p_exercise_id UUID,
  p_target_weight DECIMAL,
  p_target_reps INTEGER
)
RETURNS JSON AS $$
DECLARE
  recent_progress RECORD;
  avg_weekly_gain DECIMAL;
  weeks_needed INTEGER;
  predicted_date DATE;
BEGIN
  -- Obtener progreso reciente (últimas 8 semanas)
  SELECT 
    AVG(one_rep_max_est) as avg_1rm,
    MAX(one_rep_max_est) as max_1rm,
    COUNT(*) as sessions
  INTO recent_progress
  FROM health_sets
  WHERE exercise_id = p_exercise_id
    AND created_at >= NOW() - INTERVAL '8 weeks'
    AND one_rep_max_est IS NOT NULL;
  
  IF recent_progress.sessions < 3 THEN
    RETURN json_build_object(
      'possible', false,
      'reason', 'Datos insuficientes (mínimo 3 sesiones)'
    );
  END IF;
  
  -- Calcular ganancia promedio semanal (conservador: 0.5-1% por semana)
  avg_weekly_gain := recent_progress.max_1rm * 0.005; -- 0.5% por semana
  
  -- Calcular 1RM objetivo
  DECLARE
    target_1rm DECIMAL;
  BEGIN
    target_1rm := p_target_weight * (1 + (p_target_reps::DECIMAL / 30.0));
    
    -- Calcular semanas necesarias
    weeks_needed := CEIL((target_1rm - recent_progress.max_1rm) / avg_weekly_gain);
    predicted_date := CURRENT_DATE + (weeks_needed || ' weeks')::INTERVAL;
    
    RETURN json_build_object(
      'possible', true,
      'current_1rm', ROUND(recent_progress.max_1rm, 1),
      'target_1rm', ROUND(target_1rm, 1),
      'weeks_needed', weeks_needed,
      'predicted_date', predicted_date,
      'weekly_gain', ROUND(avg_weekly_gain, 2)
    );
  END;
END;
$$ LANGUAGE plpgsql;

-- Función: Sugerir peso basado en RPE objetivo
CREATE OR REPLACE FUNCTION suggest_weight_for_rpe(
  p_exercise_id UUID,
  p_target_reps INTEGER,
  p_target_rpe DECIMAL
)
RETURNS JSON AS $$
DECLARE
  last_1rm DECIMAL;
  suggested_weight DECIMAL;
  percentage DECIMAL;
BEGIN
  -- Obtener último 1RM
  SELECT one_rep_max_est INTO last_1rm
  FROM health_sets
  WHERE exercise_id = p_exercise_id
    AND one_rep_max_est IS NOT NULL
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF last_1rm IS NULL THEN
    RETURN json_build_object(
      'available', false,
      'reason', 'No hay datos previos de este ejercicio'
    );
  END IF;
  
  -- Calcular % de 1RM basado en RPE y reps
  -- RPE 10 = 100%, RPE 9 = ~95%, RPE 8 = ~90%, RPE 7 = ~85%
  percentage := CASE
    WHEN p_target_rpe >= 9.5 THEN 0.95
    WHEN p_target_rpe >= 9.0 THEN 0.92
    WHEN p_target_rpe >= 8.5 THEN 0.88
    WHEN p_target_rpe >= 8.0 THEN 0.85
    WHEN p_target_rpe >= 7.5 THEN 0.82
    ELSE 0.80
  END;
  
  -- Ajustar por reps (más reps = menor %)
  percentage := percentage - ((p_target_reps - 5) * 0.02);
  
  suggested_weight := last_1rm * percentage;
  
  RETURN json_build_object(
    'available', true,
    'suggested_weight', ROUND(suggested_weight, 1),
    'percentage_1rm', ROUND(percentage * 100, 0),
    'last_1rm', ROUND(last_1rm, 1)
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_exercises_movement ON health_exercises(movement_pattern);
CREATE INDEX IF NOT EXISTS idx_exercises_type ON health_exercises(exercise_type);
CREATE INDEX IF NOT EXISTS idx_sets_rpe ON health_sets(rpe) WHERE rpe IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_weekly_analysis_week ON health_weekly_analysis(week_start, week_end);
CREATE INDEX IF NOT EXISTS idx_weight_goals_exercise ON health_weight_goals(exercise_id, achieved);

-- =====================================================
-- FIN DE SISTEMA AVANZADO
-- =====================================================
