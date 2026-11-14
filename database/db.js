/**
 * FIRE SPICE - Database Management System
 * Engine: SQLite 3 via Node.js Native node:sqlite
 * Storage: database/users.db
 */

const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Ensure database directory exists
const DB_DIR = __dirname;
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'users.db');
const db = new DatabaseSync(DB_PATH);

// Optimize SQLite for high performance
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Initialize Tables & Indexes
 */
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      name TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      provider TEXT NOT NULL DEFAULT 'google',
      password_hash TEXT,
      tier TEXT DEFAULT 'Private Reserve Member',
      tier_badge TEXT DEFAULT 'Verified Member',
      dietary TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      member_since TEXT DEFAULT '2026',
      perks_json TEXT,
      avatar_url TEXT,
      google_sub TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      login_count INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS login_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      email TEXT NOT NULL,
      provider TEXT NOT NULL,
      status TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      error_reason TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      email TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_login_logs_time ON login_logs(login_time DESC);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
  `);
}

/**
 * Password Hashing Utilities
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return testHash === originalHash;
}

/**
 * Seed Default VIP Accounts
 */
function seedVIPs() {
  const checkStmt = db.prepare('SELECT COUNT(*) AS count FROM users');
  const result = checkStmt.get();
  
  if (result.count === 0) {
    console.log('[Database] Seeding initial VIP patrons into SQLite users.db...');

    const insertUser = db.prepare(`
      INSERT INTO users (
        uid, email, name, first_name, last_name, phone, provider,
        password_hash, tier, tier_badge, dietary, notes, member_since, perks_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // 1. Lohith Vel (Google Verified VIP)
    insertUser.run(
      'G-VIP-001',
      'lohithvelsakthi@gmail.com',
      'Lohith Vel',
      'Lohith',
      'Vel',
      '+1 (555) 789-0199',
      'google',
      hashPassword('FireSpice2026!'),
      'VIP Diamond Patron',
      'Google Verified',
      'Chef Tasting Preference',
      'Owner & Founder Reservation Account',
      '2026',
      JSON.stringify([
        'Google Verified Priority Sanctuary Allocation',
        'Direct Head Chef Consultation',
        'Complimentary Dom Pérignon Vintage Flute',
        'Private Skyline Lounge Key'
      ])
    );

    // 2. Elena Vance (Haute Gastronomie Connoisseur)
    insertUser.run(
      'USR-VIP-002',
      'elena.vance@luxury.dining',
      'Elena Vance',
      'Elena',
      'Vance',
      '+1 (555) 345-6789',
      'email',
      hashPassword('LuxuryDining2026!'),
      'Haute Gastronomie Connoisseur',
      'Verified VIP',
      'Pescatarian • Truffle Emphasis',
      'Private Sommelier requested on each visit',
      '2025',
      JSON.stringify([
        'Guaranteed Chef Vault Table Access',
        'Sommelier Cellar Private Selection',
        'Custom Floral & Menu Inscription'
      ])
    );

    console.log('[Database] Seeded 2 default patrons successfully.');
  }
}

// Initialize tables and seed on module load
initSchema();
seedVIPs();

/**
 * Database Query Operations
 */

function findUserByEmail(email) {
  if (!email) return null;
  const stmt = db.prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE');
  return stmt.get(email.trim());
}

function findUserById(id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id);
}

function findUserByUid(uid) {
  const stmt = db.prepare('SELECT * FROM users WHERE uid = ?');
  return stmt.get(uid);
}

/**
 * Format user record for client consumption (strips sensitive password_hash)
 */
function sanitizeUser(user) {
  if (!user) return null;
  let perks = [];
  try {
    perks = user.perks_json ? JSON.parse(user.perks_json) : [];
  } catch (e) {
    perks = [];
  }

  return {
    id: user.uid,
    dbId: user.id,
    name: user.name,
    firstName: user.first_name || user.name.split(' ')[0],
    lastName: user.last_name || (user.name.split(' ').slice(1).join(' ') || 'User'),
    email: user.email,
    phone: user.phone || '',
    provider: user.provider,
    tier: user.tier,
    tierBadge: user.tier_badge,
    dietary: user.dietary || '',
    notes: user.notes || '',
    memberSince: user.member_since || '2026',
    perks: perks.length > 0 ? perks : [
      'Verified Sanctuary Reservation Access',
      'Sommelier Concierge Service',
      '1-Click Rapid Booking'
    ],
    lastLoginAt: user.last_login_at,
    loginCount: user.login_count
  };
}

/**
 * Google Authentication: Upsert User & Record Login
 */
function handleGoogleLogin({ email, name, firstName, lastName, phone, googleSub, avatarUrl, ip = '127.0.0.1', userAgent = '' }) {
  const cleanEmail = email.trim();
  let user = findUserByEmail(cleanEmail);

  if (!user) {
    // Generate new UID
    const uid = `G-${Math.floor(1000 + Math.random() * 9000)}`;
    const fName = firstName || (name ? name.split(' ')[0] : 'Google');
    const lName = lastName || (name ? name.split(' ').slice(1).join(' ') : 'Patron');
    const fullName = name || `${fName} ${lName}`.trim();

    const perks = [
      'Google Verified Priority Allocation',
      'Dedicated Sommelier Care',
      'Arrival Dom Pérignon Flute',
      '1-Click Instant Reservation'
    ];

    const insertStmt = db.prepare(`
      INSERT INTO users (
        uid, email, name, first_name, last_name, phone, provider,
        tier, tier_badge, perks_json, avatar_url, google_sub,
        last_login_at, login_count
      ) VALUES (?, ?, ?, ?, ?, ?, 'google', 'Google Verified Patron', 'Google Verified', ?, ?, ?, CURRENT_TIMESTAMP, 1)
    `);

    insertStmt.run(uid, cleanEmail, fullName, fName, lName, phone || '+1 (555) 789-0199', JSON.stringify(perks), avatarUrl || '', googleSub || '');
    user = findUserByEmail(cleanEmail);
  } else {
    // Update existing user login stats
    const updateStmt = db.prepare(`
      UPDATE users SET 
        last_login_at = CURRENT_TIMESTAMP,
        login_count = login_count + 1,
        name = COALESCE(?, name),
        avatar_url = COALESCE(?, avatar_url)
      WHERE id = ?
    `);
    updateStmt.run(name || user.name, avatarUrl || user.avatar_url, user.id);
    user = findUserById(user.id);
  }

  // Record audit log
  recordLoginLog({
    userId: user.id,
    email: user.email,
    provider: 'google',
    status: 'SUCCESS',
    ip,
    userAgent
  });

  const session = createSession(user);
  return { success: true, user: sanitizeUser(user), token: session.token };
}

/**
 * Email ID Registration: Create New Member
 */
function registerEmailUser({ email, password, firstName, lastName, phone, ip = '127.0.0.1', userAgent = '' }) {
  const cleanEmail = email.trim();
  const existing = findUserByEmail(cleanEmail);
  if (existing) {
    recordLoginLog({
      userId: existing.id,
      email: cleanEmail,
      provider: 'email',
      status: 'FAILED',
      ip,
      userAgent,
      errorReason: 'Email already registered'
    });
    return { success: false, message: 'An account with this email address already exists. Please sign in.' };
  }

  const fName = firstName ? firstName.trim() : 'Private';
  const lName = lastName ? lastName.trim() : 'Member';
  const fullName = `${fName} ${lName}`.trim();
  const uid = `USR-${Math.floor(2000 + Math.random() * 7999)}`;
  const passHash = password ? hashPassword(password) : null;

  const perks = [
    'Priority Sanctuary Table Allocation',
    'Sommelier Concierge Service',
    'Complimentary Welcome Flute'
  ];

  const insertStmt = db.prepare(`
    INSERT INTO users (
      uid, email, name, first_name, last_name, phone, provider,
      password_hash, tier, tier_badge, perks_json,
      last_login_at, login_count
    ) VALUES (?, ?, ?, ?, ?, ?, 'email', ?, 'Private Reserve Member', 'Verified Member', ?, CURRENT_TIMESTAMP, 1)
  `);

  insertStmt.run(uid, cleanEmail, fullName, fName, lName, phone || '', passHash, JSON.stringify(perks));
  const user = findUserByEmail(cleanEmail);

  recordLoginLog({
    userId: user.id,
    email: user.email,
    provider: 'email',
    status: 'SUCCESS',
    ip,
    userAgent
  });

  const session = createSession(user);
  return { success: true, user: sanitizeUser(user), token: session.token };
}

/**
 * Email ID Sign In: Verify & Record Login
 */
function authenticateEmailUser({ email, password, ip = '127.0.0.1', userAgent = '' }) {
  const cleanEmail = email.trim();
  const user = findUserByEmail(cleanEmail);

  if (!user) {
    recordLoginLog({
      userId: null,
      email: cleanEmail,
      provider: 'email',
      status: 'FAILED',
      ip,
      userAgent,
      errorReason: 'User not found'
    });
    return { success: false, message: 'Account not found. Please register or verify your email.' };
  }

  // If password is set in DB, verify it
  if (user.password_hash && password) {
    const valid = verifyPassword(password, user.password_hash);
    if (!valid) {
      recordLoginLog({
        userId: user.id,
        email: cleanEmail,
        provider: 'email',
        status: 'FAILED',
        ip,
        userAgent,
        errorReason: 'Invalid password'
      });
      return { success: false, message: 'Incorrect password. Please try again.' };
    }
  }

  // Update login stats
  db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP, login_count = login_count + 1 WHERE id = ?').run(user.id);

  recordLoginLog({
    userId: user.id,
    email: user.email,
    provider: 'email',
    status: 'SUCCESS',
    ip,
    userAgent
  });

  const updatedUser = findUserById(user.id);
  const session = createSession(updatedUser);
  return { success: true, user: sanitizeUser(updatedUser), token: session.token };
}

/**
 * Audit Logging
 */
function recordLoginLog({ userId, email, provider, status, ip = '127.0.0.1', userAgent = '', errorReason = '' }) {
  try {
    const stmt = db.prepare(`
      INSERT INTO login_logs (user_id, email, provider, status, ip_address, user_agent, error_reason)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(userId || null, email, provider, status, ip, userAgent.slice(0, 255), errorReason || null);
  } catch (err) {
    console.error('[Database] Failed to write login log:', err.message);
  }
}

/**
 * Session Management
 */
function createSession(user) {
  const token = 'fs_sess_' + crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  const stmt = db.prepare('INSERT INTO sessions (token, user_id, email, expires_at) VALUES (?, ?, ?, ?)');
  stmt.run(token, user.id, user.email, expiresAt);

  return { token, expiresAt };
}

function verifySession(token) {
  if (!token) return null;
  const stmt = db.prepare('SELECT s.*, u.* FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > CURRENT_TIMESTAMP');
  const record = stmt.get(token);
  if (!record) return null;
  return sanitizeUser(record);
}

function destroySession(token) {
  if (!token) return;
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

/**
 * Administrative & Inspection Queries
 */
function getAllUsers() {
  const stmt = db.prepare('SELECT id, uid, email, name, first_name, last_name, phone, provider, tier, tier_badge, created_at, last_login_at, login_count FROM users ORDER BY last_login_at DESC');
  return stmt.all();
}

function getRecentLogins(limit = 25) {
  const stmt = db.prepare(`
    SELECT l.id, l.email, l.provider, l.status, l.ip_address, l.login_time, l.error_reason, u.name
    FROM login_logs l
    LEFT JOIN users u ON l.user_id = u.id
    ORDER BY l.login_time DESC
    LIMIT ?
  `);
  return stmt.all(limit);
}

function getDatabaseStats() {
  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  const loginCount = db.prepare('SELECT COUNT(*) AS count FROM login_logs').get().count;
  const successLogins = db.prepare("SELECT COUNT(*) AS count FROM login_logs WHERE status = 'SUCCESS'").get().count;
  const activeSessions = db.prepare('SELECT COUNT(*) AS count FROM sessions WHERE expires_at > CURRENT_TIMESTAMP').get().count;

  let fileSizeBytes = 0;
  try {
    fileSizeBytes = fs.statSync(DB_PATH).size;
  } catch (e) {}

  return {
    engine: 'SQLite 3 (Node.js native node:sqlite)',
    dbPath: DB_PATH,
    dbFileSizeBytes: fileSizeBytes,
    totalUsers: userCount,
    totalLoginAttempts: loginCount,
    successfulLogins: successLogins,
    activeSessions: activeSessions
  };
}

module.exports = {
  db,
  DB_PATH,
  findUserByEmail,
  findUserById,
  findUserByUid,
  sanitizeUser,
  handleGoogleLogin,
  registerEmailUser,
  authenticateEmailUser,
  recordLoginLog,
  createSession,
  verifySession,
  destroySession,
  getAllUsers,
  getRecentLogins,
  getDatabaseStats
};
