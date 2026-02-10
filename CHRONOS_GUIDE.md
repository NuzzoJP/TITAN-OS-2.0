# ⏰ Guía Completa: Módulo Chronos

## ✅ Implementación Completa

### El Calendario Maestro de Titan OS

Chronos es el cerebro temporal que unifica y orquesta todos los eventos de los demás módulos.

## 🎯 Características Principales

### 1. Calendario Visual Integrado
- **React Big Calendar** con localización en español
- Vistas: Mes, Semana, Día, Agenda
- Click en cualquier espacio para crear evento
- Navegación fluida entre fechas

### 2. Sistema de Colores por Módulo
```
🔴 Rojo (Hard Block):   Exámenes de Wisdom - NO MOVIBLES
🔵 Azul (Soft Block):   Eventos manuales - FLEXIBLES
🟡 Amarillo (Finance):  Pagos y deadlines
🟢 Verde (Health):      Entrenamientos programados
```

### 3. Sincronización Automática
Los eventos se crean automáticamente desde otros módulos:
- **Wisdom**: Al crear evaluación con fecha → Evento rojo (hard block)
- **Finance**: Al crear transacción futura → Evento amarillo
- **Health**: Al programar entrenamiento → Evento verde

### 4. Hard vs Soft Blocks

**Hard Blocks (Rojo):**
- Exámenes universitarios
- Clases obligatorias
- Eventos críticos
- **NO se pueden mover**
- Tienen borde rojo grueso

**Soft Blocks (Azul):**
- Eventos personales
- Tareas flexibles
- Reuniones reprogramables
- **Pueden moverse**

## 📊 Interfaz de Usuario

### Dashboard Principal
```
┌─────────────────────────────────────┐
│ Chronos                    [+ Nuevo]│
│                                     │
│ [Total: 45] [Mes: 12] [Exámenes: 3]│
│                                     │
│ Leyenda:                            │
│ 🔴 Hard Block  🔵 Soft Block       │
│ 🟡 Finance     🟢 Health           │
│                                     │
│ ┌─────────────────────────────────┐│
│ │     CALENDARIO INTERACTIVO      ││
│ │                                 ││
│ │  L  M  M  J  V  S  D           ││
│ │  1  2  3  4  5  6  7           ││
│ │  [Examen] [Pago] [Gym]         ││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### Modal de Creación
```
┌─────────────────────────────────────┐
│ Nuevo Evento                    [X] │
├─────────────────────────────────────┤
│ Título: [Reunión con cliente]       │
│ Descripción: [Detalles...]          │
│                                     │
│ Tipo: [Soft Block ▼]               │
│ ℹ️ Puede ser movido o reprogramado │
│                                     │
│ ☐ Evento de todo el día            │
│                                     │
│ Inicio: [10/02/2026 09:00]         │
│ Fin:    [10/02/2026 10:00]         │
│                                     │
│ [Crear Evento]                      │
└─────────────────────────────────────┘
```

## 🔧 Funcionalidades

### Crear Evento Manual
1. Click en cualquier día del calendario
2. Se abre modal con fecha pre-seleccionada
3. Completa título y detalles
4. Selecciona tipo (Hard/Soft)
5. Guarda

### Ver Detalles de Evento
- Click en cualquier evento
- Muestra información completa
- Opción de eliminar (solo manuales)

### Navegación
- Botones Anterior/Siguiente
- Botón "Hoy" para volver a fecha actual
- Selector de vista (Mes/Semana/Día/Agenda)

### Estadísticas
- Total de eventos registrados
- Eventos del mes actual
- Contador de exámenes (hard blocks)
- Contador de pagos pendientes

## 📁 Archivos Creados

```
titan-os/
├── app/dashboard/chronos/
│   └── page.tsx                      # Calendario principal
├── components/chronos/
│   └── add-event-modal.tsx           # Modal crear evento
├── lib/actions/chronos.ts            # Server Actions
└── CHRONOS_GUIDE.md                  # Esta guía
```

## 🎨 Diseño

### Colores Específicos
```typescript
// Hard blocks (Wisdom)
'#ef4444' // Red

// Finance
'#f59e0b' // Amber

// Health
'#10b981' // Emerald

// Soft blocks
'#3b82f6' // Blue
```

### Estilos del Calendario
- Fondo oscuro integrado con tema
- Bordes sutiles
- Hover states suaves
- Eventos con opacidad 0.9
- Hard blocks con borde rojo de 2px

## 🔄 Sincronización con Otros Módulos

### Desde Wisdom
```typescript
// Al crear evaluación con fecha
CREATE TRIGGER evaluation_create_chronos_event
  AFTER INSERT ON wisdom_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_event_from_evaluation();

// Resultado:
- Título: "Evaluación: Parcial 1"
- Descripción: Nombre de la materia
- Tipo: Hard Block (rojo)
- Fecha: due_date de la evaluación
```

### Desde Finance (Futuro)
```typescript
// Al crear transacción futura
- Título: "Pago: [descripción]"
- Tipo: All Day Event
- Color: Amarillo
```

### Desde Health (Futuro)
```typescript
// Al programar entrenamiento
- Título: "Entrenamiento: [nombre]"
- Tipo: Soft Block
- Color: Verde
```

## 💡 Casos de Uso

### Caso 1: Estudiante con Exámenes
```
Lunes 10:
- 08:00-10:00: Clase (🔴 Hard)
- 14:00-16:00: Examen Final (🔴 Hard)
- 18:00-19:00: Gym (🟢 Soft) ← Puede moverse

Conflicto detectado:
- No puedes agendar nada sobre el examen
- Gym puede moverse a otro horario
```

### Caso 2: Freelancer con Deadlines
```
Semana:
- Lunes: Pago cliente A (🟡 Finance)
- Miércoles: Reunión proyecto (🔵 Soft)
- Viernes: Entrega final (🔴 Hard)

Dashboard muestra:
- 3 eventos esta semana
- 1 hard block (entrega)
- 1 pago pendiente
```

### Caso 3: Planificación Mensual
```
Vista Mes:
- 8 exámenes (🔴)
- 12 entrenamientos (🟢)
- 5 pagos (🟡)
- 10 eventos personales (🔵)

Total: 35 eventos
Permite ver carga de trabajo del mes
```

## 🚀 Flujo de Trabajo

### Planificación Semanal
1. Abre Chronos el domingo
2. Ve vista de semana
3. Identifica hard blocks (exámenes)
4. Agenda soft blocks alrededor
5. Verifica no hay conflictos

### Gestión Diaria
1. Vista de día
2. Ve eventos de hoy en orden
3. Marca completados
4. Ajusta horarios si necesario

### Revisión Mensual
1. Vista de mes
2. Analiza distribución de eventos
3. Identifica semanas pesadas
4. Planifica con anticipación

## 🔜 Mejoras Futuras

### Fase 1: Conflict Resolution
- [ ] Detectar overlaps automáticamente
- [ ] Sugerir horarios alternativos
- [ ] Alertas de conflictos

### Fase 2: Smart Scheduling
- [ ] IA que sugiere mejores horarios
- [ ] Optimización de tiempo de estudio
- [ ] Balance automático work/life

### Fase 3: Integraciones
- [ ] Sincronización con Google Calendar
- [ ] Exportar a iCal
- [ ] Recordatorios por email/SMS

### Fase 4: Analytics
- [ ] Heatmap de productividad
- [ ] Análisis de tiempo por categoría
- [ ] Reportes semanales/mensuales

## 🐛 Troubleshooting

### Eventos no aparecen
**Solución**:
1. Verifica que la tabla chronos_events exista
2. Revisa que los triggers estén activos
3. Recarga la página

### No puedo eliminar evento
**Solución**:
- Solo eventos manuales pueden eliminarse
- Eventos de Wisdom/Finance se eliminan desde su módulo
- Verifica el source_type del evento

### Colores incorrectos
**Solución**:
1. Verifica la función getEventColor()
2. Asegúrate de que source_type esté correcto
3. Limpia caché del navegador

### Calendario no se ve bien
**Solución**:
1. Verifica que react-big-calendar esté instalado
2. Asegúrate de importar los estilos CSS
3. Revisa los estilos personalizados en globals.css

## 📈 Estadísticas de Uso

### Métricas Disponibles
```typescript
{
  totalEvents: 45,      // Total histórico
  monthEvents: 12,      // Este mes
  wisdomEvents: 3,      // Exámenes
  financeEvents: 2,     // Pagos
}
```

### Próximos Eventos
```typescript
getUpcomingEvents(5) // Próximos 5 eventos
getTodayEvents()     // Eventos de hoy
```

## ✨ Características Destacadas

1. **Sincronización Automática**: Eventos de otros módulos aparecen automáticamente
2. **Color Coding**: Identificación visual instantánea por tipo
3. **Hard vs Soft**: Sistema de prioridades claro
4. **Localización**: Todo en español (días, meses, mensajes)
5. **Responsive**: Funciona en desktop y móvil
6. **Interactivo**: Click para crear, drag para mover (futuro)

---

**Estado**: ✅ Módulo Chronos 100% Funcional

**Integrado con**: Wisdom (exámenes automáticos)

**Siguiente**: Implementar Dashboard Home unificado
