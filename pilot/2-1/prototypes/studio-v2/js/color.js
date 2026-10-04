/* Tool: color. Seven basic colours and "another colour" (the device's colour picker).
   The chosen colour is what the next line is drawn in (draw) or the next area is filled with (fill). */
Studio.register('color', {
  strings: {
    he: { color: 'צבע', custom: 'צבע נוסף', colors: 'צבעים' },
    en: { color: 'Colour', custom: 'Another colour', colors: 'Colours' }
  },
  init: function (S) {
    'use strict';
    var COLORS = ['#2b2a28', '#c8423b', '#e08a2e', '#e9c33f', '#5d8a4f', '#2f6fa8', '#6b4f9a'];
    var st = S.state;
    st.color = COLORS[0];
    if (!S.has('draw') && !S.has('fill')) console.warn('Studio: the colour tool needs the draw or fill tool in the same activity');

    S.item({ id: 'color', order: 20, label: 'color', panel: 'colorPanel',
      icon: '<i class="swatch-dot" id="colorDot" aria-hidden="true"></i>',
      onClick: function () { S.togglePanel('colorPanel', 'color'); },
      update: function () { S.$('colorDot').style.background = st.color; } });

    var cp = document.createElement('div');
    cp.className = 'panel'; cp.id = 'colorPanel'; cp.hidden = true; cp.setAttribute('role', 'group'); cp.setAttribute('aria-label', S.T.colors);
    COLORS.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'sw'; b.style.background = c; b.setAttribute('aria-label', c); b.dataset.c = c;
      b.addEventListener('click', function () { pick(c); S.closePanels(); });
      cp.appendChild(b);
    });
    var custom = document.createElement('label');
    custom.className = 'sw custom'; custom.title = S.T.custom;
    custom.innerHTML = '<input type="color" aria-label="' + S.T.custom + '" value="#8a9a7b">';
    custom.querySelector('input').addEventListener('input', function (e) { pick(e.target.value); });
    custom.querySelector('input').addEventListener('change', function () { S.closePanels(); });
    cp.appendChild(custom);
    S.stage.appendChild(cp);

    /* choosing a colour also picks up the brush, as in V1 */
    function pick(c) {
      st.color = c;
      if (S.has('draw')) st.tool = 'brush';
      cp.querySelectorAll('.sw').forEach(function (b) { if (b.dataset.c) b.setAttribute('aria-pressed', String(b.dataset.c === c)); });
      S.updateUi();
    }
    this.ready = function () { pick(st.color); };
  }
});
