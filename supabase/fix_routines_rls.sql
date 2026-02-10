-- =====================================================
-- FIX RLS PARA RUTINAS TEMPLATES
-- =====================================================

-- Habilitar RLS en las tablas
ALTER TABLE health_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_routine_exercises ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden VER las rutinas template
DROP POLICY IF EXISTS "Templates are viewable by everyone" ON health_routines;
CREATE POLICY "Templates are viewable by everyone"
  ON health_routines FOR SELECT
  USING (is_template = true OR user_id = auth.uid());

-- Política: Solo el dueño puede ver sus rutinas personales
DROP POLICY IF EXISTS "Users can view own routines" ON health_routines;
CREATE POLICY "Users can view own routines"
  ON health_routines FOR SELECT
  USING (user_id = auth.uid());

-- Política: Usuarios pueden crear sus propias rutinas
DROP POLICY IF EXISTS "Users can create own routines" ON health_routines;
CREATE POLICY "Users can create own routines"
  ON health_routines FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Política: Usuarios pueden actualizar sus propias rutinas
DROP POLICY IF EXISTS "Users can update own routines" ON health_routines;
CREATE POLICY "Users can update own routines"
  ON health_routines FOR UPDATE
  USING (user_id = auth.uid());

-- Política: Usuarios pueden eliminar sus propias rutinas
DROP POLICY IF EXISTS "Users can delete own routines" ON health_routines;
CREATE POLICY "Users can delete own routines"
  ON health_routines FOR DELETE
  USING (user_id = auth.uid());

-- Política: Todos pueden ver ejercicios de templates
DROP POLICY IF EXISTS "Template exercises viewable by everyone" ON health_routine_exercises;
CREATE POLICY "Template exercises viewable by everyone"
  ON health_routine_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM health_routines
      WHERE health_routines.id = health_routine_exercises.routine_id
      AND (health_routines.is_template = true OR health_routines.user_id = auth.uid())
    )
  );

-- Política: Usuarios pueden crear ejercicios en sus rutinas
DROP POLICY IF EXISTS "Users can create exercises in own routines" ON health_routine_exercises;
CREATE POLICY "Users can create exercises in own routines"
  ON health_routine_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM health_routines
      WHERE health_routines.id = health_routine_exercises.routine_id
      AND health_routines.user_id = auth.uid()
    )
  );

-- Política: Usuarios pueden actualizar ejercicios en sus rutinas
DROP POLICY IF EXISTS "Users can update exercises in own routines" ON health_routine_exercises;
CREATE POLICY "Users can update exercises in own routines"
  ON health_routine_exercises FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM health_routines
      WHERE health_routines.id = health_routine_exercises.routine_id
      AND health_routines.user_id = auth.uid()
    )
  );

-- Política: Usuarios pueden eliminar ejercicios en sus rutinas
DROP POLICY IF EXISTS "Users can delete exercises in own routines" ON health_routine_exercises;
CREATE POLICY "Users can delete exercises in own routines"
  ON health_routine_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM health_routines
      WHERE health_routines.id = health_routine_exercises.routine_id
      AND health_routines.user_id = auth.uid()
    )
  );

-- Verificar que las rutinas template tienen user_id NULL
UPDATE health_routines SET user_id = NULL WHERE is_template = true;

-- Verificación
SELECT 
  'Rutinas templates (visibles para todos):' as status,
  COUNT(*) as total
FROM health_routines
WHERE is_template = true;
