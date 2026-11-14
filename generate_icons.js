const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ICONS_DIR = path.join(__dirname, 'icons');
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// 1. Create scalable SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e1e28"/>
      <stop offset="60%" stop-color="#0e0e14"/>
      <stop offset="100%" stop-color="#060608"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#faebad"/>
      <stop offset="35%" stop-color="#d4af37"/>
      <stop offset="70%" stop-color="#aa8222"/>
      <stop offset="100%" stop-color="#f9e394"/>
    </linearGradient>
    <linearGradient id="goldSoft" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#aa8222" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#d4af37" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#faebad" stop-opacity="1"/>
    </linearGradient>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="100" fill="url(#bgGlow)"/>

  <!-- Outer Ambient Aura -->
  <circle cx="256" cy="256" r="224" fill="none" stroke="#d4af37" stroke-width="2" opacity="0.25"/>
  <circle cx="256" cy="256" r="216" fill="none" stroke="url(#goldGrad)" stroke-width="6" filter="url(#goldGlow)"/>
  <circle cx="256" cy="256" r="202" fill="none" stroke="url(#goldSoft)" stroke-width="1.8" opacity="0.65"/>
  <circle cx="256" cy="256" r="194" fill="none" stroke="#d4af37" stroke-width="1" stroke-dasharray="4 6" opacity="0.4"/>

  <!-- Crown / Flame Top Insignia -->
  <path d="M216 142 L256 112 L296 142 L276 172 L236 172 Z" fill="url(#goldGrad)"/>
  <circle cx="256" cy="106" r="6" fill="#fff" filter="url(#goldGlow)"/>
  <circle cx="216" cy="136" r="4.5" fill="#faebad"/>
  <circle cx="296" cy="136" r="4.5" fill="#faebad"/>

  <!-- Center Monogram "FS" -->
  <text x="256" y="295" font-family="'Cinzel', 'Times New Roman', serif" font-size="128" font-weight="800" text-anchor="middle" fill="url(#goldGrad)" letter-spacing="8" filter="url(#goldGlow)">FS</text>

  <!-- Banner / Ribbons -->
  <text x="256" y="348" font-family="'Cinzel', serif" font-size="22" font-weight="700" text-anchor="middle" fill="#f5f2ea" letter-spacing="7">FIRE SPICE</text>
  <text x="256" y="376" font-family="'Cormorant Garamond', serif" font-size="16" font-style="italic" text-anchor="middle" fill="#d4af37" letter-spacing="4">HAUTE GASTRONOMIE</text>

  <!-- Tri-Star Base -->
  <path d="M256 405 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1 z" fill="url(#goldGrad)"/>
  <path d="M226 408 l3 6 7 1 -5 5 1 7 -6 -4 -6 4 1 -7 -5 -5 7 -1 z" fill="url(#goldSoft)" opacity="0.8"/>
  <path d="M286 408 l3 6 7 1 -5 5 1 7 -6 -4 -6 4 1 -7 -5 -5 7 -1 z" fill="url(#goldSoft)" opacity="0.8"/>
</svg>`;

fs.writeFileSync(path.join(ICONS_DIR, 'icon.svg'), svgContent, 'utf8');
fs.writeFileSync(path.join(ICONS_DIR, 'favicon.svg'), svgContent, 'utf8');

// 2. High-Quality Pure-JS PNG Generator
function createPng(size, isMaskable = false) {
  const rowSize = size * 4 + 1;
  const rawData = Buffer.alloc(rowSize * size);
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2;

  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < size; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const normDist = dist / maxR;

      let r = 6, g = 6, b = 8, a = 255;

      // Maskable icons fill the entire canvas with dark luxury background
      if (!isMaskable && normDist > 0.98) {
        a = 0; // Transparent outside circle for standard icons
      } else {
        // Deep obsidian background gradient
        const bgFactor = Math.min(1, Math.max(0, 1 - normDist * 0.7));
        r = Math.round(18 * bgFactor + 6 * (1 - bgFactor));
        g = Math.round(18 * bgFactor + 6 * (1 - bgFactor));
        b = Math.round(26 * bgFactor + 8 * (1 - bgFactor));

        // Outer Gold Ring (normDist around 0.85 to 0.90)
        if (normDist >= 0.84 && normDist <= 0.89) {
          const goldShade = Math.sin((x + y) / size * Math.PI) * 0.3 + 0.7;
          r = Math.round(250 * goldShade);
          g = Math.round(210 * goldShade);
          b = Math.round(75 * goldShade);
        } else if (normDist >= 0.81 && normDist <= 0.825) {
          r = 212; g = 175; b = 55;
        } else if (normDist > 0.89 && normDist < 0.94) {
          // Soft outer glow
          const glow = (1 - (normDist - 0.89) / 0.05) * 0.3;
          r = Math.min(255, r + Math.round(212 * glow));
          g = Math.min(255, g + Math.round(175 * glow));
          b = Math.min(255, b + Math.round(55 * glow));
        }

        // Center Monogram Drawing ("F" and "S")
        // Relative coordinates from -1 to 1
        const rx = dx / (size * 0.35);
        const ry = dy / (size * 0.35);

        // Draw "F" (left side: -0.6 to -0.1)
        const isFVertical = (rx >= -0.55 && rx <= -0.42 && ry >= -0.45 && ry <= 0.45);
        const isFTopBar = (rx >= -0.45 && rx <= -0.08 && ry >= -0.45 && ry <= -0.32);
        const isFMidBar = (rx >= -0.45 && rx <= -0.16 && ry >= -0.06 && ry <= 0.06);

        // Draw "S" (right side: 0.08 to 0.55)
        const isSTop = (rx >= 0.12 && rx <= 0.52 && ry >= -0.45 && ry <= -0.32);
        const isSUpLeft = (rx >= 0.12 && rx <= 0.25 && ry >= -0.35 && ry <= -0.05);
        const isSMid = (rx >= 0.15 && rx <= 0.48 && ry >= -0.06 && ry <= 0.06);
        const isSDownRight = (rx >= 0.38 && rx <= 0.52 && ry >= 0.02 && ry <= 0.36);
        const isSBot = (rx >= 0.12 && rx <= 0.48 && ry >= 0.32 && ry <= 0.45);

        // Small top crown triangle
        const isCrown = (Math.abs(rx) <= (0.25 - (ry + 0.65) * 0.8) && ry >= -0.75 && ry <= -0.55);

        if (isFVertical || isFTopBar || isFMidBar || isSTop || isSUpLeft || isSMid || isSDownRight || isSBot || isCrown) {
          // Shimmering 24K Gold gradient
          const shine = Math.sin((x - y) / size * 2.5) * 0.25 + 0.75;
          r = Math.min(255, Math.round(250 * shine));
          g = Math.min(255, Math.round(220 * shine));
          b = Math.min(255, Math.round(95 * shine));
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcVal = zlib.crc32(Buffer.concat([typeBuf, data]));
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crcVal, 0);
    return Buffer.concat([len, typeBuf, data, crc]);
  }

  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

console.log('Generating PWA Icons...');
fs.writeFileSync(path.join(ICONS_DIR, 'icon-192.png'), createPng(192));
console.log('Generated icon-192.png');
fs.writeFileSync(path.join(ICONS_DIR, 'icon-512.png'), createPng(512));
console.log('Generated icon-512.png');
fs.writeFileSync(path.join(ICONS_DIR, 'icon-maskable.png'), createPng(512, true));
console.log('Generated icon-maskable.png');
fs.writeFileSync(path.join(ICONS_DIR, 'apple-touch-icon.png'), createPng(180));
console.log('Generated apple-touch-icon.png');
console.log('All icons generated successfully!');

