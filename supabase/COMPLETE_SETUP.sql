-- =====================================================
-- SETUP COMPLETO - EJECUTAR ESTE ARCHIVO ÚNICO
-- Crea tablas + Inserta ejercicios de Jeff Nippard + Crea rutinas
-- =====================================================

-- =====================================================
-- PARTE 1: CREAR TABLAS DE RUTINAS
-- =====================================================

-- Tabla de rutinas guardadas
CREATE TABLE IF NOT EXISTS health_routines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  routine_type TEXT CHECK (routine_type IN ('push', 'pull', 'legs', 'upper', 'lower', 'full_body', 'custom')),
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration_minutes INTEGER DEFAULT 60,
  is_template BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de ejercicios en rutinas
CREATE TABLE IF NOT EXISTS health_routine_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  routine_id UUID REFERENCES health_routines(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES health_exercises(id),
  exercise_order INTEGER NOT NULL,
  target_sets INTEGER NOT NULL DEFAULT 3,
  target_reps_min INTEGER NOT NULL DEFAULT 8,
  target_reps_max INTEGER NOT NULL DEFAULT 12,
  rest_seconds INTEGER DEFAULT 90,
  rpe_target DECIMAL(3,1),
  percentage_1rm INTEGER,
  is_superset BOOLEAN DEFAULT false,
  superset_group INTEGER,
  is_dropset BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_routines_user ON health_routines(user_id);
CREATE INDEX IF NOT EXISTS idx_routine_exercises_routine ON health_routine_exercises(routine_id);

-- =====================================================
-- PARTE 2: AGREGAR COLUMNAS A HEALTH_EXERCISES
-- =====================================================

ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS equipment TEXT;
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS exercise_type TEXT CHECK (exercise_type IN ('compound', 'isolation', 'accessory'));
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS movement_pattern TEXT CHECK (movement_pattern IN ('push', 'pull', 'legs', 'core'));
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced'));
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS primary_muscles TEXT[];
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS secondary_muscles TEXT[];
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS rep_range_min INTEGER DEFAULT 6;
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS rep_range_max INTEGER DEFAULT 12;
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS rest_timer_seconds INTEGER DEFAULT 120;
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS is_variant_of UUID REFERENCES health_exercises(id);
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS notes TEXT;

-- =====================================================
-- PARTE 3: LIMPIAR E INSERTAR EJERCICIOS DE JEFF NIPPARD
-- =====================================================

TRUNCATE TABLE health_exercises CASCADE;

-- PUSH A
INSERT INTO health_exercises (name, muscle_group, equipment, exercise_type, movement_pattern, difficulty_level, primary_muscles, secondary_muscles, rep_range_min, rep_range_max, rest_timer_seconds, notes) VALUES
('Barbell Bench Press', 'Chest', 'Barbell', 'compound', 'push', 'intermediate', ARRAY['Chest', 'Triceps'], ARRAY['Shoulders'], 5, 8, 240, 'S+ Tier. Constructor de masa principal.'),
('Standing Overhead Press', 'Shoulders', 'Barbell', 'compound', 'push', 'intermediate', ARRAY['Shoulders'], ARRAY['Triceps', 'Core'], 6, 10, 180, 'Jeff Fav. Clave para estructura en ectomorfos.'),
('Skullcrushers', 'Arms', 'Barbell', 'isolation', 'push', 'intermediate', ARRAY['Triceps'], ARRAY[]::TEXT[], 8, 12, 90, 'Cabeza larga del tríceps.'),
('Egyptian Lateral Raise', 'Shoulders', 'Cable', 'isolation', 'push', 'beginner', ARRAY['Shoulders'], ARRAY[]::TEXT[], 12, 15, 60, 'Tensión constante en deltoides lateral.');

-- PULL A
INSERT INTO health_exercises (name, muscle_group, equipment, exercise_type, movement_pattern, difficulty_level, primary_muscles, secondary_muscles, rep_range_min, rep_range_max, rest_timer_seconds, notes) VALUES
('Weighted Pull-Up', 'Back', 'Bodyweight', 'compound', 'pull', 'advanced', ARRAY['Lats', 'Biceps'], ARRAY['Traps', 'Core'], 5, 10, 240, 'S+ Tier. El rey de la espalda.'),
('Pendlay Row', 'Back', 'Barbell', 'compound', 'pull', 'intermediate', ARRAY['Back', 'Traps'], ARRAY['Biceps', 'Core'], 6, 10, 180, 'S Tier. Explosividad desde el suelo.'),
('Barbell Curl', 'Arms', 'Barbell', 'isolation', 'pull', 'beginner', ARRAY['Biceps'], ARRAY[]::TEXT[], 8, 12, 90, 'Carga progresiva básica.'),
('Face Pulls', 'Shoulders', 'Cable', 'isolation', 'pull', 'beginner', ARRAY['Rear Delts', 'Traps'], ARRAY[]::TEXT[], 15, 20, 60, 'Salud del manguito rotador.');

-- LEGS A
INSERT INTO health_exercises (name, muscle_group, equipment, exercise_type, movement_pattern, difficulty_level, primary_muscles, secondary_muscles, rep_range_min, rep_range_max, rest_timer_seconds, notes) VALUES
('Barbell Back Squat', 'Legs', 'Barbell', 'compound', 'legs', 'intermediate', ARRAY['Quads', 'Glutes'], ARRAY['Core', 'Hamstrings'], 5, 8, 300, 'S+ Tier. Gatillo hormonal sistémico.'),
('Romanian Deadlift (RDL)', 'Legs', 'Barbell', 'compound', 'legs', 'intermediate', ARRAY['Hamstrings', 'Glutes'], ARRAY['Back', 'Core'], 8, 12, 180, 'Jeff Fav. Isquios y densidad de espalda.'),
('Standing Calf Raise', 'Legs', 'Machine', 'isolation', 'legs', 'beginner', ARRAY['Calves'], ARRAY[]::TEXT[], 12, 20, 60, 'Gastrocnemio pesado.');

-- PUSH B
INSERT INTO health_exercises (name, muscle_group, equipment, exercise_type, movement_pattern, difficulty_level, primary_muscles, secondary_muscles, rep_range_min, rep_range_max, rest_timer_seconds, notes) VALUES
('Incline Dumbbell Press', 'Chest', 'Dumbbell', 'compound', 'push', 'intermediate', ARRAY['Chest', 'Shoulders'], ARRAY['Triceps'], 8, 12, 180, 'S Tier. Énfasis clavicular (pecho superior).'),
('Weighted Dips', 'Chest', 'Bodyweight', 'compound', 'push', 'advanced', ARRAY['Chest', 'Triceps'], ARRAY['Shoulders'], 6, 10, 180, 'S Tier. La sentadilla del tren superior.'),
('Cable Crossover', 'Chest', 'Cable', 'isolation', 'push', 'beginner', ARRAY['Chest'], ARRAY[]::TEXT[], 12, 15, 90, 'Aísla el pectoral sin fatiga articular.'),
('Overhead Cable Tricep Extension', 'Arms', 'Cable', 'isolation', 'push', 'intermediate', ARRAY['Triceps'], ARRAY[]::TEXT[], 10, 15, 90, 'Jeff Fav. Máximo estiramiento.');

-- PULL B
INSERT INTO health_exercises (name, muscle_group, equipment, exercise_type, movement_pattern, difficulty_level, primary_muscles, secondary_muscles, rep_range_min, rep_range_max, rest_timer_seconds, notes) VALUES
('Omni-Grip Lat Pulldown', 'Back', 'Cable', 'compound', 'pull', 'beginner', ARRAY['Lats'], ARRAY['Biceps'], 8, 12, 120, 'Jeff Fav. Variar agarres para reclutamiento total.'),
('Chest-Supported Row', 'Back', 'Machine', 'compound', 'pull', 'beginner', ARRAY['Back', 'Traps'], ARRAY['Biceps'], 10, 15, 120, 'S Tier. Elimina inercia, pura espalda.'),
('Bayesian Curl', 'Arms', 'Cable', 'isolation', 'pull', 'intermediate', ARRAY['Biceps'], ARRAY[]::TEXT[], 10, 15, 90, 'Jeff Fav. Bíceps en estiramiento máximo.'),
('Rear Delt Fly', 'Shoulders', 'Machine', 'isolation', 'pull', 'beginner', ARRAY['Rear Delts'], ARRAY[]::TEXT[], 12, 15, 60, 'Deltoides posterior.');

-- LEGS B
INSERT INTO health_exercises (name, muscle_group, equipment, exercise_type, movement_pattern, difficulty_level, primary_muscles, secondary_muscles, rep_range_min, rep_range_max, rest_timer_seconds, notes) VALUES
('Hack Squat', 'Legs', 'Machine', 'compound', 'legs', 'intermediate', ARRAY['Quads'], ARRAY['Glutes'], 8, 12, 180, 'S Tier. Cuádriceps sin fatiga lumbar.'),
('Seated Leg Curl', 'Legs', 'Machine', 'isolation', 'legs', 'beginner', ARRAY['Hamstrings'], ARRAY[]::TEXT[], 10, 15, 90, 'Jeff Fav. Superior al tumbado por biomecánica.'),
('Bulgarian Split Squat', 'Legs', 'Dumbbell', 'compound', 'legs', 'intermediate', ARRAY['Quads', 'Glutes'], ARRAY['Core'], 10, 15, 120, 'Corrección de asimetrías.');

-- =====================================================
-- PARTE 4: CREAR RUTINAS PPL A/B
-- =====================================================

-- PUSH A
DO $$
DECLARE
  push_a_id UUID;
BEGIN
  INSERT INTO health_routines (name, description, routine_type, difficulty, estimated_duration_minutes, is_template, is_active)
  VALUES ('Push A - Fuerza & Hombros', 'Día de empuje enfocado en fuerza bruta. Bench Press pesado + OHP.', 'push', 'intermediate', 75, true, false)
  RETURNING id INTO push_a_id;

  INSERT INTO health_routine_exercises (routine_id, exercise_id, exercise_order, target_sets, target_reps_min, target_reps_max, rest_seconds, rpe_target, notes)
  SELECT push_a_id, id, 1, 4, 5, 8, 240, 9.0, 'Compound principal. RPE 9 en últimas series.' FROM health_exercises WHERE name = 'Barbell Bench Press'
  UNION ALL
  SELECT push_a_id, id, 2, 4, 6, 10, 180, 8.5, 'Core apretado. Sin rebote.' FROM health_exercises WHERE name = 'Standing Overhead Press'
  UNION ALL
  SELECT push_a_id, id, 3, 3, 8, 12, 90, 8.0, 'Codos fijos.' FROM health_exercises WHERE name = 'Skullcrushers'
  UNION ALL
  SELECT push_a_id, id, 4, 3, 12, 15, 60, 8.5, 'Tensión constante.' FROM health_exercises WHERE name = 'Egyptian Lateral Raise';
END $$;

-- PULL A
DO $$
DECLARE
  pull_a_id UUID;
BEGIN
  INSERT INTO health_routines (name, description, routine_type, difficulty, estimated_duration_minutes, is_template, is_active)
  VALUES ('Pull A - Anchura & Fuerza', 'Día de tirón enfocado en anchura de espalda.', 'pull', 'intermediate', 75, true, false)
  RETURNING id INTO pull_a_id;

  INSERT INTO health_routine_exercises (routine_id, exercise_id, exercise_order, target_sets, target_reps_min, target_reps_max, rest_seconds, rpe_target, notes)
  SELECT pull_a_id, id, 1, 4, 5, 10, 240, 9.0, 'Agregar peso cuando hagas >10 reps.' FROM health_exercises WHERE name = 'Weighted Pull-Up'
  UNION ALL
  SELECT pull_a_id, id, 2, 4, 6, 10, 180, 8.5, 'Explosivo desde el suelo.' FROM health_exercises WHERE name = 'Pendlay Row'
  UNION ALL
  SELECT pull_a_id, id, 3, 3, 8, 12, 90, 8.0, 'Sin balanceo.' FROM health_exercises WHERE name = 'Barbell Curl'
  UNION ALL
  SELECT pull_a_id, id, 4, 3, 15, 20, 60, 7.5, 'Salud de hombros.' FROM health_exercises WHERE name = 'Face Pulls';
END $$;

-- LEGS A
DO $$
DECLARE
  legs_a_id UUID;
BEGIN
  INSERT INTO health_routines (name, description, routine_type, difficulty, estimated_duration_minutes, is_template, is_active)
  VALUES ('Legs A - Squat & RDL', 'Día de piernas enfocado en sentadilla pesada.', 'legs', 'intermediate', 80, true, false)
  RETURNING id INTO legs_a_id;

  INSERT INTO health_routine_exercises (routine_id, exercise_id, exercise_order, target_sets, target_reps_min, target_reps_max, rest_seconds, rpe_target, notes)
  SELECT legs_a_id, id, 1, 4, 5, 8, 300, 9.0, 'Profundidad completa.' FROM health_exercises WHERE name = 'Barbell Back Squat'
  UNION ALL
  SELECT legs_a_id, id, 2, 4, 8, 12, 180, 8.5, 'Barra cerca de piernas.' FROM health_exercises WHERE name = 'Romanian Deadlift (RDL)'
  UNION ALL
  SELECT legs_a_id, id, 3, 4, 12, 20, 60, 8.5, 'Rango completo.' FROM health_exercises WHERE name = 'Standing Calf Raise';
END $$;

-- PUSH B
DO $$
DECLARE
  push_b_id UUID;
BEGIN
  INSERT INTO health_routines (name, description, routine_type, difficulty, estimated_duration_minutes, is_template, is_active)
  VALUES ('Push B - Hipertrofia & Stretch', 'Día de empuje enfocado en hipertrofia.', 'push', 'intermediate', 75, true, false)
  RETURNING id INTO push_b_id;

  INSERT INTO health_routine_exercises (routine_id, exercise_id, exercise_order, target_sets, target_reps_min, target_reps_max, rest_seconds, rpe_target, notes)
  SELECT push_b_id, id, 1, 4, 8, 12, 180, 8.5, 'Ángulo 30-45°.' FROM health_exercises WHERE name = 'Incline Dumbbell Press'
  UNION ALL
  SELECT push_b_id, id, 2, 3, 6, 10, 180, 8.5, 'Inclinarse adelante.' FROM health_exercises WHERE name = 'Weighted Dips'
  UNION ALL
  SELECT push_b_id, id, 3, 3, 12, 15, 90, 8.0, 'Squeeze al final.' FROM health_exercises WHERE name = 'Cable Crossover'
  UNION ALL
  SELECT push_b_id, id, 4, 3, 10, 15, 90, 8.0, 'Brazos sobre cabeza.' FROM health_exercises WHERE name = 'Overhead Cable Tricep Extension';
END $$;

-- PULL B
DO $$
DECLARE
  pull_b_id UUID;
BEGIN
  INSERT INTO health_routines (name, description, routine_type, difficulty, estimated_duration_minutes, is_template, is_active)
  VALUES ('Pull B - Densidad & Detalles', 'Día de tirón enfocado en densidad de espalda.', 'pull', 'intermediate', 75, true, false)
  RETURNING id INTO pull_b_id;

  INSERT INTO health_routine_exercises (routine_id, exercise_id, exercise_order, target_sets, target_reps_min, target_reps_max, rest_seconds, rpe_target, notes)
  SELECT pull_b_id, id, 1, 4, 8, 12, 120, 8.0, 'Variar agarres.' FROM health_exercises WHERE name = 'Omni-Grip Lat Pulldown'
  UNION ALL
  SELECT pull_b_id, id, 2, 4, 10, 15, 120, 8.5, 'Sin inercia.' FROM health_exercises WHERE name = 'Chest-Supported Row'
  UNION ALL
  SELECT pull_b_id, id, 3, 3, 10, 15, 90, 8.0, 'Cable desde atrás.' FROM health_exercises WHERE name = 'Bayesian Curl'
  UNION ALL
  SELECT pull_b_id, id, 4, 3, 12, 15, 60, 8.0, 'Control en excéntrica.' FROM health_exercises WHERE name = 'Rear Delt Fly';
END $$;

-- LEGS B
DO $$
DECLARE
  legs_b_id UUID;
BEGIN
  INSERT INTO health_routines (name, description, routine_type, difficulty, estimated_duration_minutes, is_template, is_active)
  VALUES ('Legs B - Máquinas & Unilateral', 'Día de piernas enfocado en máquinas.', 'legs', 'intermediate', 80, true, false)
  RETURNING id INTO legs_b_id;

  INSERT INTO health_routine_exercises (routine_id, exercise_id, exercise_order, target_sets, target_reps_min, target_reps_max, rest_seconds, rpe_target, notes)
  SELECT legs_b_id, id, 1, 4, 8, 12, 180, 8.5, 'Pies posición media-baja.' FROM health_exercises WHERE name = 'Hack Squat'
  UNION ALL
  SELECT legs_b_id, id, 2, 4, 10, 15, 90, 8.5, 'Pausa arriba.' FROM health_exercises WHERE name = 'Seated Leg Curl'
  UNION ALL
  SELECT legs_b_id, id, 3, 3, 10, 15, 120, 8.0, 'Torso vertical.' FROM health_exercises WHERE name = 'Bulgarian Split Squat';
END $$;

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

SELECT 'Ejercicios creados:' as status, COUNT(*) as total FROM health_exercises
UNION ALL
SELECT 'Rutinas creadas:', COUNT(*) FROM health_routines WHERE is_template = true;

-- =====================================================
-- ¡LISTO! TODO CONFIGURADO
-- =====================================================
