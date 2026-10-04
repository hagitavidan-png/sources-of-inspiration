/* Studio V2 checks (besides the 38 regression checks in regression.js):
   the toolbar follows the activity, Drawing loads at 4:5, the canvas keeps the activity's proportions on every screen and in rotation,
   "Back" accepts only a path inside the site, labels stay readable at 360px, the 0.6 fade while drawing,
   the core extensions (the activity read-only for the tools, the base layer, the first tool), Repeat (Pattern),
   Fill (Color) and Arrange (Composition).
     STUDIO_URL=http://localhost:8766/prototypes/studio-v2/index.html node v2.js
   Optional: CHROMIUM_PATH. Another activity configuration is served in place of activities.js (route), so the
   studio's files are not changed for the test. */
const { chromium } = require('playwright');
const U = process.env.STUDIO_URL || 'http://localhost:8766/prototypes/studio-v2/index.html';
const R = []; const ok = (name, cond, info = '') => { R.push([name, !!cond]); console.log((cond ? 'PASS ' : 'FAIL ') + name + (info ? '  ' + info : '')); };

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  async function open(q = '', opt = {}, activities) {
    const ctx = await b.newContext(Object.assign({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, opt));
    if (activities) await ctx.route(/activities\.js(\?.*)?$/, r => r.fulfill({ contentType: 'application/javascript', body: 'window.STUDIO_ACTIVITIES = ' + JSON.stringify(activities) + ';' }));
    const p = await ctx.newPage(); const errs = [], warns = [];
    p.on('pageerror', e => errs.push(e.message));
    /* errors of the studio page (the page STUDIO_URL names, wherever the studio is) */
    p.on('console', m => { if (m.type() === 'error' && new URL(p.url()).pathname === new URL(U).pathname) errs.push(m.text()); if (m.type() === 'warning') warns.push(m.text()); });
    await p.goto(U + q, { waitUntil: 'networkidle' });
    await p.evaluate(() => localStorage.clear());
    return { p, ctx, errs, warns };
  }
  const toolbar = p => p.$$eval('#tools .tool', x => x.map(b => b.id).join(','));
  const ratio = p => p.$eval('#canvas', c => { const r = c.getBoundingClientRect(); return r.width / r.height; });
  /* the Drawing activity in activities.js is 4:5 (width / height) */
  const DRAWING = 4 / 5;
  async function line(p, a, z) {
    const r = await p.$eval('#canvas', c => c.getBoundingClientRect().toJSON());
    await p.mouse.move(r.x + r.width * a[0], r.y + r.height * a[1]); await p.mouse.down();
    await p.mouse.move(r.x + r.width * z[0], r.y + r.height * z[1], { steps: 10 }); await p.mouse.up();
  }

  /* 1. the default activity shows exactly its tools, in V1's order */
  { const { p, ctx, errs } = await open('?lang=he');
    ok('drawing (draw + color) shows only its tools, in V1 order', await toolbar(p) === 'undo,redo,brush,color,size,eraser' && errs.length === 0, await toolbar(p));
    const asp = await p.evaluate(() => __studio.activity.canvas.aspect), rr = await ratio(p);
    ok('drawing loads at 4:5', asp === '4:5' && Math.abs(rr - DRAWING) < 0.01, asp + ' · ' + rr.toFixed(3));
    await ctx.close(); }

  /* 2. another configuration changes the toolbar */
  { const acts = { drawing: { id: 'drawing', lesson: 'test', tools: ['draw'], canvas: { aspect: '4:3' }, back: '../../index.html' } };
    const { p, ctx, errs } = await open('?lang=he', {}, acts);
    const bar = await toolbar(p);
    await line(p, [.2, .5], [.8, .5]);
    const col = await p.evaluate(() => __studio.doc.ops.slice(-1)[0].color);
    ok('draw only: no colour tool, lines in charcoal', bar === 'undo,redo,brush,size,eraser' && col === '#2b2a28' && errs.length === 0, bar + ' · ' + col);
    await ctx.close(); }
  { const acts = { drawing: { id: 'drawing', lesson: 'test', tools: ['draw', 'color', 'repeat'], canvas: { aspect: '1:1' } } };
    const { p, ctx, errs, warns } = await open('?lang=en', {}, acts);
    const bar = await toolbar(p), rr = await ratio(p);
    ok('a tool that is not built yet is left out with a warning, no error', bar === 'undo,redo,brush,color,size,eraser' && warns.some(w => /repeat/.test(w)) && errs.length === 0, bar);
    ok('the activity sets the proportions (1:1)', Math.abs(rr - 1) < 0.01, rr.toFixed(3));
    await ctx.close(); }
  { const acts = { drawing: { id: 'drawing', lesson: 'test', tools: ['draw', 'color'], canvas: { aspect: '4:3' } }, other: { id: 'other', lesson: 'test', tools: ['draw'], canvas: { aspect: '3:4' } } };
    const { p, ctx, errs } = await open('?activity=other&lang=he', {}, acts);
    const bar = await toolbar(p), rr = await ratio(p), key = await p.evaluate(() => __studio.key);
    ok('?activity= picks another activity: its tools, proportions and save key', bar === 'undo,redo,brush,size,eraser' && Math.abs(rr - 0.75) < 0.01 && key === 'studio-v2:test:other' && errs.length === 0, bar + ' · ' + rr.toFixed(3) + ' · ' + key);
    await ctx.close(); }

  /* 3. proportions on every screen and in rotation */
  const screens = [['360 he', 360, 780, 'he'], ['360 en', 360, 780, 'en'], ['430', 430, 932, 'he'], ['tablet', 820, 1180, 'he'], ['tablet landscape', 1180, 820, 'he'], ['desktop', 1440, 900, 'he', false]];
  for (const [name, w, h, lang, touch = true] of screens) {
    const { p, ctx, errs } = await open('?lang=' + lang, { viewport: { width: w, height: h }, isMobile: touch && w < 900, hasTouch: touch });
    const r = await p.evaluate(() => {
      const W = innerWidth, H = innerHeight, c = document.getElementById('canvas').getBoundingClientRect();
      const ctrls = [...document.querySelectorAll('#back, .tool, .btn:not(dialog .btn)')].map(e => e.getBoundingClientRect());
      const cut = [...document.querySelectorAll('.tool span[data-t]')].filter(s => s.scrollWidth > s.clientWidth + 0.5).map(s => s.textContent);
      return { ox: document.documentElement.scrollWidth - W, area: Math.round(c.width * c.height / (W * H) * 100), ratio: +(c.width / c.height).toFixed(3),
        inView: ctrls.every(r => r.left >= 0 && r.right <= W && r.top >= 0 && r.bottom <= H), minTap: Math.round(Math.min(...ctrls.map(r => Math.min(r.width, r.height)))),
        cut, font: parseFloat(getComputedStyle(document.querySelector('.tool span[data-t]')).fontSize) };
    });
    const want = DRAWING;
    ok(`${name} ${w}×${h}: canvas keeps the activity's ratio (${r.area}% of screen), no overflow, labels not cut (${r.font}px), controls ≥48px`,
      Math.abs(r.ratio - want) < 0.01 && r.ox === 0 && r.inView && r.minTap >= 48 && !r.cut.length && errs.length === 0, JSON.stringify(r));
    await ctx.close();
  }
  { const { p, ctx, errs } = await open('?lang=he', { viewport: { width: 390, height: 844 } });
    await line(p, [.1, .5], [.9, .5]);
    const before = await ratio(p), ops = await p.evaluate(() => __studio.doc.ops.length), want = DRAWING;
    await p.setViewportSize({ width: 844, height: 390 }); await p.waitForTimeout(300);
    const after = await ratio(p), ink = await p.evaluate(() => { const c = document.getElementById('canvas'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i]) n++; return n; });
    await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(300);
    const back = await ratio(p);
    ok('rotation keeps the proportions and the drawing', [before, after, back].every(x => Math.abs(x - want) < 0.01) && ink > 50 && await p.evaluate(() => __studio.doc.ops.length) === ops && errs.length === 0,
      [before, after, back].map(x => x.toFixed(3)).join(' → ') + ', ink ' + ink);
    await ctx.close(); }

  /* 4. "Back to the lesson" goes only to a path inside the site */
  const DEF = '../../lesson-pages/lesson-2-1-learner.html';
  for (const [bad, label] of [['https://evil.example/', 'an external address'], ['javascript:alert(1)', 'javascript:'], [' JavaScript:alert(1)', 'javascript: with a space and capitals'], ['//evil.example/x', 'a protocol-relative address'], ['data:text/html,x', 'data:'], ['\\\\evil.example', 'backslashes']]) {
    const { p, ctx, errs } = await open('?lang=he&back=' + encodeURIComponent(bad));
    const back = await p.evaluate(() => __studio.back);
    await p.click('#back'); await p.waitForTimeout(400);
    ok('back refuses ' + label, back === DEF && /lesson-2-1-learner\.html/.test(p.url()) && errs.length === 0, back + ' → ' + p.url().replace(/^https?:\/\/[^/]+/, ''));
    await ctx.close();
  }
  { const { p, ctx } = await open('?lang=he&back=' + encodeURIComponent('../../index.html'));
    const back = await p.evaluate(() => __studio.back);
    await p.click('#back'); await p.waitForTimeout(400);
    ok('back accepts a relative path inside the site', back === '../../index.html' && /\/index\.html$/.test(p.url()), back);
    await ctx.close(); }

  /* 5. the interface steps back to 0.6 while drawing */
  { const { p, ctx } = await open('?lang=he');
    const r = await p.$eval('#canvas', c => c.getBoundingClientRect().toJSON());
    await p.mouse.move(r.x + r.width * .2, r.y + r.height * .5); await p.mouse.down(); await p.mouse.move(r.x + r.width * .6, r.y + r.height * .5, { steps: 8 });
    await p.waitForTimeout(600);
    const during = await p.$eval('.chrome', e => getComputedStyle(e).opacity);
    await p.mouse.up(); await p.waitForTimeout(600);
    const after = await p.$eval('.chrome', e => getComputedStyle(e).opacity);
    ok('interface fades to 0.6 while drawing and comes back', during === '0.6' && after === '1', during + ' → ' + after);
    await ctx.close(); }

  /* 6. the V2 save format */
  { const { p, ctx } = await open('?lang=he');
    await line(p, [.2, .4], [.8, .4]); await p.click('#save'); await p.waitForTimeout(100);
    const d = await p.evaluate(() => JSON.parse(localStorage.getItem(__studio.key)));
    const want = DRAWING;
    ok('save format v2: activity, lesson, proportions, operations, preview', d.v === 2 && d.activity.id === 'drawing' && d.activity.lesson === 'prototype' && d.canvas.aspect === await p.evaluate(() => __studio.activity.canvas.aspect) && d.canvas.w === 1000 && d.canvas.h === Math.round(1000 / want) && d.ops.length === 1 && /^data:image\/png/.test(d.preview),
      JSON.stringify({ v: d.v, activity: d.activity, canvas: d.canvas, ops: d.ops.length }));
    await ctx.close(); }

  /* 7. core extensions: the activity read-only for the tools, the base layer under the learner's layer, the first tool */
  /* a test-only capability, added after color.js, that records what the core hands it and paints the base layer blue */
  const PROBE = `Studio.register('probe', { tool: 'probe', init: function (S) {
    'use strict';
    var a = S.activity, tried = [];
    ['id', 'lesson'].forEach(function (k) { try { a[k] = 'x'; } catch (e) { tried.push(k); } });
    try { a.params.extra = 1; } catch (e) { tried.push('params'); }
    try { a.tools.push('x'); } catch (e) { tried.push('tools'); }
    window.__probe = { activity: JSON.parse(JSON.stringify(a)), frozen: tried, same: a.id };
    S.base(function (c) { c.fillStyle = '#2f6fa8'; c.fillRect(0, 0, S.doc.w, S.doc.h); });
    S.pointer('probe', { down: function () {}, move: function () {}, up: function () {} });
  } });`;
  async function withProbe(q, acts, opt = {}) {
    const ctx = await b.newContext(Object.assign({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, opt));
    await ctx.route(/activities\.js(\?.*)?$/, r => r.fulfill({ contentType: 'application/javascript', body: 'window.STUDIO_ACTIVITIES = ' + JSON.stringify(acts) + ';' }));
    await ctx.route(/js\/color\.js(\?.*)?$/, async r => { const res = await r.fetch(); r.fulfill({ response: res, body: (await res.text()) + '\n' + PROBE }); });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto(U + q, { waitUntil: 'networkidle' }); await p.evaluate(() => localStorage.clear());
    return { p, ctx, errs };
  }
  const px = (p, id, fx, fy) => p.$eval('#' + id, (c, f) => Array.from(c.getContext('2d').getImageData(Math.floor(c.width * f[0]), Math.floor(c.height * f[1]), 1, 1).data), [fx, fy]);
  { const acts = { drawing: { id: 'drawing', lesson: 'test', tools: ['draw', 'probe'], canvas: { aspect: '4:5' }, params: { probe: { n: 2 } }, content: { items: ['a'] } } };
    const { p, ctx, errs } = await withProbe('?lang=he', acts);
    const pr = await p.evaluate(() => window.__probe);
    ok('a capability reads the activity: id, lesson, tools, canvas, params, content', pr.activity.id === 'drawing' && pr.activity.lesson === 'test' && pr.activity.tools.join() === 'draw,probe' && pr.activity.canvas.aspect === '4:5' && pr.activity.params.probe.n === 2 && pr.activity.content.items[0] === 'a' && errs.length === 0, JSON.stringify(pr.activity));
    ok('the activity is read-only for the capability', pr.frozen.join() === 'id,lesson,params,tools' && pr.same === 'drawing' && await p.evaluate(() => __studio.activity.tools.length) === 2, pr.frozen.join());
    const b0 = await px(p, 'base', .5, .5), l0 = await px(p, 'canvas', .5, .5);
    await line(p, [.1, .5], [.9, .5]);
    const ink = await px(p, 'canvas', .5, .5);
    await p.click('#eraser'); await line(p, [.1, .5], [.9, .5]);
    const b1 = await px(p, 'base', .5, .5), l1 = await px(p, 'canvas', .5, .5);
    ok('base layer under the learner layer; the eraser erases the learner layer only', b0.join() === '47,111,168,255' && l0[3] === 0 && ink[3] === 255 && l1[3] === 0 && b1.join() === b0.join() && errs.length === 0, `base ${b0} → ${b1}, learner ${l0[3]} → ${ink[3]} → ${l1[3]}`);
    const lay = await p.evaluate(() => { const a = document.getElementById('base').getBoundingClientRect(), c = document.getElementById('canvas').getBoundingClientRect(); return [a.x - c.x, a.y - c.y, a.width - c.width, a.height - c.height].every(v => Math.abs(v) < 0.5); });
    await p.setViewportSize({ width: 844, height: 390 }); await p.waitForTimeout(300);
    const lay2 = await p.evaluate(() => { const a = document.getElementById('base').getBoundingClientRect(), c = document.getElementById('canvas').getBoundingClientRect(); return [a.x - c.x, a.y - c.y, a.width - c.width, a.height - c.height].every(v => Math.abs(v) < 0.5); });
    ok('the two layers have the same size and place, also after rotation', lay && lay2);
    await ctx.close(); }
  for (const [tools, want, label] of [[['draw', 'color'], 'brush', 'draw first: brush'], [['color', 'draw'], 'brush', 'colour first (it has no tool of its own): brush'], [['probe', 'draw'], 'probe', 'another capability first: its tool'], [['color'], null, 'no capability with a tool: none, safely'], [[], null, 'no capabilities: none, safely']]) {
    const { p, ctx, errs } = await withProbe('?lang=en', { drawing: { id: 'drawing', lesson: 'test', tools, canvas: { aspect: '4:5' } } });
    const tool = await p.evaluate(() => __studio.state.tool);
    await line(p, [.2, .3], [.8, .6]); await p.click('#undo', { force: true }).catch(() => {}); await p.click('#save');
    const ops = await p.evaluate(() => __studio.doc.ops.length);
    ok('first tool, ' + label, tool === want && (want === 'brush' || ops === 0) && errs.length === 0, `tool ${tool}, ops ${ops}` + (errs.length ? ', ' + errs.join(' | ') : ''));
    await ctx.close();
  }

  /* 8. Repeat (the Pattern activity): one unit, shown repeated; grid and offset */
  const PAT = (modes, step = 250) => ({ pattern: { id: 'pattern', lesson: 'test', tools: ['draw', 'repeat'], canvas: { aspect: '4:3' }, params: { repeat: { modes, step } } } });
  /* a short line in artwork units (the artwork is 1000 × 750) */
  async function unitLine(p, a, z) {
    const r = await p.$eval('#canvas', c => c.getBoundingClientRect().toJSON()), k = r.width / 1000;
    await p.mouse.move(r.x + a[0] * k, r.y + a[1] * k); await p.mouse.down();
    await p.mouse.move(r.x + z[0] * k, r.y + z[1] * k, { steps: 6 }); await p.mouse.up();
  }
  /* is there ink at these artwork points (learner layer, a 3×3 pixel neighbourhood) */
  const inkAt = (p, pts) => p.$eval('#canvas', (c, pts) => { const k = c.width / 1000, x = c.getContext('2d');
    return pts.map(([ax, ay]) => { const X = Math.round(ax * k), Y = Math.round(ay * k); if (X < 1 || Y < 1 || X >= c.width - 1 || Y >= c.height - 1) return null;
      const d = x.getImageData(X - 1, Y - 1, 3, 3).data; for (let i = 3; i < d.length; i += 4) if (d[i] > 128) return true; return false; }); }, pts);
  const inkTotal = p => p.$eval('#canvas', c => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i]) n++; return n; });
  /* the repeats of a point at (120, 100) that fall well inside the artwork */
  const copies = mode => { const out = []; for (let j = 0; j < 3; j++) for (let i = -1; i < 4; i++) { const x = 120 + i * 250 + (mode === 'offset' && j % 2 ? 125 : 0), y = 100 + j * 250; if (x > 10 && x < 990) out.push([x, y]); } return out; };
  const between = mode => mode === 'grid' ? [[245, 225], [120 + 125, 350], [370, 100 + 125]] : [[120, 350], [370, 350], [245, 225]];
  const shown = async (p, mode) => { const a = await inkAt(p, copies(mode)), b = await inkAt(p, between(mode)); return { ok: a.every(Boolean) && b.every(v => v === false), n: a.filter(Boolean).length + '/' + a.length, gaps: b.join() }; };
  const UNIT = [[110, 100], [130, 100]];

  { const { p, ctx, errs } = await open('?activity=pattern&lang=he');
    const r = await p.evaluate(() => ({ tools: __studio.tools.join(), tool: __studio.state.tool, mode: __studio.doc.settings.repeat && __studio.doc.settings.repeat.mode }));
    ok('Pattern: the repeat capability loads (draw + repeat), brush on, grid to start, 4:3', await toolbar(p) === 'undo,redo,brush,size,eraser,repeat' && r.tools === 'draw,repeat' && r.tool === 'brush' && r.mode === 'grid' && Math.abs(await ratio(p) - 4 / 3) < 0.01 && errs.length === 0, await toolbar(p) + ' · ' + JSON.stringify(r));
    await unitLine(p, ...UNIT);
    const ops = await p.evaluate(() => __studio.doc.ops), g = await shown(p, 'grid');
    ok('one line drawn = one operation in the history, the repeats are not operations', ops.length === 1 && ops[0].t === 'stroke', ops.length + ' operation(s)');
    ok('grid: the unit stays in place and repeats in rows and columns at the same distance', g.ok, 'repeats ' + g.n + ', gaps ' + g.gaps);
    const before = JSON.stringify(ops[0]);
    await p.click('#repeat'); await p.click('#repeatPanel .sz[data-mode=offset]');
    const o = await shown(p, 'offset'), after = await p.evaluate(() => ({ ops: __studio.doc.ops.length, op: JSON.stringify(__studio.doc.ops[0]), dirty: __studio.dirty(), mode: __studio.doc.settings.repeat.mode }));
    ok('offset: every second row moves across by half the distance; no rotation, no change of size', o.ok, 'repeats ' + o.n + ', gaps ' + o.gaps);
    ok('grid ↔ offset does not change the line, and is not a step in the history (but is unsaved)', after.op === before && after.ops === 1 && after.mode === 'offset' && after.dirty, JSON.stringify({ ops: after.ops, mode: after.mode, dirty: after.dirty }));
    await p.click('#repeat'); await p.click('#repeatPanel .sz[data-mode=grid]');
    const back = await shown(p, 'grid');
    await p.click('#undo');
    const undone = { ink: await inkTotal(p), ops: await p.evaluate(() => __studio.doc.ops.length), mode: await p.evaluate(() => __studio.doc.settings.repeat.mode) };
    await p.click('#redo');
    const redone = await shown(p, 'grid');
    ok('undo takes away the line and every repeat; redo brings them all back (the kind of repeat stays)', back.ok && undone.ink === 0 && undone.ops === 0 && undone.mode === 'grid' && redone.ok, JSON.stringify(undone) + ' · redo ' + redone.n);
    await p.click('#eraser'); await unitLine(p, [100, 100], [140, 100]);
    const erased = await inkAt(p, copies('grid'));
    ok('the eraser on the unit erases it in every repeat', erased.every(v => v === false) && await p.evaluate(() => __studio.doc.ops.length) === 2, erased.filter(Boolean).length + ' repeats left');
    ok('Pattern: no JavaScript errors', errs.length === 0, errs.join(' | '));
    await ctx.close(); }

  { const { p, ctx, errs } = await open('?activity=pattern&lang=en');
    await p.click('#repeat'); await p.click('#repeatPanel .sz[data-mode=offset]');
    await unitLine(p, ...UNIT); await p.click('#save'); await p.waitForTimeout(100);
    const d = await p.evaluate(() => JSON.parse(localStorage.getItem(__studio.key)));
    await p.reload({ waitUntil: 'networkidle' });
    const r = await p.evaluate(() => ({ ops: __studio.doc.ops.length, mode: __studio.doc.settings.repeat.mode, dirty: __studio.dirty(), pressed: document.querySelector('#repeatPanel .sz[aria-pressed=true]').dataset.mode }));
    const o = await shown(p, 'offset');
    ok('save keeps the learner\'s line (one operation) and the kind of repeat, not the repeats', d.ops.length === 1 && d.settings.repeat.mode === 'offset' && /^data:image\/png/.test(d.preview) && d.canvas.aspect === '4:3', JSON.stringify({ ops: d.ops.length, settings: d.settings }));
    ok('reopening shows the same work, repeated the same way', r.ops === 1 && r.mode === 'offset' && r.pressed === 'offset' && !r.dirty && o.ok && errs.length === 0, JSON.stringify(r) + ' · ' + o.n);
    await ctx.close(); }

  for (const [label, modes, want, button] of [['grid only', ['grid'], 'grid', false], ['offset only', ['offset'], 'offset', false], ['offset first, then grid', ['offset', 'grid'], 'offset', true]]) {
    const { p, ctx, errs } = await open('?activity=pattern&lang=he', {}, PAT(modes));
    await unitLine(p, ...UNIT);
    const r = await p.evaluate(() => ({ mode: __studio.doc.settings.repeat.mode, button: !!document.getElementById('repeat') })), sh = await shown(p, want);
    ok(`the activity sets the repeat: ${label}`, r.mode === want && r.button === button && sh.ok && errs.length === 0, JSON.stringify(r) + ' · ' + sh.n);
    await ctx.close();
  }
  { const { p, ctx, errs, warns } = await open('?activity=pattern&lang=he', {}, { pattern: { id: 'pattern', lesson: 'test', tools: ['draw', 'repeat'], canvas: { aspect: '4:3' } } });
    await unitLine(p, ...UNIT);
    const r = await inkAt(p, [[120, 100], [370, 100]]);
    ok('without repeat settings in the activity: a warning, no repeats, no error', warns.some(w => /repeat/.test(w)) && r[0] === true && r[1] === false && await toolbar(p) === 'undo,redo,brush,size,eraser' && errs.length === 0, r.join());
    await ctx.close(); }
  { const { p, ctx, errs } = await open('?lang=he');
    await unitLine(p, ...UNIT); await p.click('#save'); await p.waitForTimeout(100);
    const r = await inkAt(p, [[120, 100], [370, 100], [120, 350]]), d = await p.evaluate(() => JSON.parse(localStorage.getItem(__studio.key)));
    ok('Drawing is not touched: no repeat tool, no repeats, nothing new in its save', await toolbar(p) === 'undo,redo,brush,color,size,eraser' && r.join() === 'true,false,false' && !('settings' in d) && errs.length === 0, r.join());
    await ctx.close(); }

  /* Pattern on every screen: 4:3, nothing outside the page, the choice of repeat inside the screen */
  for (const [name, w, h, lang, touch = true] of [['360 he', 360, 780, 'he'], ['390 en', 390, 844, 'en'], ['phone landscape', 844, 390, 'he'], ['tablet', 768, 1024, 'he'], ['tablet en', 768, 1024, 'en'], ['desktop', 1440, 900, 'en', false], ['desktop he', 1440, 900, 'he', false]]) {
    const { p, ctx, errs } = await open('?activity=pattern&lang=' + lang, { viewport: { width: w, height: h }, isMobile: touch && w < 900, hasTouch: touch });
    await unitLine(p, ...UNIT);
    await p.click('#repeat');
    const r = await p.evaluate(() => {
      const W = innerWidth, H = innerHeight, c = document.getElementById('canvas').getBoundingClientRect(), pn = document.getElementById('repeatPanel').getBoundingClientRect();
      const ctrls = [...document.querySelectorAll('#back, .tool, .btn:not(dialog .btn), #repeatPanel .sz')].map(e => e.getBoundingClientRect());
      return { dir: document.documentElement.dir, ratio: +(c.width / c.height).toFixed(3), ox: document.documentElement.scrollWidth - W, oy: document.documentElement.scrollHeight - H,
        inView: ctrls.every(r => r.left >= 0 && r.right <= W && r.top >= 0 && r.bottom <= H), panelIn: pn.left >= 0 && pn.right <= W, minTap: Math.round(Math.min(...ctrls.map(r => Math.min(r.width, r.height)))),
        cut: [...document.querySelectorAll('.tool span[data-t], #repeatPanel span')].filter(s => s.offsetWidth && s.scrollWidth > s.clientWidth + 0.5).map(s => s.textContent),
        labels: [...document.querySelectorAll('#repeatPanel span')].map(s => s.textContent).join('/') };
    });
    await p.click('#repeatPanel .sz[data-mode=offset]');
    const o = await shown(p, 'offset');
    ok(`Pattern ${name} ${w}×${h}: 4:3, ${r.dir}, no overflow, controls and the repeat choice on screen (${r.labels}), offset shown`,
      Math.abs(r.ratio - 4 / 3) < 0.01 && r.dir === (lang === 'he' ? 'rtl' : 'ltr') && r.ox === 0 && r.oy === 0 && r.inView && r.panelIn && r.minTap >= 48 && !r.cut.length && o.ok && errs.length === 0, JSON.stringify(r));
    await ctx.close();
  }

  /* 9. Fill (the Color activity): areas the activity provides, filled with the chosen colour */
  /* points inside the Color activity's areas, in artwork units (1000 × 750) */
  const AT = { field: [100, 80], circle: [360, 230], 'low-left': [100, 650], 'low-right': [500, 650], 'top-right': [800, 130], right: [800, 430], strip: [800, 680] };
  const RGB = { '#c8423b': '200,66,59', '#2f6fa8': '47,111,168', '#e9c33f': '233,195,63', '#5d8a4f': '93,138,79' };
  /* the colour of the learner layer at an artwork point ('' where nothing is filled) */
  const colourAt = (p, pt) => p.$eval('#canvas', (c, pt) => { const k = c.width / 1000, d = c.getContext('2d').getImageData(Math.round(pt[0] * k), Math.round(pt[1] * k), 1, 1).data; return d[3] ? d[0] + ',' + d[1] + ',' + d[2] : ''; }, pt);
  async function tapAt(p, pt, touch) {
    const r = await p.$eval('#canvas', c => c.getBoundingClientRect().toJSON()), k = r.width / 1000;
    if (touch) await p.touchscreen.tap(r.x + pt[0] * k, r.y + pt[1] * k); else await p.mouse.click(r.x + pt[0] * k, r.y + pt[1] * k);
  }
  const choose = async (p, c) => { await p.click('#color'); await p.click(`#colorPanel .sw[data-c="${c}"]`); };
  const nOps = p => p.evaluate(() => __studio.doc.ops.length);

  { const { p, ctx, errs, warns } = await open('?activity=color&lang=he');
    const r = await p.evaluate(() => ({ id: __studio.activity.id, tools: __studio.tools.join(), tool: __studio.state.tool, regions: __studio.activity.content.regions.length }));
    ok('Color: the activity loads (color + fill), fill on, 4:3', r.id === 'color' && r.tools === 'color,fill' && await toolbar(p) === 'undo,redo,color,fill' && r.tool === 'fill' && Math.abs(await ratio(p) - 4 / 3) < 0.01 && errs.length === 0 && warns.length === 0, await toolbar(p) + ' · ' + JSON.stringify(r) + (warns.length ? ' · ' + warns.join('|') : ''));
    const lines = await p.$eval('#base', c => { const k = c.width / 1000, x = c.getContext('2d'); return [[620, 100], [300, 430], [490, 230], [800, 260]].map(([a, b]) => x.getImageData(Math.round(a * k), Math.round(b * k), 1, 1).data[3] > 0); });
    const empty = await colourAt(p, AT.field);
    ok('the activity provides the areas (7): their lines are on the base layer, the learner layer is empty', r.regions === 7 && lines.every(Boolean) && empty === '' && await nOps(p) === 0, 'lines ' + lines.join());
    await choose(p, '#c8423b'); await tapAt(p, AT.field);
    const ops = await p.evaluate(() => __studio.doc.ops);
    ok('a tap in an area = one fill operation; choosing a colour is not an operation', ops.length === 1 && ops[0].t === 'fill' && ops[0].region === 'field' && ops[0].color === '#c8423b', JSON.stringify(ops));
    ok('the area shows the colour chosen', await colourAt(p, AT.field) === RGB['#c8423b']);
    const nb = { inner: await colourAt(p, AT.circle), side: await colourAt(p, [640, 100]), below: await colourAt(p, [300, 450]) };
    ok('areas that touch it, and the area inside it, stay as they were', nb.inner === '' && nb.side === '' && nb.below === '', JSON.stringify(nb));
    await choose(p, '#2f6fa8'); await tapAt(p, AT.circle);
    const two = { field: await colourAt(p, AT.field), circle: await colourAt(p, AT.circle), edge: await colourAt(p, [600, 100]) };
    ok('filling another area in another colour leaves the first as it was', two.field === RGB['#c8423b'] && two.circle === RGB['#2f6fa8'] && two.edge === RGB['#c8423b'] && await nOps(p) === 2, JSON.stringify(two));
    await choose(p, '#5d8a4f'); await tapAt(p, AT.field);
    const re = { field: await colourAt(p, AT.field), circle: await colourAt(p, AT.circle), ops: await nOps(p) };
    ok('filling the same area again changes its colour, as a new operation', re.field === RGB['#5d8a4f'] && re.circle === RGB['#2f6fa8'] && re.ops === 3, JSON.stringify(re));
    await p.click('#undo');
    const un = { field: await colourAt(p, AT.field), circle: await colourAt(p, AT.circle), ops: await nOps(p) };
    ok('undo takes away one fill: the area has its colour before', un.field === RGB['#c8423b'] && un.circle === RGB['#2f6fa8'] && un.ops === 2, JSON.stringify(un));
    await p.click('#redo');
    ok('redo brings it back', await colourAt(p, AT.field) === RGB['#5d8a4f'] && await nOps(p) === 3);
    await p.click('#undo'); await p.click('#undo'); await p.click('#undo');
    ok('undo all: nothing filled, the lines still there', await colourAt(p, AT.field) === '' && await colourAt(p, AT.circle) === '' && await nOps(p) === 0 && await p.$eval('#base', c => c.getContext('2d').getImageData(Math.round(620 * c.width / 1000), Math.round(100 * c.width / 1000), 1, 1).data[3] > 0));
    ok('Color: no JavaScript errors', errs.length === 0, errs.join(' | '));
    await ctx.close(); }

  /* save and reopen */
  { const { p, ctx, errs } = await open('?activity=color&lang=en');
    const plan = [['#c8423b', 'field'], ['#e9c33f', 'circle'], ['#2f6fa8', 'strip'], ['#5d8a4f', 'low-right']];
    for (const [c, id] of plan) { await choose(p, c); await tapAt(p, AT[id]); }
    const before = {}; for (const id of Object.keys(AT)) before[id] = await colourAt(p, AT[id]);
    await p.click('#save'); await p.waitForTimeout(100);
    const raw = await p.evaluate(() => localStorage.getItem(__studio.key)), d = JSON.parse(raw);
    ok('save keeps the activity and the fills (4 operations), not the composition', d.activity.id === 'color' && d.ops.length === 4 && d.ops.every((o, i) => o.t === 'fill' && o.region === plan[i][1] && o.color === plan[i][0]) && !/M0 0H620|regions/.test(raw) && !('settings' in d) && /^data:image\/png/.test(d.preview), JSON.stringify(d.ops));
    await p.reload({ waitUntil: 'networkidle' });
    const after = {}; for (const id of Object.keys(AT)) after[id] = await colourAt(p, AT[id]);
    ok('reopening shows the same composition and the same colours', JSON.stringify(after) === JSON.stringify(before) && await nOps(p) === 4 && !(await p.evaluate(() => __studio.dirty())) && errs.length === 0, JSON.stringify(after));
    await ctx.close(); }

  /* taps: outside every area, a slide between areas, touch on a phone */
  { const acts = { color: { id: 'color', lesson: 'test', tools: ['color', 'fill'], canvas: { aspect: '4:3' }, content: { regions: [{ id: 'a', d: 'M100 100H500V500H100Z' }, { id: 'b', d: 'M500 100H900V500H500Z' }] } } };
    const { p, ctx, errs } = await open('?activity=color&lang=he', {}, acts);
    await tapAt(p, [50, 650]);
    const out = await nOps(p);
    const r = await p.$eval('#canvas', c => c.getBoundingClientRect().toJSON()), k = r.width / 1000;
    await p.mouse.move(r.x + 300 * k, r.y + 300 * k); await p.mouse.down(); await p.mouse.move(r.x + 700 * k, r.y + 300 * k, { steps: 5 }); await p.mouse.up();
    const slide = await nOps(p);
    await tapAt(p, [300, 300]);
    ok('a tap outside every area makes no operation; a slide from one area to another fills nothing', out === 0 && slide === 0 && await nOps(p) === 1 && errs.length === 0, `outside ${out}, slide ${slide}`);
    await ctx.close(); }
  { const { p, ctx, errs } = await open('?activity=color&lang=he');
    for (let i = 0; i < 3; i++) await tapAt(p, AT.right, true);
    ok('touch: each tap is exactly one operation (no double events)', await nOps(p) === 3 && errs.length === 0, await nOps(p) + ' operations for 3 taps');
    await ctx.close(); }
  { const { p, ctx, errs, warns } = await open('?activity=color&lang=he', {}, { color: { id: 'color', lesson: 'test', tools: ['color', 'fill'], canvas: { aspect: '4:3' } } });
    await tapAt(p, [300, 300]);
    ok('without areas in the activity: a warning, no fill tool, nothing happens, no error', warns.some(w => /fill/.test(w)) && await toolbar(p) === 'undo,redo,color' && await nOps(p) === 0 && errs.length === 0, await toolbar(p));
    await ctx.close(); }
  { const { p, ctx, errs, warns } = await open('?lang=he');
    await line(p, [.2, .5], [.8, .5]);
    const op = await p.evaluate(() => __studio.doc.ops[0]);
    ok('Drawing is not touched: its tools, brush on, a line is a stroke, no new warnings', await toolbar(p) === 'undo,redo,brush,color,size,eraser' && op.t === 'stroke' && op.tool === 'brush' && warns.length === 0 && errs.length === 0, await toolbar(p) + ' · ' + op.t);
    await ctx.close(); }

  /* Color on every screen */
  for (const [name, w, h, lang, touch = true] of [['360 he', 360, 780, 'he'], ['390 en', 390, 844, 'en'], ['phone landscape', 844, 390, 'he'], ['tablet', 768, 1024, 'he'], ['tablet en', 768, 1024, 'en'], ['desktop', 1440, 900, 'en', false], ['desktop he', 1440, 900, 'he', false]]) {
    const { p, ctx, errs } = await open('?activity=color&lang=' + lang, { viewport: { width: w, height: h }, isMobile: touch && w < 900, hasTouch: touch });
    await p.click('#color');
    const r = await p.evaluate(() => {
      const W = innerWidth, H = innerHeight, c = document.getElementById('canvas').getBoundingClientRect(), b = document.getElementById('base').getBoundingClientRect(), pn = document.getElementById('colorPanel').getBoundingClientRect();
      const ctrls = [...document.querySelectorAll('#back, .tool, .btn:not(dialog .btn)')].map(e => e.getBoundingClientRect());
      return { dir: document.documentElement.dir, ratio: +(c.width / c.height).toFixed(3), same: Math.abs(b.x - c.x) < .5 && Math.abs(b.width - c.width) < .5, ox: document.documentElement.scrollWidth - W, oy: document.documentElement.scrollHeight - H,
        inView: ctrls.every(r => r.left >= 0 && r.right <= W && r.top >= 0 && r.bottom <= H) && c.left >= 0 && c.right <= W, panelIn: pn.left >= 0 && pn.right <= W && pn.top >= 0, minTap: Math.round(Math.min(...ctrls.map(r => Math.min(r.width, r.height)))),
        cut: [...document.querySelectorAll('.tool span[data-t]')].filter(s => s.offsetWidth && s.scrollWidth > s.clientWidth + 0.5).map(s => s.textContent), fill: document.querySelector('#fill span').textContent };
    });
    await p.click('#colorPanel .sw[data-c="#c8423b"]'); await tapAt(p, AT.circle, touch);
    const shown = await colourAt(p, AT.circle);
    ok(`Color ${name} ${w}×${h}: 4:3, ${r.dir}, no overflow, controls and colours on screen, "${r.fill}" works`,
      Math.abs(r.ratio - 4 / 3) < 0.01 && r.same && r.dir === (lang === 'he' ? 'rtl' : 'ltr') && r.ox === 0 && r.oy === 0 && r.inView && r.panelIn && r.minTap >= 48 && !r.cut.length && shown === RGB['#c8423b'] && errs.length === 0, JSON.stringify(r));
    await ctx.close();
  }

  /* 10. Arrange (the Composition activity): elements the activity provides, moved and brought to the front */
  const CLR = { mass: '224,138,46', column: '43,42,40', disc: '47,111,168', bar: '93,138,79', dot: '200,66,59' };
  const START = { mass: [500, 370], column: [255, 310], disc: [660, 210], bar: [720, 588], dot: [870, 220] };   // a point inside each, where it starts
  const baseAt = (p, pt) => p.$eval('#base', (c, pt) => { const k = c.width / 1000, d = c.getContext('2d').getImageData(Math.round(pt[0] * k), Math.round(pt[1] * k), 1, 1).data; return d[3] ? d[0] + ',' + d[1] + ',' + d[2] : ''; }, pt);
  async function dragA(p, a, z, steps = 8) {
    const r = await p.$eval('#canvas', c => c.getBoundingClientRect().toJSON()), k = r.width / 1000;
    await p.mouse.move(r.x + a[0] * k, r.y + a[1] * k); await p.mouse.down();
    await p.mouse.move(r.x + z[0] * k, r.y + z[1] * k, { steps }); await p.mouse.up();
  }
  async function touchDrag(p, cdp, a, z, end = 'touchEnd') {
    const r = await p.$eval('#canvas', c => c.getBoundingClientRect().toJSON()), k = r.width / 1000, P = t => ({ x: r.x + (a[0] + (z[0] - a[0]) * t) * k, y: r.y + (a[1] + (z[1] - a[1]) * t) * k });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [P(0)] });
    for (let i = 1; i <= 8; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [P(i / 8)] });
    await cdp.send('Input.dispatchTouchEvent', { type: end, touchPoints: [] });
  }
  async function penDrag(p, cdp, a, z) {
    const r = await p.$eval('#canvas', c => c.getBoundingClientRect().toJSON()), k = r.width / 1000, P = t => ({ x: r.x + (a[0] + (z[0] - a[0]) * t) * k, y: r.y + (a[1] + (z[1] - a[1]) * t) * k });
    const ev = (type, pt, extra = {}) => cdp.send('Input.dispatchMouseEvent', Object.assign({ type, x: pt.x, y: pt.y, pointerType: 'pen', button: 'left', buttons: 1, clickCount: 1, force: 0.5 }, extra));
    await ev('mousePressed', P(0)); for (let i = 1; i <= 8; i++) await ev('mouseMoved', P(i / 8)); await ev('mouseReleased', P(1), { buttons: 0 });
  }
  const opsOf = p => p.evaluate(() => __studio.doc.ops.map(o => o.t === 'stroke' ? { t: 'stroke', tool: o.tool } : o));
  const frontOn = p => p.evaluate(() => !document.getElementById('front').disabled);
  const allShown = async p => { const out = {}; for (const id in START) out[id] = await baseAt(p, START[id]); return out; };

  { const { p, ctx, errs, warns } = await open('?activity=composition&lang=he');
    const r = await p.evaluate(() => ({ id: __studio.activity.id, tools: __studio.tools.join(), tool: __studio.state.tool, n: __studio.activity.content.elements.length }));
    const shown = await allShown(p);
    ok('Composition: the activity loads (arrange + draw), arrange on, 4:3, its five elements shown', r.id === 'composition' && r.tools === 'arrange,draw' && await toolbar(p) === 'undo,redo,arrange,brush,size,eraser' && r.tool === 'arrange' && r.n === 5 && Object.keys(START).every(id => shown[id] === CLR[id]) && Math.abs(await ratio(p) - 4 / 3) < 0.01 && errs.length === 0 && !warns.some(w => /^Studio:/.test(w)), await toolbar(p) + ' · ' + JSON.stringify(r) + ' · ' + JSON.stringify(shown) + (warns.length ? ' · ' + warns.join('|') : ''));
    await dragA(p, START.column, START.column, 1);
    ok('a tap on an element chooses it: not an operation, nothing drawn', (await opsOf(p)).length === 0 && await frontOn(p) && await inkTotal(p) === 0);
    await dragA(p, START.column, [START.column[0] + 150, START.column[1] + 20]);
    let ops = await opsOf(p);
    ok('dragging an element moves it: one operation { move, id, x, y }, no line drawn', ops.length === 1 && JSON.stringify(ops[0]) === '{"t":"move","id":"column","x":350,"y":180}' && await baseAt(p, [405, 330]) === CLR.column && await baseAt(p, [215, 310]) === '' && await inkTotal(p) === 0, JSON.stringify(ops));
    const was = JSON.stringify(await allShown(p));
    await dragA(p, [100, 680], [300, 700]);
    ok('a drag that starts outside every element moves nothing and draws nothing', (await opsOf(p)).length === 1 && await inkTotal(p) === 0 && JSON.stringify(await allShown(p)) === was);
    await dragA(p, START.dot, [START.dot[0] - 6, START.dot[1] + 4], 2);
    await dragA(p, [START.dot[0] - 6, START.dot[1] + 4], [START.dot[0] - 40, START.dot[1] + 30], 6);
    ops = await opsOf(p);
    ok('a short drag is one operation; two drags are two operations', ops.length === 3 && ops[1].id === 'dot' && ops[2].id === 'dot' && ops[1].x === 834 && ops[2].x === 800, JSON.stringify(ops.slice(1)));
    await p.click('#undo');
    ok('undo of a move puts the element back where it was before', (await opsOf(p)).length === 2 && await baseAt(p, [START.dot[0] - 6, START.dot[1] + 4]) === CLR.dot && await baseAt(p, [805, 245]) === '');
    await p.click('#redo');
    ok('redo moves it again', (await opsOf(p)).length === 3 && await baseAt(p, [835, 255]) === CLR.dot);
    /* overlap: the column onto the mass; the column is in front (later in the activity's order) */
    await dragA(p, [405, 330], [520, 330]);
    const over = [520, 330];
    const o1 = await baseAt(p, over);
    await dragA(p, over, [over[0] + 1, over[1]], 1);   // where they overlap, the one in front is taken
    const frontChosen = (await opsOf(p)).slice(-1)[0].id;
    await p.click('#undo');
    await dragA(p, [600, 470], [600, 470], 1);   // choose the mass, where only it is
    const before = (await opsOf(p)).length;
    await p.click('#arrange'); await p.click('#front');
    ops = await opsOf(p);
    const o2 = await baseAt(p, over);
    ok('elements can overlap; the one in front is shown and can be chosen', o1 === CLR.column && frontChosen === 'column', o1 + ' · taken: ' + frontChosen);
    ok('bring to front: one operation { front, id }, the element now covers the other', ops.length === before + 1 && JSON.stringify(ops[ops.length - 1]) === '{"t":"front","id":"mass"}' && o2 === CLR.mass && !(await frontOn(p)), o2);
    await dragA(p, over, [over[0] + 1, over[1]], 1);
    const tapTop = (await opsOf(p)).slice(-1)[0];
    await p.click('#undo');
    await p.click('#undo');
    ok('undo of front brings back the order before', await baseAt(p, over) === CLR.column && (await opsOf(p)).slice(-1)[0].t === 'move', await baseAt(p, over));
    await p.click('#redo');
    ok('redo of front brings the element to the front again', await baseAt(p, over) === CLR.mass && tapTop.t === 'move' && tapTop.id === 'mass', JSON.stringify(tapTop));
    /* draw over the elements */
    const moves = JSON.stringify((await opsOf(p)).filter(o => o.t !== 'stroke'));
    await p.click('#brush'); await dragA(p, [150, 400], [850, 420], 12);
    ops = await opsOf(p);
    ok('draw: a line on the learner layer above the elements; drawing moves no element', ops[ops.length - 1].t === 'stroke' && ops[ops.length - 1].tool === 'brush' && JSON.stringify(ops.filter(o => o.t !== 'stroke')) === moves && (await inkAt(p, [[500, 410]]))[0] === true && await baseAt(p, [600, 470]) === CLR.mass, JSON.stringify(ops.slice(-1)));
    ok('while drawing, no element is chosen', !(await frontOn(p)));
    await p.click('#arrange');
    const n0 = (await opsOf(p)).length;
    await dragA(p, START.disc, [START.disc[0], START.disc[1] - 3000]);
    const last = (await opsOf(p)).slice(-1)[0];
    ok('arrange again: dragging moves the element, draws no line; it stays whole inside the artwork', (await opsOf(p)).length === n0 + 1 && last.t === 'move' && last.id === 'disc' && last.y === 0 && last.x === 560, JSON.stringify(last));
    /* clear */
    await p.click('#clear'); await p.click('#confirmClear button[value=clear]');
    const cl = await allShown(p);
    ok('clear: every element back where the activity starts it, the drawing gone, the elements still there', Object.keys(START).every(id => cl[id] === CLR[id]) && await inkTotal(p) === 0 && (await opsOf(p)).slice(-1)[0].t === 'clear' && await baseAt(p, [660, 40]) === '', JSON.stringify(cl));
    await p.click('#undo');
    ok('undo of clear brings the arrangement and the drawing back', await baseAt(p, [600, 470]) === CLR.mass && await inkTotal(p) > 0 && await baseAt(p, START.column) === '');
    ok('Composition: no JavaScript errors', errs.length === 0, errs.join(' | '));
    await ctx.close(); }

  /* touch, stylus, a cancelled touch */
  { const { p, ctx, errs } = await open('?activity=composition&lang=he');
    const cdp = await ctx.newCDPSession(p);
    await touchDrag(p, cdp, START.disc, [START.disc[0] - 100, START.disc[1] + 100]);
    let ops = await opsOf(p);
    const t1 = ops.length === 1 && ops[0].id === 'disc' && ops[0].x === 460 && ops[0].y === 210;
    await penDrag(p, cdp, START.dot, [START.dot[0] - 100, START.dot[1]]);
    ops = await opsOf(p);
    const t2 = ops.length === 2 && ops[1].id === 'dot' && ops[1].x === 740;
    await touchDrag(p, cdp, START.bar, [START.bar[0] - 300, START.bar[1] - 100], 'touchCancel');
    ops = await opsOf(p);
    const t3 = ops.length === 2 && await baseAt(p, START.bar) === CLR.bar && await baseAt(p, [420, 488]) !== CLR.bar;
    await touchDrag(p, cdp, START.bar, [START.bar[0] - 50, START.bar[1]]);
    const t4 = (await opsOf(p)).length === 3;
    ok('touch: a drag is one move (no double events, no line)', t1 && await inkTotal(p) === 0, JSON.stringify(ops[0]));
    ok('stylus (pen): a drag is one move', t2, JSON.stringify(ops[1]));
    ok('a cancelled touch moves nothing: the element goes back, no operation', t3);
    ok('after a cancelled touch, the next drag works and is one move', t4 && errs.length === 0, errs.join(' | '));
    await ctx.close(); }

  /* save and reopen: move, front, draw */
  { const { p, ctx, errs } = await open('?activity=composition&lang=en');
    const saveRead = async () => { await p.click('#save'); await p.waitForTimeout(100); return p.evaluate(() => localStorage.getItem(__studio.key)); };
    const reopen = async () => { await p.reload({ waitUntil: 'networkidle' }); };
    await dragA(p, START.column, [START.column[0] + 265, START.column[1] + 20]);   // onto the mass
    let raw = await saveRead(), d = JSON.parse(raw);
    await reopen();
    ok('save and reopen after a move', d.ops.length === 1 && d.ops[0].t === 'move' && await baseAt(p, [520, 330]) === CLR.column && await baseAt(p, START.column) === '' && (await opsOf(p)).length === 1);
    await dragA(p, [600, 470], [600, 470], 1); await p.click('#arrange'); await p.click('#front');
    raw = await saveRead(); d = JSON.parse(raw);
    await reopen();
    ok('save and reopen after bring to front', d.ops.length === 2 && d.ops[1].t === 'front' && await baseAt(p, [520, 330]) === CLR.mass && (await opsOf(p)).length === 2);
    await p.click('#brush'); await dragA(p, [100, 100], [900, 700], 12);
    const learner = await p.$eval('#canvas', c => c.toDataURL());
    raw = await saveRead(); d = JSON.parse(raw);
    await reopen();
    const after = { ops: (await opsOf(p)).map(o => o.t).join(), learner: await p.$eval('#canvas', c => c.toDataURL()) === learner, shown: await allShown(p) };
    ok('save keeps the activity and the moves, fronts and lines; not the elements', d.activity.id === 'composition' && d.ops.map(o => o.t).join() === 'move,front,stroke' && !/elements|M40 150C20/.test(raw) && !('settings' in d), d.ops.map(o => o.t).join());
    ok('reopening brings back all three: the place, the order, the drawing', after.ops === 'move,front,stroke' && after.learner && await baseAt(p, [520, 330]) === CLR.mass && !(await p.evaluate(() => __studio.dirty())), JSON.stringify(after.shown));
    /* the preview: the composition as arranged, each element once */
    const pv = await p.evaluate(async src => { const i = new Image(); await new Promise(r => { i.onload = r; i.src = src; }); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const x = c.getContext('2d'); x.drawImage(i, 0, 0); const k = c.width / 1000;
      const at = (a, b) => { const d = x.getImageData(Math.round(a * k), Math.round(b * k), 1, 1).data; return d[0] + ',' + d[1] + ',' + d[2]; };
      return { overlap: at(520, 330), columnBefore: at(250, 420), mass: at(500, 450), disc: at(660, 180), w: c.width }; }, d.preview);
    ok('the preview shows the composition as arranged (each element once, the mass in front)', pv.overlap === CLR.mass && pv.columnBefore === '255,253,249' && pv.mass === CLR.mass && pv.disc === CLR.disc && pv.w === 480, JSON.stringify(pv));
    ok('reopening does not add elements or operations', (await opsOf(p)).length === 3 && await p.evaluate(() => __studio.activity.content.elements.length) === 5 && errs.length === 0);
    await ctx.close(); }

  /* older or other work */
  { const acts = { composition: { id: 'composition', lesson: 'test', tools: ['arrange', 'draw'], canvas: { aspect: '4:3' }, content: { elements: [{ id: 'sq', x: 100, y: 100, w: 200, h: 200, color: '#2f6fa8', d: 'M0 0H200V200H0Z' }] } } };
    const { p, ctx, errs } = await open('?activity=composition&lang=he', {}, acts);
    await p.evaluate(() => localStorage.setItem(__studio.key, JSON.stringify({ v: 2, activity: { id: 'composition', lesson: 'test' }, canvas: { aspect: '4:3', w: 1000, h: 750 },
      ops: [{ t: 'stroke', tool: 'brush', color: '#2b2a28', w: 5, pts: [100, 600, 400, 620] }, { t: 'move', id: 'gone', x: 10, y: 10 }, { t: 'front', id: 'gone' }, { t: 'move', id: 'sq', x: 500, y: 300 }] })));
    await p.reload({ waitUntil: 'networkidle' });
    ok('work with lines only, or with elements the activity no longer has, opens without errors', await baseAt(p, [600, 400]) === '47,111,168' && (await inkAt(p, [[250, 610]]))[0] === true && errs.length === 0, errs.join(' | '));
    await ctx.close(); }
  { const { p, ctx, errs, warns } = await open('?activity=composition&lang=he', {}, { composition: { id: 'composition', lesson: 'test', tools: ['arrange', 'draw'], canvas: { aspect: '4:3' } } });
    const tb = await toolbar(p), tool = await p.evaluate(() => __studio.state.tool);
    await line(p, [.2, .5], [.8, .5]);
    ok('without elements in the activity: a warning, no arrange tool, drawing still works', warns.some(w => /arrange/.test(w)) && tb === 'undo,redo,brush,size,eraser' && tool === 'brush' && (await opsOf(p))[0].t === 'stroke' && errs.length === 0, tb);
    await ctx.close(); }
  { const { p, ctx, errs } = await open('?lang=he');
    ok('Drawing is not touched by arrange', await toolbar(p) === 'undo,redo,brush,color,size,eraser' && await p.evaluate(() => __studio.state.tool) === 'brush' && !(await p.$('#arrangePanel')) && errs.length === 0);
    await ctx.close(); }

  /* Composition on every screen */
  for (const [name, w, h, lang, touch = true] of [['360 he', 360, 780, 'he'], ['390 en', 390, 844, 'en'], ['phone landscape', 844, 390, 'he'], ['tablet', 768, 1024, 'he'], ['tablet en', 768, 1024, 'en'], ['desktop', 1440, 900, 'en', false], ['desktop he', 1440, 900, 'he', false]]) {
    const { p, ctx, errs } = await open('?activity=composition&lang=' + lang, { viewport: { width: w, height: h }, isMobile: touch && w < 900, hasTouch: touch });
    const shown = await allShown(p);
    await dragA(p, START.mass, [START.mass[0] - 60, START.mass[1] + 40]);
    await p.click('#arrange');
    const r = await p.evaluate(() => {
      const W = innerWidth, H = innerHeight, c = document.getElementById('canvas').getBoundingClientRect(), pn = document.getElementById('arrangePanel').getBoundingClientRect();
      const ctrls = [...document.querySelectorAll('#back, .tool, .btn:not(dialog .btn), #front')].map(e => e.getBoundingClientRect());
      return { dir: document.documentElement.dir, ratio: +(c.width / c.height).toFixed(3), ox: document.documentElement.scrollWidth - W, oy: document.documentElement.scrollHeight - H,
        inView: ctrls.every(r => r.left >= 0 && r.right <= W && r.top >= 0 && r.bottom <= H) && c.left >= 0 && c.right <= W, panelIn: pn.left >= 0 && pn.right <= W && pn.top >= 0 && pn.bottom <= H,
        minTap: Math.round(Math.min(...ctrls.map(r => Math.min(r.width, r.height)))), cut: [...document.querySelectorAll('.tool span[data-t], #arrangePanel span')].filter(s => s.offsetWidth && s.scrollWidth > s.clientWidth + 0.5).map(s => s.textContent),
        texts: [document.querySelector('#arrange span').textContent, document.querySelector('#front span').textContent, document.querySelector('#arrangePanel .hint').textContent].join(' / ') };
    });
    const moved = (await opsOf(p)).length === 1;
    ok(`Composition ${name} ${w}×${h}: 4:3, ${r.dir}, all five elements shown, no overflow, controls on screen (${r.texts}), dragging works`,
      Math.abs(r.ratio - 4 / 3) < 0.01 && Object.keys(START).every(id => shown[id] === CLR[id]) && r.dir === (lang === 'he' ? 'rtl' : 'ltr') && r.ox === 0 && r.oy === 0 && r.inView && r.panelIn && r.minTap >= 48 && !r.cut.length && moved && errs.length === 0, JSON.stringify(r));
    await ctx.close();
  }

  console.log('\n' + R.filter(x => x[1]).length + ' / ' + R.length + ' passed');
  await b.close();
  process.exitCode = R.every(x => x[1]) ? 0 : 1;
})();
