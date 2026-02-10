-- =====================================================
-- PASO 1: EJECUTAR PRIMERO nutrition_expansion.sql
-- =====================================================
-- Si no lo has hecho, ejecuta nutrition_expansion.sql primero

-- =====================================================
-- PASO 2: AGREGAR user_id A TODAS LAS TABLAS
-- =====================================================

-- Finance Tables
ALTER TABLE finance_accounts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE finance_transactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE finance_budgets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Health Tables (Gym)
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE health_workout_sessions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE health_sets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Health Tables (Nutrition) - Solo si existen
ALTER TABLE health_stats ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE health_metabolic_profile ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE health_nutrition_logs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Wisdom Tables
ALTER TABLE wisdom_terms ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE wisdom_subjects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE wisdom_evaluations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Chronos Tables
ALTER TABLE chronos_events ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- =====================================================
-- PASO 3: DESHABILITAR RLS TEMPORALMENTE
-- (Para que puedas acceder sin políticas primero)
-- =====================================================

ALTER TABLE finance_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE finance_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE finance_budgets DISABLE ROW LEVEL SECURITY;

ALTER TABLE health_exercises DISABLE ROW LEVEL SECURITY;
ALTER TABLE health_workout_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE health_sets DISABLE ROW LEVEL SECURITY;
ALTER TABLE health_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE health_metabolic_profile DISABLE ROW LEVEL SECURITY;
ALTER TABLE health_nutrition_logs DISABLE ROW LEVEL SECURITY;

ALTER TABLE wisdom_terms DISABLE ROW LEVEL SECURITY;
ALTER TABLE wisdom_subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE wisdom_evaluations DISABLE ROW LEVEL SECURITY;

ALTER TABLE chronos_events DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 4: ELIMINAR FUNCIONES EXISTENTES
-- =====================================================

DROP FUNCTION IF EXISTS get_daily_safe_to_spend();
DROP FUNCTION IF EXISTS get_previous_log(uuid);
DROP FUNCTION IF EXISTS get_daily_nutrition_summary(date);
DROP FUNCTION IF EXISTS get_weight_progress(integer);

-- =====================================================
-- PASO 5: CREAR FUNCIONES RPC ACTUALIZADAS
-- =====================================================

-- Actualizar get_daily_safe_to_spend para usar user_id
CREATE OR REPLACE FUNCTION get_daily_safe_to_spend()
RETURNS NUMERIC AS $$
DECLARE
  total_balance NUMERIC;
  monthly_expenses NUMERIC;
  monthly_limit NUMERIC;
  savings_goal NUMERIC;
  days_in_month INTEGER;
  days_remaining INTEGER;
  safe_to_spend NUMERIC;
  current_user_id UUID;
BEGIN
  -- Obtener el ID del usuario actual
  current_user_id := auth.uid();
  
  -- Si no hay usuario autenticado, retornar 0
  IF current_user_id IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Obtener el balance total de todas las cuentas del usuario
  SELECT COALESCE(SUM(balance), 0) INTO total_balance
  FROM finance_accounts
  WHERE user_id = current_user_id OR user_id IS NULL;
  
  -- Obtener gastos del mes actual
  SELECT COALESCE(SUM(amount), 0) INTO monthly_expenses
  FROM finance_transactions
  WHERE (user_id = current_user_id OR user_id IS NULL)
    AND is_expense = true
    AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE);
  
  -- Obtener configuración de presupuesto
  SELECT 
    COALESCE(monthly_limit, 0),
    COALESCE(savings_goal, 0)
  INTO monthly_limit, savings_goal
  FROM finance_budgets
  WHERE user_id = current_user_id OR user_id IS NULL
  LIMIT 1;
  
  -- Calcular días del mes y días restantes
  days_in_month := EXTRACT(DAY FROM DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day');
  days_remaining := days_in_month - EXTRACT(DAY FROM CURRENT_DATE) + 1;
  
  -- Calcular cuánto se puede gastar hoy
  IF monthly_limit > 0 THEN
    safe_to_spend := (monthly_limit - monthly_expenses - savings_goal) / days_remaining;
  ELSE
    safe_to_spend := (total_balance - savings_goal) / days_remaining;
  END IF;
  
  RETURN GREATEST(safe_to_spend, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Actualizar get_previous_log para usar user_id
CREATE OR REPLACE FUNCTION get_previous_log(p_exercise_id UUID)
RETURNS TABLE (
  weight NUMERIC,
  reps INTEGER,
  rpe INTEGER,
  date TIMESTAMP,
  one_rep_max_est NUMERIC
) AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  RETURN QUERY
  SELECT 
    s.weight_kg,
    s.reps,
    s.rpe,
    ws.date,
    s.one_rep_max_est
  FROM health_sets s
  INNER JOIN health_workout_sessions ws ON s.session_id = ws.id
  WHERE s.exercise_id = p_exercise_id
    AND (s.user_id = current_user_id OR s.user_id IS NULL)
  ORDER BY ws.date DESC, s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Actualizar get_daily_nutrition_summary para usar user_id
CREATE OR REPLACE FUNCTION get_daily_nutrition_summary(target_date DATE DEFAULT CURRENT_DATE)
RETURNS JSON AS $$
DECLARE
  result JSON;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  SELECT json_build_object(
    'total_calories', COALESCE(SUM(calories), 0),
    'total_protein', COALESCE(SUM(protein_g), 0),
    'total_carbs', COALESCE(SUM(carbs_g), 0),
    'total_fats', COALESCE(SUM(fats_g), 0),
    'meal_count', COUNT(*)
  ) INTO result
  FROM health_nutrition_logs
  WHERE DATE(logged_at) = target_date
    AND (user_id = current_user_id OR user_id IS NULL);
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Actualizar get_weight_progress para usar user_id
CREATE OR REPLACE FUNCTION get_weight_progress(days INTEGER DEFAULT 30)
RETURNS TABLE(
  date DATE,
  weight_kg DECIMAL,
  body_fat_percent DECIMAL
) AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  RETURN QUERY
  SELECT 
    DATE(measured_at) as date,
    hs.weight_kg,
    hs.body_fat_percent
  FROM health_stats hs
  WHERE measured_at >= NOW() - (days || ' days')::INTERVAL
    AND (hs.user_id = current_user_id OR hs.user_id IS NULL)
  ORDER BY measured_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
