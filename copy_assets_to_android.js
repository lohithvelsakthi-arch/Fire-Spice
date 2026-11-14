const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const targetDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`Copied ${path.basename(src)} -> assets/`);
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach(file => {
    const s = path.join(src, file);
    const d = path.join(dest, file);
    if (fs.statSync(s).isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  });
  console.log(`Copied directory ${path.basename(src)}/ -> assets/`);
}

// Copy web assets
copyFile(path.join(srcDir, 'index.html'), path.join(targetDir, 'index.html'));
copyFile(path.join(srcDir, 'bundle.js'), path.join(targetDir, 'bundle.js'));
copyFile(path.join(srcDir, 'styles.css'), path.join(targetDir, 'styles.css'));
copyFile(path.join(srcDir, 'manifest.json'), path.join(targetDir, 'manifest.json'));

copyDir(path.join(srcDir, 'vendor'), path.join(targetDir, 'vendor'));
copyDir(path.join(srcDir, 'icons'), path.join(targetDir, 'icons'));

console.log('All web assets successfully synced into android/app/src/main/assets/!');

