# 🎯 PASOS FINALES PARA ACTIVAR EL SISTEMA

## ✅ LO QUE YA ESTÁ HECHO

1. ✅ **Código subido a GitHub** - Vercel está desplegando automáticamente
2. ✅ **UI optimizada para móvil** - Botones grandes, inputs táctiles
3. ✅ **SQL FINAL creado** - Con TODAS las rutinas que especificaste
4. ✅ **Legs A actualizado** - Con Smith Machine Squat y Back Extension

---

## 📋 PASO 1: ELIMINAR ENTRENAMIENTOS DE PRUEBA

Ve a Supabase SQL Editor y ejecuta:

```sql
-- Ver sesiones actuales
SELECT id, date, notes, created_at
FROM health_workout_sessions
ORDER BY created_at DESC;

-- Eliminar TODAS las sesiones de prueba
DELETE FROM health_sets;
DELETE FROM health_workout_sessions;

-- Verificar que se eliminaron
SELECT COUNT(*) FROM health_workout_sessions;
```

---

## 📋 PASO 2: EJECUTAR SQL FINAL

En Supabase SQL Editor, ejecuta **`TITAN_PPL_FINAL.sql`**:

Este archivo contiene:
- ✅ 19 ejercicios con notas técnicas completas
- ✅ 6 rutinas PPL A/B
- ✅ **Legs A actualizado** con Smith Machine Squat y Back Extension
- ✅ Push A: 4 ejercicios
- ✅ Pull A: 4 ejercicios
- ✅ Legs A: 3 ejercicios (MÁQUINAS/SEGURO)
- ✅ Push B: 4 ejercicios
- ✅ Pull B: 4 ejercicios
- ✅ Legs B: 3 ejercicios

---

## 📋 PASO 3: EJECUTAR RLS POLICIES

Ejecuta **`fix_routines_rls.sql`** para configurar permisos.

---

## 📋 PASO 4: VERIFICAR EN LA APP

1. Abre tu app en el móvil: https://titan-os-2-0-x6if.vercel.app/
2. Ve a **Health** → Tab **"Rutinas"**
3. Deberías ver las 6 rutinas PPL
4. Click en **"Iniciar Entrenamiento"** (botón grande verde)
5. Deberías ver el workout activo con inputs grandes para móvil

---

## 🎨 MEJORAS PARA MÓVIL IMPLEMENTADAS

### Active Workout:
- ✅ **Inputs grandes**: 64px de altura, texto 2xl, centrado
- ✅ **Botón principal**: 64px de altura, texto grande, icono visible
- ✅ **inputMode**: "numeric" y "decimal" para teclado numérico en móvil
- ✅ **Texto en negrita**: Mejor legibilidad

### Routines Manager:
- ✅ **Botón "Iniciar"**: 56px de altura, ancho completo, texto grande
- ✅ **Botones secundarios**: Grid de 3 columnas, 48px de altura
- ✅ **Mejor espaciado**: Gap de 8px entre elementos

### Rest Timer:
- ✅ Ya estaba optimizado para pantalla completa
- ✅ Círculo de progreso grande
- ✅ Botones táctiles grandes

---

## 📱 RUTINAS FINALES

### LEGS A - Máquinas & Seguridad (3 ejercicios)
1. **Smith Machine Squat** - 4 sets × 5-8 reps (300s descanso)
   - "Pies adelantados. Profundidad máxima. Usa seguros."
2. **Weighted 45° Back Extension** - 4 sets × 8-12 reps (180s)
   - "Abraza disco. Empuja cadera contra cojín. Siente femorales."
3. **Standing Calf Raise** - 4 sets × 12-20 reps (60s)
   - "Pausa 2s abajo. Myo-reps al final."

### PUSH A - Fuerza & Tensión (4 ejercicios)
1. Barbell Bench Press - 4×5-8 (240s)
2. Standing Overhead Press - 4×6-10 (180s)
3. Skullcrushers (EZ Bar) - 3×8-12 (90s)
4. Egyptian Lateral Raise - 3×12-15 (60s)

### PULL A - Anchura & Fuerza (4 ejercicios)
1. Weighted Pull-Up - 4×5-10 (240s)
2. Meadows Row - 4×6-10 (180s)
3. Face Pulls - 3×15-20 (60s)
4. Barbell Curl - 3×8-12 (90s)

### PUSH B - Hipertrofia & Stretch (4 ejercicios)
1. Incline Dumbbell Press - 4×8-12 (180s)
2. Weighted Dips - 3×6-10 (180s)
3. Cable Crossover - 3×12-15 (90s)
4. Overhead Cable Tricep Extension - 3×10-15 (90s)

### PULL B - Densidad & Detalles (4 ejercicios)
1. Omni-Grip Lat Pulldown - 4×8-12 (120s)
2. Chest-Supported Row - 4×10-15 (120s)
3. Bayesian Curl - 3×10-15 (90s)
4. Rear Delt Fly - 3×15-20 (60s)

### LEGS B - Máquinas & Unilateral (3 ejercicios)
1. Hack Squat - 4×8-12 (180s)
2. Seated Leg Curl - 4×10-15 (90s)
3. Bulgarian Split Squat - 3×10-15 (120s)

---

## 🔍 VERIFICACIÓN

- [ ] SQL ejecutado en Supabase
- [ ] Entrenamientos de prueba eliminados
- [ ] Vercel desplegado (sin errores)
- [ ] 6 rutinas visibles en la app
- [ ] Botón "Iniciar Entrenamiento" funciona
- [ ] Inputs grandes y legibles en móvil
- [ ] Rest Timer se activa después de cada set
- [ ] Legs A tiene 3 ejercicios (Smith, Back Ext, Calf)

---

## 📞 SI ALGO NO FUNCIONA

1. **Botón "Iniciar" no hace nada**: Verifica que ejecutaste el SQL
2. **No veo las rutinas**: Ejecuta `TITAN_PPL_FINAL.sql` de nuevo
3. **Legs A tiene ejercicios viejos**: Ejecuta `TITAN_PPL_FINAL.sql` (hace TRUNCATE)
4. **Inputs pequeños en móvil**: Espera a que Vercel termine el deploy

---

**¡Todo listo para entrenar! 💪**

El sistema está optimizado para móvil y tiene todas las rutinas que especificaste.
