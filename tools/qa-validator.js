#!/usr/bin/env node
/**
 * qa-validator.js — Sources of Inspiration in Art
 * ─────────────────────────────────────────────────
 * Mandatory pre-publish validator. Run with:  node tools/qa-validator.js
 *
 * Checks:
 *  1. lesson-responsive.css injected in every lesson file
 *  2. #stage / .screen / #nav-bar|#bar structure present
 *  3. html[lang] set by applyLang() (document.documentElement.lang)
 *  4. No simultaneous bilingual display without a language-gate
 *  5. No overflow:visible on #stage
 *  6. body.dir set in applyLang() (RTL/LTR support)
 *
 * Exit codes:  0 = all PASS   1 = one or more FAIL
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const ROOT       = join(__dirname, '..');        // /home/user/webapp
const PUBLIC     = join(ROOT, 'public');

// ─── ANSI colours ────────────────────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  red:    '\x1b[31m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  grey:   '\x1b[90m',
};
const pass  = (msg) => `  ${C.green}✔${C.reset} ${msg}`;
const fail  = (msg) => `  ${C.red}✖${C.reset} ${C.red}${msg}${C.reset}`;
const warn  = (msg) => `  ${C.yellow}⚠${C.reset} ${msg}`;
const head  = (msg) => `\n${C.bold}${C.cyan}${msg}${C.reset}`;
const grey  = (msg) => `${C.grey}${msg}${C.reset}`;

// ─── Collect all HTML lesson files ───────────────────────────────────────────
function collectLessonFiles() {
  const files = [];

  // Root lesson.html
  const rootLesson = join(PUBLIC, 'lesson.html');
  try {
    statSync(rootLesson);
    files.push({ path: rootLesson, rel: 'public/lesson.html', isRoot: true });
  } catch { /* skip */ }

  // public/lessons/*.html
  const lessonsDir = join(PUBLIC, 'lessons');
  try {
    const entries = readdirSync(lessonsDir);
    for (const name of entries) {
      if (!name.endsWith('.html')) continue;
      const fullPath = join(lessonsDir, name);
      files.push({ path: fullPath, rel: `public/lessons/${name}`, isRoot: false });
    }
  } catch { /* skip */ }

  return files;
}

// ─── Individual checks ───────────────────────────────────────────────────────

/**
 * CHECK 1: lesson-responsive.css injected
 * Root files need  css/lesson-responsive.css
 * lessons/*.html  need  ../css/lesson-responsive.css
 */
function checkCSSInjection(file, html) {
  const results = [];
  const expected = file.isRoot
    ? 'css/lesson-responsive.css'
    : '../css/lesson-responsive.css';

  if (html.includes(expected)) {
    results.push({ ok: true,  msg: `lesson-responsive.css linked (${expected})` });
  } else if (html.includes('lesson-responsive.css')) {
    // Present but wrong path
    results.push({ ok: false, msg: `lesson-responsive.css found but path incorrect — expected "${expected}"` });
  } else {
    results.push({ ok: false, msg: `lesson-responsive.css NOT linked — add: <link rel="stylesheet" href="${expected}"/>` });
  }
  return results;
}

/**
 * Detect lesson type: 'slide-engine' | 'scrollable'
 * Scrollable lessons use <main class="lesson-body"> / id="lesson-content"
 * Slide-engine lessons use #stage + .screen
 */
function getLessonType(html) {
  if (html.includes('lesson-body') || html.includes('id="lesson-content"') || html.includes("id='lesson-content'")) {
    return 'scrollable';
  }
  if (html.includes('id="stage"') || html.includes("id='stage'")) {
    return 'slide-engine';
  }
  return 'unknown';
}

/**
 * CHECK 2: #stage structure
 * Only required for slide-engine lessons.
 * Scrollable lessons skip this check entirely.
 */
function checkStageStructure(file, html) {
  const results = [];
  const lessonType = getLessonType(html);

  if (lessonType === 'scrollable') {
    results.push({ ok: true, msg: 'Scrollable lesson — #stage not required (correct architecture)' });
    return results;
  }

  if (!html.includes('id="stage"') && !html.includes("id='stage'")) {
    results.push({ ok: false, msg: '#stage element not found — slide-engine requires <div id="stage">' });
    return results;
  }
  results.push({ ok: true, msg: '#stage element present' });

  // Check for overflow:visible strictly on the #stage { } CSS declaration block.
  // Strategy: find lines between "#stage {" and the closing "}" of that block only.
  // We parse the raw text line-by-line so comments like "clipping handled by #stage"
  // inside .screen rules don't trigger a false match.
  let inStageBlock = false;
  let braceDepth = 0;
  let stageBlockContent = '';
  const lines = html.split('\n');
  for (const line of lines) {
    const stripped = line.trim();
    // Detect opening of #stage { — must be the selector itself, not a comment
    if (!inStageBlock && /^#stage\s*\{/.test(stripped)) {
      inStageBlock = true;
      braceDepth = 1;
      stageBlockContent = '';
      // Capture rest of line after the opening brace
      const rest = stripped.replace(/^#stage\s*\{/, '');
      stageBlockContent += rest + '\n';
      continue;
    }
    if (inStageBlock) {
      braceDepth += (line.match(/\{/g) || []).length;
      braceDepth -= (line.match(/\}/g) || []).length;
      if (braceDepth <= 0) {
        // End of #stage block — strip CSS comments before checking
        const contentNoComments = stageBlockContent.replace(/\/\*[\s\S]*?\*\//g, '');
        if (/overflow\s*:\s*visible/.test(contentNoComments)) {
          results.push({ ok: false, msg: '#stage has overflow:visible — must be overflow:hidden' });
        }
        inStageBlock = false;
        stageBlockContent = '';
        continue;
      }
      stageBlockContent += line + '\n';
    }
  }

  return results;
}

/**
 * CHECK 3: .screen elements (slide-engine only)
 */
function checkScreenElements(file, html) {
  const results = [];
  const lessonType = getLessonType(html);

  if (lessonType === 'scrollable') {
    results.push({ ok: true, msg: 'Scrollable lesson — .screen elements not required' });
    return results;
  }

  const hasScreen = html.includes('class="screen') || html.includes("class='screen");
  if (hasScreen) {
    results.push({ ok: true, msg: '.screen elements present' });
  } else {
    results.push({ ok: null, msg: 'No .screen elements — unknown lesson type; verify architecture' });
  }
  return results;
}

/**
 * CHECK 4: #nav-bar or #bar present (slide-engine only)
 */
function checkNavBar(file, html) {
  const results = [];
  const lessonType = getLessonType(html);

  if (lessonType === 'scrollable') {
    results.push({ ok: true, msg: 'Scrollable lesson — #nav-bar not required (uses main-nav)' });
    return results;
  }

  const hasNavBar = html.includes('id="nav-bar"') || html.includes("id='nav-bar'")
                 || html.includes('id="bar"')     || html.includes("id='bar'");
  if (hasNavBar) {
    results.push({ ok: true, msg: '#nav-bar / #bar element present' });
  } else {
    results.push({ ok: false, msg: 'No #nav-bar / #bar — required for slide-engine; CTA will not be visible' });
  }
  return results;
}

/**
 * CHECK 5: applyLang() sets document.documentElement.lang
 */
function checkApplyLang(file, html) {
  const results = [];

  const hasApplyLang = html.includes('applyLang') || html.includes('applyLang()');
  if (!hasApplyLang) {
    results.push({ ok: null, msg: 'No applyLang() found — may be handled by external main.js (OK for linked scripts)' });
    return results;
  }

  // Check if documentElement.lang is set somewhere in the file
  const setsLang = html.includes('documentElement.lang')
                || html.includes('document.documentElement.lang');

  if (setsLang) {
    results.push({ ok: true, msg: 'applyLang() sets document.documentElement.lang ✓' });
  } else {
    // Could be in external JS — check if it links to main.js
    if (html.includes('main.js') || html.includes('/js/main.js')) {
      results.push({ ok: null, msg: 'applyLang() deferred to external main.js — verify main.js sets documentElement.lang' });
    } else {
      results.push({ ok: false, msg: 'applyLang() found but document.documentElement.lang not set — html[lang] CSS selectors will break' });
    }
  }

  // Check body.dir
  const setsDir = html.includes('document.body.dir') || html.includes('body.dir');
  if (setsDir) {
    results.push({ ok: true, msg: 'applyLang() sets document.body.dir (RTL/LTR) ✓' });
  } else {
    if (html.includes('main.js') || html.includes('/js/main.js')) {
      // External JS — skip
    } else {
      results.push({ ok: false, msg: 'applyLang() does not set document.body.dir — RTL/LTR switching broken' });
    }
  }

  return results;
}

/**
 * CHECK 6: Bilingual display — no simultaneous HE+EN without language-gate
 * Logic:
 *  - If file uses .bi-he / .bi-en classes → must also have html[lang] logic
 *    OR have lesson-responsive.css injected (which provides the gate via html[lang] selectors)
 *  - If file uses [data-he] / [data-en] → must have applyLang() or external main.js
 */
function checkBilingualGate(file, html) {
  const results = [];

  const hasBiClasses   = html.includes('bi-he') || html.includes('bi-en');
  const hasDataPattern = html.includes('data-he') || html.includes('data-en');
  const hasInstrClasses = html.includes('instr-he') || html.includes('instr-en');
  const anyBilingual   = hasBiClasses || hasDataPattern || hasInstrClasses;

  if (!anyBilingual) {
    results.push({ ok: true, msg: 'No bilingual elements detected — single-language file' });
    return results;
  }

  // Has bilingual elements — check gate exists
  const hasCSSGate = html.includes('lesson-responsive.css');   // CSS provides html[lang] gate
  const hasJSGate  = html.includes('documentElement.lang')     // inline JS sets it
                  || html.includes('applyLang')                 // calls applyLang
                  || html.includes('main.js');                  // links main.js

  if (hasBiClasses || hasInstrClasses) {
    if (hasCSSGate) {
      results.push({ ok: true, msg: '.bi-he/.bi-en / .instr-he/.instr-en classes gated by lesson-responsive.css html[lang] selectors ✓' });
    } else {
      results.push({ ok: false, msg: '.bi-he/.bi-en classes found but lesson-responsive.css NOT linked — both languages will display simultaneously' });
    }
  }

  if (hasDataPattern) {
    if (hasJSGate) {
      results.push({ ok: true, msg: '[data-he]/[data-en] pattern gated by JS (applyLang / main.js) ✓' });
    } else {
      results.push({ ok: false, msg: '[data-he]/[data-en] found but no applyLang() / main.js — language switching broken' });
    }
  }

  return results;
}

// ─── Run all checks on one file ───────────────────────────────────────────────
function validateFile(file) {
  const html = readFileSync(file.path, 'utf8');

  const allResults = [
    ...checkCSSInjection(file, html),
    ...checkStageStructure(file, html),
    ...checkScreenElements(file, html),
    ...checkNavBar(file, html),
    ...checkApplyLang(file, html),
    ...checkBilingualGate(file, html),
  ];

  return allResults;
}

// ─── Summary ─────────────────────────────────────────────────────────────────
function printSummary(allFilesResults) {
  let totalPass = 0, totalFail = 0, totalWarn = 0;

  for (const { file, results } of allFilesResults) {
    const fileFails = results.filter(r => r.ok === false);
    const fileWarns = results.filter(r => r.ok === null);
    const filePasses = results.filter(r => r.ok === true);

    totalPass += filePasses.length;
    totalFail += fileFails.length;
    totalWarn += fileWarns.length;

    const status = fileFails.length > 0
      ? `${C.red}✖ FAIL${C.reset}`
      : fileWarns.length > 0
        ? `${C.yellow}⚠ WARN${C.reset}`
        : `${C.green}✔ PASS${C.reset}`;

    console.log(`\n${C.bold}${file.rel}${C.reset}  ${status}`);
    for (const r of results) {
      if (r.ok === true)  console.log(pass(r.msg));
      if (r.ok === false) console.log(fail(r.msg));
      if (r.ok === null)  console.log(warn(r.msg));
    }
  }

  // ── Final summary line ────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(60));
  console.log(`${C.bold}TOTAL:${C.reset}  ${C.green}${totalPass} PASS${C.reset}  |  ${C.red}${totalFail} FAIL${C.reset}  |  ${C.yellow}${totalWarn} WARN${C.reset}`);

  if (totalFail === 0) {
    console.log(`\n${C.bold}${C.green}✔ All checks passed — safe to publish.${C.reset}`);
  } else {
    console.log(`\n${C.bold}${C.red}✖ ${totalFail} check(s) failed — fix before publishing.${C.reset}`);
  }
  console.log('');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log(head('═══════════════════════════════════════════════'));
  console.log(head(' QA Validator — Sources of Inspiration in Art  '));
  console.log(head('═══════════════════════════════════════════════'));

  const files = collectLessonFiles();
  if (files.length === 0) {
    console.log(fail('No lesson HTML files found in public/ or public/lessons/'));
    process.exit(1);
  }

  console.log(grey(`\nScanning ${files.length} file(s)...\n`));

  const allFilesResults = [];
  for (const file of files) {
    const results = validateFile(file);
    allFilesResults.push({ file, results });
  }

  printSummary(allFilesResults);

  const anyFail = allFilesResults.some(({ results }) => results.some(r => r.ok === false));
  process.exit(anyFail ? 1 : 0);
}

main();
