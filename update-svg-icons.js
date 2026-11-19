const fs = require('fs');
const path = require('path');

const b64 = fs.readFileSync(path.join(__dirname, 'icons', 'icon-512.png')).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="100" fill="#060608"/>
  <image href="data:image/png;base64,${b64}" width="512" height="512"/>
</svg>`;

const targets = [
  path.join(__dirname, 'icons', 'favicon.svg'),
  path.join(__dirname, 'icons', 'icon.svg'),
  path.join(__dirname, 'www', 'icons', 'favicon.svg'),
  path.join(__dirname, 'www', 'icons', 'icon.svg'),
  path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'icons', 'favicon.svg'),
  path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'icons', 'icon.svg')
];

for (const target of targets) {
  const dir = path.dirname(target);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(target, svg, 'utf8');
  console.log('Updated:', target);
}
