# 🍷 FIRE SPICE — Haute Gastronomie & Golden Lounge

> **Official Android App & Progressive Web App**
> Luxury restaurant reservation system with Obsidian Noir & 24K Imperial Gold glassmorphism design.

---

## 📲 Download the App

| Version | APK | Release Notes |
|---|---|---|
| **v1.0.7** *(Latest)* | [FireSpice-v1.0.7.apk](https://github.com/lohithvelsakthi-arch/Fire-Spice/releases/download/v1.0.7/FireSpice-v1.0.7.apk) | Customer booking confirmation emails |
| v1.0.6 | [FireSpice-v1.0.6.apk](https://github.com/lohithvelsakthi-arch/Fire-Spice/releases/download/v1.0.6/FireSpice-v1.0.6.apk) | Full mobile interactive polish |
| v1.0.5 | [FireSpice-v1.0.5.apk](https://github.com/lohithvelsakthi-arch/Fire-Spice/releases/download/v1.0.5/FireSpice-v1.0.5.apk) | Owner login notifications |
| v1.0.4 | [FireSpice-v1.0.4.apk](https://github.com/lohithvelsakthi-arch/Fire-Spice/releases/download/v1.0.4/FireSpice-v1.0.4.apk) | Mobile responsive layout |

**Install steps:**
1. Download the APK onto your Android device
2. Tap → Allow unknown apps → Tap **Install**
3. Launch **FIRE SPICE** from your app drawer

---

## ✨ Features

### 🍽️ Reservation System
- **5-Step Booking Console**: Date & Time → Seating → Enhancements → Guest Info → VIP Confirmation
- **Architectural Floor Plan**: Interactive 4-zone seating map (Golden Atrium, Obsidian Lounge, Garden Terrace, Private Cellar)
- **Dynamic Calendar & Time Slots**: Real-time date picker with prime/signature/late-night dining windows
- **Party Size Selector**: 1–12 guests with smart preset buttons
- **Experience Add-ons**: Champagne tower, tasting menu, sommelier pairing, cake service and more
- **Occasion Tags**: Anniversary, Birthday, Business, Proposal, Celebration and more
- **VIP Pass Code**: Auto-generated unique code (e.g. `FSP-7342-VIP`) shown on a luxury confirmation pass

### 🔐 Authentication
- **Google Sign-In**: One-click Google profile authentication
- **Email & Password**: Full registration and sign-in with SQLite backend
- **VIP Member Profiles**: Tier badges, perks, dining preferences, member since
- **Session Persistence**: Remembers login across app restarts via localStorage

### 📧 Email Notifications (via EmailJS)
- **Owner Login Alert**: `lohithvelsakthi@gmail.com` receives an email every time a patron signs in — includes name, email, login method, device type, IST timestamp
- **Customer Booking Confirmation**: Customer receives a branded luxury HTML email instantly after confirming a reservation — includes their VIP Pass Code, table details, date/time, occasion, total amount, and VIP perks

### 🗄️ Database (SQLite 3)
- **Node.js Native SQLite**: `node:sqlite` engine — no external dependencies
- **Tables**: `users`, `login_logs`, `sessions`
- **Login Audit Trail**: Every sign-in logged with IP, user-agent, timestamp, provider
- **In-App Database Inspector**: Live view of all patrons and login history

### 📱 Mobile & PWA
- **Capacitor 8 Android**: Native Android app via `BridgeActivity`
- **Mobile Responsive**: Fluid layouts, 44px touch targets, gold press feedback, bottom-sheet modals
- **Safe Area Insets**: Notch and gesture navigation bar support
- **PWA Ready**: Service worker, offline caching, installable on iOS/Android browser
- **Ambient Ambiance Controller**: Collapsible gold floating controller for background atmosphere settings

### 🎨 Design System
- **Obsidian Noir** (`#060608`) background with layered glassmorphism
- **24K Imperial Gold** (`#d4af37`) gradient accent system
- **Cinzel Serif** branding with **Cormorant Garamond** editorial text
- **Rolling Gallery**: Animated background restaurant imagery ribbon
- **Luxury Preloader**: Animated gold crest with shimmer bar

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (via Babel transpilation, no bundler) |
| Styling | Custom CSS — Glassmorphism Design System |
| Database | SQLite 3 (`node:sqlite`) |
| Backend | Node.js HTTP server (`server.js`) |
| Android | Capacitor 8 + BridgeActivity |
| Email | EmailJS (client-side, no server required) |
| CI/CD | GitHub Actions → Android Debug APK |

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Build React app (transpiles app.jsx → bundle.js, syncs to www/)
npm run build

# Start the server (SQLite backend + static file serving)
node server.js
# → http://localhost:3000

# Sync to Android assets
npx cap sync android

# Check Android config
npx cap doctor android
```

---

## 📁 Project Structure

```
Fire-Spice/
├── app.jsx              ← React 18 application (all components)
├── styles.css           ← Luxury glassmorphism design system
├── index.html           ← Entry point with mobile viewport config
├── build.js             ← Custom Babel transpiler + www sync
├── bundle.js            ← Generated output (do not edit)
├── server.js            ← Node.js HTTP + API server
├── database/
│   ├── db.js            ← SQLite schema, auth, session management
│   └── users.db         ← SQLite database file (auto-created)
├── vendor/
│   ├── react.production.min.js
│   ├── react-dom.production.min.js
│   └── emailjs.min.js   ← EmailJS SDK (bundled for offline APK)
├── www/                 ← Capacitor web assets (auto-synced)
├── android/             ← Capacitor Android project
│   └── app/
│       ├── build.gradle
│       └── src/main/java/com/firespice/restaurant/
│           └── MainActivity.java
└── .github/workflows/
    └── build-apk.yml    ← GitHub Actions CI → APK builder
```

---

## 📧 EmailJS Configuration

Three credentials are required in `app.jsx` (lines 15–19):

```javascript
const EMAILJS_PUBLIC_KEY          = 'your_public_key';
const EMAILJS_SERVICE_ID          = 'service_cvkn78a';     // Gmail service
const EMAILJS_TEMPLATE_ID         = 'template_j1vh2wd';    // Owner login alert
const EMAILJS_BOOKING_TEMPLATE_ID = 'template_0td4ijk';    // Customer confirmation
const OWNER_EMAIL                 = 'lohithvelsakthi@gmail.com';
```

| Template | ID | Triggered When |
|---|---|---|
| Owner Login Alert | `template_j1vh2wd` | Any patron signs in |
| Customer Booking Confirmation | `template_0td4ijk` | Reservation confirmed |

**Free plan:** 200 emails/month — sufficient for a restaurant app.

---

## 🔄 Release History

| Version | Date | Highlights |
|---|---|---|
| v1.0.7 | Nov 2026 | Customer booking confirmation email with VIP pass code |
| v1.0.6 | Nov 2026 | Full mobile touch interactivity, 44px targets, bottom-sheet modals |
| v1.0.5 | Nov 2026 | Owner login email notifications via EmailJS |
| v1.0.4 | Nov 2026 | Mobile responsive layout, safe area insets, collapsible ambiance controller |
| v1.0.3 | Nov 2026 | Capacitor 8 BridgeActivity, blank screen fix, SDK 36 |
| v1.0.2 | Nov 2026 | Google Auth, SQLite backend, login audit trail |
| v1.0.1 | Nov 2026 | PWA, floor plan, tasting menu |
| v1.0.0 | Nov 2026 | Initial release |

---

## 📄 License

Private — FIRE SPICE Restaurant. All rights reserved.
