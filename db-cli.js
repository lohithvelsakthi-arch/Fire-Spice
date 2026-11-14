#!/usr/bin/env node
/**
 * FIRE SPICE - Database Administration CLI
 * Use this command-line tool to inspect and manage user logins, sessions, and patron accounts.
 *
 * Usage:
 *   node db-cli.js users      - List all registered patrons and login counts
 *   node db-cli.js logins     - View recent login audit log records
 *   node db-cli.js stats      - Display database metrics and engine status
 *   node db-cli.js sessions   - View active login sessions
 */

const db = require('./database/db.js');

const cmd = process.argv[2] || 'help';

function printHeader(title) {
  console.log('\n' + '='.repeat(68));
  console.log(`✨ FIRE SPICE • DATABASE MANAGEMENT SYSTEM ✨`);
  console.log(`   ${title}`);
  console.log('='.repeat(68));
}

switch (cmd.toLowerCase()) {
  case 'users':
  case 'list': {
    printHeader('REGISTERED PATRONS & USER ACCOUNTS');
    const users = db.getAllUsers();
    if (users.length === 0) {
      console.log('No registered users found.');
    } else {
      console.table(users.map(u => ({
        ID: u.uid,
        Name: u.name,
        Email: u.email,
        Provider: u.provider.toUpperCase(),
        Tier: u.tier_badge,
        Logins: u.login_count,
        'Last Login': u.last_login_at
      })));
    }
    console.log(`Total Patrons in Database: ${users.length}\n`);
    break;
  }

  case 'logins':
  case 'audit':
  case 'logs': {
    printHeader('RECENT LOGIN AUDIT TRAIL');
    const limit = parseInt(process.argv[3], 10) || 20;
    const logs = db.getRecentLogins(limit);
    if (logs.length === 0) {
      console.log('No login history found.');
    } else {
      console.table(logs.map(l => ({
        Time: l.login_time,
        Email: l.email,
        Name: l.name || '(Unregistered)',
        Provider: l.provider.toUpperCase(),
        Status: l.status,
        IP: l.ip_address,
        Reason: l.error_reason || 'OK'
      })));
    }
    console.log(`Showing ${logs.length} most recent login events.\n`);
    break;
  }

  case 'stats':
  case 'info': {
    printHeader('DATABASE HEALTH & METRICS');
    const stats = db.getDatabaseStats();
    console.log(`• Database Engine:      ${stats.engine}`);
    console.log(`• Storage File:         ${stats.dbPath}`);
    console.log(`• Database File Size:   ${(stats.dbFileSizeBytes / 1024).toFixed(1)} KB`);
    console.log(`• Total Users:          ${stats.totalUsers}`);
    console.log(`• Total Login Attempts: ${stats.totalLoginAttempts}`);
    console.log(`• Successful Logins:    ${stats.successfulLogins}`);
    console.log(`• Active Web Sessions:  ${stats.activeSessions}\n`);
    break;
  }

  case 'sessions': {
    printHeader('ACTIVE WEB SESSIONS');
    const sessions = db.db.prepare(`
      SELECT s.token, s.email, s.created_at, s.expires_at, u.name, u.provider
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.expires_at > CURRENT_TIMESTAMP
      ORDER BY s.created_at DESC
    `).all();
    if (sessions.length === 0) {
      console.log('No active sessions found.');
    } else {
      console.table(sessions.map(s => ({
        Patron: s.name,
        Email: s.email,
        Provider: s.provider.toUpperCase(),
        Token: s.token.slice(0, 16) + '...',
        Created: s.created_at,
        Expires: s.expires_at
      })));
    }
    console.log(`Active Sessions: ${sessions.length}\n`);
    break;
  }

  default:
    printHeader('HELP & AVAILABLE COMMANDS');
    console.log('Commands:');
    console.log('  node db-cli.js users      -> List all registered patron accounts');
    console.log('  node db-cli.js logins     -> View recent login audit trail');
    console.log('  node db-cli.js stats      -> Display database metrics and engine status');
    console.log('  node db-cli.js sessions   -> View currently active login sessions\n');
    console.log('Example:');
    console.log('  node db-cli.js users\n');
    break;
}
