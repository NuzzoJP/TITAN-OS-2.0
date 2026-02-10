# 🏋️ Jeff Nippard Science-Based PPL - Setup Guide

## 📋 Resumen

Este es el protocolo **EXACTO** de Jeff Nippard para PPL (Push/Pull/Legs) con split A/B, optimizado para ectomorfos (hardgainers).

---

## ✅ Lo que Incluye

### 6 Rutinas Completas:
1. **Push A** - Fuerza Bruta & Hombros (Bench Press + OHP)
2. **Pull A** - Anchura & Cargas Pesadas (Pull-ups + Pendlay Row)
3. **Legs A** - Sentadilla & Cadena Posterior (Squat + RDL)
4. **Push B** - Hipertrofia & Estiramiento (Incline DB + Dips)
5. **Pull B** - Densidad & Detalles (Omni-Grip + Bayesian Curl)
6. **Legs B** - Máquinas & Unilateral (Hack Squat + Bulgarian)

### 19 Ejercicios con Justificación Científica:
- Todos marcados como **S+ Tier** o **Jeff Favorite**
- Notas de ejecución específicas
- Rangos de reps optimizados
- Tiempos de descanso por tipo de ejercicio

---

## 🚀 Instalación (3 Pasos)

### Paso 1: Ejecutar SQL de Ejercicios

En Supabase SQL Editor, ejecuta:

```sql
-- Archivo: jeff_nippard_ppl_exact.sql
```

Esto:
- ✅ Limpia la tabla `health_exercises`
- ✅ Inserta los 19 ejercicios exactos de Jeff
- ✅ Incluye metadata completa (músculos, rangos, notas)

**⚠️ ADVERTENCIA**: Esto BORRA los ejercicios existentes. Si tienes ejercicios personalizados, guárdalos antes.

### Paso 2: Ejecutar SQL de Rutinas

En Supabase SQL Editor, ejecuta:

```sql
-- Archivo: jeff_nippard_routines_updated.sql
```

Esto:
- ✅ Elimina rutinas template antiguas
- ✅ Crea las 6 rutinas PPL A/B
- ✅ Asigna ejercicios con sets/reps/RPE correctos

### Paso 3: Verificar en la App

1. Ve a Health → Rutinas
2. Deberías ver las 6 rutinas template
3. Clona la que quieras usar
4. Personaliza si es necesario

---

## 📊 Detalles de las Rutinas

### PUSH A (Fuerza Bruta & Hombros)
| Ejercicio | Sets | Reps | RPE | Descanso | Nota |
|-----------|------|------|-----|----------|------|
| Barbell Bench Press | 4 | 5-8 | 9.0 | 4:00 | S+ Tier. Carga máxima |
| Standing OHP | 4 | 6-10 | 8.5 | 3:00 | Jeff Fav. Core apretado |
| Skullcrushers | 3 | 8-12 | 8.0 | 1:30 | Cabeza larga tríceps |
| Egyptian Lateral Raise | 3 | 12-15 | 8.5 | 1:00 | Tensión constante |

**Duración**: ~75 min

### PULL A (Anchura & Cargas Pesadas)
| Ejercicio | Sets | Reps | RPE | Descanso | Nota |
|-----------|------|------|-----|----------|------|
| Weighted Pull-Up | 4 | 5-10 | 9.0 | 4:00 | S+ Tier. Rey de espalda |
| Pendlay Row | 4 | 6-10 | 8.5 | 3:00 | S Tier. Explosivo |
| Barbell Curl | 3 | 8-12 | 8.0 | 1:30 | Sin balanceo |
| Face Pulls | 3 | 15-20 | 7.5 | 1:00 | Salud de hombros |

**Duración**: ~75 min

### LEGS A (Sentadilla & Cadena Posterior)
| Ejercicio | Sets | Reps | RPE | Descanso | Nota |
|-----------|------|------|-----|----------|------|
| Barbell Back Squat | 4 | 5-8 | 9.0 | 5:00 | S+ Tier. Gatillo hormonal |
| Romanian Deadlift | 4 | 8-12 | 8.5 | 3:00 | Jeff Fav. Isquios |
| Standing Calf Raise | 4 | 12-20 | 8.5 | 1:00 | Rango completo |

**Duración**: ~80 min

### PUSH B (Hipertrofia & Estiramiento)
| Ejercicio | Sets | Reps | RPE | Descanso | Nota |
|-----------|------|------|-----|----------|------|
| Incline DB Press | 4 | 8-12 | 8.5 | 3:00 | S Tier. Pecho superior |
| Weighted Dips | 3 | 6-10 | 8.5 | 3:00 | S Tier. Sentadilla tren superior |
| Cable Crossover | 3 | 12-15 | 8.0 | 1:30 | Squeeze final |
| Overhead Cable Tricep Ext | 3 | 10-15 | 8.0 | 1:30 | Jeff Fav. Stretch máximo |

**Duración**: ~75 min

### PULL B (Densidad & Detalles)
| Ejercicio | Sets | Reps | RPE | Descanso | Nota |
|-----------|------|------|-----|----------|------|
| Omni-Grip Lat Pulldown | 4 | 8-12 | 8.0 | 2:00 | Jeff Fav. Variar agarres |
| Chest-Supported Row | 4 | 10-15 | 8.5 | 2:00 | S Tier. Sin inercia |
| Bayesian Curl | 3 | 10-15 | 8.0 | 1:30 | Jeff Fav. Stretch máximo |
| Rear Delt Fly | 3 | 12-15 | 8.0 | 1:00 | Control excéntrica |

**Duración**: ~75 min

### LEGS B (Máquinas & Unilateral)
| Ejercicio | Sets | Reps | RPE | Descanso | Nota |
|-----------|------|------|-----|----------|------|
| Hack Squat | 4 | 8-12 | 8.5 | 3:00 | S Tier. Sin fatiga lumbar |
| Seated Leg Curl | 4 | 10-15 | 8.5 | 1:30 | Jeff Fav. Superior al tumbado |
| Bulgarian Split Squat | 3 | 10-15 | 8.0 | 2:00 | Corrección asimetrías |

**Duración**: ~80 min

---

## 📅 Split Recomendado

### Opción 1: 6 días/semana (PPL × 2)
- Lunes: Push A
- Martes: Pull A
- Miércoles: Legs A
- Jueves: Push B
- Viernes: Pull B
- Sábado: Legs B
- Domingo: Descanso

### Opción 2: 5 días/semana (flexible)
- Día 1: Push A
- Día 2: Pull A
- Día 3: Descanso
- Día 4: Legs A
- Día 5: Push B
- Día 6: Descanso
- Día 7: Pull B
- (Legs B siguiente semana)

---

## 🎯 Principios Clave (Jeff Nippard)

### 1. RPE (Rate of Perceived Exertion)
- **RPE 9**: 1 rep en reserva (RIR 1)
- **RPE 8.5**: 1-2 reps en reserva
- **RPE 8**: 2 reps en reserva
- **RPE 7.5**: 2-3 reps en reserva

**Recomendación**: Entrenar entre RPE 8-9 para hipertrofia.

### 2. Progresión
- **Semanas 1-3**: Aumentar peso o reps cada sesión
- **Semana 4**: Deload (reducir volumen 50%)
- **Repetir ciclo**

### 3. Volumen Óptimo (Sets/Semana)
- Pecho: 12-20 sets
- Espalda: 14-22 sets
- Piernas: 14-24 sets
- Hombros: 12-18 sets
- Brazos: 12-18 sets

### 4. Frecuencia
- Cada músculo 2x por semana (A + B)
- Mínimo 48h entre sesiones del mismo músculo

---

## 💡 Tips para Ectomorfos

### Nutrición:
- **Superávit calórico**: +300-500 kcal/día
- **Proteína**: 2g por kg de peso corporal
- **Carbohidratos**: Altos (5-7g por kg)
- **Grasas**: Moderadas (1g por kg)

### Entrenamiento:
- **Enfoque en compounds**: Bench, Squat, Deadlift, OHP
- **Volumen moderado**: No exceder 20 sets por músculo/semana
- **Descanso adecuado**: 7-9 horas de sueño
- **Deload cada 4-6 semanas**: Prevenir sobreentrenamiento

### Suplementos (Opcionales):
- Creatina monohidrato (5g/día)
- Proteína en polvo (si no alcanzas con comida)
- Cafeína pre-workout (200-400mg)

---

## 🔧 Personalización

Después de clonar una rutina, puedes:
1. **Cambiar ejercicios**: Si no tienes equipo o prefieres variantes
2. **Ajustar sets/reps**: Según tu nivel
3. **Modificar RPE**: Más conservador al inicio
4. **Agregar ejercicios**: Si quieres más volumen
5. **Marcar superseries**: Para ahorrar tiempo

---

## 📈 Tracking

El sistema trackea automáticamente:
- ✅ Volumen semanal por músculo
- ✅ Frecuencia de entrenamiento
- ✅ Progreso de 1RM por ejercicio
- ✅ Comparación semana vs semana
- ✅ Predicción de objetivos

---

## 🎓 Referencias

- **Videos de Jeff Nippard**:
  - "The Best Science-Based Push Workout"
  - "The Best Science-Based Pull Workout"
  - "The Best Science-Based Leg Workout"
  - "My Full Year Training Program"

- **Principios**:
  - Volumen landmarks (Dr. Mike Israetel)
  - RPE-based training (Mike Tuchscherer)
  - Periodización lineal

---

## ⚠️ Notas Importantes

1. **Calentamiento**: Siempre calentar antes de compounds pesados
2. **Técnica primero**: No sacrificar forma por peso
3. **Escucha tu cuerpo**: Si duele (no arde), para
4. **Deload obligatorio**: Cada 4-6 semanas
5. **Nutrición es clave**: Sin superávit no hay ganancia

---

**Última actualización**: 10 de Febrero, 2026
**Basado en**: Jeff Nippard Science-Based PPL (2024-2025)
