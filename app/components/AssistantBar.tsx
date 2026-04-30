'use client';
import { useState, useRef } from 'react';
import { STUDENTS, PAYMENTS } from '../data';

// ─── Types ────────────────────────────────────────────────────────────────────

type ModalMode = 'voice' | 'text' | null;
type VoiceStep = 'pick' | 'recording' | 'processing' | 'result';

interface ChangeItem { icon: string; text: string; detail?: string; }

interface BotResult {
  kind: 'query' | 'action';
  summary: string;
  changes?: ChangeItem[];
  queryText?: string;
  navigate?: string;
  actionLabel?: string;
  onExecute?: () => void;
}

export interface SchoolActions {
  updatePayment: (studentId: number, paid: number, date: string) => void;
  addDiscipline: (studentId: number, desc: string) => void;
  sendGroupMessage: (text: string) => void;
  addNote: (studentId: number, note: string) => void;
}

// ─── Name matching helpers ────────────────────────────────────────────────────

function findStudentByFirstOrLast(name: string) {
  name = name.trim();
  return STUDENTS.find(s => {
    const parts = s.name.split(' ');
    return parts[0] === name || parts[1] === name || s.name.includes(name);
  }) || null;
}

function findStudentByParent(parentFirstName: string) {
  const p = PAYMENTS.find(p => p.parent.split(' ')[0] === parentFirstName || p.parent.includes(parentFirstName));
  if (!p) return null;
  return STUDENTS.find(s => s.name === p.name) || null;
}

function extractNames(text: string): string[] {
  // Remove common verbs/words and extract likely names (Hebrew capitalized runs)
  const stopWords = ['ניהל','ניהלה','עם','של','ב','ה','ו','לא','גם','היום','ביום','שיחה','הבריז','הבריזה','בריזה','הפריע','חיסור','ישיבה','תשלום','הורים'];
  return text.split(/\s+/).filter(w => w.length >= 2 && !stopWords.includes(w) && /^[א-ת]/.test(w));
}

// ─── Group message drafter ────────────────────────────────────────────────────

function draftGroupMessage(content: string): string {
  const today = '25/4/26';
  if (content.includes('טיול')) {
    return `שלום להורי כיתה י׳ג 😊\n\nרצינו להזכיר כי בעוד כשבועיים (9 במאי 2026) מתקיים הטיול השנתי של כיתתנו!\n\nנבדקו רשימות הנרשמים ועדיין חסרים אישורי הורים מחלק מהתלמידים.\nאנא וודאו כי האישור החתום הוגש לילדכם/ן להגשה בבית הספר עד יום ה׳, 30/4.\n\nלשאלות ופרטים נוספים — אשמח לעמוד לרשותכם.\n\nתודה ושבוע נעים! 🙏\nדוד כהן, מחנך כיתה י׳ג`;
  }
  return `שלום להורי כיתה י׳ג,\n\n${content}\n\nתודה,\nדוד כהן, מחנך כיתה י׳ג`;
}

// ─── Intent parser ────────────────────────────────────────────────────────────

function parseIntent(input: string, actions: SchoolActions, onNavigate: (p: string) => void): BotResult {
  const q = input;

  // ── ACTION: group / individual message ──────────────────────────────────────
  if (/שלח|שלחי|כתוב הודעה|שלחת הודעה/.test(q) && /קבוצ|הורים|כולם/.test(q)) {
    const drafted = draftGroupMessage(q);
    return {
      kind: 'action',
      summary: 'שליחת הודעה לקבוצת הורים',
      changes: [
        { icon: '💬', text: 'ניסחתי הודעה לקבוצת הורים י׳ג (20 הורים)', detail: drafted.slice(0, 80) + '...' },
      ],
      navigate: 'parentcomms',
      actionLabel: 'שלח ועבור לתקשורת הורים →',
      onExecute: () => {
        actions.sendGroupMessage(drafted);
        onNavigate('parentcomms');
      },
    };
  }

  // ── ACTION: payment update ──────────────────────────────────────────────────
  if (/שיל[מם]|השלי[מם]|שלמ|שלמו|תשלום/.test(q)) {
    const words = extractNames(q);
    let student = null;
    let matchedWord = '';
    for (const w of words) {
      // Try as student name first, then as parent
      student = findStudentByFirstOrLast(w) || findStudentByParent(w);
      if (student) { matchedWord = w; break; }
    }
    if (student) {
      const existing = PAYMENTS.find(p => p.name === student!.name);
      const alreadyPaid = existing && existing.paid >= existing.total;
      const today = new Date().toLocaleDateString('he-IL').replace(/\//g, '/');
      return {
        kind: 'action',
        summary: `עדכון תשלום עבור ${student.name}`,
        changes: [
          { icon: '💳', text: `${student.name} — שולם במלא`, detail: `1,200 ₪ | תאריך: ${today}` },
          { icon: '✅', text: 'יתרת חוב אופסה', detail: `${existing ? existing.total - existing.paid : 0} ₪ נסגרו` },
        ],
        navigate: 'payments',
        actionLabel: 'עדכן ועבור לניהול תשלומים →',
        onExecute: () => {
          actions.updatePayment(student!.id, 1200, today);
          onNavigate('payments');
        },
      };
    }
    return { kind: 'query', queryText: q, summary: 'לא זיהיתי שם תלמיד/הורה ברור בהוראה. נסה לציין שם מלא.' };
  }

  // ── ACTION: discipline / skip class ────────────────────────────────────────
  if (/הבריז|הבריזה|בריז|חיסור בלתי|החסיר|הפריע|הפרעה|ביוזמת|לא הגיע|סרב|סירב/.test(q)) {
    const words = extractNames(q);
    const found: typeof STUDENTS[0][] = [];
    const notFound: string[] = [];
    for (const w of words) {
      const s = findStudentByFirstOrLast(w);
      if (s && !found.find(f => f.id === s.id)) found.push(s);
      else if (!s && w.length >= 2 && /^[א-ת]{2,}$/.test(w)) notFound.push(w);
    }

    // Extract the lesson context
    const lessonMatch = q.match(/משיעור\s+(\S+)|ב?שיעור\s+(\S+)/);
    const lesson = lessonMatch ? (lessonMatch[1] || lessonMatch[2]) : 'לא ידוע';
    const today = '25/4/26';
    const desc = `היעדרות בלתי מוצדקת — ${lesson === 'ספורט' ? 'שיעור חינוך גופני' : `שיעור ${lesson}`}`;

    if (found.length === 0) {
      return {
        kind: 'query',
        queryText: q,
        summary: `לא מצאתי תלמידים בשם: ${notFound.join(', ')} בכיתה י׳ג.\nבדוק את הכתיב או חפש ברשימת התלמידים.`,
      };
    }

    const changes: ChangeItem[] = [
      ...found.map(s => ({ icon: '📋', text: `נרשם אירוע משמעת — ${s.name}`, detail: `${desc} | ${today}` })),
      ...(notFound.length ? [{ icon: '⚠️', text: `לא זוהה: ${notFound.join(', ')}`, detail: 'שם לא נמצא ברשימת הכיתה' }] : []),
    ];

    return {
      kind: 'action',
      summary: `רישום אירוע משמעת — ${found.map(s => s.name).join(', ')}`,
      changes,
      navigate: found.length === 1 ? 'tracking' : undefined,
      actionLabel: found.length === 1 ? `פתח פרופיל ${found[0].name} →` : undefined,
      onExecute: () => {
        found.forEach(s => actions.addDiscipline(s.id, desc));
        if (found.length === 1) onNavigate('tracking');
      },
    };
  }

  // ── ACTION: counselor meeting / note ────────────────────────────────────────
  if (/שיחה עם|ישיבה עם|פגישה עם|ביקר|נפגש|דיבר|דיברה/.test(q)) {
    const words = extractNames(q);
    let student = null;
    for (const w of words) {
      student = findStudentByFirstOrLast(w);
      if (student) break;
    }
    const today = '25/4/26';
    const whoMatch = q.match(/עם\s+ה?(\S+)/);
    const with_ = whoMatch ? whoMatch[1] : 'גורם מקצועי';

    if (student) {
      const note = `שיחה עם ${with_} — ${today}`;
      return {
        kind: 'action',
        summary: `תיעוד שיחה — ${student.name}`,
        changes: [
          { icon: '📝', text: `נרשמה הערה בפרופיל ${student.name}`, detail: note },
          { icon: '✅', text: `משימה "הפניה ליועצת" — מסומנת כ"בוצע"`, detail: today },
        ],
        navigate: 'tracking',
        actionLabel: `פתח פרופיל ${student.name} →`,
        onExecute: () => {
          actions.addNote(student!.id, note);
          onNavigate('tracking');
        },
      };
    }

    return {
      kind: 'query',
      queryText: q,
      summary: `לא זיהיתי שם תלמיד ברור. ציין את שם התלמיד שהשיחה נוגעת אליו.`,
    };
  }

  // ── QUERY fallback ──────────────────────────────────────────────────────────
  return {
    kind: 'query',
    queryText: q,
    summary: buildQueryResponse(q),
    navigate: getQueryNav(q),
    actionLabel: getQueryNavLabel(q),
  };
}

// ─── Query responses (read-only) ──────────────────────────────────────────────

function buildQueryResponse(q: string): string {
  const lower = q.toLowerCase();
  if (/לא שיל[מם]|חוב|תשלומ/.test(q)) {
    const unpaid = PAYMENTS.filter(p => p.paid === 0 && p.total > 0);
    const partial = PAYMENTS.filter(p => p.paid > 0 && p.paid < p.total);
    const debt = PAYMENTS.reduce((s, p) => s + (p.total - p.paid), 0);
    return `💳 מצב תשלומים:\n\n✕ לא שילמו (${unpaid.length}): ${unpaid.map(p => p.name).join(', ')}\n↕ חלקי (${partial.length}): ${partial.map(p => p.name).join(', ')}\n\nסה"כ חוב: ${debt.toLocaleString()} ₪`;
  }
  if (/חיסור|נוכחות|לא הגיע/.test(q)) {
    const absent = STUDENTS.filter(s => s.attendance[4] === 'חיסור').map(s => s.name);
    return `📊 חיסורים היום:\n${absent.join(', ') || 'אין חיסורים'}`;
  }
  if (/ממוצע|ציונ|אקדמ/.test(q)) {
    const avg = Math.round(STUDENTS.reduce((s, st) => s + st.grade, 0) / STUDENTS.length);
    return `📈 ממוצע כיתה: ${avg}`;
  }
  if (/דניאל|מזרחי/.test(q)) {
    return `👤 דניאל מזרחי — 12 חיסורים, ממוצע 66, חרדה אקדמית גבוהה (7.5/10), חוב 600 ₪`;
  }
  if (/הורים|תקשורת/.test(q)) {
    return `💬 תקשורת הורים: 6 הודעות השבוע, 5 נענו אוטומטית, 1 ממתינה לטיפולך`;
  }
  return `שמעתי! נסה לכתוב פקודה ספציפית — למשל:\n"דנה קורן הבריזה מספורט"\n"שלח הודעה לקבוצה על הטיול"\n"ההורים של רן אלוני שילמו"`;
}

function getQueryNav(q: string): string | undefined {
  if (/תשלומ/.test(q)) return 'payments';
  if (/הורים/.test(q)) return 'parentcomms';
  if (/חיסור|נוכחות/.test(q)) return 'dashboard';
  return undefined;
}
function getQueryNavLabel(q: string): string | undefined {
  if (/תשלומ/.test(q)) return 'פתח ניהול תשלומים →';
  if (/הורים/.test(q)) return 'פתח תקשורת הורים →';
  return undefined;
}

// ─── Demo phrases ─────────────────────────────────────────────────────────────

const DEMOS = [
  { label: 'בריזה מספורט', phrase: 'דנה קורן ורן אלוני הבריזו משיעור ספורט' },
  { label: 'שיחה עם יועצת', phrase: 'דניאל מזרחי ניהל שיחה עם היועצת היום' },
  { label: 'תשלום שהושלם', phrase: 'ההורים של עידו פרץ השלימו את התשלומים השנתיים היום' },
  { label: 'הודעה לקבוצה', phrase: 'שלח הודעה לקבוצת הורים שמעדכנת שבעוד שבועיים יש טיול שנתי ועדיין חסרים אישורי הורים' },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface AssistantBarProps {
  onNavigate: (page: string) => void;
  onOpenBotPage: () => void;
  actions: SchoolActions;
}

export default function AssistantBar({ onNavigate, onOpenBotPage, actions }: AssistantBarProps) {
  const [modal, setModal] = useState<ModalMode>(null);
  const [voiceStep, setVoiceStep] = useState<VoiceStep>('pick');
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [activePhrase, setActivePhrase] = useState('');
  const [result, setResult] = useState<BotResult | null>(null);
  const [executing, setExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const closeModal = () => {
    setModal(null);
    setVoiceStep('recording');
    setVoiceSeconds(0);
    setActivePhrase('');
    setResult(null);
    setExecuting(false);
    setExecuted(false);
    setTextInput('');
    setLoading(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const processPhrase = (phrase: string) => {
    setActivePhrase(phrase);
    setResult(null);
    setExecuted(false);
    setLoading(true);
    setTimeout(() => {
      setResult(parseIntent(phrase, actions, onNavigate));
      setLoading(false);
    }, 900);
  };

  const startVoice = () => {
    setVoiceStep('recording');
    setVoiceSeconds(0);
    setActivePhrase('');
    setResult(null);
    setExecuted(false);
    timerRef.current = setInterval(() => setVoiceSeconds(s => s + 1), 1000);
  };

  const stopVoice = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    // Pick a random demo phrase to simulate transcription
    const phrase = DEMOS[Math.floor(Math.random() * DEMOS.length)].phrase;
    setVoiceStep('processing');
    setTimeout(() => {
      setActivePhrase(phrase);
      setVoiceStep('result');
      setResult(parseIntent(phrase, actions, onNavigate));
    }, 1600);
  };

  const executeAction = () => {
    if (!result?.onExecute) return;
    setExecuting(true);
    setTimeout(() => {
      result.onExecute!();
      setExecuting(false);
      setExecuted(true);
    }, 800);
  };

  const sendText = () => {
    if (!textInput.trim()) return;
    processPhrase(textInput.trim());
  };

  return (
    <>
      {/* ── Bar ─────────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-l from-indigo-700 to-blue-600 rounded-xl px-4 py-3 shadow-md flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-base shrink-0">🤖</div>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm leading-tight">עוזר אישי חכם</p>
          <p className="text-blue-200 text-xs leading-tight">דבר אליו בקול או בכתב — הוא יבצע ויעדכן</p>
        </div>
        <div className="flex items-center gap-1.5 mr-auto shrink-0">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-300 text-xs">פעיל</span>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => { setModal('voice'); startVoice(); }}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/30 rounded-lg px-3 py-1.5 transition-all text-white text-sm font-medium">
            <span>🎤</span> הקלט
          </button>
          <button
            onClick={() => { setModal('text'); setResult(null); setTextInput(''); }}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/30 rounded-lg px-3 py-1.5 transition-all text-white text-sm font-medium">
            <span>✍️</span> כתוב
          </button>
          <button
            onClick={onOpenBotPage}
            className="flex items-center justify-center bg-white/15 hover:bg-white/25 border border-white/30 rounded-lg px-3 py-1.5 transition-all text-white text-sm font-medium">
            ❓
          </button>
        </div>
      </div>

      {/* ── Modal ───────────────────────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-l from-indigo-700 to-blue-600 px-6 py-4 flex items-center justify-between">
              <p className="text-white font-bold">{modal === 'voice' ? '🎤 הקלט פקודה קולית' : '✍️ כתוב פקודה'}</p>
              <button onClick={closeModal} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
            </div>

            <div className="p-6">
              {/* ── VOICE: recording ─────────────────────────────────────── */}
              {modal === 'voice' && voiceStep === 'recording' && (
                <div className="text-center py-6">
                  <div className="relative w-28 h-28 mx-auto mb-4">
                    {[1,2,3].map(i => (
                      <span key={i} className="absolute inset-0 rounded-full bg-red-400 opacity-25 animate-ping"
                        style={{ animationDelay: `${i*300}ms`, animationDuration:'1.5s' }} />
                    ))}
                    <div className="relative w-28 h-28 rounded-full bg-red-500 flex items-center justify-center text-white text-4xl">🎙</div>
                  </div>
                  <p className="text-red-500 font-bold animate-pulse text-lg">● מקליט...</p>
                  <p className="text-gray-400 text-sm mt-1">{voiceSeconds} שניות</p>
                  <button onClick={stopVoice}
                    className="mt-5 bg-gray-800 hover:bg-gray-900 text-white px-8 py-2.5 rounded-xl text-sm font-medium transition-colors">
                    ■ עצור
                  </button>
                </div>
              )}

              {/* ── VOICE/TEXT: processing ────────────────────────────────── */}
              {(voiceStep === 'processing' || loading) && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3 animate-bounce">🤖</div>
                  <p className="text-gray-600 font-medium">{voiceStep === 'processing' ? 'מתמלל ומנתח...' : 'מנתח פקודה...'}</p>
                  <div className="flex justify-center gap-1 mt-3">
                    {[0,1,2,3,4].map(i => (
                      <div key={i} className="w-1.5 h-5 bg-blue-400 rounded-full animate-pulse"
                        style={{ animationDelay:`${i*120}ms` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Result panel ─────────────────────────────────────────── */}
              {result && !loading && (voiceStep === 'result' || modal === 'text') && (
                <div>
                  {/* Transcription */}
                  {activePhrase && (
                    <div className="bg-gray-100 rounded-xl px-4 py-2 mb-4 flex items-center gap-2">
                      <span className="text-gray-400 text-xs shrink-0">{modal === 'voice' ? 'שמעתי:' : 'שאלת:'}</span>
                      <span className="text-gray-800 text-sm font-medium">"{activePhrase}"</span>
                    </div>
                  )}

                  {/* Action preview */}
                  {result.kind === 'action' && !executed && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs bg-indigo-600 text-white px-2.5 py-0.5 rounded-full font-medium">🎯 זיהיתי פעולה</span>
                        <span className="text-sm font-semibold text-indigo-800">{result.summary}</span>
                      </div>
                      <div className="space-y-2">
                        {result.changes?.map((c, i) => (
                          <div key={i} className="flex items-start gap-2.5 bg-white rounded-lg px-3 py-2 border border-indigo-100">
                            <span className="text-base shrink-0">{c.icon}</span>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{c.text}</p>
                              {c.detail && <p className="text-xs text-gray-500 mt-0.5">{c.detail}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Query response */}
                  {result.kind === 'query' && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                      <span className="text-xs bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-medium block w-fit mb-2">🤖 עוזר</span>
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{result.summary}</pre>
                    </div>
                  )}

                  {/* Executed success */}
                  {executed && (
                    <div className="bg-green-50 border border-green-300 rounded-xl p-4 mb-4 text-center">
                      <div className="text-3xl mb-1.5">✅</div>
                      <p className="font-bold text-green-800">{result.summary}</p>
                      <p className="text-xs text-green-700 mt-0.5">הנתונים עודכנו במערכת</p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-2">
                    {modal === 'text' && !executed && (
                      <button onClick={() => { setResult(null); setTextInput(''); setActivePhrase(''); }}
                        className="flex-1 border text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                        שאלה נוספת
                      </button>
                    )}
                    {result.kind === 'action' && !executed && (
                      <button onClick={executeAction} disabled={executing}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                        {executing ? <><span className="animate-spin">⟳</span> מבצע...</> : '▶ ביצע פעולה'}
                      </button>
                    )}
                    {result.navigate && (executed || result.kind === 'query') && (
                      <button onClick={() => { closeModal(); onNavigate(result.navigate!); }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                        {result.actionLabel ?? 'עבור לדף →'}
                      </button>
                    )}
                    {executed && !result.navigate && (
                      <button onClick={closeModal}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                        סגור
                      </button>
                    )}
                  </div>

                  {/* New recording */}
                  {modal === 'voice' && (
                    <button onClick={() => { startVoice(); setResult(null); setExecuted(false); }}
                      className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 py-1.5">
                      🎤 הקלטה חדשה
                    </button>
                  )}
                </div>
              )}

              {/* ── TEXT: input ──────────────────────────────────────────── */}
              {modal === 'text' && !result && !loading && (
                <>
                  <div className="flex gap-2 mb-3">
                    <input type="text" value={textInput} onChange={e => setTextInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendText()} autoFocus
                      placeholder="כתוב פקודה חופשית..."
                      className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <button onClick={sendText}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl text-sm font-medium transition-colors">
                      שלח
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">דוגמאות לפקודות:</p>
                  <div className="space-y-1.5">
                    {DEMOS.map((d, i) => (
                      <button key={i} onClick={() => { setTextInput(d.phrase); processPhrase(d.phrase); }}
                        className="w-full text-right bg-gray-50 hover:bg-indigo-50 border hover:border-indigo-200 rounded-lg px-3 py-2 text-xs text-gray-700 transition-colors">
                        "{d.phrase}"
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
