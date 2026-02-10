# Titan OS - Guía de Configuración

## ✅ Estado Actual

### Completado
1. ✅ Proyecto Next.js 14 inicializado
2. ✅ Supabase configurado y conectado
3. ✅ Base de datos creada (schema.sql ejecutado)
4. ✅ Sistema de autenticación implementado
5. ✅ Layout principal con Sidebar y Header
6. ✅ Protección de rutas (middleware)
7. ✅ Tema Industrial Dark Mode aplicado

## 🔐 Crear Usuario en Supabase

Para poder iniciar sesión, necesitas crear un usuario:

1. Ve a tu proyecto Supabase: https://mjdxpsocskalzhkctnyf.supabase.co
2. Navega a **Authentication** > **Users**
3. Click en **Add User** > **Create new user**
4. Ingresa:
   - Email: tu@email.com
   - Password: (tu contraseña segura)
   - Auto Confirm User: ✅ (activado)
5. Click en **Create user**

## 🚀 Ejecutar el Proyecto

```bash
cd titan-os
npm run dev
```

Abre http://localhost:3000 en tu navegador.

## 📁 Estructura Actual

```
titan-os/
├── app/
│   ├── login/page.tsx          # Página de login
│   ├── dashboard/
│   │   ├── layout.tsx          # Layout con Sidebar + Header
│   │   ├── page.tsx            # Dashboard principal
│   │   ├── finance/page.tsx    # Módulo Finance
│   │   ├── health/page.tsx     # Módulo Health
│   │   ├── wisdom/page.tsx     # Módulo Wisdom
│   │   └── chronos/page.tsx    # Módulo Chronos
│   └── auth/callback/route.ts  # Callback de autenticación
├── components/
│   ├── sidebar.tsx             # Navegación lateral
│   └── header.tsx              # Header con saludo y Privacy Toggle
├── lib/
│   └── supabase/
│       ├── client.ts           # Cliente Supabase (client-side)
│       ├── server.ts           # Cliente Supabase (server-side)
│       └── middleware.ts       # Lógica de middleware
└── middleware.ts               # Protección de rutas
```

## 🎨 Características Implementadas

### Autenticación
- Login con email/password
- Protección de rutas automática
- Redirección a /dashboard si está autenticado
- Redirección a /login si no está autenticado
- Botón de logout en sidebar

### Layout Principal
- **Sidebar Izquierda**: Navegación con iconos
  - Home (Dashboard)
  - Finance (Dinero)
  - Health (Entrenamiento)
  - Wisdom (Universidad)
  - Chronos (Calendario)
  - Logout (Cerrar sesión)

- **Header Superior**:
  - Saludo dinámico (Good Morning/Afternoon/Evening)
  - Fecha actual
  - Privacy Toggle (Ojo) - Preparado para ocultar datos sensibles

### Diseño
- Industrial Dark Mode (Negro profundo, acentos azules)
- Componentes minimalistas y funcionales
- Transiciones suaves
- Responsive design

## 🔜 Próximos Pasos

1. Implementar módulo Finance (Cuentas, Transacciones, Presupuestos)
2. Implementar módulo Health (Ejercicios, Sesiones, Sets)
3. Implementar módulo Wisdom (Semestres, Materias, Evaluaciones)
4. Implementar módulo Chronos (Calendario, Eventos)
5. Conectar Privacy Toggle con estado global
6. Dashboard con estadísticas reales

## 🐛 Troubleshooting

### Error: "Invalid login credentials"
- Verifica que el usuario esté creado en Supabase
- Asegúrate de que "Auto Confirm User" esté activado

### Error: "Missing Supabase environment variables"
- Verifica que `.env.local` tenga las credenciales correctas
- Reinicia el servidor de desarrollo

### Redirección infinita
- Limpia las cookies del navegador
- Verifica que el middleware esté configurado correctamente
