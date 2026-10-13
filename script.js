/* ========================================================================
   COLOUR AS AN ELEMENT OF DESIGN — interactivity
   ======================================================================== */

/* ---------------------------------------------------------------------
   0\. small color utilities
   --------------------------------------------------------------------- */
function hsl(h, s, l){ return `hsl(${((h%360)+360)%360} ${s}% ${l}%)`; }

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    const toHex = x => Math.round(255 * x).toString(16).padStart(2, '0');
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
}

function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255,
        g = parseInt(hex.slice(3, 5), 16) / 255,
        b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
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

/* ---------------------------------------------------------------------
   1\. slide navigation
   --------------------------------------------------------------------- */
const deck = document.getElementById('deck');
const slides = Array.from(document.querySelectorAll('.slide'));
const dotNav = document.getElementById('dotNav');
const progressFill = document.getElementById('progressFill');
const slideCounter = document.getElementById('slideCounter');
let current = 0;

slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.addEventListener('click', () => goTo(i));
    dotNav.appendChild(b);
});

function updateChrome() {
    const dots = dotNav.querySelectorAll('button');
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    progressFill.style.width = `${((current + 1) / slides.length) * 100}%`;
    slideCounter.textContent = `${String(current + 1).padStart(2, '0')} / ${slides.length}`;
    const hue = slides[current].dataset.hue || 340;
    document.documentElement.style.setProperty('--hue', hue);
}

function goTo(i) {
    current = Math.max(0, Math.min(slides.length - 1, i));
    slides[current].scrollIntoView({ behavior: 'smooth', inline: 'start' });
    updateChrome();
}

document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
});

let scrollTimeout;
deck.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const idx = Math.round(deck.scrollLeft / window.innerWidth);
        if (idx !== current) { current = idx; updateChrome(); }
    }, 90);
});

updateChrome();

/* ---------------------------------------------------------------------
   2\. garment silhouette generator (reusable "picture")
   --------------------------------------------------------------------- */
function dressSVG(colors, opts = {}) {
    const [bodice, skirt, sash] = colors;
    const w = opts.width || 130;
    return `
    <svg viewBox="0 0 120 210" width="${w}">
        <ellipse cx="60" cy="20" rx="13" ry="14" fill="#EAD9C6" stroke="#17171A" stroke-width="1.4"/>
        <rect x="54" y="32" width="12" height="10" fill="#EAD9C6" stroke="#17171A" stroke-width="1.4"/>
        <path d="M38,42 Q60,34 82,42 L90,100 L30,100 Z" fill="${bodice}" stroke="#17171A" stroke-width="1.6"/>
        <path d="M30,100 L90,100 L108,195 L12,195 Z" fill="${skirt}" stroke="#17171A" stroke-width="1.6"/>
        <rect x="30" y="95" width="60" height="11" fill="${sash}" stroke="#17171A" stroke-width="1.2"/>
        <path d="M38,44 Q22,52 24,78" fill="none" stroke="#17171A" stroke-width="1.6"/>
        <path d="M82,44 Q98,52 96,78" fill="none" stroke="#17171A" stroke-width="1.6"/>
    </svg>`;
}

function blazerSVG(colors, opts = {}) {
    const [main, lapel, accent] = colors;
    const w = opts.width || 130;
    return `
    <svg viewBox="0 0 120 200" width="${w}">
        <ellipse cx="60" cy="20" rx="13" ry="14" fill="#EAD9C6" stroke="#17171A" stroke-width="1.4"/>
        <path d="M36,40 L60,52 L84,40 L100,68 L92,190 L28,190 L20,68 Z" fill="${main}" stroke="#17171A" stroke-width="1.6"/>
        <path d="M60,52 L50,90 L60,80 L70,90 Z" fill="${accent}" stroke="#17171A" stroke-width="1.2"/>
        <path d="M36,40 L54,58 L60,52 Z" fill="${lapel}" stroke="#17171A" stroke-width="1.2"/>
        <path d="M84,40 L66,58 L60,52 Z" fill="${lapel}" stroke="#17171A" stroke-width="1.2"/>
    </svg>`;
}

/* ---------------------------------------------------------------------
   3\. hero wheel + wheel diagram (slide 00 / 03) - ARTIST'S WHEEL (RYB)
   --------------------------------------------------------------------- */

// This is the new Artist's (RYB) Color Wheel definition
const artistWheelHues = [
    { angle: 0,   name: 'Red',           type: 'primary',   hex: '#FF1616' },
    { angle: 30,  name: 'Red-Orange',    type: 'tertiary',  hex: '#FF641A' },
    { angle: 60,  name: 'Orange',        type: 'secondary', hex: '#FFB31E' },
    { angle: 90,  name: 'Yellow-Orange', type: 'tertiary',  hex: '#FFD922' },
    { angle: 120, name: 'Yellow',        type: 'primary',   hex: '#FFFF26' },
    { angle: 150, name: 'Yellow-Green',  type: 'tertiary',  hex: '#95D917' },
    { angle: 180, name: 'Green',         type: 'secondary', hex: '#2AD00A' },
    { angle: 210, name: 'Blue-Green',    type: 'tertiary',  hex: '#16A564' },
    { angle: 240, name: 'Blue',          type: 'primary',   hex: '#086DDD' },
    { angle: 270, name: 'Blue-Violet',   type: 'tertiary',  hex: '#5331C4' },
    { angle: 300, name: 'Violet',        type: 'secondary', hex: '#9e0394' },
    { angle: 330, name: 'Red-Violet',    type: 'tertiary',  hex: '#D10D53' }
];

function rainbowConic() {
    const stops = artistWheelHues.map(c => `${c.hex} ${c.angle}deg`);
    stops.push(`${artistWheelHues[0].hex} 360deg`);
    return `conic-gradient(from 90deg, ${stops.join(', ')})`;
}

document.getElementById('heroWheel').style.background = rainbowConic();

function polar(cx, cy, r, angleDeg) {
    const rad = (angleDeg - 90) * Math.PI / 180.0;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad)
    };
}

function buildWheelSVG(size, showLabels) {
    const cx = size / 2, cy = size / 2, rDot = size * 0.42, rLabel = size * 0.49;
    let dots = '', labels = '';

    artistWheelHues.forEach(w => {
        const p = polar(cx, cy, rDot, w.angle);
        const strokeW = w.type === 'primary' ? 3 : 1.4;
        const r = w.type === 'primary' ? 7 : 5;
        dots += `<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${w.hex}" stroke="#17171A" stroke-width="${strokeW}"/>`;

        if (showLabels) {
            const lp = polar(cx, cy, rLabel, w.angle);
            labels += `<text x="${lp.x}" y="${lp.y}" font-family="Space Mono, monospace" font-size="${size * 0.03}" text-anchor="middle" dominant-baseline="central" fill="#17171A" opacity="0.75">${w.name}</text>`;
        }
    });

    return `<svg viewBox="0 0 ${size} ${size}" width="${size}">${dots}${labels}</svg>`;
}

function mountWheelDiagram() {
    const holder = document.getElementById('wheelDiagram');
    const size = 380;
    holder.style.position = 'relative';
    holder.style.width = size + 'px';
    holder.style.height = size + 'px';

    const conicBG = document.createElement('div');
    conicBG.style.cssText = `position:absolute; inset:22%; border-radius:50%; background:${rainbowConic()}; border:2px solid #17171A;`;
    holder.appendChild(conicBG);

    const svgWrap = document.createElement('div');
    svgWrap.style.cssText = `position:absolute; inset:0;`;
    svgWrap.innerHTML = buildWheelSVG(size, true);
    holder.appendChild(svgWrap);
}

// mountWheelDiagram();


/* ---------------------------------------------------------------------
   4\. HSL lab (slide 02)
   --------------------------------------------------------------------- */
const hueSlider = document.getElementById('hueSlider');
const satSlider = document.getElementById('satSlider');
const lightSlider = document.getElementById('lightSlider');
const hueVal = document.getElementById('hueVal');
const satVal = document.getElementById('satVal');
const lightVal = document.getElementById('lightVal');
const hexReadout = document.getElementById('hexReadout');
const labSwatchBig = document.getElementById('labSwatchBig');
const labGarment = document.getElementById('labGarment');

function renderLab() {
    const h = +hueSlider.value, s = +satSlider.value, l = +lightSlider.value;
    hueVal.textContent = h + '°';
    satVal.textContent = s + '%';
    lightVal.textContent = l + '%';
    const color = hsl(h, s, l);
    const hex = hslToHex(h, s, l);
    hexReadout.textContent = hex;
    labSwatchBig.style.background = color;
    const shade1 = hsl(h, s, Math.max(8, l - 22));
    const shade2 = hsl(h, Math.max(0, s - 25), Math.min(92, l + 18));
    labGarment.innerHTML = dressSVG([color, shade1, shade2], { width: 130 }) + '<p class="figure-cap">Garment</p>';
    document.documentElement.style.setProperty('--hue', h);
}
[hueSlider, satSlider, lightSlider].forEach(el => el.addEventListener('input', renderLab));
renderLab();

/* ---------------------------------------------------------------------
   5\. harmony tabs (slide 04)
   --------------------------------------------------------------------- */
const harmonyDefs = {
  mono: {
    label: 'Monochromatic',
    desc: 'One hue, several values and saturations. The lowest-risk, highest-cohesion palette — a single-colour outfit built from tints and shades reads as deliberate, not accidental.',
    hues: base => [base, base, base, base],
    ls: [50, 30, 70, 85], ss: [75, 65, 55, 30]
  },
  analogous: {
    label: 'Analogous',
    desc: 'Hues that sit next to each other on the wheel (within ~30°). Naturally harmonious because they share an undertone — think a sunset gradient of red, red-orange and orange.',
    hues: base => [base-30, base, base+30, base+30],
    ls: [55,50,55,80], ss: [70,72,68,40]
  },
  complementary: {
    label: 'Complementary',
    desc: 'Two hues directly opposite each other (180° apart). Maximum contrast and energy — use one as the dominant colour and the other as a sharp, small accent.',
    hues: base => [base, base+180, base, base+180],
    ls: [50,50,80,25], ss: [72,70,35,55]
  },
  split: {
    label: 'Split-Complementary',
    desc: 'A base hue plus the two hues on either side of its complement. Nearly as much contrast as a straight complementary pair, with a little more room to breathe.',
    hues: base => [base, base+150, base+210, base],
    ls: [50,55,55,80], ss: [72,65,65,35]
  },
  triadic: {
    label: 'Triadic',
    desc: 'Three hues spaced evenly around the wheel (120° apart). Vibrant and balanced — this is the logic behind a lot of playful, colour-blocked collections.',
    hues: base => [base, base+120, base+240, base],
    ls: [50,50,50,85], ss: [70,68,66,30]
  },
  tetradic: {
    label: 'Tetradic (double-complementary)',
    desc: 'Two complementary pairs, four hues total. Rich and complex — the hardest harmony to balance, so let one hue dominate and treat the rest as accents.',
    hues: base => [base, base+90, base+180, base+270],
    ls: [50,50,50,50], ss: [70,65,68,60]
  }
};

let harmonyBaseHue = 340;
const harmonyTabsEl = document.getElementById('harmonyTabs');
const harmonySwatchesEl = document.getElementById('harmonySwatches');
const harmonyDescEl = document.getElementById('harmonyDesc');
const harmonyWheelEl = document.getElementById('harmonyWheel');
const harmonyGarmentEl = document.getElementById('harmonyGarment');

function renderHarmony(key){
  const def = harmonyDefs[key];
  const { h } = hexToHsl(builderColor.value);
  const angles = def.hues(h).map(angle => ((angle%360)+360)%360);

  const colors = angles.map((angle,i) => {
    // Find the closest two colors on the artist wheel
    let a = [...artistWheelHues].sort((c1, c2) => Math.abs(c1.angle - angle) - Math.abs(c2.angle - angle))[0];
    return hsl(hexToHsl(a.hex).h, def.ss[i], def.ls[i]);
  });
  
  const hexes = colors.map(c => {
      const {h,s,l} = hexToHsl(c);
      return hslToHex(h,s,l);
  });

  harmonyDescEl.textContent = def.desc;
  harmonySwatchesEl.innerHTML = colors.map((c,i) => `
    <div class="swatch" style="background:${c};">
      <span class="swatch-label">${hexes[i]}</span>
    </div>`).join('');

  const size = 150, cx=size/2, cy=size/2, r=size*0.38;
  let dots = angles.map((angle,i)=>{
    const p = polar(cx,cy,r,angle);
    return `<circle cx="${p.x}" cy="${p.y}" r="8" fill="${colors[i]}" stroke="#17171A" stroke-width="2"/>`;
  }).join('');

  harmonyWheelEl.innerHTML = `<svg viewBox="0 0 ${size} ${size}" width="150">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#17171A" stroke-width="1" stroke-dasharray="2 3" opacity="0.4"/>
    ${dots}
  </svg>`;
  harmonyGarmentEl.innerHTML = dressSVG([colors[0], colors[1]||colors[0], colors[2]||colors[0]], {width:130}) + '<p class="figure-cap">Look built from this harmony</p>';
}

harmonyTabsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    harmonyTabsEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderHarmony(btn.dataset.h);
});
renderHarmony('mono');


/* ---------------------------------------------------------------------
   6\. seasonal palettes (slide 06)
   --------------------------------------------------------------------- */
const seasons = [
  { id:'season-spring', name:'Light Spring', undertone:'Warm · Light · Clear', desc:'Golden undertone, low-to-mid contrast. Think peach, coral, warm ivory.', colors:['#F6C89F','#F2A65A','#8FC15C','#F7E07A','#F6D8CE'] },
  { id:'season-summer', name:'Soft Summer', undertone:'Cool · Muted · Medium', desc:'Pink/blue undertone, gentle contrast. Think dusty rose, slate blue, lavender.', colors:['#C7A2B0','#8FA7C0','#A9BFA8','#DCC9D6','#B7B3C6'] },
  { id:'season-autumn', name:'Deep Autumn', undertone:'Warm · Muted · Deep', desc:'Golden undertone, rich saturation. Think rust, olive, mustard, chocolate.', colors:['#A5502C','#7A6A2E','#C08A2E','#5C3A21','#8C4A3A'] },
  { id:'season-winter', name:'Clear Winter', undertone:'Cool · Clear · High contrast', desc:'Pink/blue undertone, bold saturation. Think true red, icy blue, emerald, black.', colors:['#C21E2E','#1D4E89','#0E7A5F','#111318','#7A1E5C'] },
];

seasons.forEach(s => {
  const el = document.getElementById(s.id);
  el.innerHTML = `
    <div class="season-swatches">${s.colors.map(c=>`<div style="background:${c};"></div>`).join('')}</div>
    <div class="season-info"><h3>${s.name}</h3><p><strong>${s.undertone}</strong><br>${s.desc}</p></div>
  `;
});

/* ---------------------------------------------------------------------
   7\. iconic colour moments (slide 08)
   --------------------------------------------------------------------- */
const moments = [
  { tag:'1947', name:'Schiaparelli — "Shocking Pink"', color:'#E4287C', desc:'Elsa Schiaparelli trademarked a magenta so electric it needed its own name — proof a single custom hue can become a signature.' },
  { tag:'1954–61', name:'Tiffany & Co. — Tiffany Blue', color:'#0ABAB5', desc:'A robin\'s-egg blue used since the 1800s, later immortalised by that little box. One of the most protected brand colours in the world.' },
  { tag:'1961', name:'Hollywood — "Marilyn Monroe Red"', color:'#C41E3A', desc:'A true, high-saturation red became shorthand for old-Hollywood glamour and unapologetic confidence on screen.' },
  { tag:'1966', name:'YSL — Le Smoking', color:'#0B0B0C', desc:'Yves Saint Laurent\'s tuxedo for women leaned on black\'s authority and menswear codes to redefine power dressing.' },
  { tag:'2000s', name:'Valentino — Valentino Red', color:'#C60C30', desc:'Valentino Garavani\'s signature crimson, reused across decades of collections until the shade became inseparable from the house.' },
  { tag:'2016', name:'Pantone — "Rose Quartz + Serenity"', color:'#F4C2C2', desc:'The first Pantone Colour of the Year to name two shades together, reflecting a cultural shift toward softer gender coding in fashion.' },
];

document.getElementById('momentsList').innerHTML = moments.map(m => `
  <div class="moment-card">
    <div class="moment-swatch" style="background:${m.color};"></div>
    <div>
      <span class="moment-tag">${m.tag}</span>
      <h3>${m.name}</h3>
      <p>${m.desc}</p>
    </div>
  </div>`).join('');

/* ---------------------------------------------------------------------
   8\. quiz / discussion questions (slide 10)
   --------------------------------------------------------------------- */
const quiz = [
  { q:'Look at your own outfit right now. Name its dominant hue, and describe it by hue, saturation, and value rather than just its name.', a:'There\'s no single right answer — the goal is fluency with the three variables. Push students past "it\'s blue" to "a mid-value, moderately saturated blue-green."' },
  { q:'Pick a brand you associate strongly with one colour. What would be lost if they switched to their complementary colour instead?', a:'Look for answers that connect colour to brand psychology and recognition — e.g. Tiffany Blue vs. its complement (a warm coral) would read completely differently: playful and warm instead of cool and exclusive.' },
  { q:'Design a 3-piece capsule using a split-complementary harmony. Which colour is dominant, which is the accent, and why?', a:'Strong answers identify one colour as 60–70% of the look, with the other two as smaller accents — mirroring the classic 60/30/10 design ratio.' },
  { q:'Seasonal colour analysis assumes a "flattering" palette per undertone. Where might that framework break down or feel limiting?', a:'Encourage critical thinking: personal style, cultural meaning, trend context, and individual preference all matter beyond undertone matching — treat it as one tool, not a rule.' },
  { q:'If you were forecasting next year\'s colour trend, what real-world event or mood would you build the palette around, and why?', a:'Look for a clear causal link between a cultural/economic moment and a specific hue, saturation and value choice — not just a colour name.' },
];

document.getElementById('quizList').innerHTML = quiz.map((item,i) => `
  <div class="quiz-item">
    <span class="qnum">QUESTION ${i+1}</span>
    <h3>${item.q}</h3>
    <button class="quiz-toggle">Show discussion notes</button>
    <div class="quiz-hint"><p>${item.a}</p></div>
  </div>`).join('');

document.getElementById('quizList').addEventListener('click', (e) => {
    const btn = e.target.closest('.quiz-toggle');
    if (!btn) return;
    const item = btn.closest('.quiz-item');
    item.classList.toggle('open');
    btn.textContent = item.classList.contains('open') ? 'Hide discussion notes' : 'Show discussion notes';
});

/* ---------------------------------------------------------------------
   9\. palette builder activity (slide 09)
   --------------------------------------------------------------------- */
const builderColor = document.getElementById('builderColor');
const builderHarmony = document.getElementById('builderHarmony');
const builderRandom = document.getElementById('builderRandom');
const builderSwatches = document.getElementById('builderSwatches');
const builderGarments = document.getElementById('builderGarments');

function renderBuilder() {
    const baseHex = builderColor.value;
    const baseHsl = hexToHsl(baseHex);
    
    // Find the closest angle on the artist wheel to the selected color's hue
    const baseAngle = [...artistWheelHues].sort((a, b) => {
        let diffA = Math.min(Math.abs(a.angle - baseHsl.h), 360 - Math.abs(a.angle - baseHsl.h));
        let diffB = Math.min(Math.abs(b.angle - baseHsl.h), 360 - Math.abs(b.angle - baseHsl.h));
        return diffA - diffB;
    })[0].angle;

    const key = builderHarmony.value;
    const def = harmonyDefs[key];
    const angles = def.hues(baseAngle).map(a => ((a % 360) + 360) % 360);

    const colors = angles.map((angle, i) => {
        // For each calculated angle, find the closest hue on the artist wheel
        const closestHue = artistWheelHues.reduce((prev, curr) => {
            const prevDiff = Math.min(Math.abs(prev.angle - angle), 360 - Math.abs(prev.angle - angle));
            const currDiff = Math.min(Math.abs(curr.angle - angle), 360 - Math.abs(curr.angle - angle));
            return (currDiff < prevDiff) ? curr : prev;
        });
        return hsl(hexToHsl(closestHue.hex).h, def.ss[i], def.ls[i]);
    });
    
    const hexes = colors.map(c => hslToHex(hexToHsl(c).h, hexToHsl(c).s, hexToHsl(c).l));

    builderSwatches.innerHTML = colors.map((c, i) => `
    <div class="swatch lg" style="background:${c};"><span class="swatch-label">${hexes[i]}</span></div>`).join('');

    builderGarments.innerHTML =
        dressSVG([colors[0], colors[1] || colors[0], colors[2] || colors[0]], { width: 120 }) +
        blazerSVG([colors[colors.length - 1], colors[0], colors[1] || colors[0]], { width: 120 });

    // Update harmony display on the small wheel
    renderHarmony(key);
}


builderColor.addEventListener('input', renderBuilder);
builderHarmony.addEventListener('change', renderBuilder);
builderRandom.addEventListener('click', () => {
    const randomHue = artistWheelHues[Math.floor(Math.random() * artistWheelHues.length)];
    builderColor.value = randomHue.hex;
    const keys = Object.keys(harmonyDefs);
    builderHarmony.value = keys[Math.floor(Math.random() * keys.length)];
    renderBuilder();
});

// Initial render
renderBuilder();
