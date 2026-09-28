# CLAUDE.md — מקורות השראה באמנות / Sources of Inspiration in Art

## 🎯 Project Identity

- **Name:** מקורות השראה באמנות / Sources of Inspiration in Art
- **Type:** Interactive bilingual art-learning website & creative course platform
- **Status:** Active development — NOT production-ready yet
- **Stack:** Static HTML/CSS/JS · Hosted on GitHub Pages (`gh-pages` branch)
- **Live URL:** https://hagitavidan-png.github.io/sources-of-inspiration/

---

## 👥 Audience

- Art students (beginners & intermediate)
- School students and teachers
- Adults returning to creativity
- People drawn to intuitive and emotional art processes

---

## 🎨 Visual Direction

- **Style:** Premium · Calm · Elegant · Cinematic · Spacious · Emotional
- **UI Theme:** Modern dark UI with gold accents (`#c9a84c` / `var(--gold)`)
- **Feel:** One coherent premium platform — NOT separate templates stitched together

### Design Rules (Non-Negotiable)
- Never patch pages individually — always build shared/reusable systems
- Spacing must feel generous, breathable, and intentional
- Gold accents are used sparingly and purposefully
- Every component must look premium on both desktop and mobile

---

## 🌐 Bilingual System (Hebrew + English)

- The site is fully bilingual (Hebrew = primary, English = secondary)
- Language is set via `localStorage` key `sourcesLang` (`'he'` or `'en'`)
- `js/app-init.js` sets `<html dir="rtl">` when lang = `'he'` on DOMContentLoaded
- Hebrew mode must support **perfect RTL layout with balanced spacing**
- RTL must never feel compressed or broken — it should feel as premium as LTR
- All new components must be built RTL-first, then tested in LTR

---

## 🗂️ File Structure

```
/
├── index.html          # Homepage — hero, units overview, why, pricing, CTA
├── course.html         # Full course page — all 7 units with lessons
├── teachers.html       # For Teachers & Schools landing page
├── lesson.html         # Preview lesson / sample lesson page
├── css/
│   └── style.css       # SINGLE shared stylesheet — all pages use this
├── js/
│   └── app-init.js     # Language bootstrap + dark mode flash prevention
└── gh-pages branch     # Live site branch (NOT main)
```

---

## 🔧 Technical Rules

### CSS Architecture
- **One shared `css/style.css`** — all global rules live here
- Page-specific styles go in `<style>` blocks inside each HTML file
- RTL rules always follow this order:
  1. Global desktop RTL (outside media queries)
  2. Mobile overrides inside `@media (max-width: 768px)` — these WIN over global
- **Never use `direction: rtl` on centered containers** — it breaks `margin: 0 auto`
- `section-header` is always **centered** (not right-aligned) in RTL — it's a centered component by design

### Nav / Header
- Mobile (`≤768px`): `flex-direction: row` — logo LEFT, actions RIGHT (same in LTR and RTL)
- Desktop: `[dir="rtl"] .nav-inner { flex-direction: row-reverse }` — logo right, actions left
- **Never reverse `.nav-actions`** — only `.nav-inner` reversal is the source of truth

### Hero Backgrounds (Dark Mode)
All hero sections use the same navy gradient in dark mode:
```css
background: linear-gradient(155deg, #0d0d18 0%, #111124 60%, #0f0f1a 100%)
```

### Git / Deploy
- **Working branch:** `gh-pages` (orphan branch — live site)
- **Worktree path:** `/tmp/gh-pages-work`
- Push to `gh-pages` branch to deploy
- No build step — pure static files

---

## ✅ Current Priorities

1. Shared responsive header/navbar — one system across all pages
2. RTL spacing and balance — fix compressed Hebrew layouts
3. Consistent hero sections — unified composition across all pages
4. Unified responsive layout system — shared grid/spacing tokens
5. Mobile experience — clean, balanced, premium on all screen sizes
6. Visual consistency — same typography, spacing, color use everywhere

---

## 🔨 What Still Needs to Be Built

- [ ] Additional course content
- [ ] Complete lesson systems
- [ ] Galleries and image examples
- [ ] Payment / checkout system
- [ ] Marketing pages
- [ ] Teacher and school flows
- [ ] Onboarding and signup flows
- [ ] Mobile responsiveness overhaul
- [ ] CMS / content structure
- [ ] Launch preparation and SEO optimization

---

## 🐛 Known Issues (as of May 2026)

| Area | Problem |
|------|---------|
| RTL spacing | Some sections still compressed in Hebrew mode |
| Hero sections | Composition differs slightly between pages |
| Mobile galleries | Images not always fitting correctly in lesson pages |
| Lesson navigation | No shared end-of-lesson nav system yet |

---

## 🧠 Claude's Working Rules for This Project

1. **Think in systems, not patches.** If fixing one page, ask: should this be a shared component?
2. **RTL is not an afterthought.** Every layout decision must be tested for Hebrew/RTL.
3. **Mobile is not optional.** Every component must be responsive from the start.
4. **Consistency over creativity.** Stick to the established visual language.
5. **CSS cascade awareness.** Later rules win at equal specificity. Media queries must come AFTER global rules to override them.
6. **Never use `!important` unless absolutely necessary** — fix specificity/order instead.
7. **Small steps, tested results.** Make focused changes; don't refactor everything at once.
8. **Commit frequently** with meaningful messages — every fix is a separate commit.

---

## 🚀 Final Goal

A polished, production-ready platform for:
- Marketing and brand presence
- Student enrollment and onboarding
- School and teacher partnerships
- Online course sales

---

*Last updated: May 2026*
