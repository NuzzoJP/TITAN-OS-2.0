-- =====================================================
-- RUTINAS PPL ESTILO JEFF NIPPARD
-- Push A/B, Pull A/B, Leg A/B
-- =====================================================

-- Nota: Ejecutar DESPUÉS de gym_advanced_system.sql

-- =====================================================
-- PUSH DAY A (Énfasis en Pecho + Hombros)
-- =====================================================

INSERT INTO health_routines (name, description, routine_type, difficulty, estimated_duration_minutes, is_template, is_active)
VALUES (
  'Push Day A - Chest Focus',
  'Rutina de empuje con énfasis en pecho. Incluye press plano, inclinado y trabajo de hombros.',
  'push',
  'intermediate',
  75,
  true,
  false
) RETURNING id;

-- Guardar el ID de la rutina (ajustar según el ID generado)
DO $$
DECLARE
  push_a_id UUID;
  bench_press_id UUID;
  incline_db_id UUID;
  cable_fly_id UUID;
  ohp_id UUID;
  lateral_raise_id UUID;
  tricep_pushdown_id UUID;
  overhead_ext_id UUID;
BEGIN
  -- Obtener ID de la rutina recién creada
  SELECT id INTO push_a_id FROM health_routines WHERE name = 'Push Day A - Chest Focus' ORDER BY created_at DESC LIMIT 1;
  
  -- Obtener IDs de ejercicios
  SELECT id INTO bench_press_id FROM health_exercises WHERE name = 'Bench Press' LIMIT 1;
  SELECT id INTO incline_db_id FROM health_exercises WHERE name = 'Incline Dumbbell Press' LIMIT 1;
  SELECT id INTO cable_fly_id FROM health_exercises WHERE name = 'Cable Fly' LIMIT 1;
  SELECT id INTO ohp_id FROM health_exercises WHERE name = 'Overhead Press' LIMIT 1;
  SELECT id INTO lateral_raise_id FROM health_exercises WHERE name = 'Lateral Raises' LIMIT 1;
  SELECT id INTO tricep_pushdown_id FROM health_exercises WHERE name = 'Tricep Pushdown' LIMIT 1;
  SELECT id INTO overhead_ext_id FROM health_exercises WHERE name = 'Overhead Tricep Extension' LIMIT 1;
  
  -- Insertar ejercicios de la rutina
  INSERT INTO health_routine_exercises (routine_id, exercise_id, exercise_order, target_sets, target_reps_min, target_reps_max, rest_seconds, rpe_target, notes) VALUES
  (push_a_id, bench_press_id, 1, 4, 6, 8, 180, 8.5, 'Compound principal. RPE 8-9 en las últimas series.'),
  (push_a_id, incline_db_id, 2, 3, 8, 10, 150, 8.0, 'Énfasis en pecho superior.'),
  (push_a_id, cable_fly_id, 3, 3, 12, 15, 90, 8.0, 'Squeeze al final del movimiento.'),
  (push_a_id, ohp_id, 4, 3, 8, 10, 150, 8.0, 'Mantener core apretado.'),
  (push_a_id, lateral_raise_id, 5, 3, 12, 15, 90, 8.5, 'Control en la excéntrica.'),
  (push_a_id, tricep_pushdown_id, 6, 3, 10, 12, 90, 8.0, 'Codos fijos.'),
  (push_a_id, overhead_ext_id, 7, 2, 12, 15, 90, 8.0, 'Stretch completo del tríceps.');
END $$;

-- =====================================================
-- PUSH DAY B (Énfasis en Hombros + Volumen)
-- =====================================================

INSERT INTO health_routines (name, description, routine_type, difficulty, estimated_duration_minutes, is_template, is_active)
VALUES (
  'Push Day B - Shoulder Focus',
  'Rutina de empuje con énfasis en hombros. Más volumen, menos intensidad.',
  'push',
  'intermediate',
  75,
  true,
  false
);

DO $$
DECLARE
  push_b_id UUID;
  ohp_id UUID;
  incline_bench_id UUID;
  db_press_id UUID;
  lateral_raise_id UUID;
  face_pull_id UUID;
  cable_fly_id UUID;
  tricep_rope_id UUID;
BEGIN
  SELECT id INTO push_b_id FROM health_routines WHERE name = 'Push Day B - Shoulder Focus' ORDER BY created_at DESC LIMIT 1;
  
  SELECT id INTO ohp_id FROM health_exercises WHERE name = 'Overhead Press' LIMIT 1;
  SELECT id INTO incline_bench_id FROM health_exercises WHERE name = 'Incline Bench Press' LIMIT 1;
  SELECT id INTO db_press_id FROM health_exercises WHERE name = 'Dumbbell Press' LIMIT 1;
  SELECT id INTO lateral_raise_id FROM health_exercises WHERE name = 'Lateral Raises' LIMIT 1;
  SELECT id INTO face_pull_id FROM health_exercises WHERE name = 'Face Pulls' LIMIT 1;
  SELECT id INTO cable_fly_id FROM health_exercises WHERE name = 'Cable Fly' LIMIT 1;
  SELECT id INTO tricep_rope_id FROM health_exercises WHERE name = 'Tricep Pushdown' LIMIT 1;
  
  INSERT INTO health_routine_exercises (routine_id, exercise_id, exercise_order, target_sets, target_reps_min, target_reps_max, rest_seconds, rpe_target, notes) VALUES
  (push_b_id, ohp_id, 1, 4, 6, 8, 180, 8.5, 'Compound principal para hombros.'),
  (push_b_id, incline_bench_id, 2, 3, 8, 10, 150, 8.0, 'Pecho superior.'),
  (push_b_id, db_press_id, 3, 3, 10, 12, 120, 7.5, 'Rango completo de movimiento.'),
  (push_b_id, lateral_raise_id, 4, 4, 12, 15, 90, 8.5, 'Volumen alto para delts laterales.'),
  (push_b_id, face_pull_id, 5, 3, 15, 20, 60, 7.5, 'Salud de hombros. Superserie con lateral raise si quieres.'),
  (push_b_id, cable_fly_id, 6, 3, 12, 15, 90, 8.0, 'Finisher de pecho.'),
  (push_b_id, tricep_rope_id, 7, 3, 12, 15, 90, 8.0, 'Squeeze al final.');
END $$;

-- =====================================================
-- PULL DAY A (Énfasis en Espalda Ancha)
-- =====================================================

INSERT INTO health_routines (name, description, routine_type, difficulty, estimated_duration_minutes, is_template, is_active)
VALUES (
  'Pull Day A - Width Focus',
  'Rutina de tirón con énfasis en ancho de espalda (lats). Dominadas y pulldowns.',
  'pull',
  'intermediate',
  75,
  true,
  false
);

DO $$
DECLARE
  pull_a_id UUID;
  pullup_id UUID;
  lat_pulldown_id UUID;
  barbell_row_id UUID;
  face_pull_id UUID;
  barbell_curl_id UUID;
  hammer_curl_id UUID;
BEGIN
  SELECT id INTO pull_a_id FROM health_routines WHERE name = 'Pull Day A - Width Focus' ORDER BY created_at DESC LIMIT 1;
  
  SELECT id INTO pullup_id FROM health_exercises WHERE name = 'Pull-ups' LIMIT 1;
  SELECT id INTO lat_pulldown_id FROM health_exercises WHERE name = 'Lat Pulldown' LIMIT 1;
  SELECT id INTO barbell_row_id FROM health_exercises WHERE name = 'Barbell Row' LIMIT 1;
  SELECT id INTO face_pull_id FROM health_exercises WHERE name = 'Face Pulls' LIMIT 1;
  SELECT id INTO barbell_curl_id FROM health_exercises WHERE name = 'Barbell Curl' LIMIT 1;
  SELECT id INTO hammer_curl_id FROM health_exercises WHERE name = 'Hammer Curl' LIMIT 1;
  
  INSERT INTO health_routine_exercises (routine_id, exercise_id, exercise_order, target_sets, target_reps_min, target_reps_max, rest_seconds, rpe_target, notes) VALUES
  (pull_a_id, pullup_id, 1, 4, 6, 10, 180, 8.5, 'Agregar peso si haces más de 10 reps.'),
  (pull_a_id, lat_pulldown_id, 2, 3, 8, 12, 120, 8.0, 'Agarre ancho. Squeeze en lats.'),
  (pull_a_id, barbell_row_id, 3, 4, 8, 10, 150, 8.0, 'Mantener espalda recta.'),
  (pull_a_id, face_pull_id, 4, 3, 15, 20, 60, 7.5, 'Salud de hombros.'),
  (pull_a_id, barbell_curl_id, 5, 3, 8, 12, 90, 8.0, 'Sin balanceo.'),
  (pull_a_id, hammer_curl_id, 6, 3, 10, 15, 90, 8.0, 'Énfasis en braquial.');
END $$;

-- =====================================================
-- PULL DAY B (Énfasis en Espalda Gruesa + Deadlift)
-- =====================================================

INSERT INTO health_routines (name, description, routine_type, difficulty, estimated_duration_minutes, is_template, is_active)
VALUES (
  'Pull Day B - Thickness Focus',
  'Rutina de tirón con énfasis en grosor de espalda. Incluye deadlift.',
  'pull',
  'intermediate',
  80,
  true,
  false
);

DO $$
DECLARE
  pull_b_id UUID;
  deadlift_id UUID;
  cable_row_id UUID;
  db_row_id UUID;
  pulldown_id UUID;
  db_curl_id UUID;
  cable_curl_id UUID;
BEGIN
  SELECT id INTO pull_b_id FROM health_routines WHERE name = 'Pull Day B - Thickness Focus' ORDER BY created_at DESC LIMIT 1;
  
  SELECT id INTO deadlift_id FROM health_exercises WHERE name = 'Deadlift' LIMIT 1;
  SELECT id INTO cable_row_id FROM health_exercises WHERE name = 'Seated Cable Row' LIMIT 1;
  SELECT id INTO db_row_id FROM health_exercises WHERE name = 'Dumbbell Row' LIMIT 1;
  SELECT id INTO pulldown_id FROM health_exercises WHERE name = 'Lat Pulldown' LIMIT 1;
  SELECT id INTO db_curl_id FROM health_exercises WHERE name = 'Dumbbell Curl' LIMIT 1;
  SELECT id INTO cable_curl_id FROM health_exercises WHERE name = 'Hammer Curl' LIMIT 1;
  
  INSERT INTO health_routine_exercises (routine_id, exercise_id, exercise_order, target_sets, target_reps_min, target_reps_max, rest_seconds, rpe_target, notes) VALUES
  (pull_b_id, deadlift_id, 1, 3, 5, 8, 240, 8.5, 'Compound principal. Técnica perfecta.'),
  (pull_b_id, cable_row_id, 2, 4, 8, 12, 120, 8.0, 'Squeeze en escápulas.'),
  (pull_b_id, db_row_id, 3, 3, 10, 12, 120, 8.0, 'Unilateral. Control total.'),
  (pull_b_id, pulldown_id, 4, 3, 10, 15, 90, 7.5, 'Volumen adicional para lats.'),
  (pull_b_id, db_curl_id, 5, 3, 10, 12, 90, 8.0, 'Supinación completa.'),
  (pull_b_id, cable_curl_id, 6, 3, 12, 15, 90, 8.0, 'Tensión constante.');
END $$;

-- =====================================================
-- LEG DAY A (Énfasis en Quads)
-- =====================================================

INSERT INTO health_routines (name, description, routine_type, difficulty, estimated_duration_minutes, is_template, is_active)
VALUES (
  'Leg Day A - Quad Focus',
  'Rutina de piernas con énfasis en cuádriceps. Squat y leg press.',
  'legs',
  'intermediate',
  80,
  true,
  false
);

DO $$
DECLARE
  leg_a_id UUID;
  squat_id UUID;
  leg_press_id UUID;
  leg_ext_id UUID;
  rdl_id UUID;
  leg_curl_id UUID;
  calf_raise_id UUID;
BEGIN
  SELECT id INTO leg_a_id FROM health_routines WHERE name = 'Leg Day A - Quad Focus' ORDER BY created_at DESC LIMIT 1;
  
  SELECT id INTO squat_id FROM health_exercises WHERE name = 'Squat' LIMIT 1;
  SELECT id INTO leg_press_id FROM health_exercises WHERE name = 'Leg Press' LIMIT 1;
  SELECT id INTO leg_ext_id FROM health_exercises WHERE name = 'Leg Extension' LIMIT 1;
  SELECT id INTO rdl_id FROM health_exercises WHERE name = 'Romanian Deadlift' LIMIT 1;
  SELECT id INTO leg_curl_id FROM health_exercises WHERE name = 'Leg Curl' LIMIT 1;
  SELECT id INTO calf_raise_id FROM health_exercises WHERE name = 'Calf Raises' LIMIT 1;
  
  INSERT INTO health_routine_exercises (routine_id, exercise_id, exercise_order, target_sets, target_reps_min, target_reps_max, rest_seconds, rpe_target, notes) VALUES
  (leg_a_id, squat_id, 1, 4, 6, 8, 240, 8.5, 'Compound principal. Profundidad completa.'),
  (leg_a_id, leg_press_id, 2, 3, 10, 12, 180, 8.0, 'Pies en posición media.'),
  (leg_a_id, leg_ext_id, 3, 3, 12, 15, 90, 8.5, 'Squeeze en la contracción.'),
  (leg_a_id, rdl_id, 4, 3, 8, 10, 150, 8.0, 'Stretch en isquios.'),
  (leg_a_id, leg_curl_id, 5, 3, 10, 15, 90, 8.0, 'Control en la excéntrica.'),
  (leg_a_id, calf_raise_id, 6, 4, 12, 20, 60, 8.5, 'Rango completo.');
END $$;

-- =====================================================
-- LEG DAY B (Énfasis en Glúteos e Isquios)
-- =====================================================

INSERT INTO health_routines (name, description, routine_type, difficulty, estimated_duration_minutes, is_template, is_active)
VALUES (
  'Leg Day B - Glute/Ham Focus',
  'Rutina de piernas con énfasis en glúteos e isquiotibiales. RDL y hip thrust.',
  'legs',
  'intermediate',
  80,
  true,
  false
);

DO $$
DECLARE
  leg_b_id UUID;
  rdl_id UUID;
  hip_thrust_id UUID;
  bulgarian_id UUID;
  leg_curl_id UUID;
  leg_ext_id UUID;
  seated_calf_id UUID;
BEGIN
  SELECT id INTO leg_b_id FROM health_routines WHERE name = 'Leg Day B - Glute/Ham Focus' ORDER BY created_at DESC LIMIT 1;
  
  SELECT id INTO rdl_id FROM health_exercises WHERE name = 'Romanian Deadlift' LIMIT 1;
  SELECT id INTO hip_thrust_id FROM health_exercises WHERE name = 'Hip Thrust' LIMIT 1;
  SELECT id INTO bulgarian_id FROM health_exercises WHERE name = 'Bulgarian Split Squat' LIMIT 1;
  SELECT id INTO leg_curl_id FROM health_exercises WHERE name = 'Leg Curl' LIMIT 1;
  SELECT id INTO leg_ext_id FROM health_exercises WHERE name = 'Leg Extension' LIMIT 1;
  SELECT id INTO seated_calf_id FROM health_exercises WHERE name = 'Calf Raises' LIMIT 1;
  
  INSERT INTO health_routine_exercises (routine_id, exercise_id, exercise_order, target_sets, target_reps_min, target_reps_max, rest_seconds, rpe_target, notes) VALUES
  (leg_b_id, rdl_id, 1, 4, 6, 8, 180, 8.5, 'Compound principal para isquios.'),
  (leg_b_id, hip_thrust_id, 2, 4, 8, 12, 150, 8.5, 'Squeeze en glúteos arriba.'),
  (leg_b_id, bulgarian_id, 3, 3, 10, 12, 120, 8.0, 'Unilateral. Balance.'),
  (leg_b_id, leg_curl_id, 4, 4, 10, 15, 90, 8.5, 'Volumen alto para isquios.'),
  (leg_b_id, leg_ext_id, 5, 3, 12, 15, 90, 7.5, 'Mantener quads activos.'),
  (leg_b_id, seated_calf_id, 6, 4, 15, 20, 60, 8.5, 'Pausa en el stretch.');
END $$;

-- =====================================================
-- FIN DE RUTINAS PPL
-- =====================================================

-- Nota: Estas rutinas son TEMPLATES (is_template = true)
-- El usuario puede clonarlas y personalizarlas
-- Para activar una rutina: UPDATE health_routines SET is_active = true WHERE id = 'xxx';
