#!/usr/bin/env node

// Script para gerar ícones PNG para PWA
// Execute com: node scripts/generate-pwa-icons.cjs

const fs = require("fs");
const path = require("path");

// Ícone SVG base do alaganao
const iconSVG = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="dropGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background Circle -->
  <circle cx="256" cy="256" r="240" fill="url(#waterGradient)" stroke="#1e40af" stroke-width="8"/>
  
  <!-- Water Drop Shape -->
  <path d="M256 120 C200 180, 200 240, 256 280 C312 240, 312 180, 256 120 Z" fill="url(#dropGradient)" opacity="0.9"/>
  
  <!-- Wave Pattern -->
  <path d="M120 300 Q180 280, 240 300 Q300 320, 360 300 Q420 280, 480 300 L480 400 Q420 380, 360 400 Q300 420, 240 400 Q180 380, 120 400 Z" fill="#ffffff" opacity="0.2"/>
  
  <!-- Community Dots -->
  <circle cx="180" cy="220" r="12" fill="#ffffff" opacity="0.8"/>
  <circle cx="332" cy="220" r="12" fill="#ffffff" opacity="0.8"/>
  <circle cx="256" cy="180" r="8" fill="#ffffff" opacity="0.6"/>
  
  <!-- Alert Triangle -->
  <path d="M256 320 L276 360 L236 360 Z" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <circle cx="256" cy="345" r="3" fill="#f59e0b"/>
  <rect x="254" y="330" width="4" height="8" fill="#f59e0b"/>
</svg>`;

// Tamanhos necessários para PWA
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Ícones para shortcuts
const shortcutIcons = {
  "map-shortcut": `
    <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
      <rect width="96" height="96" rx="20" fill="#2563eb"/>
      <path d="M24 28 L72 28 L72 68 L24 68 Z" fill="#ffffff" opacity="0.2"/>
      <circle cx="48" cy="48" r="8" fill="#ffffff"/>
      <path d="M48 40 L48 56 M40 48 L56 48" stroke="#2563eb" stroke-width="2"/>
    </svg>`,

  "report-shortcut": `
    <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
      <rect width="96" height="96" rx="20" fill="#dc2626"/>
      <path d="M48 20 L64 44 L32 44 Z" fill="#ffffff"/>
      <circle cx="48" cy="38" r="2" fill="#dc2626"/>
      <rect x="46" y="28" width="4" height="8" fill="#dc2626"/>
    </svg>`,

  "alert-shortcut": `
    <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
      <rect width="96" height="96" rx="20" fill="#f59e0b"/>
      <path d="M48 24 L72 64 L24 64 Z" fill="#ffffff" stroke="#f59e0b" stroke-width="2"/>
      <circle cx="48" cy="56" r="2" fill="#f59e0b"/>
      <rect x="46" y="40" width="4" height="12" fill="#f59e0b"/>
    </svg>`,

  "donation-shortcut": `
    <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
      <rect width="96" height="96" rx="20" fill="#059669"/>
      <path d="M32 42 Q32 32, 42 32 Q48 32, 48 38 Q48 32, 54 32 Q64 32, 64 42 Q64 52, 48 64 Q32 52, 32 42 Z" fill="#ffffff"/>
    </svg>`,
};

// Função para criar diretórios se não existirem
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Função para gerar ícone SVG de tamanho específico
function generateIconSVG(size) {
  return iconSVG
    .replace(/width="512"/, `width="${size}"`)
    .replace(/height="512"/, `height="${size}"`);
}

function main() {
  const iconsDir = path.join(process.cwd(), "public", "icons");
  ensureDir(iconsDir);

  console.log("🎨 Gerando ícones PWA...");

  // Gerar ícones principais
  sizes.forEach((size) => {
    const svgContent = generateIconSVG(size);
    const fileName = `icon-${size}x${size}.svg`;
    const filePath = path.join(iconsDir, fileName);

    fs.writeFileSync(filePath, svgContent);
    console.log(`✅ Gerado: ${fileName}`);
  });

  // Gerar ícones de shortcuts
  Object.entries(shortcutIcons).forEach(([name, svg]) => {
    const fileName = `${name}.svg`;
    const filePath = path.join(iconsDir, fileName);

    fs.writeFileSync(filePath, svg);
    console.log(`✅ Gerado: ${fileName}`);
  });

  // Gerar favicon na raiz
  const faviconPath = path.join(process.cwd(), "public", "favicon.svg");
  fs.writeFileSync(faviconPath, generateIconSVG(32));
  console.log("✅ Gerado: favicon.svg");

  console.log("\n🎉 Todos os ícones PWA foram gerados com sucesso!");
  console.log("\n📝 Para produção, considere converter para PNG usando:");
  console.log("   - https://realfavicongenerator.net/");
  console.log(
    "   - https://progressier.com/pwa-icons-and-ios-splash-screen-generator"
  );
}

if (require.main === module) {
  main();
}

module.exports = { generateIconSVG, shortcutIcons };
