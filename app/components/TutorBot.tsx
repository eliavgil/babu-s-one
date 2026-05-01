'use client';
import { useState, useRef, useEffect } from 'react';
import { STUDENTS } from '../data';

interface Message { role: 'user' | 'bot'; text: string }
interface InjectionEntry { id: number; targets: string; content: string; time: string; category: string }

const ALL_STUDENTS = STUDENTS.map(s => ({ id: s.id, name: s.name, photo: s.photo }));

const BOT_KNOWLEDGE: Record<string, string> = {
  'כנסת': `שאלה טובה!\n\n**הכנסת — הרשות המחוקקת:**\n• 120 חברי כנסת, נבחרת ל-4 שנים\n• יושבת בירושלים\n\n**תפקידים עיקריים:**\n1. חקיקת חוקים\n2. פיקוח על הממשלה\n3. אישור תקציב המדינה\n\nמה לא ברור? אשמח להרחיב.`,
  'זכויות': `שאלה מצוינת!\n\n🌍 **זכויות אדם** — לכל אדם בכל מקום: חיים, חירות, כבוד\n🇮🇱 **זכויות אזרח** — לאזרחי המדינה בלבד: הצבעה, שירות ציבורי\n\nחוק יסוד: כבוד האדם וחירותו (1992) מגן על שתיהן בישראל.`,
  'דמוקרטיה': `✋ **ישירה** — אזרחים מצביעים ישירות על החלטות (רפרנדום)\n🗳 **עקיפה** — בוחרים נציגים שמחליטים בשמנו\n\nישראל היא דמוקרטיה **עקיפה** — אנחנו בוחרים כנסת.`,
  'ממשלה': `הממשלה = הרשות המבצעת.\n\n• ראש הממשלה מוביל\n• השרים אחראים על משרדים\n\n**קמת ממשלה:** בחירות ← הנשיא מטיל תפקיד ← 42 יום להרכיב ← הצבעת אמון בכנסת`,
  'default': `שאלה מעניינת! **נושאים שאני מכסה:**\n• כנסת ומערכת החקיקה\n• זכויות אדם ואזרח\n• מבנה הממשלה\n• דמוקרטיה ישירה ועקיפה\n• מערכת המשפט\n\nכתוב את הנושא ואסביר.`,
};

function getBotResponse(text: string): string {
  const l = text;
  if (l.includes('כנסת')) return BOT_KNOWLEDGE['כנסת'];
  if (l.includes('זכויות')) return BOT_KNOWLEDGE['זכויות'];
  if (l.includes('דמוקרטיה') || l.includes('ישירה') || l.includes('עקיפה')) return BOT_KNOWLEDGE['דמוקרטיה'];
  if (l.includes('ממשלה')) return BOT_KNOWLEDGE['ממשלה'];
  return BOT_KNOWLEDGE['default'];
}

const MOCK_CONVERSATIONS: Record<number, { role: 'user' | 'bot'; text: string; time: string }[]> = {
  7: [
    { role: 'bot',  text: 'היי דניאל! ראיתי שבמבחן האחרון השגת 72. בואו נחזק את הנושאים שפחות ברורים.', time: '08:14' },
    { role: 'user', text: 'אני לא מבין ביקורת שיפוטית', time: '08:15' },
    { role: 'bot',  text: 'שאלה מצוינת! ביקורת שיפוטית = סמכות בית המשפט לבטל חוק שנוגד את חוקי היסוד. נסביר צעד אחרי צעד...', time: '08:15' },
    { role: 'user', text: 'אוקי הבנתי, ומה זה הפרדת רשויות?', time: '08:18' },
    { role: 'bot',  text: 'מעולה שאתה שואל! הפרדת רשויות היא עיקרון שמחלק את הכוח ל-3 רשויות עצמאיות...', time: '08:18' },
  ],
  11: [
    { role: 'bot',  text: 'היי מיה! ציון 94 מרשים מאוד — ממשיכים לחזק ולהעמיק.', time: '19:02' },
    { role: 'user', text: 'מה ההבדל בין חוק יסוד לחוק רגיל?', time: '19:03' },
    { role: 'bot',  text: 'שאלה עמוקה! חוקי יסוד הם "חוקה בהתהוות" — קשה יותר לשנות אותם ויש להם מעמד עליון...', time: '19:03' },
    { role: 'user', text: 'מצוין תודה! ועוד שאלה — למה ישראל אין חוקה?', time: '19:07' },
    { role: 'bot',  text: 'שאלה מעולה ששנויה במחלוקת! יש לכך כמה סיבות היסטוריות...', time: '19:08' },
  ],
  5: [
    { role: 'bot',  text: 'היי אלון! בואו נלמד ביחד צעד אחרי צעד.', time: '17:30' },
    { role: 'user', text: 'מה זה כנסת', time: '17:31' },
    { role: 'bot',  text: 'כנסת = הרשות המחוקקת. 120 חברים, נבחרים כל 4 שנים. כמו פרלמנט.', time: '17:31' },
    { role: 'user', text: 'כמה חברים יש בה?', time: '17:33' },
    { role: 'bot',  text: '120 חברי כנסת! הספרה הזו קבועה בחוק יסוד. תזכור: 120 = מספר שנות גלות בבל לפי המסורת.', time: '17:33' },
  ],
};

const INJECT_PRESETS = [
  { label: 'תוצאות מבחן', template: 'קיבלת ציון __ במבחן על __. ממוצע הכיתה היה __.' },
  { label: 'מבחן קרוב', template: 'יש מבחן ב-__ על הנושאים: __. כדאי להתחיל לחזור.' },
  { label: 'חולשה מזוהה', template: 'נושא חלש שזוהה: __. התמקד בהסבר הנושא הזה כשהתלמיד שואל.' },
  { label: 'הישג חיובי', template: 'הצגת שיפור ב__. הבוט יציין את ההתקדמות ויעודד.' },
  { label: 'הוראה מיוחדת', template: 'הוראה: לאחר כל תשובה, שאל שאלת בדיקה קצרה לוודא הבנה.' },
];

let injectionCounter = 0;

export default function TutorBot() {
  const [selectedPreview, setSelectedPreview] = useState(ALL_STUDENTS[6]); // Daniel
  const [messages, setMessages]               = useState<Message[]>([]);
  const [input, setInput]                     = useState('');
  const [isTyping, setIsTyping]               = useState(false);
  const [selectedTargets, setSelectedTargets] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll]             = useState(false);
  const [injectText, setInjectText]           = useState('');
  const [injectCategory, setInjectCategory]   = useState('כללי');
  const [injections, setInjections]           = useState<InjectionEntry[]>([
    { id: 1, targets: 'כל הכיתה (20)', content: 'יש מבחן ב-28/4 על מבנה השלטון. חזרו על נושאי הכנסת, ממשלה ומשפט.', time: '22/4 | 20:10', category: 'מבחן קרוב' },
    { id: 2, targets: 'דניאל מזרחי', content: 'קיבלת 72 במבחן. נושאים לחיזוק: ביקורת שיפוטית, הפרדת רשויות.', time: '23/4 | 09:05', category: 'תוצאות מבחן' },
    { id: 3, targets: 'אלון גלזר', content: 'חולשה מזוהה: הגדרות בסיסיות. התמקד בהסבר פשוט ובדוגמאות מהחיים.', time: '23/4 | 09:07', category: 'חולשה מזוהה' },
  ]);
  const [trackingTab, setTrackingTab]         = useState(7);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const score = selectedPreview.id === 7 ? 72 : selectedPreview.id === 11 ? 94 : 55;
    const note  = selectedPreview.id === 7 ? 'ממוקד בחיזוק ביקורת שיפוטית' : selectedPreview.id === 11 ? 'מצטיין — מעמיק בנושאים מתקדמים' : 'לומד צעד אחרי צעד';
    setMessages([{
      role: 'bot',
      text: `היי ${selectedPreview.name}! 👋\n\nאני הבוט האישי שלך לאזרחות. ציון אחרון: **${score}** | ${note}.\n\n**זכור:** אני כאן ללמד — לא לתת תשובות ישירות למבחן 😊\n\nמה תרצה ללמוד היום?`,
    }]);
  }, [selectedPreview]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const send = () => {
    if (!input.trim()) return;
    const txt = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: txt }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: getBotResponse(txt) }]);
    }, 1100);
  };

  const toggleTarget = (id: number) => {
    setSelectedTargets(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
    setSelectAll(false);
  };

  const toggleAll = () => {
    if (selectAll) { setSelectedTargets(new Set()); setSelectAll(false); }
    else           { setSelectedTargets(new Set(ALL_STUDENTS.map(s => s.id))); setSelectAll(true); }
  };

  const handleInject = () => {
    if (!injectText.trim()) return;
    const targets = selectAll ? `כל הכיתה (${ALL_STUDENTS.length})` :
      selectedTargets.size === 0 ? 'לא נבחרו' :
      selectedTargets.size <= 3
        ? ALL_STUDENTS.filter(s => selectedTargets.has(s.id)).map(s => s.name).join(', ')
        : `${selectedTargets.size} תלמידים`;
    const now = new Date();
    const time = `${now.getDate()}/${now.getMonth()+1} | ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    setInjections(prev => [{ id: ++injectionCounter + 10, targets, content: injectText.trim(), time, category: injectCategory }, ...prev]);
    setInjectText('');
    setSelectedTargets(new Set());
    setSelectAll(false);
  };

  const formatText = (text: string) =>
    text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-gray-800 mt-1">{line.replace(/\*\*/g, '')}</p>;
      if (/^[•\d🌍🇮🇱✋🗳]/.test(line)) return <p key={i} className="mr-3 text-gray-700">{line}</p>;
      if (line === '') return <div key={i} className="h-1" />;
      return <p key={i} className="text-gray-700">{line.replace(/\*\*(.*?)\*\*/g, (_, m) => m)}</p>;
    });

  const trackingStudents = [
    { id: 7, name: 'דניאל מזרחי' },
    { id: 11, name: 'מיה אברהם' },
    { id: 5, name: 'אלון גלזר' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">בוטים אישיים</h1>
        <p className="text-gray-500 text-sm mt-1">מורה פרטי לכל תלמיד — מכיר את ההיסטוריה הלימודית, זמין 24/7, ללא תשובות ישירות</p>
      </div>

      {/* ── Inject section ── */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b bg-slate-50">
          <h2 className="font-bold text-gray-800">הזן מידע והוראות לבוטים</h2>
          <p className="text-xs text-gray-500 mt-0.5">בחר תלמידים וכתוב מידע שהבוט יקבל — ציונים, נושאים, הוראות מיוחדות</p>
        </div>
        <div className="p-5 grid grid-cols-3 gap-5">
          {/* Left: student selection */}
          <div className="col-span-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">בחר תלמידים</p>
              <button onClick={toggleAll} className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${selectAll ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'}`}>
                {selectAll ? '✓ כולם' : 'בחר הכל'}
              </button>
            </div>
            <div className="border rounded-xl overflow-hidden max-h-52 overflow-y-auto divide-y">
              {ALL_STUDENTS.map(s => (
                <button
                  key={s.id}
                  onClick={() => toggleTarget(s.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-right transition-colors text-sm ${
                    selectedTargets.has(s.id) || selectAll ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    selectedTargets.has(s.id) || selectAll ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                  }`}>
                    {(selectedTargets.has(s.id) || selectAll) && <span className="text-white text-[9px] font-bold">✓</span>}
                  </span>
                  <img src={s.photo} alt="" className="w-6 h-6 rounded-full shrink-0" />
                  <span className={`truncate ${selectedTargets.has(s.id) || selectAll ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>{s.name}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {selectAll ? `נבחרו כל ${ALL_STUDENTS.length} התלמידים` :
               selectedTargets.size > 0 ? `נבחרו ${selectedTargets.size} תלמידים` : 'לא נבחרו תלמידים'}
            </p>
          </div>

          {/* Right: compose */}
          <div className="col-span-2 flex flex-col gap-3">
            <div className="flex gap-2 flex-wrap">
              {INJECT_PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => { setInjectText(p.template); setInjectCategory(p.label); }}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full border transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <textarea
              value={injectText}
              onChange={e => setInjectText(e.target.value)}
              placeholder="כתוב מידע, נתונים או הוראות לבוט...&#10;לדוגמה: 'קיבלת 85 במבחן על הכנסת. נושא לחיזוק: ביקורת שיפוטית'"
              rows={5}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
            <button
              onClick={handleInject}
              disabled={!injectText.trim() || (!selectAll && selectedTargets.size === 0)}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              שלח לבוטים שנבחרו ←
            </button>
          </div>
        </div>

        {/* Injection log */}
        {injections.length > 0 && (
          <div className="border-t">
            <div className="px-5 py-3 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500">היסטוריית הזרקות ({injections.length})</p>
            </div>
            <div className="divide-y max-h-40 overflow-y-auto">
              {injections.map(inj => (
                <div key={inj.id} className="px-5 py-2.5 flex items-start gap-3">
                  <span className="text-green-500 shrink-0 mt-0.5 text-sm">✓</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-gray-700 truncate">{inj.targets}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full shrink-0">{inj.category}</span>
                      <span className="text-xs text-gray-400 shrink-0 mr-auto">{inj.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{inj.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Preview section ── */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-800">צפייה מקדימה — כך התלמיד רואה את זה</h2>
            <p className="text-xs text-gray-500 mt-0.5">הבוט מותאם אישית לכל תלמיד לפי הנתונים שלו</p>
          </div>
          <select
            value={selectedPreview.id}
            onChange={e => setSelectedPreview(ALL_STUDENTS.find(s => s.id === Number(e.target.value)) ?? ALL_STUDENTS[0])}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {ALL_STUDENTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col" style={{ height: '380px' }}>
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b">
            <img src={selectedPreview.photo} className="w-8 h-8 rounded-full" alt="" />
            <div>
              <p className="font-bold text-sm text-gray-800">בוט אזרחות — {selectedPreview.name}</p>
              <p className="text-xs text-green-600">● מחובר עכשיו</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                }`}>
                  {msg.role === 'bot' ? formatText(msg.text) : <p>{msg.text}</p>}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-end">
                <div className="bg-gray-100 px-3 py-2.5 rounded-2xl rounded-tl-sm flex gap-1">
                  {[0, 150, 300].map(d => <span key={d} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          <div className="px-3 py-2 border-t flex gap-2 flex-wrap">
            {['מה זה כנסת?', 'זכויות אדם', 'דמוקרטיה ישירה', 'מבנה הממשלה'].map(q => (
              <button key={q} onClick={() => setInput(q)} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors">{q}</button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 border-t flex gap-2">
            <input
              type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="כתוב שאלה על אזרחות..."
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={send} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">שלח</button>
          </div>
        </div>
      </div>

      {/* ── Conversation tracking ── */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b flex items-start justify-between">
          <div>
            <h2 className="font-bold text-gray-800">מעקב שיחות תלמידים</h2>
            <p className="text-xs text-gray-500 mt-0.5">שיחות לדוגמה — בבוט אמיתי המחובר ל-API, כל שיחה נשמרת ומוצגת בזמן אמת</p>
          </div>
          <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">דמו</span>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {trackingStudents.map(s => (
            <button
              key={s.id}
              onClick={() => setTrackingTab(s.id)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                trackingTab === s.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
          {(MOCK_CONVERSATIONS[trackingTab] ?? []).map((msg, i) => (
            <div key={i} className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <span className="text-lg shrink-0">{msg.role === 'bot' ? '🤖' : '👤'}</span>
              <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-blue-50 text-blue-900' : 'bg-gray-100 text-gray-800'
              }`}>
                <p>{msg.text}</p>
              </div>
              <span className="text-xs text-gray-400 shrink-0 mt-1">{msg.time}</span>
            </div>
          ))}
        </div>

        <div className="border-t px-5 py-3 bg-gray-50">
          <p className="text-xs text-gray-500">
            💡 <strong>לגבי מעקב שיחות:</strong> בבוט מבוסס Claude API / OpenAI API — כל הודעה נשמרת בדאטאבייס ומוצגת כאן בזמן אמת. בבוטים חיצוניים (NotebookLM, ChatGPT) — לא ניתן לעקוב אחר השיחות.
          </p>
        </div>
      </div>
    </div>
  );
}
