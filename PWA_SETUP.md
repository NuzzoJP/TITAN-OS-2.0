# Titan OS - Progressive Web App (PWA) Setup

## ✅ Configuración Completada

Titan OS ahora es una **Progressive Web App** que funciona tanto en navegador como app instalable en móvil.

## 📱 Características PWA

- ✅ **Instalable**: Se puede instalar en el teléfono como una app nativa
- ✅ **Offline Ready**: Funciona sin conexión (con service worker)
- ✅ **Responsive**: Se adapta a cualquier tamaño de pantalla
- ✅ **App-like**: Pantalla completa sin barra del navegador
- ✅ **Fast**: Carga instantánea con caché
- ✅ **Secure**: Solo funciona con HTTPS

## 🎨 Iconos de la App

Necesitas crear los iconos PNG a partir del SVG:

### Opción 1: Usar una herramienta online
1. Ve a https://realfavicongenerator.net/
2. Sube el archivo `public/icon.svg`
3. Descarga los iconos generados
4. Renombra y coloca:
   - `icon-192.png` en `public/`
   - `icon-512.png` en `public/`

### Opción 2: Usar ImageMagick (si lo tienes instalado)
```bash
# Desde la carpeta titan-os/public
convert icon.svg -resize 192x192 icon-192.png
convert icon.svg -resize 512x512 icon-512.png
```

### Opción 3: Usar Figma/Photoshop
1. Abre `icon.svg` en Figma o Photoshop
2. Exporta como PNG en 192x192px y 512x512px
3. Guarda como `icon-192.png` y `icon-512.png` en `public/`

## 📲 Cómo Instalar en el Teléfono

### Android (Chrome):
1. Abre la app en Chrome
2. Toca el menú (⋮) → "Agregar a pantalla de inicio"
3. Confirma la instalación
4. ¡Listo! Ahora tienes Titan OS como app

### iOS (Safari):
1. Abre la app en Safari
2. Toca el botón de compartir (□↑)
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma
5. ¡Listo! Ahora tienes Titan OS como app

### Desktop (Chrome/Edge):
1. Abre la app en el navegador
2. Verás un ícono de instalación (+) en la barra de direcciones
3. Haz clic en "Instalar"
4. ¡Listo! Ahora tienes Titan OS como app de escritorio

## 🚀 Despliegue en Producción

Para que la PWA funcione correctamente, necesitas:

1. **HTTPS**: La app debe estar en un dominio con SSL
2. **Service Worker**: Ya está configurado automáticamente
3. **Manifest**: Ya está en `public/manifest.json`

### Opciones de Hosting:

#### Vercel (Recomendado):
```bash
npm install -g vercel
vercel login
vercel
```

#### Netlify:
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

#### Railway:
1. Conecta tu repo de GitHub
2. Railway detectará Next.js automáticamente
3. Deploy automático

## 🔧 Configuración Actual

- **Nombre**: Titan OS
- **Nombre Corto**: Titan OS
- **Color de Tema**: #22D3EE (Cyan)
- **Color de Fondo**: #000000 (Negro)
- **Modo de Pantalla**: Standalone (pantalla completa)
- **Orientación**: Portrait (vertical)

## 📝 Personalización

Para cambiar los colores o el nombre de la app, edita:
- `public/manifest.json` - Configuración de la PWA
- `app/layout.tsx` - Meta tags y configuración de Next.js

## 🐛 Troubleshooting

### La app no se puede instalar:
- Verifica que estés usando HTTPS (o localhost)
- Asegúrate de que los iconos PNG existan
- Revisa la consola del navegador para errores

### El service worker no funciona:
- En desarrollo está deshabilitado (normal)
- En producción se activa automáticamente
- Limpia el caché del navegador si hay problemas

### La app no se ve bien en móvil:
- Verifica que el viewport esté configurado
- Revisa que los estilos sean responsive
- Usa las DevTools de Chrome para simular móvil

## 📊 Testing

Para probar la PWA:

1. **Lighthouse** (Chrome DevTools):
   - F12 → Lighthouse → Generate report
   - Debe tener 100 en PWA

2. **PWA Builder**:
   - Ve a https://www.pwabuilder.com/
   - Ingresa tu URL
   - Verifica que pase todas las pruebas

3. **Mobile Testing**:
   - Usa Chrome DevTools → Toggle device toolbar
   - Prueba en diferentes tamaños de pantalla

## 🎯 Próximos Pasos

1. **Crear los iconos PNG** (192x192 y 512x512)
2. **Hacer build de producción**: `npm run build`
3. **Desplegar en Vercel/Netlify**
4. **Instalar en tu teléfono**
5. **¡Disfrutar de Titan OS como app nativa!**

---

**¡Titan OS ahora es una PWA completa!** 🚀
