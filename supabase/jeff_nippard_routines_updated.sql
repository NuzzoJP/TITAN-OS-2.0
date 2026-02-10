-- =====================================================
-- RUTINAS PPL ACTUALIZADAS - JEFF NIPPARD EXACT
-- Ejecutar DESPUÉS de jeff_nippard_ppl_exact.sql
-- =====================================================

-- IMPORTANTE: Este script asume que ya ejecutaste jeff_nippard_ppl_exact.sql

-- =====================================================
-- 1. LIMPIAR RUTINAS EXISTENTES
-- =====================================================

-- Eliminar rutinas template antiguas
DELETE FROM health_routines WHERE is_template = true;

-- =====================================================
-- 2. CREAR RUTINAS ACTUALIZADAS
-- =====================================================

-- PUSH A (Fuerza Bruta & Hombros)
DO $$
DECLARE
  push_a_id UUID;
  bench_id UUID;
  ohp_id UUID;
  skull_id UUID;
  egyptian_id UUID;
BEGIN
  -- Crear rutina
  INSERT INTO health_routines (
    name, 
    description, 
    routine_type, 
    difficulty, 
    estimated_duration_minutes, 
    is_template, 
    is_active
  ) VALUES (
    'Push A - Fuerza & Hombros',
    'Día de empuje enfocado en fuerza bruta. Bench Press pesado + OHP. Protocolo Jeff Nippard para ectomorfos.',
    'push',
    'intermediate',
    75,
    true,
    false
  ) RETURNING id INTO push_a_id;

  -- Obtener IDs de ejercicios
  SELECT id INTO bench_id FROM health_exercises WHERE name = 'Barbell Bench Press';
  SELECT id INTO ohp_id FROM health_exercises WHERE name = 'Standing Overhead Press';
  SELECT id INTO skull_id FROM health_exercises WHERE name = 'Skullcrushers';
  SELECT id INTO egyptian_id FROM health_exercises WHERE name = 'Egyptian Lateral Raise';

  -- Insertar ejercicios
  INSERT INTO health_routine_exercises (
    routine_id, exercise_id, exercise_order, 
    target_sets, target_reps_min, target_reps_max, 
    rest_seconds, rpe_target, notes
  ) VALUES
  (push_a_id, bench_id, 1, 4, 5, 8, 240, 9.0, 'Compound principal. RPE 9 en últimas series. Carga máxima.'),
  (push_a_id, ohp_id, 2, 4, 6, 10, 180, 8.5, 'Core apretado. Sin rebote desde abajo.'),
  (push_a_id, skull_id, 3, 3, 8, 12, 90, 8.0, 'Codos fijos. Bajar controlado.'),
  (push_a_id, egyptian_id, 4, 3, 12, 15, 60, 8.5, 'Tensión constante. Sin balanceo.');
END $$;

-- PULL A (Anchura & Cargas Pesadas)
DO $$
DECLARE
  pull_a_id UUID;
  pullup_id UUID;
  pendlay_id UUID;
  curl_id UUID;
  face_id UUID;
BEGIN
  INSERT INTO health_routines (
    name, description, routine_type, difficulty, 
    estimated_duration_minutes, is_template, is_active
  ) VALUES (
    'Pull A - Anchura & Fuerza',
    'Día de tirón enfocado en anchura de espalda. Pull-ups pesados + Pendlay Row explosivo.',
    'pull',
    'intermediate',
    75,
    true,
    false
  ) RETURNING id INTO pull_a_id;

  SELECT id INTO pullup_id FROM health_exercises WHERE name = 'Weighted Pull-Up';
  SELECT id INTO pendlay_id FROM health_exercises WHERE name = 'Pendlay Row';
  SELECT id INTO curl_id FROM health_exercises WHERE name = 'Barbell Curl';
  SELECT id INTO face_id FROM health_exercises WHERE name = 'Face Pulls';

  INSERT INTO health_routine_exercises (
    routine_id, exercise_id, exercise_order, 
    target_sets, target_reps_min, target_reps_max, 
    rest_seconds, rpe_target, notes
  ) VALUES
  (pull_a_id, pullup_id, 1, 4, 5, 10, 240, 9.0, 'Agregar peso cuando hagas >10 reps. Agarre ancho.'),
  (pull_a_id, pendlay_id, 2, 4, 6, 10, 180, 8.5, 'Explosivo desde el suelo. Cada rep empieza en piso.'),
  (pull_a_id, curl_id, 3, 3, 8, 12, 90, 8.0, 'Sin balanceo. Codos fijos.'),
  (pull_a_id, face_id, 4, 3, 15, 20, 60, 7.5, 'Salud de hombros. Alta frecuencia.');
END $$;

-- LEGS A (Sentadilla & Cadena Posterior)
DO $$
DECLARE
  legs_a_id UUID;
  squat_id UUID;
  rdl_id UUID;
  calf_id UUID;
BEGIN
  INSERT INTO health_routines (
    name, description, routine_type, difficulty, 
    estimated_duration_minutes, is_template, is_active
  ) VALUES (
    'Legs A - Squat & RDL',
    'Día de piernas enfocado en sentadilla pesada y cadena posterior. Gatillo hormonal.',
    'legs',
    'intermediate',
    80,
    true,
    false
  ) RETURNING id INTO legs_a_id;

  SELECT id INTO squat_id FROM health_exercises WHERE name = 'Barbell Back Squat';
  SELECT id INTO rdl_id FROM health_exercises WHERE name = 'Romanian Deadlift (RDL)';
  SELECT id INTO calf_id FROM health_exercises WHERE name = 'Standing Calf Raise';

  INSERT INTO health_routine_exercises (
    routine_id, exercise_id, exercise_order, 
    target_sets, target_reps_min, target_reps_max, 
    rest_seconds, rpe_target, notes
  ) VALUES
  (legs_a_id, squat_id, 1, 4, 5, 8, 300, 9.0, 'Profundidad completa. Rey de piernas.'),
  (legs_a_id, rdl_id, 2, 4, 8, 12, 180, 8.5, 'Barra cerca de piernas. Stretch profundo.'),
  (legs_a_id, calf_id, 3, 4, 12, 20, 60, 8.5, 'Rango completo. Pausa en stretch.');
END $$;

-- PUSH B (Hipertrofia & Estiramiento)
DO $$
DECLARE
  push_b_id UUID;
  incline_id UUID;
  dips_id UUID;
  crossover_id UUID;
  overhead_tri_id UUID;
BEGIN
  INSERT INTO health_routines (
    name, description, routine_type, difficulty, 
    estimated_duration_minutes, is_template, is_active
  ) VALUES (
    'Push B - Hipertrofia & Stretch',
    'Día de empuje enfocado en hipertrofia. Énfasis en pecho superior y estiramiento.',
    'push',
    'intermediate',
    75,
    true,
    false
  ) RETURNING id INTO push_b_id;

  SELECT id INTO incline_id FROM health_exercises WHERE name = 'Incline Dumbbell Press';
  SELECT id INTO dips_id FROM health_exercises WHERE name = 'Weighted Dips';
  SELECT id INTO crossover_id FROM health_exercises WHERE name = 'Cable Crossover';
  SELECT id INTO overhead_tri_id FROM health_exercises WHERE name = 'Overhead Cable Tricep Extension';

  INSERT INTO health_routine_exercises (
    routine_id, exercise_id, exercise_order, 
    target_sets, target_reps_min, target_reps_max, 
    rest_seconds, rpe_target, notes
  ) VALUES
  (push_b_id, incline_id, 1, 4, 8, 12, 180, 8.5, 'Ángulo 30-45°. Rango completo.'),
  (push_b_id, dips_id, 2, 3, 6, 10, 180, 8.5, 'Inclinarse adelante para pecho.'),
  (push_b_id, crossover_id, 3, 3, 12, 15, 90, 8.0, 'Squeeze al final. Tensión constante.'),
  (push_b_id, overhead_tri_id, 4, 3, 10, 15, 90, 8.0, 'Brazos sobre cabeza. Stretch máximo.');
END $$;

-- PULL B (Densidad & Detalles)
DO $$
DECLARE
  pull_b_id UUID;
  pulldown_id UUID;
  chest_row_id UUID;
  bayesian_id UUID;
  rear_delt_id UUID;
BEGIN
  INSERT INTO health_routines (
    name, description, routine_type, difficulty, 
    estimated_duration_minutes, is_template, is_active
  ) VALUES (
    'Pull B - Densidad & Detalles',
    'Día de tirón enfocado en densidad de espalda y detalles. Omni-grip + Bayesian curl.',
    'pull',
    'intermediate',
    75,
    true,
    false
  ) RETURNING id INTO pull_b_id;

  SELECT id INTO pulldown_id FROM health_exercises WHERE name = 'Omni-Grip Lat Pulldown';
  SELECT id INTO chest_row_id FROM health_exercises WHERE name = 'Chest-Supported Row';
  SELECT id INTO bayesian_id FROM health_exercises WHERE name = 'Bayesian Curl';
  SELECT id INTO rear_delt_id FROM health_exercises WHERE name = 'Rear Delt Fly';

  INSERT INTO health_routine_exercises (
    routine_id, exercise_id, exercise_order, 
    target_sets, target_reps_min, target_reps_max, 
    rest_seconds, rpe_target, notes
  ) VALUES
  (pull_b_id, pulldown_id, 1, 4, 8, 12, 120, 8.0, 'Variar agarres: ancho, neutro, supino.'),
  (pull_b_id, chest_row_id, 2, 4, 10, 15, 120, 8.5, 'Sin inercia. Squeeze en escápulas.'),
  (pull_b_id, bayesian_id, 3, 3, 10, 15, 90, 8.0, 'Cable desde atrás. Stretch máximo.'),
  (pull_b_id, rear_delt_id, 4, 3, 12, 15, 60, 8.0, 'Control en excéntrica.');
END $$;

-- LEGS B (Máquinas & Unilateral)
DO $$
DECLARE
  legs_b_id UUID;
  hack_id UUID;
  leg_curl_id UUID;
  bulgarian_id UUID;
BEGIN
  INSERT INTO health_routines (
    name, description, routine_type, difficulty, 
    estimated_duration_minutes, is_template, is_active
  ) VALUES (
    'Legs B - Máquinas & Unilateral',
    'Día de piernas enfocado en máquinas y trabajo unilateral. Hack squat + Bulgarian.',
    'legs',
    'intermediate',
    80,
    true,
    false
  ) RETURNING id INTO legs_b_id;

  SELECT id INTO hack_id FROM health_exercises WHERE name = 'Hack Squat';
  SELECT id INTO leg_curl_id FROM health_exercises WHERE name = 'Seated Leg Curl';
  SELECT id INTO bulgarian_id FROM health_exercises WHERE name = 'Bulgarian Split Squat';

  INSERT INTO health_routine_exercises (
    routine_id, exercise_id, exercise_order, 
    target_sets, target_reps_min, target_reps_max, 
    rest_seconds, rpe_target, notes
  ) VALUES
  (legs_b_id, hack_id, 1, 4, 8, 12, 180, 8.5, 'Pies posición media-baja. Profundidad completa.'),
  (legs_b_id, leg_curl_id, 2, 4, 10, 15, 90, 8.5, 'Pausa arriba. Isquios en posición acortada.'),
  (legs_b_id, bulgarian_id, 3, 3, 10, 15, 120, 8.0, 'Torso vertical. Corrección de asimetrías.');
END $$;

-- =====================================================
-- 3. VERIFICACIÓN
-- =====================================================

-- Mostrar rutinas creadas
SELECT 
  r.name,
  r.routine_type,
  r.difficulty,
  COUNT(re.id) as total_exercises
FROM health_routines r
LEFT JOIN health_routine_exercises re ON r.id = re.routine_id
WHERE r.is_template = true
GROUP BY r.id, r.name, r.routine_type, r.difficulty
ORDER BY 
  CASE r.routine_type
    WHEN 'push' THEN 1
    WHEN 'pull' THEN 2
    WHEN 'legs' THEN 3
  END,
  r.name;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
