# 🚨 LISTA COMPLETA DE PENDIENTES - TITAN OS

## ❌ PROBLEMAS CRÍTICOS ACTUALES

### 1. **SISTEMA DE NUTRICIÓN - INCOMPLETO**
- ❌ No hay interfaz para configurar perfil metabólico
- ❌ No se calculan calorías/macros automáticamente
- ❌ No se muestra progreso diario (cuánto llevas vs objetivo)
- ❌ El escaneo de comida funciona pero no se integra con objetivos
- ❌ No hay dashboard que muestre: "Llevas 1,200/3,500 kcal"

### 2. **SISTEMA DE CUBITT - INCOMPLETO**
- ❌ El botón "Escanear Cubitt" redirige en lugar de abrir modal
- ❌ No hay forma de ingresar datos manualmente
- ❌ No se recalculan macros cuando cambias de peso
- ❌ Las gráficas no funcionan si no hay datos

### 3. **SISTEMA DE GYM - FUNCIONAL PERO...**
- ✅ Rutinas funcionan
- ✅ Active Workout funciona
- ✅ Rest Timer funciona
- ⚠️ Pero no hay forma de eliminar entrenamientos de prueba desde la UI
- ⚠️ No hay historial de entrenamientos con filtros

### 4. **PROBLEMAS DE UX**
- ❌ Muchos botones que no hacen nada
- ❌ Modales que no se abren
- ❌ Redirecciones que no llevan a ningún lado
- ❌ No hay mensajes de error claros
- ❌ No hay loading states en muchos lugares

---

## 📋 LO QUE NECESITAS IMPLEMENTAR COMPLETO

### A) PERFIL METABÓLICO (CRÍTICO)

#### Componente: `metabolic-profile-modal.tsx`
```typescript
// Formulario con:
- Input: Altura (cm) - número
- Input: Edad (años) - número
- Select: Género (Masculino/Femenino)
- Select: Nivel de Actividad:
  * Sedentario (poco ejercicio)
  * Ligero (1-3 días/semana)
  * Moderado (3-5 días/semana)
  * Activo (6-7 días/semana)
  * Muy Activo (atleta/trabajo físico)
- Select: Objetivo:
  * Cut (perder grasa) - Déficit 500 kcal
  * Maintain (mantener) - TDEE exacto
  * Bulk (ganar músculo) - Superávit 300 kcal
- Botón: "Calcular y Guardar"

// Al guardar:
1. Calcular BMR con fórmula Mifflin-St Jeor
2. Calcular TDEE = BMR × multiplicador de actividad
3. Calcular calorías objetivo según goal
4. Calcular macros (proteína, carbos, grasas)
5. Guardar en metabolic_profiles
6. Mostrar resultados en un card
```

#### Server Action: `calculateMetabolics()`
```typescript
export async function calculateMetabolics(data: {
  weight_kg: number;
  height_cm: number;
  age: number;
  gender: 'male' | 'female';
  activity_level: string;
  goal: 'cut' | 'maintain' | 'bulk';
}) {
  // 1. BMR (Mifflin-St Jeor)
  const bmr = gender === 'male'
    ? (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
    : (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161;
  
  // 2. TDEE
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const tdee = bmr * multipliers[activity_level];
  
  // 3. Target Calories
  const adjustments = { cut: -500, maintain: 0, bulk: 300 };
  const target_calories = tdee + adjustments[goal];
  
  // 4. Macros
  const protein_g = goal === 'cut' ? weight_kg * 2.2 : weight_kg * 2.0;
  const fat_g = weight_kg * 1.0;
  const protein_kcal = protein_g * 4;
  const fat_kcal = fat_g * 9;
  const carbs_g = (target_calories - protein_kcal - fat_kcal) / 4;
  
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target_calories: Math.round(target_calories),
    target_protein_g: Math.round(protein_g),
    target_carbs_g: Math.round(carbs_g),
    target_fat_g: Math.round(fat_g),
  };
}
```

### B) DASHBOARD DE NUTRICIÓN (CRÍTICO)

#### Componente: `nutrition-dashboard.tsx` (REHACER)
```typescript
// Debe mostrar:

1. Card de Perfil (si existe):
   - Objetivo: Bulk (+300 kcal)
   - TDEE: 3,208 kcal
   - Target: 3,508 kcal/día
   - Botón: "Editar Perfil"

2. Progreso del Día (circular progress):
   - Calorías: 1,200 / 3,508 (34%)
   - Proteína: 80g / 140g (57%)
   - Carbos: 150g / 579g (26%)
   - Grasas: 25g / 70g (36%)

3. Botón Grande: "Escanear Comida" (abre modal)

4. Lista de Comidas del Día:
   - Desayuno: Avena con plátano - 450 kcal
   - Almuerzo: Pollo con arroz - 750 kcal
   - Botón: "Editar" / "Eliminar"

5. Gráfica Semanal:
   - Calorías por día (últimos 7 días)
   - Línea de objetivo

// Si NO hay perfil:
- Mostrar empty state
- Botón: "Configurar Perfil Metabólico"
```

### C) INTEGRACIÓN CUBITT → PERFIL

#### Cuando escaneas Cubitt:
```typescript
1. Extraer peso de la imagen
2. Buscar perfil metabólico del usuario
3. Si existe perfil:
   - Actualizar current_weight_kg
   - Recalcular BMR, TDEE, macros
   - Guardar en health_stats
   - Mostrar notificación: "Perfil actualizado con nuevo peso"
4. Si NO existe perfil:
   - Guardar solo en health_stats
   - Mostrar mensaje: "Configura tu perfil para calcular macros"
```

### D) HISTORIAL DE ENTRENAMIENTOS

#### Componente: `workout-history.tsx`
```typescript
// Debe mostrar:
1. Lista de sesiones con:
   - Fecha
   - Rutina (ej: "Push A")
   - Duración
   - Total de sets
   - Botón: "Ver Detalles" / "Eliminar"

2. Filtros:
   - Por fecha (últimos 7/30/90 días)
   - Por rutina (Push/Pull/Legs)

3. Detalles de sesión (expandible):
   - Lista de ejercicios con sets
   - Peso × Reps × RPE
   - 1RM estimado
```

### E) ELIMINAR DATOS DE PRUEBA

#### Componente: `settings-modal.tsx`
```typescript
// Sección: "Datos de Prueba"
- Botón: "Eliminar Entrenamientos de Prueba"
  * Confirmar con modal
  * Ejecutar DELETE FROM health_sets WHERE ...
  * Ejecutar DELETE FROM health_workout_sessions WHERE ...
  
- Botón: "Eliminar Logs de Nutrición de Prueba"
  * Similar al anterior
  
- Botón: "Resetear Perfil Metabólico"
  * Eliminar y volver a configurar
```

---

## 🎯 PRIORIDADES (EN ORDEN)

### FASE 1: NUTRICIÓN BÁSICA (HOY)
1. ✅ Crear `metabolic-profile-modal.tsx`
2. ✅ Implementar `calculateMetabolics()` en `nutrition.ts`
3. ✅ Rehacer `nutrition-dashboard.tsx` con progreso diario
4. ✅ Integrar modal de perfil con dashboard
5. ✅ Commit y push

### FASE 2: INTEGRACIÓN CUBITT (HOY)
1. ✅ Corregir botón "Escanear Cubitt" para abrir modal
2. ✅ Integrar peso de Cubitt con recálculo de macros
3. ✅ Agregar opción de ingreso manual
4. ✅ Commit y push

### FASE 3: HISTORIAL Y LIMPIEZA (MAÑANA)
1. ✅ Crear `workout-history.tsx`
2. ✅ Crear `settings-modal.tsx` con opciones de limpieza
3. ✅ Agregar filtros y búsqueda
4. ✅ Commit y push

### FASE 4: PULIDO FINAL (MAÑANA)
1. ✅ Agregar loading states faltantes
2. ✅ Agregar mensajes de error claros
3. ✅ Verificar que todos los botones funcionen
4. ✅ Testing completo en móvil
5. ✅ Commit y push

---

## 📝 NOTAS IMPORTANTES

- **TODO debe ser personalizable**: Altura, peso, edad, género, actividad, objetivo
- **TODO debe recalcularse automáticamente**: Si cambias peso, se recalculan macros
- **TODO debe tener feedback visual**: Loading, success, error
- **TODO debe funcionar en móvil**: Botones grandes, inputs táctiles
- **NO más huecos**: Si un botón existe, debe funcionar

---

## 🚀 PLAN DE ACCIÓN INMEDIATO

**Voy a implementar FASE 1 completa ahora:**
1. Modal de perfil metabólico
2. Lógica de cálculo
3. Dashboard de nutrición completo
4. Integración total

**¿Procedo con esto?** 

Esto tomará ~30 minutos pero quedará 100% funcional y sin huecos.
