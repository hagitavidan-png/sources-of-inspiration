# QA Checklist — Sources of Inspiration in Art
## Pre-Publish Validation — MANDATORY before every deployment

> **Rule:** These checks must pass before EVERY push to `gh-pages`.  
> No exceptions. No "fix after publish."

---

## Scope — Files that must pass every time

| File | Type |
|------|------|
| `public/lesson.html` | Example lesson (10 screens, bilingual) |
| `public/lessons/personal-experience.html` | Full slide-engine lesson |
| `public/lessons/emotion-drawing.html` | Slide-engine lesson |
| `public/lessons/lesson-01.html` … `lesson-14.html` | Scrollable content lessons |
| `public/lessons/lesson-1-1.html`, `lesson-2-*.html` | Deep-dive lessons |
| `public/lessons/frida-kahlo.html` etc. | Artist lessons |
| Any **new** lesson added in the future | Auto-covered by global CSS/JS |

---

## BLOCK 1 — Layout & CTA Visibility

Run mentally (or via `qa-validator.js`) on every lesson screen before publish.

### ✅ 1.1 — Stage height
- [ ] `#stage` is `position:fixed` with `top` = HUD height, `bottom` = nav-bar height
- [ ] `height: calc(100dvh - HUD - NAV)` is set (dvh = accounts for mobile chrome)
- [ ] `height: calc(100svh - HUD - NAV)` fallback also present
- [ ] No `overflow:visible` on `#stage` that could let content escape

### ✅ 1.2 — CTA button always visible
- [ ] `#next-btn` / `.cta` / `#nav-bar` / `#bar` is `position:fixed; bottom:0`
- [ ] `padding-bottom: env(safe-area-inset-bottom, 0px)` is set on nav-bar (notch devices)
- [ ] CTA is never inside `#stage` — it must be a sibling, not a child
- [ ] CTA does not overlap any screen content

### ✅ 1.3 — Screen content fits inside stage
- [ ] Every `.screen` is `position:absolute; inset:0` — fills stage exactly
- [ ] `.screen` uses `overflow:hidden` (not `overflow:visible`) — stage clips
- [ ] `.screen--scroll` has `overflow-y:auto` + safe bottom padding for scrollable content
- [ ] No `.screen` content exceeds the stage height at any viewport

### ✅ 1.4 — Responsive breakpoints
- [ ] **Mobile portrait** (375×667, 390×844): content fits, CTA visible
- [ ] **Mobile portrait small** (320×568): content fits, CTA visible
- [ ] **Tablet portrait** (768×1024, 810×1080): CTA visible, no overflow
- [ ] **Landscape phone** (height ≤ 580px): short-screen rules kick in (eyebrow/aline hidden)
- [ ] **Desktop** (1280×800+): layout looks correct

### ✅ 1.5 — Typography scaling
- [ ] All `.big`, `h1`, `h2` use `clamp()` — no fixed `px` font sizes on heading level
- [ ] `.sub` uses `clamp()` — shrinks on short viewports
- [ ] No text overflows its container
- [ ] Hebrew line-height is ≥ 1.38 (Heebo needs more space than Latin)

### ✅ 1.6 — Images & artwork
- [ ] `object-fit: contain` — no cropping
- [ ] `max-height: clamp(100px, 38vh, 380px)` — never taller than viewport allows
- [ ] `onerror` fallback present on artwork images
- [ ] Image never pushes CTA off screen

### ✅ 1.7 — Color / emotion grids
- [ ] Color grid (2×3 squares) fully visible above CTA
- [ ] Emotion chip grid scrollable if it overflows (`max-height + overflow-y:auto`)
- [ ] No chip or square clipped by stage edges

---

## BLOCK 2 — Language / Bilingual Validation

### ✅ 2.1 — Hebrew mode (עב active)
- [ ] `html[lang="he"]` is set on `<html>`
- [ ] `body[dir="rtl"]` is set
- [ ] All `.bi-he`, `.instr-he`, `.cap-he`, `.chip-he`, `.timer-sub-he`, `.close-he` are **visible**
- [ ] All `.bi-en`, `.instr-en`, `.cap-en`, `.chip-en`, `.timer-sub-en`, `.close-en` are **hidden**
- [ ] `.instr-divider` (separator between HE/EN blocks) is **hidden**
- [ ] All `[data-he]` elements show Hebrew text
- [ ] HUD back-link, badge, step counter show Hebrew
- [ ] CTA button label is Hebrew
- [ ] Timer buttons (Start/Reset/Finish) show Hebrew labels
- [ ] No English text visible anywhere on screen

### ✅ 2.2 — English mode (EN active)
- [ ] `html[lang="en"]` is set on `<html>`
- [ ] `body[dir="ltr"]` is set
- [ ] All `.bi-en`, `.instr-en`, `.cap-en`, `.chip-en`, `.timer-sub-en`, `.close-en` are **visible**
- [ ] All `.bi-he`, `.instr-he`, `.cap-he`, `.chip-he`, `.timer-sub-he`, `.close-he` are **hidden**
- [ ] All `[data-en]` elements show English text
- [ ] CTA button label is English
- [ ] Timer buttons show English labels
- [ ] No Hebrew text visible anywhere on screen

### ✅ 2.3 — Language toggle
- [ ] Toggle switches cleanly between HE ↔ EN with no visual flash
- [ ] Active language button has gold highlight
- [ ] Language persists via `localStorage` (reload keeps chosen language)
- [ ] `setLang()` calls `applyLang()` which sets `document.documentElement.lang`

### ✅ 2.4 — Intentional bilingual exceptions
- [ ] Opening quote (S1 of example lesson) — both languages shown intentionally ✓
- [ ] Any other screen marked as intentional bilingual — document it here

### ✅ 2.5 — RTL / LTR layout
- [ ] Hebrew: text right-aligned, direction rtl, `.eyebrow` right-aligned
- [ ] English: text left-aligned (center for centered layouts), direction ltr
- [ ] `.aline` margin correct in both directions
- [ ] Progress dots / nav-bar direction flips correctly with RTL

---

## BLOCK 3 — System / Architecture Validation

### ✅ 3.1 — Global CSS injection
- [ ] `lesson-responsive.css` is linked in **every** lesson HTML file
- [ ] Path is correct: `../css/lesson-responsive.css` for `lessons/*.html`
- [ ] Path is correct: `css/lesson-responsive.css` for root `lesson.html`
- [ ] Link appears **after** inline `<style>` so it can override with `!important`

### ✅ 3.2 — No console errors
- [ ] No `404` errors for CSS / JS / image files
- [ ] No JavaScript runtime errors on load
- [ ] No `TypeError` in `applyLang()` or `go()` or timer functions

### ✅ 3.3 — Navigation
- [ ] Back button disabled on screen 1
- [ ] Progress dots correct count and position
- [ ] Keyboard navigation works (Space = advance, Arrow = prev/next, RTL-aware)
- [ ] Swipe navigation works on touch (dx > 55px threshold)

### ✅ 3.4 — Timer (S9 / timer screens)
- [ ] Countdown starts from 20:00
- [ ] Start/Pause/Resume/Reset all work
- [ ] "Finished Drawing" button advances to next screen
- [ ] Timer display never overlaps CTA
- [ ] Timer sub-text obeys language mode

### ✅ 3.5 — New lessons
- [ ] New lesson HTML includes `<link rel="stylesheet" href="../css/lesson-responsive.css"/>`
- [ ] New lesson JS sets `document.documentElement.lang` in `applyLang()`
- [ ] New lesson JS sets `document.body.dir` in `applyLang()`
- [ ] New bilingual text uses `.bi-he`/`.bi-en` (or `data-he`/`data-en`) pattern — never hardcoded both

---

## BLOCK 4 — Pre-Publish Command Sequence

Run this exact sequence before every push:

```bash
# 1. Validate CSS injection in all lesson files
grep -rL "lesson-responsive.css" public/lessons/*.html public/lesson.html
# Expected output: (empty — all files contain the link)

# 2. Check for simultaneous bilingual display bugs in lesson.html
node tools/qa-validator.js
# Expected output: all checks PASS

# 3. Build
npm run build

# 4. Start server and spot-check manually
pm2 start ecosystem.config.cjs
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/lesson.html
# Expected: 200

# 5. Commit and push both branches
git add -A
git commit -m "..."
git push origin main
git checkout gh-pages
# copy updated files
git add -A
git commit -m "..."
git push origin gh-pages
git checkout main
```

---

## BLOCK 5 — Automated Validator

Run before every publish:
```bash
node tools/qa-validator.js
```

The validator (`tools/qa-validator.js`) checks:
- All lesson files include `lesson-responsive.css`
- No lesson file has simultaneous `.bi-he` and `.bi-en` without language-switching logic
- `#stage`, `.screen`, `#nav-bar` / `#bar` structure is present
- `applyLang()` or equivalent sets `html[lang]` attribute
- No `overflow:visible` on `#stage`

---

## Quick Reference — Known Architecture Facts

| Element | Expected value |
|---------|---------------|
| `#hud` height | `52px` (lessons) / `55px` (lesson.html) |
| `#nav-bar` / `#bar` height | `78px` (lessons) / `~70px` (lesson.html: bottom:20px + 50px btn) |
| `#stage top` | HUD height |
| `#stage bottom` | nav-bar height |
| `#stage height` | `calc(100dvh - HUD - NAV)` |
| `.screen` overflow | `hidden` (non-scroll) / `auto` (scroll) |
| Language selector | `html[lang="he"]` / `html[lang="en"]` via JS |
| CSS override order | inline `<style>` → `lesson-responsive.css` (wins with `!important`) |

---

*Last updated: 2026-05-14*  
*Applies to: all lesson files, demo lesson, example lesson, future lessons*
