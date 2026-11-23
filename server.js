const http = require('http');
const https = require('https');
const crypto = require('crypto');
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
  '.apk': 'application/vnd.android.package-archive',
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

/**
 * Razorpay Gateway Configuration & REST API Integration
 */
function getRazorpayConfig() {
  let config = {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    currency: process.env.RAZORPAY_CURRENCY || 'INR',
    businessName: 'FIRE SPICE'
  };
  const configPath = path.join(ROOT, 'razorpay-config.json');
  if (fs.existsSync(configPath)) {
    try {
      const fileData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (fileData.keyId) config.keyId = fileData.keyId.trim();
      if (fileData.keySecret) config.keySecret = fileData.keySecret.trim();
      if (fileData.currency) config.currency = fileData.currency.trim();
      if (fileData.businessName) config.businessName = fileData.businessName.trim();
    } catch (e) {
      console.warn('[Razorpay] Could not parse razorpay-config.json:', e.message);
    }
  }
  return config;
}

function getGPayConfig() {
  let config = {
    upiId: 'lohithvelsakthi-1@oksbi',
    payeeName: 'FIRE SPICE - Lohith Vel',
    currency: 'INR'
  };
  const configPath = path.join(ROOT, 'gpay-config.json');
  if (fs.existsSync(configPath)) {
    try {
      const fileData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (fileData.upiId) config.upiId = fileData.upiId.trim();
      if (fileData.payeeName) config.payeeName = fileData.payeeName.trim();
      if (fileData.currency) config.currency = fileData.currency.trim();
    } catch (e) {
      console.warn('[GPay] Could not parse gpay-config.json:', e.message);
    }
  }
  return config;
}

function callRazorpayApi(apiPath, method, data, keyId, keySecret) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const options = {
      hostname: 'api.razorpay.com',
      port: 443,
      path: apiPath,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            const desc = parsed.error ? (parsed.error.description || parsed.error.message) : `HTTP ${res.statusCode}`;
            reject(new Error(desc));
          }
        } catch (e) {
          reject(new Error(`Razorpay returned non-JSON response: ${body}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Razorpay network error: ${err.message}`));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
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

      // =====================================================================
      // 9. Razorpay Payment Gateway APIs
      // =====================================================================

      // 9a. Retrieve Razorpay Configuration Status & Public Key
      if (pathname === '/api/payment/config' && req.method === 'GET') {
        const rzpConfig = getRazorpayConfig();
        return sendJson(res, 200, {
          success: true,
          configured: Boolean(rzpConfig.keyId && rzpConfig.keySecret),
          keyId: rzpConfig.keyId || null,
          currency: rzpConfig.currency || 'INR',
          businessName: rzpConfig.businessName || 'FIRE SPICE'
        });
      }

      // 9b. Configure / Update Razorpay API Credentials
      if (pathname === '/api/payment/save-keys' && req.method === 'POST') {
        const body = await readJsonBody(req);
        const configPath = path.join(ROOT, 'razorpay-config.json');
        let current = {};
        if (fs.existsSync(configPath)) {
          try { current = JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch (e) {}
        }
        if (typeof body.keyId === 'string') current.keyId = body.keyId.trim();
        if (typeof body.keySecret === 'string') current.keySecret = body.keySecret.trim();
        if (typeof body.currency === 'string') current.currency = body.currency.trim();
        if (typeof body.businessName === 'string') current.businessName = body.businessName.trim();

        fs.writeFileSync(configPath, JSON.stringify(current, null, 2), 'utf8');
        return sendJson(res, 200, {
          success: true,
          message: 'Razorpay configuration updated successfully.',
          configured: Boolean(current.keyId && current.keySecret),
          keyId: current.keyId || null
        });
      }

      // 9c. Create Razorpay Payment Order
      if (pathname === '/api/payment/create-order' && req.method === 'POST') {
        const rzpConfig = getRazorpayConfig();
        if (!rzpConfig.keyId || !rzpConfig.keySecret) {
          return sendJson(res, 400, {
            success: false,
            configured: false,
            message: 'Razorpay API keys (Key ID and Key Secret) are not yet configured.'
          });
        }

        const body = await readJsonBody(req);
        const rawAmount = parseFloat(body.amount);
        if (isNaN(rawAmount) || rawAmount <= 0) {
          return sendJson(res, 400, { success: false, message: 'Valid payment amount is required.' });
        }

        // Razorpay accepts amounts in smallest currency subunits (paise for INR, cents for USD)
        const currency = (body.currency || rzpConfig.currency || 'INR').toUpperCase();
        const amountInSubunits = Math.round(rawAmount * 100);

        const orderPayload = {
          amount: amountInSubunits,
          currency: currency,
          receipt: `fs_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`,
          notes: {
            guestName: String(body.guestName || '').slice(0, 40),
            guestEmail: String(body.guestEmail || '').slice(0, 40),
            tableName: String(body.tableName || '').slice(0, 40),
            reservationCode: String(body.reservationCode || '').slice(0, 40)
          }
        };

        try {
          const order = await callRazorpayApi('/v1/orders', 'POST', orderPayload, rzpConfig.keyId, rzpConfig.keySecret);
          
          // Record in SQLite
          db.createPaymentOrder({
            orderId: order.id,
            amount: rawAmount,
            currency: currency,
            guestName: body.guestName,
            guestEmail: body.guestEmail,
            guestPhone: body.guestPhone,
            tableName: body.tableName,
            reservationCode: body.reservationCode
          });

          return sendJson(res, 200, {
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: rzpConfig.keyId
          });
        } catch (apiErr) {
          console.error('[Razorpay Order Creation Failed]:', apiErr.message);
          return sendJson(res, 502, {
            success: false,
            message: `Razorpay Order Error: ${apiErr.message}`
          });
        }
      }

      // 9d. Verify Razorpay Payment Signature
      if (pathname === '/api/payment/verify-payment' && req.method === 'POST') {
        const rzpConfig = getRazorpayConfig();
        const body = await readJsonBody(req);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, reservationCode } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return sendJson(res, 400, {
            success: false,
            message: 'Incomplete payment parameters: order_id, payment_id and signature are required.'
          });
        }

        const hmac = crypto.createHmac('sha256', rzpConfig.keySecret);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature === razorpay_signature) {
          // Signature matches! Update database status
          db.updatePaymentSuccess({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            reservationCode: reservationCode || null
          });

          return sendJson(res, 200, {
            success: true,
            verified: true,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            message: 'Razorpay payment verified successfully.'
          });
        } else {
          console.warn('[Razorpay Verification Failed]: Signature mismatch', {
            expected: generatedSignature,
            received: razorpay_signature
          });
          return sendJson(res, 400, {
            success: false,
            verified: false,
            message: 'Digital signature verification failed. Payment cannot be validated.'
          });
        }
      }

      // 9e. Database Payments List
      if (pathname === '/api/database/payments' && req.method === 'GET') {
        const limit = parseInt(parsedUrl.searchParams.get('limit'), 10) || 50;
        const payments = db.getAllPayments(limit);
        return sendJson(res, 200, { success: true, payments });
      }

      // =====================================================================
      // 10. Google Pay (GPay) / Direct UPI Payment APIs
      // =====================================================================

      // 10a. Retrieve Google Pay / UPI Config
      if (pathname === '/api/gpay/config' && req.method === 'GET') {
        const gpayConfig = getGPayConfig();
        return sendJson(res, 200, {
          success: true,
          upiId: gpayConfig.upiId || 'firespice@okaxis',
          payeeName: gpayConfig.payeeName || 'FIRE SPICE',
          currency: 'INR'
        });
      }

      // 10b. Save / Update Google Pay UPI ID
      if (pathname === '/api/gpay/save-config' && req.method === 'POST') {
        const body = await readJsonBody(req);
        const configPath = path.join(ROOT, 'gpay-config.json');
        let current = getGPayConfig();
        if (body.upiId) current.upiId = body.upiId.trim();
        if (body.payeeName) current.payeeName = body.payeeName.trim();

        fs.writeFileSync(configPath, JSON.stringify(current, null, 2), 'utf8');
        return sendJson(res, 200, {
          success: true,
          message: 'Google Pay UPI configuration saved successfully.',
          upiId: current.upiId
        });
      }

      // 10c. Record Verified Google Pay Transaction
      if (pathname === '/api/gpay/record-payment' && req.method === 'POST') {
        const body = await readJsonBody(req);
        const rawAmount = parseFloat(body.amount) || 5;
        const orderId = `GPAY_ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const paymentId = body.utr ? `GPAY_UTR_${body.utr}` : `GPAY_REF_${Date.now().toString(36).toUpperCase()}`;

        const recordRes = db.recordGPayPayment({
          orderId,
          paymentId,
          amount: rawAmount,
          guestName: body.guestName || '',
          guestEmail: body.guestEmail || '',
          guestPhone: body.guestPhone || '',
          tableName: body.tableName || '',
          reservationCode: body.reservationCode || '',
          utr: body.utr || 'VERIFIED_ON_GPAY'
        });

        return sendJson(res, 200, {
          success: true,
          orderId,
          paymentId,
          amount: rawAmount,
          currency: 'INR',
          message: 'Google Pay transaction successfully logged to SQLite database.'
        });
      }

      return sendJson(res, 404, { success: false, message: 'API route not found' });
    } catch (err) {
      console.error('[API Error]:', err);
      return sendJson(res, 500, { success: false, message: err.message });
    }
  }

  // =========================================================================
  // Direct APK Download Route (Redirects to Latest Cloud Build APK)
  // =========================================================================
  if (pathname === '/download/apk' || pathname === '/FireSpice.apk' || pathname === '/download/FireSpice.apk') {
    res.writeHead(302, {
      'Location': 'https://github.com/lohithvelsakthi-arch/Fire-Spice/releases/latest/download/FireSpice-v1.0.18.apk'
    });
    res.end();
    return;
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
