# Módulo Finance - Titan OS

## 📊 Características Implementadas

### 1. Daily Safe-to-Spend
- **Cálculo Automático**: Usa la función RPC `get_daily_safe_to_spend()` de Supabase
- **Fórmula**: (Balance Total - Gastos del Mes) / Días Restantes
- **Barra de Progreso**: Visual del presupuesto mensual con colores dinámicos:
  - Verde: < 70% del presupuesto
  - Amarillo: 70-90% del presupuesto
  - Rojo: > 90% del presupuesto

### 2. Gestión de Cuentas
- Crear múltiples cuentas (Banco, Efectivo, Tarjeta, Inversión)
- Soporte multi-moneda (USD, EUR, VES)
- Balance actualizado automáticamente con transacciones
- Vista de tarjetas con balance individual

### 3. Transacciones
- Registro de ingresos y gastos
- Categorización personalizada
- Descripción opcional
- Fecha personalizable
- Lista de últimas 10 transacciones con:
  - Iconos visuales (↑ ingreso, ↓ gasto)
  - Colores diferenciados
  - Información de cuenta y fecha

### 4. Presupuesto Mensual
- Configurar límite mensual de gastos
- Establecer meta de ahorro
- Actualización automática cada mes
- Indicador de progreso en tiempo real

## 🎨 Componentes UI

### Página Principal (`page.tsx`)
- Dashboard con estadísticas clave
- Tarjeta destacada de "Daily Safe-to-Spend"
- Grid de métricas (Balance, Gastos, Ahorro)
- Lista de cuentas
- Tabla de transacciones recientes

### Modales
1. **AddTransactionModal**: Crear ingresos/gastos
2. **AddAccountModal**: Crear nuevas cuentas
3. **BudgetSettingsModal**: Configurar presupuesto mensual

## 🔧 Server Actions

Todas las operaciones usan Server Actions (`lib/actions/finance.ts`):

- `getDailySafeToSpend()`: Calcula gasto diario seguro
- `getAccounts()`: Obtiene todas las cuentas
- `getTotalBalance()`: Suma balance de todas las cuentas
- `getRecentTransactions()`: Últimas transacciones
- `getCurrentBudget()`: Presupuesto del mes actual
- `getMonthlyExpenses()`: Total de gastos del mes
- `createTransaction()`: Crear nueva transacción
- `createAccount()`: Crear nueva cuenta
- `upsertBudget()`: Crear/actualizar presupuesto

## 💾 Base de Datos

### Tablas Utilizadas
- `finance_accounts`: Cuentas bancarias y efectivo
- `finance_transactions`: Movimientos de dinero
- `finance_budgets`: Presupuestos mensuales

### Triggers Automáticos
- **Balance Automático**: Al crear una transacción, el balance de la cuenta se actualiza automáticamente
- **Timestamps**: `updated_at` se actualiza automáticamente

### Funciones RPC
- `get_daily_safe_to_spend()`: Cálculo inteligente del gasto diario

## 🎯 Flujo de Uso

1. **Primera vez**:
   - Crear al menos una cuenta (botón "Nueva Cuenta")
   - Configurar presupuesto mensual (icono ⚙️ en tarjeta principal)

2. **Uso diario**:
   - Ver cuánto puedes gastar hoy en la tarjeta principal
   - Registrar transacciones (botón "Nueva Transacción")
   - Monitorear progreso del presupuesto

3. **Gestión**:
   - Revisar transacciones recientes
   - Verificar balance de cuentas
   - Ajustar presupuesto según necesidad

## 🎨 Diseño

- **Industrial Dark Mode**: Negro profundo con acentos azules
- **Formato de Moneda**: Automático con `Intl.NumberFormat`
- **Responsive**: Adaptado a móvil, tablet y desktop
- **Transiciones Suaves**: Hover states y animaciones sutiles

## 🔜 Mejoras Futuras

- Gráficos de gastos por categoría (Recharts)
- Exportar transacciones a CSV
- Filtros avanzados de transacciones
- Metas de ahorro con progreso visual
- Notificaciones cuando se excede el presupuesto
- Análisis de tendencias de gasto
