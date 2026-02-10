# 📦 Subir Titan OS a GitHub

## Paso 1: Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `titan-os`
3. Descripción: `Sistema Operativo Personal - PWA completa para gestión de vida`
4. **NO** marques "Initialize with README" (ya tenemos uno)
5. Click en "Create repository"

## Paso 2: Conectar tu repositorio local

GitHub te mostrará comandos, pero aquí están listos:

```bash
cd titan-os

# Agregar el remote de GitHub (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/titan-os.git

# Renombrar la rama a main
git branch -M main

# Subir el código
git push -u origin main
```

## Paso 3: Verificar

Ve a `https://github.com/TU_USUARIO/titan-os` y deberías ver todo el código.

---

## 🔐 Configurar Secrets para Vercel (Opcional)

Si quieres deploy automático:

1. En GitHub: Settings → Secrets and variables → Actions
2. Agregar secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🚀 Deploy Automático con Vercel

### Opción 1: Desde Vercel Web

1. Ve a https://vercel.com/new
2. Click en "Import Git Repository"
3. Selecciona tu repo `titan-os`
4. Vercel detectará Next.js automáticamente
5. Agrega las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"
7. ¡Listo! En 2 minutos estará en línea

### Opción 2: Desde CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 📝 Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

Si conectaste Vercel, se desplegará automáticamente.

---

## 🎯 Resultado Final

- **Código**: `https://github.com/TU_USUARIO/titan-os`
- **App en vivo**: `https://titan-os.vercel.app` (o tu dominio)
- **Deploy automático**: Cada push a main = nueva versión en producción

---

## 🆘 Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/titan-os.git
```

### Error: "Permission denied"
Necesitas configurar SSH o usar HTTPS con token:
```bash
# Usar HTTPS con token
git remote set-url origin https://TU_TOKEN@github.com/TU_USUARIO/titan-os.git
```

### Error: "failed to push"
```bash
git pull origin main --rebase
git push -u origin main
```

---

## ✅ Checklist

- [ ] Repositorio creado en GitHub
- [ ] Código subido (`git push`)
- [ ] README.md visible en GitHub
- [ ] `.env.local` NO está en GitHub (verificar)
- [ ] Vercel conectado (opcional)
- [ ] Variables de entorno configuradas en Vercel
- [ ] App desplegada y funcionando

---

¡Listo! Titan OS ahora está en GitHub y listo para compartir con el mundo 🚀
