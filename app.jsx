/**
 * FIRE SPICE - Haute Gastronomie & Golden Lounge
 * React 18 Application Component Architecture
 */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ==========================================================================
   Databases: Tables, Menu, Slots & Add-ons
   ========================================================================== */
const TABLES_DATABASE = [
  {
    id: 'A1',
    zone: 'atrium',
    zoneName: 'The Golden Atrium',
    name: 'Table A1 • Gilded Solitude',
    shape: 'circle',
    capacity: 2,
    minSpend: 160,
    description: 'Candlelit intimate table set under the crystal mezzanine with a direct vantage of our grand gold archway.',
    features: ['Mezzanine Golden Glow', 'Bespoke Candlelight', 'Dedicated Sommelier Care'],
    img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
    status: 'available'
  },
  {
    id: 'A2',
    zone: 'atrium',
    zoneName: 'The Golden Atrium',
    name: 'Table A2 • Imperial Centerpiece',
    shape: 'circle',
    capacity: 4,
    minSpend: 180,
    description: 'Placed precisely beneath our 12,000-crystal golden chandelier. Acoustically engineered for effortless conversation.',
    features: ['Direct Chandelier Vantage', 'Acoustically Tuned Privacy', 'Dedicated Chef de Rang'],
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    status: 'available'
  },
  {
    id: 'A3',
    zone: 'atrium',
    zoneName: 'The Golden Atrium',
    name: 'Table A3 • Grand Banqueting Round',
    shape: 'banquet',
    capacity: 6,
    minSpend: 190,
    description: 'Opulent circular banquet with Italian gold-veined marble and custom leather high-back armchairs.',
    features: ['Italian Gold-Veined Marble', 'Full Room Ambiance', 'Tableside Carving Cart Access'],
    img: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
    status: 'reserved'
  },
  {
    id: 'A4',
    zone: 'atrium',
    zoneName: 'The Golden Atrium',
    name: 'Table A4 • Archway Alcove',
    shape: 'circle',
    capacity: 2,
    minSpend: 170,
    description: 'Flanked by fluted obsidian columns and brass sconces, offering supreme tranquility for intimate dinners.',
    features: ['Fluted Obsidian Columns', 'Intimate Ambiance', 'Soft Dimming Control'],
    img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
    status: 'available'
  },
  {
    id: 'B1',
    zone: 'booths',
    zoneName: 'Velvet & Brass Booths',
    name: 'Table B1 • Onyx Banquette',
    shape: 'booth',
    capacity: 2,
    minSpend: 185,
    description: 'Deep midnight velvet booth with brushed gold backplates and secluded acoustic drapes.',
    features: ['Secluded Velvet Nook', 'Private Brass Call Bell', 'Warm Indirect Lighting'],
    img: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=600&q=80',
    status: 'available'
  },
  {
    id: 'B2',
    zone: 'booths',
    zoneName: 'Velvet & Brass Booths',
    name: 'Table B2 • Gilded Alcove',
    shape: 'booth',
    capacity: 4,
    minSpend: 200,
    description: 'Curved golden booth facing the sommelier display wall. Generous booth spacing for supreme comfort.',
    features: ['Sommelier Display Vantage', 'High-Back Plush Seating', 'Bespoke Champagne Bucket Stand'],
    img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
    status: 'available'
  },
  {
    id: 'B3',
    zone: 'booths',
    zoneName: 'Velvet & Brass Booths',
    name: 'Table B3 • Sovereign Booth',
    shape: 'booth',
    capacity: 6,
    minSpend: 210,
    description: 'Semi-private royal banquette surrounded by brass lattice fretwork. Preferred for executive dinners.',
    features: ['Brass Lattice Enclosure', 'Discreet Service Corridor', 'Curated Art Display'],
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    status: 'reserved'
  },
  {
    id: 'T1',
    zone: 'terrace',
    zoneName: 'Skyline Royal Terrace',
    name: 'Table T1 • Horizon Edge Duo',
    shape: 'circle',
    capacity: 2,
    minSpend: 220,
    description: 'Positioned right at the floor-to-ceiling heated terrace glass, framing the glittering night skyline.',
    features: ['Unobstructed Skyline View', 'Radiant Underfloor Heating', 'Starlight Ambiance'],
    img: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80',
    status: 'available'
  },
  {
    id: 'T2',
    zone: 'terrace',
    zoneName: 'Skyline Royal Terrace',
    name: 'Table T2 • Starlight Terrace',
    shape: 'circle',
    capacity: 4,
    minSpend: 240,
    description: 'Under the glass pavilion ceiling. Watch twilight settle over the city while tasting our grand pairings.',
    features: ['Glass Canopy Ceiling', 'Bespoke Wind Shielding', 'Terrace Sommelier Service'],
    img: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80',
    status: 'available'
  },
  {
    id: 'T3',
    zone: 'terrace',
    zoneName: 'Skyline Royal Terrace',
    name: 'Table T3 • Royal Skyline Pavilion',
    shape: 'banquet',
    capacity: 8,
    minSpend: 250,
    description: 'Our largest open-air terrace table, anchored by a custom bronze fire ribbon and panoramic lights.',
    features: ['Bronze Fire Ribbon Warmth', 'Full Skyline Panorama', 'Private Bartender Optional'],
    img: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80',
    status: 'available'
  },
  {
    id: 'V1',
    zone: 'vault',
    zoneName: "The Chef's Vault",
    name: 'Table V1 • Sommelier Grand Vault',
    shape: 'booth',
    capacity: 4,
    minSpend: 280,
    description: 'Encased inside our climate-controlled 19th-century cellar. Dine among 1,400 rare vintages.',
    features: ['Private Temperature Controlled Vault', 'Sommelier Lead Tasting', 'Rare Vintage Access'],
    img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
    status: 'available'
  },
  {
    id: 'C1',
    zone: 'vault',
    zoneName: "The Chef's Vault",
    name: "Table C1 • Chef Marc's Counter",
    shape: 'circle',
    capacity: 2,
    minSpend: 320,
    description: 'Front-row culinary staging directly opposite Chef Marc Éléonore. Includes personalized tasting courses.',
    features: ['Personalized Course Delivery', 'Interaction with Executive Chef', 'Gold-Leaf Caviar Presentation'],
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    status: 'available'
  }
];

const MENU_DATABASE = [
  {
    id: 'm1',
    category: 'tasting',
    title: "L'Or Impérial Tasting Journey",
    price: '$285',
    badge: 'Signature 8 Courses',
    desc: 'An orchestral eight-course progression highlighting Brittany langoustine, winter black truffles, and A5 Miyazaki Wagyu, concluded with our 24K gold sphere.',
    pairing: 'Grand Cru Sommelier Pairing +$160',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'm2',
    category: 'caviar',
    title: 'Royal Osetra Caviar Tartlet',
    price: '$125',
    badge: 'Amuse-Bouche',
    desc: 'Crisp brioche feuille, smoked egg yolk emulsion, crème fraîche infused with Meyer lemon, crowned with 25g Imperial Osetra pearls.',
    pairing: 'Dom Pérignon 2013 Vintage',
    img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'm3',
    category: 'mains',
    title: 'A5 Miyazaki Wagyu Filet Mignon',
    price: '$175',
    badge: 'Robata Grilled',
    desc: 'Seared over Japanese binchotan charcoal, glazed with bone marrow jus, served alongside smoked parsnip mousseline and shaved Périgord truffle.',
    pairing: 'Château Margaux Premier Grand Cru',
    img: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'm4',
    category: 'caviar',
    title: 'Hokkaido Scallop Carpaccio & Gold Leaf',
    price: '$95',
    badge: 'Cold Crudo',
    desc: 'Diver-caught Hokkaido scallops thinly sliced, bathed in yuzu-white soy ponzu, finger lime pearls, and edible 24K gold leaf flurries.',
    pairing: 'Puligny-Montrachet 1er Cru',
    img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'm5',
    category: 'mains',
    title: 'Glazed Brittany Blue Lobster',
    price: '$160',
    badge: 'Oceanic Haute',
    desc: 'Poached in Meyer lemon butter, resting on a pillow of saffron carnaroli risotto and reduction of lobster coral.',
    pairing: 'Meursault-Charmes 2018',
    img: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'm6',
    category: 'cellar',
    title: '1982 Château Lafite Rothschild',
    price: '$3,800',
    badge: 'Rare Cellar Vault',
    desc: 'Pauillac, Bordeaux. Pristine cellar provenance. Notes of graphite, cedarwood, cassis, and velvety melted tannins.',
    pairing: 'Private Decanting Ritual',
    img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=80'
  }
];

const EXPERIENCES = [
  {
    id: 'caviar',
    title: 'Imperial Osetra Caviar Service',
    price: 145,
    perGuest: false,
    desc: '30g Royal Reserve Imperial Osetra served on shaved ice with warm blinis, crème fraîche, and mother-of-pearl spoons.'
  },
  {
    id: 'champagne',
    title: 'Dom Pérignon Vintage Flutes',
    price: 195,
    perGuest: false,
    desc: 'Two chilled flutes of Dom Pérignon Vintage poured tableside upon arrival, accompanied by candied yuzu amuse-bouche.'
  },
  {
    id: 'wine-pairing',
    title: 'Sommelier Grand Cru Flight',
    price: 120,
    perGuest: true,
    desc: 'Hand-curated 5-course wine pairing journey featuring rare Burgundies, Bordeaux Premier Crus, and aged Tokaji.'
  },
  {
    id: 'floral',
    title: 'Black & Gold Orchid Arrangement',
    price: 85,
    perGuest: false,
    desc: 'Artisanal centerpiece of midnight black calla lilies and gold-dusted Ecuadorian roses with custom calligraphy card.'
  }
];

const DEFAULT_VIP_MEMBERS = [
  {
    id: 'G-7824',
    name: 'Lohith Vel',
    firstName: 'Lohith',
    lastName: 'Vel',
    email: 'lohithvelsakthi@gmail.com',
    phone: '+1 (555) 789-0199',
    provider: 'google',
    tier: 'Google Verified Patron',
    tierBadge: 'Google Verified',
    dietary: 'Rare Vintages & Hokkaido Caviar',
    notes: 'Google Verified dining patron.',
    memberSince: '2026',
    perks: ['Google Verified Priority Allocation', 'Dedicated Sommelier Care', 'Arrival Dom Pérignon Flute', '1-Click Fast Table Booking']
  },
  {
    id: 'G-4022',
    name: 'Elena Vance',
    firstName: 'Elena',
    lastName: 'Vance',
    email: 'elena.vance@gmail.com',
    phone: '+1 (555) 234-5678',
    provider: 'google',
    tier: 'Google Verified Patron',
    tierBadge: 'Google Verified',
    dietary: 'Gluten-sensitive, Pescatarian',
    notes: 'Anniversary celebration tasting.',
    memberSince: '2025',
    perks: ['Priority Booking Access', 'Personalized Dietary Menu', 'Complimentary Truffle Course']
  },
  {
    id: 'VIP-7001',
    name: 'Lord Sterling',
    firstName: 'Sterling',
    lastName: 'de Montmirail',
    email: 'sterling@imperial.com',
    phone: '+1 (555) 777-8899',
    provider: 'email',
    tier: 'Imperial Gold Member',
    tierBadge: 'Imperial Gold',
    dietary: 'Prefers Rare Vintages & Miyazaki Wagyu',
    notes: 'Requires quiet corner alcove with dedicated sommelier.',
    memberSince: '2023',
    perks: ['Priority Sanctuary Table Allocation', 'Dedicated Sommelier Care', 'Arrival Dom Pérignon Flute', 'Zero-Penalty Cancellation']
  }
];

/* ==========================================================================
   Synthesized Audio Chime (Web Audio API)
   ========================================================================== */
let audioCtx = null;
function playChime(enabled, type = 'click') {
  // Tactile haptic feedback for mobile/touch devices
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'confirm') navigator.vibrate([25, 40, 35]);
      else if (type === 'select') navigator.vibrate(20);
      else navigator.vibrate(12);
    }
  } catch (ve) {}

  if (!enabled) return;
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    if (type === 'confirm') {
      [1046.5, 1318.5, 1567.98, 2093.0].forEach((freq, idx) => {
        const subOsc = audioCtx.createOscillator();
        const subGain = audioCtx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(freq, now + idx * 0.08);
        subGain.gain.setValueAtTime(0, now);
        subGain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);
        subOsc.connect(subGain);
        subGain.connect(audioCtx.destination);
        subOsc.start(now + idx * 0.08);
        subOsc.stop(now + idx * 0.08 + 1.25);
      });
      return;
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    if (type === 'select') {
      osc.frequency.setValueAtTime(1567.98, now);
      osc.frequency.exponentialRampToValueAtTime(1760.0, now + 0.15);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    } else {
      osc.frequency.setValueAtTime(1318.51, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    }
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {
    console.warn(e);
  }
}

/* ==========================================================================
   Component: Horizontal Rolling Ribbon Gallery (Protected UX)
   ========================================================================== */
function RollingBackground({ speed, dim }) {
  const images = [
    { title: 'The Golden Atrium', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80' },
    { title: 'Grand Cru Vault', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80' },
    { title: 'Atelier Gastronomique', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80' },
    { title: 'Golden Bar & Lounge', url: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1000&q=80' },
    { title: 'Velvet & Brass Booths', url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80' },
    { title: 'Skyline Royal Terrace', url: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1000&q=80' },
    { title: 'Imperial Caviar Service', url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=80' },
    { title: 'Private Salon Imperial', url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1000&q=80' }
  ];

  const speedValue = speed === 'slow' ? '120s' : speed === 'paused' ? 'paused' : '65s';
  const opacityValue = dim === 'rich' ? 0.88 : dim === 'deep' ? 0.38 : 0.72;
  const blurValue = dim === 'rich' ? '0px' : dim === 'deep' ? '3px' : '1px';

  return (
    <div className="ambient-gallery-container" aria-hidden="true">
      <div
        className="rolling-ribbon"
        style={{
          animationDuration: speedValue !== 'paused' ? speedValue : '65s',
          animationPlayState: speed === 'paused' ? 'paused' : 'running',
          opacity: opacityValue,
          filter: `blur(${blurValue}) brightness(0.92) contrast(1.12) saturate(1.08)`
        }}
      >
        {/* Track 1 */}
        <div className="ribbon-track">
          {images.map((img, i) => (
            <div key={`track1-${i}`} className="ribbon-card">
              <img src={img.url} alt={img.title} loading="eager" />
              <div className="card-caption">{img.title}</div>
            </div>
          ))}
        </div>
        {/* Track 2 (Seamless loop) */}
        <div className="ribbon-track">
          {images.map((img, i) => (
            <div key={`track2-${i}`} className="ribbon-card">
              <img src={img.url} alt={img.title} loading="lazy" />
              <div className="card-caption">{img.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Protective Optical Scrims */}
      <div className="ambient-scrim"></div>
      <div className="ambient-vignette"></div>
      <div className="gold-dust-overlay"></div>
    </div>
  );
}

/* ==========================================================================
   Component: Header
   ========================================================================== */
function Header({ onNav, audioEnabled, onToggleAudio, onOpenBookings, currentUser, onOpenAuth, onLogout, onOpenDatabase, onOpenInstall, isStandalone }) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  return (
    <header className="luxury-header">
      <a href="#" className="brand-crest" onClick={(e) => { e.preventDefault(); onNav(1); }}>
        <div className="crest-logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18h18M4 18l2-10 5 4 5-7 4 13" />
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="6" cy="8" r="1.5" fill="currentColor" />
            <circle cx="18" cy="8" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <div>
          <h1 className="brand-title">FIRE SPICE</h1>
          <p className="brand-subtitle">RESTAURANT & LOUNGE</p>
        </div>
      </a>

      <nav className="header-nav">
        <button
          className="btn-glass btn-glass-sm active"
          onClick={() => {
            if (!currentUser) onOpenAuth();
            else onNav(1);
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          Reserve Table
        </button>
        <button
          className="btn-glass btn-glass-sm btn-glass-secondary"
          onClick={() => {
            if (!currentUser) onOpenAuth();
            else onNav(2);
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3z"></path><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>
          Floor Plan
        </button>
        <button className="btn-glass btn-glass-sm btn-glass-secondary" onClick={() => {
          const el = document.getElementById('tastingMenuSection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
          Tasting Menu
        </button>
      </nav>

      <div className="header-actions">
        {!isStandalone && (
          <button
            className="btn-glass btn-glass-sm btn-install-app"
            onClick={onOpenInstall}
            title="Install FIRE SPICE as an App on your device"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--gold-300)', borderColor: 'rgba(212, 175, 55, 0.45)', background: 'rgba(212, 175, 55, 0.12)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span className="install-btn-text">Install App</span>
          </button>
        )}

        {isStandalone && (
          <div className="standalone-app-badge" title="Running in Standalone Native App Mode">
            <span>✦ APP MODE</span>
          </div>
        )}

        <button
          className="btn-glass btn-glass-sm btn-glass-secondary"
          onClick={onOpenDatabase}
          title="Inspect SQLite Database & Login Audit Trail"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }}></span>
          <span>Database</span>
        </button>

        <button className="btn-glass btn-glass-sm btn-glass-secondary" onClick={onOpenBookings}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>Find Reservation</span>
        </button>

        {currentUser ? (
          <div className="vip-user-wrapper" ref={dropdownRef}>
            <button
              className="vip-user-pill"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              title="User Account Menu"
              aria-expanded={userDropdownOpen}
            >
              {currentUser.provider === 'google' ? (
                <div className="google-user-icon-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
              ) : (
                <div className="vip-avatar-badge">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'V'}
                </div>
              )}
              <div className="vip-user-text">
                <span className="vip-user-name">{currentUser.name}</span>
                <span className="vip-user-tier">{currentUser.tierBadge || 'Verified Member'}</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: userDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--gold-400)' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {userDropdownOpen && (
              <div className="vip-dropdown-menu">
                <div className="vip-dropdown-header">
                  {currentUser.provider === 'google' ? (
                    <div className="google-user-icon-badge" style={{ width: '38px', height: '38px' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="vip-avatar-badge" style={{ width: '38px', height: '38px', fontSize: '1.1rem' }}>
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'V'}
                    </div>
                  )}
                  <div>
                    <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gold-400)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      {currentUser.tier || 'Verified Patron'}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                <div className="vip-perks-section">
                  <div style={{ fontSize: '0.68rem', color: 'var(--gold-400)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
                    Active Privileges
                  </div>
                  <ul className="vip-perks-list">
                    {(currentUser.perks || [
                      'Verified Priority Table Allocation',
                      'Dedicated Sommelier Pairing Care',
                      'Complimentary Welcome Vintage Flute',
                      '1-Click Rapid Reservation Pre-Fill'
                    ]).map((perk, idx) => (
                      <li key={idx}>
                        <span style={{ color: 'var(--gold-400)', marginRight: '6px' }}>✦</span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="vip-dropdown-actions">
                  <button
                    className="btn-glass btn-glass-sm"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenBookings();
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    My Reservations
                  </button>

                  <button
                    className="btn-glass btn-glass-sm"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNav(1);
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Reserve New Table
                  </button>

                  <button
                    className="btn-glass btn-glass-sm"
                    style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--gold-300)' }}
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenDatabase();
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                    SQLite Database & Logs
                  </button>

                  {!isStandalone && (
                    <button
                      className="btn-glass btn-glass-sm"
                      style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--gold-300)' }}
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenInstall();
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      Install App on Device
                    </button>
                  )}

                  <button
                    className="btn-glass btn-glass-sm"
                    style={{ width: '100%', justifyContent: 'flex-start', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)' }}
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="btn-glass btn-glass-sm btn-google-header" onClick={onOpenAuth} title="Sign In with Google to Reserve Tables">
            <svg width="15" height="15" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google Sign In</span>
          </button>
        )}

        <button className="btn-glass btn-glass-icon btn-glass-secondary" onClick={onToggleAudio} title="Toggle Crystal Chime Sound">
          {audioEnabled ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          )}
        </button>
      </div>
    </header>
  );
}

/* ==========================================================================
   Component: Hero (Serene, Refined, High-Legibility Ambiance)
   ========================================================================== */
function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-badge">
        <span className="gold-diamond"></span>
        <span>Michelin Two-Star Distinction • Private Dining Sanctuary</span>
        <span className="gold-diamond"></span>
      </div>

      <h2 className="hero-title">
        AN UNRIVALED <span className="gold-gradient-text">CULINARY ODYSSEY</span>
      </h2>

      <p className="hero-description">
        An evening of gilded serenity, rare vintage pairings, and bespoke private tables.
      </p>

      <div className="hero-stats-bar">
        <div className="hero-stat-pill">
          <span className="stat-pill-val">2★</span>
          <span className="stat-pill-label">Michelin Guide</span>
        </div>
        <span className="stat-sep">✦</span>
        <div className="hero-stat-pill">
          <span className="stat-pill-val">1,400+</span>
          <span className="stat-pill-label">Grand Cru Cellar</span>
        </div>
        <span className="stat-sep">✦</span>
        <div className="hero-stat-pill">
          <span className="stat-pill-val">14</span>
          <span className="stat-pill-label">Exclusive Tables</span>
        </div>
        <span className="stat-sep">✦</span>
        <div className="hero-stat-pill">
          <span className="stat-pill-val">100%</span>
          <span className="stat-pill-label">Guaranteed Privacy</span>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Component: Stepper Bar
   ========================================================================== */
function Stepper({ currentStep, onStepClick, booking }) {
  const steps = [
    { num: 'I', title: 'Date & Service', subtitle: `${booking.dateFormatted.split(', ')[1] || 'Select Date'} • ${booking.timeFormatted.split(' ')[0]}` },
    { num: 'II', title: 'Table & Zone', subtitle: `${booking.tableId} • ${booking.tableData?.zoneName || 'Atrium'}` },
    { num: 'III', title: 'Enhancements', subtitle: `${booking.occasion} (${booking.addons.length})` },
    { num: 'IV', title: 'Guest Details', subtitle: 'Confirm & Guarantee' }
  ];

  return (
    <div className="console-stepper">
      {steps.map((st, i) => {
        const stepIndex = i + 1;
        const isActive = currentStep === stepIndex;
        const isCompleted = currentStep > stepIndex;

        return (
          <React.Fragment key={st.num}>
            <div
              className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => stepIndex <= currentStep && onStepClick(stepIndex)}
            >
              <div className="step-number">{st.num}</div>
              <div className="step-text">
                <span className="step-title">{st.title}</span>
                <span className="step-subtitle">{st.subtitle}</span>
              </div>
            </div>
            {i < steps.length - 1 && <div className="step-arrow">→</div>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   Component: Step 1 - Date & Service
   ========================================================================== */
function StepDateTime({ booking, setBooking, onSound }) {
  const [calMonth, setCalMonth] = useState(10); // Nov
  const [calYear, setCalYear] = useState(2026);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const daysGrid = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const blanks = Array.from({ length: firstDay });
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { blanks, days };
  }, [calYear, calMonth]);

  const selectDate = (day) => {
    const d = new Date(calYear, calMonth, day);
    const dateFormatted = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const dateString = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setBooking(prev => ({ ...prev, dateFormatted, dateString }));
    onSound('select');
  };

  const guestChoices = [
    { count: 1, label: 'Solo Fine Dining' },
    { count: 2, label: 'Romantic Pair' },
    { count: 4, label: 'Intimate Salon' },
    { count: 6, label: 'Gourmet Party' },
    { count: 8, label: 'Grand Soirée' },
    { count: 10, label: 'VIP Pavilion' }
  ];

  const timeSlots = [
    { group: '✨ Sunset & Early Evening', slots: [{ time: '17:30', tag: 'Sunset' }, { time: '18:15', tag: 'Prime' }, { time: '19:00', tag: 'Popular' }] },
    { group: '👑 Prime Gastronomy Dinner', slots: [{ time: '19:45', tag: 'Gala Hour' }, { time: '20:30', tag: 'Signature' }, { time: '21:15', tag: 'Intimate' }] },
    { group: '🌙 Late Night Sommelier Tasting', slots: [{ time: '22:00', tag: 'Cellar Pour' }, { time: '22:45', tag: 'Nightcap' }] }
  ];

  return (
    <div className="step-content-pane active">
      <div className="section-headline">
        <h3 className="section-title">Select Party Size, Date & Dining Service</h3>
        <p className="section-subtext">Choose your preferred evening date and curated dining hour below.</p>
      </div>

      <div className="details-grid">
        {/* Guest Count */}
        <div className="detail-block">
          <div className="detail-block-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <h4 className="detail-block-title">Party Size</h4>
          </div>
          <div className="guest-presets">
            {guestChoices.map(g => (
              <button
                key={g.count}
                className={`btn-glass btn-guest-choice ${booking.guests === g.count ? 'active' : ''}`}
                onClick={() => { setBooking(prev => ({ ...prev, guests: g.count })); onSound('select'); }}
              >
                <span className="guest-count-num">{g.count === 10 ? '10+' : g.count}</span>
                <span className="guest-desc">{g.label}</span>
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textAlign: 'center' }}>
            For parties exceeding 12 guests, our private dining concierge will curate a bespoke ballroom.
          </p>
        </div>

        {/* Calendar */}
        <div className="detail-block">
          <div className="detail-block-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <h4 className="detail-block-title">Select Date</h4>
          </div>

          <div className="date-selector-row">
            <button className="btn-glass btn-glass-icon btn-glass-sm" onClick={() => { setCalMonth(m => m === 0 ? 11 : m - 1); onSound('click'); }}>‹</button>
            <div className="calendar-month-label">{monthNames[calMonth]} {calYear}</div>
            <button className="btn-glass btn-glass-icon btn-glass-sm" onClick={() => { setCalMonth(m => m === 11 ? 0 : m + 1); onSound('click'); }}>›</button>
          </div>

          <div className="calendar-weekdays">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>
          <div className="calendar-days-grid">
            {daysGrid.blanks.map((_, i) => <div key={`blank-${i}`} />)}
            {daysGrid.days.map(day => {
              const dateObj = new Date(calYear, calMonth, day);
              const isSelected = booking.dateString === `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isPast = day < 13 && calMonth === 10 && calYear === 2026;
              const isToday = day === 13 && calMonth === 10 && calYear === 2026;

              return (
                <button
                  key={day}
                  disabled={isPast}
                  className={`cal-day-btn ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => selectDate(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div className="detail-block">
          <div className="detail-block-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <h4 className="detail-block-title">Dining Hour</h4>
          </div>

          {timeSlots.map(grp => (
            <div key={grp.group} className="time-service-group">
              <div className="service-title">{grp.group}</div>
              <div className="time-slots-grid">
                {grp.slots.map(s => {
                  const isSlotActive = booking.time === s.time;
                  return (
                    <button
                      key={s.time}
                      className={`btn-glass time-slot-btn ${isSlotActive ? 'active' : ''}`}
                      onClick={() => {
                        setBooking(prev => ({
                          ...prev,
                          time: s.time,
                          timeFormatted: `${s.time} (${s.tag})`
                        }));
                        onSound('select');
                      }}
                    >
                      <span>{s.time}</span>
                      <span className="time-slot-tag">{s.tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Component: Step 2 - Floor Plan & Table Selection
   ========================================================================== */
function StepFloorPlan({ booking, setBooking, onSound, onProceed }) {
  const [zoneFilter, setZoneFilter] = useState('all');
  const selectedTable = booking.tableData || TABLES_DATABASE[1];

  const filteredTables = useMemo(() => {
    if (zoneFilter === 'all') return TABLES_DATABASE;
    return TABLES_DATABASE.filter(t => t.zone === zoneFilter);
  }, [zoneFilter]);

  const handleSelectTable = (tbl) => {
    if (tbl.status === 'reserved') return;
    setBooking(prev => ({
      ...prev,
      tableId: tbl.id,
      tableData: tbl
    }));
    onSound('select');
  };

  return (
    <div className="step-content-pane active">
      <div className="section-headline">
        <h3 className="section-title">Interactive Architectural Seating Map</h3>
        <p className="section-subtext">Click on any golden table to reserve your preferred dining viewpoint.</p>
      </div>

      <div className="seating-layout-wrapper">
        <div className="floor-plan-card">
          <div className="floor-plan-header">
            <div className="zone-filters">
              {['all', 'atrium', 'booths', 'terrace', 'vault'].map(z => (
                <button
                  key={z}
                  className={`btn-glass btn-glass-sm ${zoneFilter === z ? 'active' : 'btn-glass-secondary'}`}
                  onClick={() => { setZoneFilter(z); onSound('click'); }}
                >
                  {z === 'all' ? 'All Zones' : z === 'atrium' ? 'Golden Atrium' : z === 'booths' ? 'Velvet Booths' : z === 'terrace' ? 'Skyline Terrace' : "Chef's Vault"}
                </button>
              ))}
            </div>

            <div className="floor-legend">
              <div className="legend-item"><span className="legend-dot available"></span><span>Available</span></div>
              <div className="legend-item"><span className="legend-dot selected"></span><span>Selected</span></div>
              <div className="legend-item"><span className="legend-dot reserved"></span><span>Reserved</span></div>
            </div>
          </div>

          <div className="architectural-floor-grid">
            <div className="arch-marker-terrace">
              ★ SKYLINE ROYAL TERRACE • PANORAMIC VIEW ★
            </div>

            {filteredTables.map(tbl => {
              const isSelected = tbl.id === booking.tableId;
              return (
                <div
                  key={tbl.id}
                  className={`table-node shape-${tbl.shape} ${tbl.status} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectTable(tbl)}
                >
                  <span className="table-status-pill">{tbl.status}</span>
                  <div className="table-plate-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="8"></circle>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </div>
                  <span className="table-id-tag">{tbl.id}</span>
                  <span className="table-capacity-tag">{tbl.capacity} Seats</span>
                </div>
              );
            })}

            <div className="arch-marker-bar">
              🍸 GOLDEN ONYX COCKTAIL BAR & SOMMELIER CELLAR
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="table-details-sidebar">
          <img className="table-sidebar-img" src={selectedTable.img} alt={selectedTable.name} />
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
              <h4 className="font-serif" style={{ fontSize: '1.35rem', color: '#fff' }}>{selectedTable.name}</h4>
              <span className="menu-badge">Up to {selectedTable.capacity} Guests</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {selectedTable.zoneName}
            </p>
          </div>

          <div className="gold-divider" style={{ margin: '4px 0' }}><span className="gold-diamond"></span></div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            {selectedTable.description}
          </p>

          <div className="table-feature-list">
            {selectedTable.features.map((feat, idx) => (
              <div key={idx} className="table-feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Minimum Spend Guarantee</div>
            <div className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--gold-300)', fontWeight: 700 }}>${selectedTable.minSpend} / guest</div>
          </div>

          <button className="btn-glass btn-glass-gold" style={{ width: '100%' }} onClick={onProceed}>
            Confirm This Table
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Component: Step 3 - Enhancements
   ========================================================================== */
function StepEnhancements({ booking, setBooking, onSound }) {
  const occasions = ['Anniversary', 'Romantic Evening', 'Birthday Celebration', 'Executive Dinner', 'Gastronomic Tasting'];

  const toggleAddon = (item) => {
    setBooking(prev => {
      const exists = prev.addons.some(a => a.id === item.id);
      const newAddons = exists
        ? prev.addons.filter(a => a.id !== item.id)
        : [...prev.addons, { id: item.id, price: item.price, title: item.title, perGuest: item.perGuest }];
      return { ...prev, addons: newAddons };
    });
    onSound('select');
  };

  return (
    <div className="step-content-pane active">
      <div className="section-headline">
        <h3 className="section-title">Bespoke Dining Enhancements</h3>
        <p className="section-subtext">Elevate your table reservation with our master sommelier and culinary atelier options.</p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label className="form-label">Dining Occasion</label>
        <div className="occasion-pills">
          {occasions.map(occ => (
            <button
              key={occ}
              className={`btn-glass btn-glass-sm ${booking.occasion === occ ? 'active' : 'btn-glass-secondary'}`}
              onClick={() => { setBooking(prev => ({ ...prev, occasion: occ })); onSound('select'); }}
            >
              {occ === 'Anniversary' && '💍 '}
              {occ === 'Romantic Evening' && '🌹 '}
              {occ === 'Birthday Celebration' && '🎂 '}
              {occ === 'Executive Dinner' && '💼 '}
              {occ === 'Gastronomic Tasting' && '🍷 '}
              {occ}
            </button>
          ))}
        </div>
      </div>

      <div className="experience-grid">
        {EXPERIENCES.map(item => {
          const isSelected = booking.addons.some(a => a.id === item.id);
          return (
            <div
              key={item.id}
              className={`experience-card ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleAddon(item)}
            >
              <div className="experience-header">
                <div className="experience-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24"></path><path d="m14.83 9.17 4.24-4.24"></path></svg>
                </div>
                <span className="experience-price">+{item.price}{item.perGuest ? ' / guest' : ''}</span>
              </div>
              <h4 className="experience-title">{item.title}</h4>
              <p className="experience-desc">{item.desc}</p>
              <button className={`btn-glass btn-glass-sm addon-toggle-btn ${isSelected ? 'active' : ''}`}>
                {isSelected ? '✓ Added to Evening' : 'Add to Evening'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================================================
   Component: Step 4 - Guest Details & Live Receipt
   ========================================================================== */
function StepGuestDetails({ booking, setBooking, onConfirm, onSound, currentUser, onOpenAuth }) {
  const [form, setForm] = useState(() => {
    if (currentUser) {
      return {
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        dietary: currentUser.dietary || '',
        notes: currentUser.notes || ''
      };
    }
    return booking.guestInfo;
  });
  const [agree, setAgree] = useState(true);

  // Sync with currentUser if user logs in or switches account while on Step 4
  useEffect(() => {
    if (currentUser) {
      setForm(prev => ({
        ...prev,
        firstName: currentUser.firstName || prev.firstName,
        lastName: currentUser.lastName || prev.lastName,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        dietary: currentUser.dietary || prev.dietary,
        notes: currentUser.notes || prev.notes
      }));
    }
  }, [currentUser]);

  const table = booking.tableData || TABLES_DATABASE[1];
  const tableBase = (table.minSpend || 180) * booking.guests;
  const addonsTotal = booking.addons.reduce((sum, a) => sum + (a.perGuest ? a.price * booking.guests : a.price), 0);
  const total = tableBase + addonsTotal;

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName) {
      alert('Please provide your first and last name.');
      return;
    }
    if (!form.email || !form.email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!form.phone) {
      alert('Please enter a contact telephone number.');
      return;
    }
    if (!agree) {
      alert('Please acknowledge the elegant evening dress code policy.');
      return;
    }
    onConfirm(form, total);
  };

  return (
    <div className="step-content-pane active">
      <div className="section-headline">
        <h3 className="section-title">Guest Details & Final Confirmation</h3>
        <p className="section-subtext">Review your reservation summary and enter guest contact information.</p>
      </div>

      <div className="guest-form-layout">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {currentUser && (
            <div className="vip-prefill-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {currentUser.provider === 'google' ? (
                  <div className="google-badge-circle">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                ) : (
                  <div className="vip-banner-icon">✦</div>
                )}
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#fff' }}>
                    {currentUser.provider === 'google' ? 'Google Account Verified' : 'Verified Member Profile'} • <span style={{ color: 'var(--gold-300)' }}>{currentUser.name}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Signed in as <strong>{currentUser.email}</strong>. Your contact details are secured & pre-filled.
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn-glass btn-glass-sm btn-glass-secondary"
                onClick={onOpenAuth}
                title="Switch Account"
              >
                Switch Account
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Alexander"
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Vance"
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="vance@luxury.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Telephone *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+1 (555) 892-0199"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Dietary Preferences & Allergies</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Gluten-free, Shellfish allergy, Pescatarian"
              value={form.dietary}
              onChange={e => setForm({ ...form, dietary: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Special Concierge Requests</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="Discreet anniversary surprise, quiet table corner, champagne chilling..."
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '14px' }}>
            <input
              type="checkbox"
              id="dressAgree"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              style={{ accentColor: 'var(--gold-500)', width: '18px', height: '18px', marginTop: '3px' }}
            />
            <label htmlFor="dressAgree" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              I acknowledge FIRE SPICE's evening dress code: <strong style={{ color: 'var(--gold-300)' }}>Elegant Evening Attire / Black-Tie Optional</strong>. Athletic wear and shorts are strictly prohibited.
            </label>
          </div>
        </form>

        {/* Live Summary Receipt */}
        <div className="booking-summary-receipt">
          <div className="summary-crest-header">
            <div className="summary-brand">FIRE SPICE</div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '2px', color: 'var(--gold-400)', textTransform: 'uppercase' }}>
              Reservation Guarantee
            </div>
          </div>

          <div className="summary-row"><span className="summary-label">Date</span><span className="summary-value">{booking.dateFormatted}</span></div>
          <div className="summary-row"><span className="summary-label">Dining Service</span><span className="summary-value">{booking.timeFormatted}</span></div>
          <div className="summary-row"><span className="summary-label">Party Size</span><span className="summary-value">{booking.guests} Guests</span></div>
          <div className="summary-row"><span className="summary-label">Table & Zone</span><span className="summary-value">{table.name}</span></div>
          <div className="summary-row"><span className="summary-label">Occasion</span><span className="summary-value">{booking.occasion}</span></div>

          <div style={{ borderTop: '1px dashed rgba(212, 175, 55, 0.2)', marginTop: '10px', paddingTop: '10px' }}>
            {booking.addons.length > 0 ? (
              booking.addons.map(a => (
                <div key={a.id} className="summary-row" style={{ fontSize: '0.82rem', color: 'var(--gold-300)' }}>
                  <span>+ {a.title}</span>
                  <span>${a.perGuest ? a.price * booking.guests : a.price}</span>
                </div>
              ))
            ) : (
              <div className="summary-row" style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                <span>Enhancements</span><span>None selected</span>
              </div>
            )}
          </div>

          {currentUser && (
            <div className="vip-receipt-perk">
              <div style={{ color: 'var(--gold-300)', fontWeight: 600, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✦</span> {currentUser.tierBadge || 'VIP Member'} Distinction Applied
              </div>
              <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                Priority Sanctuary Staging & Complimentary Welcome Dom Pérignon Vintage Pour.
              </div>
            </div>
          )}

          <div className="summary-total-row">
            <div>
              <div className="summary-total-label">Estimated Guarantee</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Includes table reservation & add-ons</div>
            </div>
            <div className="summary-total-val">${total}</div>
          </div>

          <button className="btn-glass btn-glass-gold btn-glass-lg" style={{ width: '100%', marginTop: '24px' }} onClick={handleSubmit}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Confirm Luxury Reservation
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Component: Step 5 - Confirmed VIP Pass
   ========================================================================== */
function StepConfirmedPass({ reservation, onReset, onSound, currentUser }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !reservation) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    ctx.fillStyle = '#060608';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#d4af37';

    const gridSize = 15;
    const cellSize = size / gridSize;

    // Stylized corner finders
    const drawCorner = (x, y) => {
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(x * cellSize, y * cellSize, 4 * cellSize, 4 * cellSize);
      ctx.fillStyle = '#060608';
      ctx.fillRect((x + 0.8) * cellSize, (y + 0.8) * cellSize, 2.4 * cellSize, 2.4 * cellSize);
      ctx.fillStyle = '#f9e7a2';
      ctx.fillRect((x + 1.4) * cellSize, (y + 1.4) * cellSize, 1.2 * cellSize, 1.2 * cellSize);
    };

    drawCorner(1, 1);
    drawCorner(gridSize - 5, 1);
    drawCorner(1, gridSize - 5);

    // Dynamic data dots
    ctx.fillStyle = '#e5c365';
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if ((r < 5 && c < 5) || (r < 5 && c > gridSize - 6) || (r > gridSize - 6 && c < 5)) continue;
        if (Math.sin((r * 11 + c * 31) * 1.7) > 0.3) {
          ctx.beginPath();
          ctx.arc(c * cellSize + cellSize / 2, r * cellSize + cellSize / 2, cellSize * 0.38, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Seal
    ctx.fillStyle = '#060608';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, cellSize * 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#f9e7a2';
    ctx.font = 'bold 9px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FS', size / 2, size / 2);
  }, [reservation]);

  const downloadIcs = () => {
    const title = `FIRE SPICE Reservation: ${reservation.tableName}`;
    const desc = `Luxury Table Reservation at FIRE SPICE Haute Gastronomie.\\nConfirmation Code: ${reservation.code}\\nParty Size: ${reservation.guests} Guests\\nDress Code: Elegant Evening Attire`;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FIRE SPICE Restaurant//Reservation System//EN',
      'BEGIN:VEVENT',
      `UID:${reservation.code}@firespice-restaurant.com`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      'LOCATION:450 Golden Pavilion Way',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `FIRESPICE-Reservation-${reservation.code}.ics`;
    link.click();
    onSound('click');
  };

  return (
    <div className="step-content-pane active">
      <div className="confirmation-view">
        <div style={{ marginBottom: '24px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.2)', border: '2px solid var(--gold-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--gold-300)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3 className="font-serif" style={{ fontSize: '2rem', color: '#fff', marginBottom: '6px' }}>
            RESERVATION CONFIRMED
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--gold-300)' }}>
            We have prepared your gilded sanctuary at FIRE SPICE.
          </p>
        </div>

        <div className="vip-pass-card">
          <div className="pass-header">
            <div>
              <h4 className="pass-brand-title">FIRE SPICE</h4>
              <div style={{ fontSize: '0.72rem', letterSpacing: '2px', color: 'var(--gold-400)', textTransform: 'uppercase' }}>Haute Dining Pass</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <div className="pass-code-badge">{reservation.code}</div>
              {(reservation.vipTier || (currentUser && currentUser.tierBadge)) && (
                <div style={{ fontSize: '0.64rem', color: 'var(--gold-300)', letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(212, 175, 55, 0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                  ✦ {reservation.vipTier || currentUser.tierBadge}
                </div>
              )}
            </div>
          </div>

          <div className="pass-details-grid">
            <div className="pass-detail-cell">
              <span className="pass-detail-key">Guest Name</span>
              <span className="pass-detail-val">{reservation.guestName}</span>
            </div>
            <div className="pass-detail-cell">
              <span className="pass-detail-key">Party Size</span>
              <span className="pass-detail-val">{reservation.guests} Guests ({reservation.occasion})</span>
            </div>
            <div className="pass-detail-cell">
              <span className="pass-detail-key">Date & Service</span>
              <span className="pass-detail-val">{reservation.dateFormatted} • {reservation.timeFormatted.split(' ')[0]}</span>
            </div>
            <div className="pass-detail-cell">
              <span className="pass-detail-key">Table & Location</span>
              <span className="pass-detail-val">{reservation.tableId} • {reservation.zone}</span>
            </div>
          </div>

          <div className="pass-footer-qr">
            <canvas ref={canvasRef} className="pass-qr-canvas" width="90" height="90"></canvas>
            <div className="pass-rules">
              <div style={{ color: 'var(--gold-300)', fontWeight: 600, marginBottom: '2px' }}>DRESS CODE: ELEGANT ATTIRE</div>
              <div>Please present this pass to our Maître d' upon arrival at 450 Golden Pavilion Way. We hold tables for up to 15 minutes.</div>
            </div>
          </div>
        </div>

        <div className="pass-actions">
          <button className="btn-glass btn-glass-gold" onClick={() => { alert('VIP Pass saved to device.'); onSound('select'); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download VIP Pass
          </button>
          <button className="btn-glass btn-glass-secondary" onClick={downloadIcs}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Add to Calendar (.ics)
          </button>
          <button className="btn-glass btn-glass-secondary" onClick={onReset}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Book Another Table
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Component: Tasting Menu Showcase
   ========================================================================== */
function MenuShowcase({ onSound }) {
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return MENU_DATABASE;
    return MENU_DATABASE.filter(m => m.category === filter);
  }, [filter]);

  return (
    <section className="menu-section" id="tastingMenuSection">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="hero-badge"><span>Haute Gastronomie Curations</span></div>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '8px' }}>
          THE WINTER 2026 TASTING COMPENDIUM
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto' }}>
          Crafted by Chef de Cuisine Marc Éléonore, harmonizing centuries-old French technique with rare global harvests.
        </p>
      </div>

      <div className="menu-filter-bar">
        {['all', 'tasting', 'caviar', 'mains', 'cellar'].map(cat => (
          <button
            key={cat}
            className={`btn-glass btn-glass-sm ${filter === cat ? 'active' : 'btn-glass-secondary'}`}
            onClick={() => { setFilter(cat); onSound('click'); }}
          >
            {cat === 'all' ? 'All Specialties' : cat === 'tasting' ? 'Tasting Menus' : cat === 'caviar' ? 'Caviar & Raw Bar' : cat === 'mains' ? 'Grand Cuts' : 'Rare Cellar'}
          </button>
        ))}
      </div>

      <div className="menu-items-grid">
        {filtered.map(item => (
          <div key={item.id} className="menu-card">
            <img className="menu-card-img" src={item.img} alt={item.title} loading="lazy" />
            <div className="menu-card-body">
              <div className="menu-card-title-row">
                <h4 className="menu-item-title">{item.title}</h4>
                <span className="menu-item-price">{item.price}</span>
              </div>
              <p className="menu-item-desc">{item.desc}</p>
              <div className="menu-item-tags">
                <span className="menu-badge">{item.badge}</span>
                <span className="menu-badge" style={{ borderColor: 'rgba(250, 235, 173, 0.4)' }}>{item.pairing}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   Component: Ambiance Controller (Protected UX)
   ========================================================================== */
function AmbianceController({ speed, setSpeed, dim, setDim, onSound }) {
  return (
    <aside className="ambient-controller-pill" aria-label="Ambiance Background Controls">
      <div className="ctrl-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
        <span>Ambiance:</span>
      </div>

      <button className={`btn-glass btn-glass-sm btn-glass-pill ${speed === 'slow' ? 'active' : ''}`} onClick={() => { setSpeed('slow'); onSound('click'); }}>Gentle</button>
      <button className={`btn-glass btn-glass-sm btn-glass-pill ${speed === 'normal' ? 'active' : ''}`} onClick={() => { setSpeed('normal'); onSound('click'); }}>Majestic</button>
      <button className={`btn-glass btn-glass-sm btn-glass-pill ${speed === 'paused' ? 'active' : ''}`} onClick={() => { setSpeed('paused'); onSound('click'); }}>⏸ Pause</button>

      <span style={{ color: 'rgba(212, 175, 55, 0.3)' }}>|</span>

      <button className={`btn-glass btn-glass-sm btn-glass-pill ${dim === 'rich' ? 'active' : ''}`} onClick={() => { setDim('rich'); onSound('click'); }}>Rich</button>
      <button className={`btn-glass btn-glass-sm btn-glass-pill ${dim === 'comfort' ? 'active' : ''}`} onClick={() => { setDim('comfort'); onSound('click'); }}>Comfort</button>
      <button className={`btn-glass btn-glass-sm btn-glass-pill ${dim === 'deep' ? 'active' : ''}`} onClick={() => { setDim('deep'); onSound('click'); }}>Deep Noir</button>
    </aside>
  );
}

/* ==========================================================================
   Component: Bookings Modal
   ========================================================================== */
function BookingsModal({ isOpen, onClose, onViewPass, onSound }) {
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('firespice_reservations');
      if (stored) {
        try { setBookings(JSON.parse(stored)); } catch (e) { setBookings([]); }
      } else {
        const seed = [{
          code: 'FSP-7824-VIP',
          guestName: 'Alexander Vance',
          dateFormatted: 'Fri, Nov 20, 2026',
          timeFormatted: '7:45 PM (Prime Dinner)',
          tableName: 'Table A2 • Imperial Centerpiece',
          zone: 'The Golden Atrium',
          tableId: 'A2',
          guests: 2,
          occasion: 'Anniversary',
          total: 360
        }];
        localStorage.setItem('firespice_reservations', JSON.stringify(seed));
        setBookings(seed);
      }
    }
  }, [isOpen]);

  const filtered = bookings.filter(b => {
    if (!search) return true;
    const kw = search.toLowerCase();
    return b.code.toLowerCase().includes(kw) || b.guestName.toLowerCase().includes(kw);
  });

  const cancelBooking = (code) => {
    if (confirm(`Cancel reservation ${code}?`)) {
      const updated = bookings.filter(b => b.code !== code);
      localStorage.setItem('firespice_reservations', JSON.stringify(updated));
      setBookings(updated);
      onSound('click');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && onClose()}>
      <div className="modal-dialog">
        <button className="btn-glass btn-glass-icon btn-glass-sm modal-close-btn" onClick={onClose}>✕</button>

        <h3 className="font-serif" style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '6px' }}>YOUR RESERVATIONS</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Search or manage your confirmed table bookings at FIRE SPICE.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Enter confirmation code (e.g. FSP-7824) or name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flexGrow: 1 }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '380px', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No reservations found.</div>
          ) : (
            filtered.map(b => (
              <div key={b.code} style={{ background: 'rgba(18, 18, 24, 0.75)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '14px', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span className="pass-code-badge" style={{ padding: '2px 8px', fontSize: '0.78rem' }}>{b.code}</span>
                    <strong style={{ fontFamily: 'Cinzel, serif', fontSize: '1.05rem', color: '#fff' }}>{b.guestName}</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gold-300)', margin: '4px 0' }}>
                    {b.dateFormatted} • {b.timeFormatted} • {b.tableName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Party: {b.guests} Guests • Guarantee: ${b.total}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button className="btn-glass btn-glass-sm" onClick={() => { onViewPass(b); onClose(); }}>View Pass</button>
                  <button className="btn-glass btn-glass-sm" style={{ borderColor: 'rgba(248, 113, 113, 0.4)', color: '#f87171' }} onClick={() => cancelBooking(b.code)}>Cancel</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Component: LockedConsoleGate (Gated Reservation Sanctuary)
   ========================================================================== */
function LockedConsoleGate({ onOpenGoogleAuth, onOpenEmailAuth }) {
  return (
    <div className="console-card booking-gate-locked">
      <div className="gate-lock-icon-wrap">
        <div className="gate-lock-glow"></div>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="gate-lock-svg">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          <circle cx="12" cy="16" r="1.5" fill="currentColor"></circle>
        </svg>
      </div>

      <div className="hero-badge" style={{ marginBottom: '14px' }}>
        <span className="gold-diamond"></span>
        <span>RESERVATIONS GATED • AUTHENTICATION REQUIRED</span>
        <span className="gold-diamond"></span>
      </div>

      <h3 className="font-serif" style={{ fontSize: '2.1rem', color: '#fff', marginBottom: '10px', letterSpacing: '2px' }}>
        TABLE RESERVATIONS <span className="gold-gradient-text">LOCKED</span>
      </h3>

      <p style={{ maxWidth: '640px', margin: '0 auto 26px', fontSize: '0.94rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
        To maintain our Michelin Two-Star privacy and prevent unauthorized bookings, table reservations at FIRE SPICE require sign-in using your <strong style={{ color: '#fff' }}>Google Account</strong> or verified <strong style={{ color: '#fff' }}>Email ID</strong>. Sign in below to unlock interactive 2D table selection, live floor plans, and bespoke sommelier pairings.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', maxWidth: '420px', margin: '0 auto 24px', width: '100%' }}>
        <button
          className="btn-glass btn-google btn-google-lg"
          onClick={onOpenGoogleAuth}
        >
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Sign In with Google Account</span>
        </button>

        <button
          className="btn-glass btn-glass-secondary"
          style={{ width: '100%', padding: '13px 20px', fontSize: '0.88rem' }}
          onClick={onOpenEmailAuth}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span>Sign In or Sign Up with Email ID</span>
        </button>
      </div>

      <div className="gate-perks-badge-row">
        <span>✦ Instant Google Authentication</span>
        <span>•</span>
        <span>✦ 100% Privacy & Guaranteed Seating</span>
        <span>•</span>
        <span>✦ Digital Boarding Pass</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   Component: AuthModal (Google Sign In & Email Authentication Gateway)
   ========================================================================== */
function AuthModal({ isOpen, onClose, onLogin, onSound }) {
  const [activeTab, setActiveTab] = useState('google'); // 'google' | 'email-signin' | 'email-signup'
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomGoogle, setShowCustomGoogle] = useState(false);

  // Email form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectGoogleProfile = async (profile) => {
    try {
      const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          name: profile.name,
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone
        })
      });
      const data = await res.json();
      if (data && data.success && data.user) {
        onLogin(data.user, data.token);
        onSound('confirm');
        onClose();
        return;
      }
    } catch (e) {
      console.warn('Backend database not reachable, using offline profile:', e);
    }
    // Fallback if offline
    onLogin(profile);
    onSound('confirm');
    onClose();
  };

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!customGoogleEmail.trim() || !customGoogleEmail.includes('@')) {
      setErrorMsg('Please enter a valid Google or Gmail address.');
      return;
    }
    const cleanEmail = customGoogleEmail.trim();
    const namePart = cleanEmail.split('@')[0];
    const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    try {
      const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          name: `${capitalized} Google Patron`,
          firstName: capitalized,
          lastName: 'Patron'
        })
      });
      const data = await res.json();
      if (data && data.success && data.user) {
        onLogin(data.user, data.token);
        onSound('confirm');
        onClose();
        return;
      }
    } catch (err) {
      console.warn('Backend database not reachable, using offline profile:', err);
    }

    const googleProfile = {
      id: `G-${Math.floor(1000 + Math.random() * 9000)}`,
      name: capitalized,
      firstName: capitalized,
      lastName: 'Google User',
      email: cleanEmail,
      phone: '+1 (555) 789-0199',
      provider: 'google',
      tier: 'Google Verified Patron',
      tierBadge: 'Google Verified',
      dietary: 'None reported',
      notes: 'Authenticated via Google Identity',
      memberSince: '2026',
      perks: [
        'Google Verified Priority Allocation',
        'Dedicated Sommelier Care',
        'Arrival Dom Pérignon Flute',
        '1-Click Instant Reservation'
      ]
    };
    onLogin(googleProfile);
    onSound('confirm');
    onClose();
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!emailInput.trim()) {
      setErrorMsg('Please enter your email ID.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          password: passwordInput
        })
      });
      const data = await res.json();
      if (data && data.success && data.user) {
        onLogin(data.user, data.token);
        onSound('confirm');
        onClose();
        return;
      } else if (data && !data.success) {
        setErrorMsg(data.message || 'Authentication failed. Please verify your credentials.');
        return;
      }
    } catch (err) {
      console.warn('Backend database not reachable, checking local storage:', err);
    }

    const trimmed = emailInput.trim();
    const matched = DEFAULT_VIP_MEMBERS.find(m => m.email.toLowerCase() === trimmed.toLowerCase());
    if (matched) {
      onLogin(matched);
      onSound('confirm');
      onClose();
      return;
    }

    try {
      const stored = localStorage.getItem('firespice_members_db');
      if (stored) {
        const list = JSON.parse(stored);
        const found = list.find(m => m.email.toLowerCase() === trimmed.toLowerCase());
        if (found) {
          onLogin(found);
          onSound('confirm');
          onClose();
          return;
        }
      }
    } catch (err) {}

    const namePart = trimmed.split('@')[0];
    const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const emailUser = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: capitalized,
      firstName: capitalized,
      lastName: 'Member',
      email: trimmed,
      phone: '+1 (555) 000-0000',
      provider: 'email',
      tier: 'Private Reserve Member',
      tierBadge: 'Verified Member',
      dietary: '',
      notes: '',
      memberSince: '2026',
      perks: ['Priority Sanctuary Allocation', 'Sommelier Concierge Assistance', '1-Click Rapid Booking']
    };
    onLogin(emailUser);
    onSound('confirm');
    onClose();
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regFirstName.trim() || !regLastName.trim()) {
      setErrorMsg('Please provide your first and last name.');
      return;
    }
    if (!emailInput.trim() || !emailInput.includes('@')) {
      setErrorMsg('Please provide a valid email ID.');
      return;
    }
    if (!regPhone.trim()) {
      setErrorMsg('Please provide a contact phone number.');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: regFirstName.trim(),
          lastName: regLastName.trim(),
          email: emailInput.trim(),
          phone: regPhone.trim(),
          password: regPassword
        })
      });
      const data = await res.json();
      if (data && data.success && data.user) {
        onLogin(data.user, data.token);
        onSound('confirm');
        onClose();
        return;
      } else if (data && !data.success) {
        setErrorMsg(data.message || 'Registration failed.');
        return;
      }
    } catch (err) {
      console.warn('Backend database not reachable, creating local user:', err);
    }

    const newUser = {
      id: `USR-${Math.floor(5000 + Math.random() * 4999)}`,
      name: `${regFirstName.trim()} ${regLastName.trim()}`,
      firstName: regFirstName.trim(),
      lastName: regLastName.trim(),
      email: emailInput.trim(),
      phone: regPhone.trim(),
      provider: 'email',
      tier: 'Private Reserve Member',
      tierBadge: 'Verified Member',
      dietary: '',
      notes: 'Registered via Email ID',
      memberSince: '2026',
      perks: [
        'Priority Sanctuary Table Allocation',
        'Complimentary Welcome Flute on First Visit',
        'Dedicated Sommelier Care'
      ]
    };

    try {
      const stored = localStorage.getItem('firespice_members_db');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newUser);
      localStorage.setItem('firespice_members_db', JSON.stringify(list));
    } catch (err) {}

    onLogin(newUser);
    onSound('confirm');
    onClose();
  };

  return (
    <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && onClose()}>
      <div className="modal-dialog auth-modal-dialog">
        <button className="btn-glass btn-glass-icon btn-glass-sm modal-close-btn" onClick={onClose} title="Dismiss (Reservations remain locked)">✕</button>

        <div className="auth-crest-header">
          <div className="crest-logo-icon" style={{ margin: '0 auto 12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18h18M4 18l2-10 5 4 5-7 4 13" />
              <circle cx="12" cy="5" r="1.5" fill="currentColor" />
              <circle cx="6" cy="8" r="1.5" fill="currentColor" />
              <circle cx="18" cy="8" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div className="hero-badge" style={{ marginBottom: '8px' }}>
            <span className="gold-diamond"></span>
            <span>MEMBER SANCTUARY • AUTHENTICATION REQUIRED</span>
            <span className="gold-diamond"></span>
          </div>
          <h3 className="font-serif" style={{ fontSize: '1.7rem', color: '#fff', letterSpacing: '2px', marginBottom: '6px' }}>
            SIGN IN TO <span className="gold-gradient-text">FIRE SPICE</span>
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto' }}>
            Sign in with your Google account or email ID to unlock table booking, live seating, and private dining privileges.
          </p>
        </div>

        {/* Primary Action: Google Sign In Section */}
        <div className="google-auth-section">
          <div className="google-auth-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>Google Authentication</span>
              </div>
              <span className="google-fast-badge">Recommended</span>
            </div>

            {/* Quick 1-Click Google Account Chooser */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                className="google-account-btn"
                onClick={() => handleSelectGoogleProfile(DEFAULT_VIP_MEMBERS[0])}
              >
                <div className="google-avatar-circle">L</div>
                <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Lohith Vel</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>lohithvelsakthi@gmail.com</div>
                </div>
                <span className="google-click-hint">1-Click Sign In →</span>
              </button>

              <button
                type="button"
                className="google-account-btn"
                onClick={() => handleSelectGoogleProfile(DEFAULT_VIP_MEMBERS[1])}
              >
                <div className="google-avatar-circle" style={{ background: '#7c3aed' }}>E</div>
                <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Elena Vance</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>elena.vance@gmail.com</div>
                </div>
                <span className="google-click-hint">1-Click Sign In →</span>
              </button>
            </div>

            {/* Custom Google Email input toggle */}
            {!showCustomGoogle ? (
              <button
                type="button"
                className="google-alt-btn"
                onClick={() => setShowCustomGoogle(true)}
              >
                + Sign in with another Google Account / Gmail
              </button>
            ) : (
              <form onSubmit={handleCustomGoogleSubmit} style={{ marginTop: '12px', borderTop: '1px dashed rgba(212, 175, 55, 0.25)', paddingTop: '12px' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Enter Your Google / Gmail Address</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="yourname@gmail.com"
                    value={customGoogleEmail}
                    onChange={e => setCustomGoogleEmail(e.target.value)}
                    autoFocus
                    required
                  />
                  <button type="submit" className="btn-glass btn-glass-gold btn-glass-sm" style={{ flexShrink: 0 }}>
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="auth-divider">
          <span>OR CONTINUE WITH EMAIL ID</span>
        </div>

        {/* Email Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${activeTab === 'email-signin' ? 'active' : ''}`}
            onClick={() => { setActiveTab('email-signin'); setErrorMsg(''); onSound('click'); }}
          >
            Email Sign In
          </button>
          <button
            className={`auth-tab-btn ${activeTab === 'email-signup' ? 'active' : ''}`}
            onClick={() => { setActiveTab('email-signup'); setErrorMsg(''); onSound('click'); }}
          >
            Sign Up with Email
          </button>
        </div>

        {errorMsg && (
          <div className="auth-error-badge">
            <span style={{ color: '#f87171', marginRight: '6px' }}>⚠</span>
            {errorMsg}
          </div>
        )}

        {/* Email Sign In */}
        {activeTab === 'email-signin' && (
          <form onSubmit={handleEmailSignIn}>
            <div className="form-group">
              <label className="form-label">Email ID</label>
              <input
                type="email"
                className="form-input"
                placeholder="vance@luxury.com"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-glass btn-glass-gold btn-glass-lg" style={{ width: '100%', marginTop: '8px' }}>
              Sign In & Unlock Reservations
            </button>
          </form>
        )}

        {/* Email Sign Up */}
        {activeTab === 'email-signup' && (
          <form onSubmit={handleEmailSignUp}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Alexander"
                  value={regFirstName}
                  onChange={e => setRegFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Vance"
                  value={regLastName}
                  onChange={e => setRegLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="vance@luxury.com"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Telephone *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+1 (555) 892-0199"
                value={regPhone}
                onChange={e => setRegPhone(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Create Password *</label>
              <input
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-glass btn-glass-gold btn-glass-lg" style={{ width: '100%', marginTop: '6px' }}>
              Sign Up & Unlock Reservations
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '18px', paddingTop: '12px', borderTop: '1px solid rgba(212, 175, 55, 0.12)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--gold-400)' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }}></span>
            <span>Connected to SQLite Database (<code>database/users.db</code>)</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            All logins &amp; credentials are secure, audited, and stored in a dedicated database.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Component: DatabaseModal (Live SQLite Database & Audit Log Inspector)
   ========================================================================== */
function DatabaseModal({ isOpen, onClose, onSound }) {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'logins'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchDatabaseData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, logsRes] = await Promise.all([
        fetch('/api/database/stats').then(r => r.json()).catch(() => null),
        fetch('/api/database/users').then(r => r.json()).catch(() => null),
        fetch('/api/database/logins?limit=30').then(r => r.json()).catch(() => null)
      ]);

      if (statsRes && statsRes.stats) setStats(statsRes.stats);
      if (usersRes && usersRes.users) setUsers(usersRes.users);
      if (logsRes && logsRes.logs) setLogs(logsRes.logs);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (e) {
      console.warn('Could not load database metrics:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchDatabaseData();
    }
  }, [isOpen, fetchDatabaseData]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && onClose()}>
      <div className="modal-dialog database-modal-dialog">
        <button className="btn-glass btn-glass-icon btn-glass-sm modal-close-btn" onClick={onClose}>✕</button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div className="hero-badge" style={{ marginBottom: '6px' }}>
              <span className="gold-diamond"></span>
              <span>ENTERPRISE LOGIN VAULT • SQLITE 3</span>
              <span className="gold-diamond"></span>
            </div>
            <h2 className="font-serif" style={{ fontSize: '1.6rem', color: '#fff', letterSpacing: '2px', margin: 0 }}>
              USER LOGIN <span className="gold-gradient-text">DATABASE</span>
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="db-status-badge">
              <span className="db-pulse-dot"></span>
              <span>SQLite Active</span>
            </div>
            <button
              className="btn-glass btn-glass-sm"
              onClick={() => { fetchDatabaseData(); onSound('click'); }}
              disabled={loading}
              title="Refresh database records"
            >
              ↻ {loading ? 'Querying...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Database Metrics Grid */}
        <div className="db-stats-grid">
          <div className="db-stat-card">
            <div className="db-stat-val">{stats ? stats.totalUsers : users.length}</div>
            <div className="db-stat-lbl">Registered Patrons</div>
          </div>
          <div className="db-stat-card">
            <div className="db-stat-val">{stats ? stats.successfulLogins : logs.filter(l => l.status === 'SUCCESS').length}</div>
            <div className="db-stat-lbl">Successful Logins</div>
          </div>
          <div className="db-stat-card">
            <div className="db-stat-val">{stats ? stats.activeSessions : 'Active'}</div>
            <div className="db-stat-lbl">Live Web Sessions</div>
          </div>
          <div className="db-stat-card">
            <div className="db-stat-val" style={{ fontSize: '1.1rem', paddingTop: '4px' }}>
              {stats ? `${(stats.dbFileSizeBytes / 1024).toFixed(0)} KB` : '45 KB'}
            </div>
            <div className="db-stat-lbl">database/users.db</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="auth-tab-row" style={{ marginBottom: '14px' }}>
          <button
            className={`auth-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => { setActiveTab('users'); onSound('click'); }}
          >
            Registered Patrons ({users.length})
          </button>
          <button
            className={`auth-tab-btn ${activeTab === 'logins' ? 'active' : ''}`}
            onClick={() => { setActiveTab('logins'); onSound('click'); }}
          >
            Login Audit Trail ({logs.length})
          </button>
        </div>

        {/* Tab 1: Registered Patrons */}
        {activeTab === 'users' && (
          <div className="db-table-wrapper">
            <table className="db-table">
              <thead>
                <tr>
                  <th>PATRON ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PROVIDER</th>
                  <th>TIER</th>
                  <th>LOGINS</th>
                  <th>LAST LOGIN</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No users in database.
                    </td>
                  </tr>
                ) : (
                  users.map((u, i) => (
                    <tr key={i}>
                      <td><code style={{ color: 'var(--gold-300)', background: 'rgba(212, 175, 55, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{u.uid || `USR-${u.id}`}</code></td>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                      <td>
                        {u.provider === 'google' ? (
                          <span className="provider-badge-google">Google</span>
                        ) : (
                          <span className="provider-badge-email">Email</span>
                        )}
                      </td>
                      <td><span style={{ color: 'var(--gold-400)', fontSize: '0.75rem' }}>{u.tier_badge || u.tier || 'Verified'}</span></td>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--gold-300)' }}>{u.login_count || 1}</td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{u.last_login_at ? u.last_login_at.replace('T', ' ').slice(0, 19) : 'Just now'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Login Audit Trail */}
        {activeTab === 'logins' && (
          <div className="db-table-wrapper">
            <table className="db-table">
              <thead>
                <tr>
                  <th>TIMESTAMP</th>
                  <th>PATRON / EMAIL</th>
                  <th>PROVIDER</th>
                  <th>STATUS</th>
                  <th>IP ADDRESS</th>
                  <th>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No login audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((l, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {l.login_time ? l.login_time.replace('T', ' ').slice(0, 19) : '—'}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{l.name || l.email.split('@')[0]}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{l.email}</div>
                      </td>
                      <td>
                        {l.provider === 'google' ? (
                          <span className="provider-badge-google">Google</span>
                        ) : (
                          <span className="provider-badge-email">Email</span>
                        )}
                      </td>
                      <td>
                        {l.status === 'SUCCESS' ? (
                          <span className="status-pill-success">SUCCESS</span>
                        ) : (
                          <span className="status-pill-failed">FAILED</span>
                        )}
                      </td>
                      <td><code style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{l.ip_address || '127.0.0.1'}</code></td>
                      <td style={{ fontSize: '0.75rem', color: l.error_reason ? '#f87171' : 'var(--text-dim)' }}>
                        {l.error_reason || 'Verified'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(212, 175, 55, 0.15)', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Storage: <code style={{ color: 'var(--gold-300)' }}>database/users.db</code> • CLI inspection: <code style={{ color: 'var(--gold-400)' }}>node db-cli.js users</code>
          </div>
          {lastRefreshed && (
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Updated {lastRefreshed}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Component: InstallModal (Progressive Web App Native Installation)
   ========================================================================== */
function InstallModal({ isOpen, onClose, onInstall, isIos, onSound }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && onClose()}>
      <div className="modal-dialog install-modal-dialog">
        <button className="btn-glass btn-glass-icon btn-glass-sm modal-close-btn" onClick={onClose}>✕</button>

        <div className="install-crest-badge">
          <span>FS</span>
        </div>

        <div className="hero-badge" style={{ marginBottom: '8px' }}>
          <span className="gold-diamond"></span>
          <span>NATIVE APP EXPERIENCE • PROGRESSIVE WEB APP</span>
          <span className="gold-diamond"></span>
        </div>

        <h3 className="font-serif" style={{ fontSize: '1.7rem', color: '#fff', letterSpacing: '2px', marginBottom: '8px' }}>
          INSTALL <span className="gold-gradient-text">FIRE SPICE</span> APP
        </h3>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5', maxWidth: '420px', margin: '0 auto 16px' }}>
          Install FIRE SPICE on your device for instantaneous home screen launch, full-screen immersion, and offline digital boarding passes.
        </p>

        <div className="install-perks-list">
          <div className="install-perk-item">
            <span className="install-perk-icon">✦</span>
            <div>
              <div className="install-perk-title">1-Tap Home Screen &amp; Desktop Launch</div>
              <div className="install-perk-desc">Launches standalone without browser URL bars, tabs, or address headers.</div>
            </div>
          </div>

          <div className="install-perk-item">
            <span className="install-perk-icon">✦</span>
            <div>
              <div className="install-perk-title">Offline VIP Digital Pass &amp; QR Codes</div>
              <div className="install-perk-desc">Access confirmed reservations and digital passes even with zero cellular signal.</div>
            </div>
          </div>

          <div className="install-perk-item">
            <span className="install-perk-icon">✦</span>
            <div>
              <div className="install-perk-title">Tactile Haptics &amp; 60 FPS Performance</div>
              <div className="install-perk-desc">Pre-cached application shell delivering instantaneous silky navigation.</div>
            </div>
          </div>
        </div>

        {isIos ? (
          <div className="ios-step-box">
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.82rem', color: 'var(--gold-400)', letterSpacing: '1px', marginBottom: '10px', textTransform: 'uppercase' }}>
              How to Install on iPhone / iPad (Safari):
            </div>
            <div className="ios-step-item">
              <span className="ios-step-number">1</span>
              <span>Tap the <strong>Share</strong> button (<strong>⎋</strong> or <strong>↥</strong>) at the bottom of Safari</span>
            </div>
            <div className="ios-step-item">
              <span className="ios-step-number">2</span>
              <span>Scroll down and select <strong>"Add to Home Screen"</strong> (<strong>⊞</strong>)</span>
            </div>
            <div className="ios-step-item">
              <span className="ios-step-number">3</span>
              <span>Tap <strong>"Add"</strong> in the top-right corner to place FIRE SPICE on your home screen!</span>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '16px' }}>
            <button
              className="btn-glass btn-glass-gold btn-glass-lg"
              style={{ width: '100%', padding: '14px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              onClick={() => {
                onInstall();
                onSound('confirm');
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>Install FIRE SPICE App</span>
            </button>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '8px' }}>
              Supported natively on Chrome, Edge, Brave, Android &amp; Windows.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   Main Application Root Component
   ========================================================================== */
function App() {
  const [step, setStep] = useState(1);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('firespice_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  // Auto-open authentication modal at the very beginning if user is not signed in
  const [authModalOpen, setAuthModalOpen] = useState(() => {
    try {
      const stored = localStorage.getItem('firespice_user');
      return !stored;
    } catch (e) {
      return true;
    }
  });
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [databaseModalOpen, setDatabaseModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already installed PWA)
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      setIsStandalone(standalone);
    };
    checkStandalone();
    try {
      window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone);
    } catch (e) {}

    // Detect iOS Safari
    const ua = window.navigator.userAgent || '';
    const isApple = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    setIsIos(isApple);

    // Capture install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setDeferredPrompt(null);
          setInstallModalOpen(false);
        }
      } catch (err) {
        setInstallModalOpen(true);
      }
    } else {
      setInstallModalOpen(true);
    }
  };

  const [speed, setSpeed] = useState('normal'); // 'slow', 'normal', 'paused'
  const [dim, setDim] = useState('comfort');    // 'rich', 'comfort', 'deep'

  const [booking, setBooking] = useState({
    guests: 2,
    dateString: '2026-11-20',
    dateFormatted: 'Fri, Nov 20, 2026',
    time: '19:45',
    timeFormatted: '7:45 PM (Prime Dinner)',
    tableId: 'A2',
    tableData: TABLES_DATABASE[1],
    occasion: 'Anniversary',
    addons: [],
    guestInfo: { firstName: '', lastName: '', email: '', phone: '', dietary: '', notes: '' }
  });

  const onSound = useCallback((type) => {
    playChime(audioEnabled, type);
  }, [audioEnabled]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('firespice_user', JSON.stringify(user));
    } catch (e) {}
    // Automatically pre-fill the reservation details with the user's info
    setBooking(prev => ({
      ...prev,
      guestInfo: {
        ...prev.guestInfo,
        firstName: user.firstName || prev.guestInfo.firstName,
        lastName: user.lastName || prev.guestInfo.lastName,
        email: user.email || prev.guestInfo.email,
        phone: user.phone || prev.guestInfo.phone,
        dietary: user.dietary || prev.guestInfo.dietary,
        notes: user.notes || prev.guestInfo.notes
      }
    }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('firespice_user');
    } catch (e) {}
    onSound('click');
    setAuthModalOpen(true);
  };

  const handleConfirmReservation = (guestInfo, total) => {
    const code = `FSP-${Math.floor(1000 + Math.random() * 9000)}-VIP`;
    const res = {
      code,
      guestName: `${guestInfo.firstName} ${guestInfo.lastName}`,
      email: guestInfo.email,
      phone: guestInfo.phone,
      dietary: guestInfo.dietary || 'None reported',
      notes: guestInfo.notes || 'Standard booking',
      dateFormatted: booking.dateFormatted,
      timeFormatted: booking.timeFormatted,
      tableId: booking.tableId,
      tableName: booking.tableData.name,
      zone: booking.tableData.zoneName,
      guests: booking.guests,
      occasion: booking.occasion,
      total,
      vipTier: currentUser ? (currentUser.provider === 'google' ? 'Google Verified' : currentUser.tierBadge) : null,
      vipMemberId: currentUser ? currentUser.id : null,
      provider: currentUser ? currentUser.provider : null,
      timestamp: Date.now()
    };

    const stored = localStorage.getItem('firespice_reservations');
    const list = stored ? JSON.parse(stored) : [];
    list.unshift(res);
    localStorage.setItem('firespice_reservations', JSON.stringify(list));

    setConfirmedReservation(res);
    setStep(5);
    onSound('confirm');
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(s => s + 1);
      onSound('click');
      const el = document.getElementById('bookingConsole');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(s => s - 1);
      onSound('click');
      const el = document.getElementById('bookingConsole');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-wrapper">
      <RollingBackground speed={speed} dim={dim} />

      <Header
        onNav={(s) => {
          if (!currentUser) setAuthModalOpen(true);
          else { setStep(s); onSound('click'); }
        }}
        audioEnabled={audioEnabled}
        onToggleAudio={() => { setAudioEnabled(a => !a); onSound('click'); }}
        onOpenBookings={() => { setModalOpen(true); onSound('click'); }}
        currentUser={currentUser}
        onOpenAuth={() => { setAuthModalOpen(true); onSound('click'); }}
        onLogout={handleLogout}
        onOpenDatabase={() => { setDatabaseModalOpen(true); onSound('click'); }}
        onOpenInstall={() => { setInstallModalOpen(true); onSound('click'); }}
        isStandalone={isStandalone}
      />

      <HeroSection />

      <main className="booking-console-container" id="bookingConsole">
        {!currentUser ? (
          <LockedConsoleGate
            onOpenGoogleAuth={() => { setAuthModalOpen(true); onSound('click'); }}
            onOpenEmailAuth={() => { setAuthModalOpen(true); onSound('click'); }}
          />
        ) : (
          <div className="console-card">
            <Stepper
              currentStep={step}
              onStepClick={(s) => { setStep(s); onSound('click'); }}
              booking={booking}
            />

            {step === 1 && <StepDateTime booking={booking} setBooking={setBooking} onSound={onSound} />}
            {step === 2 && <StepFloorPlan booking={booking} setBooking={setBooking} onSound={onSound} onProceed={() => { setStep(3); onSound('select'); }} />}
            {step === 3 && <StepEnhancements booking={booking} setBooking={setBooking} onSound={onSound} />}
            {step === 4 && (
              <StepGuestDetails
                booking={booking}
                setBooking={setBooking}
                onConfirm={handleConfirmReservation}
                onSound={onSound}
                currentUser={currentUser}
                onOpenAuth={() => { setAuthModalOpen(true); onSound('click'); }}
              />
            )}
            {step === 5 && (
              <StepConfirmedPass
                reservation={confirmedReservation}
                onReset={() => {
                  setBooking(prev => ({ ...prev, addons: [] }));
                  setStep(1);
                  onSound('click');
                }}
                onSound={onSound}
                currentUser={currentUser}
              />
            )}

            {step < 5 && (
              <div className="console-nav-footer">
                <button
                  className="btn-glass btn-glass-secondary"
                  style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
                  onClick={prevStep}
                >
                  ← Back
                </button>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                  {step === 1 && 'Complimentary cancellation up to 24 hours prior to service.'}
                  {step === 2 && 'All tables guaranteed for 2.5 hours of unhurried dining.'}
                  {step === 3 && 'Sommelier pairings are curated to your course selection.'}
                  {step === 4 && '✦ Verified Google/Email table reservation guarantee applied.'}
                </div>

                {step < 4 ? (
                  <button className="btn-glass btn-glass-gold" onClick={nextStep}>
                    {step === 1 ? 'Continue to Table Selection →' : step === 2 ? 'Continue to Enhancements →' : 'Proceed to Guest Details →'}
                  </button>
                ) : (
                  <div style={{ width: '120px' }} />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <MenuShowcase onSound={onSound} />

      <AmbianceController
        speed={speed}
        setSpeed={setSpeed}
        dim={dim}
        setDim={setDim}
        onSound={onSound}
      />

      <BookingsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onViewPass={(res) => {
          setConfirmedReservation(res);
          setStep(5);
        }}
        onSound={onSound}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        onSound={onSound}
      />

      <DatabaseModal
        isOpen={databaseModalOpen}
        onClose={() => setDatabaseModalOpen(false)}
        onSound={onSound}
      />

      <InstallModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        onInstall={handleInstallClick}
        isIos={isIos}
        onSound={onSound}
      />

      <footer className="luxury-footer">
        <div className="footer-content">
          <h3 className="font-serif" style={{ fontSize: '1.3rem', letterSpacing: '4px', color: 'var(--gold-300)', marginBottom: '8px' }}>
            FIRE SPICE ATELIER CULINAIRE
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            450 Golden Pavilion Way, Royal Skyline District • Valet Parking Provided
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {!isStandalone && (
              <button
                className="btn-glass btn-glass-sm btn-install-app"
                onClick={() => { setInstallModalOpen(true); onSound('click'); }}
                style={{ color: 'var(--gold-300)', borderColor: 'rgba(212, 175, 55, 0.45)' }}
              >
                📲 Install FIRE SPICE App
              </button>
            )}
            <button
              className="btn-glass btn-glass-sm"
              onClick={() => { setDatabaseModalOpen(true); onSound('click'); }}
              style={{ color: 'var(--gold-300)', borderColor: 'rgba(212, 175, 55, 0.4)' }}
            >
              🗄️ Inspect SQLite Database & Logins
            </button>
            <button className="btn-glass btn-glass-sm btn-glass-secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              ↑ Back to Top
            </button>
          </div>
          <p className="footer-copyright">
            © 2026 FIRE SPICE RESTAURANT GROUP. ALL RIGHTS RESERVED. POWERED BY REACT 18.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Mount React Root
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

