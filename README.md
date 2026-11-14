# FIRE SPICE • Haute Gastronomie & Golden Lounge

An ultra-luxury restaurant table reservation web application built with **React 18** and custom **Glassmorphism CSS**, featuring a rich **Black & Gold** aesthetic.

![Theme](https://img.shields.io/badge/Theme-Black%20%26%20Gold%20Luxury-D4AF37)
![Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20CSS3%20Glassmorphism-black)
![License](https://img.shields.io/badge/License-ISC-green)

---

## ✨ Features

- **Luxury Black & Gold Theme**: Obsidian Noir palettes, Imperial Gold typography, and ambient lighting.
- **Glassmorphic Finish**: Every button, card, and input is sculpted with multi-layered frosted glass (`backdrop-filter: blur()`), 1px gold beveled reflections, and animated glossy light-sweep highlights on hover.
- **Horizontal Rolling Background Ambiance**: Seamless continuous horizontal panoramic photo track showcasing fine-dining interiors, private wine vaults, and Michelin plating.
- **Ambiance Motion Controller**: Corner pill widget allowing guests to customize background speed (Gentle, Majestic, Pause) and dimming levels (Rich, Comfort, Deep Noir).
- **Interactive 2D Seating Map**: Clickable architectural floor plan with 12 distinct luxury tables across 4 dining zones (Golden Atrium, Velvet Booths, Skyline Terrace, Chef's Vault). Real-time availability tracking (Available, Selected, Reserved).
- **5-Step Reservation Journey**:
  1. **Date & Service**: Party size picker (1–10+), custom interactive calendar, and service hours (Sunset, Prime Dinner, Late Night).
  2. **Table Selection**: Interactive floor map with live perks, capacity limits, and minimum spend guarantee calculations.
  3. **Enhancements**: Dining occasion tags and curated add-ons (Imperial Osetra Caviar, Dom Pérignon Vintage Flutes, Grand Cru Wine Flights, Floral arrangements).
  4. **Guest Ledger**: Contact information, dietary preferences, and real-time itemized guarantee bill.
  5. **Digital VIP Pass**: Embossed boarding pass with custom canvas-rendered QR code, downloadable pass, and standard `.ics` (Apple/Google/Outlook) calendar file export.
- **Mandatory Google & Email Authentication Gate**:
  - **Launch Entrance Gate**: When the web application opens, visitors are immediately greeted with the Google Sign-In entrance dialog.
  - **Gated Table Reservations**: Table booking is strictly locked until the user signs up or logs in using their **Google Account** or verified **Email ID**.
  - **Google Account Chooser**: Includes instant 1-click Google authentication (`Lohith Vel - lohithvelsakthi@gmail.com`) as well as custom Gmail / Google account entry.
  - **Email ID Sign In & Registration**: Full alternative email sign in and member registration tabs.
  - **1-Click Pre-Fill (Step IV)**: Automatically secures and pre-fills the guest's Google Name and Email directly into the reservation ledger.
  - **Header Google Profile & Sign Out**: Displays verified Google badge/avatar with quick access to reservations and graceful sign out (which automatically re-locks the reservation gate).
  - **Session Persistence**: Sessions are securely saved in `localStorage` (`firespice_user`).
- **Progressive Web App (PWA) & Mobile Installation**:
  - **1-Click Native App Installation**: Installable on iOS (iPhone/iPad), Android, Windows, and macOS as a standalone application with dedicated home screen icon.
  - **Zero Browser Chrome**: Launches without URL bars, tabs, or address headers for a 100% full-screen immersive fine-dining experience.
  - **Offline Caching & Service Worker (`sw.js`)**: Caches core application shell, styles, and assets so the app boots instantaneously and reservations can be checked even with zero cellular signal.
  - **Custom High-Resolution App Icons (`icons/`)**: Features the iconic gold "FS" crest across standard (192x192, 512x512), maskable, SVG, and Apple touch icons.
  - **Web App Manifest (`manifest.json`)**: Configured with quick app shortcuts ("Reserve Table", "My Reservations", "Tasting Menu").
  - **Tactile Haptic Feedback**: Mobile vibration harmonics on table selections and confirmation actions via `navigator.vibrate`.
- **Dedicated SQLite 3 Login & User Database**:
  - **Native Zero-Dependency Database Engine**: Powered by Node.js native `node:sqlite` storing all records in a dedicated file (`database/users.db`).
  - **`users` Table**: Stores patron credentials, Google identity IDs (`google_sub`), user names, verified email addresses, password hashes (salted PBKDF2 via `node:crypto`), VIP tiers, dining perks, and total login counts.
  - **`login_logs` Audit Trail Table**: Logs every single login attempt in real-time with timestamp, provider (Google or Email), status (`SUCCESS` / `FAILED`), client IP address, and failure reasons.
  - **`sessions` Table**: Tracks active authenticated sessions with cryptographic tokens and expiration timestamps.
  - **Database Administration CLI (`db-cli.js`)**: Interactive command-line tool to inspect and manage users and login history (`npm run db`, `npm run db:logins`, `npm run db:stats`).
  - **In-App Live Database Inspector**: An interactive gold glassmorphic modal accessible from the header, user dropdown, and footer allowing patrons and administrators to inspect live database metrics, query registered users, and review the login audit trail directly in the browser.
- **Reservation Management**: Built-in modal backed by `localStorage` to look up, view, or cancel existing table reservations.
- **Synthesized Crystal Glass Chimes**: Realistic crystal clinks and champagne toast harmonics synthesized in real-time via the browser's Web Audio API (zero audio files required).
- **Winter Tasting Menu Compendium**: Filterable showcase of signature courses by Chef Marc Éléonore.

---

## 🚀 Getting Started

### Option 1: Direct Browser Launch
Simply double-click `index.html` or open it in any web browser. React 18 and Babel compile and run the application instantly with zero dependencies.

### Option 2: Run with Node.js
```bash
# Clone the repository
git clone https://github.com/lohithvelsakthi-arch/Fire-Spice.git
cd Fire-Spice

# Start the server
npm start
```
Then visit **`http://localhost:3000`** in your browser.

---

## 📁 Project Structure

```
├── manifest.json    # PWA Web App Manifest (standalone display, icons, shortcuts)
├── sw.js            # Service Worker (offline precaching & app shell acceleration)
├── icons/           # High-resolution PWA icons (192px, 512px, maskable, SVG, Apple)
├── generate_icons.js# Native script to generate PWA icons
├── database/
│   ├── db.js        # SQLite connection, schema, auth methods & audit logging
│   └── users.db     # Dedicated SQLite 3 database file for all user logins
├── db-cli.js        # Interactive command-line tool to inspect users & audit logs
├── index.html       # HTML5 entry point with instant luxury preloader & PWA meta
├── app.jsx          # React 18 component architecture & state source
├── bundle.js        # High-performance compiled JavaScript bundle
├── build.js         # Zero-config local transpiler (app.jsx -> bundle.js)
├── styles.css       # Luxury black & gold glassmorphism stylesheet
├── server.js        # Lightweight Node HTTP server with database API endpoints
├── vendor/          # Self-hosted React 18 & ReactDOM production libraries
├── package.json     # Project configuration & npm scripts (build, start, db, icons)
└── README.md        # Documentation
```

---

## 📜 License
ISC License © 2026 FIRE SPICE RESTAURANT GROUP.

