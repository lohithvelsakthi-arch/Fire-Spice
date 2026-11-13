/**
 * FIRE SPICE - Haute Gastronomie & Golden Lounge
 * Interactive Table Booking Application
 */

(function () {
  'use strict';

  /* ==========================================================================
     Application State
     ========================================================================== */
  const state = {
    currentStep: 1,
    audioEnabled: true,
    calendar: {
      year: 2026,
      month: 10, // November (0-indexed)
      selectedDay: 20
    },
    booking: {
      guests: 2,
      dateString: '2026-11-20',
      dateFormatted: 'Fri, Nov 20, 2026',
      time: '19:45',
      timeFormatted: '7:45 PM (Prime Dinner)',
      zoneFilter: 'all',
      tableId: 'A2',
      tableData: null,
      occasion: 'Anniversary',
      addons: [],
      guestInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dietary: '',
        notes: ''
      },
      confirmationCode: '',
      totalEstimate: 360
    },
    background: {
      speed: 'normal', // 'slow', 'normal', 'paused'
      dim: 'comfort',  // 'subtle', 'comfort', 'deep'
      blur: 'normal'
    }
  };

  /* ==========================================================================
     Audio Synthesizer (Crystal Glass Chime via Web Audio API)
     ========================================================================== */
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playCrystalChime(type = 'click') {
    if (!state.audioEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';

      if (type === 'confirm') {
        // Multi-tone champagne flute toast harmonic
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

      if (type === 'select') {
        osc.frequency.setValueAtTime(1567.98, now); // G6
        osc.frequency.exponentialRampToValueAtTime(1760.0, now + 0.15); // A6
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      } else {
        // Gentle glass button tap
        osc.frequency.setValueAtTime(1318.51, now); // E6
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      }

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn('Audio chime skipped:', e);
    }
  }

  /* ==========================================================================
     Database: Tables & Floor Plan
     ========================================================================== */
  const tablesDatabase = [
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

  /* ==========================================================================
     Database: Tasting Menu Highlights
     ========================================================================== */
  const menuDatabase = [
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

  /* ==========================================================================
     Preload / LocalStorage Reservations Handling
     ========================================================================== */
  function getStoredReservations() {
    const raw = localStorage.getItem('firespice_reservations');
    if (!raw) {
      // Pre-seed an initial sample booking so user can test "Find Reservation" immediately!
      const initial = [
        {
          code: 'AUR-7824-VIP',
          guestName: 'Alexander Vance',
          email: 'alexander.vance@firespice.com',
          phone: '+1 (555) 892-0199',
          dateFormatted: 'Fri, Nov 20, 2026',
          timeFormatted: '7:45 PM (Prime Dinner)',
          tableId: 'A2',
          tableName: 'Table A2 • Imperial Centerpiece',
          zone: 'The Golden Atrium',
          guests: 2,
          occasion: 'Anniversary',
          total: 360,
          dietary: 'Gluten-Free, Shellfish Allergy',
          notes: 'Window vantage preferred. Discreet anniversary welcome.'
        }
      ];
      localStorage.setItem('firespice_reservations', JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  function saveReservation(bookingObj) {
    const list = getStoredReservations();
    list.unshift(bookingObj);
    localStorage.setItem('firespice_reservations', JSON.stringify(list));
  }

  /* ==========================================================================
     DOM Elements Cache
     ========================================================================== */
  const DOM = {
    // Stepper & Panes
    steps: [
      document.getElementById('stepIndicator1'),
      document.getElementById('stepIndicator2'),
      document.getElementById('stepIndicator3'),
      document.getElementById('stepIndicator4')
    ],
    panes: [
      document.getElementById('stepPane1'),
      document.getElementById('stepPane2'),
      document.getElementById('stepPane3'),
      document.getElementById('stepPane4'),
      document.getElementById('stepPane5')
    ],
    consoleNavFooter: document.getElementById('consoleNavFooter'),
    prevStepBtn: document.getElementById('prevStepBtn'),
    nextStepBtn: document.getElementById('nextStepBtn'),
    stepFooterNote: document.getElementById('stepFooterNote'),

    // Subtitle Previews
    step1Preview: document.getElementById('step1Preview'),
    step2Preview: document.getElementById('step2Preview'),
    step3Preview: document.getElementById('step3Preview'),
    step4Preview: document.getElementById('step4Preview'),

    // Step 1 controls
    guestButtons: document.querySelectorAll('#guestButtonsGroup .btn-guest-choice'),
    calendarMonthTitle: document.getElementById('calendarMonthTitle'),
    calendarDaysGrid: document.getElementById('calendarDaysGrid'),
    calPrevBtn: document.getElementById('calPrevMonthBtn'),
    calNextBtn: document.getElementById('calNextMonthBtn'),
    timeSlotButtons: document.querySelectorAll('.time-slot-btn'),

    // Step 2 controls
    architecturalFloorGrid: document.getElementById('architecturalFloorGrid'),
    zoneFilterButtons: document.querySelectorAll('.zone-filters button'),
    sidebarTableImg: document.getElementById('sidebarTableImg'),
    sidebarTableTitle: document.getElementById('sidebarTableTitle'),
    sidebarTableZone: document.getElementById('sidebarTableZone'),
    sidebarTableCapacity: document.getElementById('sidebarTableCapacity'),
    sidebarTableDescription: document.getElementById('sidebarTableDescription'),
    sidebarTableSpend: document.getElementById('sidebarTableSpend'),
    feat1: document.getElementById('feat1'),
    feat2: document.getElementById('feat2'),
    feat3: document.getElementById('feat3'),
    confirmTableSelectionBtn: document.getElementById('confirmTableSelectionBtn'),

    // Step 3 controls
    occasionButtons: document.querySelectorAll('#occasionPillsGroup button'),
    enhancementCards: document.querySelectorAll('.experience-card'),

    // Step 4 controls
    guestFirstName: document.getElementById('guestFirstName'),
    guestLastName: document.getElementById('guestLastName'),
    guestEmail: document.getElementById('guestEmail'),
    guestPhone: document.getElementById('guestPhone'),
    guestDietary: document.getElementById('guestDietary'),
    guestNotes: document.getElementById('guestNotes'),
    dressCodeAgree: document.getElementById('dressCodeAgree'),
    sumDate: document.getElementById('sumDate'),
    sumTime: document.getElementById('sumTime'),
    sumGuests: document.getElementById('sumGuests'),
    sumTable: document.getElementById('sumTable'),
    sumOccasion: document.getElementById('sumOccasion'),
    sumEnhancementsList: document.getElementById('sumEnhancementsList'),
    sumTotal: document.getElementById('sumTotal'),
    submitReservationBtn: document.getElementById('submitReservationBtn'),

    // Step 5 controls
    passCode: document.getElementById('passCode'),
    passGuestName: document.getElementById('passGuestName'),
    passGuests: document.getElementById('passGuests'),
    passDateTime: document.getElementById('passDateTime'),
    passTable: document.getElementById('passTable'),
    passQrCanvas: document.getElementById('passQrCanvas'),
    downloadPassBtn: document.getElementById('downloadPassBtn'),
    addToCalBtn: document.getElementById('addToCalBtn'),
    bookAnotherBtn: document.getElementById('bookAnotherBtn'),

    // Header & Modal
    audioToggleBtn: document.getElementById('audioToggleBtn'),
    audioIconOn: document.getElementById('audioIconOn'),
    audioIconOff: document.getElementById('audioIconOff'),
    navBookBtn: document.getElementById('navBookBtn'),
    navFloorPlanBtn: document.getElementById('navFloorPlanBtn'),
    navMenuBtn: document.getElementById('navMenuBtn'),
    openBookingsModalBtn: document.getElementById('openBookingsModalBtn'),
    closeBookingsModalBtn: document.getElementById('closeBookingsModalBtn'),
    bookingsModal: document.getElementById('bookingsModal'),
    bookingSearchInput: document.getElementById('bookingSearchInput'),
    searchBookingBtn: document.getElementById('searchBookingBtn'),
    userBookingsList: document.getElementById('userBookingsList'),

    // Menu preview
    menuFilters: document.getElementById('menuFilters'),
    menuItemsGrid: document.getElementById('menuItemsGrid'),

    // Rolling Ribbon & Ambiance
    rollingRibbon: document.getElementById('rollingRibbon'),
    speedSlowBtn: document.getElementById('speedSlowBtn'),
    speedNormalBtn: document.getElementById('speedNormalBtn'),
    speedPauseBtn: document.getElementById('speedPauseBtn'),
    dimSubtleBtn: document.getElementById('dimSubtleBtn'),
    dimComfortBtn: document.getElementById('dimComfortBtn'),
    dimDeepBtn: document.getElementById('dimDeepBtn')
  };

  /* ==========================================================================
     Calendar Logic
     ========================================================================== */
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function renderCalendar() {
    const { year, month, selectedDay } = state.calendar;
    DOM.calendarMonthTitle.textContent = `${monthNames[month]} ${year}`;

    DOM.calendarDaysGrid.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Pad blank days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      const blank = document.createElement('div');
      DOM.calendarDaysGrid.appendChild(blank);
    }

    // Populate actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayBtn = document.createElement('button');
      dayBtn.className = 'cal-day-btn';
      dayBtn.textContent = day;

      // Simulated minimum date rule: disable past days
      if (day < 13 && month === 10 && year === 2026) {
        dayBtn.disabled = true;
      }

      if (day === 13 && month === 10 && year === 2026) {
        dayBtn.classList.add('today');
      }

      if (day === selectedDay) {
        dayBtn.classList.add('selected');
      }

      dayBtn.addEventListener('click', () => {
        state.calendar.selectedDay = day;
        updateSelectedDate();
        renderCalendar();
        playCrystalChime('select');
      });

      DOM.calendarDaysGrid.appendChild(dayBtn);
    }
  }

  function updateSelectedDate() {
    const { year, month, selectedDay } = state.calendar;
    const dateObj = new Date(year, month, selectedDay);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    state.booking.dateFormatted = dateObj.toLocaleDateString('en-US', options);
    state.booking.dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    
    // Update live previews
    DOM.step1Preview.textContent = `${state.booking.dateFormatted} • ${state.booking.time}`;
    updateSummaryBill();
  }

  /* ==========================================================================
     Floor Plan & Table Map Logic
     ========================================================================== */
  function renderFloorPlan() {
    // Retain top terrace and bottom bar markers while injecting tables
    const markers = DOM.architecturalFloorGrid.querySelectorAll('.arch-marker-terrace, .arch-marker-bar');
    DOM.architecturalFloorGrid.innerHTML = '';
    
    // Add back terrace marker
    DOM.architecturalFloorGrid.appendChild(markers[0]);

    // Filter tables
    const filtered = tablesDatabase.filter(tbl => {
      if (state.booking.zoneFilter === 'all') return true;
      return tbl.zone === state.booking.zoneFilter;
    });

    filtered.forEach(tbl => {
      const tableNode = document.createElement('div');
      tableNode.className = `table-node shape-${tbl.shape} ${tbl.status}`;
      if (tbl.id === state.booking.tableId) {
        tableNode.classList.add('selected');
      }

      tableNode.innerHTML = `
        <span class="table-status-pill">${tbl.status}</span>
        <div class="table-plate-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="8"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
        <span class="table-id-tag">${tbl.id}</span>
        <span class="table-capacity-tag">${tbl.capacity} Seats</span>
      `;

      if (tbl.status !== 'reserved') {
        tableNode.addEventListener('click', () => {
          selectTable(tbl);
          playCrystalChime('select');
        });
      }

      DOM.architecturalFloorGrid.appendChild(tableNode);
    });

    // Add back bottom bar marker
    DOM.architecturalFloorGrid.appendChild(markers[1]);
  }

  function selectTable(table) {
    state.booking.tableId = table.id;
    state.booking.tableData = table;

    // Update Sidebar
    DOM.sidebarTableImg.src = table.img;
    DOM.sidebarTableTitle.textContent = table.name;
    DOM.sidebarTableZone.textContent = table.zoneName;
    DOM.sidebarTableCapacity.textContent = `Up to ${table.capacity} Guests`;
    DOM.sidebarTableDescription.textContent = table.description;
    DOM.sidebarTableSpend.textContent = `$${table.minSpend} / guest`;

    DOM.feat1.textContent = table.features[0] || 'Exclusive Service';
    DOM.feat2.textContent = table.features[1] || 'Atmospheric Vantage';
    DOM.feat3.textContent = table.features[2] || 'Acoustic Privacy';

    DOM.step2Preview.textContent = `${table.id} • ${table.zoneName}`;

    renderFloorPlan();
    updateSummaryBill();
  }

  /* ==========================================================================
     Pricing & Summary Calculation
     ========================================================================== */
  function updateSummaryBill() {
    const b = state.booking;
    const table = b.tableData || tablesDatabase.find(t => t.id === b.tableId) || tablesDatabase[1];
    b.tableData = table;

    // Minimum table spend guarantee calculation
    const baseTableGuarantee = (table.minSpend || 180) * b.guests;

    // Add-on calculation
    let addonsTotal = 0;
    DOM.sumEnhancementsList.innerHTML = '';

    if (b.addons.length > 0) {
      b.addons.forEach(addon => {
        let cost = addon.price;
        if (addon.id === 'wine-pairing') {
          cost = addon.price * b.guests;
        }
        addonsTotal += cost;

        const row = document.createElement('div');
        row.className = 'summary-row';
        row.style.fontSize = '0.82rem';
        row.style.color = 'var(--gold-300)';
        row.innerHTML = `
          <span>+ ${addon.title}</span>
          <span>$${cost}</span>
        `;
        DOM.sumEnhancementsList.appendChild(row);
      });
    } else {
      const noneRow = document.createElement('div');
      noneRow.className = 'summary-row';
      noneRow.style.fontSize = '0.78rem';
      noneRow.style.color = 'var(--text-dim)';
      noneRow.innerHTML = `<span>Enhancements</span><span>None selected</span>`;
      DOM.sumEnhancementsList.appendChild(noneRow);
    }

    const totalEstimate = baseTableGuarantee + addonsTotal;
    b.totalEstimate = totalEstimate;

    // Update Step 4 DOM Elements
    DOM.sumDate.textContent = b.dateFormatted;
    DOM.sumTime.textContent = b.timeFormatted;
    DOM.sumGuests.textContent = `${b.guests} Guests`;
    DOM.sumTable.textContent = `${table.name}`;
    DOM.sumOccasion.textContent = b.occasion;
    DOM.sumTotal.textContent = `$${totalEstimate}`;
  }

  /* ==========================================================================
     Stepper Navigation
     ========================================================================== */
  function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > 5) return;
    state.currentStep = stepNumber;

    // Update stepper tabs
    DOM.steps.forEach((stepEl, idx) => {
      const stepIdx = idx + 1;
      stepEl.classList.remove('active', 'completed');
      if (stepIdx === stepNumber) {
        stepEl.classList.add('active');
      } else if (stepIdx < stepNumber) {
        stepEl.classList.add('completed');
      }
    });

    // Update panes
    DOM.panes.forEach((paneEl, idx) => {
      if (idx + 1 === stepNumber) {
        paneEl.classList.add('active');
      } else {
        paneEl.classList.remove('active');
      }
    });

    // Manage bottom navigation buttons
    if (stepNumber === 1) {
      DOM.prevStepBtn.style.visibility = 'hidden';
      DOM.nextStepBtn.textContent = 'Continue to Table Selection →';
      DOM.stepFooterNote.textContent = 'Complimentary cancellation up to 24 hours prior to service.';
      DOM.consoleNavFooter.style.display = 'flex';
    } else if (stepNumber === 2) {
      DOM.prevStepBtn.style.visibility = 'visible';
      DOM.nextStepBtn.textContent = 'Continue to Enhancements →';
      DOM.stepFooterNote.textContent = 'All tables guaranteed for 2.5 hours of unhurried dining.';
      DOM.consoleNavFooter.style.display = 'flex';
    } else if (stepNumber === 3) {
      DOM.prevStepBtn.style.visibility = 'visible';
      DOM.nextStepBtn.textContent = 'Proceed to Guest Details →';
      DOM.stepFooterNote.textContent = 'Sommelier pairings are curated to your course selection.';
      DOM.consoleNavFooter.style.display = 'flex';
    } else if (stepNumber === 4) {
      DOM.prevStepBtn.style.visibility = 'visible';
      DOM.nextStepBtn.textContent = 'Review & Confirm Table';
      DOM.stepFooterNote.textContent = 'A holding deposit of $50/guest is held to secure prime reservations.';
      DOM.consoleNavFooter.style.display = 'flex';
    } else if (stepNumber === 5) {
      // Confirmed pass pane: hide footer stepper
      DOM.consoleNavFooter.style.display = 'none';
      playCrystalChime('confirm');
    }

    // Scroll smoothly to top of console
    document.getElementById('bookingConsole').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ==========================================================================
     Digital VIP Pass & Canvas QR Code Generation
     ========================================================================== */
  function generateQrCode(canvas, text) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    // Dark luxury backing
    ctx.fillStyle = '#060608';
    ctx.fillRect(0, 0, size, size);

    // Procedural high-aesthetic gold matrix pattern
    ctx.fillStyle = '#d4af37';

    const gridSize = 15;
    const cellSize = size / gridSize;

    // Simple deterministic hash based on text
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    // Draw stylized position marker corners
    function drawPositionMarker(x, y) {
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(x * cellSize, y * cellSize, 4 * cellSize, 4 * cellSize);
      ctx.fillStyle = '#060608';
      ctx.fillRect((x + 0.8) * cellSize, (y + 0.8) * cellSize, 2.4 * cellSize, 2.4 * cellSize);
      ctx.fillStyle = '#f9e7a2';
      ctx.fillRect((x + 1.4) * cellSize, (y + 1.4) * cellSize, 1.2 * cellSize, 1.2 * cellSize);
    }

    drawPositionMarker(1, 1);
    drawPositionMarker(gridSize - 5, 1);
    drawPositionMarker(1, gridSize - 5);

    // Data dots
    ctx.fillStyle = '#e5c365';
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip corner finder patterns
        if ((r < 5 && c < 5) || (r < 5 && c > gridSize - 6) || (r > gridSize - 6 && c < 5)) {
          continue;
        }
        const pseudoRandom = Math.abs(Math.sin((r * 13 + c * 37 + hash) * 1.5));
        if (pseudoRandom > 0.45) {
          ctx.beginPath();
          ctx.arc(
            c * cellSize + cellSize / 2,
            r * cellSize + cellSize / 2,
            cellSize * 0.38,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    }

    // Center Gold Crown Seal Emblem
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
  }

  function populateVipPass(reservation) {
    DOM.passCode.textContent = reservation.code;
    DOM.passGuestName.textContent = reservation.guestName;
    DOM.passGuests.textContent = `${reservation.guests} Guests (${reservation.occasion})`;
    DOM.passDateTime.textContent = `${reservation.dateFormatted} • ${reservation.timeFormatted.split(' ')[0]}`;
    DOM.passTable.textContent = `${reservation.tableId} • ${reservation.zone}`;

    generateQrCode(DOM.passQrCanvas, reservation.code);
  }

  /* ==========================================================================
     Calendar (.ics) Generator
     ========================================================================== */
  function downloadIcsCalendar(res) {
    const title = `FIRE SPICE Reservation: ${res.tableName}`;
    const desc = `Luxury Table Reservation at FIRE SPICE Haute Gastronomie.\\nConfirmation Code: ${res.code}\\nParty Size: ${res.guests} Guests\\nDress Code: Elegant Evening Attire\\nAddress: 450 Golden Pavilion Way`;
    const location = "FIRE SPICE Atelier Culinaire, 450 Golden Pavilion Way";

    const startIso = `${state.booking.dateString.replace(/-/g, '')}T194500Z`;
    const endIso = `${state.booking.dateString.replace(/-/g, '')}T221500Z`;
    const now = new Date();

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FIRE SPICE Restaurant//Reservation System//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${res.code}@firespice-restaurant.com`,
      `DTSTAMP:${now.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `FIRESPICE-Reservation-${res.code}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* ==========================================================================
     Menu Items Render
     ========================================================================== */
  function renderMenuItems(category = 'all') {
    DOM.menuItemsGrid.innerHTML = '';
    const filtered = menuDatabase.filter(item => {
      if (category === 'all') return true;
      return item.category === category;
    });

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-card';
      card.innerHTML = `
        <img class="menu-card-img" src="${item.img}" alt="${item.title}" loading="lazy">
        <div class="menu-card-body">
          <div class="menu-card-title-row">
            <h4 class="menu-item-title">${item.title}</h4>
            <span class="menu-item-price">${item.price}</span>
          </div>
          <p class="menu-item-desc">${item.desc}</p>
          <div class="menu-item-tags">
            <span class="menu-badge">${item.badge}</span>
            <span class="menu-badge" style="border-color: rgba(250, 235, 173, 0.4);">${item.pairing}</span>
          </div>
        </div>
      `;
      DOM.menuItemsGrid.appendChild(card);
    });
  }

  /* ==========================================================================
     Reservation Management Modal Logic
     ========================================================================== */
  function renderBookingsModalList(filterKeyword = '') {
    const list = getStoredReservations();
    DOM.userBookingsList.innerHTML = '';

    const matching = list.filter(item => {
      if (!filterKeyword) return true;
      const kw = filterKeyword.toLowerCase().trim();
      return (
        item.code.toLowerCase().includes(kw) ||
        item.guestName.toLowerCase().includes(kw) ||
        item.phone.includes(kw)
      );
    });

    if (matching.length === 0) {
      DOM.userBookingsList.innerHTML = `
        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
          No reservations found for "${filterKeyword}".
        </div>
      `;
      return;
    }

    matching.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.style.cssText = `
        background: rgba(18, 18, 24, 0.75);
        border: 1px solid rgba(212, 175, 55, 0.25);
        border-radius: 14px;
        padding: 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      `;

      itemEl.innerHTML = `
        <div>
          <div style="display: flex; align-items: baseline; gap: 8px;">
            <span class="pass-code-badge" style="padding: 2px 8px; font-size: 0.78rem;">${item.code}</span>
            <strong style="font-family: 'Cinzel', serif; font-size: 1.05rem; color: #fff;">${item.guestName}</strong>
          </div>
          <div style="font-size: 0.8rem; color: var(--gold-300); margin: 4px 0;">
            ${item.dateFormatted} • ${item.timeFormatted} • ${item.tableName}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">
            Party: ${item.guests} Guests • Guarantee: $${item.total}
          </div>
        </div>
        <div style="display: flex; gap: 8px; flex-shrink: 0;">
          <button class="btn-glass btn-glass-sm view-pass-btn">View Pass</button>
          <button class="btn-glass btn-glass-sm cancel-res-btn" style="border-color: rgba(248, 113, 113, 0.4); color: #f87171;">Cancel</button>
        </div>
      `;

      // View Pass Action
      itemEl.querySelector('.view-pass-btn').addEventListener('click', () => {
        DOM.bookingsModal.classList.remove('open');
        populateVipPass(item);
        goToStep(5);
        playCrystalChime('select');
      });

      // Cancel Action
      itemEl.querySelector('.cancel-res-btn').addEventListener('click', () => {
        if (confirm(`Cancel reservation ${item.code} for ${item.guestName}?`)) {
          const updated = getStoredReservations().filter(b => b.code !== item.code);
          localStorage.setItem('firespice_reservations', JSON.stringify(updated));
          renderBookingsModalList(DOM.bookingSearchInput.value);
          playCrystalChime('click');
        }
      });

      DOM.userBookingsList.appendChild(itemEl);
    });
  }

  /* ==========================================================================
     Ambiance Controller (UX Protected Rolling Background Photos)
     ========================================================================== */
  function setupAmbianceControls() {
    // Speed Controls
    DOM.speedSlowBtn.addEventListener('click', () => {
      DOM.rollingRibbon.style.setProperty('--roll-speed', '120s');
      DOM.rollingRibbon.style.animationPlayState = 'running';
      DOM.speedSlowBtn.classList.add('active');
      DOM.speedNormalBtn.classList.remove('active');
      DOM.speedPauseBtn.classList.remove('active');
      playCrystalChime('click');
    });

    DOM.speedNormalBtn.addEventListener('click', () => {
      DOM.rollingRibbon.style.setProperty('--roll-speed', '65s');
      DOM.rollingRibbon.style.animationPlayState = 'running';
      DOM.speedNormalBtn.classList.add('active');
      DOM.speedSlowBtn.classList.remove('active');
      DOM.speedPauseBtn.classList.remove('active');
      playCrystalChime('click');
    });

    DOM.speedPauseBtn.addEventListener('click', () => {
      DOM.rollingRibbon.style.animationPlayState = 'paused';
      DOM.speedPauseBtn.classList.add('active');
      DOM.speedSlowBtn.classList.remove('active');
      DOM.speedNormalBtn.classList.remove('active');
      playCrystalChime('click');
    });

    // Dimming Controls (Adjust rolling photo presence & visibility)
    DOM.dimSubtleBtn.addEventListener('click', () => {
      DOM.rollingRibbon.style.setProperty('--gallery-opacity', '0.88');
      DOM.rollingRibbon.style.setProperty('--gallery-blur', '0px');
      DOM.dimSubtleBtn.classList.add('active');
      DOM.dimComfortBtn.classList.remove('active');
      DOM.dimDeepBtn.classList.remove('active');
      playCrystalChime('click');
    });

    DOM.dimComfortBtn.addEventListener('click', () => {
      DOM.rollingRibbon.style.setProperty('--gallery-opacity', '0.72');
      DOM.rollingRibbon.style.setProperty('--gallery-blur', '1px');
      DOM.dimComfortBtn.classList.add('active');
      DOM.dimSubtleBtn.classList.remove('active');
      DOM.dimDeepBtn.classList.remove('active');
      playCrystalChime('click');
    });

    DOM.dimDeepBtn.addEventListener('click', () => {
      DOM.rollingRibbon.style.setProperty('--gallery-opacity', '0.38');
      DOM.rollingRibbon.style.setProperty('--gallery-blur', '3px');
      DOM.dimDeepBtn.classList.add('active');
      DOM.dimSubtleBtn.classList.remove('active');
      DOM.dimComfortBtn.classList.remove('active');
      playCrystalChime('click');
    });
  }

  /* ==========================================================================
     Event Listeners & User Interactions
     ========================================================================== */
  function setupEventListeners() {
    // Guest buttons
    DOM.guestButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.guestButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.booking.guests = parseInt(btn.dataset.guests, 10);
        updateSummaryBill();
        playCrystalChime('select');
      });
    });

    // Calendar month buttons
    DOM.calPrevBtn.addEventListener('click', () => {
      state.calendar.month--;
      if (state.calendar.month < 0) {
        state.calendar.month = 11;
        state.calendar.year--;
      }
      renderCalendar();
      playCrystalChime('click');
    });

    DOM.calNextBtn.addEventListener('click', () => {
      state.calendar.month++;
      if (state.calendar.month > 11) {
        state.calendar.month = 0;
        state.calendar.year++;
      }
      renderCalendar();
      playCrystalChime('click');
    });

    // Time slot buttons
    DOM.timeSlotButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.timeSlotButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.booking.time = btn.dataset.time;
        state.booking.timeFormatted = `${btn.querySelector('span:first-child').textContent} (${btn.querySelector('.time-slot-tag').textContent})`;
        DOM.step1Preview.textContent = `${state.booking.dateFormatted} • ${state.booking.time}`;
        updateSummaryBill();
        playCrystalChime('select');
      });
    });

    // Zone filters
    DOM.zoneFilterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.zoneFilterButtons.forEach(b => {
          b.classList.remove('active');
          b.classList.add('btn-glass-secondary');
        });
        btn.classList.add('active');
        btn.classList.remove('btn-glass-secondary');
        state.booking.zoneFilter = btn.dataset.zone;
        renderFloorPlan();
        playCrystalChime('click');
      });
    });

    // Confirm table button in sidebar
    DOM.confirmTableSelectionBtn.addEventListener('click', () => {
      goToStep(3);
      playCrystalChime('select');
    });

    // Occasion buttons
    DOM.occasionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.occasionButtons.forEach(b => {
          b.classList.remove('active');
          b.classList.add('btn-glass-secondary');
        });
        btn.classList.add('active');
        btn.classList.remove('btn-glass-secondary');
        state.booking.occasion = btn.dataset.occasion;
        DOM.step3Preview.textContent = `${state.booking.occasion} • ${state.booking.addons.length} Add-ons`;
        updateSummaryBill();
        playCrystalChime('click');
      });
    });

    // Enhancement add-on cards
    DOM.enhancementCards.forEach(card => {
      const toggleBtn = card.querySelector('.addon-toggle-btn');
      const addonId = card.dataset.addonId;
      const addonPrice = parseInt(card.dataset.price, 10);
      const addonTitle = card.querySelector('.experience-title').textContent;

      const toggleAction = () => {
        const isSelected = card.classList.toggle('selected');
        if (isSelected) {
          toggleBtn.textContent = '✓ Added to Evening';
          toggleBtn.classList.add('active');
          state.booking.addons.push({ id: addonId, price: addonPrice, title: addonTitle });
        } else {
          toggleBtn.textContent = 'Add to Evening';
          toggleBtn.classList.remove('active');
          state.booking.addons = state.booking.addons.filter(a => a.id !== addonId);
        }
        DOM.step3Preview.textContent = `${state.booking.occasion} • ${state.booking.addons.length} Add-on${state.booking.addons.length !== 1 ? 's' : ''}`;
        updateSummaryBill();
        playCrystalChime('select');
      };

      card.addEventListener('click', (e) => {
        if (e.target !== toggleBtn) {
          toggleAction();
        }
      });
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAction();
      });
    });

    // Navigation Footers (Next & Prev)
    DOM.nextStepBtn.addEventListener('click', () => {
      if (state.currentStep < 4) {
        goToStep(state.currentStep + 1);
        playCrystalChime('click');
      } else if (state.currentStep === 4) {
        handleFinalReservationSubmit();
      }
    });

    DOM.prevStepBtn.addEventListener('click', () => {
      if (state.currentStep > 1) {
        goToStep(state.currentStep - 1);
        playCrystalChime('click');
      }
    });

    // Stepper header tabs clickability
    DOM.steps.forEach((stepEl, idx) => {
      stepEl.addEventListener('click', () => {
        const target = idx + 1;
        if (target <= state.currentStep) {
          goToStep(target);
          playCrystalChime('click');
        }
      });
    });

    // Final Reservation Submit Button
    DOM.submitReservationBtn.addEventListener('click', handleFinalReservationSubmit);

    // Pass Actions
    DOM.downloadPassBtn.addEventListener('click', () => {
      alert("VIP Pass saved to device. Please present your confirmation pass upon arrival at FIRE SPICE.");
      playCrystalChime('select');
    });

    DOM.addToCalBtn.addEventListener('click', () => {
      const activeRes = {
        code: DOM.passCode.textContent,
        guestName: DOM.passGuestName.textContent,
        tableName: DOM.passTable.textContent,
        dateFormatted: state.booking.dateFormatted,
        guests: state.booking.guests
      };
      downloadIcsCalendar(activeRes);
      playCrystalChime('click');
    });

    DOM.bookAnotherBtn.addEventListener('click', () => {
      state.booking.addons = [];
      DOM.enhancementCards.forEach(c => {
        c.classList.remove('selected');
        c.querySelector('.addon-toggle-btn').textContent = 'Add to Evening';
        c.querySelector('.addon-toggle-btn').classList.remove('active');
      });
      goToStep(1);
      playCrystalChime('click');
    });

    // Header Nav links
    DOM.navBookBtn.addEventListener('click', () => {
      goToStep(1);
      playCrystalChime('click');
    });

    DOM.navFloorPlanBtn.addEventListener('click', () => {
      goToStep(2);
      playCrystalChime('click');
    });

    DOM.navMenuBtn.addEventListener('click', () => {
      document.getElementById('tastingMenuSection').scrollIntoView({ behavior: 'smooth' });
      playCrystalChime('click');
    });

    // Modal Handlers
    DOM.openBookingsModalBtn.addEventListener('click', () => {
      renderBookingsModalList();
      DOM.bookingsModal.classList.add('open');
      playCrystalChime('click');
    });

    DOM.closeBookingsModalBtn.addEventListener('click', () => {
      DOM.bookingsModal.classList.remove('open');
      playCrystalChime('click');
    });

    DOM.bookingsModal.addEventListener('click', (e) => {
      if (e.target === DOM.bookingsModal) {
        DOM.bookingsModal.classList.remove('open');
      }
    });

    DOM.searchBookingBtn.addEventListener('click', () => {
      renderBookingsModalList(DOM.bookingSearchInput.value);
      playCrystalChime('click');
    });

    DOM.bookingSearchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        renderBookingsModalList(DOM.bookingSearchInput.value);
      }
    });

    // Menu Filters
    DOM.menuFilters.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.menuFilters.querySelectorAll('button').forEach(b => {
          b.classList.remove('active');
          b.classList.add('btn-glass-secondary');
        });
        btn.classList.add('active');
        btn.classList.remove('btn-glass-secondary');
        renderMenuItems(btn.dataset.filter);
        playCrystalChime('click');
      });
    });

    // Audio Toggle
    DOM.audioToggleBtn.addEventListener('click', () => {
      state.audioEnabled = !state.audioEnabled;
      if (state.audioEnabled) {
        DOM.audioIconOn.style.display = 'block';
        DOM.audioIconOff.style.display = 'none';
        initAudio();
        playCrystalChime('click');
      } else {
        DOM.audioIconOn.style.display = 'none';
        DOM.audioIconOff.style.display = 'block';
      }
    });
  }

  /* ==========================================================================
     Submission Logic
     ========================================================================== */
  function handleFinalReservationSubmit() {
    const fn = DOM.guestFirstName.value.trim();
    const ln = DOM.guestLastName.value.trim();
    const em = DOM.guestEmail.value.trim();
    const ph = DOM.guestPhone.value.trim();

    if (!fn || !ln) {
      alert('Please provide your first and last name for our guest ledger.');
      DOM.guestFirstName.focus();
      return;
    }

    if (!em || !em.includes('@')) {
      alert('Please enter a valid email address for your reservation confirmation.');
      DOM.guestEmail.focus();
      return;
    }

    if (!ph) {
      alert('Please enter a contact telephone number.');
      DOM.guestPhone.focus();
      return;
    }

    if (!DOM.dressCodeAgree.checked) {
      alert('Please acknowledge FIRE SPICE\'s elegant evening dress code policy.');
      DOM.dressCodeAgree.focus();
      return;
    }

    // Generate VIP Reservation Code
    const randomCode = `FSP-${Math.floor(1000 + Math.random() * 9000)}-VIP`;

    const newReservation = {
      code: randomCode,
      guestName: `${fn} ${ln}`,
      email: em,
      phone: ph,
      dietary: DOM.guestDietary.value.trim() || 'None reported',
      notes: DOM.guestNotes.value.trim() || 'Standard reservation',
      dateFormatted: state.booking.dateFormatted,
      timeFormatted: state.booking.timeFormatted,
      tableId: state.booking.tableId,
      tableName: state.booking.tableData.name,
      zone: state.booking.tableData.zoneName,
      guests: state.booking.guests,
      occasion: state.booking.occasion,
      total: state.booking.totalEstimate,
      timestamp: Date.now()
    };

    saveReservation(newReservation);
    populateVipPass(newReservation);
    goToStep(5);
  }

  /* ==========================================================================
     Application Initialization
     ========================================================================== */
  function init() {
    renderCalendar();
    updateSelectedDate();
    renderFloorPlan();
    
    // Select default table A2
    const defaultTable = tablesDatabase.find(t => t.id === 'A2') || tablesDatabase[0];
    selectTable(defaultTable);

    renderMenuItems('all');
    setupAmbianceControls();
    setupEventListeners();

    console.log("FIRE SPICE Luxury Dining Application Initialized Successfully.");
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
