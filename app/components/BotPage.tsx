'use client';

const CAPABILITIES = [
  {
    icon: '📊',
    title: 'נתוני תלמידים',
    items: [
      'שאל על תלמיד ספציפי לפי שם',
      'קבל סיכום נוכחות ממוצעים וציונים',
      'זיהוי תלמידים בסיכון אקדמי או רגשי',
      'מצב תשלומים לכל תלמיד',
    ],
  },
  {
    icon: '🧭',
    title: 'ניווט מהיר',
    items: [
      '"קח אותי לניהול תשלומים"',
      '"פתח לי תקשורת הורים"',
      '"הצג שיעורי צפייה"',
      '"נווט לפרופיל של [שם תלמיד]"',
    ],
  },
  {
    icon: '💬',
    title: 'תקשורת הורים',
    items: [
      'סיכום הודעות נכנסות ופניות פתוחות',
      'מצב מענה אוטומטי השבוע',
      'פנייה לכתיבת הודעה לקבוצה',
      'בדיקת פניות ממתינות לטיפול',
    ],
  },
  {
    icon: '📈',
    title: 'ניתוח כיתה',
    items: [
      'ממוצע כיתה ומגמות ציונים',
      'רשימת מצטיינים ודורשי תגבור',
      'סיכום חיסורים ואיחורים',
      'תמונה כוללת לפני ישיבת צוות',
    ],
  },
  {
    icon: '📝',
    title: 'ניהול שוטף',
    items: [
      'סיכום ישיבה אחרונה ומשימות פתוחות',
      'רשימת שיעורים הפתוחים לצפייה',
      'מצב מאגר מילוי מקום',
      'מצב משימות הערכה ופערי כיתה',
    ],
  },
];

const EXAMPLES = [
  { q: 'מי מהתלמידים לא שילם?', tag: 'שאילתה' },
  { q: 'מה מצב הנוכחות היום?', tag: 'שאילתה' },
  { q: 'מי התלמידים שבסיכון?', tag: 'שאילתה' },
  { q: 'מה המצב של דניאל מזרחי?', tag: 'שאילתה' },
  { q: 'קח אותי לדף הצפייה בשיעורים', tag: 'ניווט' },
  { q: 'מה היו ההחלטות בישיבה האחרונה?', tag: 'שאילתה' },
];

const ACTION_EXAMPLES = [
  { q: 'דנה קורן ורן אלוני הבריזו משיעור ספורט', tag: 'משמעת', result: 'נרשמים אירועי משמעת בפרופיל כל תלמיד' },
  { q: 'דניאל מזרחי ניהל שיחה עם היועצת היום', tag: 'תיעוד', result: 'נרשמת הערה בפרופיל ומשימה מסומנת כ"בוצע"' },
  { q: 'ההורים של עידו פרץ השלימו את התשלומים השנתיים היום', tag: 'תשלום', result: 'סטטוס התשלום מתעדכן לירוק בטבלה' },
  { q: 'שלח הודעה לקבוצת הורים שיש טיול שנתי בעוד שבועיים וחסרים אישורים', tag: 'הודעה', result: 'מנוסחת הודעה ומועברת לתקשורת הורים מוכנה לשליחה' },
  { q: 'יעל רוזנברג קיבלה פרס על הישגים — שלח ברכות להורים', tag: 'הודעה', result: 'מנוסחת הודעת ברכות אישית להורי יעל' },
  { q: 'אלון גלזר הפריע בשיעור תנ"ך ויצא לדין משמעתי', tag: 'משמעת', result: 'נרשם אירוע משמעת בפרופיל עם הפניה לטיפול' },
];

const TIPS = [
  { icon: '🗣', title: 'דבר בשפה טבעית', desc: 'אין צורך בפקודות מדויקות — אמור בדיוק מה שאתה צריך' },
  { icon: '🎯', title: 'היה ספציפי', desc: 'ציון שם תלמיד או נושא ספציפי יוביל לתשובה מדויקת יותר' },
  { icon: '🔗', title: 'בקש ניווט', desc: '"קח אותי ל..." + שם הפונקציה ינווט אותך מיידית' },
  { icon: '🎤', title: 'קול עובד בדיוק כמו טקסט', desc: 'לחץ הקלט ודבר — הבוט יתמלל ויענה' },
];

export default function BotPage() {
  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="bg-gradient-to-l from-indigo-700 to-blue-600 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-3">🤖</div>
        <h1 className="text-white text-2xl font-bold mb-2">העוזר האישי החכם שלך</h1>
        <p className="text-blue-200 text-sm max-w-xl mx-auto leading-relaxed">
          הבוט מכיר את כל תלמידי הכיתה, את כל הנתונים במערכת, ויודע לנווט לכל חלק בממשק.
          שאל בקול או בכתב — בשפה טבעית, ללא פקודות מיוחדות.
        </p>
      </div>

      {/* Capabilities */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">מה הבוט יכול לעשות?</h2>
        <div className="grid grid-cols-3 gap-4">
          {CAPABILITIES.map((cap, i) => (
            <div key={i} className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="text-3xl mb-2">{cap.icon}</div>
              <p className="font-bold text-gray-800 mb-3">{cap.title}</p>
              <ul className="space-y-1.5">
                {cap.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-400 mt-0.5 shrink-0">•</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* Tip card fills 6th spot */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="text-3xl mb-2">⚡</div>
            <p className="font-bold text-amber-800 mb-3">ניווט אוטומטי</p>
            <p className="text-sm text-amber-700 leading-relaxed">
              כשהבוט מוצא מידע רלוונטי הוא מציע ניווט ישיר לדף המתאים — לחיצה אחת ואתה שם.
            </p>
          </div>
        </div>
      </div>

      {/* Action examples */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">פקודות פעולה — הבוט מבצע ומעדכן</h2>
        <p className="text-sm text-gray-500 mb-4">הבוט לא רק עונה — הוא מבצע פעולות ומעדכן את הנתונים בפועל</p>
        <div className="space-y-2">
          {ACTION_EXAMPLES.map((ex, i) => (
            <div key={i} className="bg-white border rounded-xl px-4 py-3 flex items-start gap-3 hover:border-indigo-300 transition-colors">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5 ${
                ex.tag === 'משמעת' ? 'bg-red-100 text-red-700' :
                ex.tag === 'תשלום' ? 'bg-green-100 text-green-700' :
                ex.tag === 'הודעה' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>{ex.tag}</span>
              <div className="flex-1">
                <p className="text-sm text-gray-800 font-medium">"{ex.q}"</p>
                <p className="text-xs text-indigo-600 mt-0.5">→ {ex.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Query examples */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">שאילתות מידע</h2>
        <div className="grid grid-cols-2 gap-3">
          {EXAMPLES.map((ex, i) => (
            <div key={i} className="bg-white border rounded-xl px-4 py-3 flex items-center gap-3 hover:border-blue-300 transition-colors">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium shrink-0">{ex.tag}</span>
              <span className="text-sm text-gray-700">"{ex.q}"</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">טיפים לשימוש</h2>
        <div className="grid grid-cols-2 gap-4">
          {TIPS.map((tip, i) => (
            <div key={i} className="bg-white border rounded-xl p-4 flex gap-3">
              <span className="text-2xl shrink-0">{tip.icon}</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{tip.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What the bot knows */}
      <div className="bg-slate-800 rounded-2xl p-6 text-white">
        <h2 className="font-bold text-lg mb-4">📂 מה הבוט יודע</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {[
            ['👥', 'תלמידים', '20 תלמידי כיתה י׳ג — שמות, תמונות, נתונים ביוגרפיים'],
            ['📊', 'ציונים', 'ציוני כל מקצוע ב-3 מבחנים אחרונים + מגמות'],
            ['🗓', 'נוכחות', 'נוכחות יומית שבועית + חיסורים ואיחורים מצטברים'],
            ['💳', 'תשלומים', 'סטטוס תשלום לכל תלמיד, יתרות וסיכום חוב'],
            ['💬', 'הורים', 'הודעות נכנסות, מענה אוטומטי, פניות פתוחות'],
            ['🧠', 'מעקב', 'שאלונים רגשיים, המלצות AI, משימות מחנך'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="bg-white/10 rounded-xl p-3">
              <p className="font-semibold mb-1">{icon} {title}</p>
              <p className="text-slate-300 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
