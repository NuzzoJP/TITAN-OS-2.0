-- =====================================================
-- AGREGAR COLUMNA user_id A TODAS LAS TABLAS
-- =====================================================

-- Finance Tables
ALTER TABLE finance_accounts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE finance_transactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE finance_budgets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Health Tables
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE health_workout_sessions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE health_sets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
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
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Finance
ALTER TABLE finance_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_budgets ENABLE ROW LEVEL SECURITY;

-- Health
ALTER TABLE health_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metabolic_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_nutrition_logs ENABLE ROW LEVEL SECURITY;

-- Wisdom
ALTER TABLE wisdom_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE wisdom_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE wisdom_evaluations ENABLE ROW LEVEL SECURITY;

-- Chronos
ALTER TABLE chronos_events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREAR POLÍTICAS RLS - FINANCE
-- =====================================================

-- finance_accounts
CREATE POLICY "Users can view their own accounts" ON finance_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own accounts" ON finance_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own accounts" ON finance_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own accounts" ON finance_accounts FOR DELETE USING (auth.uid() = user_id);

-- finance_transactions
CREATE POLICY "Users can view their own transactions" ON finance_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON finance_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions" ON finance_transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions" ON finance_transactions FOR DELETE USING (auth.uid() = user_id);

-- finance_budgets
CREATE POLICY "Users can view their own budgets" ON finance_budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own budgets" ON finance_budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own budgets" ON finance_budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own budgets" ON finance_budgets FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- CREAR POLÍTICAS RLS - HEALTH
-- =====================================================

-- health_exercises
CREATE POLICY "Users can view their own exercises" ON health_exercises FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own exercises" ON health_exercises FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own exercises" ON health_exercises FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own exercises" ON health_exercises FOR DELETE USING (auth.uid() = user_id);

-- health_workout_sessions
CREATE POLICY "Users can view their own sessions" ON health_workout_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sessions" ON health_workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sessions" ON health_workout_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sessions" ON health_workout_sessions FOR DELETE USING (auth.uid() = user_id);

-- health_sets
CREATE POLICY "Users can view their own sets" ON health_sets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sets" ON health_sets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sets" ON health_sets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sets" ON health_sets FOR DELETE USING (auth.uid() = user_id);

-- health_stats
CREATE POLICY "Users can view their own stats" ON health_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stats" ON health_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stats" ON health_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stats" ON health_stats FOR DELETE USING (auth.uid() = user_id);

-- health_metabolic_profile
CREATE POLICY "Users can view their own metabolic profile" ON health_metabolic_profile FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own metabolic profile" ON health_metabolic_profile FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own metabolic profile" ON health_metabolic_profile FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own metabolic profile" ON health_metabolic_profile FOR DELETE USING (auth.uid() = user_id);

-- health_nutrition_logs
CREATE POLICY "Users can view their own nutrition logs" ON health_nutrition_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own nutrition logs" ON health_nutrition_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own nutrition logs" ON health_nutrition_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own nutrition logs" ON health_nutrition_logs FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- CREAR POLÍTICAS RLS - WISDOM
-- =====================================================

-- wisdom_terms
CREATE POLICY "Users can view their own terms" ON wisdom_terms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own terms" ON wisdom_terms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own terms" ON wisdom_terms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own terms" ON wisdom_terms FOR DELETE USING (auth.uid() = user_id);

-- wisdom_subjects
CREATE POLICY "Users can view their own subjects" ON wisdom_subjects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subjects" ON wisdom_subjects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subjects" ON wisdom_subjects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own subjects" ON wisdom_subjects FOR DELETE USING (auth.uid() = user_id);

-- wisdom_evaluations
CREATE POLICY "Users can view their own evaluations" ON wisdom_evaluations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own evaluations" ON wisdom_evaluations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own evaluations" ON wisdom_evaluations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own evaluations" ON wisdom_evaluations FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- CREAR POLÍTICAS RLS - CHRONOS
-- =====================================================

-- chronos_events
CREATE POLICY "Users can view their own events" ON chronos_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own events" ON chronos_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own events" ON chronos_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own events" ON chronos_events FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- ACTUALIZAR FUNCIÓN RPC get_daily_safe_to_spend
-- =====================================================

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
BEGIN
  -- Obtener el balance total de todas las cuentas del usuario
  SELECT COALESCE(SUM(balance), 0) INTO total_balance
  FROM finance_accounts
  WHERE user_id = auth.uid();
  
  -- Obtener gastos del mes actual
  SELECT COALESCE(SUM(amount), 0) INTO monthly_expenses
  FROM finance_transactions
  WHERE user_id = auth.uid()
    AND is_expense = true
    AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE);
  
  -- Obtener configuración de presupuesto
  SELECT 
    COALESCE(monthly_limit, 0),
    COALESCE(savings_goal, 0)
  INTO monthly_limit, savings_goal
  FROM finance_budgets
  WHERE user_id = auth.uid()
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

-- =====================================================
-- ACTUALIZAR FUNCIÓN RPC get_previous_log
-- =====================================================

CREATE OR REPLACE FUNCTION get_previous_log(p_exercise_id UUID)
RETURNS TABLE (
  weight NUMERIC,
  reps INTEGER,
  rpe INTEGER,
  date TIMESTAMP,
  one_rep_max_est NUMERIC
) AS $$
BEGIN
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
    AND s.user_id = auth.uid()
  ORDER BY ws.date DESC, s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
