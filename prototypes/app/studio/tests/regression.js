/* Studio regression tests: the 38 checks that V1 passed (ported from the V1 test run, unchanged in substance).
   They run against V1 or V2:
     STUDIO_URL=http://localhost:8766/prototypes/studio-v2/index.html node regression.js
   Optional: CHROMIUM_PATH (a Chromium binary), SHOTS (a folder for screenshots).
   Needs Playwright (require('playwright')) and a static server at the site root (e.g. python3 -m http.server 8766). */
const { chromium } = require('playwright');
const U = process.env.STUDIO_URL || 'http://localhost:8766/prototypes/studio-v2/index.html';
const SHOTS = process.env.SHOTS || '';
/* still on the studio page: the page STUDIO_URL names, wherever the studio is (prototypes/studio-v2/, prototypes/app/studio/, …) */
const HERE = { test: url => { try { return new URL(url).pathname === new URL(U).pathname; } catch (e) { return false; } } };
const out = (...a) => console.log(...a);
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  async function open(opt, q = '') {
    const ctx = await b.newContext(Object.assign({ viewport: { width: 390, height: 844 } }, opt));
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && HERE.test(p.url())) errs.push(m.text() + ' @' + (m.location().url || '')); });
    await p.goto(U + q, { waitUntil: 'networkidle' });
    return { p, ctx, errs, cdp: await ctx.newCDPSession(p) };
  }
  const box = p => p.$eval('#canvas', c => { const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  const S = p => p.evaluate(() => ({ ops: __studio.doc.ops.length, last: __studio.doc.ops.slice(-1)[0] && { t: __studio.doc.ops.slice(-1)[0].t, tool: __studio.doc.ops.slice(-1)[0].tool, color: __studio.doc.ops.slice(-1)[0].color, w: __studio.doc.ops.slice(-1)[0].w, n: (__studio.doc.ops.slice(-1)[0].pts || []).length / 2 }, dirty: __studio.dirty() }));
  const ink = (p, fx, fy) => p.evaluate(([fx, fy]) => { const c = document.getElementById('canvas'); const d = c.getContext('2d').getImageData(Math.round(c.width * fx), Math.round(c.height * fy), 1, 1).data; return d[3]; }, [fx, fy]);
  const inkCount = p => p.evaluate(() => { const c = document.getElementById('canvas'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i]) n++; return n; });
  async function touchLine(cdp, bx, a, z, steps = 12) {
    const P = t => ({ x: bx.x + bx.w * (a[0] + (z[0] - a[0]) * t), y: bx.y + bx.h * (a[1] + (z[1] - a[1]) * t) });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [P(0)] });
    for (let i = 1; i <= steps; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [P(i / steps)] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  async function mouseLine(p, bx, a, z) {
    await p.mouse.move(bx.x + bx.w * a[0], bx.y + bx.h * a[1]); await p.mouse.down();
    await p.mouse.move(bx.x + bx.w * z[0], bx.y + bx.h * z[1], { steps: 12 }); await p.mouse.up();
  }
  async function penLine(cdp, bx, a, z) {
    const P = t => ({ x: bx.x + bx.w * (a[0] + (z[0] - a[0]) * t), y: bx.y + bx.h * (a[1] + (z[1] - a[1]) * t) });
    const ev = (type, pt, extra = {}) => cdp.send('Input.dispatchMouseEvent', Object.assign({ type, x: pt.x, y: pt.y, pointerType: 'pen', button: 'left', buttons: 1, clickCount: 1, force: 0.5 }, extra));
    await ev('mousePressed', P(0)); for (let i = 1; i <= 10; i++) await ev('mouseMoved', P(i / 10)); await ev('mouseReleased', P(1), { buttons: 0 });
  }
  const R = []; const ok = (name, cond, info = '') => { R.push([name, !!cond]); out((cond ? 'PASS ' : 'FAIL ') + name + (info ? '  ' + info : '')); };

  /* ── functional tests on a touch phone, Hebrew ── */
  { const { p, ctx, errs, cdp } = await open({ isMobile: true, hasTouch: true }, '?lang=he');
    await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'networkidle' });
    const bx = await box(p);
    await touchLine(cdp, bx, [.2, .3], [.8, .35]); let s = await S(p);
    ok('touch draws a stroke', s.ops === 1 && s.last.n > 3 && await inkCount(p) > 100, JSON.stringify(s.last));
    await mouseLine(p, bx, [.2, .5], [.8, .55]); s = await S(p); ok('mouse draws a stroke', s.ops === 2 && s.last.n > 3);
    await penLine(cdp, bx, [.2, .7], [.8, .72]); s = await S(p); ok('stylus (pen) draws a stroke', s.ops === 3 && s.last.n > 3);
    await p.click('#undo'); s = await S(p); ok('undo removes the last stroke', s.ops === 2);
    await p.click('#redo'); s = await S(p); ok('redo brings it back', s.ops === 3);
    await p.click('#color'); const panelOpen = await p.isVisible('#colorPanel');
    await p.click('#colorPanel .sw:nth-child(2)'); await touchLine(cdp, bx, [.3, .15], [.6, .15]); s = await S(p);
    ok('colour change applies to the next stroke', panelOpen && s.last.color === '#c8423b' && !(await p.isVisible('#colorPanel')), s.last.color);
    const wMed = s.last.w; await p.click('#size'); await p.click('#sizePanel .sz:nth-child(3)'); await touchLine(cdp, bx, [.3, .2], [.6, .2]); s = await S(p);
    ok('size change: thick is wider than medium', s.last.w > wMed * 2, wMed + ' → ' + s.last.w);
    await p.click('#size'); await p.click('#sizePanel .sz:nth-child(1)'); await touchLine(cdp, bx, [.3, .25], [.6, .25]); s = await S(p);
    ok('size change: thin is narrower than medium', s.last.w < wMed, String(s.last.w));
    await p.click('#size'); await p.click('#sizePanel .sz:nth-child(3)'); await touchLine(cdp, bx, [.2, .9], [.8, .9]);
    const before = await ink(p, .5, .9);
    await p.click('#eraser');
    await touchLine(cdp, bx, [.5, .85], [.5, .95]); s = await S(p);
    ok('eraser removes paint where it passes', before > 0 && (await ink(p, .5, .9)) === 0 && (await ink(p, .3, .9)) > 0 && s.last.tool === 'eraser', 'alpha before ' + before);
    ok('eraser is shown as the active tool', await p.getAttribute('#eraser', 'aria-pressed') === 'true' && await p.getAttribute('#brush', 'aria-pressed') === 'false');
    await p.click('#brush');
    const nBefore = await inkCount(p);
    await p.click('#clear'); const dlg = await p.isVisible('#confirmClear'); const q = await p.textContent('#confirmClear p');
    await p.click('#confirmClear button[value=cancel]'); ok('clear asks first; "ביטול" keeps the work', dlg && q === 'לנקות את כל היצירה?' && await inkCount(p) === nBefore, q);
    await p.click('#clear'); await p.click('#confirmClear button[value=clear]');
    ok('clear after "נקה" empties the canvas', await inkCount(p) === 0);
    await p.click('#undo'); ok('clear can be undone', await inkCount(p) === nBefore);
    s = await S(p); ok('work is marked unsaved', s.dirty);
    await p.click('#save'); await p.waitForTimeout(100);
    const saved = await p.evaluate(() => JSON.parse(localStorage.getItem(__studio.key)));
    const lesson = saved && (saved.lesson ? saved.lesson.id : saved.activity && saved.activity.lesson);
    const width = saved && (saved.size || saved.canvas || {}).w;
    ok('save stores the work, a preview and the lesson', saved && saved.ops.length > 0 && /^data:image\/png;base64,/.test(saved.preview) && !!lesson && width > 0,
      'ops ' + saved.ops.length + ', preview ' + Math.round(saved.preview.length / 1024) + 'KB, lesson ' + lesson);
    ok('save shows a confirmation and clears "unsaved"', (await p.textContent('#toast')) === 'היצירה נשמרה' && !(await S(p)).dirty);
    await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(100);
    ok('reopening shows the saved work', (await S(p)).ops === saved.ops.length && await inkCount(p) > 100 && (await p.textContent('#toast')) === 'העבודה השמורה נפתחה');
    await p.click('#back'); await p.waitForURL(/lesson-2-1-learner/, { timeout: 3000 }).catch(() => {});
    ok('back with nothing unsaved leaves directly', /lesson-2-1-learner\.html/.test(p.url()));
    await p.goto(U + '?lang=he', { waitUntil: 'networkidle' }); const bx2 = await box(p);
    await touchLine(cdp, bx2, [.1, .9], [.9, .9]);
    await p.click('#back'); const ex = await p.isVisible('#confirmExit'); const exq = await p.textContent('#confirmExit p'); const exb = await p.$$eval('#confirmExit button', x => x.map(b => b.textContent));
    await p.click('#confirmExit button[value=cancel]');
    ok('back with unsaved work asks: שמור / צא / ביטול; ביטול stays', ex && exq === 'יש שינויים שלא נשמרו.' && JSON.stringify(exb) === JSON.stringify(['ביטול', 'צא', 'שמור']) && HERE.test(p.url()), exq + ' ' + exb.join('/'));
    const opsNow = (await S(p)).ops; const KEY = await p.evaluate(() => __studio.key);
    await p.click('#back'); await p.click('#confirmExit button[value=save]'); await p.waitForURL(/lesson-2-1-learner/, { timeout: 3000 }).catch(() => {});
    const afterSave = await p.evaluate(k => JSON.parse(localStorage.getItem(k)).ops.length, KEY);
    ok('"שמור" in the exit question saves, then leaves', /lesson-2-1-learner/.test(p.url()) && afterSave === opsNow);
    await p.goto(U + '?lang=he', { waitUntil: 'networkidle' }); const bx3 = await box(p);
    await touchLine(cdp, bx3, [.1, .8], [.9, .8]);
    await p.click('#back'); await p.click('#confirmExit button[value=exit]'); await p.waitForURL(/lesson-2-1-learner/, { timeout: 3000 }).catch(() => {});
    const afterExit = await p.evaluate(k => JSON.parse(localStorage.getItem(k)).ops.length, KEY);
    ok('"צא" leaves without saving', /lesson-2-1-learner/.test(p.url()) && afterExit === opsNow);
    ok('no JavaScript errors (Hebrew, touch)', errs.length === 0, errs.join(' | '));
    await ctx.close(); }

  /* ── direction and languages ── */
  for (const lang of ['he', 'en']) {
    const { p, ctx, errs } = await open({ isMobile: true, hasTouch: true }, '?lang=' + lang);
    const r = await p.evaluate(() => ({ dir: document.documentElement.dir, lang: document.documentElement.lang, back: document.querySelector('#back').textContent.trim(), title: document.querySelector('.title').textContent,
      backX: document.querySelector('#back').getBoundingClientRect().left, titleX: document.querySelector('.title').getBoundingClientRect().left, labels: [...document.querySelectorAll('.tool span[data-t], .btn[data-t]')].map(e => e.textContent).join(' · ') }));
    const rtl = lang === 'he';
    ok((rtl ? 'RTL' : 'LTR') + ' layout and text', r.dir === (rtl ? 'rtl' : 'ltr') && (rtl ? r.backX > r.titleX : r.backX < r.titleX) && r.back === (rtl ? 'חזרה לשיעור' : 'Back to the lesson'), r.title + ' | ' + r.labels);
    ok('no JavaScript errors (' + lang + ')', errs.length === 0, errs.join(' | '));
    await ctx.close();
  }

  /* ── screens ── */
  const screens = [['phone narrow', 360, 740, true], ['phone wide', 430, 932, true], ['tablet', 820, 1180, true], ['tablet landscape', 1180, 820, true], ['desktop', 1440, 900, false], ['phone landscape', 844, 390, true]];
  for (const [name, w, h, touch] of screens) for (const lang of ['he', 'en']) {
    const { p, ctx, errs } = await open({ viewport: { width: w, height: h }, isMobile: touch && w < 900, hasTouch: touch }, '?lang=' + lang);
    const r = await p.evaluate(() => {
      const W = innerWidth, H = innerHeight, c = document.getElementById('canvas').getBoundingClientRect();
      const ctrls = [...document.querySelectorAll('#back, .tool, .btn:not(dialog .btn)')].map(e => e.getBoundingClientRect());
      return { ox: document.documentElement.scrollWidth - W, oy: document.documentElement.scrollHeight - H, area: Math.round(c.width * c.height / (W * H) * 100),
        inView: ctrls.every(r => r.left >= 0 && r.right <= W && r.top >= 0 && r.bottom <= H), minTap: Math.round(Math.min(...ctrls.map(r => Math.min(r.width, r.height)))) };
    });
    ok(`${name} ${w}×${h} ${lang}: no overflow, all controls on screen, canvas ${r.area}% of screen, smallest control ${r.minTap}px`, r.ox === 0 && r.oy <= 0 && r.inView && r.minTap >= 44 && errs.length === 0, JSON.stringify(r));
    if (SHOTS && (lang === 'he' || name === 'desktop')) {
      const bx = await box(p); await p.mouse.move(bx.x + bx.w * .2, bx.y + bx.h * .4); await p.mouse.down(); await p.mouse.move(bx.x + bx.w * .7, bx.y + bx.h * .55, { steps: 10 }); await p.mouse.up();
      await p.screenshot({ path: `${SHOTS}/studio-${name.replace(/ /g, '-')}-${lang}.png` });
    }
    await ctx.close();
  }
  out('\n' + R.filter(x => x[1]).length + ' / ' + R.length + ' passed');
  await b.close();
  process.exitCode = R.every(x => x[1]) ? 0 : 1;
})();
