export const TEACHER = {
  id: 'teacher1',
  name: 'דוד כהן',
  role: 'מורה לאזרחות | מחנך כיתה י\'ג',
  subject: 'אזרחות',
  homeroom: 'י\'ג',
  photo: 'https://i.pravatar.cc/150?img=33',
  email: 'david.cohen@school.edu.il',
};

export const DAYS_HEBREW = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'];
export const WEEK_DATES = ['20/4', '21/4', '22/4', '23/4', '24/4'];

export type AttendanceStatus = 'נוכח' | 'חיסור' | 'איחור';

export interface Student {
  id: number;
  name: string;
  photo: string;
  attendance: AttendanceStatus[];
  grade: number;
  gender: 'M' | 'F';
}

export const STUDENTS: Student[] = [
  { id: 1,  name: 'אביב כהן',       photo: 'https://i.pravatar.cc/150?img=11', gender: 'M', grade: 78, attendance: ['נוכח','נוכח','נוכח','נוכח','נוכח'] },
  { id: 2,  name: 'יובל לוי',       photo: 'https://i.pravatar.cc/150?img=12', gender: 'M', grade: 85, attendance: ['נוכח','נוכח','נוכח','איחור','נוכח'] },
  { id: 3,  name: 'עומר ישראלי',    photo: 'https://i.pravatar.cc/150?img=13', gender: 'M', grade: 62, attendance: ['נוכח','חיסור','נוכח','נוכח','נוכח'] },
  { id: 4,  name: 'ניר שפיר',       photo: 'https://i.pravatar.cc/150?img=14', gender: 'M', grade: 91, attendance: ['נוכח','נוכח','נוכח','נוכח','נוכח'] },
  { id: 5,  name: 'אלון גלזר',      photo: 'https://i.pravatar.cc/150?img=15', gender: 'M', grade: 55, attendance: ['איחור','חיסור','חיסור','נוכח','נוכח'] },
  { id: 6,  name: 'תום שרון',       photo: 'https://i.pravatar.cc/150?img=16', gender: 'M', grade: 74, attendance: ['נוכח','נוכח','איחור','נוכח','נוכח'] },
  { id: 7,  name: 'דניאל מזרחי',    photo: 'https://i.pravatar.cc/150?img=17', gender: 'M', grade: 66, attendance: ['נוכח','נוכח','חיסור','חיסור','נוכח'] },
  { id: 8,  name: 'גל ברק',         photo: 'https://i.pravatar.cc/150?img=18', gender: 'M', grade: 88, attendance: ['נוכח','נוכח','נוכח','נוכח','נוכח'] },
  { id: 9,  name: 'עידו פרץ',       photo: 'https://i.pravatar.cc/150?img=19', gender: 'M', grade: 70, attendance: ['נוכח','איחור','נוכח','נוכח','חיסור'] },
  { id: 10, name: 'רן אלוני',       photo: 'https://i.pravatar.cc/150?img=20', gender: 'M', grade: 79, attendance: ['נוכח','נוכח','נוכח','נוכח','נוכח'] },
  { id: 11, name: 'מיה אברהם',      photo: 'https://i.pravatar.cc/150?img=44', gender: 'F', grade: 94, attendance: ['נוכח','נוכח','נוכח','נוכח','נוכח'] },
  { id: 12, name: 'נועה פרידמן',    photo: 'https://i.pravatar.cc/150?img=45', gender: 'F', grade: 87, attendance: ['נוכח','נוכח','נוכח','נוכח','איחור'] },
  { id: 13, name: 'ליה כץ',         photo: 'https://i.pravatar.cc/150?img=46', gender: 'F', grade: 82, attendance: ['נוכח','נוכח','נוכח','נוכח','נוכח'] },
  { id: 14, name: 'שירה בן-דוד',   photo: 'https://i.pravatar.cc/150?img=47', gender: 'F', grade: 76, attendance: ['נוכח','נוכח','איחור','נוכח','נוכח'] },
  { id: 15, name: 'אורנה ציון',     photo: 'https://i.pravatar.cc/150?img=48', gender: 'F', grade: 90, attendance: ['נוכח','נוכח','נוכח','נוכח','נוכח'] },
  { id: 16, name: 'תמר גולן',       photo: 'https://i.pravatar.cc/150?img=49', gender: 'F', grade: 68, attendance: ['נוכח','חיסור','נוכח','נוכח','נוכח'] },
  { id: 17, name: 'יעל רוזנברג',   photo: 'https://i.pravatar.cc/150?img=50', gender: 'F', grade: 95, attendance: ['נוכח','נוכח','נוכח','נוכח','נוכח'] },
  { id: 18, name: 'דנה קורן',       photo: 'https://i.pravatar.cc/150?img=51', gender: 'F', grade: 73, attendance: ['נוכח','נוכח','נוכח','חיסור','נוכח'] },
  { id: 19, name: 'עדי שלם',        photo: 'https://i.pravatar.cc/150?img=52', gender: 'F', grade: 81, attendance: ['נוכח','נוכח','נוכח','נוכח','נוכח'] },
  { id: 20, name: 'רוני אוחיון',    photo: 'https://i.pravatar.cc/150?img=53', gender: 'F', grade: 59, attendance: ['חיסור','נוכח','נוכח','חיסור','נוכח'] },
];

export const DASHBOARD_TASKS = [
  { id: 1, text: 'שיחת הורים — דניאל מזרחי', due: 'היום', urgent: true, done: false },
  { id: 2, text: 'הגשת דו"ח כיתה לרכזת השכבה', due: '25/4', urgent: true, done: false },
  { id: 3, text: 'תגבור מתמטיקה — רוני אוחיון', due: '27/4', urgent: false, done: false },
  { id: 4, text: 'מילוי שאלון סוציומטרי כיתה', due: '30/4', urgent: false, done: false },
  { id: 5, text: 'ישיבת צוות שכבה', due: '28/4 | 14:00', urgent: false, done: true },
];

export const DASHBOARD_EVENTS = [
  { date: '24/4', text: 'ישיבת מסגרת — 16:00' },
  { date: '28/4', text: 'ישיבת צוות שכבה — 14:00' },
  { date: '1/5', text: 'יום עצמאות — אין לימודים' },
  { date: '5/5', text: 'הגשת ציונים תקופתיים' },
  { date: '8/5', text: 'יום ספורט כיתתי — מגרש' },
];

export const OBSERVATION_SCHEDULE: Record<string, { teacher: string; subject: string; class: string; time: string; topic: string }[]> = {
  '21/4': [
    { teacher: 'שרית לבנה',   subject: 'מתמטיקה', class: 'י\'א', time: '08:00', topic: 'פונקציה ריבועית — שיטת השלמה לריבוע' },
    { teacher: 'אמיר דרור',   subject: 'היסטוריה',  class: 'י\'ב', time: '10:00', topic: 'מלחמת העולם השנייה — האידיאולוגיה הנאצית' },
  ],
  '22/4': [
    { teacher: 'רינת גולן',   subject: 'ספרות עברית', class: 'י\'ד', time: '09:00', topic: 'ביאליק — "הכניסיני תחת כנפך"' },
    { teacher: 'יוסי בן-עמי', subject: 'פיזיקה',     class: 'י\'א', time: '11:00', topic: 'חוקי ניוטון — מעבדה' },
  ],
  '23/4': [
    { teacher: 'שרית לבנה',   subject: 'מתמטיקה', class: 'י\'ג', time: '08:00', topic: 'גיאומטריה — משפט פיתגורס' },
    { teacher: 'דוד כהן',     subject: 'אזרחות',   class: 'י\'ג', time: '10:00', topic: 'זכויות אדם ואזרח — פסיקות בית המשפט' },
  ],
  '24/4': [
    { teacher: 'נעמה ורד',    subject: 'אנגלית',   class: 'י\'ב', time: '09:00', topic: 'Reading Comprehension — Current Events' },
    { teacher: 'אמיר דרור',   subject: 'היסטוריה', class: 'י\'א', time: '12:00', topic: 'קום מדינת ישראל — מנדט בריטי ומלחמת העצמאות' },
  ],
  '27/4': [
    { teacher: 'רינת גולן',   subject: 'ספרות', class: 'י\'ג', time: '08:00', topic: 'עגנון — "והיה העקוב למישור"' },
    { teacher: 'יוסי בן-עמי', subject: 'פיזיקה', class: 'י\'ב', time: '10:00', topic: 'אלקטרומגנטיות — שדה מגנטי' },
  ],
  '28/4': [
    { teacher: 'שרית לבנה',   subject: 'מתמטיקה', class: 'י\'א', time: '09:00', topic: 'טריגונומטריה — סינוס וקוסינוס' },
    { teacher: 'נעמה ורד',    subject: 'אנגלית',   class: 'י\'ג', time: '11:00', topic: 'Writing Skills — Opinion Essay' },
  ],
};

export const SUBSTITUTE_LESSONS = [
  {
    id: 1,
    subject: 'אזרחות',
    topic: 'הכנסת — המבנה, הסמכויות והבחירות',
    class: 'כלל כיתות י',
    duration: '45 דקות',
    level: 'ממוצע',
    components: {
      presentation: { title: 'מצגת: הכנסת', slides: 18, link: '#' },
      video: { title: 'סרטון: "כך עובדת הכנסת" | ערוץ עכשיו', duration: '8:32', link: '#' },
      notebooklm: { title: 'NotebookLM — בוט מומחה לנושא', link: 'https://notebooklm.google.com', note: 'כולל כל חומרי הלמידה של הנושא' },
      resources: ['ספר לימוד: "אזרחות לחטיבה העליונה", עמ\' 45–62', 'אתר הכנסת הרשמי', 'מאמר: "פריווילגיות חברי כנסת" — הארץ'],
      assignments: ['סכמו את סמכויות הכנסת ב-5 נקודות', 'מצאו חוק אחד שעבר לאחרונה — כתבו על תהליך חקיקתו'],
      quiz: ['כמה חברי כנסת יש?', 'מהי תקופת כהונת הכנסת?', 'מה ההבדל בין קריאה ראשונה לשנייה בחקיקת חוק?', 'מי רשאי להגיש הצעת חוק פרטית?'],
    },
  },
  {
    id: 2,
    subject: 'אזרחות',
    topic: 'מערכת המשפט בישראל',
    class: 'כלל כיתות י',
    duration: '45 דקות',
    level: 'ממוצע',
    components: {
      presentation: { title: 'מצגת: בתי המשפט בישראל', slides: 22, link: '#' },
      video: { title: 'סרטון: "ביקור בבית המשפט העליון" | יס', duration: '12:15', link: '#' },
      notebooklm: { title: 'NotebookLM — בוט מומחה למשפט', link: 'https://notebooklm.google.com', note: 'כולל פסיקות ידועות ומושגי מפתח' },
      resources: ['ספר לימוד: עמ\' 80–97', 'אתר בתי המשפט', 'פסק דין: "מזרחי נ\' בנק הפועלים"'],
      assignments: ['צייר את הפירמידה של מערכת המשפט', 'בחר פסק דין ידוע וסכם אותו בפסקה'],
      quiz: ['מה תפקיד בית המשפט העליון?', 'מהו ביקורת שיפוטית?', 'מי ממנה שופטים בישראל?', 'מה ההבדל בין הליך אזרחי לפלילי?'],
    },
  },
];

export const STUDENT_PROFILE = {
  id: 7,
  name: 'דניאל מזרחי',
  photo: 'https://i.pravatar.cc/150?img=17',
  dob: '12 ביוני 2010',
  age: 15,
  class: 'י\'ג',
  address: 'רחוב הזית 12, רמת גן',
  familyStatus: 'הורים גרושים — גר עם אמו',
  parents: [
    { name: 'ריבה מזרחי', role: 'אם', phone: '052-123-4567', email: 'riva.m@gmail.com', custody: 'משמורת עיקרית' },
    { name: 'יוסף מזרחי', role: 'אב', phone: '050-987-6543', email: 'yosef.m@gmail.com', custody: 'ביקורים (סוף שבוע)' },
  ],
  siblings: ['דינה מזרחי — אחות, כיתה ז\'2 (אותו בית ספר)'],
  hobbies: ['כדורגל (מגן בקבוצת העיר)', 'גיטרה חשמלית', 'גיימינג (FIFA, Minecraft)'],
  closeFriends: ['יובל לוי', 'עידו פרץ', 'תום שרון'],
  grades: [
    { subject: 'מתמטיקה (5 יח"ל)', scores: [45, 52, 61], trend: 'up' },
    { subject: 'אנגלית',             scores: [75, 72, 78], trend: 'up' },
    { subject: 'אזרחות',            scores: [85, 88, 92], trend: 'up' },
    { subject: 'היסטוריה',          scores: [68, 65, 70], trend: 'up' },
    { subject: 'ספרות עברית',       scores: [55, 50, 48], trend: 'down' },
    { subject: 'פיזיקה',            scores: [42, 38, 45], trend: 'neutral' },
    { subject: 'חינוך גופני',       scores: [94, 92, 96], trend: 'up' },
    { subject: 'תנ"ך',              scores: [60, 65, 62], trend: 'neutral' },
  ],
  discipline: [
    { date: '15/2/26', type: 'משמעת', desc: 'שימוש בטלפון נייד במהלך שיעור מתמטיקה' },
    { date: '8/3/26',  type: 'משמעת', desc: 'הפרעה חוזרת בשיעור תנ"ך — הוצא מהכיתה' },
    { date: '22/3/26', type: 'חיסור',  desc: 'היעדרות בלתי מוצדקת — יום שלם' },
  ],
  absences: 12,
  lates: 7,
  emotional: {
    date: 'מרץ 2026',
    scores: [
      { label: 'חרדה אקדמית',   value: 7.5, max: 10, alert: true },
      { label: 'חרדה חברתית',   value: 4.0, max: 10, alert: false },
      { label: 'תחושת שייכות',  value: 5.5, max: 10, alert: false },
      { label: 'מוטיבציה',      value: 4.5, max: 10, alert: true },
      { label: 'רווחה כללית',   value: 5.0, max: 10, alert: false },
      { label: 'ביטחון עצמי',   value: 4.0, max: 10, alert: true },
    ],
    aiRecommendations: [
      { icon: '🔴', text: 'מפגש אישי דחוף — רמת חרדה אקדמית גבוהה (7.5/10). מומלץ הפניה ליועצת החינוכית בהקדם.' },
      { icon: '🟡', text: 'תמיכה משפחתית — גירושי ההורים (2024) עלולים להשפיע על יציבות רגשית. לוודא יציבות סביבת הבית.' },
      { icon: '🟡', text: 'תגבור אקדמי — ספרות עברית בירידה מתמשכת (55→48). לארגן תגבור; קשר ישיר לביטחון עצמי נמוך.' },
      { icon: '🟢', text: 'חיזוק חיובי — לציין בפניו הישגים בחינוך גופני ואזרחות; לבנות על נקודות החוזק.' },
      { icon: '🟡', text: 'מעקב נוכחות — 12 חיסורים ו-7 איחורים עד אפריל; לברר האם הדפוס נובע מהבית או מהסביבה בבית הספר.' },
    ],
  },
  tasks: [
    { id: 1, text: 'שיחת הורים — ריבה מזרחי',         status: 'done',    date: 'בוצע 15/3/26' },
    { id: 2, text: 'להשיג תגבור בספרות עברית',         status: 'inprogress', date: 'בתהליך' },
    { id: 3, text: 'שיחה אישית עם דניאל על רגשות',     status: 'pending', date: 'עד 30/4/26' },
    { id: 4, text: 'הפניה ליועצת חינוכית — ד"ר ורד נוי', status: 'pending', date: 'עד 30/4/26' },
    { id: 5, text: 'מעקב שבועי על נוכחות',              status: 'pending', date: 'שוטף' },
  ],
};

export const PAYMENTS = [
  { id: 1,  name: 'אביב כהן',     paid: 1200, total: 1200, date: '3/9/25',  reminders: 0, parent: 'דני כהן',     note: '' },
  { id: 2,  name: 'יובל לוי',     paid: 1200, total: 1200, date: '1/9/25',  reminders: 0, parent: 'אורה לוי',     note: '' },
  { id: 3,  name: 'עומר ישראלי',  paid: 800,  total: 1200, date: '5/10/25', reminders: 2, parent: 'מרים ישראלי',  note: 'יתרה: 400 ₪' },
  { id: 4,  name: 'ניר שפיר',     paid: 1200, total: 1200, date: '2/9/25',  reminders: 0, parent: 'נחמה שפיר',    note: '' },
  { id: 5,  name: 'אלון גלזר',    paid: 0,    total: 1200, date: '',        reminders: 4, parent: 'רות גלזר',     note: 'בקשת פריסה לא נענתה' },
  { id: 6,  name: 'תום שרון',     paid: 1200, total: 1200, date: '10/9/25', reminders: 0, parent: 'גיל שרון',     note: '' },
  { id: 7,  name: 'דניאל מזרחי',  paid: 600,  total: 1200, date: '15/11/25',reminders: 3, parent: 'ריבה מזרחי',   note: 'הורים גרושים — תשלום שנוי במחלוקת' },
  { id: 8,  name: 'גל ברק',       paid: 1200, total: 1200, date: '4/9/25',  reminders: 0, parent: 'תמי ברק',      note: '' },
  { id: 9,  name: 'עידו פרץ',     paid: 1200, total: 1200, date: '8/9/25',  reminders: 0, parent: 'שמעון פרץ',    note: '' },
  { id: 10, name: 'רן אלוני',     paid: 0,    total: 1200, date: '',        reminders: 2, parent: 'חנה אלוני',     note: 'זכאי להנחה — ממתין לאישור' },
  { id: 11, name: 'מיה אברהם',    paid: 1200, total: 1200, date: '1/9/25',  reminders: 0, parent: 'ציפי אברהם',   note: '' },
  { id: 12, name: 'נועה פרידמן',  paid: 1200, total: 1200, date: '3/9/25',  reminders: 0, parent: 'ויקי פרידמן',  note: '' },
  { id: 13, name: 'ליה כץ',       paid: 0,    total: 0,    date: '',        reminders: 0, parent: 'דבורה כץ',     note: 'מלגה מלאה — אושרה 20/8/25' },
  { id: 14, name: 'שירה בן-דוד',  paid: 1200, total: 1200, date: '2/9/25',  reminders: 0, parent: 'יעל בן-דוד',   note: '' },
  { id: 15, name: 'אורנה ציון',   paid: 1200, total: 1200, date: '6/9/25',  reminders: 0, parent: 'מיכל ציון',    note: '' },
  { id: 16, name: 'תמר גולן',     paid: 400,  total: 1200, date: '12/12/25',reminders: 3, parent: 'אמנון גולן',   note: 'הסכם פריסה — 3 תשלומים; שני תשלומים חסרים' },
  { id: 17, name: 'יעל רוזנברג',  paid: 1200, total: 1200, date: '1/9/25',  reminders: 0, parent: 'עידית רוזנברג', note: '' },
  { id: 18, name: 'דנה קורן',     paid: 1200, total: 1200, date: '5/9/25',  reminders: 0, parent: 'לילי קורן',    note: '' },
  { id: 19, name: 'עדי שלם',      paid: 1200, total: 1200, date: '3/9/25',  reminders: 0, parent: 'משה שלם',      note: '' },
  { id: 20, name: 'רוני אוחיון',  paid: 0,    total: 1200, date: '',        reminders: 5, parent: 'אסתר אוחיון',   note: 'קשיים כלכליים — נמסר לרכזת רווחה' },
];

export type Urgency = 'גבוהה' | 'בינונית' | 'נמוכה';
export type SessionType = 'פרטני' | 'טיפולי' | 'מצויינות' | 'אחר';

export interface CounselorReferral {
  studentId: number;
  reason: string;
  urgency: Urgency;
  note: string;
  addedBy: string;
}

export interface SpecialSession {
  id: number;
  studentId: number;
  type: SessionType;
  teacher: string;
  subject: string;
  day: string;
  time: string;
}

export interface SupportBankItem {
  id: number;
  type: SessionType;
  teacher: string;
  subject: string;
  day: string;
  time: string;
  slots: number;
  notes: string;
}

export const COUNSELOR_REFERRALS: CounselorReferral[] = [
  { studentId: 7,  reason: 'קשיים רגשיים ומשפחתיים',     urgency: 'גבוהה',   note: 'דיווח מהורים על מצוקה בבית',              addedBy: 'דוד כהן' },
  { studentId: 5,  reason: 'בעיות משמעת חוזרות',          urgency: 'בינונית', note: '',                                          addedBy: 'דוד כהן' },
  { studentId: 20, reason: 'ירידה בציונים וחיסורים רבים', urgency: 'בינונית', note: 'ייתכן קשיים כלכליים בבית',                 addedBy: 'דוד כהן' },
  { studentId: 3,  reason: 'בידוד חברתי',                 urgency: 'נמוכה',   note: 'מבודד חברתית לאחרונה, לא יוזם קשרים',     addedBy: 'רחל לוי — מחנכת י\'ב' },
];

export const SPECIAL_SESSIONS: SpecialSession[] = [
  { id: 1, studentId: 7,  type: 'טיפולי',    teacher: 'ד"ר מרים ישראלי', subject: 'ייעוץ פסיכולוגי', day: 'שני',    time: '14:00' },
  { id: 2, studentId: 20, type: 'פרטני',     teacher: 'אבי כהן',          subject: 'מתמטיקה',         day: 'שלישי',  time: '15:00' },
  { id: 3, studentId: 3,  type: 'פרטני',     teacher: 'שרה לוי',          subject: 'אנגלית',           day: 'ראשון',  time: '14:30' },
  { id: 4, studentId: 17, type: 'מצויינות',  teacher: 'ד"ר נועם ברק',     subject: 'מדעים',            day: 'חמישי',  time: '13:00' },
  { id: 5, studentId: 4,  type: 'מצויינות',  teacher: 'ד"ר נועם ברק',     subject: 'מדעים',            day: 'חמישי',  time: '13:00' },
  { id: 6, studentId: 5,  type: 'פרטני',     teacher: 'יוסי פרץ',         subject: 'אזרחות',           day: 'רביעי',  time: '14:00' },
];

export const SUPPORT_BANK: SupportBankItem[] = [
  { id: 1, type: 'פרטני',     teacher: 'שרה לוי',           subject: 'מתמטיקה',         day: 'שני',    time: '15:30', slots: 2, notes: 'מתאים לתלמידים עם פערים בחשבון ואלגברה' },
  { id: 2, type: 'טיפולי',    teacher: 'ד"ר מרים ישראלי',   subject: 'ייעוץ',            day: 'שלישי',  time: '16:00', slots: 1, notes: 'טיפול רגשי — בהפניית יועצת בלבד' },
  { id: 3, type: 'מצויינות',  teacher: 'ד"ר נועם ברק',      subject: 'פיזיקה',           day: 'חמישי',  time: '14:00', slots: 3, notes: 'מסלול מצויינות מדעי-טכנולוגי' },
  { id: 4, type: 'אחר',       teacher: 'רחל גולן',          subject: 'כישורי חיים',      day: 'ראשון',  time: '13:30', slots: 4, notes: 'קבוצת עיבוד רגשי שבועית — קבוצה של עד 6 תלמידים' },
  { id: 5, type: 'פרטני',     teacher: 'יוסי פרץ',          subject: 'עברית',            day: 'רביעי',  time: '15:00', slots: 2, notes: '' },
];

export const MEETING_TYPES = [
  'ישיבת צוות שכבה',
  'ישיבת צוות מקצועי',
  'ישיבת הנהלה',
  'ישיבת הורים',
  'ישיבת מסגרת',
  'ועדת השמה',
  'ישיבת מחנכים',
];

export const SAMPLE_MEETING_SUMMARY = {
  type: 'ישיבת צוות שכבה',
  date: '22 באפריל 2026',
  time: '14:00–15:30',
  attendees: ['דוד כהן (מחנך י\'ג)', 'שרית לבנה (מחנכת י\'א)', 'נעמה ורד (מחנכת י\'ב)', 'אמיר דרור (מחנך י\'ד)', 'ד"ר ורד נוי (יועצת שכבה)'],
  topics: [
    'עדכון מצב תלמידים בסיכון — ירידה בנוכחות ובציונים',
    'תוכנית יום המסע השכבתי — 5 ביוני 2026',
    'הכנה לקראת מועד קיץ — מגמות ופערים בשכבה',
    'טיפול בתלמידים עם פערים בתשלומים',
  ],
  decisions: [
    'כל מחנך יגיש רשימת תלמידים בסיכון עד 30/4 ליועצת',
    'יום המסע יתקיים ב-5/6/26 — נושא: "זהות ישראלית"',
    'שיעורי תגבור לקראת הבגרויות יתחילו ב-1/5',
    'תלמידים עם חוב מעל 800 ₪ יעוברו לטיפול מנהלת כספים',
  ],
  actions: [
    { task: 'הגשת רשימת תלמידים בסיכון',       owner: 'כל המחנכים', due: '30/4/26' },
    { task: 'תיאום אוטובוסים ליום המסע',         owner: 'אמיר דרור',  due: '10/5/26' },
    { task: 'עדכון הורים על שיעורי תגבור',       owner: 'דוד כהן',    due: '28/4/26' },
    { task: 'העברת רשימת חייבים למנהלת כספים',   owner: 'ד"ר ורד נוי', due: '25/4/26' },
    { task: 'בניית תוכנית יום המסע',              owner: 'שרית לבנה',  due: '15/5/26' },
  ],
};
