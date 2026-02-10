# Módulo Wisdom - Titan OS

## 🎓 Sistema Académico Venezolano

### Características Implementadas

1. **Gestión de Semestres**
   - Crear múltiples semestres
   - Marcar semestre activo
   - Promedio ponderado automático (Nota × UC / Total UC)

2. **Gestión de Materias**
   - Crear materias con Unidades Crédito (UC)
   - Escala de notas 0-20 (aprobatoria: 10)
   - Cálculo automático de proyección
   - Puntos acumulados en tiempo real

3. **Sistema de Evaluaciones**
   - Crear evaluaciones con porcentaje de peso
   - Registrar notas (0-20)
   - Cálculo automático de proyección
   - Sincronización con Chronos (eventos automáticos)

4. **Semáforo Visual**
   - 🟢 Verde: Proyección ≥ 16 (Excelente)
   - 🟡 Amarillo: Proyección 12-15.9 (Bien)
   - 🟠 Naranja: Proyección 10-11.9 (Aprobando)
   - 🔴 Rojo: Proyección < 10 (Riesgo)

5. **Simulador "Salva-Semestre"**
   - Calcula puntos faltantes para aprobar
   - Muestra nota necesaria en evaluaciones restantes
   - Detecta imposibilidad matemática
   - Icono 🔒 cuando ya tienes 10 puntos (Materia Salvada)

## 📊 Fórmulas Matemáticas

### Puntos Acumulados
```
accumulated_points = Σ(nota_obtenida × peso_porcentual)
```

### Proyección (Escala 0-20)
```
current_projection = accumulated_points / peso_completado
```

### Promedio del Semestre (Ponderado)
```
term_average = Σ(proyección × UC) / Σ(UC)
```

### Simulador
```
peso_restante = 1.0 - Σ(pesos_completados)
puntos_necesarios = 10 - accumulated_points
nota_necesaria = puntos_necesarios / peso_restante
```

## 🎨 Componentes UI

### Página Principal (`page.tsx`)
- Dashboard con estadísticas del semestre
- Grid de tarjetas de materias
- Selector de semestre activo

### Tarjeta de Materia (`subject-card.tsx`)
- Proyección grande con semáforo de color
- Barra de progreso visual
- Puntos acumulados
- Simulador integrado
- Lista de evaluaciones
- Icono 🔒 si está salvada
- Icono ⚠️ si es imposible aprobar

### Modales
1. **AddTermModal**: Crear semestres
2. **AddSubjectModal**: Crear materias
3. **AddEvaluationModal**: Crear evaluaciones

## 🔧 Server Actions

Todas las operaciones usan Server Actions (`lib/actions/wisdom.ts`):

- `getTerms()`: Obtener todos los semestres
- `getActiveTerm()`: Obtener semestre activo
- `getSubjectsByTerm()`: Materias de un semestre
- `getEvaluationsBySubject()`: Evaluaciones de una materia
- `createTerm()`: Crear semestre
- `createSubject()`: Crear materia
- `createEvaluation()`: Crear evaluación
- `updateEvaluationGrade()`: Actualizar nota
- `calculateSimulation()`: Calcular simulador
- `getGradeColor()`: Obtener color del semáforo

## 💾 Base de Datos

### Tablas Utilizadas
- `wisdom_terms`: Semestres
- `wisdom_subjects`: Materias
- `wisdom_evaluations`: Evaluaciones

### Triggers Automáticos
- ✅ Recalcula proyección al actualizar evaluación
- ✅ Recalcula promedio del semestre al actualizar materia
- ✅ Crea evento en Chronos cuando hay fecha de entrega
- ✅ Elimina evento de Chronos al borrar evaluación

## 🎯 Flujo de Uso

1. **Primera vez**:
   - Crear semestre (botón "Crear Semestre")
   - Agregar materias con sus UC
   - Crear evaluaciones con sus porcentajes

2. **Uso diario**:
   - Ver proyección de cada materia
   - Consultar simulador para saber qué nota necesitas
   - Registrar notas cuando las obtengas

3. **Gestión**:
   - Monitorear promedio del semestre
   - Identificar materias en riesgo (rojas)
   - Celebrar materias salvadas (🔒)

## 🎨 Diseño

### Semáforo de Colores
- **Verde**: Excelente desempeño (≥16)
- **Amarillo**: Buen desempeño (12-15.9)
- **Naranja**: Aprobando justo (10-11.9)
- **Rojo**: En riesgo de reprobar (<10)

### Estados Especiales
- **🔒 Materia Salvada**: Ya tienes 10+ puntos acumulados
- **⚠️ Imposible Aprobar**: Nota necesaria > 20 (considera retiro)

## 📈 Ejemplos

### Ejemplo 1: Materia en Progreso
```
Materia: Cálculo I (4 UC)
Evaluaciones:
- Parcial 1 (30%): 15 pts → Acumulado: 4.5 pts
- Parcial 2 (30%): 12 pts → Acumulado: 8.1 pts
- Final (40%): Pendiente

Proyección: 13.5 / 20 (Amarillo)
Simulador: "Te faltan 1.9 pts. Necesitas 4.75 en el final"
```

### Ejemplo 2: Materia Salvada
```
Materia: Programación (3 UC)
Evaluaciones:
- Proyecto 1 (25%): 18 pts → Acumulado: 4.5 pts
- Proyecto 2 (25%): 16 pts → Acumulado: 8.5 pts
- Examen (50%): Pendiente

Proyección: 17.0 / 20 (Verde)
Estado: 🔒 ¡Materia Salvada! (ya tienes 10+ puntos)
```

### Ejemplo 3: Riesgo de Reprobar
```
Materia: Física (4 UC)
Evaluaciones:
- Parcial 1 (40%): 8 pts → Acumulado: 3.2 pts
- Parcial 2 (40%): 6 pts → Acumulado: 5.6 pts
- Final (20%): Pendiente

Proyección: 7.0 / 20 (Rojo)
Simulador: "Te faltan 4.4 pts. Necesitas 22 en el final"
Estado: ⚠️ Matemáticamente imposible. Considera retiro.
```

## 🔜 Mejoras Futuras

- Gráfico de evolución de notas
- Predicción de promedio final
- Alertas de materias en riesgo
- Exportar historial académico
- Comparación entre semestres
- Gestión de asistencias
- Subir archivos de programa/syllabus

## 🐛 Troubleshooting

### "No hay semestre activo"
- Crea tu primer semestre con el botón "Crear Semestre"
- Marca el checkbox "Marcar como semestre activo"

### Proyección no se actualiza
- Verifica que los triggers estén creados en Supabase
- Asegúrate de marcar la evaluación como "completada"

### Suma de porcentajes no da 100%
- Es normal tener evaluaciones pendientes
- El simulador calcula con el peso restante

---

**Estado**: ✅ Módulo Wisdom 100% Funcional

**Sistema**: Escala venezolana 0-20, UC, Promedio Ponderado
