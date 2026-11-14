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
    console.log('Synced bundle.js -> www/bundle.js');
  }
} catch (err) {
  console.error('SYNTAX/TRANSPILE ERROR:');
  console.error(err.message);
  process.exit(1);
}
