'use client';
import { useState, useEffect } from 'react';
import { STUDENTS } from '../data';

type TabView = 'inbox' | 'compose';
type MsgStatus = 'auto-replied' | 'pending' | 'replied';
type Audience = 'group' | 'individual';
type MsgType = 'general' | 'reminder' | 'urgent' | 'guidance';

interface ConvMsg { from: 'parent' | 'bot' | 'teacher'; text: string; time: string; }
interface ParentThread {
  id: number; parent: string; student: string; studentId: number;
  time: string; preview: string; status: MsgStatus;
  conversation: ConvMsg[];
}

const THREADS: ParentThread[] = [
  {
    id: 1, parent: 'ריבה מזרחי', student: 'דניאל מזרחי', studentId: 7,
    time: 'היום | 07:42', preview: 'שלום, דניאל לא יגיע היום כי הוא חולה...',
    status: 'auto-replied',
    conversation: [
      { from: 'parent', text: 'שלום כבוד המחנך, דניאל לא יגיע היום לבית הספר כי הוא חולה עם חום.', time: '07:42' },
      { from: 'bot', text: 'שלום ריבה מזרחי,\n\nתודה על ההודעה — מקווים שדניאל יבריא מהר! 🙏\n\n📋 בהתאם לתקנון בית הספר, חיסור מחייב הגשת אישור רפואי תוך 3 ימים ממועד החיסור. ניתן להגיש למזכירות או לצלם ולשלוח לכאן.\n\n📊 מצב נוכחות שוטף:\nלדניאל ישנם עד כה 12 חיסורים מתחילת השנה (ממוצע הכיתה: 5).\n\n📚 שיעורים שיפוספסו היום:\n• 08:00 — מתמטיקה (שרית לבנה)\n• 10:00 — אנגלית (נעמה ורד)\n• 12:00 — היסטוריה (אמיר דרור)\n\nמומלץ לתאם עם המורים את חומר הלמידה שיפוספס.\n\nשיהיה לדניאל רפואה שלמה!\nמערכת ניהול כיתה י׳ג', time: '07:42' },
    ]
  },
  {
    id: 2, parent: 'ויקי פרידמן', student: 'נועה פרידמן', studentId: 12,
    time: 'היום | 06:55', preview: 'נועה חולה מחר, לא תגיע...',
    status: 'auto-replied',
    conversation: [
      { from: 'parent', text: 'שלום, נועה חולה ולא תגיע מחר לבית הספר.', time: '06:55' },
      { from: 'bot', text: 'שלום ויקי פרידמן,\n\nתודה על ההודעה — מקווים שנועה תבריא מהר! 🙏\n\n📋 תזכורת תקנון:\nיש להגיש אישור רפואי תוך 3 ימים למזכירות.\n\n📊 נוכחות נועה:\nלנועה יש 1 חיסור בלבד מתחילת השנה — מצוין! ✅\n\n📚 שיעורים שיפוספסו מחר:\n• 09:00 — אזרחות (דוד כהן)\n• 11:00 — ספרות (רינת גולן)\n\nשיהיה לנועה רפואה שלמה!\nמערכת ניהול כיתה י׳ג', time: '06:56' },
    ]
  },
  {
    id: 3, parent: 'אמנון גולן', student: 'תמר גולן', studentId: 16,
    time: 'אתמול | 19:20', preview: 'רציתי לדבר עם המחנך בנוגע לתמר...',
    status: 'pending',
    conversation: [
      { from: 'parent', text: 'שלום דוד, אני רוצה לדבר איתך בנוגע לתמר. יש כמה דברים שמטרידים אותי. מתי נוח לך לדבר?', time: '19:20' },
      { from: 'bot', text: 'שלום אמנון גולן,\n\nתודה על פנייתך. הודעתך הועברה למחנך כיתה י׳ג, דוד כהן, והוא יחזור אליך בהקדם האפשרי בשעות הפעילות (07:30–16:00).\n\nאם מדובר בעניין דחוף, ניתן לפנות למזכירות בית הספר: 03-1234567.\n\nתודה על פנייתך,\nמערכת ניהול כיתה י׳ג', time: '19:20' },
    ]
  },
  {
    id: 4, parent: 'חנה אלוני', student: 'רן אלוני', studentId: 10,
    time: 'אתמול | 14:05', preview: 'לגבי התשלום — אנחנו זכאים להנחה...',
    status: 'auto-replied',
    conversation: [
      { from: 'parent', text: 'שלום, לגבי תשלום ההשתלמות — בני מגיע לתמיכה כלכלית ולכן אנחנו לא יכולים לשלם את הסכום המלא. יש לנו תעודת זכאות.', time: '14:05' },
      { from: 'bot', text: 'שלום חנה אלוני,\n\nתודה על פנייתך. אנו מבינים את המצב ונשמח לסייע.\n\n📄 לבקשת הנחה/מלגה:\nנא לשלוח את תעודת הזכאות למייל: kaveret@school.edu.il\nבנושא: "בקשת הנחה — רן אלוני כיתה י׳ג"\n\nהבקשה תטופל תוך 5 ימי עסקים על ידי רכזת הכספים.\n\n📌 עד לאישור — אין חובה לשלם את הסכום המלא.\n\nבתודה,\nמערכת ניהול כיתה י׳ג', time: '14:06' },
    ]
  },
  {
    id: 5, parent: 'ציפי אברהם', student: 'מיה אברהם', studentId: 11,
    time: 'לפני יומיים | 11:30', preview: 'מה ציון המבחן של מיה באזרחות?',
    status: 'auto-replied',
    conversation: [
      { from: 'parent', text: 'שלום, רציתי לדעת מה הציון של מיה במבחן האחרון באזרחות. תודה', time: '11:30' },
      { from: 'bot', text: 'שלום ציפי אברהם,\n\nציוני המבחנים מתעדכנים במערכת ההורים תוך 48 שעות מהגשת הציון.\n\n🔗 כניסה למערכת ההורים:\nhttps://parents.school.edu.il\nשם משתמש: מספר תעודת זהות\n\nאם יש בעיה בכניסה — צרי קשר עם המזכירות.\n\nבתודה,\nמערכת ניהול כיתה י׳ג', time: '11:31' },
    ]
  },
  {
    id: 6, parent: 'עידית רוזנברג', student: 'יעל רוזנברג', studentId: 17,
    time: 'לפני יומיים | 09:15', preview: 'מתי יום ההורים הקרוב?',
    status: 'auto-replied',
    conversation: [
      { from: 'parent', text: 'שלום, מתי מתקיים יום ההורים הקרוב? לא קיבלנו עדיין הודעה.', time: '09:15' },
      { from: 'bot', text: 'שלום עידית רוזנברג,\n\n📅 יום ההורים הקרוב לשכבת כיתות י׳:\nתאריך: ג׳, 20 במאי 2026\nשעות: 17:00–20:30\nמיקום: חדרי הכיתות — כיתה י׳ג בחדר 214\n\nקבלת קהל: 10 דקות לפגישה | הרשמה מקוונת תיפתח ב-1/5.\n\nנשמח לראותך!\nמערכת ניהול כיתה י׳ג', time: '09:16' },
    ]
  },
];

const MSG_TYPES: { id: MsgType; label: string; icon: string }[] = [
  { id: 'general',  label: 'הודעה כללית',  icon: '📢' },
  { id: 'reminder', label: 'תזכורת',        icon: '⏰' },
  { id: 'urgent',   label: 'דחוף',          icon: '🚨' },
  { id: 'guidance', label: 'הנחיה / בקשה',  icon: '📋' },
];

const COMPOSE_TEMPLATES: Record<MsgType, Record<'group' | 'individual', string>> = {
  general: {
    group: 'שלום להורי כיתה י׳ג,\n\nרצינו לעדכן אתכם כי...\n\nנשמח לכל שאלה,\nדוד כהן, מחנך כיתה י׳ג',
    individual: 'שלום [שם הורה],\n\nרציתי לעדכן אתכם לגבי [שם תלמיד]...\n\nניתן לפנות אלי בכל שאלה,\nדוד כהן',
  },
  reminder: {
    group: 'תזכורת להורי כיתה י׳ג 🔔\n\nמזכירים כי...\n\nחשוב לעמוד בתאריך!\nדוד כהן',
    individual: 'שלום [שם הורה],\n\nתזכורת ידידותית בנוגע ל...\n\nתודה,\nדוד כהן',
  },
  urgent: {
    group: '🚨 הודעה דחופה להורי כיתה י׳ג\n\nלתשומת ליבכם בדחיפות:\n...\n\nנא לפנות מיד למזכירות: 03-1234567\nדוד כהן, מחנך',
    individual: '🚨 [שם הורה], שלום.\n\nאני פונה אליכם בעניין דחוף הנוגע ל[שם תלמיד]...\n\nנא לחזור אלי בהקדם,\nדוד כהן | 050-0000000',
  },
  guidance: {
    group: 'להורי כיתה י׳ג,\n\nבמסגרת הכנות ל..., אנו מבקשים מכם:\n1. ...\n2. ...\n\nתודה על שיתוף הפעולה,\nדוד כהן',
    individual: 'שלום [שם הורה],\n\nאשמח אם תוכלו לסייע בנושא הבא:\n...\n\nתודה מראש,\nדוד כהן',
  },
};

const statusLabel: Record<MsgStatus, { text: string; color: string }> = {
  'auto-replied': { text: 'נענה אוטומטית', color: 'bg-green-100 text-green-700' },
  'pending':      { text: 'ממתין לטיפול',  color: 'bg-amber-100 text-amber-700' },
  'replied':      { text: 'נענה ידנית',     color: 'bg-blue-100 text-blue-700' },
};

export default function ParentComms({ incomingDraft, onDraftConsumed }: { incomingDraft?: string | null; onDraftConsumed?: () => void }) {
  const [tab, setTab] = useState<TabView>('inbox');
  const [selected, setSelected] = useState<ParentThread>(THREADS[0]);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState<Record<number, boolean>>({});

  const [audience, setAudience] = useState<Audience>('group');
  const [msgType, setMsgType] = useState<MsgType>('general');
  const [individualStudent, setIndividualStudent] = useState(STUDENTS[0]);
  const [composing, setComposing] = useState(false);
  const [composed, setComposed] = useState('');
  const [composeSent, setComposeSent] = useState(false);

  // Bot pre-fills compose tab with a drafted message
  useEffect(() => {
    if (incomingDraft) {
      setTab('compose');
      setAudience('group');
      setComposed(incomingDraft);
      setComposeSent(false);
      onDraftConsumed?.();
    }
  }, [incomingDraft]);

  const autoCount = THREADS.filter(t => t.status === 'auto-replied').length;
  const pendingCount = THREADS.filter(t => t.status === 'pending').length;

  const generateDraft = () => {
    setComposing(true);
    setComposed('');
    setTimeout(() => {
      let draft = COMPOSE_TEMPLATES[msgType][audience];
      if (audience === 'individual') {
        const parent = THREADS.find(t => t.studentId === individualStudent.id)?.parent ?? 'ההורה';
        draft = draft.replace('[שם הורה]', parent).replace('[שם תלמיד]', individualStudent.name);
      }
      setComposed(draft);
      setComposing(false);
    }, 1400);
  };

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">תקשורת הורים</h1>
        <p className="text-gray-500 text-sm mt-1">כל הקשר עם ההורים דרך מערכת אחת — מענה אוטומטי חכם, פנייה ידנית כשנדרש</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'פניות השבוע',       value: THREADS.length,  color: 'text-gray-800',   bg: 'bg-white' },
          { label: 'נענו אוטומטית',     value: autoCount,       color: 'text-green-600',  bg: 'bg-green-50 border-green-200' },
          { label: 'ממתינות לטיפול',    value: pendingCount,    color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200' },
          { label: 'אחוז מענה אוטומטי', value: `${Math.round((autoCount / THREADS.length) * 100)}%`, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl border shadow-sm p-4 text-center`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {([['inbox','תיבת הודעות נכנסות','📩'],['compose','כתיבת הודעה','✍️']] as const).map(([id, label, icon]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <span>{icon}</span>{label}
          </button>
        ))}
      </div>

      {tab === 'inbox' && (
        <div className="grid grid-cols-5 gap-5">
          {/* Thread list */}
          <div className="col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50">
              <p className="text-sm font-bold text-gray-700">הודעות נכנסות</p>
            </div>
            <div className="divide-y overflow-y-auto" style={{ maxHeight: 520 }}>
              {THREADS.map(t => {
                const student = STUDENTS.find(s => s.id === t.studentId);
                return (
                  <button key={t.id} onClick={() => setSelected(t)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-right hover:bg-gray-50 transition-colors ${selected.id === t.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''}`}>
                    <img src={student?.photo} className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="font-semibold text-sm text-gray-800 truncate">{t.parent}</p>
                        <p className="text-xs text-gray-400 shrink-0 mr-1">{t.time.split('|')[0]}</p>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{t.student}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{t.preview}</p>
                      <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusLabel[t.status].color}`}>
                        {statusLabel[t.status].text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversation view */}
          <div className="col-span-3 bg-white rounded-2xl border shadow-sm flex flex-col" style={{ height: 560 }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b bg-gray-50 rounded-t-2xl">
              <img src={STUDENTS.find(s => s.id === selected.studentId)?.photo} className="w-10 h-10 rounded-full object-cover" alt="" />
              <div>
                <p className="font-bold text-sm text-gray-800">{selected.parent}</p>
                <p className="text-xs text-gray-500">הורה של {selected.student} | {selected.time}</p>
              </div>
              <span className={`mr-auto text-xs px-2.5 py-1 rounded-full font-medium ${statusLabel[selected.status].color}`}>
                {statusLabel[selected.status].text}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {selected.conversation.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'parent' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] ${msg.from === 'parent' ? '' : 'text-right'}`}>
                    {msg.from !== 'parent' && (
                      <div className="flex items-center justify-end gap-1.5 mb-1">
                        <span className="text-xs text-gray-400">{msg.time}</span>
                        <span className={`text-xs font-medium ${msg.from === 'bot' ? 'text-green-600' : 'text-blue-600'}`}>
                          {msg.from === 'bot' ? '🤖 מענה אוטומטי' : '👤 דוד כהן'}
                        </span>
                      </div>
                    )}
                    {msg.from === 'parent' && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-medium text-gray-600">{selected.parent}</span>
                        <span className="text-xs text-gray-400">{msg.time}</span>
                      </div>
                    )}
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                      ${msg.from === 'parent' ? 'bg-gray-100 text-gray-800 rounded-tl-sm' : ''}
                      ${msg.from === 'bot' ? 'bg-green-50 border border-green-200 text-gray-800 rounded-tr-sm' : ''}
                      ${msg.from === 'teacher' ? 'bg-blue-600 text-white rounded-tr-sm' : ''}`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply box */}
            {selected.status === 'pending' && (
              <div className="border-t p-4">
                {replySent[selected.id] ? (
                  <p className="text-center text-sm text-green-600 py-2">✓ התשובה נשלחה להורה</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-amber-600 font-medium">⚠️ פנייה זו דורשת מענה ידני שלך</p>
                    <div className="flex gap-2">
                      <textarea
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="כתוב תשובה..."
                        className="flex-1 border rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                      <button
                        onClick={() => { if (replyText.trim()) { setReplySent(p => ({ ...p, [selected.id]: true })); }}}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl text-sm font-medium transition-colors self-end py-2"
                      >
                        שלח
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'compose' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Settings */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <h3 className="font-bold text-gray-700 mb-4">הגדרות הודעה</h3>

              {/* Audience */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-2">לשלוח:</p>
                <div className="grid grid-cols-2 gap-2">
                  {([['group','קבוצת הורים','👨‍👩‍👧‍👦'],['individual','הורה ספציפי','👤']] as const).map(([id, label, icon]) => (
                    <button key={id} onClick={() => { setAudience(id); setComposed(''); setComposeSent(false); }}
                      className={`py-3 rounded-xl border-2 text-sm font-medium transition-colors ${audience === id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <span className="block text-xl mb-0.5">{icon}</span>{label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual selector */}
              {audience === 'individual' && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">בחר תלמיד:</p>
                  <select
                    value={individualStudent.id}
                    onChange={e => { setIndividualStudent(STUDENTS.find(s => s.id === Number(e.target.value))!); setComposed(''); }}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STUDENTS.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Message type */}
              <div className="mb-5">
                <p className="text-sm font-medium text-gray-600 mb-2">סוג הודעה:</p>
                <div className="grid grid-cols-2 gap-2">
                  {MSG_TYPES.map(mt => (
                    <button key={mt.id} onClick={() => { setMsgType(mt.id); setComposed(''); setComposeSent(false); }}
                      className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border-2 text-sm transition-colors ${msgType === mt.id ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <span>{mt.icon}</span>{mt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={generateDraft}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <span>✨</span> צור טיוטה עם AI
              </button>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm font-bold text-amber-800 mb-2">💡 טיפים לכתיבה אפקטיבית:</p>
              <ul className="space-y-1.5 text-xs text-amber-800">
                <li>• הודעות קצרות (עד 5 שורות) נקראות יותר</li>
                <li>• שלב תמיד שם תלמיד בפנייה אישית</li>
                <li>• הוסף מידע פעולה ברור (מה ומתי)</li>
                <li>• הודעת קבוצה — שלח בין 08:00–20:00</li>
              </ul>
            </div>
          </div>

          {/* Preview + send */}
          <div className="bg-white rounded-2xl border shadow-sm flex flex-col" style={{ minHeight: 480 }}>
            <div className="px-5 py-4 border-b bg-gray-50 rounded-t-2xl">
              <p className="font-bold text-gray-700">תצוגה מקדימה</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {audience === 'group' ? 'נשלח לכל הורי כיתה י׳ג (20 הורים)' : `נשלח ל: ${THREADS.find(t => t.studentId === individualStudent.id)?.parent ?? 'הורה'}`}
              </p>
            </div>

            <div className="flex-1 p-5">
              {!composed && !composing && (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                  <span className="text-5xl mb-3">✍️</span>
                  <p className="text-sm text-gray-500">בחר הגדרות ולחץ "צור טיוטה עם AI"</p>
                </div>
              )}
              {composing && (
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-4xl mb-3 animate-bounce">🤖</span>
                  <p className="text-sm text-gray-500">מנסח הודעה...</p>
                </div>
              )}
              {composed && (
                <>
                  {/* WhatsApp-style bubble */}
                  <div className="bg-green-50 border border-green-200 rounded-2xl rounded-tr-sm p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">WhatsApp</span>
                      <span className="text-xs text-gray-400">מדוד כהן | עכשיו</span>
                    </div>
                    <textarea
                      value={composed}
                      onChange={e => setComposed(e.target.value)}
                      className="w-full text-sm text-gray-800 leading-relaxed bg-transparent resize-none focus:outline-none"
                      rows={10}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mb-4 text-center">ניתן לערוך את הטקסט לפני השליחה</p>
                  {composeSent ? (
                    <div className="bg-green-100 rounded-xl py-3 text-center">
                      <p className="text-green-700 font-semibold text-sm">✅ ההודעה נשלחה בהצלחה!</p>
                      <p className="text-xs text-green-600 mt-0.5">
                        {audience === 'group' ? '20 הורים קיבלו את ההודעה' : `${THREADS.find(t => t.studentId === individualStudent.id)?.parent} קיבל/ה את ההודעה`}
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button onClick={() => { setComposed(''); setComposeSent(false); }}
                        className="flex-1 border text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                        נקה
                      </button>
                      <button onClick={() => { navigator.clipboard?.writeText(composed); }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm transition-colors">
                        📋 העתק
                      </button>
                      <button onClick={() => setComposeSent(true)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                        📲 שלח
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
