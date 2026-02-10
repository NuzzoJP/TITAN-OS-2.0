-- =====================================================
-- TITAN FUEL AI - NUTRITION & METABOLIC EXPANSION
-- =====================================================

-- Tabla de estadísticas corporales (Cubitt Integration)
CREATE TABLE IF NOT EXISTS health_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  measured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'cubitt_api', 'apple_health')),
  
  -- Core Metrics
  weight_kg DECIMAL(5, 2) NOT NULL,
  body_fat_percent DECIMAL(4, 1),
  muscle_mass_kg DECIMAL(5, 2),
  visceral_fat_level INTEGER,
  water_percent DECIMAL(4, 1),
  bone_mass_kg DECIMAL(4, 2),
  metabolic_age INTEGER,
  
  -- Visual Progress
  photo_front_url TEXT,
  photo_back_url TEXT,
  photo_side_url TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de perfil metabólico (calculado automáticamente)
CREATE TABLE IF NOT EXISTS health_metabolic_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User Info (para cálculos)
  age INTEGER NOT NULL,
  height_cm DECIMAL(5, 2) NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  activity_level TEXT NOT NULL DEFAULT 'moderate' CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  
  -- Calculated Metrics (auto-updated by trigger)
  current_weight_kg DECIMAL(5, 2),
  bmr DECIMAL(7, 2), -- Basal Metabolic Rate
  tdee DECIMAL(7, 2), -- Total Daily Energy Expenditure
  daily_calorie_target DECIMAL(7, 2),
  daily_protein_target_g DECIMAL(6, 2),
  daily_carbs_target_g DECIMAL(6, 2),
  daily_fats_target_g DECIMAL(6, 2),
  
  goal TEXT NOT NULL DEFAULT 'maintain' CHECK (goal IN ('cut', 'maintain', 'bulk')),
  
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de logs de nutrición (AI-powered)
CREATE TABLE IF NOT EXISTS health_nutrition_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  
  -- AI Processing
  image_url TEXT,
  ai_provider TEXT CHECK (ai_provider IN ('openai', 'gemini', 'anthropic', 'mock')),
  ai_analysis_json JSONB,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  
  -- Macros (Final Values)
  food_name TEXT,
  calories INTEGER NOT NULL,
  protein_g DECIMAL(6, 2) NOT NULL,
  carbs_g DECIMAL(6, 2) NOT NULL,
  fats_g DECIMAL(6, 2) NOT NULL,
  
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para Health Nutrition
CREATE INDEX idx_health_stats_measured ON health_stats(measured_at DESC);
CREATE INDEX idx_nutrition_logs_date ON health_nutrition_logs(logged_at DESC);
CREATE INDEX idx_nutrition_logs_meal_type ON health_nutrition_logs(meal_type);

-- =====================================================
-- FUNCIONES METABÓLICAS
-- =====================================================

-- Función: Calcular BMR usando Mifflin-St Jeor
CREATE OR REPLACE FUNCTION calculate_bmr(
  weight_kg DECIMAL,
  height_cm DECIMAL,
  age INTEGER,
  gender TEXT
)
RETURNS DECIMAL AS $$
BEGIN
  IF gender = 'male' THEN
    -- BMR (hombres) = (10 × peso en kg) + (6.25 × altura en cm) - (5 × edad) + 5
    RETURN (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5;
  ELSE
    -- BMR (mujeres) = (10 × peso en kg) + (6.25 × altura en cm) - (5 × edad) - 161
    RETURN (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función: Calcular TDEE basado en nivel de actividad
CREATE OR REPLACE FUNCTION calculate_tdee(
  bmr DECIMAL,
  activity_level TEXT
)
RETURNS DECIMAL AS $$
BEGIN
  CASE activity_level
    WHEN 'sedentary' THEN
      RETURN bmr * 1.2;
    WHEN 'light' THEN
      RETURN bmr * 1.375;
    WHEN 'moderate' THEN
      RETURN bmr * 1.55;
    WHEN 'active' THEN
      RETURN bmr * 1.725;
    WHEN 'very_active' THEN
      RETURN bmr * 1.9;
    ELSE
      RETURN bmr * 1.55; -- Default moderate
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función: Calcular targets de macros basados en objetivo
CREATE OR REPLACE FUNCTION calculate_macro_targets(
  tdee DECIMAL,
  weight_kg DECIMAL,
  goal TEXT
)
RETURNS TABLE(
  calorie_target DECIMAL,
  protein_g DECIMAL,
  carbs_g DECIMAL,
  fats_g DECIMAL
) AS $$
DECLARE
  target_calories DECIMAL;
  protein_target DECIMAL;
  fats_target DECIMAL;
  carbs_target DECIMAL;
BEGIN
  -- Ajustar calorías según objetivo
  CASE goal
    WHEN 'cut' THEN
      target_calories := tdee * 0.85; -- Déficit 15%
    WHEN 'bulk' THEN
      target_calories := tdee * 1.10; -- Superávit 10%
    ELSE
      target_calories := tdee; -- Mantenimiento
  END CASE;
  
  -- Proteína: 2g por kg de peso corporal
  protein_target := weight_kg * 2;
  
  -- Grasas: 25% de calorías totales
  fats_target := (target_calories * 0.25) / 9; -- 9 cal por gramo
  
  -- Carbohidratos: El resto de calorías
  carbs_target := (target_calories - (protein_target * 4) - (fats_target * 9)) / 4;
  
  RETURN QUERY SELECT 
    ROUND(target_calories, 2),
    ROUND(protein_target, 2),
    ROUND(carbs_target, 2),
    ROUND(fats_target, 2);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS METABÓLICOS
-- =====================================================

-- Trigger: Actualizar perfil metabólico cuando se registra nuevo peso
CREATE OR REPLACE FUNCTION trigger_update_metabolic_profile()
RETURNS TRIGGER AS $$
DECLARE
  profile_record RECORD;
  new_bmr DECIMAL;
  new_tdee DECIMAL;
  macro_targets RECORD;
BEGIN
  -- Obtener perfil metabólico (asumimos que existe uno)
  SELECT * INTO profile_record FROM health_metabolic_profile LIMIT 1;
  
  IF profile_record IS NOT NULL THEN
    -- Calcular nuevo BMR
    new_bmr := calculate_bmr(
      NEW.weight_kg,
      profile_record.height_cm,
      profile_record.age,
      profile_record.gender
    );
    
    -- Calcular nuevo TDEE
    new_tdee := calculate_tdee(new_bmr, profile_record.activity_level);
    
    -- Calcular nuevos targets de macros
    SELECT * INTO macro_targets FROM calculate_macro_targets(
      new_tdee,
      NEW.weight_kg,
      profile_record.goal
    );
    
    -- Actualizar perfil
    UPDATE health_metabolic_profile
    SET 
      current_weight_kg = NEW.weight_kg,
      bmr = new_bmr,
      tdee = new_tdee,
      daily_calorie_target = macro_targets.calorie_target,
      daily_protein_target_g = macro_targets.protein_g,
      daily_carbs_target_g = macro_targets.carbs_g,
      daily_fats_target_g = macro_targets.fats_g,
      updated_at = NOW()
    WHERE id = profile_record.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER health_stats_update_metabolic
  AFTER INSERT ON health_stats
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_metabolic_profile();

-- Trigger: Actualizar timestamps
CREATE OR REPLACE FUNCTION trigger_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_metabolic_profile_timestamp
  BEFORE UPDATE ON health_metabolic_profile
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_timestamp();

-- =====================================================
-- FUNCIONES RPC PARA NUTRICIÓN
-- =====================================================

-- Función: Obtener resumen nutricional del día
CREATE OR REPLACE FUNCTION get_daily_nutrition_summary(target_date DATE DEFAULT CURRENT_DATE)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_calories', COALESCE(SUM(calories), 0),
    'total_protein', COALESCE(SUM(protein_g), 0),
    'total_carbs', COALESCE(SUM(carbs_g), 0),
    'total_fats', COALESCE(SUM(fats_g), 0),
    'meal_count', COUNT(*)
  ) INTO result
  FROM health_nutrition_logs
  WHERE DATE(logged_at) = target_date;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Función: Obtener progreso semanal de peso
CREATE OR REPLACE FUNCTION get_weight_progress(days INTEGER DEFAULT 30)
RETURNS TABLE(
  date DATE,
  weight_kg DECIMAL,
  body_fat_percent DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(measured_at) as date,
    hs.weight_kg,
    hs.body_fat_percent
  FROM health_stats hs
  WHERE measured_at >= NOW() - (days || ' days')::INTERVAL
  ORDER BY measured_at ASC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DATOS INICIALES (OPCIONAL)
-- =====================================================

-- Crear perfil metabólico por defecto (ajustar según usuario)
-- INSERT INTO health_metabolic_profile (age, height_cm, gender, activity_level, goal)
-- VALUES (25, 175, 'male', 'moderate', 'maintain')
-- ON CONFLICT DO NOTHING;

-- =====================================================
-- FIN DE EXPANSIÓN NUTRICIONAL
-- =====================================================
