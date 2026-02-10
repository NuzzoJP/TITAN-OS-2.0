# 🏋️ Sistema de Entrenamiento con Rutinas - LISTO PARA USAR

## ✅ CAMBIOS IMPLEMENTADOS

### 1. **Componente Active Workout** (NUEVO)
- **Archivo**: `components/health/active-workout.tsx`
- **Funcionalidad**:
  - Muestra ejercicios de la rutina uno por uno
  - Permite registrar peso, reps y RPE por set
  - Activa automáticamente el **Rest Timer** después de cada set
  - Muestra notas técnicas de Jeff Nippard (Tempo, RIR, cues)
  - Progreso visual del entrenamiento
  - Guarda cada set en la base de datos en tiempo real

### 2. **Integración con Gym Dashboard**
- **Archivo**: `components/health/gym-dashboard.tsx`
- **Cambios**:
  - Detecta parámetros de URL para workout activo
  - Muestra `ActiveWorkout` cuando hay sesión en curso
  - Permite cancelar o finalizar entrenamiento

### 3. **Mejoras en Routines Manager**
- **Archivo**: `components/health/routines-manager.tsx`
- **Cambios**:
  - Botón "Iniciar" ahora funciona correctamente
  - Redirige a Gym Dashboard con parámetros de sesión

### 4. **Corrección en Server Actions**
- **Archivo**: `lib/actions/routines.ts`
- **Cambios**:
  - `startWorkoutFromRoutine()` ahora retorna `sessionId`, `routineId`, `routineName`
  - Usa campo `date` correcto (no `start_time`)
  - Mejor manejo de errores

### 5. **Rest Timer Overlay**
- **Archivo**: `components/health/rest-timer-overlay.tsx` (YA EXISTÍA)
- **Integración**: Ahora se activa automáticamente después de cada set
- **Características**:
  - Pantalla completa con círculo de progreso
  - Ajuste de tiempo (+15s / -15s)
  - Pausar/Reanudar
  - Saltar descanso
  - Notificaciones y vibración al terminar

---

## 📋 PASOS PARA ACTIVAR EL SISTEMA

### PASO 1: Ejecutar SQL en Supabase

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Abre el **SQL Editor**
3. Ejecuta estos 2 archivos EN ORDEN:

#### A) Primero: `TITAN_PPL_DEFINITIVE.sql`
```sql
-- Este archivo contiene:
-- ✅ 19 ejercicios de Jeff Nippard con notas técnicas
-- ✅ 6 rutinas PPL A/B (Push A, Pull A, Legs A, Push B, Pull B, Legs B)
-- ✅ Ejercicios asignados a cada rutina con sets, reps, descansos
```

#### B) Segundo: `fix_routines_rls.sql`
```sql
-- Este archivo contiene:
-- ✅ Políticas RLS para health_routines
-- ✅ Políticas RLS para health_routine_exercises
-- ✅ Permisos correctos para templates y rutinas de usuario
```

### PASO 2: Commit y Push a GitHub

```bash
cd titan-os
git add .
git commit -m "feat: Active Workout system with Rest Timer integration"
git push origin main
```

### PASO 3: Vercel Auto-Deploy
- Vercel detectará el push automáticamente
- Espera 2-3 minutos para el deploy
- Verifica en: https://vercel.com/tu-proyecto

---

## 🎯 CÓMO USAR EL SISTEMA

### 1. **Ver Rutinas PPL**
- Ve a **Health** → Tab **"Rutinas"**
- Verás las 6 rutinas de Jeff Nippard:
  - 🔴 **Push A** (Fuerza) - Bench Press, OHP, Skullcrushers, Egyptian Laterals
  - 🔵 **Pull A** (Anchura) - Pull-Ups, Meadows Row, Face Pulls, Barbell Curl
  - 🟢 **Legs A** (Squat/RDL) - Back Squat, RDL, Standing Calf Raise
  - 🔴 **Push B** (Hipertrofia) - Incline DB Press, Weighted Dips, Cable Crossover, Overhead Tricep Ext
  - 🔵 **Pull B** (Densidad) - Omni-Grip Lat Pulldown, Chest-Supported Row, Bayesian Curl, Rear Delt Fly
  - 🟢 **Legs B** (Máquinas) - Hack Squat, Seated Leg Curl, Bulgarian Split Squat

### 2. **Clonar Rutina (Opcional)**
- Click en botón **"Copiar"** (icono Copy)
- Esto crea una copia editable en "Mis Rutinas"
- Puedes modificar ejercicios, sets, reps, descansos

### 3. **Iniciar Entrenamiento**
- Click en botón **"Iniciar"** (icono Play)
- Se crea una sesión en la base de datos
- Redirige automáticamente a **Gym Tracker** con workout activo

### 4. **Durante el Entrenamiento**
- **Ejercicio actual** se muestra con:
  - Nombre y grupo muscular
  - Sets objetivo (ej: 4 sets)
  - Reps objetivo (ej: 6-8 reps)
  - RPE objetivo (ej: RPE 8)
  - Tiempo de descanso (ej: 180s)
  - **Notas técnicas de Jeff Nippard** (Tempo, RIR, cues de ejecución)

- **Registrar Set**:
  1. Ingresa **Peso** (kg)
  2. Ingresa **Reps** realizadas
  3. Ingresa **RPE** (opcional, 1-10)
  4. Click **"Completar Set"**

- **Rest Timer**:
  - Se activa automáticamente después de cada set
  - Pantalla completa con círculo de progreso
  - Ajusta tiempo con botones +15s / -15s
  - Pausa/Reanuda con botón central
  - Salta descanso si estás listo antes

- **Sets Completados**:
  - Se muestran arriba con check verde
  - Historial de peso × reps × RPE

### 5. **Finalizar Entrenamiento**
- Después del último set del último ejercicio
- Click **"Finalizar Entrenamiento"**
- Se guarda la sesión completa
- Vuelve al dashboard principal

### 6. **Cancelar Entrenamiento**
- Click botón **"Cancelar"** (arriba derecha)
- Confirma la cancelación
- Los sets ya guardados permanecen en la base de datos

---

## 🔍 VERIFICACIÓN DEL SISTEMA

### Checklist de Funcionalidad

- [ ] **SQL Ejecutado**: Rutinas y ejercicios visibles en Supabase
- [ ] **Deploy Exitoso**: Sin errores en Vercel
- [ ] **Ver Rutinas**: Tab "Rutinas" muestra 6 rutinas PPL
- [ ] **Botón Iniciar**: Click en "Iniciar" redirige a workout
- [ ] **Active Workout**: Muestra ejercicio actual con inputs
- [ ] **Registrar Set**: Guarda peso/reps/RPE correctamente
- [ ] **Rest Timer**: Se activa automáticamente después de set
- [ ] **Progreso**: Avanza al siguiente ejercicio después de último set
- [ ] **Finalizar**: Completa workout y vuelve al dashboard
- [ ] **Historial**: Sesión aparece en "Entrenamientos Recientes"

---

## 🐛 TROUBLESHOOTING

### Problema: "Botón Iniciar no hace nada"
**Solución**:
1. Abre DevTools (F12) → Console
2. Busca errores en rojo
3. Verifica que ejecutaste `TITAN_PPL_DEFINITIVE.sql`
4. Verifica que ejecutaste `fix_routines_rls.sql`

### Problema: "No se guardan los sets"
**Solución**:
1. Verifica que la tabla `health_sets` existe en Supabase
2. Verifica que el campo `user_id` existe en `health_workout_sessions`
3. Ejecuta `fix_user_id_simple.sql` si es necesario

### Problema: "Rest Timer no aparece"
**Solución**:
1. Verifica que completaste un set (no el primero)
2. El timer solo aparece DESPUÉS de completar un set
3. Revisa Console para errores de JavaScript

### Problema: "No veo las rutinas PPL"
**Solución**:
1. Verifica en Supabase → Table Editor → `health_routines`
2. Debe haber 6 filas con `is_template = true`
3. Si no existen, ejecuta `TITAN_PPL_DEFINITIVE.sql` de nuevo

---

## 📊 ESTRUCTURA DE DATOS

### Flujo de Datos:
```
1. Usuario click "Iniciar" en Rutina
   ↓
2. startWorkoutFromRoutine() crea sesión en health_workout_sessions
   ↓
3. Redirige a /dashboard/health?sessionId=X&routineId=Y&routineName=Z
   ↓
4. GymDashboard detecta params y muestra ActiveWorkout
   ↓
5. ActiveWorkout carga ejercicios de health_routine_exercises
   ↓
6. Usuario completa set → createSet() guarda en health_sets
   ↓
7. Rest Timer se activa automáticamente
   ↓
8. Repite hasta último ejercicio
   ↓
9. Finalizar → Vuelve a dashboard
```

### Tablas Involucradas:
- `health_routines` - Rutinas (templates y personalizadas)
- `health_routine_exercises` - Ejercicios de cada rutina
- `health_exercises` - Biblioteca de ejercicios
- `health_workout_sessions` - Sesiones de entrenamiento
- `health_sets` - Sets individuales registrados

---

## 🎉 PRÓXIMOS PASOS

Una vez que el sistema funcione:

1. **Probar una rutina completa** (ej: Push A)
2. **Verificar que el Rest Timer funciona** correctamente
3. **Revisar historial** en "Entrenamientos Recientes"
4. **Clonar y personalizar** una rutina
5. **Agregar más ejercicios** si es necesario

---

## 📝 NOTAS TÉCNICAS

### Características Implementadas:
- ✅ Rutinas PPL de Jeff Nippard (6 rutinas, 19 ejercicios)
- ✅ Active Workout con progreso visual
- ✅ Rest Timer automático con pantalla completa
- ✅ Registro de sets en tiempo real
- ✅ Notas técnicas (Tempo, RIR, cues)
- ✅ Historial de entrenamientos
- ✅ Clonar y editar rutinas
- ✅ RLS policies para seguridad

### Tecnologías:
- Next.js 14 App Router
- TypeScript
- Supabase (PostgreSQL + Auth + RLS)
- shadcn/ui components
- Tailwind CSS

---

**¿Listo para entrenar? 💪**

Ejecuta el SQL, haz push a GitHub, y empieza tu primer workout con el sistema completo de Jeff Nippard.
