# 🏋️ TITAN HEALTH - Plan de Mejoras Completo

## 📊 Estado Actual vs Objetivo

### ✅ Lo que YA está implementado:
1. **Gym Tracker básico** - Log de entrenamientos y sets
2. **Ghost Mode** - Ver datos del último entrenamiento
3. **Cálculo de 1RM** - Automático con fórmula de Epley
4. **Nutrition Tracker** - Log manual de comidas
5. **Perfil Metabólico** - Cálculos de BMR/TDEE
6. **Gráficas básicas** - Progreso de 1RM

### 🚀 Lo que ACABAMOS de agregar:
1. **Scanner de Cubitt con Vision AI** - Extrae TODOS los datos automáticamente
2. **Dashboard de Progreso Avanzado** - Gráficas de evolución muscular
3. **Análisis de Rendimiento** - Qué estás haciendo bien/mal
4. **Tracker Semanal** - Visualización de días asistidos (meta: 5/7)
5. **Librería de Ejercicios** - 40+ ejercicios pre-cargados
6. **Librería de Alimentos** - Macros estimados de comidas comunes

### ⚠️ Lo que FALTA implementar:

---

## 🎯 FASE 1: Funcionalidades Críticas (Implementar AHORA)

### 1. Sistema de Rutinas Pre-hechas
**Problema**: Tienes que ir poniendo las series manualmente cada vez.

**Solución**:
- Crear rutinas guardadas (ej: "Push Day", "Pull Day", "Leg Day")
- Cada rutina tiene ejercicios predefinidos con sets/reps objetivo
- Al iniciar sesión, seleccionas la rutina y se pre-cargan los ejercicios
- Solo llenas peso/reps, el resto ya está

**Tablas necesarias** (YA CREADAS en `health_complete_expansion.sql`):
- `health_routines` - Rutinas guardadas
- `health_routine_exercises` - Ejercicios de cada rutina

**Componentes a crear**:
- `create-routine-modal.tsx` - Crear/editar rutinas
- `routine-selector.tsx` - Seleccionar rutina al iniciar sesión
- `routine-library.tsx` - Ver todas tus rutinas

### 2. Perfil Metabólico Editable
**Problema**: No puedes agregar/editar tu perfil metabólico.

**Solución**:
- Modal para configurar: edad, altura, género, nivel de actividad, objetivo
- Se calcula automáticamente BMR, TDEE, targets de macros
- Se actualiza automáticamente cuando subes peso de Cubitt

**Componente a crear**:
- `metabolic-profile-modal.tsx` - Configurar perfil

### 3. Prompt Optimizado para IA de Comida
**Problema**: La IA puede fallar al identificar comidas.

**Solución**: Prompt especializado con tu contexto:
```
Eres un nutricionista experto analizando comida venezolana/latina.
El usuario come principalmente:
- Pollo a la plancha
- Huevos
- Pasta
- Arroz
- Pan
- Ensalada
- Mantequilla

Analiza la imagen y devuelve JSON con:
{
  "food_name": "nombre del plato",
  "portion_estimate": "descripción de la porción",
  "calories": número,
  "protein_g": número,
  "carbs_g": número,
  "fats_g": número,
  "confidence": número (0-100)
}

Si la confianza es baja (<70%), sugiere ajustes.
```

### 4. Integración Completa de Cubitt
**Archivos creados**:
- ✅ `scan-cubitt-modal.tsx` - Modal para escanear
- ✅ `lib/actions/cubitt.ts` - Lógica de análisis
- ✅ `progress-dashboard.tsx` - Dashboard de progreso
- ✅ `weekly-gym-tracker.tsx` - Tracker semanal

**Falta**:
- Integrar estos componentes en `health/page.tsx`
- Agregar tab "Progreso" en Health
- Configurar API keys (OpenAI o Gemini)

---

## 🔬 FASE 2: Análisis Avanzado (Próxima semana)

### 5. Métricas de Volumen y Frecuencia
**Qué medir**:
- Volumen total semanal por grupo muscular
- Frecuencia de entrenamiento por músculo
- Intensidad promedio (RPE)
- Tiempo bajo tensión estimado

**Componente**:
- `volume-analysis.tsx` - Dashboard de volumen

### 6. Sistema de Recomendaciones
**Basado en tus datos, sugerir**:
- "Aumenta volumen en piernas (solo 8 sets esta semana)"
- "Reduce grasa corporal: déficit de 300 kcal recomendado"
- "Aumenta proteína: solo 120g/día, objetivo 160g"

**Componente**:
- `recommendations-panel.tsx` - Panel de sugerencias

### 7. Comparación de Fotos de Progreso
**Funcionalidad**:
- Subir fotos (frente/espalda/lado) cada semana
- Comparar lado a lado
- Overlay para ver cambios

**Tabla** (ya existe en schema):
- `health_stats.photo_front_url`
- `health_stats.photo_back_url`
- `health_stats.photo_side_url`

---

## 📈 FASE 3: Optimización de Performance (Después)

### 8. Reducir Tiempos de Carga
**Problemas actuales**:
- Muchas queries a Supabase
- No hay caching
- Componentes no optimizados

**Soluciones**:
1. **React Query** - Caching automático
   ```bash
   npm install @tanstack/react-query
   ```

2. **Lazy Loading** - Cargar componentes bajo demanda
   ```tsx
   const ProgressDashboard = lazy(() => import('./progress-dashboard'));
   ```

3. **Optimistic Updates** - UI instantánea
   ```tsx
   // Actualizar UI antes de confirmar con servidor
   ```

4. **Índices en Supabase** - Ya creados en `health_complete_expansion.sql`

5. **Reducir tamaño de imágenes** - Comprimir antes de subir

### 9. Diseño Mejorado
**Feedback**: "Lo veo muy sencillo"

**Mejoras visuales**:
1. **Animaciones suaves**
   - Framer Motion para transiciones
   - Skeleton loaders
   - Micro-interacciones

2. **Glassmorphism**
   - Fondos con blur
   - Bordes con gradientes
   - Sombras más pronunciadas

3. **Gráficas más atractivas**
   - Gradientes en áreas
   - Animaciones al cargar
   - Tooltips mejorados

4. **Cards con más profundidad**
   - Sombras dinámicas
   - Hover effects
   - Iconos animados

**Ejemplo de mejora**:
```tsx
// Antes
<div className="bg-card border border-border rounded-lg p-4">

// Después
<div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 rounded-xl p-6 shadow-2xl hover:shadow-primary/20 transition-all duration-300">
```

---

## 🔧 Pasos de Implementación Inmediatos

### Paso 1: Ejecutar SQL de expansión
```sql
-- En Supabase SQL Editor, ejecutar:
titan-os/supabase/health_complete_expansion.sql
```

Esto agrega:
- ✅ Columnas faltantes en `health_stats`
- ✅ 40+ ejercicios pre-cargados
- ✅ Tablas de rutinas
- ✅ Librería de alimentos
- ✅ Función de asistencia semanal
- ✅ Índices de optimización

### Paso 2: Configurar API Keys
```env
# En .env.local agregar:

# Para Cubitt Scanner (elegir uno)
CUBITT_AI_PROVIDER=openai  # o 'gemini' o 'mock'
OPENAI_API_KEY=sk-...
# O
GEMINI_API_KEY=...

# Para Nutrition Scanner (elegir uno)
NUTRITION_AI_PROVIDER=openai  # o 'gemini' o 'mock'
```

### Paso 3: Integrar nuevos componentes
Actualizar `app/dashboard/health/page.tsx`:
```tsx
import { ScanCubittModal } from '@/components/health/scan-cubitt-modal';
import { ProgressDashboard } from '@/components/health/progress-dashboard';
import { WeeklyGymTracker } from '@/components/health/weekly-gym-tracker';

// Agregar tabs: Gym | Nutrition | Progreso
```

### Paso 4: Crear componentes de rutinas
- `create-routine-modal.tsx`
- `routine-selector.tsx`
- Integrar en Gym Dashboard

### Paso 5: Optimizar performance
- Agregar React Query
- Lazy loading de componentes pesados
- Comprimir imágenes

---

## 📊 Métricas de Éxito

### Performance:
- ⏱️ Tiempo de carga inicial: <2s (actualmente ~5s)
- ⏱️ Tiempo de navegación entre tabs: <500ms
- 📦 Tamaño de bundle: <500KB

### Funcionalidad:
- ✅ Scanner de Cubitt con >90% precisión
- ✅ Rutinas pre-hechas funcionando
- ✅ Tracker semanal mostrando 5/7 días
- ✅ Análisis de rendimiento con insights

### UX:
- 🎨 Diseño más atractivo (glassmorphism)
- ⚡ Animaciones suaves
- 📱 Responsive perfecto en móvil

---

## 🎯 Prioridades para AHORA

1. **CRÍTICO**: Ejecutar `health_complete_expansion.sql`
2. **CRÍTICO**: Integrar Scanner de Cubitt
3. **CRÍTICO**: Crear sistema de rutinas
4. **IMPORTANTE**: Optimizar performance
5. **IMPORTANTE**: Mejorar diseño visual
6. **NICE TO HAVE**: Análisis avanzado

---

## 💡 Investigación Sugerida

Para mejorar el módulo de Gym, investiga:

1. **Periodización de entrenamiento**
   - Linear periodization
   - Undulating periodization
   - Block periodization

2. **Métricas avanzadas**
   - Tonnage (volumen total)
   - Intensity (% de 1RM)
   - Frequency (días por semana por músculo)
   - Volume landmarks (sets por músculo por semana)

3. **Programas populares**
   - PPL (Push/Pull/Legs)
   - Upper/Lower Split
   - Full Body
   - Bro Split

4. **Tracking de fatiga**
   - RPE (Rate of Perceived Exertion)
   - RIR (Reps in Reserve)
   - Readiness score

5. **Deload protocols**
   - Cuándo hacer deload
   - Cómo reducir volumen/intensidad

---

**Última actualización**: 10 de Febrero, 2026
**Próxima revisión**: Después de implementar Fase 1
