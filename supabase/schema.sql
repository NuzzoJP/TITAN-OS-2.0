-- =====================================================
-- TITAN OS - DATABASE SCHEMA
-- Sistema Operativo Personal
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- MÓDULO 1: FINANCE (Gestión Financiera)
-- =====================================================

-- Tabla de cuentas financieras
CREATE TABLE finance_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('banco', 'efectivo', 'tarjeta', 'inversion')),
  balance DECIMAL(12, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de transacciones
CREATE TABLE finance_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES finance_accounts(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  is_expense BOOLEAN NOT NULL DEFAULT true,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de presupuestos
CREATE TABLE finance_budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  monthly_limit DECIMAL(12, 2) NOT NULL,
  savings_goal DECIMAL(12, 2) NOT NULL DEFAULT 0,
  month DATE NOT NULL DEFAULT DATE_TRUNC('month', CURRENT_DATE),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(month)
);

-- Índices para Finance
CREATE INDEX idx_transactions_account ON finance_transactions(account_id);
CREATE INDEX idx_transactions_date ON finance_transactions(date DESC);
CREATE INDEX idx_budgets_month ON finance_budgets(month DESC);

-- =====================================================
-- MÓDULO 2: HEALTH (Entrenamiento Físico)
-- =====================================================

-- Tabla de ejercicios
CREATE TABLE health_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  muscle_group TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de sesiones de entrenamiento
CREATE TABLE health_workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de sets (series)
CREATE TABLE health_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES health_workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES health_exercises(id) ON DELETE CASCADE,
  weight_kg DECIMAL(6, 2) NOT NULL,
  reps INTEGER NOT NULL CHECK (reps > 0),
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
  one_rep_max_est DECIMAL(6, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para Health
CREATE INDEX idx_sets_session ON health_sets(session_id);
CREATE INDEX idx_sets_exercise ON health_sets(exercise_id);
CREATE INDEX idx_sessions_date ON health_workout_sessions(date DESC);

-- =====================================================
-- MÓDULO 3: WISDOM (Universidad)
-- =====================================================

-- Tabla de semestres/términos
CREATE TABLE wisdom_terms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  term_average DECIMAL(4, 2) DEFAULT 0 CHECK (term_average >= 0 AND term_average <= 20),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de materias
CREATE TABLE wisdom_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  term_id UUID NOT NULL REFERENCES wisdom_terms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  credit_units INTEGER NOT NULL CHECK (credit_units > 0),
  status TEXT NOT NULL DEFAULT 'cursando' CHECK (status IN ('cursando', 'aprobada', 'reprobada', 'retirada')),
  current_projection DECIMAL(4, 2) DEFAULT 0 CHECK (current_projection >= 0 AND current_projection <= 20),
  accumulated_points DECIMAL(6, 2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de evaluaciones
CREATE TABLE wisdom_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES wisdom_subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  weight_percentage DECIMAL(4, 2) NOT NULL CHECK (weight_percentage > 0 AND weight_percentage <= 1),
  obtained_grade DECIMAL(4, 2) CHECK (obtained_grade >= 0 AND obtained_grade <= 20),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para Wisdom
CREATE INDEX idx_subjects_term ON wisdom_subjects(term_id);
CREATE INDEX idx_evaluations_subject ON wisdom_evaluations(subject_id);
CREATE INDEX idx_terms_active ON wisdom_terms(is_active) WHERE is_active = true;

-- =====================================================
-- MÓDULO 4: CHRONOS (Calendario y Eventos)
-- =====================================================

-- Tabla de eventos
CREATE TABLE chronos_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  is_all_day BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL DEFAULT 'soft' CHECK (category IN ('hard', 'soft')),
  source_type TEXT CHECK (source_type IN ('manual', 'wisdom', 'finance')),
  source_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para Chronos
CREATE INDEX idx_events_start_time ON chronos_events(start_time);
CREATE INDEX idx_events_source ON chronos_events(source_type, source_id);

-- =====================================================
-- FUNCIONES RPC
-- =====================================================

-- Función: Calcular cuánto puedo gastar hoy (Finance)
CREATE OR REPLACE FUNCTION get_daily_safe_to_spend()
RETURNS DECIMAL(12, 2) AS $$
DECLARE
  total_balance DECIMAL(12, 2);
  current_budget DECIMAL(12, 2);
  days_left INTEGER;
  daily_amount DECIMAL(12, 2);
BEGIN
  -- Obtener balance total de todas las cuentas
  SELECT COALESCE(SUM(balance), 0) INTO total_balance
  FROM finance_accounts;
  
  -- Obtener presupuesto mensual actual
  SELECT monthly_limit INTO current_budget
  FROM finance_budgets
  WHERE month = DATE_TRUNC('month', CURRENT_DATE)
  LIMIT 1;
  
  -- Si no hay presupuesto, retornar balance total
  IF current_budget IS NULL THEN
    RETURN total_balance;
  END IF;
  
  -- Calcular días restantes del mes
  days_left := DATE_PART('day', 
    DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'
  )::INTEGER - DATE_PART('day', CURRENT_DATE)::INTEGER + 1;
  
  -- Calcular gasto diario seguro
  daily_amount := LEAST(total_balance, current_budget) / NULLIF(days_left, 0);
  
  RETURN COALESCE(daily_amount, 0);
END;
$$ LANGUAGE plpgsql;

-- Función: Obtener último registro de ejercicio (Health - Ghost Mode)
CREATE OR REPLACE FUNCTION get_previous_log(p_exercise_id UUID)
RETURNS TABLE(
  weight_kg DECIMAL(6, 2),
  reps INTEGER,
  rpe INTEGER,
  date DATE,
  one_rep_max_est DECIMAL(6, 2)
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
  JOIN health_workout_sessions ws ON s.session_id = ws.id
  WHERE s.exercise_id = p_exercise_id
  ORDER BY ws.date DESC, s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Función: Calcular 1RM usando fórmula Epley
CREATE OR REPLACE FUNCTION calculate_one_rep_max(weight DECIMAL, reps INTEGER)
RETURNS DECIMAL(6, 2) AS $$
BEGIN
  IF reps = 1 THEN
    RETURN weight;
  END IF;
  -- Fórmula Epley: 1RM = weight * (1 + reps/30)
  RETURN ROUND(weight * (1 + reps::DECIMAL / 30), 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Calcular 1RM automáticamente al insertar/actualizar set
CREATE OR REPLACE FUNCTION trigger_calculate_one_rep_max()
RETURNS TRIGGER AS $$
BEGIN
  NEW.one_rep_max_est := calculate_one_rep_max(NEW.weight_kg, NEW.reps);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_one_rep_max
  BEFORE INSERT OR UPDATE ON health_sets
  FOR EACH ROW
  EXECUTE FUNCTION trigger_calculate_one_rep_max();

-- Trigger: Actualizar balance de cuenta al insertar transacción
CREATE OR REPLACE FUNCTION trigger_update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_expense THEN
    UPDATE finance_accounts 
    SET balance = balance - NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.account_id;
  ELSE
    UPDATE finance_accounts 
    SET balance = balance + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.account_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transaction_update_balance
  AFTER INSERT ON finance_transactions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_account_balance();

-- Trigger: Recalcular proyección de materia al actualizar evaluación
CREATE OR REPLACE FUNCTION trigger_recalculate_subject_projection()
RETURNS TRIGGER AS $$
DECLARE
  total_weight DECIMAL(4, 2);
  accumulated DECIMAL(6, 2);
  projection DECIMAL(4, 2);
BEGIN
  -- Calcular peso total de evaluaciones completadas
  SELECT 
    COALESCE(SUM(weight_percentage), 0),
    COALESCE(SUM(obtained_grade * weight_percentage), 0)
  INTO total_weight, accumulated
  FROM wisdom_evaluations
  WHERE subject_id = NEW.subject_id AND is_completed = true;
  
  -- Calcular proyección (si hay evaluaciones completadas)
  IF total_weight > 0 THEN
    projection := accumulated / total_weight;
  ELSE
    projection := 0;
  END IF;
  
  -- Actualizar materia
  UPDATE wisdom_subjects
  SET 
    current_projection = projection,
    accumulated_points = accumulated,
    updated_at = NOW()
  WHERE id = NEW.subject_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER evaluation_recalculate_projection
  AFTER INSERT OR UPDATE ON wisdom_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_recalculate_subject_projection();

-- Trigger: Recalcular promedio del semestre al actualizar materia
CREATE OR REPLACE FUNCTION trigger_recalculate_term_average()
RETURNS TRIGGER AS $$
DECLARE
  term_avg DECIMAL(4, 2);
  total_uc INTEGER;
BEGIN
  -- Calcular promedio ponderado del semestre
  SELECT 
    COALESCE(SUM(current_projection * credit_units) / NULLIF(SUM(credit_units), 0), 0),
    COALESCE(SUM(credit_units), 0)
  INTO term_avg, total_uc
  FROM wisdom_subjects
  WHERE term_id = NEW.term_id AND status = 'cursando';
  
  -- Actualizar semestre
  UPDATE wisdom_terms
  SET 
    term_average = term_avg,
    updated_at = NOW()
  WHERE id = NEW.term_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subject_recalculate_term_average
  AFTER INSERT OR UPDATE ON wisdom_subjects
  FOR EACH ROW
  EXECUTE FUNCTION trigger_recalculate_term_average();

-- Trigger: Crear evento en Chronos cuando se agrega evaluación con fecha
CREATE OR REPLACE FUNCTION trigger_create_event_from_evaluation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.due_date IS NOT NULL THEN
    INSERT INTO chronos_events (
      title,
      description,
      start_time,
      end_time,
      is_all_day,
      category,
      source_type,
      source_id
    )
    VALUES (
      'Evaluación: ' || NEW.name,
      (SELECT name FROM wisdom_subjects WHERE id = NEW.subject_id),
      NEW.due_date::TIMESTAMPTZ,
      NEW.due_date::TIMESTAMPTZ + INTERVAL '2 hours',
      false,
      'hard',
      'wisdom',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER evaluation_create_chronos_event
  AFTER INSERT ON wisdom_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_event_from_evaluation();

-- Trigger: Eliminar evento de Chronos cuando se elimina evaluación
CREATE OR REPLACE FUNCTION trigger_delete_event_from_evaluation()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM chronos_events
  WHERE source_type = 'wisdom' AND source_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER evaluation_delete_chronos_event
  AFTER DELETE ON wisdom_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_delete_event_from_evaluation();

-- Trigger: Actualizar evento cuando cambia fecha de evaluación
CREATE OR REPLACE FUNCTION trigger_update_event_from_evaluation()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.due_date IS DISTINCT FROM NEW.due_date THEN
    IF NEW.due_date IS NULL THEN
      -- Si se elimina la fecha, borrar el evento
      DELETE FROM chronos_events
      WHERE source_type = 'wisdom' AND source_id = NEW.id;
    ELSIF OLD.due_date IS NULL THEN
      -- Si se agrega fecha nueva, crear evento
      INSERT INTO chronos_events (
        title,
        description,
        start_time,
        end_time,
        is_all_day,
        category,
        source_type,
        source_id
      )
      VALUES (
        'Evaluación: ' || NEW.name,
        (SELECT name FROM wisdom_subjects WHERE id = NEW.subject_id),
        NEW.due_date::TIMESTAMPTZ,
        NEW.due_date::TIMESTAMPTZ + INTERVAL '2 hours',
        false,
        'hard',
        'wisdom',
        NEW.id
      );
    ELSE
      -- Actualizar evento existente
      UPDATE chronos_events
      SET 
        start_time = NEW.due_date::TIMESTAMPTZ,
        end_time = NEW.due_date::TIMESTAMPTZ + INTERVAL '2 hours',
        title = 'Evaluación: ' || NEW.name,
        updated_at = NOW()
      WHERE source_type = 'wisdom' AND source_id = NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER evaluation_update_chronos_event
  AFTER UPDATE ON wisdom_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_event_from_evaluation();

-- Trigger: Actualizar timestamps automáticamente
CREATE OR REPLACE FUNCTION trigger_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_finance_accounts_timestamp
  BEFORE UPDATE ON finance_accounts
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER update_finance_budgets_timestamp
  BEFORE UPDATE ON finance_budgets
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER update_wisdom_terms_timestamp
  BEFORE UPDATE ON wisdom_terms
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER update_wisdom_subjects_timestamp
  BEFORE UPDATE ON wisdom_subjects
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER update_wisdom_evaluations_timestamp
  BEFORE UPDATE ON wisdom_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER update_chronos_events_timestamp
  BEFORE UPDATE ON chronos_events
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_timestamp();

-- =====================================================
-- DATOS INICIALES (OPCIONAL)
-- =====================================================

-- Insertar grupos musculares comunes
INSERT INTO health_exercises (name, muscle_group) VALUES
  ('Press Banca', 'Pecho'),
  ('Sentadilla', 'Piernas'),
  ('Peso Muerto', 'Espalda'),
  ('Press Militar', 'Hombros'),
  ('Dominadas', 'Espalda'),
  ('Curl Bíceps', 'Brazos'),
  ('Extensión Tríceps', 'Brazos')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- POLÍTICAS RLS (Row Level Security) - OPCIONAL
-- =====================================================

-- Habilitar RLS en todas las tablas (descomentar si usas autenticación)
-- ALTER TABLE finance_accounts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE finance_budgets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE health_exercises ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE health_workout_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE health_sets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE wisdom_terms ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE wisdom_subjects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE wisdom_evaluations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chronos_events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- FIN DEL SCHEMA
-- =====================================================
