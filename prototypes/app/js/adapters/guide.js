/* Adapter: lessons in the "labelled rows" format (the 2.1 independent learner version, window.LESSON_PAGE built by
   tools/build-lesson-data.js) → what the Lesson Player shows. It only reads; the lesson's texts stay where they are.
   Another lesson format gets its own adapter with the same two functions. */
window.AppAdapters = window.AppAdapters || {};
window.AppAdapters.guide = function (D) {
  'use strict';
  var I = window.I18N;
  function block(ref) {
    var b = D.sections[ref[0]] && D.sections[ref[0]].blocks[ref[1]];
    if (!b) throw new Error('lesson ' + D.number + ': no block ' + ref.join('/'));
    return b;
  }
  /* the screen's title: the step's label without its number ("3. זיהוי היחידה" → "זיהוי היחידה") */
  function title(b) { return b.label ? I.tx(b.label).replace(/^\s*\d+\.\s*/, '') : ''; }
  /* the rows of a block, by their kind: do, why, check, checklist, materials (each a list of parts) */
  function rows(b) {
    var out = [];
    (b.guide || []).forEach(function (r) { out.push({ k: r.k || 'row', parts: r.parts || [] }); });
    return out;
  }
  return {
    lesson: { number: D.number, title: D.title, unit: D.unit, unitNum: D.unitNum, time: D.time },
    block: block, title: title, rows: rows
  };
};
