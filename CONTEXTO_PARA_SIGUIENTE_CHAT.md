# 🔄 CONTEXTO PARA SIGUIENTE CHAT - TITAN OS

## 📊 ESTADO ACTUAL DEL PROYECTO

### ✅ LO QUE FUNCIONA (100%)
1. **Sistema de Gym**
   - Rutinas PPL Jeff Nippard (6 rutinas, 19 ejercicios)
   - Active Workout con Rest Timer
   - Optimistic updates con React Query
   - UI móvil optimizada
   - Índices de BD para velocidad

2. **Infraestructura**
   - Next.js 14 App Router
   - Supabase (PostgreSQL + Auth + RLS)
   - Vercel deployment
   - React Query para caching
   - shadcn/ui components

### ⚠️ LO QUE ESTÁ INCOMPLETO (Crítico)

#### 1. SISTEMA DE NUTRICIÓN (50% completo)
- ✅ Escaneo de comidas con IA (GPT-4 Vision)
- ✅ Guardar logs en BD
- ❌ **NO HAY** interfaz para configurar perfil metabólico
- ❌ **NO HAY** lógica de cálculo de calorías/macros
- ❌ **NO HAY** dashboard que muestre progreso diario
- ❌ **NO HAY** indicador de "llevas X/Y calorías"

#### 2. SISTEMA DE CUBITT (30% completo)
- ✅ Tablas creadas
- ✅ Componente de escaneo existe
- ❌ Botón redirige en lugar de abrir modal
- ❌ **NO HAY** integración con recálculo de macros
- ❌ **NO HAY** gráficas funcionales

#### 3. MÉTRICAS DE GYM (20% completo)
- ✅ Se guardan sets en BD
- ❌ **NO HAY** cálculo de 1RM
- ❌ **NO HAY** tracking de PRs (récords personales)
- ❌ **NO HAY** métricas de volumen total
- ❌ **NO HAY** gráficas de progreso por ejercicio
- ❌ **NO HAY** historial de entrenamientos con detalles

---

## 🎯 PRIORIDADES PARA IMPLEMENTAR

### FASE 1: PERFIL METABÓLICO Y NUTRICIÓN (CRÍTICO)

#### A) Crear `metabolic-profile-modal.tsx`
```typescript
// Formulario con:
- Input: Altura (cm)
- Input: Edad (años)
- Select: Género (male/female)
- Select: Nivel de Actividad (sedentary/light/moderate/active/very_active)
- Select: Objetivo (cut/maintain/bulk)
- Botón: "Calcular y Guardar"

// Al guardar:
1. Calcular BMR (Mifflin-St Jeor)
2. Calcular TDEE (BMR × multiplicador)
3. Calcular calorías objetivo (TDEE ± ajuste)
4. Calcular macros (proteína, carbos, grasas)
5. Guardar en metabolic_profiles
```

#### B) Implementar lógica de cálculo en `nutrition.ts`
```typescript
// Fórmulas:
BMR (hombre) = (10 × peso) + (6.25 × altura) - (5 × edad) + 5
BMR (mujer) = (10 × peso) + (6.25 × altura) - (5 × edad) - 161

TDEE = BMR × multiplicador_actividad
  sedentary: 1.2
  light: 1.375
  moderate: 1.55
  active: 1.725
  very_active: 1.9

Target Calories:
  cut: TDEE - 500
  maintain: TDEE
  bulk: TDEE + 300

Macros:
  Proteína: 2g/kg (cut: 2.2g/kg)
  Grasas: 1g/kg
  Carbos: (calorías restantes) / 4
```

#### C) Rehacer `nutrition-dashboard.tsx`
```typescript
// Debe mostrar:
1. Card de perfil (si existe)
2. Circular progress de calorías/macros del día
3. Lista de comidas con totales
4. Botón "Escanear Comida"
5. Gráfica semanal de calorías
6. Empty state si no hay perfil
```

### FASE 2: MÉTRICAS DE FUERZA

#### A) Agregar cálculo de 1RM
```typescript
// Fórmula Epley:
1RM = peso × (1 + reps / 30)

// Guardar en health_sets al crear set
// Mostrar en historial de entrenamientos
```

#### B) Crear `strength-metrics.tsx`
```typescript
// Mostrar:
- Fuerza Total (suma de 1RM de Bench/Squat/RDL)
- Volumen mensual (kg × reps × sets)
- PRs del mes
- Gráficas de progreso por ejercicio
```

#### C) Crear `workout-history.tsx`
```typescript
// Lista de sesiones con:
- Fecha, rutina, duración
- Ejercicios con sets detallados
- Opción de ver/editar/eliminar
- Filtros por fecha y rutina
```

### FASE 3: INTEGRACIÓN CUBITT

#### A) Corregir `progress-dashboard.tsx`
```typescript
// Botón "Escanear Cubitt" debe:
1. Abrir modal (no redirigir)
2. Permitir escaneo con cámara
3. Permitir ingreso manual
4. Al guardar peso:
   - Actualizar metabolic_profiles.current_weight_kg
   - Recalcular BMR, TDEE, macros
   - Guardar en health_stats
```

### FASE 4: SISTEMA DE LOGROS (Opcional)

```typescript
// Detectar automáticamente:
- PRs (nuevo récord en ejercicio)
- Rachas (días consecutivos)
- Objetivos cumplidos (peso objetivo, 1RM objetivo)
- Mostrar notificaciones
```

---

## 📁 ARCHIVOS CLAVE

### Componentes a Crear:
- `components/health/metabolic-profile-modal.tsx` ⭐ CRÍTICO
- `components/health/strength-metrics.tsx`
- `components/health/workout-history.tsx`
- `components/health/achievements.tsx`

### Componentes a Modificar:
- `components/health/nutrition-dashboard.tsx` ⭐ CRÍTICO
- `components/health/progress-dashboard.tsx` ⭐ CRÍTICO
- `components/health/gym-dashboard.tsx`

### Server Actions a Implementar:
- `lib/actions/nutrition.ts` → `calculateMetabolics()` ⭐ CRÍTICO
- `lib/actions/health.ts` → `calculate1RM()`
- `lib/actions/health.ts` → `getStrengthMetrics()`
- `lib/actions/health.ts` → `detectPRs()`

### SQL Ejecutado:
- ✅ `TITAN_PPL_FINAL.sql` (rutinas)
- ✅ `fix_routines_rls.sql` (permisos)
- ✅ `PERFORMANCE_INDEXES.sql` (velocidad)
- ⏳ `CREATE_CUBITT_TABLES.sql` (opcional, si quiere Cubitt)

---

## 🔧 CONFIGURACIÓN ACTUAL

### Base de Datos (Supabase):
- Tablas principales: `health_exercises`, `health_routines`, `health_routine_exercises`, `health_workout_sessions`, `health_sets`
- Tablas opcionales: `health_stats`, `metabolic_profiles` (si ejecutó CREATE_CUBITT_TABLES.sql)
- RLS habilitado en todas las tablas
- Índices creados para performance

### Deployment:
- GitHub: https://github.com/NuzzoJP/TITAN-OS-2.0.git
- Vercel: https://titan-os-2-0-x6if.vercel.app/
- Auto-deploy en cada push a main

### Tecnologías:
- Next.js 14 (App Router)
- TypeScript
- Supabase (PostgreSQL + Auth)
- React Query (caching)
- shadcn/ui (componentes)
- Tailwind CSS
- Recharts (gráficas)

---

## 👤 PERFIL DEL USUARIO

- **Tipo de cuerpo**: Ectomorfo
- **Objetivo**: Clean Bulk (ganar músculo sin mucha grasa)
- **Rutina**: PPL Jeff Nippard (6 días/semana)
- **Prioridades**:
  1. Tracking de fuerza (pesos, 1RM, PRs)
  2. Tracking de nutrición (calorías, macros)
  3. Tracking de composición corporal (Cubitt)
  4. App rápida y funcional en móvil

---

## 🚨 PROBLEMAS REPORTADOS POR EL USUARIO

1. "Muchos botones que no hacen nada"
2. "No sé dónde configurar mi perfil (altura, edad, etc.)"
3. "El escaneo de Cubitt redirige en lugar de abrir modal"
4. "No veo mis métricas de fuerza (pesos levantados, PRs)"
5. "No veo si cumplí mi objetivo de calorías del día"
6. "La app está lenta" (YA RESUELTO con React Query + índices)
7. "Hay entrenamientos de prueba que quiero eliminar"

---

## 📋 DOCUMENTOS DE REFERENCIA

- `ESPECIFICACION_COMPLETA_HEALTH.md` - Especificación detallada de TODO lo que debe tener
- `LISTA_COMPLETA_PENDIENTES.md` - Lista de pendientes por fase
- `RESUMEN_CONTEXTO_FINAL.md` - Resumen del estado actual
- `GUIA_CUBITT.md` - Guía de configuración de Cubitt
- `PASOS_FINALES.md` - Pasos para activar el sistema

---

## 🎯 INSTRUCCIONES PARA EL SIGUIENTE AGENTE

1. **PRIORIDAD 1**: Implementar perfil metabólico + dashboard nutricional
   - Crear modal de configuración
   - Implementar lógica de cálculo
   - Mostrar progreso diario con circular progress
   - Integrar con escaneo de comidas

2. **PRIORIDAD 2**: Métricas de fuerza
   - Calcular 1RM automáticamente
   - Mostrar progreso por ejercicio
   - Detectar PRs
   - Crear historial de entrenamientos

3. **PRIORIDAD 3**: Integración Cubitt
   - Corregir botón para abrir modal
   - Integrar peso con recálculo de macros
   - Agregar ingreso manual

4. **PRIORIDAD 4**: Pulido
   - Eliminar datos de prueba desde UI
   - Agregar loading states
   - Agregar mensajes de error
   - Testing en móvil

---

## 💡 NOTAS IMPORTANTES

- El usuario quiere TODO personalizable (altura, peso, edad, género, actividad, objetivo)
- El usuario quiere ver progreso REAL (no ejemplos hardcodeados)
- El usuario usa la app principalmente en móvil
- El usuario es técnico y nota cuando algo no funciona
- El usuario valora la velocidad y la funcionalidad sobre el diseño

---

## 🚀 COMANDO PARA CONTINUAR

```bash
cd titan-os
git pull origin main
# Implementar FASE 1 completa
git add .
git commit -m "feat: Complete metabolic profile + nutrition dashboard"
git push origin main
```

---

**CONTEXTO TRANSFERIDO. LISTO PARA CONTINUAR.** 🎯
