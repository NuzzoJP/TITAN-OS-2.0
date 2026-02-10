# 🚀 Guía de Despliegue - Titan OS

## Opción 1: Vercel (Recomendado - GRATIS)

Vercel es la mejor opción para Next.js. Es gratis, rápido y automático.

### Paso 1: Crear cuenta en Vercel
1. Ve a https://vercel.com
2. Regístrate con GitHub (recomendado) o email
3. Es completamente gratis

### Paso 2: Preparar el proyecto

Asegúrate de que tu proyecto esté en GitHub:

```bash
# Si no tienes Git inicializado
git init
git add .
git commit -m "Initial commit - Titan OS"

# Crear repo en GitHub y conectarlo
git remote add origin https://github.com/TU_USUARIO/titan-os.git
git branch -M main
git push -u origin main
```

### Paso 3: Desplegar en Vercel

**Opción A: Desde la web (Más fácil)**
1. Ve a https://vercel.com/new
2. Importa tu repositorio de GitHub
3. Vercel detectará Next.js automáticamente
4. Agrega las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`: tu URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: tu Anon Key de Supabase
5. Click en "Deploy"
6. ¡Listo! En 2 minutos estará en línea

**Opción B: Desde la terminal**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Desplegar
vercel

# Seguir las instrucciones
# Cuando pregunte por variables de entorno, agregar:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Paso 4: Configurar dominio personalizado (Opcional)

Vercel te da un dominio gratis: `titan-os.vercel.app`

Si quieres tu propio dominio:
1. Compra un dominio en Namecheap/GoDaddy (~$10/año)
2. En Vercel → Settings → Domains
3. Agrega tu dominio
4. Configura los DNS según las instrucciones

### Paso 5: Configurar Supabase para producción

En Supabase Dashboard:
1. Ve a Authentication → URL Configuration
2. Agrega tu URL de Vercel a "Site URL": `https://titan-os.vercel.app`
3. Agrega a "Redirect URLs":
   - `https://titan-os.vercel.app/auth/callback`
   - `https://titan-os.vercel.app/dashboard`

---

## Opción 2: Netlify (Alternativa GRATIS)

Similar a Vercel, también gratis y bueno para Next.js.

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Desplegar
netlify deploy --prod

# Agregar variables de entorno en Netlify Dashboard
```

---

## Opción 3: Railway (GRATIS con límites)

Railway es bueno si necesitas más control.

1. Ve a https://railway.app
2. Conecta tu repo de GitHub
3. Railway detecta Next.js automáticamente
4. Agrega variables de entorno
5. Deploy automático

---

## Opción 4: VPS Propio (Avanzado)

Si tienes un VPS (DigitalOcean, AWS, etc.):

```bash
# En tu servidor
git clone https://github.com/TU_USUARIO/titan-os.git
cd titan-os
npm install
npm run build

# Crear archivo .env.local con tus variables

# Instalar PM2 para mantener la app corriendo
npm install -g pm2

# Iniciar la app
pm2 start npm --name "titan-os" -- start

# Guardar configuración
pm2 save
pm2 startup
```

---

## 🔒 Seguridad en Producción

### 1. Variables de Entorno
Nunca subas `.env.local` a GitHub. Usa las variables de entorno del hosting.

### 2. HTTPS
Vercel/Netlify/Railway incluyen HTTPS gratis automáticamente.

### 3. Supabase RLS
Asegúrate de que las políticas RLS estén habilitadas (ya lo hicimos).

---

## 📊 Monitoreo

### Vercel Analytics (Gratis)
1. En Vercel Dashboard → Analytics
2. Ve estadísticas de uso, performance, etc.

### Supabase Logs
1. En Supabase Dashboard → Logs
2. Ve queries, errores, autenticación

---

## 🔄 Actualizaciones Automáticas

Con Vercel/Netlify/Railway:
1. Haces cambios en tu código
2. `git push`
3. Se despliega automáticamente
4. Todos los usuarios ven la nueva versión

---

## 💰 Costos

### Gratis Forever:
- **Vercel**: 100GB bandwidth/mes, builds ilimitados
- **Netlify**: 100GB bandwidth/mes, 300 build minutes/mes
- **Railway**: $5 crédito gratis/mes (suficiente para hobby)
- **Supabase**: 500MB database, 2GB bandwidth/mes

### Si creces:
- Vercel Pro: $20/mes (bandwidth ilimitado)
- Supabase Pro: $25/mes (8GB database, 250GB bandwidth)

---

## 🎯 Recomendación Final

**Para Titan OS, usa Vercel:**
1. Es gratis
2. Perfecto para Next.js
3. Deploy automático con GitHub
4. HTTPS incluido
5. CDN global (rápido en todo el mundo)
6. Analytics gratis

**Tiempo total de setup: 10 minutos**

---

## 📱 Después del Deploy

Una vez desplegado:
1. Abre tu URL en el móvil
2. Chrome/Safari te preguntará "¿Instalar app?"
3. Acepta
4. ¡Titan OS ahora está en tu teléfono como app nativa!

---

## 🆘 Troubleshooting

### Error: "Module not found"
```bash
npm install
git add .
git commit -m "Fix dependencies"
git push
```

### Error: "Environment variables not found"
Verifica que agregaste las variables en el dashboard del hosting.

### Error: "Supabase connection failed"
Verifica que agregaste la URL de producción en Supabase → URL Configuration.

---

## 🎉 ¡Listo!

Tu Titan OS estará disponible 24/7 en:
- Web: `https://titan-os.vercel.app`
- Móvil: Instalada como app
- Desktop: Instalada como app

**Sin costos, sin mantenimiento, siempre actualizada.**
