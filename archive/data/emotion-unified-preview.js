/* Separate six-stage preview. Published source lessons remain unchanged. */
window.UNIFIED_LESSON = {
  title: {
    he: 'רגש כמקור השראה לציור מופשט',
    en: 'Emotion as a Source for Abstract Painting'
  },
  description: {
    he: 'נחקור איך רגש יכול להפוך לצבע, לקו ולכתם. נתבונן ביצירות וניצור ציור מופשט מתוך תחושה אישית.',
    en: 'Explore how a feeling becomes colour, line and shape. Look at artworks and create an abstract painting inspired by a personal emotion.'
  },
  time: { he: '45 דקות', en: '45 min' },
  materials: {
    he: 'נייר או יומן חזותי, עיפרון וצבעים לבחירה',
    en: 'Paper or a visual journal, a pencil and colours of your choice'
  },
  stages: [
    {
      id: 'opening',
      label: { he: 'פתיחה', en: 'Opening' },
      heading: { he: 'איך רגש הופך לציור?', en: 'How does a feeling become a painting?' },
      paragraphs: [
        {
          he: 'בשיעור זה נשתמש ברגש כמקור השראה. נעבוד עם כתמי צבע, לא דמויות, לא אובייקטים. רק צבע, תחושה ויחסים.',
          en: 'In this lesson we use emotion as a source of inspiration. Color patches, no figures, no objects. Only color, sensation, and relationships.'
        },
        {
          he: 'נתבונן ביצירה, נבחר רגשות וצבעים, וניצור ציור אישי על הדף.',
          en: 'We will look at an artwork, choose feelings and colours, and create a personal painting on paper.'
        }
      ]
    },
    {
      id: 'look',
      label: { he: 'מתבוננים', en: 'Look' },
      heading: { he: 'מארק רות\'קו', en: 'Mark Rothko' },
      artwork: {
        src: 'images/rothko-colorfield.jpg',
        alt: {
          he: 'ציור שדות צבע של מארק רות\'קו',
          en: 'Mark Rothko, color field painting'
        },
        caption: {
          he: 'מארק רות\'קו, ללא כותרת (סגול, שחור, כתום, צהוב…), 1949',
          en: 'Mark Rothko, Untitled (Violet, Black, Orange, Yellow…), 1949'
        }
      },
      paragraphs: [
        {
          he: 'רותקו עבד כך. העוצמה בציוריו נובעת מהיחסים בין הכתמים, לא ממה שהם מציגים.',
          en: 'Rothko worked this way. The power in his paintings comes from the relationships between the patches, not from what they depict.'
        }
      ],
      prompts: [
        { he: 'איזה כתם מושך את תשומת הלב שלכם קודם?', en: 'Which patch catches your attention first?' },
        { he: 'איזו תחושה מעוררים בכם הצבעים והמרווחים ביניהם?', en: 'What feeling do the colours and the spaces between them bring to mind?' }
      ],
      extensions: [
        {
          title: { he: 'הרחבה למורה: שני המקורות', en: 'Teacher extension: the two sources' },
          paragraphs: [
            {
              he: 'השיעור האינטראקטיבי מתמקד ביחסים בין כתמי צבע. במערך הוותיק יש גם דוגמאות של מונק ורות\'קו ותרגיל חלופי בשם מפת הרגשות. אפשר לעיין בהם במקור.',
              en: 'The interactive lesson focuses on relationships between colour patches. The earlier lesson also includes Munch and Rothko examples and an alternative Emotion Map exercise. Both sources remain available.'
            }
          ],
          links: [
            { label: { he: 'לשיעור האינטראקטיבי המקורי', en: 'Original interactive lesson' }, href: 'lesson-1-1.html' },
            { label: { he: 'למערך הוותיק המלא', en: 'Full earlier lesson' }, href: 'lesson-02.html' }
          ]
        }
      ]
    },
    {
      id: 'principle',
      label: { he: 'מגלים עיקרון', en: 'Discover a principle' },
      heading: { he: 'הציור נבנה בין הכתמים.', en: 'The painting is built between the patches.' },
      paragraphs: [
        {
          he: 'התחילו מהרגש ובדקו איזה קו, כתם או צבע הוא מעורר בכם.',
          en: 'Start with the feeling. Explore the lines, marks, or colours it brings to mind.'
        },
        { he: 'לכל רגש, צבע אחד.', en: 'One color for each emotion.' }
      ],
      prompts: [
        {
          he: 'מה יכול להשתנות כשכתמים נוגעים, מתרחקים או מתערבבים?',
          en: 'What might change when patches touch, move apart or blend?'
        }
      ]
    },
    {
      id: 'experiment',
      label: { he: 'מתנסים', en: 'Experiment' },
      heading: { he: 'בחרו 3–4 רגשות שנוכחים עכשיו.', en: 'Choose 3–4 emotions present right now.' },
      paragraphs: [
        { he: 'הם יהיו מקור ההשראה שלכם.', en: 'They will be your source of inspiration.' },
        {
          he: 'בחרו צבע אחד לכל רגש. נסו את הצבעים ככתמים קטנים על דף לפני שתתחילו את הציור.',
          en: 'Choose one colour for each feeling. Try the colours as small patches on paper before starting your painting.'
        }
      ],
      interaction: 'emotion',
      prompts: [
        { he: 'איזה קו, כתם או צבע מתאים לתחושה שלכם?', en: 'Which line, mark or colour fits your feeling?' }
      ]
    },
    {
      id: 'create',
      label: { he: 'יוצרים', en: 'Create' },
      heading: { he: 'הניחו את הכתם הראשון על הדף.', en: 'Place the first patch on the page.' },
      paragraphs: [
        {
          he: 'הניחו את הכתם במקום שבחרתם, בלי לתכנן מראש את כל הציור.',
          en: 'Place the mark where you choose, without planning the whole drawing in advance.'
        }
      ],
      checklist: [
        { he: 'הוסיפו את שאר הכתמים.', en: 'Add the rest of the patches.' },
        {
          he: 'בחרו מיקום: במרכז או בצד, קרוב לכתם אחר או רחוק ממנו.',
          en: 'Choose a position: in the centre or at the edge, close to another mark or farther away.'
        },
        { he: 'אל תעצרו בין כתם לכתם.', en: 'Don\'t stop between patches.' },
        {
          he: 'התבוננו במעברים: איפה צבע מתערבב בצבע אחר, ואיפה נשאר ביניהם גבול ברור?',
          en: 'Look at the transitions. Where do colours blend, and where is the boundary between them clear?'
        }
      ],
      prompts: [
        { he: 'רך או חד', en: 'Soft or sharp' },
        { he: 'זורם או נחתך', en: 'Flowing or cut' },
        { he: 'שקוף או אטום', en: 'Transparent or opaque' }
      ],
      extensions: [
        {
          title: { he: 'אפשרות חלופית: מפת הרגשות שלי', en: 'Alternative: My Emotion Map' },
          paragraphs: [
            {
              he: 'זהו התרגיל מהמערך הוותיק, לבחירה במקום התרגיל עם 3–4 הרגשות. משך התרגיל במקור: 20 דקות.',
              en: 'This exercise comes from the earlier lesson and can replace the exercise with 3–4 feelings. Original exercise duration: 20 minutes.'
            }
          ],
          list: [
            {
              he: 'בחרי רגש אחד שחזק בך עכשיו (שמחה, עצב, תסכול, התרגשות).',
              en: 'Choose one emotion that\'s strong in you right now (joy, sadness, frustration, excitement).'
            },
            {
              he: 'בחרי 2-3 צבעים שמייצגים את הרגש הזה עבורך.',
              en: 'Choose 2-3 colors that represent that emotion for you.'
            },
            {
              he: 'ציירי באופן חופשי, קווים, צורות, מרקמים, ללא נושא ספציפי.',
              en: 'Paint freely, lines, shapes, textures, without a specific subject.'
            },
            {
              he: 'בסוף, כתבי מילה אחת שמתארת את מה שיצרת.',
              en: 'At the end, write one word that describes what you created.'
            },
            { he: 'השווי לרגש שבחרת: האם הם תואמים?', en: 'Compare to the emotion you chose: do they match?' },
            { he: 'תלי את הציור במקום גלוי ליום אחד.', en: 'Hang the painting somewhere visible for one day.' }
          ],
          links: [
            { label: { he: 'לתרגיל במערך המקורי', en: 'Exercise in the original lesson' }, href: 'lesson-02.html' }
          ]
        }
      ]
    },
    {
      id: 'reflect',
      label: { he: 'מתבוננים בתוצאה', en: 'Reflect' },
      heading: { he: 'עצרו. התבוננו.', en: 'Stop. Look.' },
      paragraphs: [
        {
          he: 'הרגש נתן נקודת מוצא. היחסים בין הצבעים והכתמים עזרו לבנות את הציור.',
          en: 'The feeling gave you a starting point. Relationships between colours and marks helped you build the painting.'
        }
      ],
      prompts: [
        { he: 'מי נוגע, מי מתערבב ומי נפרד?', en: 'Which patches touch, blend or separate?' },
        { he: 'איזה רגש הכי קשה לך לבטא בציור?', en: 'Which emotion is hardest for you to express in painting?' },
        { he: 'מה גיליתם ומה תרצו לנסות בציור הבא?', en: 'What did you discover, and what would you like to try in your next painting?' }
      ],
      interaction: 'reflection'
    }
  ],
  emotions: [
    { id: 'heavy', label: { he: 'כבד', en: 'Heavy' } },
    { id: 'calm', label: { he: 'רגוע', en: 'Calm' } },
    { id: 'anxious', label: { he: 'חרדה', en: 'Anxious' } },
    { id: 'tender', label: { he: 'עדינות', en: 'Tender' } },
    { id: 'angry', label: { he: 'כועס', en: 'Angry' } },
    { id: 'lonely', label: { he: 'בודד', en: 'Lonely' } },
    { id: 'hopeful', label: { he: 'תקווה', en: 'Hopeful' } },
    { id: 'confused', label: { he: 'מבולבל', en: 'Confused' } },
    { id: 'proud', label: { he: 'גאווה', en: 'Proud' } },
    { id: 'sad', label: { he: 'עצוב', en: 'Sad' } }
  ],
  sources: [
    { label: { he: 'שיעור 1.1 המקורי: רגש כמקור השראה לציור מופשט', en: 'Original Lesson 1.1: Emotion as a Source for Abstract Painting' }, href: 'lesson-1-1.html' },
    { label: { he: 'המערך הוותיק: רגש כמקור, מהבטן אל הקנבס', en: 'Earlier lesson: Emotion as Source, From Gut to Canvas' }, href: 'lesson-02.html' }
  ]
};
