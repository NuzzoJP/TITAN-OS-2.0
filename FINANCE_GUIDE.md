# 💰 Guía Rápida: Módulo Finance

## ✅ Implementación Completa

### Características Principales

1. **Daily Safe-to-Spend** 💵
   - Tarjeta destacada que muestra cuánto puedes gastar hoy
   - Cálculo automático: (Balance - Gastos) / Días Restantes
   - Barra de progreso del presupuesto mensual
   - Colores dinámicos según el nivel de gasto

2. **Gestión de Cuentas** 🏦
   - Crear múltiples cuentas (Banco, Efectivo, Tarjeta, Inversión)
   - Soporte multi-moneda (USD, EUR, VES)
   - Balance actualizado automáticamente
   - Vista de tarjetas con información clara

3. **Transacciones** 📊
   - Registrar ingresos y gastos
   - Categorización personalizada
   - Tabla con últimas 10 transacciones
   - Iconos y colores diferenciados

4. **Presupuesto Mensual** 🎯
   - Configurar límite de gastos
   - Establecer meta de ahorro
   - Indicador visual de progreso

## 🚀 Cómo Usar

### Primer Uso

1. **Crear una Cuenta**
   ```
   Click en "Nueva Cuenta" → Ingresa nombre, tipo, balance inicial
   ```

2. **Configurar Presupuesto**
   ```
   Click en ⚙️ (en tarjeta principal) → Ingresa límite mensual y meta de ahorro
   ```

3. **Registrar Transacciones**
   ```
   Click en "Nueva Transacción" → Selecciona tipo (Gasto/Ingreso) → Completa datos
   ```

### Uso Diario

- **Ver cuánto puedes gastar hoy**: Tarjeta principal con número grande
- **Monitorear progreso**: Barra de progreso del presupuesto
- **Revisar movimientos**: Scroll en la tabla de transacciones

## 📁 Archivos Creados

```
titan-os/
├── app/dashboard/finance/
│   ├── page.tsx                          # Página principal del módulo
│   └── README.md                         # Documentación técnica
├── components/finance/
│   ├── add-transaction-modal.tsx         # Modal para crear transacciones
│   ├── add-account-modal.tsx             # Modal para crear cuentas
│   └── budget-settings-modal.tsx         # Modal para configurar presupuesto
├── lib/
│   ├── actions/finance.ts                # Server Actions (lógica backend)
│   └── utils.ts                          # Funciones de formato (currency)
└── FINANCE_GUIDE.md                      # Esta guía
```

## 🎨 UI/UX

### Diseño Industrial Dark Mode
- Fondo negro profundo (#0a0a0a)
- Acentos azul industrial
- Bordes sutiles
- Transiciones suaves

### Formato de Números
- Moneda: `$1,234.56`
- Automático según la moneda de la cuenta
- Colores: Verde para ingresos, Rojo para gastos

### Responsive
- Mobile: Stack vertical
- Tablet: Grid 2 columnas
- Desktop: Grid 3 columnas

## 🔧 Tecnologías

- **Next.js 14**: App Router + Server Actions
- **Supabase**: PostgreSQL + RPC Functions
- **TypeScript**: Tipado estricto
- **Tailwind CSS**: Estilos utility-first
- **date-fns**: Formato de fechas
- **Lucide React**: Iconos

## 💾 Base de Datos

### Triggers Automáticos
- ✅ Balance se actualiza al crear transacción
- ✅ Timestamps automáticos

### Funciones RPC
- ✅ `get_daily_safe_to_spend()`: Cálculo inteligente

## 🎯 Próximos Pasos

Para probar el módulo:

1. Ejecuta el servidor: `npm run dev`
2. Ve a http://localhost:3000/dashboard/finance
3. Crea una cuenta
4. Configura tu presupuesto
5. Registra algunas transacciones
6. Observa cómo se actualiza el "Daily Safe-to-Spend"

## 🐛 Troubleshooting

### "No hay transacciones registradas"
- Normal en primera instalación
- Crea tu primera transacción con el botón "Nueva Transacción"

### "Puedes gastar hoy: $0.00"
- Necesitas configurar un presupuesto (botón ⚙️)
- O crear una cuenta con balance positivo

### Balance no se actualiza
- Verifica que el trigger esté creado en Supabase
- Revisa la consola del navegador para errores

## ✨ Características Destacadas

1. **Cálculo Inteligente**: El "Daily Safe-to-Spend" considera días restantes del mes
2. **Actualización Automática**: Los balances se actualizan sin recargar
3. **Validación**: Formularios con validación en tiempo real
4. **UX Fluida**: Modales con animaciones suaves
5. **Formato Profesional**: Números formateados como moneda real

---

**Estado**: ✅ Módulo Finance 100% Funcional

**Siguiente**: Implementar módulo Health, Wisdom o Chronos
