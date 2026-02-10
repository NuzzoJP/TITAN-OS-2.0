-- =====================================================
-- EJECUTAR EN ORDEN - SETUP COMPLETO
-- =====================================================

-- PASO 1: Agregar columnas faltantes a health_exercises
-- (Si ya existen, PostgreSQL las ignora)

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

-- PASO 2: Limpiar ejercicios existentes
TRUNCATE TABLE health_exercises CASCADE;

-- PASO 3: Insertar ejercicios de Jeff Nippard

-- PUSH A (Fuerza Bruta & Hombros)
INSERT INTO health_exercises (
  name, 
  muscle_group, 
  equipment, 
  exercise_type, 
  movement_pattern, 
  difficulty_level,
  primary_muscles,
  secondary_muscles,
  rep_range_min,
  rep_range_max,
  rest_timer_seconds,
  notes
) VALUES
(
  'Barbell Bench Press',
  'Chest',
  'Barbell',
  'compound',
  'push',
  'intermediate',
  ARRAY['Chest', 'Triceps'],
  ARRAY['Shoulders'],
  5,
  8,
  240,
  'S+ Tier. Constructor de masa principal. Compound rey para pecho. Enfoque en carga progresiva.'
),
(
  'Standing Overhead Press',
  'Shoulders',
  'Barbell',
  'compound',
  'push',
  'intermediate',
  ARRAY['Shoulders'],
  ARRAY['Triceps', 'Core'],
  6,
  10,
  180,
  'Jeff Fav. Clave para estructura en ectomorfos. Desarrolla hombros completos y core.'
),
(
  'Skullcrushers',
  'Arms',
  'Barbell',
  'isolation',
  'push',
  'intermediate',
  ARRAY['Triceps'],
  ARRAY[],
  8,
  12,
  90,
  'Cabeza larga del tríceps. Mantener codos fijos. Bajar hasta frente, no detrás de cabeza.'
),
(
  'Egyptian Lateral Raise',
  'Shoulders',
  'Cable',
  'isolation',
  'push',
  'beginner',
  ARRAY['Shoulders'],
  ARRAY[],
  12,
  15,
  60,
  'Tensión constante en deltoides lateral. Cable desde abajo, inclinarse ligeramente hacia el cable.'
);

-- PULL A (Anchura & Cargas Pesadas)
INSERT INTO health_exercises (
  name, 
  muscle_group, 
  equipment, 
  exercise_type, 
  movement_pattern, 
  difficulty_level,
  primary_muscles,
  secondary_muscles,
  rep_range_min,
  rep_range_max,
  rest_timer_seconds,
  notes
) VALUES
(
  'Weighted Pull-Up',
  'Back',
  'Bodyweight',
  'compound',
  'pull',
  'advanced',
  ARRAY['Lats', 'Biceps'],
  ARRAY['Traps', 'Core'],
  5,
  10,
  240,
  'S+ Tier. El rey de la espalda. Agregar peso cuando hagas más de 10 reps. Agarre pronado ancho.'
),
(
  'Pendlay Row',
  'Back',
  'Barbell',
  'compound',
  'pull',
  'intermediate',
  ARRAY['Back', 'Traps'],
  ARRAY['Biceps', 'Core'],
  6,
  10,
  180,
  'S Tier. Explosividad desde el suelo. Cada rep empieza en el piso. Espalda paralela al suelo.'
),
(
  'Barbell Curl',
  'Arms',
  'Barbell',
  'isolation',
  'pull',
  'beginner',
  ARRAY['Biceps'],
  ARRAY[],
  8,
  12,
  90,
  'Carga progresiva básica. Sin balanceo. Codos fijos. Supinación completa arriba.'
),
(
  'Face Pulls',
  'Shoulders',
  'Cable',
  'isolation',
  'pull',
  'beginner',
  ARRAY['Rear Delts', 'Traps'],
  ARRAY[],
  15,
  20,
  60,
  'Salud del manguito rotador. Tirar hacia la cara, rotar externamente al final. Alta frecuencia.'
);

-- LEGS A (Sentadilla & Cadena Posterior)
INSERT INTO health_exercises (
  name, 
  muscle_group, 
  equipment, 
  exercise_type, 
  movement_pattern, 
  difficulty_level,
  primary_muscles,
  secondary_muscles,
  rep_range_min,
  rep_range_max,
  rest_timer_seconds,
  notes
) VALUES
(
  'Barbell Back Squat',
  'Legs',
  'Barbell',
  'compound',
  'legs',
  'intermediate',
  ARRAY['Quads', 'Glutes'],
  ARRAY['Core', 'Hamstrings'],
  5,
  8,
  300,
  'S+ Tier. Gatillo hormonal sistémico. Profundidad completa (ATG si movilidad permite). Rey de piernas.'
),
(
  'Romanian Deadlift (RDL)',
  'Legs',
  'Barbell',
  'compound',
  'legs',
  'intermediate',
  ARRAY['Hamstrings', 'Glutes'],
  ARRAY['Back', 'Core'],
  8,
  12,
  180,
  'Jeff Fav. Isquios y densidad de espalda. Mantener barra cerca de piernas. Stretch profundo.'
),
(
  'Standing Calf Raise',
  'Legs',
  'Machine',
  'isolation',
  'legs',
  'beginner',
  ARRAY['Calves'],
  ARRAY[],
  12,
  20,
  60,
  'Gastrocnemio pesado. Rango completo. Pausa en stretch. Rodillas extendidas.'
);

-- PUSH B (Hipertrofia & Estiramiento)
INSERT INTO health_exercises (
  name, 
  muscle_group, 
  equipment, 
  exercise_type, 
  movement_pattern, 
  difficulty_level,
  primary_muscles,
  secondary_muscles,
  rep_range_min,
  rep_range_max,
  rest_timer_seconds,
  notes
) VALUES
(
  'Incline Dumbbell Press',
  'Chest',
  'Dumbbell',
  'compound',
  'push',
  'intermediate',
  ARRAY['Chest', 'Shoulders'],
  ARRAY['Triceps'],
  8,
  12,
  180,
  'S Tier. Énfasis clavicular (pecho superior). Ángulo 30-45°. Rango completo de movimiento.'
),
(
  'Weighted Dips',
  'Chest',
  'Bodyweight',
  'compound',
  'push',
  'advanced',
  ARRAY['Chest', 'Triceps'],
  ARRAY['Shoulders'],
  6,
  10,
  180,
  'S Tier. La sentadilla del tren superior. Inclinarse hacia adelante para énfasis en pecho.'
),
(
  'Cable Crossover',
  'Chest',
  'Cable',
  'isolation',
  'push',
  'beginner',
  ARRAY['Chest'],
  ARRAY[],
  12,
  15,
  90,
  'Aísla el pectoral sin fatiga articular. Squeeze al final. Tensión constante.'
),
(
  'Overhead Cable Tricep Extension',
  'Arms',
  'Cable',
  'isolation',
  'push',
  'intermediate',
  ARRAY['Triceps'],
  ARRAY[],
  10,
  15,
  90,
  'Jeff Fav. Máximo estiramiento. Cable desde arriba, brazos sobre la cabeza. Cabeza larga del tríceps.'
);

-- PULL B (Densidad & Detalles)
INSERT INTO health_exercises (
  name, 
  muscle_group, 
  equipment, 
  exercise_type, 
  movement_pattern, 
  difficulty_level,
  primary_muscles,
  secondary_muscles,
  rep_range_min,
  rep_range_max,
  rest_timer_seconds,
  notes
) VALUES
(
  'Omni-Grip Lat Pulldown',
  'Back',
  'Cable',
  'compound',
  'pull',
  'beginner',
  ARRAY['Lats'],
  ARRAY['Biceps'],
  8,
  12,
  120,
  'Jeff Fav. Variar agarres para reclutamiento total. Alternar: ancho pronado, neutro, supino.'
),
(
  'Chest-Supported Row',
  'Back',
  'Machine',
  'compound',
  'pull',
  'beginner',
  ARRAY['Back', 'Traps'],
  ARRAY['Biceps'],
  10,
  15,
  120,
  'S Tier. Elimina inercia, pura espalda. Sin compensación lumbar. Squeeze en escápulas.'
),
(
  'Bayesian Curl',
  'Arms',
  'Cable',
  'isolation',
  'pull',
  'intermediate',
  ARRAY['Biceps'],
  ARRAY[],
  10,
  15,
  90,
  'Jeff Fav. Bíceps en estiramiento máximo. Cable desde atrás, brazo extendido hacia atrás.'
),
(
  'Rear Delt Fly',
  'Shoulders',
  'Machine',
  'isolation',
  'pull',
  'beginner',
  ARRAY['Rear Delts'],
  ARRAY[],
  12,
  15,
  60,
  'Deltoides posterior. Pec deck invertido o máquina específica. Control en excéntrica.'
);

-- LEGS B (Máquinas & Unilateral)
INSERT INTO health_exercises (
  name, 
  muscle_group, 
  equipment, 
  exercise_type, 
  movement_pattern, 
  difficulty_level,
  primary_muscles,
  secondary_muscles,
  rep_range_min,
  rep_range_max,
  rest_timer_seconds,
  notes
) VALUES
(
  'Hack Squat',
  'Legs',
  'Machine',
  'compound',
  'legs',
  'intermediate',
  ARRAY['Quads'],
  ARRAY['Glutes'],
  8,
  12,
  180,
  'S Tier. Cuádriceps sin fatiga lumbar. Pies en posición media-baja. Profundidad completa.'
),
(
  'Seated Leg Curl',
  'Legs',
  'Machine',
  'isolation',
  'legs',
  'beginner',
  ARRAY['Hamstrings'],
  ARRAY[],
  10,
  15,
  90,
  'Jeff Fav. Superior al tumbado por biomecánica. Isquios en posición acortada. Pausa arriba.'
),
(
  'Bulgarian Split Squat',
  'Legs',
  'Dumbbell',
  'compound',
  'legs',
  'intermediate',
  ARRAY['Quads', 'Glutes'],
  ARRAY['Core'],
  10,
  15,
  120,
  'Corrección de asimetrías. Unilateral. Torso vertical. Rodilla delantera no pasa dedos del pie.'
);

-- PASO 4: Verificar ejercicios insertados
SELECT 
  name,
  muscle_group,
  movement_pattern,
  notes
FROM health_exercises
ORDER BY 
  CASE movement_pattern
    WHEN 'push' THEN 1
    WHEN 'pull' THEN 2
    WHEN 'legs' THEN 3
  END;

-- =====================================================
-- ¡LISTO! Ahora ejecuta jeff_nippard_routines_updated.sql
-- =====================================================
