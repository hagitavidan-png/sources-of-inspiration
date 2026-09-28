/**
 * שאלון למצפוני קבוצות בתל אביב-יפו
 * יוצר טופס Google Forms מלא (כולל דילוג מותנה) + גיליון תשובות.
 *
 * הפעלה:
 * 1. היכנסו ל-https://script.google.com ולחצו "פרויקט חדש".
 * 2. מחקו את מה שיש בעורך והדביקו את כל הקובץ הזה.
 * 3. (אופציונלי) אפשר לשנות את WHATSAPP_LINK למטה.
 * 4. בחרו בפונקציה createForm ולחצו "הפעלה" (Run), ואשרו הרשאות.
 * 5. ב"יומן ביצוע" (Execution log) יופיעו: קישור למילוי, קישור לעריכה וקישור לגיליון התשובות.
 */

// קישור הזמנה לקבוצת הוואטסאפ (chat.whatsapp.com/...) או קישור ישיר למספר (https://wa.me/9725XXXXXXXX)
const WHATSAPP_LINK = 'https://chat.whatsapp.com/EUOjk9FN8PeHu8zRY08g4K';
const LEAFLET_LINK = 'https://na-tel-aviv.github.io/leaflet.html';

const FORM_TITLE = 'שאלון למצפוני קבוצות בתל אביב-יפו';

const INTRO =
  'בחינת צורכי השירות באזור והאפשרות להקמת אזור תל אביב\n\n' +
  'חברים וחברות מצפון יקרים,\n\n' +
  'בתל אביב-יפו פועלות כיום 52 קבוצות במספר מוקדי מפגשים.\n' +
  'מתוך רצון לבחון את צורכי השירות של הקבוצות ואת הדרכים האפשריות לתת להם מענה מתאים, ' +
  'אנו מבקשים לבדוק מה עובד כיום, מה חסר ואיזה מבנה שירות יעזור לקבוצות לשאת את הבשורה בצורה הטובה ביותר.\n\n' +
  'השאלון אינו הצבעה בעד או נגד הקמת אזור חדש. מטרתו לברר מהו מבנה השירות המתאים ביותר.\n\n' +
  'מומלץ למלא את השאלון לאחר דיון במצפון, כך שהתשובות ישקפו ככל האפשר את קול הקבוצה.';

const CLOSING =
  'השירות מתחיל בנו, ויש מקום לקול שלכם.\n' +
  'מוזמנים להצטרף, להקשיב ולחשוב יחד איך לחזק את השירות עבור הקבוצות בתל אביב על מנת לשאת את הבשורה.\n\n' +
  'להצטרפות לקבוצת הוואטסאפ: ' + WHATSAPP_LINK + '\n' +
  'לעלון המידע: ' + LEAFLET_LINK;

function createForm() {
  const form = FormApp.create(FORM_TITLE);
  form
    .setDescription(INTRO)
    .setProgressBar(true)
    .setCollectEmail(false)
    .setAllowResponseEdits(false)
    .setShowLinkToRespondAgain(false)
    .setConfirmationMessage('תודה רבה! התשובות התקבלו.\n\n' + CLOSING);

  // ---------- עמוד 1: פרטי הקבוצה ----------
  form.addSectionHeaderItem().setTitle('פרטי הקבוצה');

  form.addTextItem().setTitle('שם הקבוצה').setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('יום המפגש')
    .setChoiceValues(['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'])
    .setRequired(true);

  form.addTimeItem().setTitle('שעת המפגש');

  form.addTextItem().setTitle('מקום המפגש').setHelpText('כתובת או שם המקום');

  const representation = form.addMultipleChoiceItem()
    .setTitle('האם לקבוצה יש כיום שליח/ה לאזור והאם היא מיוצגת בישיבות אזור מרכז?')
    .setRequired(true);

  // ---------- עמוד 2 (מותנה): קשיים בהשתתפות ----------
  const difficultiesPage = form.addPageBreakItem().setTitle('השתתפות בישיבות האזור');

  form.addCheckboxItem()
    .setTitle('מה מקשה על הקבוצה להשתתף בישיבות האזור?')
    .setHelpText('ניתן לבחור יותר מתשובה אחת')
    .setChoiceValues([
      'גודל ועדת האזור',
      'משך הישיבות',
      'מיקום / מרחק',
      'יום או שעת הישיבה',
      'אין כרגע משרת/ת לתפקיד',
      'חוסר מידע או תקשורת',
      'הקבוצה אינה מרגישה מספיק מחוברת לאזור',
      'הקבוצה אינה מרגישה שהשתתפותה משפיעה',
    ])
    .showOtherOption(true)
    .setRequired(true);

  // ---------- עמוד 3: צורכי השירות ----------
  const needsPage = form.addPageBreakItem().setTitle('צורכי השירות');

  form.addCheckboxItem()
    .setTitle('האם יש תחומים שבהם הקבוצה הייתה רוצה לראות שינוי, שיפור או מענה נוסף?')
    .setHelpText('ניתן לבחור יותר מתשובה אחת')
    .setChoiceValues([
      'תקשורת בין הקבוצות',
      'עידוד ומשיכת חברים לשירות',
      'נגישות והשתתפות בוועדת השליחים',
      'אפשרות הקבוצות להשמיע את קולן ולהשפיע',
      'העברת מידע בין הקבוצות למבנה השירות ובחזרה',
      'H&I – בתי חולים ומוסדות',
      'יחסי ציבור / מידע לציבור',
      'פיתוח חברותא',
      'מידע עבור קבוצות באזור תל אביב-יפו ורשימות פגישות (אתר, ועדת מידע לקבוצות וכדומה)',
      'ספרות',
      'פעילויות ואירועי גיבוש',
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('רוצים להרחיב? (מלל חופשי)');

  form.addMultipleChoiceItem()
    .setTitle('באיזו מידה הקבוצה מרגישה שצורכי השירות שלה מקבלים כיום מענה באזור?')
    .setChoiceValues([
      'במידה רבה מאוד',
      'במידה רבה',
      'באופן חלקי',
      'במידה מועטה',
      'בכלל לא',
      'אין לנו מספיק מידע כדי לענות',
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('האם יש מקום לייעל את השירות ולהקים ועדת שירות נפרדת לעיר תל אביב?')
    .setChoiceValues([
      'כן, בהחלט – תל אביב דורשת מיקוד, משאבים ושירות ייעודיים שלא מקבלים מענה כרגע',
      'אולי, יש לבחון את המשאבים והמוכנות של החברים לשרת',
      'לא, עדיף להשאיר את המצב הקיים ולתקן את הבעיות בתוך האזור הקיים',
      'אין דעה מגובשת / נדרש דיון נוסף בקבוצה',
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('האם מצפון קבוצתכם מעוניין לקחת חלק פעיל בוועדת אזור תל אביב החדשה?')
    .setChoiceValues([
      'כן, נשלח שליח/ה לפגישה הקרובה',
      'נרצה לקיים דיון נוסף במצפון הקבוצה',
      'לא בשלב זה',
    ])
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle('השירות מתחיל בנו')
    .setHelpText(CLOSING);

  // דילוג מותנה: רק מי שאין לו השתתפות קבועה עובר לעמוד הקשיים
  representation.setChoices([
    representation.createChoice('כן, באופן קבוע', needsPage),
    representation.createChoice('יש שליח/ה אך ההשתתפות אינה קבועה', difficultiesPage),
    representation.createChoice('אין כרגע שליח/ה', difficultiesPage),
  ]);

  // גיליון תשובות
  const sheet = SpreadsheetApp.create(FORM_TITLE + ' (תשובות)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('קישור למילוי (לשליחה למצפונים): ' + form.getPublishedUrl());
  Logger.log('קישור לעריכת הטופס: ' + form.getEditUrl());
  Logger.log('גיליון התשובות: ' + sheet.getUrl());
}
