document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     01. COLOR SPACES & ITTEN / RYB ARTIST WHEEL UTILITIES
     ------------------------------------------------------------------------ */
  
  // Standard 12-Tone Artist / Fashion Color Wheel (Itten RYB mapping)
  // Maps artist wheel angles (0°=Red, 120°=Yellow, 240°=Blue) into screen RGB coordinates
  const ITTEN_12_HUES = [
    { angle: 0,   name: 'Red',           tier: 'primary',   hex: '#D91E2A', warm: true  },
    { angle: 30,  name: 'Red-Orange',    tier: 'tertiary',  hex: '#E8531E', warm: true  },
    { angle: 60,  name: 'Orange',        tier: 'secondary', hex: '#ED7D18', warm: true  },
    { angle: 90,  name: 'Yellow-Orange', tier: 'tertiary',  hex: '#F2A619', warm: true  },
    { angle: 120, name: 'Yellow',        tier: 'primary',   hex: '#F6D000', warm: true  },
    { angle: 150, name: 'Yellow-Green',  tier: 'tertiary',  hex: '#8CC43C', cool: true  },
    { angle: 180, name: 'Green',         tier: 'secondary', hex: '#2E9C52', cool: true  },
    { angle: 210, name: 'Blue-Green',    tier: 'tertiary',  hex: '#1D8A88', cool: true  },
    { angle: 240, name: 'Blue',          tier: 'primary',   hex: '#1F5EA9', cool: true  },
    { angle: 270, name: 'Blue-Violet',   tier: 'tertiary',  hex: '#4D3B8C', cool: true  },
    { angle: 300, name: 'Violet',        tier: 'secondary', hex: '#772E7F', cool: true  },
    { angle: 330, name: 'Red-Violet',    tier: 'tertiary',  hex: '#B01E5D', warm: true  }
  ];

  function hsl(h, s, l) {
    return `hsl(${((h % 360) + 360) % 360}, ${s}%, ${l}%)`;
  }

  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = x => Math.round(255 * x).toString(16).padStart(2, '0');
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
  }

  function hexToHsl(hex) {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  /* ------------------------------------------------------------------------
     02. SLIDE NAVIGATION CONTROLLER
     ------------------------------------------------------------------------ */
  const deck = document.getElementById('deck');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotNav = document.getElementById('dotNav');
  const progressFill = document.getElementById('progressFill');
  const slideCounter = document.getElementById('slideCounter');
  let currentSlide = 0;

  // Initialize Dot Nav
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Navigate to slide ${i + 1}`);
    btn.addEventListener('click', () => goToSlide(i));
    dotNav.appendChild(btn);
  });

  function updateNavigation() {
    const dots = dotNav.querySelectorAll('button');
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    const percent = ((currentSlide + 1) / slides.length) * 100;
    progressFill.style.width = `${percent}%`;
    slideCounter.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${slides.length}`;
    
    // Dynamically adjust root accent color
    const hue = slides[currentSlide].dataset.hue || 345;
    document.documentElement.style.setProperty('--hue', hue);
  }

  function goToSlide(index) {
    currentSlide = Math.max(0, Math.min(slides.length - 1, index));
    slides[currentSlide].scrollIntoView({ behavior: 'smooth', inline: 'start' });
    updateNavigation();
  }

  document.getElementById('prevBtn').addEventListener('click', () => goToSlide(currentSlide - 1));
  document.getElementById('nextBtn').addEventListener('click', () => goToSlide(currentSlide + 1));

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    }
  });

  let scrollDebounce;
  deck.addEventListener('scroll', () => {
    clearTimeout(scrollDebounce);
    scrollDebounce = setTimeout(() => {
      const idx = Math.round(deck.scrollLeft / window.innerWidth);
      if (idx !== currentSlide && idx >= 0 && idx < slides.length) {
        currentSlide = idx;
        updateNavigation();
      }
    }, 80);
  });

  updateNavigation();

  /* ------------------------------------------------------------------------
     03. HIGH-END COUTURE VECTOR GARMENT SILHOUETTES
     ------------------------------------------------------------------------ */
  function eveningGownSVG(colors, opts = {}) {
    const primary = colors[0] || '#C22868';
    const secondary = colors[1] || primary;
    const accent = colors[2] || primary;
    const w = opts.width || 140;

    return `
    <svg viewBox="0 0 140 240" width="${w}" xmlns="http://www.w3.org/2000/svg" aria-label="Evening Gown Flat">
      <defs>
        <linearGradient id="drapeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#000" stop-opacity="0.15"/>
          <stop offset="50%" stop-color="#FFF" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.2"/>
        </linearGradient>
      </defs>
      <!-- Mannequin Bust & Neck -->
      <ellipse cx="70" cy="22" rx="11" ry="12" fill="#EBD9C8" stroke="#161618" stroke-width="1.2"/>
      <path d="M64,34 L76,34 L76,46 L64,46 Z" fill="#EBD9C8" stroke="#161618" stroke-width="1.2"/>
      
      <!-- Bodice with sweet-heart neckline -->
      <path d="M48,48 Q70,42 92,48 L96,110 L44,110 Z" fill="${primary}" stroke="#161618" stroke-width="1.4"/>
      
      <!-- Architectural Accent Sash -->
      <path d="M42,108 Q70,118 98,108 L98,120 Q70,128 42,120 Z" fill="${accent}" stroke="#161618" stroke-width="1.2"/>
      
      <!-- Cascading Bias-cut Skirt -->
      <path d="M44,118 Q70,126 96,118 L122,228 Q70,236 18,228 Z" fill="${secondary}" stroke="#161618" stroke-width="1.4"/>
      
      <!-- Shading & Fold Overlays -->
      <path d="M44,118 Q70,126 96,118 L122,228 Q70,236 18,228 Z" fill="url(#drapeGrad)"/>
      <path d="M70,124 L70,232" stroke="#161618" stroke-width="1" stroke-dasharray="2 3" opacity="0.4"/>
      <path d="M52,122 L38,228" stroke="#161618" stroke-width="0.8" opacity="0.3"/>
      <path d="M88,122 L102,228" stroke="#161618" stroke-width="0.8" opacity="0.3"/>
    </svg>`;
  }

  function tailoredCoatSVG(colors, opts = {}) {
    const main = colors[0] || '#2B2D42';
    const lapel = colors[1] || main;
    const lining = colors[2] || colors[0];
    const w = opts.width || 140;

    return `
    <svg viewBox="0 0 140 240" width="${w}" xmlns="http://www.w3.org/2000/svg" aria-label="Tailored Coat Flat">
      <!-- Mannequin Head -->
      <ellipse cx="70" cy="22" rx="11" ry="12" fill="#EBD9C8" stroke="#161618" stroke-width="1.2"/>
      <rect x="65" y="34" width="10" height="12" fill="#EBD9C8" stroke="#161618" stroke-width="1.2"/>

      <!-- Body / Overcoat Silhouette -->
      <path d="M42,46 L70,58 L98,46 L118,80 L110,222 L30,222 L22,80 Z" fill="${main}" stroke="#161618" stroke-width="1.4"/>
      
      <!-- Inner Shirt / Turtleneck -->
      <path d="M60,54 L70,48 L80,54 L80,82 L60,82 Z" fill="${lining}" stroke="#161618" stroke-width="1"/>

      <!-- Peak Lapels -->
      <path d="M42,46 L62,96 L70,88 L70,58 Z" fill="${lapel}" stroke="#161618" stroke-width="1.2"/>
      <path d="M98,46 L78,96 L70,88 L70,58 Z" fill="${lapel}" stroke="#161618" stroke-width="1.2"/>
      
      <!-- Belted Waistline & Pockets -->
      <rect x="34" y="118" width="72" height="10" fill="${lapel}" stroke="#161618" stroke-width="1.2"/>
      <rect x="36" y="148" width="22" height="4" fill="#161618" opacity="0.4"/>
      <rect x="82" y="148" width="22" height="4" fill="#161618" opacity="0.4"/>
      
      <!-- Center Placket -->
      <line x1="70" y1="128" x2="70" y2="222" stroke="#161618" stroke-width="1.2"/>
      <circle cx="70" cy="144" r="2.5" fill="#161618"/>
      <circle cx="70" cy="172" r="2.5" fill="#161618"/>
      <circle cx="70" cy="200" r="2.5" fill="#161618"/>
    </svg>`;
  }

  /* ------------------------------------------------------------------------
     04. HERO DISC & 12-HUE SECTOR WHEEL DIAGRAM
     ------------------------------------------------------------------------ */
  function renderHeroDisc() {
    const heroWheel = document.getElementById('heroWheel');
    if (!heroWheel) return;
    
    // High-fidelity multi-stop conic gradient
    const stops = ITTEN_12_HUES.map((item, idx) => {
      const pctStart = (idx / 12) * 100;
      const pctEnd = ((idx + 1) / 12) * 100;
      return `${item.hex} ${pctStart}%, ${item.hex} ${pctEnd}%`;
    });
    heroWheel.style.borderRadius = '50%';
    heroWheel.style.background = `conic-gradient(from -15deg, ${stops.join(', ')})`;
    heroWheel.style.boxShadow = '0 20px 60px rgba(0,0,0,0.12)';
  }
  renderHeroDisc();

  function mountInteractiveWheelDiagram() {
    const holder = document.getElementById('wheelDiagramHolder');
    const readout = document.getElementById('wheelSelectedText');
    if (!holder) return;

    const size = 420;
    const cx = size / 2;
    const cy = size / 2;
    const rOuter = 185;
    const rInner = 85;

    let svgHtml = `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" style="overflow:visible;">`;

    // 12 Sector Wedges
    ITTEN_12_HUES.forEach((hueObj, i) => {
      const angleStart = (i * 30 - 15) * Math.PI / 180;
      const angleEnd = (i * 30 + 15) * Math.PI / 180;

      const x1 = cx + rOuter * Math.cos(angleStart);
      const y1 = cy + rOuter * Math.sin(angleStart);
      const x2 = cx + rOuter * Math.cos(angleEnd);
      const y2 = cy + rOuter * Math.sin(angleEnd);

      const x3 = cx + rInner * Math.cos(angleEnd);
      const y3 = cy + rInner * Math.sin(angleEnd);
      const x4 = cx + rInner * Math.cos(angleStart);
      const y4 = cy + rInner * Math.sin(angleStart);

      const d = `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 0 0 ${x4} ${y4} Z`;
      
      const midAngle = (i * 30) * Math.PI / 180;
      const labelR = (rOuter + rInner) / 2;
      const lx = cx + labelR * Math.cos(midAngle);
      const ly = cy + labelR * Math.sin(midAngle);

      svgHtml += `
        <path class="wheel-sector" data-index="${i}" d="${d}" fill="${hueObj.hex}" stroke="#161618" stroke-width="1.4" style="cursor:pointer; transition:transform 0.15s ease, filter 0.15s ease;">
          <title>${hueObj.name} (${hueObj.tier})</title>
        </path>
        <circle cx="${lx}" cy="${ly}" r="3" fill="#FFF" opacity="0.85" pointer-events="none"/>
      `;
    });

    // Outer Text Ring
    ITTEN_12_HUES.forEach((hueObj, i) => {
      const midAngle = (i * 30) * Math.PI / 180;
      const textR = rOuter + 18;
      const tx = cx + textR * Math.cos(midAngle);
      const ty = cy + textR * Math.sin(midAngle) + 4;
      svgHtml += `
        <text x="${tx}" y="${ty}" text-anchor="middle" font-family="'Space Mono', monospace" font-size="10" font-weight="700" fill="#161618">
          ${hueObj.name}
        </text>
      `;
    });

    // Center Hub Badge
    svgHtml += `
      <circle cx="${cx}" cy="${cy}" r="${rInner - 8}" fill="#F5F3ED" stroke="#161618" stroke-width="1.5"/>
      <text x="${cx}" y="${cy - 8}" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-size="16" font-weight="600" fill="#161618">Itten / RYB</text>
      <text x="${cx}" y="${cy + 10}" text-anchor="middle" font-family="'Space Mono', monospace" font-size="9" fill="#777">12 FASHION HUES</text>
      <text x="${cx}" y="${cy + 24}" text-anchor="middle" font-family="'Space Mono', monospace" font-size="8" fill="#999">CLICK TO INSPECT</text>
    </svg>`;

    holder.innerHTML = svgHtml;

    holder.querySelectorAll('.wheel-sector').forEach(wedge => {
      wedge.addEventListener('mouseenter', () => {
        wedge.style.filter = 'brightness(1.15)';
      });
      wedge.addEventListener('mouseleave', () => {
        wedge.style.filter = 'none';
      });
      wedge.addEventListener('click', (e) => {
        const idx = e.currentTarget.dataset.index;
        const h = ITTEN_12_HUES[idx];
        const tempDesc = h.warm ? 'Warm (Advances, radiates energy)' : 'Cool (Recedes, calming dignity)';
        readout.innerHTML = `<strong>${h.name}</strong> — ${h.tier.toUpperCase()} TIER · HEX: ${h.hex} · ${tempDesc}`;
        document.documentElement.style.setProperty('--hue', h.angle);
      });
    });
  }
  mountInteractiveWheelDiagram();

  /* ------------------------------------------------------------------------
     05. CHROMATIC SPECIFICATION LAB (SLIDE 03)
     ------------------------------------------------------------------------ */
  const hueSlider = document.getElementById('hueSlider');
  const satSlider = document.getElementById('satSlider');
  const lightSlider = document.getElementById('lightSlider');
  const hueVal = document.getElementById('hueVal');
  const satVal = document.getElementById('satVal');
  const lightVal = document.getElementById('lightVal');
  const hexReadout = document.getElementById('hexReadout');
  const rgbReadout = document.getElementById('rgbReadout');
  const labSwatchBig = document.getElementById('labSwatchBig');
  const labGarment = document.getElementById('labGarment');
  const copyHexBtn = document.getElementById('copyHexBtn');

  function updateLab() {
    if (!hueSlider) return;
    const h = +hueSlider.value;
    const s = +satSlider.value;
    const l = +lightSlider.value;

    hueVal.textContent = `${h}°`;
    satVal.textContent = `${s}%`;
    lightVal.textContent = `${l}%`;

    const currentColor = hsl(h, s, l);
    const hex = hslToHex(h, s, l);

    // Compute coordinate shades for dress styling
    const darkerTone = hsl(h, Math.min(100, s + 10), Math.max(10, l - 18));
    const lighterTone = hsl(h, Math.max(10, s - 20), Math.min(90, l + 22));

    hexReadout.textContent = hex;
    labSwatchBig.style.backgroundColor = currentColor;

    // Convert hex to rgb string
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    rgbReadout.textContent = `rgb(${r}, ${g}, ${b})`;

    labGarment.innerHTML = eveningGownSVG([currentColor, darkerTone, lighterTone], { width: 130 });
    document.documentElement.style.setProperty('--hue', h);
  }

  [hueSlider, satSlider, lightSlider].forEach(slider => {
    if (slider) slider.addEventListener('input', updateLab);
  });

  if (copyHexBtn) {
    copyHexBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(hexReadout.textContent).then(() => {
        copyHexBtn.textContent = 'Copied!';
        setTimeout(() => { copyHexBtn.textContent = 'Copy Hex'; }, 1500);
      });
    });
  }

  updateLab();

  /* ------------------------------------------------------------------------
     06. CLASSICAL HARMONIES ENGINE (SLIDE 05)
     ------------------------------------------------------------------------ */
  const harmonyDefs = {
    mono: {
      title: 'Monochromatic Harmony',
      desc: 'Formulated from a single base hue varied exclusively across lightness and saturation. Yields maximum textural cohesion, lending effortless sophistication to tailored suiting and minimalist eveningwear.',
      offsets: [0, 0, 0, 0],
      lightness: [48, 28, 72, 86],
      saturation: [70, 60, 50, 30]
    },
    analogous: {
      title: 'Analogous Harmony',
      desc: 'Combines adjacent hues on the wheel (spanning 30° to 60°). Naturally serene because they share an underlying primary foundation; ideal for transitional ombre silks and resortwear collections.',
      offsets: [-30, 0, 30, 60],
      lightness: [50, 48, 55, 75],
      saturation: [72, 75, 68, 45]
    },
    complementary: {
      title: 'Complementary Harmony',
      desc: 'Pairs polar opposites across the wheel (180° separation). Generates maximum optical vibration and dramatic contrast. In fashion, one hue should dominate 80% with its complement restricted to a sharp accent.',
      offsets: [0, 180, 0, 180],
      lightness: [48, 48, 78, 24],
      saturation: [75, 75, 40, 60]
    },
    split: {
      title: 'Split-Complementary Harmony',
      desc: 'Takes a base hue plus the two hues directly adjacent to its opposite complement (150° and 210°). Delivers high visual contrast while reducing chromatic tension, allowing layered styling.',
      offsets: [0, 150, 210, 0],
      lightness: [48, 52, 52, 80],
      saturation: [75, 65, 65, 35]
    },
    triadic: {
      title: 'Triadic Harmony',
      desc: 'Three hues spaced equidistant at 120° intervals. Highly vibrant, balanced, and energetic. Found frequently in architectural sportswear, color-blocked outerwear, and avant-garde street collections.',
      offsets: [0, 120, 240, 0],
      lightness: [48, 48, 48, 85],
      saturation: [75, 70, 70, 30]
    },
    tetradic: {
      title: 'Tetradic (Double Complementary)',
      desc: 'A four-corner rectangular chord composed of two complementary pairs. Extremely rich and complex. Demands that one color dominates as the structural base while the remaining three serve as trim and accessories.',
      offsets: [0, 60, 180, 240],
      lightness: [46, 52, 46, 52],
      saturation: [75, 68, 72, 65]
    }
  };

  const harmonyBaseHue = 345;
  const harmonyTabs = document.getElementById('harmonyTabs');
  const harmonyTitle = document.getElementById('harmonyTitle');
  const harmonyDesc = document.getElementById('harmonyDesc');
  const harmonySwatches = document.getElementById('harmonySwatches');
  const harmonyWheelSvg = document.getElementById('harmonyWheelSvg');
  const harmonyGarment = document.getElementById('harmonyGarment');

  function renderHarmony(key) {
    const config = harmonyDefs[key];
    if (!config) return;

    harmonyTitle.textContent = config.title;
    harmonyDesc.textContent = config.desc;

    const colors = config.offsets.map((offset, i) => {
      const h = ((harmonyBaseHue + offset) % 360 + 360) % 360;
      const s = config.saturation[i];
      const l = config.lightness[i];
      return { h, s, l, css: hsl(h, s, l), hex: hslToHex(h, s, l) };
    });

    // Swatches strip
    harmonySwatches.innerHTML = colors.map(c => `
      <div class="harmony-chip" style="background:${c.css};">
        <span>${c.hex}</span>
      </div>
    `).join('');

    // Mini Wheel Chord Diagram
    const size = 180;
    const cx = size / 2;
    const cy = size / 2;
    const r = 68;

    let chordPoints = [];
    let dotsSvg = '';

    colors.forEach(c => {
      const rad = (c.h - 90) * Math.PI / 180;
      const px = cx + r * Math.cos(rad);
      const py = cy + r * Math.sin(rad);
      chordPoints.push(`${px},${py}`);
      dotsSvg += `<circle cx="${px}" cy="${py}" r="6" fill="${c.css}" stroke="#161618" stroke-width="1.8"/>`;
    });

    const polygonLine = `<polygon points="${chordPoints.join(' ')}" fill="${colors[0].css}" fill-opacity="0.12" stroke="#161618" stroke-width="1.2" stroke-dasharray="3 3"/>`;

    harmonyWheelSvg.innerHTML = `
      <svg viewBox="0 0 ${size} ${size}" width="100%" height="100%">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#161618" stroke-width="1" stroke-dasharray="2 4" opacity="0.3"/>
        ${polygonLine}
        ${dotsSvg}
        <circle cx="${cx}" cy="${cy}" r="3" fill="#161618"/>
      </svg>
    `;

    // Silhouette preview with assigned palette
    harmonyGarment.innerHTML = tailoredCoatSVG([colors[0].css, colors[1].css, colors[2].css], { width: 130 });
  }

  if (harmonyTabs) {
    harmonyTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      harmonyTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderHarmony(btn.dataset.h);
    });
    renderHarmony('mono');
  }

  /* ------------------------------------------------------------------------
     07. SEASONAL COLOR ANALYSIS DATA (SLIDE 07)
     ------------------------------------------------------------------------ */
  const SEASONS_DATA = [
    {
      name: 'Light Spring',
      undertone: 'Warm · Golden · Clear',
      desc: 'Subcutaneous gold/peach tones with delicate contrast. Flattered by warm coral, buttermilk, buttercup yellow, and light camel.',
      colors: ['#F6C89F', '#F29A5A', '#8FC15C', '#F7DE7A', '#F6D2C4']
    },
    {
      name: 'Soft Summer',
      undertone: 'Cool · Muted · Rose-Ash',
      desc: 'Gentle low-to-medium contrast with delicate blue-pink undertones. Enhanced by misty slate, dusty rose, lavender, and heather grey.',
      colors: ['#C7A2B0', '#8FA7C0', '#A9BFA8', '#DCC9D6', '#B7B3C6']
    },
    {
      name: 'Deep Autumn',
      undertone: 'Warm · Earthy · Rich-Deep',
      desc: 'Substantial golden or amber depth. Resonates with burnished terracotta, olive drab, spiced mustard, chocolate, and raw copper.',
      colors: ['#A54D27', '#7A6828', '#C08627', '#56341D', '#8C4433']
    },
    {
      name: 'Clear Winter',
      undertone: 'Cool · High-Chroma · Dramatic',
      desc: 'Stark contrast between hair, iris, and complexion. Flattered by pure optic white, true jet black, royal cobalt, and ruby crimson.',
      colors: ['#C21828', '#164885', '#0C7459', '#141416', '#721955']
    }
  ];

  const seasonsContainer = document.getElementById('seasonsContainer');
  if (seasonsContainer) {
    seasonsContainer.innerHTML = SEASONS_DATA.map(s => `
      <div class="season-box">
        <div class="season-swatches-bar">
          ${s.colors.map(col => `<div style="background:${col};"></div>`).join('')}
        </div>
        <div class="season-content">
          <h3>${s.name}</h3>
          <span class="undertone-pill">${s.undertone}</span>
          <p>${s.desc}</p>
        </div>
      </div>
    `).join('');
  }

  /* ------------------------------------------------------------------------
     08. ARCHIVAL FASHION MOMENTS DATA (SLIDE 09)
     ------------------------------------------------------------------------ */
  const MOMENTS_DATA = [
    {
      era: '1937',
      brand: 'Schiaparelli',
      color: '#E4287C',
      title: 'Shocking Pink',
      desc: 'Elsa Schiaparelli trademarked a defiant, surrealist magenta so vivid it challenged conservative couture codes, proving high saturation can signal artistic revolt.'
    },
    {
      era: '1845–PRESENT',
      brand: 'Tiffany & Co.',
      color: '#0ABAB5',
      title: 'Tiffany Blue (Pantone 1837)',
      desc: 'Standardized robin’s-egg turquoise; protected by federal trademark. A prime case study where custom packaging color generates more brand equity than any logo.'
    },
    {
      era: '1959–PRESENT',
      brand: 'Valentino Garavani',
      color: '#D21F2B',
      title: 'Valentino Red',
      desc: 'A precise blend of 100% magenta, 100% yellow, and 10% black. Garavani incorporated this dramatic crimson into every couture show throughout his 50-year career.'
    },
    {
      era: '1966',
      brand: 'Yves Saint Laurent',
      color: '#0E0E10',
      title: 'Le Smoking Noir',
      desc: 'YSL adapted the masculine evening tuxedo for women. Pitch black neutralized decorative frivolity, foregrounding androgynous tailoring and sexual autonomy.'
    },
    {
      era: '1993',
      brand: 'Christian Louboutin',
      color: '#C91414',
      title: 'Rouge Scarlet Sole',
      desc: 'Inspired by an assistant’s red Chanel nail polish. Louboutin lacquered footwear undersides, transforming a normally invisible functional sole into a status symbol.'
    },
    {
      era: '2022',
      brand: 'Valentino by Pierpaolo',
      color: '#F43494',
      title: 'Pink PP (Pantone)',
      desc: 'A monocultural runway where an entire collection, footwear, and runway set were dipped in singular magenta, demonstrating total immersive chromatic mastery.'
    }
  ];

  const momentsGrid = document.getElementById('momentsGrid');
  if (momentsGrid) {
    momentsGrid.innerHTML = MOMENTS_DATA.map(m => `
      <div class="moment-card">
        <div class="moment-swatch" style="background:${m.color};"></div>
        <div class="moment-info">
          <span class="moment-era">${m.era} · ${m.brand}</span>
          <h3>${m.title}</h3>
          <p>${m.desc}</p>
        </div>
      </div>
    `).join('');
  }

  /* ------------------------------------------------------------------------
     09. PALETTE BUILDER STUDIO ACTIVITY (SLIDE 10)
     ------------------------------------------------------------------------ */
  const builderColor = document.getElementById('builderColor');
  const builderColorHex = document.getElementById('builderColorHex');
  const builderHarmony = document.getElementById('builderHarmony');
  const builderRandomBtn = document.getElementById('builderRandomBtn');
  const builderSwatches = document.getElementById('builderSwatches');
  const builderEnsemble = document.getElementById('builderEnsemble');

  function updatePaletteBuilder() {
    if (!builderColor || !builderHarmony) return;

    const hex = builderColor.value;
    builderColorHex.textContent = hex.toUpperCase();
    const { h } = hexToHsl(hex);
    const mode = builderHarmony.value;
    const config = harmonyDefs[mode] || harmonyDefs.analogous;

    const palette = config.offsets.map((offset, i) => {
      const curH = ((h + offset) % 360 + 360) % 360;
      const s = config.saturation[i] || 70;
      const l = config.lightness[i] || 50;
      return {
        hex: hslToHex(curH, s, l),
        css: hsl(curH, s, l)
      };
    });

    builderSwatches.innerHTML = palette.map((p, idx) => `
      <div class="builder-swatch-card" style="background:${p.css};">
        <span>#${idx + 1} ${p.hex}</span>
      </div>
    `).join('');

    const color1 = palette[0].css;
    const color2 = (palette[1] || palette[0]).css;
    const color3 = (palette[2] || palette[0]).css;

    builderEnsemble.innerHTML = `
      <div>${eveningGownSVG([color1, color2, color3], { width: 140 })}</div>
      <div>${tailoredCoatSVG([color2, color1, color3], { width: 140 })}</div>
    `;
  }

  if (builderColor) builderColor.addEventListener('input', updatePaletteBuilder);
  if (builderHarmony) builderHarmony.addEventListener('change', updatePaletteBuilder);

  if (builderRandomBtn) {
    builderRandomBtn.addEventListener('click', () => {
      const randH = Math.floor(Math.random() * 360);
      const randHex = hslToHex(randH, 75, 48);
      builderColor.value = randHex;
      
      const keys = Object.keys(harmonyDefs);
      builderHarmony.value = keys[Math.floor(Math.random() * keys.length)];
      updatePaletteBuilder();
    });
  }

  updatePaletteBuilder();

  /* ------------------------------------------------------------------------
     10. STUDIO QUIZ / CRITIQUE ACCORDION (SLIDE 11)
     ------------------------------------------------------------------------ */
  const QUIZ_DATA = [
    {
      q: '1. Deconstruct your current outfit using hue, saturation, and value rather than informal trade names.',
      solution: 'Move beyond casual terms like "navy" or "olive." A professional response sounds like: "A low-value (20%), moderate-saturation (45%) blue-violet with matte reflectance, paired with a high-value (90%) neutral tint."'
    },
    {
      q: '2. Why does a complementary pair (like Red & Green) vibrate when placed in equal quantities, and how do you resolve it in fashion design?',
      solution: 'When complementary hues sit adjacent at identical saturation and value, retinal cones tire from competing optical boundaries, causing visual vibrating edges. Resolve this with the 60-30-10 Rule: reduce the saturation or value of one hue and allocate 90% of visual area to it, keeping the complement as a 10% accent.'
    },
    {
      q: '3. A luxury house wishes to launch an outerwear collection targeting both warm and cool undertones. What palette strategy succeeds?',
      solution: 'Deploy a Split-Complementary or Triadic harmony that balances warm camel/copper outerwear bases with cool slate or iris lapel linings and silk scarves, allowing wearers of contrasting undertones to harmonize near the face.'
    },
    {
      q: '4. What role does fabric texture (matte wool crepe vs. high-sheen satin) play in perceived color value?',
      solution: 'Specular reflection on high-luster silk satin bounces direct white light, increasing perceived value and highlighting drape contours. Matte surfaces (wool, suede) absorb diffuse light, intensifying chroma and making dark values appear deeper.'
    }
  ];

  const quizStack = document.getElementById('quizStack');
  if (quizStack) {
    quizStack.innerHTML = QUIZ_DATA.map((item, idx) => `
      <div class="quiz-card" data-idx="${idx}">
        <div class="quiz-meta">
          <span class="quiz-num">STUDIO CHECKPOINT ${idx + 1}</span>
          <button class="quiz-toggle-btn">Reveal Critique Notes</button>
        </div>
        <h3>${item.q}</h3>
        <div class="quiz-solution">
          <p>${item.solution}</p>
        </div>
      </div>
    `).join('');

    quizStack.addEventListener('click', (e) => {
      const btn = e.target.closest('.quiz-toggle-btn');
      if (!btn) return;
      const card = btn.closest('.quiz-card');
      const isOpen = card.classList.toggle('open');
      btn.textContent = isOpen ? 'Hide Notes' : 'Reveal Critique Notes';
    });
  }

});
