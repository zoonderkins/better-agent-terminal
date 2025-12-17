const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const toIco = require('to-ico');

const assetsDir = path.join(__dirname, '..', 'assets');
const svgPath = path.join(assetsDir, 'icon.svg');

async function generateIcons() {
  console.log('Generating icons from SVG...');

  // Generate PNG at different sizes
  const sizes = [16, 32, 48, 64, 128, 256, 512];

  for (const size of sizes) {
    const outputPath = path.join(assetsDir, `icon-${size}.png`);
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: icon-${size}.png`);
  }

  // Generate main icon.png (256x256)
  await sharp(svgPath)
    .resize(256, 256)
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));
  console.log('Generated: icon.png');

  // Generate ICO from multiple sizes
  const icoSizes = [16, 32, 48, 256];
  const pngBuffers = await Promise.all(
    icoSizes.map(size =>
      sharp(svgPath)
        .resize(size, size)
        .png()
        .toBuffer()
    )
  );

  const icoBuffer = await toIco(pngBuffers);
  fs.writeFileSync(path.join(assetsDir, 'icon.ico'), icoBuffer);
  console.log('Generated: icon.ico');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
