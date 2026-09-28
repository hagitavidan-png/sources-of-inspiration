/**
 * שאלון למצפוני קבוצות בתל אביב-יפו: גרסה מעוצבת (בסגנון עלון ההסבר).
 * הדף עצמו נמצא ב-Index.html; הקובץ הזה מגיש אותו ושומר תשובות ב-Google Sheets.
 *
 * התקנה (פעם אחת):
 * 1. https://script.google.com → פרויקט חדש.
 * 2. הדביקו את הקובץ הזה במקום Code.gs.
 * 3. לחצו + ליד "קבצים" → HTML, קראו לו Index (בלי .html) והדביקו את Index.html.
 * 4. בחרו בפונקציה setup ולחצו "הפעלה". ביומן יופיע קישור לגיליון התשובות.
 * 5. "פריסה" (Deploy) → "פריסה חדשה" → סוג: אפליקציית אינטרנט (Web app).
 *    הפעלה בתור: אני (Me). מי יכול לגשת: כל אחד (Anyone).
 * 6. הקישור שמתקבל (מסתיים ב-/exec) הוא הקישור לשליחה למצפונים.
 */

const TITLE = 'שאלון למצפוני קבוצות · תל אביב-יפו';
const SHEET_NAME = 'תשובות';
const HEADERS = [
  'זמן שליחה',
  'שם הקבוצה',
  'יום המפגש',
  'שעת המפגש',
  'מקום המפגש',
  'שליח/ה וייצוג באזור מרכז',
  'קשיים בהשתתפות',
  'קשיים: אחר',
  'תחומים לשיפור',
  'תחומים: אחר',
  'הרחבה (מלל חופשי)',
  'מידת המענה לצורכי השירות',
  'ועדת שירות נפרדת לתל אביב',
  'השתתפות בוועדת אזור תל אביב',
];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle(TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function setup() {
  const ss = SpreadsheetApp.create(TITLE + ' (תשובות)');
  const sheet = ss.getSheets()[0];
  sheet.setName(SHEET_NAME);
  sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
  sheet.setRightToLeft(true);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', ss.getId());
  Logger.log('גיליון התשובות: ' + ss.getUrl());
}

function submitResponse(r) {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('יש להריץ את setup לפני הפריסה.');

  const row = [
    new Date(),
    clean(r.group),
    clean(r.day),
    clean(r.time),
    clean(r.place),
    clean(r.rep),
    clean(r.difficulties),
    clean(r.difficultiesOther),
    clean(r.areas),
    clean(r.areasOther),
    clean(r.freeText),
    clean(r.needsMet),
    clean(r.separate),
    clean(r.involve),
  ];
  if (!row[1] || !row[5]) throw new Error('חסרים שדות חובה.');

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    SpreadsheetApp.openById(id).getSheetByName(SHEET_NAME).appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return true;
}

// ממיר לטקסט, מגביל אורך ומונע פרשנות של התשובה כנוסחה בגיליון
function clean(v) {
  if (Array.isArray(v)) v = v.join(' | ');
  v = String(v == null ? '' : v).trim().slice(0, 2000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
