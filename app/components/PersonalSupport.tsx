'use client';
import { useState } from 'react';
import {
  STUDENTS, COUNSELOR_REFERRALS, SPECIAL_SESSIONS, SUPPORT_BANK,
  CounselorReferral, SpecialSession, SessionType, Urgency,
} from '../data';

const SESSION_TYPES: SessionType[] = ['פרטני', 'טיפולי', 'מצויינות', 'אחר'];
const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'];

const URGENCY_STYLE: Record<Urgency, string> = {
  'גבוהה':   'bg-red-100 text-red-700 border-red-200',
  'בינונית': 'bg-amber-100 text-amber-700 border-amber-200',
  'נמוכה':   'bg-green-100 text-green-700 border-green-200',
};

const TYPE_STYLE: Record<SessionType, string> = {
  'פרטני':    'bg-blue-100 text-blue-700',
  'טיפולי':   'bg-purple-100 text-purple-700',
  'מצויינות': 'bg-amber-100 text-amber-700',
  'אחר':      'bg-gray-100 text-gray-600',
};

function studentById(id: number) {
  return STUDENTS.find(s => s.id === id);
}

export default function PersonalSupport() {
  const [referrals, setReferrals]     = useState<CounselorReferral[]>(COUNSELOR_REFERRALS);
  const [sessions, setSessions]       = useState<SpecialSession[]>(SPECIAL_SESSIONS);
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [noteText, setNoteText]       = useState('');
  const [addReferralOpen, setAddReferralOpen]   = useState(false);
  const [addSessionOpen, setAddSessionOpen]     = useState(false);
  const [tab, setTab]                 = useState<'counselor' | 'sessions' | 'bank'>('counselor');

  // New referral form
  const [newRef, setNewRef] = useState({ studentId: 0, reason: '', urgency: 'בינונית' as Urgency, note: '' });

  // New session form
  const [newSess, setNewSess] = useState({
    studentId: 0, type: 'פרטני' as SessionType,
    teacher: '', subject: '', day: 'שני', time: '',
  });

  const saveNote = (idx: number) => {
    setReferrals(prev => prev.map((r, i) => i === idx ? { ...r, note: noteText } : r));
    setEditingNote(null);
  };

  const removeReferral = (idx: number) => setReferrals(prev => prev.filter((_, i) => i !== idx));
  const removeSession  = (id: number)  => setSessions(prev => prev.filter(s => s.id !== id));

  const addReferral = () => {
    if (!newRef.studentId || !newRef.reason) return;
    setReferrals(prev => [...prev, { ...newRef, addedBy: 'דוד כהן' }]);
    setNewRef({ studentId: 0, reason: '', urgency: 'בינונית', note: '' });
    setAddReferralOpen(false);
  };

  const addSession = () => {
    if (!newSess.studentId || !newSess.teacher || !newSess.subject || !newSess.time) return;
    const maxId = sessions.reduce((m, s) => Math.max(m, s.id), 0);
    setSessions(prev => [...prev, { ...newSess, id: maxId + 1 }]);
    setNewSess({ studentId: 0, type: 'פרטני', teacher: '', subject: '', day: 'שני', time: '' });
    setAddSessionOpen(false);
  };

  const studentsNotInSessions = STUDENTS.filter(
    s => !sessions.some(sess => sess.studentId === s.id)
  );

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">מענים אישיים — כיתה י׳ג</h1>
        <p className="text-gray-500 text-sm mt-1">ניהול הפניות ליועצת ושעות פרטניות לתלמידים</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 border-b">
        {([
          ['counselor', '🧠 הפניות ליועצת', referrals.length],
          ['sessions',  '📅 שעות פרטניות / ייחודיות', sessions.length],
          ['bank',      '🏦 בנק מענים זמינים', SUPPORT_BANK.length],
        ] as [string, string, number][]).map(([id, label, count]) => (
          <button
            key={id}
            onClick={() => setTab(id as any)}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              tab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
          </button>
        ))}
      </div>

      {/* ── COUNSELOR REFERRALS ── */}
      {tab === 'counselor' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              רשימת תלמידים להפניה ליועצת — מוצגת לכל מחנכי השכבה
            </p>
            <button
              onClick={() => setAddReferralOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              + הוסף הפניה
            </button>
          </div>

          {referrals.length === 0 && (
            <div className="text-center py-12 text-gray-400">אין הפניות כרגע</div>
          )}

          <div className="space-y-3">
            {referrals.map((ref, idx) => {
              const student = studentById(ref.studentId);
              if (!student) return null;
              return (
                <div key={idx} className={`bg-white rounded-xl border p-4 ${URGENCY_STYLE[ref.urgency].split(' ')[2]}`}>
                  <div className="flex items-start gap-3">
                    <img src={student.photo} className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800">{student.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${URGENCY_STYLE[ref.urgency]}`}>
                          דחיפות: {ref.urgency}
                        </span>
                        <span className="text-xs text-gray-400">הוסף ע"י {ref.addedBy}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{ref.reason}</p>

                      {/* Note */}
                      {editingNote === idx ? (
                        <div className="mt-2 flex gap-2">
                          <input
                            value={noteText}
                            onChange={e => setNoteText(e.target.value)}
                            placeholder="הוסף הערה..."
                            className="flex-1 text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            autoFocus
                          />
                          <button onClick={() => saveNote(idx)} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg">שמור</button>
                          <button onClick={() => setEditingNote(null)} className="text-xs border text-gray-500 px-3 py-1.5 rounded-lg">בטל</button>
                        </div>
                      ) : ref.note ? (
                        <p
                          className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 mt-2 cursor-pointer hover:bg-amber-100"
                          onClick={() => { setEditingNote(idx); setNoteText(ref.note); }}
                        >
                          📝 {ref.note}
                        </p>
                      ) : (
                        <button
                          onClick={() => { setEditingNote(idx); setNoteText(''); }}
                          className="mt-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          + הוסף הערה
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      <select
                        value={ref.urgency}
                        onChange={e => setReferrals(prev => prev.map((r, i) => i === idx ? { ...r, urgency: e.target.value as Urgency } : r))}
                        className="text-xs border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                      >
                        <option value="גבוהה">דחיפות גבוהה</option>
                        <option value="בינונית">דחיפות בינונית</option>
                        <option value="נמוכה">דחיפות נמוכה</option>
                      </select>
                      <button
                        onClick={() => removeReferral(idx)}
                        className="text-xs text-red-400 hover:text-red-600 text-center py-1 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        הסר
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SPECIAL SESSIONS ── */}
      {tab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{sessions.length} תלמידים מקבלים שעות פרטניות או ייחודיות</p>
            <button
              onClick={() => setAddSessionOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              + הוסף תלמיד
            </button>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['תלמיד', 'סוג מפגש', 'מורה', 'מקצוע', 'יום', 'שעה', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {sessions.map(sess => {
                  const student = studentById(sess.studentId);
                  if (!student) return null;
                  return (
                    <tr key={sess.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={student.photo} className="w-8 h-8 rounded-full object-cover" alt="" />
                          <span className="font-medium text-gray-800">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_STYLE[sess.type]}`}>{sess.type}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{sess.teacher}</td>
                      <td className="px-4 py-3 text-gray-600">{sess.subject}</td>
                      <td className="px-4 py-3 text-gray-600">{sess.day}</td>
                      <td className="px-4 py-3 text-gray-600 font-mono">{sess.time}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => removeSession(sess.id)}
                          className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                        >
                          הסר
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {sessions.length === 0 && (
              <div className="text-center py-12 text-gray-400">אין שעות פרטניות רשומות</div>
            )}
          </div>
        </div>
      )}

      {/* ── SUPPORT BANK ── */}
      {tab === 'bank' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            מענים זמינים שלא בשימוש כרגע — ניתן לשבץ אליהם תלמידים מכל כיתה
          </p>
          <div className="grid grid-cols-2 gap-4">
            {SUPPORT_BANK.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border shadow-sm p-5 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_STYLE[item.type]}`}>{item.type}</span>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {item.slots} מקומות פנויים
                  </span>
                </div>
                <p className="font-semibold text-gray-800 mb-1">{item.subject}</p>
                <p className="text-sm text-gray-600 mb-3">{item.teacher}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>📅 יום {item.day}</span>
                  <span>🕐 {item.time}</span>
                </div>
                {item.notes && (
                  <p className="text-xs text-gray-500 mt-3 pt-3 border-t leading-relaxed">{item.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ADD REFERRAL MODAL ── */}
      {addReferralOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setAddReferralOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-800 mb-4">הוסף הפניה ליועצת</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">תלמיד</label>
                <select
                  value={newRef.studentId}
                  onChange={e => setNewRef(p => ({ ...p, studentId: +e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value={0}>בחר תלמיד...</option>
                  {STUDENTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">סיבת ההפניה</label>
                <input
                  value={newRef.reason}
                  onChange={e => setNewRef(p => ({ ...p, reason: e.target.value }))}
                  placeholder="תאר את הסיבה..."
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">דחיפות</label>
                <div className="flex gap-2">
                  {(['גבוהה', 'בינונית', 'נמוכה'] as Urgency[]).map(u => (
                    <button
                      key={u}
                      onClick={() => setNewRef(p => ({ ...p, urgency: u }))}
                      className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${newRef.urgency === u ? URGENCY_STYLE[u] : 'bg-white text-gray-500 border-gray-300'}`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">הערה (רשות)</label>
                <textarea
                  value={newRef.note}
                  onChange={e => setNewRef(p => ({ ...p, note: e.target.value }))}
                  placeholder="הערות נוספות..."
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setAddReferralOpen(false)} className="flex-1 border text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">בטל</button>
              <button
                onClick={addReferral}
                disabled={!newRef.studentId || !newRef.reason}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                הוסף הפניה
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD SESSION MODAL ── */}
      {addSessionOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setAddSessionOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-800 mb-4">הוסף שעה פרטנית / ייחודית</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">תלמיד</label>
                <select
                  value={newSess.studentId}
                  onChange={e => setNewSess(p => ({ ...p, studentId: +e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value={0}>בחר תלמיד...</option>
                  {STUDENTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">סוג מפגש</label>
                <div className="flex gap-2 flex-wrap">
                  {SESSION_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => setNewSess(p => ({ ...p, type: t }))}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${newSess.type === t ? TYPE_STYLE[t] + ' border-current' : 'bg-white text-gray-500 border-gray-300'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">שם המורה</label>
                  <input
                    value={newSess.teacher}
                    onChange={e => setNewSess(p => ({ ...p, teacher: e.target.value }))}
                    placeholder='ד"ר...'
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">מקצוע</label>
                  <input
                    value={newSess.subject}
                    onChange={e => setNewSess(p => ({ ...p, subject: e.target.value }))}
                    placeholder="מתמטיקה..."
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">יום</label>
                  <select
                    value={newSess.day}
                    onChange={e => setNewSess(p => ({ ...p, day: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {DAYS.map(d => <option key={d} value={d}>יום {d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">שעה</label>
                  <input
                    type="time"
                    value={newSess.time}
                    onChange={e => setNewSess(p => ({ ...p, time: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setAddSessionOpen(false)} className="flex-1 border text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">בטל</button>
              <button
                onClick={addSession}
                disabled={!newSess.studentId || !newSess.teacher || !newSess.subject || !newSess.time}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                הוסף
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
