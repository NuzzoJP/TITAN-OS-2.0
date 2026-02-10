# 💪 Guía Rápida: Módulo Health

## ✅ Implementación Completa

### Sistema de Entrenamiento con Ghost Mode

## 🎯 Características Principales

### 1. Ghost Mode 👻
La característica estrella del módulo. Muestra automáticamente tu último registro:

**¿Qué es?**
- Al seleccionar un ejercicio, aparece un banner con tus datos anteriores
- Los inputs tienen placeholders con peso/reps previos
- No necesitas recordar tu último entrenamiento

**Ejemplo:**
```
Seleccionas: Press Banca
👻 Aparece: "Último: 80kg × 8 reps @ RPE 8"

Inputs muestran:
Peso: [____] placeholder: 80
Reps: [____] placeholder: 8
RPE:  [____] placeholder: 8
```

### 2. Cálculo Automático de 1RM
Usa la fórmula Epley para calcular tu One Rep Max:

```
1RM = peso × (1 + reps / 30)

Ejemplos:
100kg × 1 rep  = 100kg
80kg × 8 reps  = 101.3kg
60kg × 12 reps = 84kg
```

### 3. Tracking de Volumen
Calcula automáticamente el volumen total:

```
Volumen = peso × reps

Sesión de Press Banca:
Set 1: 80kg × 8 = 640kg
Set 2: 80kg × 7 = 560kg
Set 3: 80kg × 6 = 480kg
Total: 1,680kg
```

### 4. Top Ejercicios
Identifica tus ejercicios más trabajados por volumen total.

## 🚀 Cómo Usar

### Primer Uso

1. **Agregar Ejercicios** (opcional, ya hay algunos pre-cargados)
   ```
   Click "Nuevo Ejercicio" → Nombre + Grupo Muscular → Crear
   ```

2. **Registrar Entrenamiento**
   ```
   Click "Registrar Entrenamiento" → Selecciona fecha
   ```

3. **Agregar Series con Ghost Mode**
   ```
   Selecciona ejercicio → Ve el banner 👻 → Ingresa tus datos
   ```

4. **Agregar Más Series**
   ```
   Click "Agregar Serie" → Repite el proceso
   ```

### Uso Diario

**Flujo Típico:**
1. Abres el modal de registro
2. Seleccionas el primer ejercicio
3. Ghost Mode te muestra: "80kg × 8 reps"
4. Decides hacer 82.5kg × 8 reps (progreso!)
5. Agregas más series
6. Guardas el entrenamiento

**Revisar Progreso:**
- Ve a "Entrenamientos Recientes"
- Click en una sesión para expandir
- Ve todos los sets con 1RM calculado

## 📊 Interfaz

### Dashboard Principal
```
┌─────────────────────────────────────┐
│ Health                              │
│                                     │
│ [Entrenamientos: 45] [Este Mes: 12]│
│ [Series: 450]        [Ejercicios: 8]│
│                                     │
│ Top Ejercicios por Volumen:         │
│ 1. Sentadilla    12,500kg  50 sets │
│ 2. Press Banca    8,400kg  40 sets │
│ 3. Peso Muerto    7,200kg  30 sets │
│                                     │
│ Entrenamientos Recientes:           │
│ [Lunes 10 Feb] → Click para expandir│
│ [Viernes 7 Feb]                     │
└─────────────────────────────────────┘
```

### Modal de Registro
```
┌─────────────────────────────────────┐
│ Registrar Entrenamiento         [X] │
├─────────────────────────────────────┤
│ Fecha: [10/02/2026]                 │
│ Notas: [Buen entrenamiento]         │
│                                     │
│ Serie 1                         [🗑]│
│ Ejercicio: [Press Banca ▼]          │
│ 👻 Último: 80kg × 8 reps @ RPE 8   │
│ Peso: [82.5] Reps: [8] RPE: [8]    │
│                                     │
│ [+ Agregar Serie]                   │
│                                     │
│ [Guardar Entrenamiento]             │
└─────────────────────────────────────┘
```

## 💡 Tips y Estrategias

### Progresión Lineal
```
Semana 1: 80kg × 8 reps
Semana 2: 82.5kg × 8 reps (+2.5kg)
Semana 3: 85kg × 8 reps (+2.5kg)
Semana 4: 87.5kg × 8 reps (+2.5kg)
```

### Progresión por Reps
```
Semana 1: 100kg × 5 reps
Semana 2: 100kg × 6 reps (+1 rep)
Semana 3: 100kg × 7 reps (+1 rep)
Semana 4: 102.5kg × 5 reps (subir peso)
```

### Uso de RPE (Rate of Perceived Exertion)
```
RPE 10: Máximo esfuerzo, no puedes más
RPE 9:  Podrías hacer 1 rep más
RPE 8:  Podrías hacer 2 reps más
RPE 7:  Podrías hacer 3 reps más
RPE 6:  Moderado, cómodo
```

## 📈 Análisis de Datos

### Volumen Semanal
```
Semana 1: 15,000kg
Semana 2: 16,500kg (+10%)
Semana 3: 14,000kg (deload)
Semana 4: 17,500kg (nuevo récord)
```

### Top Ejercicios
Te ayuda a identificar:
- ¿Qué ejercicios haces más?
- ¿Hay desbalances?
- ¿Necesitas más variedad?

## 📁 Archivos Creados

```
titan-os/
├── app/dashboard/health/
│   ├── page.tsx                      # Dashboard principal
│   └── README.md                     # Documentación técnica
├── components/health/
│   ├── log-workout-modal.tsx         # Modal con Ghost Mode
│   ├── add-exercise-modal.tsx        # Modal crear ejercicio
│   └── progress-chart.tsx            # Gráfica de progreso
├── lib/actions/health.ts             # Server Actions
└── HEALTH_GUIDE.md                   # Esta guía
```

## 🎯 Casos de Uso

### Caso 1: Principiante
```
Objetivo: Aprender los ejercicios básicos
Estrategia:
- Agregar 5-6 ejercicios fundamentales
- Registrar cada entrenamiento
- Usar Ghost Mode para ver progreso
- Aumentar peso gradualmente
```

### Caso 2: Intermedio
```
Objetivo: Maximizar fuerza
Estrategia:
- Enfocarse en 1RM
- Usar RPE para regular intensidad
- Analizar top ejercicios
- Identificar estancamientos
```

### Caso 3: Avanzado
```
Objetivo: Periodización
Estrategia:
- Trackear volumen semanal
- Alternar fases de volumen/intensidad
- Usar datos históricos para planificar
- Optimizar frecuencia por ejercicio
```

## 🔧 Integración con Otros Módulos

### Con Chronos
- Los entrenamientos podrían crear eventos automáticos
- Planificar sesiones futuras

### Con Wisdom
- Balancear tiempo de estudio vs entrenamiento
- Priorizar según carga académica

### Con Finance
- Trackear gastos en suplementos
- Membresía de gimnasio

## 🐛 Troubleshooting

### Ghost Mode no funciona
**Problema**: No aparece el banner 👻
**Solución**:
1. Verifica que la función RPC esté en Supabase
2. Asegúrate de tener al menos un registro previo
3. Revisa la consola del navegador

### 1RM muestra 0
**Problema**: El 1RM calculado es 0
**Solución**:
1. Verifica que el trigger esté activo
2. Asegúrate de que el set no esté marcado como warmup
3. Revisa que peso y reps sean > 0

### No hay ejercicios
**Problema**: La biblioteca está vacía
**Solución**:
1. El schema.sql incluye ejercicios básicos
2. Agregar manualmente con "Nuevo Ejercicio"
3. Verificar que el script SQL se ejecutó correctamente

## ✨ Características Destacadas

1. **Ghost Mode Automático**: No más adivinar tu último peso
2. **1RM Calculado**: Fórmula Epley en cada set
3. **Volumen Tracking**: Identifica tus ejercicios principales
4. **Historial Expandible**: Ve detalles sin saturar la UI
5. **Multi-Set Form**: Registra sesiones completas de una vez

---

**Estado**: ✅ Módulo Health 100% Funcional

**Siguiente**: Implementar módulo Chronos (Calendario)
