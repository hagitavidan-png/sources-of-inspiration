/* Languages of the app prototype: the interface's own words (not lesson content), the direction of each language,
   and the language the learner chose (shared with the site and the Studio: localStorage "sourcesLang").
   Arabic is ready in DIR (right to left); its words and content are not translated yet, so it is not offered. */
window.I18N = (function () {
  'use strict';
  var DIR = { he: 'rtl', en: 'ltr', ar: 'rtl' };
  var OFFERED = ['he', 'en'];
  var NAME = { he: 'עברית', en: 'English' };

  /* the interface's words. Taken from the site where it has them; the rest approved for the prototype.
     "proto…" texts mark what the prototype does not have yet (a missing image, a Studio capability) */
  var UI = {
    he: {
      site: 'מקורות השראה באמנות', units: 'יחידות',
      'do': 'מה עושים', why: 'הסבר', check: 'בדיקה עצמית', checklist: 'רשימה לבדיקה', materials: 'חומרים', unit: 'יחידה', lesson: 'שיעור', soon: 'בקרוב', oneOpen: 'שיעור אחד פתוח · {n} בקרוב',
      'continue': 'המשך', back: 'חזרה', done: 'סיימתי', how: 'איך תרצה/י ליצור?', paper: 'על נייר', studio: 'Studio',
      reopen: 'פתח/י שוב ב-Studio', v1: 'גרסה 1', v2: 'גרסה 2', v2missing: 'גרסה 2 עדיין לא נוצרה',
      changeOne: 'שנה/י דבר אחד בלבד', size: 'גודל', direction: 'כיוון', spacing: 'מרווח', openStudio: 'פתח/י ב-Studio',
      gallery: 'היצירות שלי', newAttempt: 'ניסיון חדש', galleryEmpty: 'היצירות שלך יופיעו כאן אחרי שתשמור/י אותן ב-Studio.',
      proto: 'אב־טיפוס', protoImage: 'מקום לתמונה. תתווסף בהמשך.',
      protoKusama: 'חסר פתרון חזותי ליצירה: אין לנו זכות להציג את התמונה.',
      protoS3: 'ב-Studio יש כרגע חזרה ברשת ובמדורג בלבד. שיקוף, סיבוב ושינוי הדרגתי עדיין חסרים (S3).'
    },
    en: {
      site: 'Sources of Inspiration in Art', units: 'Units',
      'do': 'What to do', why: 'Explanation', check: 'Self-check', checklist: 'Checklist', materials: 'Materials', unit: 'Unit', lesson: 'Lesson', soon: 'Coming Soon', oneOpen: '1 lesson open · {n} coming soon',
      'continue': 'Continue', back: 'Back', done: "I'm done", how: 'How would you like to create?', paper: 'On paper', studio: 'Studio',
      reopen: 'Open in Studio', v1: 'Version 1', v2: 'Version 2', v2missing: 'Version 2 has not been created yet',
      changeOne: 'Change one thing only', size: 'Size', direction: 'Rotation', spacing: 'Spacing', openStudio: 'Open in Studio',
      gallery: 'My artworks', newAttempt: 'New attempt', galleryEmpty: 'Your artworks will appear here after you save them in Studio.',
      proto: 'Prototype', protoImage: 'Image placeholder. To be added.',
      protoKusama: 'A visual solution for the work is missing: we have no right to show the image.',
      protoS3: 'The Studio repeats in a grid or offset only. Mirroring, rotation and gradual change are missing (S3).'
    }
  };

  var lang = (function () { try { return localStorage.getItem('sourcesLang'); } catch (e) { return null; } })();
  if (OFFERED.indexOf(lang) < 0) lang = 'he';

  function apply() { document.documentElement.lang = lang; document.documentElement.dir = DIR[lang]; }
  function set(l) {
    if (OFFERED.indexOf(l) < 0) return;
    lang = l; apply();
    try { localStorage.setItem('sourcesLang', l); } catch (e) {}
  }
  /* a word of the interface, with {placeholders} */
  function ui(key, vars) {
    var s = (UI[lang] || UI.he)[key] || UI.he[key] || key;
    Object.keys(vars || {}).forEach(function (k) { s = s.replace('{' + k + '}', vars[k]); });
    return s;
  }
  /* a text of the content ({ he, en, … }) in the current language */
  function tx(v) { return v ? (v[lang] != null ? v[lang] : '') : ''; }
  apply();
  return { ui: ui, tx: tx, set: set, lang: function () { return lang; }, dir: function () { return DIR[lang]; }, offered: OFFERED, name: NAME };
})();
