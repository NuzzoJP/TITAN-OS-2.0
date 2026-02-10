-- =====================================================
-- TITAN PPL: JEFF NIPPARD S+ PROTOCOL (A/B SPLIT)
-- Versión Definitiva con Cues Técnicos Completos
-- =====================================================

-- =====================================================
-- PARTE 1: LIMPIAR Y PREPARAR
-- =====================================================

-- Limpiar ejercicios y rutinas anteriores
TRUNCATE TABLE health_exercises CASCADE;
DELETE FROM health_routines WHERE is_template = true;

-- =====================================================
-- PARTE 2: INSERTAR EJERCICIOS CON CUES TÉCNICOS
-- =====================================================

INSERT INTO health_exercises (name, muscle_group, equipment, exercise_type, movement_pattern, difficulty_level, primary_muscles, secondary_muscles, rep_range_min, rep_range_max, rest_timer_seconds, notes) VALUES

-- PUSH A (Fuerza y Tensión Mecánica)
('Barbell Bench Press', 'Chest', 'Barbell', 'compound', 'push', 'intermediate', ARRAY['Chest', 'Triceps'], ARRAY['Shoulders'], 5, 8, 240, '[PUSH A] S+ Tier. Tempo 3-1-1. RIR 2. Cue: Dobla la barra con las manos. Pausa sólida en el pecho.'),
('Standing Overhead Press', 'Shoulders', 'Barbell', 'compound', 'push', 'intermediate', ARRAY['Shoulders'], ARRAY['Triceps', 'Core'], 6, 10, 180, '[PUSH A] Jeff Fav. RIR 1-2. Cue: Aprieta glúteos y core antes de empujar. Cabeza a través de la ventana.'),
('Skullcrushers (EZ Bar)', 'Arms', 'Barbell', 'isolation', 'push', 'intermediate', ARRAY['Triceps'], ARRAY[]::TEXT[], 8, 12, 90, '[PUSH A] S Tier. Tempo 2-1-2. Cue: Lleva la barra detrás de la cabeza, no a la frente (mayor estiramiento).'),
('Egyptian Lateral Raise', 'Shoulders', 'Cable', 'isolation', 'push', 'beginner', ARRAY['Shoulders'], ARRAY[]::TEXT[], 12, 15, 60, '[PUSH A] S Tier. RIR 1. Cue: Cuerpo inclinado, tensión constante desde abajo.'),

-- PULL A (Anchura y Cargas Pesadas)
('Weighted Pull-Up', 'Back', 'Bodyweight', 'compound', 'pull', 'advanced', ARRAY['Lats', 'Biceps'], ARRAY['Traps', 'Core'], 5, 10, 240, '[PULL A] S+ Tier. Tempo Controlado. RIR 2. Cue: Imagina llevar los codos a los bolsillos traseros.'),
('Meadows Row', 'Back', 'Barbell', 'compound', 'pull', 'intermediate', ARRAY['Lats', 'Traps'], ARRAY['Biceps'], 6, 10, 180, '[PULL A] Jeff Fav. RIR 1. Cue: Caderas altas, estiramiento máximo al bajar. Usa correas (straps).'),
('Face Pulls', 'Shoulders', 'Cable', 'isolation', 'pull', 'beginner', ARRAY['Rear Delts', 'Traps'], ARRAY[]::TEXT[], 15, 20, 60, '[PULL A] Pre-hab. Tempo 2-1-2. Cue: Rotación externa máxima. Pulgares apuntando atrás.'),
('Barbell Curl', 'Arms', 'Barbell', 'isolation', 'pull', 'beginner', ARRAY['Biceps'], ARRAY[]::TEXT[], 8, 12, 90, '[PULL A] A Tier. RIR 1. Cue: Codos pegados al cuerpo. Evita el balanceo excesivo.'),

-- LEGS A (Cadena Posterior y Squat Libre)
('Barbell Back Squat', 'Legs', 'Barbell', 'compound', 'legs', 'intermediate', ARRAY['Quads', 'Glutes'], ARRAY['Core', 'Hamstrings'], 5, 8, 300, '[LEGS A] S+ Tier. Tempo 3-1-0. RIR 2. Cue: Abre el suelo con los pies. Profundidad antes que peso.'),
('Romanian Deadlift (RDL)', 'Legs', 'Barbell', 'compound', 'legs', 'intermediate', ARRAY['Hamstrings', 'Glutes'], ARRAY['Back', 'Core'], 8, 12, 180, '[LEGS A] S+ Tier. Tempo 3-1-1. RIR 2. Cue: Empuja la cadera atrás hasta sentir dolor en isquios. Espinillas verticales.'),
('Standing Calf Raise', 'Legs', 'Machine', 'isolation', 'legs', 'beginner', ARRAY['Calves'], ARRAY[]::TEXT[], 12, 20, 60, '[LEGS A] A Tier. Pausa 2s abajo. Explosivo arriba. Haz Myo-reps en la última serie.'),

-- PUSH B (Hipertrofia Estiramiento y Bombeo)
('Incline Dumbbell Press', 'Chest', 'Dumbbell', 'compound', 'push', 'intermediate', ARRAY['Chest', 'Shoulders'], ARRAY['Triceps'], 8, 12, 180, '[PUSH B] S Tier. Tempo 2-1-1. RIR 1. Cue: Enfoque en pecho superior. No choques las mancuernas arriba.'),
('Weighted Dips', 'Chest', 'Bodyweight', 'compound', 'push', 'advanced', ARRAY['Chest', 'Triceps'], ARRAY['Shoulders'], 6, 10, 180, '[PUSH B] S Tier. Tempo 3s bajada. Cue: Inclina el torso hacia adelante para activar pecho, no tríceps.'),
('Cable Crossover', 'Chest', 'Cable', 'isolation', 'push', 'beginner', ARRAY['Chest'], ARRAY[]::TEXT[], 12, 15, 90, '[PUSH B] A Tier. Tempo 2-1-2. Cue: Cruza las muñecas al final para máxima contracción.'),
('Overhead Cable Tricep Extension', 'Arms', 'Cable', 'isolation', 'push', 'intermediate', ARRAY['Triceps'], ARRAY[]::TEXT[], 10, 15, 90, '[PUSH B] Jeff Fav. RIR 0 (Fallo). Cue: Cabeza larga del tríceps. Estira hasta que duela.'),

-- PULL B (Densidad y Detalles)
('Omni-Grip Lat Pulldown', 'Back', 'Cable', 'compound', 'pull', 'beginner', ARRAY['Lats'], ARRAY['Biceps'], 8, 12, 120, '[PULL B] Jeff Fav. Variar agarres. Sostener 1s abajo. Controla la subida.'),
('Chest-Supported Row', 'Back', 'Machine', 'compound', 'pull', 'beginner', ARRAY['Back', 'Traps'], ARRAY['Biceps'], 10, 15, 120, '[PULL B] S Tier. RIR 0-1. Cue: Pecho pegado al pad. Retracción escapular completa.'),
('Bayesian Curl', 'Arms', 'Cable', 'isolation', 'pull', 'intermediate', ARRAY['Biceps'], ARRAY[]::TEXT[], 10, 15, 90, '[PULL B] S Tier (Jeff Fav). Cue: De espaldas a la polea. Brazo detrás del cuerpo. Estiramiento extremo.'),
('Rear Delt Fly', 'Shoulders', 'Machine', 'isolation', 'pull', 'beginner', ARRAY['Rear Delts'], ARRAY[]::TEXT[], 15, 20, 60, '[PULL B] A Tier. Altas repeticiones (15-20). No uses trapecios.'),

-- LEGS B (Cuádriceps Aislado y Estabilidad)
('Hack Squat', 'Legs', 'Machine', 'compound', 'legs', 'intermediate', ARRAY['Quads'], ARRAY['Glutes'], 8, 12, 180, '[LEGS B] S Tier. Tempo 3-1-0. RIR 0-1. Cue: Pies bajos en la plataforma para máximo cuádriceps. Profundo.'),
('Seated Leg Curl', 'Legs', 'Machine', 'isolation', 'legs', 'beginner', ARRAY['Hamstrings'], ARRAY[]::TEXT[], 10, 15, 90, '[LEGS B] S Tier (Jeff Fav). Tempo 2-1-2. Cue: Sujétate fuerte al asiento. Que no se levante la cadera.'),
('Bulgarian Split Squat', 'Legs', 'Dumbbell', 'compound', 'legs', 'intermediate', ARRAY['Quads', 'Glutes'], ARRAY['Core'], 10, 15, 120, '[LEGS B] A Tier. El ejercicio que odias pero necesitas. Inclínate para glúteo, recto para quad.');

-- =====================================================
-- PARTE 3: CREAR RUTINAS PPL A/B
-- =====================================================

-- PUSH A
DO $$
DECLARE
  push_a_id UUID;
BEGIN
  INSERT INTO health_routines (name, description, routine_type, difficulty, estimated_duration_minutes, is_template, is_active)
  VALUES ('Push A - Fuerza & Tensión', 'Día de empuje enfocado en fuerza bruta. Bench Press pesado + OHP.', 'push', 'intermediate', 75, true, false)
  RETURNING id INTO push_a_id;

  INSERT INTO health_routine_exercises (routine_id, exercise_id, exercise_order, target_sets, target_reps_min, target_reps_max, rest_seconds, rpe_target, notes)
  SELECT push_a_id, id, 1, 4, 5, 8, 240, 8.0, 'Compound principal. RPE 8 en últimas series.' FROM health_exercises WHERE name = 'Barbell Bench Press'
  UNION ALL
  SELECT push_a_id, id, 2, 4, 6, 10, 180, 8.0, 'Core apretado. Sin rebote.' FROM health_exercises WHERE name = 'Standing Overhead Press'
  UNION ALL
  SELECT push_a_id, id, 3, 3, 8, 12, 90, 8.0, 'Codos fijos. Estiramiento profundo.' FROM health_exercises WHERE name = 'Skullcrushers (EZ Bar)'
  UNION ALL
  SELECT push_a_id, id, 4, 3, 12, 15, 60, 9.0, 'Tensión constante. Hasta fallo.' FROM health_exercises WHERE name = 'Egyptian Lateral Raise';
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
  SELECT pull_a_id, id, 1, 4, 5, 10, 240, 8.0, 'Agregar peso cuando hagas >10 reps.' FROM health_exercises WHERE name = 'Weighted Pull-Up'
  UNION ALL
  SELECT pull_a_id, id, 2, 4, 6, 10, 180, 9.0, 'Explosivo desde el suelo. Usa straps.' FROM health_exercises WHERE name = 'Meadows Row'
  UNION ALL
  SELECT pull_a_id, id, 3, 3, 15, 20, 60, 7.5, 'Salud de hombros. Pre-hab.' FROM health_exercises WHERE name = 'Face Pulls'
  UNION ALL
  SELECT pull_a_id, id, 4, 3, 8, 12, 90, 8.0, 'Sin balanceo. Carga progresiva.' FROM health_exercises WHERE name = 'Barbell Curl';
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
  SELECT legs_a_id, id, 1, 4, 5, 8, 300, 8.0, 'Profundidad completa. Abre el suelo.' FROM health_exercises WHERE name = 'Barbell Back Squat'
  UNION ALL
  SELECT legs_a_id, id, 2, 4, 8, 12, 180, 8.0, 'Barra cerca de piernas. Isquios.' FROM health_exercises WHERE name = 'Romanian Deadlift (RDL)'
  UNION ALL
  SELECT legs_a_id, id, 3, 4, 12, 20, 60, 9.0, 'Rango completo. Myo-reps última serie.' FROM health_exercises WHERE name = 'Standing Calf Raise';
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
  SELECT push_b_id, id, 1, 4, 8, 12, 180, 9.0, 'Ángulo 30-45°. Pecho superior.' FROM health_exercises WHERE name = 'Incline Dumbbell Press'
  UNION ALL
  SELECT push_b_id, id, 2, 3, 6, 10, 180, 9.0, 'Inclinarse adelante. Pecho, no tríceps.' FROM health_exercises WHERE name = 'Weighted Dips'
  UNION ALL
  SELECT push_b_id, id, 3, 3, 12, 15, 90, 8.0, 'Squeeze al final. Cruza muñecas.' FROM health_exercises WHERE name = 'Cable Crossover'
  UNION ALL
  SELECT push_b_id, id, 4, 3, 10, 15, 90, 10.0, 'Brazos sobre cabeza. Hasta fallo.' FROM health_exercises WHERE name = 'Overhead Cable Tricep Extension';
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
  SELECT pull_b_id, id, 1, 4, 8, 12, 120, 8.0, 'Variar agarres. Sostener 1s abajo.' FROM health_exercises WHERE name = 'Omni-Grip Lat Pulldown'
  UNION ALL
  SELECT pull_b_id, id, 2, 4, 10, 15, 120, 9.0, 'Sin inercia. Retracción escapular.' FROM health_exercises WHERE name = 'Chest-Supported Row'
  UNION ALL
  SELECT pull_b_id, id, 3, 3, 10, 15, 90, 8.0, 'Cable desde atrás. Estiramiento extremo.' FROM health_exercises WHERE name = 'Bayesian Curl'
  UNION ALL
  SELECT pull_b_id, id, 4, 3, 15, 20, 60, 8.0, 'Control en excéntrica. Sin trapecios.' FROM health_exercises WHERE name = 'Rear Delt Fly';
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
  SELECT legs_b_id, id, 1, 4, 8, 12, 180, 9.0, 'Pies bajos. Cuádriceps máximo.' FROM health_exercises WHERE name = 'Hack Squat'
  UNION ALL
  SELECT legs_b_id, id, 2, 4, 10, 15, 90, 9.0, 'Pausa arriba. Cadera pegada.' FROM health_exercises WHERE name = 'Seated Leg Curl'
  UNION ALL
  SELECT legs_b_id, id, 3, 3, 10, 15, 120, 8.0, 'Torso vertical para quad. Inclinado para glúteo.' FROM health_exercises WHERE name = 'Bulgarian Split Squat';
END $$;

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

SELECT 'Ejercicios creados:' as status, COUNT(*) as total FROM health_exercises
UNION ALL
SELECT 'Rutinas creadas:', COUNT(*) FROM health_routines WHERE is_template = true;

-- =====================================================
-- ¡TITAN PPL DEFINITIVO CONFIGURADO!
-- =====================================================
