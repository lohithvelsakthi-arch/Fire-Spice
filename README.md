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
- **VIP Member Authentication & Private Reserve System**:
  - **VIP Sign In & Registration**: Elegant obsidian glass modal with tabbed sign-in and VIP Reserve onboarding.
  - **1-Click VIP Demo Profiles**: Instant testing access as *Lord Sterling (Imperial Gold VIP)* or *Elena Vance (Grand Cru Patron)*.
  - **Header Member Pill & Concierge Dropdown**: Real-time member avatar monogram, tier title, active privilege checklist, quick links to reservations, and graceful sign-out.
  - **1-Click Concierge Pre-Fill (Step IV)**: Automatic population of guest details, telephone, and dietary preferences directly from the member's profile with VIP priority table allocation applied.
  - **Session Persistence**: Saves member credentials and registered profiles securely in `localStorage`.
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
├── index.html       # HTML5 entry point & script loader
├── app.jsx          # React 18 component architecture & state
├── styles.css       # Luxury black & gold glassmorphism stylesheet
├── server.js        # Lightweight Node HTTP server with port fallback
├── package.json     # Project configuration & npm start script
└── README.md        # Documentation
```

---

## 📜 License
ISC License © 2026 FIRE SPICE RESTAURANT GROUP.

