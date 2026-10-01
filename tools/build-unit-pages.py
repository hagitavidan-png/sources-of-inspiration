#!/usr/bin/env python3
"""Build the editorial unit pages (units/unit-00.html … unit-06.html).

All unit and lesson content is read from a frozen copy of course.html
(tools/source/course.html), so nothing is
rewritten by hand. Only presentation lives here: layout, the Hebrew/English
spelling of artist names, and which public-domain images are shown.

Run from the site root:  python3 tools/build-unit-pages.py
"""
import html
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# a frozen copy of course.html (the live course.html becomes a redirect when the new site goes live)
COURSE = open(os.path.join(ROOT, 'tools', 'source', 'course.html'), encoding='utf8').read()

# ── presentation data ─────────────────────────────────────────────
UNITS = {
    'unit00': dict(img='friedrich-wanderer', pos='50% 30%',
                   keys=('ראייה · תפיסה · תשומת לב', 'Seeing · Perception · Attention'),
                   cap=('קספר דוד פרידריך, הנודד מעל ים הערפל, 1818', 'Caspar David Friedrich, Wanderer above the Sea of Fog, 1818')),
    'unit01': dict(img='munch-scream', pos='50% 40%',
                   keys=('רגש · זיכרון · יומן', 'Emotion · Memory · Journal'),
                   cap=('אדוורד מונק, הצעקה, 1893', 'Edvard Munch, The Scream, 1893')),
    'unit02': dict(img='monet-water-lilies', pos='50% 50%',
                   keys=('דפוס · אור · הגדלה · נשגב', 'Pattern · Light · Close-up · Sublime'),
                   cap=('קלוד מונה, שושני מים', 'Claude Monet, Water Lilies')),
    'unit03': dict(img='kandinsky-composition8', pos='40% 50%',
                   keys=('צליל · קצב · תנועה', 'Sound · Rhythm · Movement'),
                   cap=('וסילי קנדינסקי, קומפוזיציה 8, 1923', 'Wassily Kandinsky, Composition VIII, 1923')),
    # no cover image for now: the Haystacks was a prototype placeholder (Monet belongs to unit 06)
    'unit04': dict(img=None,
                   keys=('זיכרון · דיוקן · זהות', 'Memory · Portrait · Identity')),
    # no cover image for now: the Strawberry Thief was a prototype placeholder (it belongs to unit 02)
    'unit05': dict(img=None,
                   keys=('סמל · מסורת · מורשת', 'Symbol · Tradition · Heritage')),
    'unit06': dict(img='turner-snowstorm', pos='55% 50%',
                   keys=('קול · בחירה · דרך', 'Voice · Choice · Path'),
                   cap=('ויליאם טרנר, סופת שלגים, 1842', 'J. M. W. Turner, Snow Storm, 1842')),
}

# canonical key: (he, en, [aliases used in lesson tags])
PEOPLE = {
    'arnheim': ('רודולף ארנהיים', 'Rudolf Arnheim', ['Rudolf Arnheim']),
    'berger': ('ג׳ון ברג׳ר', 'John Berger', ['John Berger']),
    'gestalt': ('פסיכולוגיית הגשטלט', 'Gestalt Psychology', ['Gestalt Psychology']),
    'klee': ('פאול קלה', 'Paul Klee', ['Paul Klee', 'Klee']),
    'albers': ('יוזף אלברס', 'Josef Albers', ['Josef Albers']),
    'kahlo': ('פרידה קאלו', 'Frida Kahlo', ['Frida Kahlo', 'Kahlo']),
    'chagall': ('מארק שאגאל', 'Marc Chagall', ['Marc Chagall', 'Chagall']),
    'munch': ('אדוורד מונק', 'Edvard Munch', ['Edvard Munch', 'Munch']),
    'rothko': ('מארק רותקו', 'Mark Rothko', ['Mark Rothko', 'Rothko']),
    'bourgeois': ('לואיז בורז׳ואה', 'Louise Bourgeois', ['Louise Bourgeois', 'Bourgeois']),
    'hundertwasser': ('פרידנסרייך הונדרטוואסר', 'Friedensreich Hundertwasser', ['Hundertwasser']),
    'vangogh': ('וינסנט ואן גוך', 'Vincent van Gogh', ['Vincent van Gogh', 'Van Gogh']),
    'basquiat': ('ז׳אן-מישל בסקיה', 'Jean-Michel Basquiat', ['Jean-Michel Basquiat', 'Basquiat']),
    'dekooning': ('וילם דה קונינג', 'Willem de Kooning', ['Willem de Kooning']),
    'monet': ('קלוד מונה', 'Claude Monet', ['Claude Monet', 'Monet']),
    'hokusai': ('קצושיקה הוקוסאי', 'Katsushika Hokusai', ['Katsushika Hokusai', 'Hokusai']),
    'okeeffe': ('ג׳ורג׳יה אוקיף', "Georgia O'Keeffe", ["Georgia O'Keeffe", "O'Keeffe"]),
    'turner': ('ויליאם טרנר', 'J. M. W. Turner', ['J.M.W. Turner', 'Turner']),
    'friedrich': ('קספר דוד פרידריך', 'Caspar David Friedrich', ['Caspar David Friedrich', 'Friedrich']),
    'morris': ('ויליאם מוריס', 'William Morris', ['Morris']),
    'pissarro': ('קמיל פיסארו', 'Camille Pissarro', ['Pissarro']),
    'kandinsky': ('וסילי קנדינסקי', 'Wassily Kandinsky', ['Kandinsky']),
    'mondrian': ('פיט מונדריאן', 'Piet Mondrian', ['Piet Mondrian', 'Mondrian']),
    'pollock': ('ג׳קסון פולוק', 'Jackson Pollock', ['Jackson Pollock', 'Pollock']),
    'cornell': ('ג׳וזף קורנל', 'Joseph Cornell', ['Joseph Cornell']),
    'wiley': ('קהינדה ויילי', 'Kehinde Wiley', ['Kehinde Wiley']),
    'hopper': ('אדוארד הופר', 'Edward Hopper', ['Edward Hopper', 'Hopper']),
    'shonibare': ('ינקה שוניברי', 'Yinka Shonibare', ['Yinka Shonibare', 'Shonibare']),   # Hebrew as in the National Library of Israel
    'rauschenberg': ('רוברט ראושנברג', 'Robert Rauschenberg', ['Rauschenberg']),
    'rivera': ('דייגו ריברה', 'Diego Rivera', ['Diego Rivera', 'Rivera']),
    'banksy': ('בנקסי', 'Banksy', ['Banksy']),
    'warhol': ('אנדי וורהול', 'Andy Warhol', ['Andy Warhol', 'Warhol']),
    'picasso': ('פבלו פיקאסו', 'Pablo Picasso', ['Pablo Picasso', 'Picasso']),
    'cezanne': ('פול סזאן', 'Paul Cézanne', ['Paul Cézanne', 'Cézanne']),
    'hockney': ('דייוויד הוקני', 'David Hockney', ['David Hockney', 'Hockney']),
    # unit 2 'Looking outward': the spelling used in the lesson pages
    'kusama': ('יאיוי קוסמה', 'Yayoi Kusama', []),
    'blossfeldt': ('קרל בלוספלדט', 'Karl Blossfeldt', []),
    'steinkamp': ('ג׳ניפר סטיינקמפ', 'Jennifer Steinkamp', []),
    'fankuan': ('פאן קואן', 'Fan Kuan', []),
    'holt': ('ננסי הולט', 'Nancy Holt', []),
    'duchamp': ('מרסל דושאן', 'Marcel Duchamp', []),
    'steir': ('פט סטייר', 'Pat Steir', []),
}
OTHER_TAGS = {'Indigenous Art': 'אמנות ילידית', 'Ancient Egypt': 'מצרים העתיקה', 'Global': 'גלובלי', 'Contemporary': 'עכשווי',
              # tags that course.html has in English only
              'Artist Study': 'לימוד אמן', 'Collection': 'אוסף', 'Colour Layer': 'שכבת צבע', 'Development': 'פיתוח',
              'Focused Practice': 'תרגול ממוקד', 'Journal': 'יומן', 'Line': 'קו', 'Looking': 'התבוננות',
              'Observation': 'התבוננות', 'Reflection': 'רפלקציה', 'Symbolism': 'סמליות', 'Time': 'זמן',
              'Visual Filters': 'מסננים חזותיים'}
ALIAS = {a: k for k, v in PEOPLE.items() for a in v[2]}

# public-domain works on the site, shown in the "inspiration" section
WORKS = {
    ('unit01', 'munch'): ('munch-scream', 'הצעקה, 1893', 'The Scream, 1893'),
    ('unit02', 'hokusai'): ('hokusai-great-wave-1831', 'הגל הגדול מול קנגאווה, 1831', 'The Great Wave off Kanagawa, 1831'),
    ('unit02', 'monet'): ('monet-water-lilies', 'שושני מים', 'Water Lilies'),
    ('unit02', 'turner'): ('turner-snowstorm', 'סופת שלגים, 1842', 'Snow Storm, 1842'),
    ('unit02', 'friedrich'): ('friedrich-wanderer', 'הנודד מעל ים הערפל, 1818', 'Wanderer above the Sea of Fog, 1818'),
    ('unit02', 'morris'): ('morris-strawberry-thief-1883', 'גנב התותים, 1883', 'Strawberry Thief, 1883'),
    ('unit02', 'pissarro'): ('pissarro-boulevard-montmartre-1897', 'שדרת מונמרטר, 1897', 'Boulevard Montmartre, 1897'),
    ('unit03', 'kandinsky'): ('kandinsky-yellow-red-blue', 'צהוב־אדום־כחול, 1925', 'Yellow-Red-Blue, 1925'),
    ('unit06', 'monet'): ('monet-haystacks-1891', 'ערימות שחת, 1891', 'Haystacks, 1891'),
}

DUR = {'Full Session': 'שיעור מלא'}

# lessons that already have a page in the new lesson template
def _lesson_index():
    p = os.path.join(ROOT, 'data', 'lesson-pages', 'index.js')
    if not os.path.exists(p):
        return {}
    import json
    txt = open(p, encoding='utf8').read()
    m = re.search(r'window\.LESSON_PAGES_INDEX = (\{.*?\});', txt, re.S)
    return json.loads(m.group(1)) if m else {}


NEW_LESSON_PAGES = _lesson_index()   # built by tools/build-lesson-data.js


def _lesson_titles():
    """New titles of lessons whose content was rewritten (same source as the drawer and prev / next)."""
    p = os.path.join(ROOT, 'data', 'lesson-pages', 'index.js')
    if not os.path.exists(p):
        return {}
    import json
    m = re.search(r'window\.LESSON_TITLES = (\{.*?\});', open(p, encoding='utf8').read(), re.S)
    return json.loads(m.group(1)) if m else {}


LESSON_TITLES = _lesson_titles()


def _unit_content(uid):
    """Approved unit texts that replace course.html for that unit's page (content/units/unit-NN.json)."""
    p = os.path.join(ROOT, 'content', 'units', 'unit-' + uid[-2:] + '.json')
    if not os.path.exists(p):
        return None
    import json
    return json.load(open(p, encoding='utf8'))


def _lesson_page(path):
    """The approved content of a lesson page (data/lesson-pages/<id>.js): its title and short description."""
    import json
    lp = NEW_LESSON_PAGES.get(path)
    if not lp:
        return None
    txt = open(os.path.join(ROOT, 'data', 'lesson-pages', os.path.basename(lp)[:-5] + '.js'), encoding='utf8').read()
    return json.loads(txt[txt.index('window.LESSON_PAGE = ') + len('window.LESSON_PAGE = '):].rstrip().rstrip(';'))


# ── helpers ───────────────────────────────────────────────────────
def a(tag, name):
    m = re.search(r'\b' + name + r'="([^"]*)"', tag)
    return html.unescape(m.group(1)) if m else None


def bil(block, cls):
    m = re.search(r'class="' + cls + r'"', block)
    if not m:
        return None
    start = block.rfind('<', 0, m.start())
    head = block[start:start + 4000]
    return {'he': a(head, 'data-he'), 'en': a(head, 'data-en')}


def strip_tags(s):
    return re.sub(r'<[^>]+>', '', s or '').strip()


def no_emoji(s):
    return re.sub(r'^[^\w֐-׿✦]+', '', s or '').strip()


def esc(s):
    return html.escape(s or '', quote=True)


def t(he, en, tag='span', cls='', extra=''):
    c = f' class="{cls}"' if cls else ''
    return f'<{tag}{c}{extra} data-he="{esc(he)}" data-en="{esc(en)}">{esc(he)}</{tag}>'


def dur_he(d):
    if not d:
        return ''
    if d in DUR:
        return DUR[d]
    return d.replace(' min', ' דקות')


def tag_text(tg):
    """Lesson tags: translate artist names so Hebrew mode shows Hebrew only."""
    he, en = tg['he'], tg['en']
    if he == en:
        parts = [p.strip() for p in he.split('·')]
        he = ' · '.join(PEOPLE[ALIAS[p]][0] if p in ALIAS else OTHER_TAGS.get(p, p) for p in parts)
    return he, en


def apply_fix(u, f):
    """An approved text correction inside a unit's lessons and approaches (content/units/unit-NN.json, 'fixes').
    Optional 'lesson' (its number) and 'field' (title, cap, sub, desc, tags, approach) narrow where it applies;
    each language's text must be found, and 'count' (Hebrew) must match when given, or the build stops."""
    for lang in ('he', 'en'):
        if lang not in f:
            continue
        old, new = f[lang]
        targets = []
        for l in u['lessons']:
            if f.get('lesson') and l['num'] != f['lesson']:
                continue
            targets += [l[k] for k in ('title', 'cap', 'sub', 'desc') if l.get(k) and f.get('field') in (None, k)]
            if f.get('field') in (None, 'tags'):
                targets += l['tags']
        if not f.get('lesson') and f.get('field') in (None, 'approach'):
            targets += u['approach']
        n = 0
        for d in targets:
            if d.get(lang) and old in d[lang]:
                n += d[lang].count(old)
                d[lang] = d[lang].replace(old, new)
        assert n > 0 and (lang != 'he' or f.get('count', n) == n), ('fix not applied as expected', u['id'], f, lang, n)


# ── parse course.html ─────────────────────────────────────────────
def parse():
    out = []
    for p in re.split(r'(?=<section class="unit-section" id="unit0\d")', COURSE)[1:]:
        uid = re.match(r'<section class="unit-section" id="(unit0\d)"', p).group(1)
        p = p[:p.find('</section>')]
        h2 = re.search(r'<h2 ', p)
        head = p[h2.start():h2.start() + 2000]
        u = dict(id=uid, num=uid[-2:],
                 title={'he': strip_tags(a(head, 'data-he')), 'en': strip_tags(a(head, 'data-en'))},
                 desc=bil(p, 'unit-desc'))
        cnt = re.search(r'unit-lesson-count.*?<span ([^>]*)>', p, re.S)
        u['count'] = {'he': a(cnt.group(1), 'data-he'), 'en': a(cnt.group(1), 'data-en')} if cnt else None
        lab = bil(p, 'approach-label')
        u['approach_label'] = {k: v.rstrip(':').strip() for k, v in lab.items()} if lab else None
        u['approach'] = [{'he': no_emoji(a(x, 'data-he')), 'en': no_emoji(a(x, 'data-en'))}
                         for x in re.findall(r'<span class="approach-tag"[^>]*>', p)]
        # artists / thinkers list
        asl = re.search(r'class="as-label" data-en="([^"]*)" data-he="([^"]*)"', p)
        u['people_label'] = {'en': html.unescape(asl.group(1)), 'he': html.unescape(asl.group(2))} if asl else None
        names = [html.unescape(re.sub(r'<span class="as-emoji">.*?</span>\s*', '', x)).strip()
                 for x in re.findall(r'<span class="as-pill">(.*?)</span>\s*(?=<span class="as-pill">|</div>)', p, re.S)]
        u['people'] = [ALIAS[n] for n in names if n in ALIAS]
        lessons = []
        for r in re.split(r'(?=<div class="lesson-row)', p)[1:]:
            cls = re.match(r'<div class="lesson-row ?([^"]*)"', r).group(1)
            num = re.search(r'class="lr-num"[^>]*>([^<]*)<', r)
            title = bil(r, 'lr-title')
            cap = {}
            for k in ('he', 'en'):
                raw = html.unescape(title[k] or '')
                m = re.search(r'<span[^>]*>(.*?)</span>', raw)
                cap[k] = m.group(1).strip() if m else ''
                title[k] = strip_tags(raw)
            tags = []
            for m in re.finditer(r'<span class="lr-tag"([^>]*)>([^<]*)</span>', r):
                at = m.group(1)
                txt = html.unescape(m.group(2))
                tags.append({'he': a(at, 'data-he') or txt, 'en': a(at, 'data-en') or txt})
            dur = re.search(r'class="lr-duration"[^>]*>([^<]*)<', r)
            href = re.search(r'<a href="([^"]*)" class="lr-action"', r)
            lessons.append(dict(open='available' in cls, num=num.group(1).strip() if num else '',
                                title=title, cap=cap, sub=bil(r, 'lr-subtitle'), tags=tags,
                                dur=dur.group(1).strip() if dur else '', desc=bil(r, 'lx-desc'),
                                href=href.group(1) if href and 'available' in cls else None))
        # artists named in lesson tags but not in the unit list
        for l in lessons:
            for tg in l['tags']:
                for part in tg['en'].split('·'):
                    k = ALIAS.get(part.strip())
                    if k and k not in u['people']:
                        u['people'].append(k)
        u['lessons'] = lessons
        for l in lessons:
            path = l['href'] or ''
            if path in LESSON_TITLES:
                l['title'] = LESSON_TITLES[path]
        O = _unit_content(uid)
        u['over'] = O
        if O:
            for f in O.get('fixes', []):
                apply_fix(u, f)
            if O.get('desc'):
                u['desc'] = O['desc']
            if O.get('noApproach'):
                u['approach'] = []
            if O.get('title'):
                u['own_title'] = O['title']   # this unit's own page only; the other units' pages keep their links as they are
            if O.get('noDesc'):
                u['desc'] = None
            if O.get('count'):
                u['count'] = O['count']
            if O.get('journey'):
                # the unit's lessons in their new order, each read from its lesson page
                js = []
                for j in O['journey']:
                    D = _lesson_page(j['path'])
                    js.append(dict(open=True, num=j['num'], title=D['title'], cap={'he': '', 'en': ''}, sub=D['intro'],
                                   tags=[], dur=D['time']['en'], desc=None, href=j['path']))
                u['lessons'] = js
            if O.get('people') is not None:
                u['people'] = [k for k, _ in O['people']]
                u['people_refs'] = dict((k, v) for k, v in O['people'])
        out.append(u)
    return out


# ── render ────────────────────────────────────────────────────────
def lessons_for(u, key):
    nums = []
    for l in u['lessons']:
        for tg in l['tags']:
            if any(ALIAS.get(p.strip()) == key for p in tg['en'].split('·')):
                nums.append(l)
                break
    return nums


def journey_row(l, lo, n, B):
    """A lesson as a station of the unit's journey: number · journey word, title, short description, time."""
    sub = lo.get('sub') or (l['desc'] if l['desc'] and l['desc']['he'] else l['sub']) or {'he': '', 'en': ''}
    dur = lo.get('dur', l['dur'])
    cap = f'<span class="cap">{t(l["cap"]["he"], l["cap"]["en"])}</span>' if l['cap']['he'] else ''
    if l['href']:
        act = f'<a class="ed-cta" href="{B}{NEW_LESSON_PAGES.get(l["href"], l["href"])}">{t("לשיעור", "Open lesson")}<span class="arr" data-he="←" data-en="→">←</span></a>'
    else:
        act = f'<span class="soon">{t("בפיתוח", "In development")}</span>'
    return f'''
      <li class="ls ls-j{'' if l['href'] else ' off'} rv">
        <span class="ls-num">{n:02d}</span>
        <div class="ls-main">
          <p class="ls-step">{t(lo['step']['he'], lo['step']['en'])}</p>
          <h3>{t(l['title']['he'], l['title']['en'])}{cap}</h3>
          <p class="ls-sub">{t(sub['he'], sub['en'])}</p>
        </div>
        <div class="ls-side">
          <span class="ls-dur">{t(dur_he(dur), dur)}</span>
          {act}
        </div>
      </li>'''


# the unit's new name in the contents drawer of its own page (preview only, as on the lesson pages)
UNIT_NAME_JS = '''
<script>((window.ART_NAVIGATION || {}).units || []).forEach(function (u) { var n = (window.UNIT_TITLES || {})[u.id]; if (n) u.title = n; });</script>'''


def render(u, units):
    cfg = UNITS[u['id']]
    cv = (u.get('over') or {}).get('cover')
    if cv:   # an approved cover image for the unit (content/units/unit-NN.json)
        cfg = dict(cfg, img=cv['img'], pos=cv.get('pos', '50% 50%'), cap=(cv['cap']['he'], cv['cap']['en']), wide=cv.get('wide'))
    ko = (u.get('over') or {}).get('keys')
    keys = (ko['he'], ko['en']) if ko else cfg['keys']
    idx = [x['id'] for x in units].index(u['id'])
    prev_u = units[idx - 1] if idx > 0 else None
    next_u = units[idx + 1] if idx < len(units) - 1 else None
    B = '../'

    # inspiration: works
    # works by the unit's artists, skipping the one already shown at the top of the page
    works = [(k,) + WORKS[(u['id'], k)] for k in u['people']
             if (u['id'], k) in WORKS and WORKS[(u['id'], k)][0] != cfg['img'] and not (u.get('over') or {}).get('noWorks')]
    works_html = ''
    for k, img, whe, wen in works[:4]:
        he, en, _ = PEOPLE[k]
        works_html += f'''
        <figure class="work rv">
          <div class="work-img"><img src="{B}images/editorial/{img}.jpg" alt="{esc(en + ', ' + wen)}" loading="lazy"></div>
          <figcaption>{t(he, en, 'b')}{t(whe, wen, 'span')}</figcaption>
        </figure>'''

    people_html = ''
    for k in u['people']:
        he, en, _ = PEOPLE[k]
        refs = lessons_for(u, k)
        if u.get('people_refs'):
            refs = [l for l in u['lessons'] if l['href'] in u['people_refs'].get(k, [])]
        ref_html = ''
        if refs:
            links = []
            for l in refs:
                if l['href']:
                    href = NEW_LESSON_PAGES.get(l['href'], l['href']) if u.get('people_refs') else l['href']
                    links.append(f'<a href="{B}{href}">{l["num"]}</a>')
                else:
                    links.append(f'<span>{l["num"]}</span>')
            ref_html = f'<span class="p-ref">{t("שיעור", "Lesson", "span")} {" · ".join(links)}</span>'
        people_html += f'<li>{t(he, en, "span", "p-name")}{ref_html}</li>'

    insp = ''
    if u['people']:
        pl = u['people_label'] or {'he': 'אמנים ביחידה', 'en': 'Artists in this unit'}
        ov = u.get('over') or {}
        ih = ov.get('inspirationTitle') or {'he': 'מקורות השראה ורקע על האמנים', 'en': 'Sources of inspiration and the artists'}
        insp = f'''
  <section class="u-sec ed-wrap" id="inspiration">
    <div class="u-sec-head rv">
      <span class="step">{t('השראה', 'Inspiration')}</span>
      <h2 class="ed-display">{t(ih['he'], ih['en'])}</h2>
    </div>
    {'<div class="works">' + works_html + '</div>' if works_html else ''}
    <div class="people rv">
      {'' if ov.get('noPeopleLabel') else '<p class="ed-kicker">' + t(pl['he'], pl['en']) + '</p>'}
      <ul>{people_html}</ul>
    </div>
  </section>'''

    look = ''
    if u['approach']:
        al = u['approach_label'] or {'he': 'גישות', 'en': 'Approaches'}
        items = ''.join(f'<li>{t(x["he"], x["en"])}</li>' for x in u['approach'])
        look = f'''
  <section class="u-sec ed-wrap" id="looking">
    <div class="u-sec-head rv">
      <span class="step">{t('התבוננות', 'Looking')}</span>
      <h2 class="ed-display">{t(al['he'], al['en'])}</h2>
    </div>
    <ol class="approach rv">{items}</ol>
  </section>'''

    rows = ''
    LO = (u.get('over') or {}).get('lessons') or {}
    for k, l in enumerate(u['lessons']):
        lo = LO.get(l['href'] or '')
        if lo is not None:
            rows += journey_row(l, lo, k + 1, B)
            continue
        sub = l['sub'] or {'he': '', 'en': ''}
        cap = f'<span class="cap">{t(l["cap"]["he"], l["cap"]["en"])}</span>' if l['cap']['he'] else ''
        tags = ' · '.join(t(*tag_text(tg)) for tg in l['tags'])
        if l['href']:
            act = f'<a class="ed-cta" href="{B}{NEW_LESSON_PAGES.get(l["href"], l["href"])}">{t("לשיעור", "Open lesson")}<span class="arr" data-he="←" data-en="→">←</span></a>'
        else:
            act = f'<span class="soon">{t("בפיתוח", "In development")}</span>'
        desc = ''
        if l['desc'] and l['desc']['he']:
            desc = f'<details><summary>{t("על השיעור", "About this lesson")}</summary><p>{t(l["desc"]["he"], l["desc"]["en"], "span")}</p></details>'
        rows += f'''
      <li class="ls{'' if l['href'] else ' off'} rv">
        <span class="ls-num">{l['num']}</span>
        <div class="ls-main">
          <h3>{t(l['title']['he'], l['title']['en'])}{cap}</h3>
          <p class="ls-sub">{t(sub['he'], sub['en'])}</p>
          {f'<p class="ls-tags">{tags}</p>' if tags else ''}
          {desc}
        </div>
        <div class="ls-side">
          <span class="ls-dur">{t(dur_he(l['dur']), l['dur'])}</span>
          {act}
        </div>
      </li>'''

    count = u['count'] or {'he': '', 'en': ''}

    def unit_link(x, direction):
        if not x:
            return '<span></span>'
        arr_he = '→' if direction == 'prev' else '←'
        arr_en = '←' if direction == 'prev' else '→'
        lab = ('היחידה הקודמת', 'Previous unit') if direction == 'prev' else ('היחידה הבאה', 'Next unit')
        a_he = f'{arr_he} {lab[0]}' if direction == 'prev' else f'{lab[0]} {arr_he}'
        a_en = f'{arr_en} {lab[1]}' if direction == 'prev' else f'{lab[1]} {arr_en}'
        return f'''<a class="un un-{direction}" href="unit-{x['num']}.html">
          {t(a_he, a_en, 'span', 'un-lab')}
          <span class="un-t"><span class="un-n">{x['num']}</span>{t((x.get('own_title') or x['title'])['he'], (x.get('own_title') or x['title'])['en'])}</span>
        </a>'''

    # the cover image (a unit without one goes straight from the title to the description)
    fig_html = (f'''    <figure class="u-fig">
      <div class="u-img rv-img">{f'<picture><source media="(min-width:821px)" srcset="{B}images/editorial/{cfg["wide"]}.jpg">' if cfg.get('wide') else ''}<img src="{B}images/editorial/{cfg['img']}.jpg" alt="{esc(cfg['cap'][1])}" style="object-position:{cfg['pos']}" fetchpriority="high">{'</picture>' if cfg.get('wide') else ''}</div>
      <figcaption>{t(*cfg['cap'])}</figcaption>
    </figure>
''' if cfg['img'] else '')
    return f'''<!DOCTYPE html>
<html lang="he" dir="rtl" translate="no" class="notranslate">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="google" content="notranslate">
<title>{esc((u.get('own_title') or u['title'])['he'])} · מקורות השראה באמנות</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Assistant:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{B}css/design-system.css?v=6">
<link rel="stylesheet" href="{B}css/unit-page.css?v={3 if u.get('over') else 2}">
</head>
<body class="ed" data-unit="{u['id']}">
<script src="{B}js/app-init.js?v=20260927-structure"></script>
<script>document.body.classList.remove('dark');</script>

<header class="ed-top" id="top">
  <div class="ed-wrap">
    <a class="ed-brand" href="{B}index.html" data-he="מקורות השראה" data-en="Sources of Inspiration">מקורות השראה</a>
    <nav class="ed-nav">
      <a href="{B}index.html#journey" data-he="יחידות" data-en="Units">יחידות</a>
      <a href="{B}index.html#about" data-he="אודות" data-en="About">אודות</a>
    </nav>
    <span class="ed-spacer"></span>
    <div class="ed-lang">
      <button id="btn-he" onclick="setLang('he')">עברית</button><i>/</i><button id="btn-en" onclick="setLang('en')">English</button>
    </div>
  </div>
</header>

<main>
  <section class="u-head ed-wrap">
    <p class="crumb rv"><a href="{B}index.html#journey" data-he="יחידות" data-en="Units">יחידות</a> <span>/</span> <span>{u['num']}</span></p>
    <div class="u-title-row rv">
      <span class="ed-num u-num">{u['num']}</span>
      <div>
        <p class="ed-kicker">{t('יחידה ' + u['num'], 'Unit ' + u['num'])}</p>
        <h1 class="ed-display u-title">{t((u.get('own_title') or u['title'])['he'], (u.get('own_title') or u['title'])['en'])}</h1>
        <p class="u-keys">{t(*keys)}</p>
      </div>
    </div>
{fig_html}    <div class="u-intro rv">
      {f'<p class="u-desc">{t(u["desc"]["he"], u["desc"]["en"])}</p>' if u['desc'] else ''}
      <div class="u-aside">
        <p class="u-count">{t(count['he'], count['en'])}</p>
        <ol class="flow" aria-label="{esc('השראה, התבוננות, רעיון, יצירה')}">
          <li>{t('השראה', 'Inspiration')}</li>
          <li>{t('התבוננות', 'Looking')}</li>
          <li>{t('רעיון', 'Idea')}</li>
          <li>{t('יצירה', 'Artwork')}</li>
        </ol>
      </div>
    </div>
  </section>
{insp}
{look}
  <section class="u-sec ed-wrap" id="lessons">
    <div class="u-sec-head rv">
      <span class="step">{t('רעיון ויצירה', 'Idea and artwork')}</span>
      <h2 class="ed-display">{t('השיעורים', 'Lessons')}</h2>
    </div>
    <ol class="lessons">{rows}
    </ol>
  </section>

  <nav class="unit-nav ed-wrap" aria-label="{esc('ניווט בין יחידות')}">
    {unit_link(prev_u, 'prev')}
    {unit_link(next_u, 'next')}
  </nav>
</main>

<footer class="ed-foot">
  <div class="ed-wrap">
    <span data-he="© 2025 מקורות השראה באמנות" data-en="© 2025 Sources of Inspiration in Art">© 2025 מקורות השראה באמנות</span>
    <span class="ed-spacer"></span>
    <a href="{B}privacy.html" data-he="מדיניות פרטיות" data-en="Privacy Policy">מדיניות פרטיות</a>
    <a href="{B}terms.html" data-he="תנאי שימוש" data-en="Terms of Use">תנאי שימוש</a>
  </div>
</footer>

<script src="{B}js/site-nav.js"></script>
<script src="{B}js/site-drawer.js?v=8" data-base="{B}"></script>
<script src="{B}js/editorial.js?v=1"></script>
</body>
</html>
'''


def main():
    units = parse()
    os.makedirs(os.path.join(ROOT, 'units'), exist_ok=True)
    for u in units:
        path = os.path.join(ROOT, 'units', f'unit-{u["num"]}.html')
        open(path, 'w', encoding='utf8').write(render(u, units))
        print('wrote', os.path.relpath(path, ROOT), len(u['lessons']), 'lessons,', len(u['people']), 'people')


if __name__ == '__main__':
    main()
