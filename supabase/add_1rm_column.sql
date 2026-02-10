-- ============================================
-- ADD 1RM COLUMN AND AUTO-CALCULATION
-- ============================================
-- Este script agrega la columna estimated_1rm a health_sets
-- y crea un trigger para calcularla automáticamente

-- 1. Agregar columna para 1RM estimado
ALTER TABLE health_sets
ADD COLUMN IF NOT EXISTS estimated_1rm DECIMAL(6,2);

-- 2. Crear función para calcular 1RM usando fórmula Epley
-- Fórmula: 1RM = peso × (1 + reps / 30)
CREATE OR REPLACE FUNCTION calculate_1rm()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo calcular si hay peso y reps válidos
  IF NEW.weight_kg > 0 AND NEW.reps > 0 THEN
    NEW.estimated_1rm := ROUND((NEW.weight_kg * (1 + NEW.reps / 30.0))::numeric, 2);
  ELSE
    NEW.estimated_1rm := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Crear trigger para calcular 1RM automáticamente
DROP TRIGGER IF EXISTS set_1rm_before_insert ON health_sets;
CREATE TRIGGER set_1rm_before_insert
BEFORE INSERT OR UPDATE ON health_sets
FOR EACH ROW
EXECUTE FUNCTION calculate_1rm();

-- 4. Actualizar 1RM para sets existentes
UPDATE health_sets
SET estimated_1rm = ROUND((weight_kg * (1 + reps / 30.0))::numeric, 2)
WHERE weight_kg > 0 AND reps > 0;

-- 5. Crear índice para búsquedas rápidas de PRs
CREATE INDEX IF NOT EXISTS idx_health_sets_1rm 
ON health_sets(exercise_id, estimated_1rm DESC);

-- 6. Crear vista para PRs por ejercicio
CREATE OR REPLACE VIEW exercise_prs AS
SELECT 
  e.id as exercise_id,
  e.name as exercise_name,
  e.muscle_group as category,
  MAX(s.estimated_1rm) as max_1rm,
  MAX(s.weight_kg) as max_weight,
  MAX(s.reps) as max_reps,
  COUNT(DISTINCT ws.id) as total_sessions,
  COUNT(s.id) as total_sets
FROM health_exercises e
LEFT JOIN health_sets s ON s.exercise_id = e.id
LEFT JOIN health_workout_sessions ws ON s.session_id = ws.id
WHERE s.user_id = auth.uid()
GROUP BY e.id, e.name, e.muscle_group;

-- 7. Habilitar RLS en la vista
ALTER VIEW exercise_prs SET (security_invoker = true);

COMMENT ON COLUMN health_sets.estimated_1rm IS 'Estimated 1 Rep Max calculated using Epley formula: weight × (1 + reps / 30)';
COMMENT ON VIEW exercise_prs IS 'Personal records (PRs) for each exercise per user';

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ejecuta esto para verificar que funcionó:
-- SELECT name, weight_kg, reps, estimated_1rm 
-- FROM health_sets s
-- JOIN health_exercises e ON s.exercise_id = e.id
-- WHERE s.user_id = auth.uid()
-- ORDER BY s.created_at DESC
-- LIMIT 10;
