-- =====================================================
-- ÍNDICES PARA MEJORAR PERFORMANCE
-- =====================================================
-- Ejecuta este script para acelerar las queries

-- Índices para health_routines
CREATE INDEX IF NOT EXISTS idx_routines_user_template ON health_routines(user_id, is_template);
CREATE INDEX IF NOT EXISTS idx_routines_active ON health_routines(user_id, is_active) WHERE is_active = true;

-- Índices para health_routine_exercises
CREATE INDEX IF NOT EXISTS idx_routine_exercises_routine_order ON health_routine_exercises(routine_id, exercise_order);
CREATE INDEX IF NOT EXISTS idx_routine_exercises_exercise ON health_routine_exercises(exercise_id);

-- Índices para health_workout_sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON health_workout_sessions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON health_workout_sessions(date DESC);

-- Índices para health_sets
CREATE INDEX IF NOT EXISTS idx_sets_session ON health_sets(session_id);
CREATE INDEX IF NOT EXISTS idx_sets_exercise ON health_sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_sets_created ON health_sets(created_at DESC);

-- Índices para health_exercises
CREATE INDEX IF NOT EXISTS idx_exercises_muscle ON health_exercises(muscle_group);
CREATE INDEX IF NOT EXISTS idx_exercises_name ON health_exercises(name);

-- Índices para nutrition
CREATE INDEX IF NOT EXISTS idx_nutrition_user_date ON nutrition_logs(user_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_health_stats_user_date ON health_stats(user_id, measurement_date DESC);

-- Verificar índices creados
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename LIKE 'health_%'
ORDER BY tablename, indexname;

-- =====================================================
-- ANÁLISIS DE QUERIES (opcional)
-- =====================================================
-- Descomentar para ver estadísticas de queries lentas

-- SELECT * FROM pg_stat_statements 
-- WHERE query LIKE '%health_%'
-- ORDER BY mean_exec_time DESC
-- LIMIT 10;
