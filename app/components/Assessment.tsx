'use client';
import { useState, useMemo } from 'react';

interface Product {
  id: number;
  title: string;
  subject: string;
  class: string;
  type: string;
  tool: string;
  desc: string;
  date: string;
}

const PRODUCTS: Product[] = [
  { id: 1,  title: 'מבחן: מבנה השלטון בישראל',               subject: 'אזרחות',        class: "י'ג", type: 'מבחן',          tool: 'StudyWise',   desc: '25 שאלות ידע, הבנה ויישום. בדיקה אוטומטית ומשוב מיידי לתלמיד.',             date: '20/4/26' },
  { id: 2,  title: 'שאלון: הכנסת — מבנה וסמכויות',           subject: 'אזרחות',        class: "י'ב", type: 'שאלון',         tool: 'StudyWise',   desc: 'שאלות פתוחות וסגורות על מבנה הכנסת, חקיקה ופריווילגיות.',                  date: '18/4/26' },
  { id: 3,  title: 'מבחן: מערכת המשפט בישראל',               subject: 'אזרחות',        class: "י'ג", type: 'מבחן',          tool: 'StudyWise',   desc: 'פסיקות, ביקורת שיפוטית ומינוי שופטים. 20 שאלות רב-ברירה + 2 פתוחות.',    date: '10/4/26' },
  { id: 4,  title: 'תוכנית שיעור: זכויות אדם ואזרח',         subject: 'אזרחות',        class: "י'א", type: 'תוכנית שיעור',  tool: 'Magic School', desc: 'שיעור 45 דק׳ הכולל פעילות קבוצתית, דיון ומשחק תפקידים.',                  date: '15/4/26' },
  { id: 5,  title: 'תוכנית שיעור: ריבוי תרבויות בישראל',     subject: 'אזרחות',        class: "י'ד", type: 'תוכנית שיעור',  tool: 'Magic School', desc: 'יחידה של 3 שיעורים עם מקרי בוחן, שאלות גישור ועבודת צוות.',              date: '8/4/26'  },
  { id: 6,  title: 'דף עבודה: פונקציה ריבועית',              subject: 'מתמטיקה',       class: "י'א", type: 'דף עבודה',      tool: 'ChatGPT',     desc: '15 תרגילים מדורגים: שרשרת השלמה לריבוע, גרף ונקודות חיתוך.',             date: '22/4/26' },
  { id: 7,  title: 'מצגת: פונקציה ריבועית — הסבר חזותי',    subject: 'מתמטיקה',       class: "י'א", type: 'מצגת',          tool: 'Canva AI',    desc: '18 שקפים עם אנימציות, גרפים אינטראקטיביים ושאלות בדיקה.',                date: '21/4/26' },
  { id: 8,  title: 'תרגיל: טריגונומטריה — סינוס וקוסינוס',  subject: 'מתמטיקה',       class: "י'א", type: 'תרגיל',         tool: 'Khanmigo',    desc: 'סדרת תרגילים מותאמת אישית עם הסברים צעד-אחר-צעד.',                        date: '19/4/26' },
  { id: 9,  title: 'דף עבודה: גיאומטריה — משפט פיתגורס',    subject: 'מתמטיקה',       class: "י'ג", type: 'דף עבודה',      tool: 'ChatGPT',     desc: '12 תרגילים כולל הוכחות והרחבות. שלושה רמות קושי.',                        date: '16/4/26' },
  { id: 10, title: 'תרגיל: משוואות ממעלה שנייה',             subject: 'מתמטיקה',       class: "י'ב", type: 'תרגיל',         tool: 'ChatGPT',     desc: 'בנק 30 שאלות עם פתרונות מלאים ורמזים מדורגים.',                           date: '12/4/26' },
  { id: 11, title: 'סיכום: מלחמת העולם השנייה',              subject: 'היסטוריה',      class: "י'ב", type: 'סיכום',         tool: 'NotebookLM',  desc: 'סיכום מקיף מתוך 4 ספרי לימוד. כולל ציר זמן ושאלות מנחות.',              date: '23/4/26' },
  { id: 12, title: 'מצגת: קום המדינה ומלחמת העצמאות',        subject: 'היסטוריה',      class: "י'ב", type: 'מצגת',          tool: 'Curipod',     desc: 'מצגת אינטראקטיבית עם סקרים בזמן אמת, תמונות וסרטוני ארכיון.',           date: '20/4/26' },
  { id: 13, title: 'סיכום: המנדט הבריטי',                    subject: 'היסטוריה',      class: "י'א", type: 'סיכום',         tool: 'NotebookLM',  desc: 'סיכום אנליטי: גורמים, תהליכים ומפות מושגיות.',                            date: '14/4/26' },
  { id: 14, title: 'שאלון: האידיאולוגיה הנאצית',             subject: 'היסטוריה',      class: "י'ב", type: 'שאלון',         tool: 'Gemini',      desc: 'שאלות עומק לחשיבה ביקורתית ואתית. מתאים לדיון כיתתי.',                  date: '9/4/26'  },
  { id: 15, title: 'ניתוח: "הכניסיני תחת כנפך" — ביאליק',   subject: 'ספרות עברית',   class: "י'ד", type: 'שאלון',         tool: 'Gemini',      desc: 'שאלות ניתוח שיר: מוטיבים, שפה, צורה ורקע ביוגרפי.',                     date: '22/4/26' },
  { id: 16, title: 'פרויקט: עגנון — "והיה העקוב למישור"',   subject: 'ספרות עברית',   class: "י'ג", type: 'פרויקט',        tool: 'Claude',      desc: 'מדריך פרויקט מלא: שאלות חקר, קריטריוני הערכה ומבנה הגשה.',              date: '17/4/26' },
  { id: 17, title: 'שאלון: "הכניסיני תחת כנפך" — ביאליק',   subject: 'ספרות עברית',   class: "י'ד", type: 'שאלון',         tool: 'Claude',      desc: 'שאלות פתוחות לניתוח עמוק: מטאפורה, אירוניה ורובד נסתר.',               date: '11/4/26' },
  { id: 18, title: 'תרגיל: Present Perfect — משפטים',        subject: 'אנגלית',        class: "י'ג", type: 'תרגיל',         tool: 'ChatGPT',     desc: '20 משפטי השלמה + המרה מ-Simple Past. עם תשובות ומשוב.',                 date: '24/4/26' },
  { id: 19, title: 'מצגת: Reading Comprehension',             subject: 'אנגלית',        class: "י'ב", type: 'מצגת',          tool: 'Canva AI',    desc: '3 טקסטים מדורגים עם שאלות ואסטרטגיות קריאה חזותיות.',                   date: '18/4/26' },
  { id: 20, title: 'פרויקט: Opinion Essay — Current Events',  subject: 'אנגלית',        class: "י'ד", type: 'פרויקט',        tool: 'Canva AI',    desc: 'עיתון דיגיטלי כיתתי: תכנון, כתיבה ועריכה בעזרת AI.',                    date: '13/4/26' },
  { id: 21, title: 'מבחן: אלקטרומגנטיות — שדה מגנטי',       subject: 'פיזיקה',        class: "י'ב", type: 'מבחן',          tool: 'StudyWise',   desc: 'מבחן 20 שאלות: חישובים, גרפים ופתרון בעיות מציאותיות.',                 date: '21/4/26' },
  { id: 22, title: 'מצגת: חוקי ניוטון',                     subject: 'פיזיקה',        class: "י'א", type: 'מצגת',          tool: 'Curipod',     desc: 'מצגת אינטראקטיבית עם ניסויים וירטואליים וסקרים בזמן אמת.',              date: '15/4/26' },
  { id: 23, title: 'מטלה: מעבדה וירטואלית — ניוטון',        subject: 'פיזיקה',        class: "י'א", type: 'מטלה',          tool: 'Magic School', desc: 'הנחיות מעבדה דיגיטלית עם גיליון נתונים ושאלות סיכום.',                  date: '10/4/26' },
  { id: 24, title: 'סיכום: סיפור יוסף — בראשית',            subject: 'תנ"ך',          class: "י'ג", type: 'סיכום',         tool: 'Claude',      desc: 'ניתוח נרטיבי, דמויות ומסרים. כולל טבלת השוואה בין פרשנים.',             date: '19/4/26' },
  { id: 25, title: 'מטלה: כישורי חיים — ניהול זמן',         subject: 'כישורי חיים',   class: "י'ג", type: 'מטלה',          tool: 'Magic School', desc: 'יחידה חווייתית: מיפוי זמן אישי, יעדים ובניית שגרה בריאה.',              date: '7/4/26'  },
];

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'אזרחות':       { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  'מתמטיקה':      { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  'היסטוריה':     { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'ספרות עברית':  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
  'אנגלית':       { bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200' },
  'פיזיקה':       { bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-200' },
  'תנ"ך':         { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  'כישורי חיים':  { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200' },
};

const SUBJECT_STRIP: Record<string, string> = {
  'אזרחות':       'bg-blue-500',
  'מתמטיקה':      'bg-violet-500',
  'היסטוריה':     'bg-orange-500',
  'ספרות עברית':  'bg-amber-500',
  'אנגלית':       'bg-emerald-500',
  'פיזיקה':       'bg-cyan-500',
  'תנ"ך':         'bg-yellow-500',
  'כישורי חיים':  'bg-rose-500',
};

const TOOL_STYLE: Record<string, string> = {
  'StudyWise':    'bg-indigo-100 text-indigo-700',
  'ChatGPT':      'bg-green-100 text-green-700',
  'Claude':       'bg-purple-100 text-purple-700',
  'Magic School': 'bg-pink-100 text-pink-700',
  'Canva AI':     'bg-red-100 text-red-700',
  'Curipod':      'bg-teal-100 text-teal-700',
  'NotebookLM':   'bg-blue-100 text-blue-700',
  'Gemini':       'bg-sky-100 text-sky-700',
  'Khanmigo':     'bg-orange-100 text-orange-700',
};

const TOOL_ICON: Record<string, string> = {
  'StudyWise':    '📝',
  'ChatGPT':      '💬',
  'Claude':       '🧠',
  'Magic School': '✨',
  'Canva AI':     '🎨',
  'Curipod':      '🎯',
  'NotebookLM':   '📓',
  'Gemini':       '♊',
  'Khanmigo':     '🎓',
};

const TYPE_ICON: Record<string, string> = {
  'מבחן': '📋', 'שאלון': '❓', 'מצגת': '📊', 'סיכום': '📄',
  'תרגיל': '✏️', 'פרויקט': '🔬', 'מטלה': '📌', 'תוכנית שיעור': '🗂', 'דף עבודה': '📃',
};

const uniq = (arr: string[]) => ['הכל', ...Array.from(new Set(arr))];

export default function Assessment() {
  const [search, setSearch]       = useState('');
  const [filterSubject, setFilterSubject] = useState('הכל');
  const [filterClass, setFilterClass]     = useState('הכל');
  const [filterType, setFilterType]       = useState('הכל');
  const [filterTool, setFilterTool]       = useState('הכל');

  const subjects = useMemo(() => uniq(PRODUCTS.map(p => p.subject)), []);
  const classes  = useMemo(() => uniq(PRODUCTS.map(p => p.class)),   []);
  const types    = useMemo(() => uniq(PRODUCTS.map(p => p.type)),     []);
  const tools    = useMemo(() => uniq(PRODUCTS.map(p => p.tool)),     []);

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    if (filterSubject !== 'הכל' && p.subject !== filterSubject) return false;
    if (filterClass   !== 'הכל' && p.class   !== filterClass)   return false;
    if (filterType    !== 'הכל' && p.type    !== filterType)     return false;
    if (filterTool    !== 'הכל' && p.tool    !== filterTool)     return false;
    if (search && !p.title.includes(search) && !p.desc.includes(search) && !p.subject.includes(search)) return false;
    return true;
  }), [filterSubject, filterClass, filterType, filterTool, search]);

  const selectCls = 'text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer';

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">מאגר משימות הערכה</h1>
        <p className="text-gray-500 text-sm mt-1">תוצרי AI מכלים שונים — מוכנים לשימוש בכיתה</p>
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 flex-wrap">
        {Object.entries(SUBJECT_COLORS).map(([subj, c]) => {
          const count = PRODUCTS.filter(p => p.subject === subj).length;
          if (!count) return null;
          return (
            <button
              key={subj}
              onClick={() => setFilterSubject(filterSubject === subj ? 'הכל' : subj)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                filterSubject === subj ? `${c.bg} ${c.text} ${c.border} ring-2 ring-offset-1 ring-current` : `${c.bg} ${c.text} ${c.border} opacity-70 hover:opacity-100`
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${SUBJECT_STRIP[subj]}`} />
              {subj}
              <span className="opacity-60">({count})</span>
            </button>
          );
        })}
        <span className="mr-auto text-xs text-gray-400 self-center">{filtered.length} תוצרים</span>
      </div>

      {/* Filter bar */}
      <div className="bg-white border rounded-2xl px-5 py-4 flex gap-3 flex-wrap items-center shadow-sm">
        <input
          type="text"
          placeholder="חיפוש חופשי..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[160px] flex-1"
        />
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className={selectCls}>
          {subjects.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className={selectCls}>
          {classes.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className={selectCls}>
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={filterTool} onChange={e => setFilterTool(e.target.value)} className={selectCls}>
          {tools.map(t => <option key={t}>{t}</option>)}
        </select>
        {(filterSubject !== 'הכל' || filterClass !== 'הכל' || filterType !== 'הכל' || filterTool !== 'הכל' || search) && (
          <button
            onClick={() => { setFilterSubject('הכל'); setFilterClass('הכל'); setFilterType('הכל'); setFilterTool('הכל'); setSearch(''); }}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            נקה סינון
          </button>
        )}
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-medium">לא נמצאו תוצרים תואמים</p>
          <p className="text-sm mt-1">נסה לשנות את הסינון</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(p => {
            const sc = SUBJECT_COLORS[p.subject] ?? { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
            const strip = SUBJECT_STRIP[p.subject] ?? 'bg-gray-400';
            const toolStyle = TOOL_STYLE[p.tool] ?? 'bg-gray-100 text-gray-600';
            return (
              <div key={p.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                {/* Color strip */}
                <div className={`h-1.5 ${strip}`} />
                <div className="p-4 flex flex-col flex-1">
                  {/* Top row: tool badge + type icon */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${toolStyle}`}>
                      {TOOL_ICON[p.tool]} {p.tool}
                    </span>
                    <span className="text-lg" title={p.type}>{TYPE_ICON[p.type] ?? '📄'}</span>
                  </div>
                  {/* Title */}
                  <h3 className="font-bold text-gray-800 text-sm leading-snug mb-2">{p.title}</h3>
                  {/* Description */}
                  <p className="text-xs text-gray-500 leading-relaxed flex-1">{p.desc}</p>
                  {/* Footer tags */}
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${sc.bg} ${sc.text} ${sc.border}`}>{p.subject}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{p.class}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{p.type}</span>
                    <span className="mr-auto text-xs text-gray-400">{p.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
