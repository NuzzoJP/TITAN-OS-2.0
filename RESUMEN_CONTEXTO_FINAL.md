# 📋 RESUMEN DEL CONTEXTO - TITAN OS

## ✅ LO QUE YA ESTÁ IMPLEMENTADO

### 🏋️ SISTEMA DE GYM (100% COMPLETO)
- ✅ **Rutinas PPL Jeff Nippard** - 6 rutinas (Push A/B, Pull A/B, Legs A/B)
- ✅ **19 ejercicios S+ Tier** con notas técnicas (Tempo, RIR, cues)
- ✅ **Active Workout** - Sistema de entrenamiento en vivo
- ✅ **Rest Timer** - Cronómetro automático entre sets
- ✅ **Optimistic Updates** - UI instantánea con React Query
- ✅ **Índices de BD** - Queries 10x más rápidas
- ✅ **UI móvil optimizada** - Botones grandes, inputs táctiles

### 📊 SISTEMA DE PROGRESO (CUBITT)
- ✅ **Tablas creadas** - `health_stats`, `metabolic_profiles`
- ✅ **Scan Modal** - Componente para escanear Cubitt
- ✅ **Gráficas** - Peso, masa muscular, grasa corporal
- ✅ **Empty State** - Onboarding visual
- ⚠️ **FALTA**: Lógica de cálculo de calorías/macros

### 🍽️ SISTEMA DE NUTRICIÓN (TITAN FUEL AI)
- ✅ **Scan Food Modal** - Escaneo de comidas con cámara
- ✅ **IA configurada** - GPT-4 Vision para análisis
- ✅ **Tablas** - `health_nutrition_logs`
- ✅ **CRUD completo** - Crear, leer, actualizar logs
- ⚠️ **FALTA**: Lógica de cálculo de calorías/macros
- ⚠️ **FALTA**: Interfaz para configurar perfil metabólico

---

## ⚠️ LO QUE FALTA IMPLEMENTAR

### 1. **Lógica de Cálculo de Calorías** (CRÍTICO)

Necesitas implementar las fórmulas para calcular:

#### A) BMR (Metabolismo Basal)
```typescript
// Fórmula Mifflin-St Jeor (más precisa)
function calculateBMR(weight_kg: number, height_cm: number, age: number, gender: 'male' | 'female'): number {
  if (gender === 'male') {
    return (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5;
  } else {
    return (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161;
  }
}
```

#### B) TDEE (Gasto Calórico Total)
```typescript
function calculateTDEE(bmr: number, activity_level: string): number {
  const multipliers = {
    sedentary: 1.2,      // Poco o ningún ejercicio
    light: 1.375,        // Ejercicio ligero 1-3 días/semana
    moderate: 1.55,      // Ejercicio moderado 3-5 días/semana
    active: 1.725,       // Ejercicio intenso 6-7 días/semana
    very_active: 1.9,    // Ejercicio muy intenso + trabajo físico
  };
  
  return bmr * (multipliers[activity_level] || 1.2);
}
```

#### C) Calorías Objetivo según Goal
```typescript
function calculateTargetCalories(tdee: number, goal: string): number {
  if (goal === 'cut') {
    return tdee - 500;  // Déficit de 500 kcal
  } else if (goal === 'bulk') {
    return tdee + 300;  // Superávit de 300 kcal (clean bulk)
  } else {
    return tdee;  // Mantenimiento
  }
}
```

#### D) Macros (Proteína, Carbos, Grasas)
```typescript
function calculateMacros(weight_kg: number, target_calories: number, goal: string) {
  // Proteína: 2g/kg para bulk, 2.2g/kg para cut
  const protein_g = goal === 'cut' ? weight_kg * 2.2 : weight_kg * 2.0;
  const protein_kcal = protein_g * 4;
  
  // Grasas: 1g/kg (mínimo para hormonas)
  const fat_g = weight_kg * 1.0;
  const fat_kcal = fat_g * 9;
  
  // Carbos: El resto de calorías
  const remaining_kcal = target_calories - protein_kcal - fat_kcal;
  const carbs_g = remaining_kcal / 4;
  
  return {
    protein_g: Math.round(protein_g),
    carbs_g: Math.round(carbs_g),
    fat_g: Math.round(fat_g),
  };
}
```

### 2. **Interfaz de Configuración de Perfil** (CRÍTICO)

Necesitas crear un modal/página para:
- Ingresar altura (cm)
- Ingresar edad
- Seleccionar género (Masculino/Femenino)
- Seleccionar nivel de actividad (dropdown)
- Seleccionar objetivo (Cut/Maintain/Bulk)
- Botón "Calcular" que ejecute las fórmulas
- Mostrar resultados: BMR, TDEE, Calorías objetivo, Macros

### 3. **Integración con Cubitt**

Cuando escaneas Cubitt, necesitas:
- Extraer peso actual
- Actualizar `metabolic_profiles.current_weight_kg`
- Recalcular BMR, TDEE y macros automáticamente
- Mostrar en dashboard

---

## 🎯 TU PERFIL (EJEMPLO)

Basándome en que eres ectomorfo en clean bulk:

### Datos de Entrada:
- **Peso**: 70 kg (ejemplo)
- **Altura**: 175 cm
- **Edad**: 22 años
- **Género**: Masculino
- **Actividad**: Very Active (6 días gym PPL)
- **Objetivo**: Bulk (Clean Bulk)

### Cálculos:
```
BMR = (10 × 70) + (6.25 × 175) - (5 × 22) + 5
    = 700 + 1093.75 - 110 + 5
    = 1,688.75 kcal

TDEE = 1,688.75 × 1.9 (very active)
     = 3,208 kcal

Target = 3,208 + 300 (bulk)
       = 3,508 kcal/día

Proteína = 70 × 2.0 = 140g (560 kcal)
Grasas = 70 × 1.0 = 70g (630 kcal)
Carbos = (3,508 - 560 - 630) / 4 = 579g (2,318 kcal)
```

### Resultado Final:
- **Calorías**: 3,508 kcal/día
- **Proteína**: 140g (16%)
- **Carbos**: 579g (66%)
- **Grasas**: 70g (18%)

---

## 📱 FLUJO DE USUARIO IDEAL

### 1. Primera Vez (Onboarding)
1. Usuario va a Health → Progreso
2. Ve empty state con botón "Configurar Perfil"
3. Completa formulario (altura, edad, género, actividad, objetivo)
4. Sistema calcula y guarda BMR, TDEE, macros
5. Usuario escanea Cubitt para peso inicial
6. Dashboard muestra métricas y objetivos

### 2. Uso Diario
1. Usuario va a Health → Titan Fuel AI
2. Escanea comida con cámara
3. IA detecta: "Pollo con arroz - 450 kcal, 35g proteína, 50g carbos, 10g grasas"
4. Usuario confirma o edita
5. Dashboard muestra progreso del día:
   - Calorías: 1,200 / 3,508 (34%)
   - Proteína: 80g / 140g (57%)
   - Carbos: 150g / 579g (26%)
   - Grasas: 25g / 70g (36%)

### 3. Tracking Semanal
1. Usuario escanea Cubitt cada lunes
2. Sistema actualiza peso, masa muscular, % grasa
3. Recalcula BMR/TDEE automáticamente
4. Muestra gráficas de progreso
5. Ajusta macros si es necesario

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

1. **Implementar lógica de cálculo** en `nutrition.ts`
2. **Crear modal de configuración de perfil**
3. **Integrar cálculos con Cubitt scan**
4. **Mostrar macros en Nutrition Dashboard**
5. **Commit y push a GitHub**

---

## 📊 ESTADO ACTUAL DE LA APP

- **Velocidad**: ✅ Optimizada con React Query + índices
- **Gym System**: ✅ 100% funcional
- **Cubitt Tracking**: ⚠️ 70% (falta cálculo de macros)
- **Nutrition AI**: ⚠️ 80% (falta perfil metabólico)
- **UI Móvil**: ✅ Optimizada

---

**Siguiente paso: Implementar la lógica de cálculo de calorías y crear el modal de configuración de perfil.** 🎯
