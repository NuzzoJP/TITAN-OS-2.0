# 📊 GUÍA COMPLETA: Configurar Perfil y Escanear Cubitt

## 🎯 PROBLEMA ACTUAL

El tab "Progreso" está vacío porque:
1. No has configurado tu perfil metabólico
2. No has escaneado ningún reporte de Cubitt
3. Las tablas de la base de datos no existen aún

---

## 📋 PASO 1: CREAR TABLAS DE CUBITT

Ejecuta este SQL en Supabase SQL Editor:

```sql
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

-- Tabla de estadísticas de salud (Cubitt)
CREATE TABLE IF NOT EXISTS health_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg DECIMAL(5,2) NOT NULL,
  muscle_mass_kg DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  visceral_fat_level INTEGER,
  bmr DECIMAL(7,2),
  metabolic_age INTEGER,
  bone_mass_kg DECIMAL(4,2),
  body_water_percentage DECIMAL(4,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_metabolic_profiles_user ON metabolic_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_health_stats_user_date ON health_stats(user_id, measurement_date DESC);

-- RLS Policies
ALTER TABLE metabolic_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_stats ENABLE ROW LEVEL SECURITY;

-- Policies para metabolic_profiles
CREATE POLICY "Users can view own profile"
  ON metabolic_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON metabolic_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON metabolic_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies para health_stats
CREATE POLICY "Users can view own stats"
  ON health_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON health_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON health_stats FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stats"
  ON health_stats FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 📋 PASO 2: CONFIGURAR TU PERFIL METABÓLICO

1. Ve a **Health** → Tab **"Progreso"**
2. Click en **"Configurar Perfil"** (botón que voy a agregar)
3. Ingresa tus datos:
   - **Altura**: 175 cm (ejemplo)
   - **Edad**: 25 años
   - **Género**: Masculino/Femenino
   - **Nivel de Actividad**: 
     - Sedentario (poco ejercicio)
     - Ligero (1-3 días/semana)
     - Moderado (3-5 días/semana)
     - Activo (6-7 días/semana)
     - Muy Activo (atleta)
   - **Objetivo**:
     - Cut (perder grasa)
     - Maintain (mantener)
     - Bulk (ganar músculo) ← **TU OBJETIVO**

4. El sistema calculará automáticamente:
   - BMR (metabolismo basal)
   - TDEE (calorías diarias totales)
   - Macros objetivo (proteína, carbos, grasas)

---

## 📋 PASO 3: ESCANEAR REPORTE DE CUBITT

### Opción A: Escanear con Cámara (Recomendado)

1. Ve a **Health** → Tab **"Progreso"**
2. Click en **"Escanear Cubitt"**
3. Permite acceso a la cámara
4. Toma foto del reporte de Cubitt
5. La IA extraerá automáticamente:
   - Peso
   - Masa muscular
   - % Grasa corporal
   - Grasa visceral
   - BMR
   - Edad metabólica
   - Masa ósea
   - % Agua corporal

### Opción B: Ingresar Manualmente

1. Click en **"Ingresar Manualmente"**
2. Completa los campos:
   - **Peso**: 70.5 kg
   - **Masa Muscular**: 55.2 kg
   - **% Grasa**: 15.3%
   - **Grasa Visceral**: 5
   - **BMR**: 1650 kcal
   - **Edad Metabólica**: 23 años
   - **Masa Ósea**: 3.2 kg
   - **% Agua**: 60.5%

---

## 📊 QUÉ VERÁS DESPUÉS

Una vez que tengas datos, el tab "Progreso" mostrará:

### 1. Métricas Actuales (Cards)
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Peso        │ Masa Musc.  │ % Grasa     │ Metabolismo │
│ 70.5 kg     │ 55.2 kg     │ 15.3%       │ 1650 kcal   │
│ ↑ +0.5 kg   │ ↑ +0.3 kg   │ ↓ -0.2%     │ ↑ +20 kcal  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### 2. Gráficas de Progreso
- **Peso**: Línea temporal con tendencia
- **Masa Muscular**: Progreso de ganancia
- **% Grasa Corporal**: Reducción/mantenimiento
- **BMR**: Evolución del metabolismo

### 3. Historial de Mediciones
- Lista de todos los escaneos
- Fecha, peso, cambios
- Opción de editar/eliminar

---

## 🔧 CÓMO FUNCIONA EL ESCANEO CON IA

El sistema usa **Vision AI** (GPT-4 Vision) para:

1. **Detectar el reporte** de Cubitt en la imagen
2. **Extraer texto** de los números y etiquetas
3. **Parsear datos** estructurados:
   ```json
   {
     "weight_kg": 70.5,
     "muscle_mass_kg": 55.2,
     "body_fat_percentage": 15.3,
     "visceral_fat_level": 5,
     "bmr": 1650,
     "metabolic_age": 23,
     "bone_mass_kg": 3.2,
     "body_water_percentage": 60.5
   }
   ```
4. **Guardar en la base de datos**
5. **Mostrar en gráficas**

---

## 📱 TIPS PARA ESCANEAR CUBITT

1. **Buena iluminación** - Evita sombras
2. **Foto clara** - Enfoca bien los números
3. **Reporte completo** - Que se vea toda la pantalla
4. **Sin reflejos** - Evita brillos en la pantalla

---

## 🎯 EJEMPLO DE USO (Ectomorfo en Bulk)

### Tu Perfil:
- Altura: 175 cm
- Edad: 22 años
- Género: Masculino
- Actividad: Muy Activo (6 días gym)
- Objetivo: **Bulk (Clean Bulk)**

### Cálculos Automáticos:
- BMR: ~1,700 kcal
- TDEE: ~2,800 kcal (con actividad)
- Superávit: +300 kcal → **3,100 kcal/día**
- Proteína: 2g/kg → **140g** (560 kcal)
- Grasas: 1g/kg → **70g** (630 kcal)
- Carbos: Resto → **477g** (1,910 kcal)

### Progreso Esperado:
- **Peso**: +0.5 kg/semana
- **Masa Muscular**: +0.3 kg/semana
- **% Grasa**: Mantener 12-15%

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Cada cuánto debo escanear Cubitt?**
R: 1 vez por semana, mismo día y hora (ej: Lunes en ayunas)

**P: ¿Qué hago si la IA no detecta bien los números?**
R: Usa la opción "Ingresar Manualmente"

**P: ¿Puedo editar un escaneo anterior?**
R: Sí, en el historial click en "Editar"

**P: ¿Los datos se sincronizan entre dispositivos?**
R: Sí, todo está en Supabase (cloud)

---

## 🚀 PRÓXIMOS PASOS

1. Ejecuta el SQL para crear las tablas
2. Configura tu perfil metabólico
3. Escanea tu primer reporte de Cubitt
4. Revisa tus gráficas de progreso
5. Escanea semanalmente para ver tendencias

---

**¿Listo para trackear tu progreso? 💪📊**
