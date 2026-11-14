const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./database/db.js');

let port = parseInt(process.env.PORT, 10) || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jsx': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) { // 1MB limit
        req.destroy();
        reject(new Error('Payload Too Large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
  const userAgent = req.headers['user-agent'] || '';

  // =========================================================================
  // API Endpoints: Database Authentication & Management
  // =========================================================================
  if (pathname.startsWith('/api/')) {
    try {
      // 1. Google Authentication (Login / Upsert)
      if (pathname === '/api/auth/google-login' && req.method === 'POST') {
        const body = await readJsonBody(req);
        if (!body.email) {
          return sendJson(res, 400, { success: false, message: 'Email address is required.' });
        }
        const result = db.handleGoogleLogin({
          email: body.email,
          name: body.name,
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          googleSub: body.googleSub,
          avatarUrl: body.avatarUrl,
          ip: clientIp,
          userAgent
        });
        return sendJson(res, 200, result);
      }

      // 2. Email ID Member Login
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        const body = await readJsonBody(req);
        if (!body.email) {
          return sendJson(res, 400, { success: false, message: 'Email ID is required.' });
        }
        const result = db.authenticateEmailUser({
          email: body.email,
          password: body.password,
          ip: clientIp,
          userAgent
        });
        return sendJson(res, result.success ? 200 : 401, result);
      }

      // 3. Email ID Member Registration
      if (pathname === '/api/auth/register' && req.method === 'POST') {
        const body = await readJsonBody(req);
        if (!body.email || !body.firstName) {
          return sendJson(res, 400, { success: false, message: 'Name and valid email are required.' });
        }
        const result = db.registerEmailUser({
          email: body.email,
          password: body.password,
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          ip: clientIp,
          userAgent
        });
        return sendJson(res, result.success ? 201 : 400, result);
      }

      // 4. Verify Current Session Profile
      if (pathname === '/api/auth/me' && req.method === 'GET') {
        const authHeader = req.headers['authorization'] || '';
        const token = authHeader.replace(/^Bearer\s+/i, '') || parsedUrl.searchParams.get('token');
        if (!token) {
          return sendJson(res, 401, { success: false, message: 'No authorization token provided.' });
        }
        const user = db.verifySession(token);
        if (!user) {
          return sendJson(res, 401, { success: false, message: 'Session expired or invalid.' });
        }
        return sendJson(res, 200, { success: true, user });
      }

      // 5. Logout Session
      if (pathname === '/api/auth/logout' && req.method === 'POST') {
        const authHeader = req.headers['authorization'] || '';
        const token = authHeader.replace(/^Bearer\s+/i, '');
        if (token) db.destroySession(token);
        return sendJson(res, 200, { success: true, message: 'Signed out successfully.' });
      }

      // 6. Database Metrics & Health
      if (pathname === '/api/database/stats' && req.method === 'GET') {
        const stats = db.getDatabaseStats();
        return sendJson(res, 200, { success: true, stats });
      }

      // 7. Database Users List
      if (pathname === '/api/database/users' && req.method === 'GET') {
        const users = db.getAllUsers();
        return sendJson(res, 200, { success: true, users });
      }

      // 8. Database Login Audit Logs
      if (pathname === '/api/database/logins' && req.method === 'GET') {
        const limit = parseInt(parsedUrl.searchParams.get('limit'), 10) || 50;
        const logs = db.getRecentLogins(limit);
        return sendJson(res, 200, { success: true, logs });
      }

      return sendJson(res, 404, { success: false, message: 'API route not found' });
    } catch (err) {
      console.error('[API Error]:', err);
      return sendJson(res, 500, { success: false, message: err.message });
    }
  }

  // =========================================================================
  // Static File Serving
  // =========================================================================
  let filePath = path.join(ROOT, pathname === '/' ? 'index.html' : pathname);

  // Prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = MIME_TYPES[ext] || 'application/octet-stream';
    if (filePath.endsWith('manifest.json')) {
      contentType = 'application/manifest+json; charset=utf-8';
    }

    const headers = { 'Content-Type': contentType };
    if (filePath.endsWith('sw.js')) {
      headers['Service-Worker-Allowed'] = '/';
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    }

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
});

function startServer(p) {
  server.listen(p, () => {
    console.log(`\n======================================================`);
    console.log(`✨ FIRE SPICE Luxury Restaurant Application (React 18) ✨`);
    console.log(`🗄️  Database: SQLite 3 Engine Active (${db.DB_PATH})`);
    console.log(`🌐 Server:   http://localhost:${p}`);
    console.log(`📊 DB CLI:   Run 'node db-cli.js users' to inspect database`);
    console.log(`======================================================\n`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${port} is currently in use. Trying port ${port + 1}...`);
    port++;
    startServer(port);
  } else {
    console.error('Server error:', err);
  }
});

startServer(port);
