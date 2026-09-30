#!/usr/bin/env node
/* Build data/lesson-pages/<lesson>.js and lesson-pages/<lesson>.html
 * for the lesson page template (js/lesson-page.js).
 *
 * The text is read from the existing slide lessons (their `const T`
 * strings, or the data-he / data-en attributes for lessons without T)
 * and from js/lesson-intros-data.js. Nothing is retyped or rewritten.
 * Each lesson only has a small entry in MAP saying which screen goes
 * into which section of the template.
 *
 * Run from the site root:  node tools/build-lesson-data.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

global.window = {};
require(path.join(ROOT, 'js/lesson-intros-data.js'));
require(path.join(ROOT, 'js/navigation-data.js'));
const INTROS = window.ART_LESSON_INTROS;
const NAV = window.ART_NAVIGATION;

/* public-domain images that have a web copy in images/editorial/ */
const PD = new Set(['munch-scream', 'morris-strawberry-thief-aic', 'blossfeldt-adiantum-pedatum-1928', 'monet-stacks-end-of-summer-aic', 'monet-stacks-sunset-snow-aic', 'fan-kuan-travelers-npm', 'kandinsky-composition8', 'kandinsky-yellow-red-blue', 'hokusai-great-wave-1831',
  'turner-snowstorm', 'monet-water-lilies', 'monet-haystacks-1891', 'pissarro-boulevard-montmartre-1897',
  'friedrich-wanderer', 'morris-strawberry-thief-1883']);

/* Hebrew spelling of artist names that the lessons give in English only */
const NAMES = {
  'Edvard Munch': 'אדוורד מונק', 'Wassily Kandinsky': 'וסילי קנדינסקי', 'Katsushika Hokusai': 'קצושיקה הוקוסאי',
  'J. M. W. Turner': 'ויליאם טרנר', 'J.M.W. Turner': 'ויליאם טרנר', 'Claude Monet': 'קלוד מונה',
  'Camille Pissarro': 'קמיל פיסארו', 'Caspar David Friedrich': 'קספר דוד פרידריך', 'William Morris': 'ויליאם מוריס',
  'Frida Kahlo': 'פרידה קאלו', 'Marc Chagall': "מארק שאגאל", 'Mark Rothko': 'מארק רותקו',
  'Louise Bourgeois': 'לואיז בורז׳ואה', "Georgia O'Keeffe": 'ג׳ורג׳יה אוקיף', 'M. C. Escher': 'מ. ק. אשר',
  'Hundertwasser': 'הונדרטוואסר', 'M.C. Escher': 'מ. ק. אשר', 'Friedensreich Hundertwasser': 'פרידנסרייך הונדרטוואסר'
};

/* which screens go into which section, per lesson (screen numbers as in the lesson) */
const MAP = {
  /* 1.1: a feeling as the source, colour as the tool: one feeling, two or three colours, patches that meet */
  'lesson-1-1': { authored: true, variant: 'v2', layout: { look: 'color', idea: 'color', create: 'color', end: 'color' },
    explore: [0], sources: [1], look: [2], idea: [3, 4], create: [5, 6, 7, 8], end: [9, 10, 11] },
  /* design pilot (variant 'v2'). Screen 2 is split: its artworks and captions go to "sources",
     its looking task (label, question, "calm? tense? moving?") to "look". */
  /* screen 1: the sentence once attributed to Van Gogh is not in his letters (vangoghletters.org), so it is
     shown as our own text, without quotation marks or attribution (approved by the author) */
  'emotion-drawing': { hero: ['kandinsky-yellow-red-blue', '30% 40%'], variant: 'v2', noSlides: true,
    patch: { 1: { drop: ['label', 'quote', 'attr'],
                  big: { he: 'ציור לא חייב לתאר רק את מה שרואים. קו וצבע יכולים להעביר גם תחושה.',
                         en: "A drawing doesn't have to show only what you see. Line and colour can carry a feeling too." } } },
    explore: [0], sources: [1, '2:works'], look: ['2:text'], idea: [3, 4, 5], create: [6, 7, 8, 9, 10], end: [12, 13, 14, 15] },
  /* (1.2 screen 11, "something only you understand", is kept for 1.6 only) */
  /* 1.3: new content (content/lessons/visual-journal.json), a composition lab */
  'visual-journal': { authored: true, variant: 'v2', layout: { create: 'lab-sketch', end: 'airy' },
    explore: [0], sources: [1], look: [2],
    create: { lead: [3], steps: [4, 5, 6], after: [7, 8, 9, 10] }, end: [11, 12, 13] },
  /* 1.4: revised content (content/lessons/memory-drawing.json): Chagall as the source,
     a memory that comes apart (fragments) and is put together again (pieces) */
  'memory-drawing': { authored: true, variant: 'v2', layout: { idea: 'fragments', create: 'pieces' },
    explore: [0], sources: [1], look: [2], idea: [3, 4], create: [5, 6, 7], end: [8, 9, 10, 11] },
  /* 1.5: new content (content/lessons/journal-artwork.json), browsing an artist's notebook */
  'journal-artwork': { authored: true, variant: 'v2', layout: { look: 'desk', idea: 'flow' },
    /* the works laid out on the table in "look": pages from the earlier lessons (no images) */
    desk: ['1.1', '1.2', '1.3', '1.4'],
    explore: [0], sources: [1], look: [2, 3, 4], idea: [5, 6, 7], create: [8, 9], end: [10, 11, 12] },
  /* 1.6: revised content (content/lessons/frida-kahlo.json): motif → meaning → symbol → relations → a personal world */
  'frida-kahlo': { authored: true, variant: 'v2', layout: { sources: 'pair', look: 'links', idea: 'links', create: 'rel', end: 'rel' },
    explore: [0], sources: [1, 2, 3], look: [4, 5, 6, 7, 8], idea: [9, 10, 11], create: [12, 13, 14], end: [15, 16, 17] },
  /* design pilot (variant 'v2'), 5 stations. Each artist screen is paired with that artist's work
     from the gallery screen (4); the gallery's looking questions go to "look". "Making" is a lab:
     screen 9 opens it, 10-12 are three parallel experiments, 13 closes the lesson. */
  'experience-experiments': { variant: 'v2', noSlides: true,   /* no cover image: The Scream appears with Munch in "sources" */
    layout: { idea: 'flow', create: 'lab' },
    explore: ['0:nolabel'],
    sources: [{ s: 1, work: [4, 0] }, { s: 2, work: [4, 1] }, { s: 3, work: [4, 2] }],
    look: ['4:text', 5], idea: [6, 7, 8],
    create: { lead: [9], steps: [10, 11, 12], outro: [13] } },
  /* 1.8: a studio in progress: three sheets → one chosen → a large sheet → a pause → on */
  'experience-artwork': { authored: true, variant: 'v2', layout: { look: 'studio', idea: 'studio', create: 'studio', end: 'studio' },
    explore: [0, 1], look: [2], idea: [3], create: [4, 5], end: [6, 7, 8] },
  /* 1.9: the unit's work laid out like a small exhibition: the journey, one work, discovery */
  'unit-summary': { authored: true, variant: 'v2', layout: { look: 'show', end: 'show' }, noTitle: ['explore'],
    explore: [0, 1], look: [2, 3, 4, 5], end: [6, 7, 8, 9, 10, 11, 12, 13] },
  /* 2.1: unit 2 looks outward. Find a real pattern first, then the artists: unit, rule, variation */
  'lesson-2-1': { authored: true, variant: 'v2', layout: { explore: 'pattern', sources: 'duo', create: 'pattern', end: 'pattern' },
    explore: [0, 1, 2, 3], sources: [4, 5], look: [6], create: [7, 8, 9], end: [10, 11, 12] },
  /* unit 2's new journey puts 'Up close' (file lesson-2-3) second; the Monet lesson moves to third place */
  /* 2.3 'Same thing, different light' (file lesson-2-2): two sketches of one object in two lights */
  'lesson-2-2': { authored: true, variant: 'v2', layout: { explore: 'pattern', sources: 'light', look: 'pattern', create: 'pattern', end: 'pattern' },
    explore: [0, 1, 2], sources: [3, 4, 5, 6], look: [7, 8], create: [9, 10, 11], end: [12, 13] },
  /* 2.2 'Up close': a window, cropping, the detail becomes a world */
  'lesson-2-3': { authored: true, variant: 'v2', layout: { explore: 'pattern', sources: 'duo', look: 'pattern', create: 'pattern', end: 'pattern' },
    explore: [0, 1, 2], sources: [3, 4], look: [5, 6], create: [7, 8, 9, 10], end: [11, 12, 13] },
  /* 2.4 'Where am I in the space?': horizon, a person as the measure of scale, a view through a tube */
  'lesson-2-4': { authored: true, variant: 'v2', layout: { explore: 'pattern', sources: 'duo', look: 'pattern', create: 'pattern', end: 'pattern' },
    explore: [0, 1, 2, 3], sources: [4, 5], look: [6], create: [7, 8, 9, 10], end: [11, 12, 13] },
  /* 2.5 'Catching movement' (new, preview only): a moment, another moment, compare, Duchamp, one image */
  'lesson-2-5': { authored: true, variant: 'v2', layout: { explore: 'pattern', look: 'pattern', create: 'pattern', end: 'pattern' },
    explore: [0, 1, 2, 3, 4], sources: [5], look: [6], create: [7], end: [8] },
  /* 2.6 'When the drawing itself moves' (new, preview only), the last lesson of unit 2: a drop, Steir, actions, the unit */
  'lesson-2-6': { authored: true, variant: 'v2', layout: { explore: 'pattern', look: 'pattern', create: 'pattern', end: 'pattern' },
    explore: [0, 1], sources: [2], look: [3], create: [4, 5, 6], end: [7, 8, 9] }
};
/* in "create", these screens are the step-by-step "getting started" part */
const STEPS_SECTION = 'create';

const HERO_CAPS = {
  'kandinsky-yellow-red-blue': ['פרט מתוך: וסילי קנדינסקי, צהוב־אדום־כחול, 1925', 'Detail: Wassily Kandinsky, Yellow-Red-Blue, 1925'],
  'munch-scream': ['פרט מתוך: אדוורד מונק, הצעקה, 1893', 'Detail: Edvard Munch, The Scream, 1893'],
  'hokusai-great-wave-1831': ['פרט מתוך: קצושיקה הוקוסאי, הגל הגדול מול קנגאווה, 1831', 'Detail: Katsushika Hokusai, The Great Wave off Kanagawa, 1831'],
  'monet-haystacks-1891': ['פרט מתוך: קלוד מונה, ערימות שחת, 1891', 'Detail: Claude Monet, Haystacks, 1891'],
  'turner-snowstorm': ['פרט מתוך: ויליאם טרנר, סופת שלגים, 1842', 'Detail: J. M. W. Turner, Snow Storm, 1842']
};

/* shared screen texts that lessons reference as '_tmpl:<key>' (lessons/js/lesson-system.js) */
const SCREEN_TEMPLATES = (() => {
  const src = fs.readFileSync(path.join(ROOT, 'lessons/js/lesson-system.js'), 'utf8');
  const i = src.indexOf('const SCREEN_TEMPLATES = {');
  return eval('(' + src.slice(i + 'const SCREEN_TEMPLATES = '.length, src.indexOf('\n};', i) + 2) + ')');
})();
function resolveT(T) {
  for (const lang of ['he', 'en']) {
    for (const sc of T[lang].s) {
      for (const k of Object.keys(sc)) {
        const v = sc[k];
        if (typeof v === 'string' && v.startsWith('_tmpl:')) {
          const tm = SCREEN_TEMPLATES[v.slice(6)];
          sc[k] = tm ? (tm[lang] || tm.en) : '';
        }
      }
    }
  }
  return T;
}

/* Hebrew titles of works whose title the lessons give in English only (image descriptions) */
const WORK_TITLES = {
  'The Scream, 1893': 'הצעקה, 1893',
  'Composition VIII, 1923': 'קומפוזיציה 8, 1923',
  'The Great Wave off Kanagawa, c. 1831': 'הגל הגדול מול קנגאווה, בערך 1831',
  'Yellow-Red-Blue, 1925': 'צהוב־אדום־כחול, 1925',
  'Snow Storm, 1842': 'סופת שלגים, 1842',
  'Water Lilies': 'שושני מים'
};
function addWorkTitles(sections) {
  for (const sec of Object.values(sections)) {
    for (const b of (sec.blocks || sec.steps || [])) {
      for (const w of (b.works || [])) {
        const en = (w.alt || '').split(',').slice(1).join(',').trim();
        const heAlt = (w.altHe || '').split(',').slice(1).join(',').trim();   // the lesson's own Hebrew title
        if (en && (heAlt || WORK_TITLES[en])) w.workTitle = { he: heAlt || WORK_TITLES[en], en };
        delete w.altHe;
      }
    }
  }
}

// ── helpers ────────────────────────────────────────────────────
const bil = (he, en) => ({ he: he == null ? '' : String(he), en: en == null ? '' : String(en) });
const plain = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const unesc = s => String(s).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

function screenHtml(src, n) {
  const m = src.match(new RegExp('<section[^>]*id="s' + n + '"[\\s\\S]*?</section>'));
  return m ? m[0] : '';
}
function screenImages(html) {
  return [...html.matchAll(/<img\b[^>]*>/g)].map(m => {
    const tag = m[0];
    const src = (tag.match(/src="([^"]+)"/) || [])[1] || '';
    const alt = unesc((tag.match(/alt="([^"]*)"/) || [])[1] || '');
    const base = path.basename(src).replace(/\.(jpg|jpeg|png|webp)$/i, '');
    return { img: PD.has(base) ? base : null, alt };
  });
}
function artistFromAlt(alt) {
  const en = (alt.split(',')[0] || '').trim();
  return NAMES[en] ? bil(NAMES[en], en) : null;
}
function artistNames(html) {
  return [...html.matchAll(/class="artwork-artist"[^>]*>([^<]*)</g)].map(m => unesc(m[1]).trim());
}

/* one screen of a T-based lesson → one block of the template */
function blockFromT(T, n, html) {
  const he = T.he.s[n] || {}, en = T.en.s[n] || {};
  const b = {};
  for (const f of ['label', 'big', 'sub', 'note', 'ask', 'quote', 'attr', 'poem', 'body']) {
    if (he[f] != null || en[f] != null) b[f] = bil(he[f], en[f]);
  }
  if (he.instr != null) b.sub = bil(he.instr, en.instr);
  if (he.title != null && he.body != null) b.big = bil(he.title, en.title);   // artist screen: title of the work
  for (const f of ['chips', 'opts', 'lines', 'parts', 'comp', 'obs', 'rel']) {
    if (Array.isArray(he[f])) { b.chips = { he: he[f], en: en[f] || he[f] }; break; }
  }
  if (Array.isArray(he.i)) b.list = { he: he.i, en: en.i || he.i };
  // q0..q2 / line0..line2: separate lines (skip the ones already in the heading)
  const bigPlain = plain(he.big);
  const ln = { he: [], en: [] };
  for (const f of ['q0', 'q1', 'q2', 'q3', 'line0', 'line1', 'line2', 'line3']) {
    if (he[f] == null) continue;
    if (f.startsWith('line') && bigPlain.includes(plain(he[f]))) continue;
    ln.he.push(he[f]); ln.en.push(en[f] || he[f]);
  }
  if (ln.he.length) b.lines = ln;
  if (he.ph != null) b.prompt = bil(he.ph, en.ph);
  if (Array.isArray(he.frames)) b.frames = he.frames;   // composition sketches (1.3)
  if (Array.isArray(he.relIcons)) b.rel = he.relIcons;  // sketches of kinds of connection (1.6)
  if (he.kind) b.kind = he.kind;                          // a block with its own role in the layout (1.8, 1.9)
  if (Array.isArray(he.sheets)) b.sheets = { he: he.sheets, en: en.sheets || he.sheets };   // the three experiment sheets (1.8)
  if (Array.isArray(he.wall)) b.wall = he.wall;
  if (Array.isArray(he.meet)) b.meet = he.meet;
  if (he.sketch) b.sketch = he.sketch;
  if (Array.isArray(he.sketchLabels)) b.sketchLabels = { he: he.sketchLabels, en: en.sketchLabels || he.sketchLabels };
  if (he.sketchCap) b.sketchCap = bil(he.sketchCap, en.sketchCap);                    // small pattern sketches: a unit in a viewfinder, one rule changed (2.1)           // small sketches: two patches touching, overlapping, blending (1.1)           // the unit's work laid out in order (1.9)
  if (Array.isArray(he.ph2)) b.prompts = he.ph2.map((v, k) => bil(v, (en.ph2 || [])[k]));   // two writing spaces side by side
  if (Array.isArray(he.lens)) { b.lenses = { he: he.lens, en: en.lens || he.lens }; if (he.lensLabel) b.lensLabel = bil(he.lensLabel, en.lensLabel); }

  const imgs = screenImages(html);
  const works = [];
  // gallery screens: cap1..cap3 with the screen's images in order
  ['cap1', 'cap2', 'cap3'].forEach((c, k) => {
    if (he[c] == null) return;
    const im = imgs[k] || {};
    const alt = (en.alts && en.alts[k]) || im.alt || '';
    const wk = { img: im.img, alt, artist: artistFromAlt(alt), title: bil(he[c], en[c]) };
    if (he.alts && he.alts[k]) wk.altHe = he.alts[k];
    works.push(wk);
  });
  // artwork screens: art0title / artTitle / art1Title …
  const names = artistNames(html);
  let k = 0;
  for (const key of Object.keys(he)) {
    const m = key.match(/^art(\d?)[tT]itle$/);
    if (!m) continue;
    const nk = key.replace(/[tT]itle$/, m[0].includes('Title') ? 'Note' : 'note');
    const im = imgs[k] || {};
    const artEn = names[k] || (im.alt ? im.alt.split(',')[0].trim() : '');
    works.push({ img: im.img, alt: im.alt, artist: NAMES[artEn] ? bil(NAMES[artEn], artEn) : null,
                 title: bil(he[key], en[key]), note: bil(he[nk], en[nk]) });
    k++;
  }
  // authored lessons: { art: { img, artist, title, note } }
  if (he.art) {
    const A = he.art, E = en.art || {};
    works.push({ img: PD.has(A.img) ? A.img : null, alt: (E.artist || '') + ', ' + (E.title || ''), ...(A.noArtist ? { noArtist: true } : {}), ...(A.stage ? { stage: true } : {}),
                 artist: bil(A.artist, E.artist), workTitle: bil(A.title, E.title), note: bil(A.note, E.note),
                 ...(A.link ? { link: { href: A.link.href, label: bil(A.link.label, (E.link || {}).label) } } : {}) });
  }
  if (works.length) b.works = works;
  return b;
}

/* lessons without a T object: read data-he / data-en in document order */
function blockFromDom(html) {
  const b = {}; const chips = { he: [], en: [] };
  const re = /<([a-z0-9]+)\b([^>]*?)\bdata-en="([^"]*)"\s+data-he="([^"]*)"[^>]*>/g;
  let m;
  while ((m = re.exec(html))) {
    const [, tag, attrs] = m; const en = unesc(m[3]), he = unesc(m[4]);
    const before = html.slice(Math.max(0, m.index - 200), m.index);
    if (/save|saved|All Units|Start Again|Course/.test(en) && /btn|saved|<a /.test(before + attrs)) continue;
    if (/class="(big|mid)"/.test(attrs)) b.big = bil(he, en);
    else if (/class="sub"/.test(attrs)) b.sub = bil(he, en);
    else if (/choice-btn|swatch|shape-btn|sw-name/.test(attrs + before.slice(-120))) { chips.he.push(he); chips.en.push(en); }
    else if (/eyebrow/.test(before.slice(-120)) && !b.label) b.label = bil(he, en);
  }
  if (chips.he.length) b.chips = chips;
  const phEn = html.match(/data-placeholder-en="([^"]*)"/), phHe = html.match(/data-placeholder-he="([^"]*)"/);
  if (phEn && phHe) b.prompt = bil(unesc(phHe[1]), unesc(phEn[1]));
  return b;
}

function readT(src) {
  const i = src.indexOf('const T = {');
  if (i < 0) return null;
  return resolveT(eval('(' + src.slice(i + 10, src.indexOf('\n};', i) + 2) + ')'));
}
function unitOf(p) {
  for (const u of NAV.units) if ((u.lessons || []).some(l => l.path === p)) return u;
  return null;
}

function pageHtml(id, title) {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl" translate="no" class="notranslate">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="google" content="notranslate">
<meta name="robots" content="noindex">
<title>${title} · מקורות השראה באמנות</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Assistant:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/design-system.css?v=6">
<link rel="stylesheet" href="../css/lesson-page.css?v=27">
</head>
<body class="ed">
<script src="../js/app-init.js?v=20260927-structure"></script>
<script>document.body.classList.remove('dark');</script>

<div class="pv" data-he="תצוגה מקדימה של תבנית שיעור חדשה. השיעור המקורי לא השתנה." data-en="Preview of a new lesson template. The original lesson has not changed.">תצוגה מקדימה של תבנית שיעור חדשה. השיעור המקורי לא השתנה.</div>

<header class="ed-top" id="top">
  <div class="ed-wrap">
    <a class="ed-brand" href="../home-preview.html" data-he="מקורות השראה" data-en="Sources of Inspiration">מקורות השראה</a>
    <nav class="ed-nav">
      <a href="../home-preview.html#journey" data-he="יחידות" data-en="Units">יחידות</a>
      <a href="../home-preview.html#about" data-he="אודות" data-en="About">אודות</a>
    </nav>
    <span class="ed-spacer"></span>
    <div class="ed-lang">
      <button id="btn-he" onclick="setLang('he')">עברית</button><i>/</i><button id="btn-en" onclick="setLang('en')">English</button>
    </div>
  </div>
</header>

<main id="lesson"></main>

<footer class="ed-foot">
  <div class="ed-wrap">
    <span data-he="© 2025 מקורות השראה באמנות" data-en="© 2025 Sources of Inspiration in Art">© 2025 מקורות השראה באמנות</span>
    <span class="ed-spacer"></span>
    <a href="../privacy.html" data-he="מדיניות פרטיות" data-en="Privacy Policy">מדיניות פרטיות</a>
    <a href="../terms.html" data-he="תנאי שימוש" data-en="Terms of Use">תנאי שימוש</a>
  </div>
</footer>

<script src="../js/navigation-data.js"></script>
<script src="../data/lesson-pages/index.js"></script>
<script src="../data/lesson-pages/${id}.js"></script>
<script src="../js/lesson-page.js?v=25"></script>
<script src="../js/site-drawer.js?v=8" data-base="../"></script>
<script src="../js/editorial.js?v=1"></script>
</body>
</html>
`;
}

/* unit 2's new journey: pattern, up close, light, space, movement, the movement of making */
const ORDER = {
  unit02: ['lessons/lesson-2-1.html', 'lessons/lesson-2-3.html', 'lessons/lesson-2-2.html', 'lessons/lesson-2-4.html',
    'lessons/lesson-2-5.html', 'lessons/lesson-2-6.html']
};
/* new lessons that have only a lesson page (no slides, not in js/navigation-data.js): added to their unit
   on the preview pages only, with the title from their content file */
const ADD = { unit02: ['lesson-2-5', 'lesson-2-6'] };
const ADDED = {};
for (const [uid, ids] of Object.entries(ADD)) {
  const u = NAV.units.find(x => x.id === uid);
  ADDED[uid] = ids.map(id => ({ path: 'lessons/' + id + '.html',
    title: JSON.parse(fs.readFileSync(path.join(ROOT, 'content/lessons', id + '.json'), 'utf8')).title }));
  ADDED[uid].forEach(l => { if (!u.lessons.some(x => x.path === l.path)) u.lessons.push(l); });
}

// ── build ──────────────────────────────────────────────────────
const index = {};
const titles = {};   // lessons whose title was changed in the new content
for (const [id, m] of Object.entries(MAP)) {
  const file = 'lessons/' + id + '.html';
  const A = m.authored ? JSON.parse(fs.readFileSync(path.join(ROOT, 'content/lessons', id + '.json'), 'utf8')) : null;
  const src = A ? '' : fs.readFileSync(path.join(ROOT, file), 'utf8');
  const T = A ? { he: A.he, en: A.en } : (m.dom ? null : readT(src));
  const intro = Object.assign({}, INTROS[id + '.html'], A && A.time ? { time: A.time } : {}, A && A.title ? { title: A.title } : {},
    A && A.description ? { description: A.description } : {}, A && A.materials ? { materials: A.materials } : {});
  if (!intro) throw new Error('no intro data for ' + id);
  const sections = {};
  for (const key of ['explore', 'sources', 'look', 'idea', 'create', 'end']) {
    if (!m[key]) continue;
    /* a spec is a screen number; 'n:works' / 'n:text' use only the artworks or only the rest of screen n;
       'n:nolabel' leaves out the screen's small label; { s: n, work: [m, k] } adds artwork k of screen m
       to screen n (an artist next to their own work, shown without repeating the artist's name) */
    const build = list => list.map(spec => {
      if (typeof spec === 'object') {
        const b = blockFromT(T, spec.s, screenHtml(src, spec.s));
        const g = blockFromT(T, spec.work[0], screenHtml(src, spec.work[0]));
        const w = g.works && g.works[spec.work[1]];
        if (w) b.works = [Object.assign({}, w, { noArtist: true })];
        return b;
      }
      const [n, part] = String(spec).split(':');
      const html = screenHtml(src, n);
      const b = T ? blockFromT(T, Number(n), html) : blockFromDom(html);
      const P = m.patch && m.patch[n];
      if (P) { (P.drop || []).forEach(f => delete b[f]); for (const f in P) if (f !== 'drop') b[f] = P[f]; }
      if (part === 'works') return b.works ? { works: b.works } : {};
      if (part === 'text') { delete b.works; }
      if (part === 'nolabel') { delete b.label; }
      return b;
    }).filter(b => Object.keys(b).length);
    if (key === STEPS_SECTION && !Array.isArray(m[key])) {
      sections[key] = { lead: build(m[key].lead || []), steps: build(m[key].steps || []),
                        after: build(m[key].after || []), outro: build(m[key].outro || []) };
      continue;
    }
    const blocks = build(m[key]);
    sections[key] = key === STEPS_SECTION ? { steps: blocks } : { blocks };
  }
  if (m.variant === 'v2') addWorkTitles(sections);
  const u = unitOf(file);
  const data = {
    id, path: file,
    /* the slide lesson is the classroom mode; for rewritten lessons it still holds the old content */
    /* unit 1: no link to the old slides for now, they no longer match the lesson pages (author's decision) */
    slides: m.authored || m.noSlides ? null : file,
    ...(m.variant ? { variant: m.variant } : {}),
    ...(m.layout ? { layout: m.layout } : {}),
    ...(m.desk ? { desk: m.desk } : {}),
    ...(m.noTitle ? { noTitle: m.noTitle } : {}),
    ...(A && A.subtitle ? { subtitle: A.subtitle } : {}),
    number: (A && A.number) || m.number || intro.number, unit: intro.unit || u.title, unitNum: u.id.replace('unit', ''),
    title: intro.title, time: intro.time, intro: intro.description, materials: intro.materials,
    hero: m.hero ? { img: m.hero[0], pos: m.hero[1], cap: bil(...HERO_CAPS[m.hero[0]]) } : null,
    sections
  };
  fs.mkdirSync(path.join(ROOT, 'data/lesson-pages'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'data/lesson-pages', id + '.js'),
    '/* Generated by tools/build-lesson-data.js from ' + file + ' and js/lesson-intros-data.js. Do not edit by hand. */\nwindow.LESSON_PAGE = ' + JSON.stringify(data, null, 1) + ';\n');
  fs.mkdirSync(path.join(ROOT, 'lesson-pages'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'lesson-pages', id + '.html'), pageHtml(id, plain(intro.title.he)));
  index[file] = 'lesson-pages/' + id + '.html';
  if (A && A.title) titles[file] = A.title;
  const count = Object.values(sections).reduce((a, s) => a + ['blocks', 'steps', 'lead', 'after', 'outro'].reduce((n, k) => n + (s[k] || []).length, 0), 0);
  console.log(id.padEnd(24), count, 'blocks');
}
fs.writeFileSync(path.join(ROOT, 'data/lesson-pages/index.js'),
  '/* Generated by tools/build-lesson-data.js: lessons that have a page in the lesson template,\n   and new titles for lessons whose content was rewritten (used by the drawer and prev / next). */\n' +
  'window.LESSON_PAGES_INDEX = ' + JSON.stringify(index, null, 1) + ';\n' +
  'window.LESSON_TITLES = ' + JSON.stringify(titles, null, 1) + ';\n' +
  '/* the order of lessons in the new units, on the preview pages only (js/navigation-data.js is shared with the live site) */\n' +
  'window.LESSON_ORDER = ' + JSON.stringify(ORDER, null, 1) + ';\n' +
  '/* new lessons that are not in js/navigation-data.js, added on the preview pages only */\n' +
  'window.LESSON_ADDED = ' + JSON.stringify(ADDED, null, 1) + ';\n' +
  '(function () {\n' +
  '  var N = window.ART_NAVIGATION, O = window.LESSON_ORDER, A = window.LESSON_ADDED || {};\n' +
  '  if (!N || !O) return;\n' +
  '  (N.units || []).forEach(function (u) {\n' +
  '    (A[u.id] || []).forEach(function (l) {\n' +
  '      if (u.lessons && !u.lessons.some(function (x) { return x.path === l.path; })) u.lessons.push(l);\n' +
  '    });\n' +
  '    var o = O[u.id];\n' +
  '    if (!o || !u.lessons) return;\n' +
  '    u.lessons.sort(function (a, b) { return o.indexOf(a.path) - o.indexOf(b.path); });\n' +
  '  });\n' +
  '})();\n');
