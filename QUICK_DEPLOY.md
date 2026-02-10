# ⚡ Deploy Rápido en 5 Minutos

## Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

## Paso 2: Login en Vercel

```bash
vercel login
```

Se abrirá el navegador para que inicies sesión.

## Paso 3: Deploy

```bash
cd titan-os
vercel
```

Responde las preguntas:
- **Set up and deploy?** → Yes
- **Which scope?** → Tu cuenta
- **Link to existing project?** → No
- **Project name?** → titan-os (o el que quieras)
- **Directory?** → ./ (presiona Enter)
- **Override settings?** → No

## Paso 4: Agregar Variables de Entorno

Cuando pregunte por variables de entorno:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Pega tu URL de Supabase

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Pega tu Anon Key de Supabase
```

## Paso 5: Deploy a Producción

```bash
vercel --prod
```

## ¡Listo! 🎉

Tu app estará en: `https://titan-os-XXXXX.vercel.app`

---

## Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push
vercel --prod
```

O simplemente conecta tu repo de GitHub y Vercel desplegará automáticamente cada push.

---

## Alternativa: Deploy desde GitHub (Más fácil)

1. Sube tu código a GitHub
2. Ve a https://vercel.com/new
3. Importa tu repositorio
4. Agrega las variables de entorno en el dashboard
5. Click "Deploy"
6. ¡Listo! Deploy automático en cada push

---

## Configurar Dominio Personalizado

En Vercel Dashboard:
1. Settings → Domains
2. Add Domain
3. Sigue las instrucciones para configurar DNS

Ejemplo: `titan-os.com` → Apunta a Vercel

---

## Monitoreo

- **Analytics**: https://vercel.com/dashboard/analytics
- **Logs**: https://vercel.com/dashboard/logs
- **Performance**: Vercel te muestra métricas automáticamente

---

## Costo: $0 💰

El plan gratuito incluye:
- 100GB bandwidth/mes
- Builds ilimitados
- HTTPS gratis
- CDN global
- Deploy automático

Suficiente para miles de usuarios.
