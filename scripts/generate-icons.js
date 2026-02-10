const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// SVG del icono de Titan OS
const iconSVG = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#000000"/>
  <path d="M256 96L176 176H216V256H136V296H216V416H296V296H376V256H296V176H336L256 96Z" fill="#22D3EE"/>
  <circle cx="256" cy="256" r="180" stroke="#22D3EE" stroke-width="8" fill="none"/>
</svg>
`;

const publicDir = path.join(__dirname, '..', 'public');

async function generateIcons() {
  try {
    console.log('Generando iconos PWA...');
    
    // Generar icon-192.png
    await sharp(Buffer.from(iconSVG))
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));
    console.log('✓ icon-192.png generado');
    
    // Generar icon-512.png
    await sharp(Buffer.from(iconSVG))
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));
    console.log('✓ icon-512.png generado');
    
    // Generar apple-touch-icon.png
    await sharp(Buffer.from(iconSVG))
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✓ apple-touch-icon.png generado');
    
    console.log('\n¡Iconos PWA generados exitosamente! 🎉');
  } catch (error) {
    console.error('Error generando iconos:', error);
    process.exit(1);
  }
}

generateIcons();
