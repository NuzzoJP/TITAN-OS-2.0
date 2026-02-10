# 🎓 Guía Rápida: Módulo Wisdom

## ✅ Implementación Completa

### Sistema Académico Venezolano
- Escala de notas: 0-20
- Nota aprobatoria: 10
- Unidades Crédito (UC)
- Promedio ponderado automático

## 🎯 Características Principales

### 1. Semáforo Visual 🚦
Cada materia tiene un color según su proyección:

- 🟢 **Verde** (≥16): Excelente - Vas muy bien
- 🟡 **Amarillo** (12-15.9): Bien - Buen desempeño
- 🟠 **Naranja** (10-11.9): Aprobando - Justo para pasar
- 🔴 **Rojo** (<10): Riesgo - Peligro de reprobar

### 2. Simulador "Salva-Semestre" 🧮
Calcula automáticamente:
- Puntos que te faltan para aprobar
- Nota necesaria en evaluaciones restantes
- Detecta si es matemáticamente imposible

**Ejemplo:**
```
"Te faltan 3.5 pts netos"
"Necesitas promediar 09 en lo que falta para pasar"
```

### 3. Materia Salvada 🔒
Cuando acumulas 10+ puntos, aparece un candado:
- Ya no puedes reprobar
- Puedes relajarte en las evaluaciones restantes
- El simulador te lo confirma

### 4. Alerta de Retiro ⚠️
Si la nota necesaria es > 20:
- Icono de advertencia pulsante
- Mensaje: "Matemáticamente imposible aprobar"
- Sugerencia: Considera retiro

## 🚀 Cómo Usar

### Primer Uso

1. **Crear Semestre**
   ```
   Click "Crear Semestre" → Ingresa nombre (ej: 2026-I) → Marca como activo
   ```

2. **Agregar Materias**
   ```
   Click "Nueva Materia" → Nombre + UC → Crear
   ```

3. **Crear Evaluaciones**
   ```
   Click "Agregar" en tarjeta de materia → Nombre + Porcentaje → Crear
   ```

4. **Registrar Notas**
   ```
   Al crear evaluación, marca "Ya tengo la nota" → Ingresa nota (0-20)
   ```

### Uso Diario

- **Ver proyección**: Número grande en cada tarjeta
- **Consultar simulador**: Lee el texto debajo de la proyección
- **Identificar riesgos**: Busca tarjetas rojas
- **Celebrar éxitos**: Busca el candado 🔒

## 📊 Cálculos Matemáticos

### Puntos Acumulados
```
Evaluación 1: 15 pts × 30% = 4.5 pts
Evaluación 2: 12 pts × 40% = 4.8 pts
Total Acumulado: 9.3 pts
```

### Proyección
```
Proyección = 9.3 pts / 70% completado = 13.3 / 20
```

### Simulador
```
Peso restante: 100% - 70% = 30%
Puntos necesarios: 10 - 9.3 = 0.7 pts
Nota necesaria: 0.7 / 0.30 = 2.33 / 20
```

## 🎨 Interfaz

### Tarjeta de Materia
```
┌─────────────────────────────┐
│ Cálculo I          4 UC  🔒 │
│                             │
│ 16.5 / 20                   │
│ Acumulado: 11.2 pts         │
│ ████████████░░░░░░░░        │
│                             │
│ 🔒 ¡Materia Salvada!        │
│                             │
│ Evaluaciones:               │
│ • Parcial 1    30%    18    │
│ • Parcial 2    40%    15    │
│ • Final        30%    --    │
│                             │
│ cursando    2/3 completadas │
└─────────────────────────────┘
```

### Dashboard
```
┌─────────────────────────────────────┐
│ 2026-I                              │
│                                     │
│ Promedio: 15.8  UC: 18  ✓: 4  ⚠: 1 │
│                                     │
│ [Tarjeta 1] [Tarjeta 2] [Tarjeta 3]│
│ [Tarjeta 4] [Tarjeta 5] [Tarjeta 6]│
└─────────────────────────────────────┘
```

## 📁 Archivos Creados

```
titan-os/
├── app/dashboard/wisdom/
│   ├── page.tsx                      # Página principal
│   └── README.md                     # Documentación técnica
├── components/wisdom/
│   ├── subject-card.tsx              # Tarjeta de materia
│   ├── add-term-modal.tsx            # Modal crear semestre
│   ├── add-subject-modal.tsx         # Modal crear materia
│   └── add-evaluation-modal.tsx      # Modal crear evaluación
├── lib/actions/wisdom.ts             # Server Actions
└── WISDOM_GUIDE.md                   # Esta guía
```

## 💡 Tips y Trucos

### Estrategia de Estudio
1. Prioriza materias rojas (< 10)
2. Relájate en materias con 🔒
3. Usa el simulador para planificar

### Gestión de Tiempo
- Materias con nota necesaria > 18: Requieren mucho esfuerzo
- Materias con nota necesaria < 10: Fáciles de aprobar
- Materias salvadas: Mínimo esfuerzo

### Planificación
```
Materia A: Necesitas 18 → Estudia 10 horas
Materia B: Necesitas 12 → Estudia 5 horas
Materia C: Salvada 🔒 → Estudia 1 hora
```

## 🔧 Integración con Chronos

Cuando creas una evaluación con fecha:
- ✅ Se crea automáticamente un evento "Hard Block" en Chronos
- ✅ Si borras la evaluación, se borra el evento
- ✅ Si cambias la fecha, se actualiza el evento

## 📈 Ejemplos Reales

### Caso 1: Estudiante Excelente
```
Semestre: 2026-I
Promedio: 17.2
Materias: 6
Salvadas: 5 🔒
En riesgo: 0
```

### Caso 2: Estudiante en Apuros
```
Semestre: 2026-I
Promedio: 11.8
Materias: 5
Salvadas: 2 🔒
En riesgo: 2 ⚠️
```

### Caso 3: Necesita Retiro
```
Materia: Física II
Proyección: 6.5 / 20
Simulador: "Necesitas 27 en el final"
Estado: ⚠️ Imposible - Solicita retiro
```

## 🎯 Próximos Pasos

Para probar el módulo:

1. Ve a http://localhost:3000/dashboard/wisdom
2. Crea tu primer semestre
3. Agrega 2-3 materias
4. Crea evaluaciones con diferentes porcentajes
5. Registra algunas notas
6. Observa el semáforo y el simulador

## 🐛 Troubleshooting

### Proyección no cambia
- Asegúrate de marcar "Ya tengo la nota"
- Verifica que los triggers estén en Supabase

### Simulador dice "Imposible"
- Es correcto si necesitas > 20 puntos
- Considera retiro de la materia

### Promedio del semestre en 0
- Necesitas al menos una materia con evaluaciones
- Las materias sin notas no cuentan

---

**Estado**: ✅ Módulo Wisdom 100% Funcional

**Siguiente**: Implementar módulo Health o Chronos
