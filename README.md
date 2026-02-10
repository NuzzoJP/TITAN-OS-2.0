# 🚀 Titan OS

**Sistema Operativo Personal** - Gestiona tu vida completa con IA

Una Progressive Web App (PWA) completa para gestionar finanzas, salud, estudios y tiempo en un solo lugar.

![Titan OS](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge)

---

## ✨ Características

### 💰 Finance (Wealth)
- Daily Safe-to-Spend con cálculo inteligente
- Gestión de múltiples cuentas y monedas
- Tracking de transacciones (ingresos/gastos)
- Configuración de presupuestos y metas de ahorro
- Visualización en tiempo real

### 💪 Health
**Gym Tracker:**
- Registro de entrenamientos con múltiples sets
- Ghost Mode (muestra tu último registro)
- Cálculo automático de 1RM (Epley formula)
- Biblioteca de ejercicios por grupo muscular
- Gráficas de progreso

**Titan Fuel AI (Nutrición):**
- Escaneo de comida con IA (ready para OpenAI Vision/Gemini)
- Cálculos metabólicos dinámicos (BMR, TDEE)
- Tracking de macros (proteínas, carbos, grasas)
- Actualización automática según peso

### 🎓 Wisdom (Académico)
- Sistema de calificaciones venezolano (0-20)
- Gestión de semestres y materias
- Simulador "Salva-Semestre" (calcula qué necesitas para aprobar)
- Sistema de semáforo visual (🟢🟡🟠🔴)
- Proyección automática de notas

### 📅 Chronos (Calendario)
- Calendario completo (Mes/Semana/Día/Agenda)
- Color coding por módulo
- Hard Blocks vs Soft Blocks
- Sincronización automática con Wisdom
- Estadísticas de eventos

### 🏠 Home Dashboard
- Vista de 4 cuadrantes con datos en tiempo real
- Privacy Mode (oculta datos sensibles)
- Command Palette (Omni-FAB) para acciones rápidas
- Integración completa de todos los módulos

---

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI
- **Backend:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Charts:** Recharts
- **Calendar:** React Big Calendar
- **Icons:** Lucide React
- **PWA:** Service Worker + Manifest

---

## 🚀 Quick Start

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/titan-os.git
cd titan-os
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Configurar la base de datos

Ejecuta los siguientes scripts SQL en Supabase (en orden):

1. `supabase/schema.sql` - Esquema principal
2. `supabase/nutrition_expansion.sql` - Tablas de nutrición
3. `supabase/fix_user_id_simple.sql` - Configuración de user_id y RLS

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📱 Instalar como PWA

### Android (Chrome):
1. Abre la app en Chrome
2. Menú (⋮) → "Agregar a pantalla de inicio"
3. ¡Listo!

### iOS (Safari):
1. Abre la app en Safari
2. Botón compartir (□↑) → "Agregar a pantalla de inicio"
3. ¡Listo!

### Desktop:
1. Ícono de instalación (+) en la barra de direcciones
2. Click "Instalar"
3. ¡Listo!

---

## 🌐 Deploy en Producción

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel login
vercel --prod
```

O conecta tu repo de GitHub en [vercel.com/new](https://vercel.com/new)

Ver guía completa: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 📚 Documentación

- [SETUP.md](./SETUP.md) - Guía de configuración inicial
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Guía de despliegue completa
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Deploy rápido en 5 minutos
- [PWA_SETUP.md](./PWA_SETUP.md) - Configuración PWA
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Estado del proyecto

### Guías por módulo:
- [FINANCE_GUIDE.md](./FINANCE_GUIDE.md)
- [HEALTH_GUIDE.md](./HEALTH_GUIDE.md)
- [WISDOM_GUIDE.md](./WISDOM_GUIDE.md)
- [CHRONOS_GUIDE.md](./CHRONOS_GUIDE.md)
- [TITAN_FUEL_AI.md](./TITAN_FUEL_AI.md)

---

## 🎨 Diseño

**Industrial Dark Mode:**
- Fondo negro puro (#000000)
- Acentos cyan (#22D3EE)
- Bordes sutiles y efectos neon
- Tipografía monospace para números

**Color Coding por Módulo:**
- 🟢 Finance: Green/Emerald
- 🔵 Health: Cyan
- 🟡 Wisdom: Amber/Violet
- 🟣 Chronos: Purple

---

## 🔒 Seguridad

- ✅ Row Level Security (RLS) habilitado en todas las tablas
- ✅ Autenticación con Supabase Auth
- ✅ Variables de entorno para credenciales
- ✅ HTTPS en producción
- ✅ Privacy Mode para datos sensibles

---

## 🗂️ Estructura del Proyecto

```
titan-os/
├── app/                    # Next.js App Router
│   ├── auth/              # Autenticación
│   ├── dashboard/         # Módulos principales
│   │   ├── finance/
│   │   ├── health/
│   │   ├── wisdom/
│   │   └── chronos/
│   └── login/             # Página de login
├── components/            # Componentes React
│   ├── finance/
│   ├── health/
│   ├── wisdom/
│   ├── chronos/
│   └── home/
├── lib/                   # Utilidades
│   ├── actions/          # Server Actions
│   ├── contexts/         # React Contexts
│   ├── supabase/         # Clientes Supabase
│   └── utils/            # Funciones helper
├── public/               # Assets estáticos
├── supabase/             # Scripts SQL
└── scripts/              # Scripts de utilidad
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la [MIT License](LICENSE).

---

## 🎯 Roadmap

- [ ] Integración con OpenAI Vision para escaneo de comida
- [ ] Integración con Cubitt (balanza inteligente)
- [ ] Notificaciones push
- [ ] Modo offline completo
- [ ] Exportar datos a CSV/PDF
- [ ] App móvil nativa (React Native)
- [ ] Integración con Apple Health / Google Fit
- [ ] Dashboard de analytics avanzado

---

## 👨‍💻 Autor

**Titan OS** - Sistema Operativo Personal

Desarrollado con ❤️ usando Next.js, TypeScript y Supabase

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**
