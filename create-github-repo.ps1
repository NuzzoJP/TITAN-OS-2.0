# Script para crear repositorio en GitHub y subir Titan OS
# Ejecutar: .\create-github-repo.ps1

Write-Host "🚀 Creando repositorio Titan OS en GitHub..." -ForegroundColor Cyan

# Verificar si gh está instalado
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "Por favor, reinicia la terminal y ejecuta: gh auth login" -ForegroundColor Yellow
    exit 1
}

# Verificar autenticación
Write-Host "Verificando autenticación de GitHub..." -ForegroundColor Yellow
gh auth status
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ No estás autenticado en GitHub" -ForegroundColor Red
    Write-Host "Ejecuta: gh auth login" -ForegroundColor Yellow
    exit 1
}

# Crear repositorio en GitHub
Write-Host "Creando repositorio 'titan-os' en GitHub..." -ForegroundColor Yellow
gh repo create titan-os --public --description "Sistema Operativo Personal - PWA completa para gestión de vida" --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ ¡Repositorio creado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📦 Tu repositorio está en:" -ForegroundColor Cyan
    gh repo view --web
    Write-Host ""
    Write-Host "🎉 Próximos pasos:" -ForegroundColor Yellow
    Write-Host "1. Ve a https://vercel.com/new" -ForegroundColor White
    Write-Host "2. Importa tu repositorio 'titan-os'" -ForegroundColor White
    Write-Host "3. Agrega las variables de entorno" -ForegroundColor White
    Write-Host "4. Deploy" -ForegroundColor White
    Write-Host ""
    Write-Host "📱 Tu app estará en línea en 2 minutos!" -ForegroundColor Green
} else {
    Write-Host "❌ Error al crear el repositorio" -ForegroundColor Red
    Write-Host "Intenta manualmente:" -ForegroundColor Yellow
    Write-Host "1. Ve a https://github.com/new" -ForegroundColor White
    Write-Host "2. Nombre: titan-os" -ForegroundColor White
    Write-Host "3. Luego ejecuta:" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/TU_USUARIO/titan-os.git" -ForegroundColor Cyan
    Write-Host "   git push -u origin main" -ForegroundColor Cyan
}
