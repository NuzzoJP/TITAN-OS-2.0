# Módulo Health - Titan OS

## 💪 Sistema de Entrenamiento Físico

### Características Implementadas

1. **Registro de Entrenamientos**
   - Crear sesiones con fecha y notas
   - Registrar múltiples series por sesión
   - Seleccionar ejercicio, peso, reps y RPE

2. **Ghost Mode 👻**
   - Muestra automáticamente el último registro del ejercicio
   - Placeholders con peso y reps anteriores
   - Indicador visual con datos históricos
   - Facilita el seguimiento de progreso

3. **Cálculo Automático de 1RM**
   - Fórmula Epley: `1RM = peso × (1 + reps/30)`
   - Calculado automáticamente por trigger en DB
   - Visible en cada set registrado

4. **Biblioteca de Ejercicios**
   - Catálogo personalizable
   - Organizado por grupo muscular
   - Agregar ejercicios personalizados

5. **Estadísticas y Progreso**
   - Total de entrenamientos
   - Sesiones del mes actual
   - Series totales completadas
   - Ejercicios únicos realizados
   - Top 5 ejercicios por volumen

6. **Historial de Sesiones**
   - Lista de entrenamientos recientes
   - Expandible para ver sets detallados
   - Fecha, notas y duración
   - 1RM calculado por set

## 🎯 Ghost Mode - Cómo Funciona

### Concepto
El "Ghost Mode" muestra automáticamente tus datos del último entrenamiento para ese ejercicio específico, facilitando el seguimiento de progreso.

### Implementación
1. Al seleccionar un ejercicio en el formulario
2. Se llama a la función RPC `get_previous_log(exercise_id)`
3. Se muestra un banner con los datos anteriores
4. Los inputs tienen placeholders con esos valores

### Ejemplo Visual
```
┌─────────────────────────────────────┐
│ 👻 Último: 80kg × 8 reps @ RPE 8   │
└─────────────────────────────────────┘
Peso (kg): [____] ← placeholder: 80
Reps:      [____] ← placeholder: 8
RPE:       [____] ← placeholder: 8
```

### Beneficios
- No necesitas recordar tu último peso
- Fácil identificar si progresaste
- Reduce errores de registro
- Motivación visual del progreso

## 📊 Cálculos Automáticos

### Fórmula Epley (1RM)
```
1RM = peso × (1 + reps / 30)

Ejemplos:
- 100kg × 1 rep  = 100kg (1RM)
- 80kg × 8 reps  = 101.3kg (1RM)
- 60kg × 12 reps = 84kg (1RM)
```

### Volumen Total
```
Volumen = Σ(peso × reps)

Ejemplo:
- Set 1: 80kg × 8 = 640kg
- Set 2: 80kg × 7 = 560kg
- Set 3: 80kg × 6 = 480kg
Total: 1,680kg de volumen
```

## 🎨 Componentes UI

### Página Principal (`page.tsx`)
- Dashboard con estadísticas
- Top ejercicios por volumen
- Historial de sesiones expandible
- Biblioteca de ejercicios

### Modal de Registro (`log-workout-modal.tsx`)
- Formulario multi-set
- Ghost Mode integrado
- Agregar/eliminar series dinámicamente
- Validación de datos

### Modal de Ejercicio (`add-exercise-modal.tsx`)
- Crear ejercicios personalizados
- Seleccionar grupo muscular

### Gráfica de Progreso (`progress-chart.tsx`)
- Visualización de 1RM en el tiempo
- Comparación de peso usado
- Usando Recharts

## 🔧 Server Actions

Todas las operaciones usan Server Actions (`lib/actions/health.ts`):

- `getExercises()`: Obtener biblioteca de ejercicios
- `getRecentSessions()`: Sesiones recientes
- `getSetsBySession()`: Sets de una sesión
- `getPreviousLog()`: Ghost Mode data (RPC)
- `createWorkoutSession()`: Crear sesión
- `createSet()`: Crear set
- `createExercise()`: Crear ejercicio
- `getProgressStats()`: Estadísticas generales
- `getExerciseProgress()`: Progreso de un ejercicio
- `getTopExercises()`: Top por volumen

## 💾 Base de Datos

### Tablas Utilizadas
- `health_exercises`: Catálogo de ejercicios
- `health_workout_sessions`: Sesiones de entrenamiento
- `health_sets`: Series individuales

### Triggers Automáticos
- ✅ Calcula 1RM automáticamente (Fórmula Epley)
- ✅ Timestamps automáticos

### Funciones RPC
- ✅ `get_previous_log(exercise_id)`: Retorna último registro

## 🎯 Flujo de Uso

### Primera Vez

1. **Agregar Ejercicios**
   ```
   Click "Nuevo Ejercicio" → Nombre + Grupo Muscular
   ```

2. **Registrar Entrenamiento**
   ```
   Click "Registrar Entrenamiento" → Fecha + Notas
   ```

3. **Agregar Series**
   ```
   Selecciona ejercicio → Ve Ghost Mode → Ingresa peso/reps
   ```

### Uso Diario

- **Ver Ghost Mode**: Selecciona ejercicio y aparece automáticamente
- **Seguir Progreso**: Compara con datos anteriores
- **Revisar Historial**: Expande sesiones para ver detalles
- **Analizar Top Ejercicios**: Identifica tus ejercicios más trabajados

## 📈 Ejemplos

### Ejemplo 1: Progreso Lineal
```
Semana 1: Press Banca 80kg × 8 reps (1RM: 101kg)
Semana 2: Press Banca 82.5kg × 8 reps (1RM: 104kg)
Semana 3: Press Banca 85kg × 8 reps (1RM: 107kg)
Progreso: +5kg en 3 semanas ✅
```

### Ejemplo 2: Ghost Mode en Acción
```
Último registro: 100kg × 5 reps @ RPE 9

Hoy quieres hacer:
- Opción 1: 102.5kg × 5 reps (progreso en peso)
- Opción 2: 100kg × 6 reps (progreso en reps)
- Opción 3: 100kg × 5 reps @ RPE 8 (mejor técnica)
```

### Ejemplo 3: Top Ejercicios
```
1. Sentadilla: 12,500kg (50 sets)
2. Press Banca: 8,400kg (40 sets)
3. Peso Muerto: 7,200kg (30 sets)
4. Press Militar: 4,800kg (35 sets)
5. Dominadas: 3,600kg (45 sets)
```

## 🎨 Diseño

### Ghost Mode Visual
- Banner azul con icono 👻
- Texto claro con último registro
- Placeholders en inputs
- No intrusivo

### Estadísticas
- Cards con iconos
- Números grandes y claros
- Colores diferenciados
- Responsive grid

### Historial
- Expandible con click
- Detalles de sets ocultos por defecto
- 1RM destacado en azul
- Formato de fecha en español

## 🔜 Mejoras Futuras

- Gráficas de progreso por ejercicio
- Comparación de volumen semanal
- Plantillas de rutinas
- Timer de descanso
- Fotos de progreso
- Integración con wearables
- Análisis de frecuencia de entrenamiento
- Predicción de 1RM futuro

## 🐛 Troubleshooting

### Ghost Mode no aparece
- Verifica que la función RPC esté creada en Supabase
- Asegúrate de tener al menos un registro previo del ejercicio

### 1RM no se calcula
- Verifica que el trigger esté activo en Supabase
- El 1RM solo se calcula para sets no marcados como warmup

### No hay ejercicios
- Los ejercicios iniciales se insertan con el schema.sql
- Puedes agregar más con "Nuevo Ejercicio"

---

**Estado**: ✅ Módulo Health 100% Funcional

**Características**: Ghost Mode, 1RM automático, Volumen tracking
