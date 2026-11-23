const fs = require('fs');

const babelSource = fs.readFileSync('babel.min.js', 'utf8');

const context = {
  window: {},
  self: {},
  navigator: { userAgent: 'node' }
};

const vm = require('vm');
vm.createContext(context);
vm.runInContext(babelSource, context);

const Babel = context.Babel || context.window.Babel;

const appJsx = fs.readFileSync('app.jsx', 'utf8');

try {
  console.log('Transpiling app.jsx with React preset (classic runtime: React.createElement)...');
  const result = Babel.transform(appJsx, {
    presets: [
      ['react', { runtime: 'classic' }]
    ],
    filename: 'app.jsx'
  });
  
  fs.writeFileSync('bundle.js', result.code, 'utf8');
  console.log('Transpilation SUCCESSFUL!');
  console.log('bundle.js generated, size:', result.code.length, 'bytes');

  // Sync to www for Capacitor Android if directory exists
  if (fs.existsSync('www')) {
    fs.writeFileSync('www/bundle.js', result.code, 'utf8');
    if (fs.existsSync('index.html')) fs.copyFileSync('index.html', 'www/index.html');
    if (fs.existsSync('styles.css')) fs.copyFileSync('styles.css', 'www/styles.css');

    // Sync EmailJS vendor file so it's available inside the APK
    const emailjsSrc = 'vendor/emailjs.min.js';
    const emailjsDst = 'www/vendor/emailjs.min.js';
    if (fs.existsSync(emailjsSrc)) {
      if (!fs.existsSync('www/vendor')) fs.mkdirSync('www/vendor', { recursive: true });
      fs.copyFileSync(emailjsSrc, emailjsDst);
    }

    // Sync logo and icons
    if (fs.existsSync('logo.png')) fs.copyFileSync('logo.png', 'www/logo.png');
    if (fs.existsSync('icons')) {
      if (!fs.existsSync('www/icons')) fs.mkdirSync('www/icons', { recursive: true });
      fs.readdirSync('icons').forEach(file => {
        fs.copyFileSync(`icons/${file}`, `www/icons/${file}`);
      });
    }

    if (fs.existsSync('sw.js')) fs.copyFileSync('sw.js', 'www/sw.js');
    if (fs.existsSync('manifest.json')) fs.copyFileSync('manifest.json', 'www/manifest.json');

    console.log('Synced bundle.js, index.html, styles.css, sw.js, manifest.json, vendor/emailjs.min.js, logo.png, icons/ -> www/');
  }
} catch (err) {
  console.error('SYNTAX/TRANSPILE ERROR:');
  console.error(err.message);
  process.exit(1);
}
