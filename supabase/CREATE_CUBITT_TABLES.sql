-- =====================================================
-- CREAR TABLAS PARA CUBITT (PROGRESO)
-- =====================================================
-- Ejecuta este SQL solo si quieres usar el tracking de Cubitt

-- Tabla de perfil metabólico del usuario
CREATE TABLE IF NOT EXISTS metabolic_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  height_cm DECIMAL(5,2) NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  goal TEXT NOT NULL CHECK (goal IN ('cut', 'maintain', 'bulk')),
  bmr DECIMAL(7,2),
  tdee DECIMAL(7,2),
  target_calories DECIMAL(7,2),
  target_protein_g DECIMAL(6,2),
  target_carbs_g DECIMAL(6,2),
  target_fat_g DECIMAL(6,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_metabolic_profiles_user ON metabolic_profiles(user_id);

-- RLS Policies
ALTER TABLE metabolic_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON metabolic_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON metabolic_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON metabolic_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- NOTA: health_stats ya existe en nutrition_expansion.sql
-- Si no la has creado, ejecuta nutrition_expansion.sql
-- =====================================================

-- Verificar que las tablas existen
SELECT 
  'metabolic_profiles' as tabla,
  COUNT(*) as registros
FROM metabolic_profiles
UNION ALL
SELECT 
  'health_stats' as tabla,
  COUNT(*) as registros
FROM health_stats;
