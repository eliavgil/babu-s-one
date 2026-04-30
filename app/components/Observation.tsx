'use client';
import { useState } from 'react';
import { OBSERVATION_SCHEDULE } from '../data';

const APRIL_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);
const FIRST_DAY_OFFSET = 1; // April 1, 2026 = Tuesday (index 1 in Sun-based week)
const WEEKDAY_LABELS = ['א', 'ב', 'ג', 'ד', 'ה'];

const dateKey = (day: number) => `${day}/4`;

interface ObservationEntry {
  teacher: string; subject: string; class: string; time: string; topic: string;
}

export default function Observation() {
  const [selectedDay, setSelectedDay] = useState<number | null>(24);
  const [messageModal, setMessageModal] = useState<ObservationEntry | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<ObservationEntry | null>(null);
  const [messageSent, setMessageSent] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [offerDone, setOfferDone] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackScore, setFeedbackScore] = useState(4);

  const selectedSchedule = selectedDay ? (OBSERVATION_SCHEDULE[dateKey(selectedDay)] || []) : [];
  const daysWithClasses = new Set(Object.keys(OBSERVATION_SCHEDULE).map(k => parseInt(k)));

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ניהול שיעורי צפייה</h1>
          <p className="text-gray-500 text-sm mt-1">לוח שיעורים פתוחים לצפייה | אפריל 2026</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setUploadDone(true); setTimeout(() => setUploadDone(false), 3000); }}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-colors ${uploadDone ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
          >
            {uploadDone ? '✓ המערכת עודכנה!' : '📅 העלה את המערכת שלי'}
          </button>
          <button
            onClick={() => { setOfferDone(true); setTimeout(() => setOfferDone(false), 3000); }}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-colors ${offerDone ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {offerDone ? '✓ השיעורים פורסמו!' : '➕ הצע שיעורים לצפייה בי'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Calendar */}
        <div className="col-span-2 bg-white rounded-2xl border shadow-sm">
          <div className="px-5 py-4 border-b">
            <h2 className="font-bold text-gray-700">אפריל 2026</h2>
          </div>
          <div className="p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {['שבת','שישי','חמישי','רביעי','שלישי','שני','ראשון'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">{d}</div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for offset - April 2026 starts on Wednesday = offset 4 from Sunday */}
              {Array.from({ length: 3 }).map((_, i) => <div key={`empty-${i}`} />)}
              {APRIL_DAYS.map(day => {
                const key = dateKey(day);
                const hasClasses = daysWithClasses.has(day);
                const isWeekend = (day + 2) % 7 >= 5; // Sat/Fri
                const isSelected = selectedDay === day;
                const isToday = day === 24;
                if (isWeekend) return <div key={day} className="h-10 flex items-center justify-center"><span className="text-xs text-gray-300">{day}</span></div>;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`h-10 rounded-lg text-sm font-medium transition-all relative
                      ${isSelected ? 'bg-blue-600 text-white shadow-md' : ''}
                      ${!isSelected && hasClasses ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : ''}
                      ${!isSelected && !hasClasses ? 'text-gray-400 hover:bg-gray-100' : ''}
                      ${isToday && !isSelected ? 'ring-2 ring-blue-400' : ''}
                    `}
                  >
                    {day}
                    {hasClasses && !isSelected && <span className="absolute bottom-1 right-1/2 translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="px-5 py-3 border-t bg-gray-50 rounded-b-2xl flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-50 border border-blue-200 inline-block"/>יש שיעורים לצפייה</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded ring-2 ring-blue-400 inline-block"/>היום</span>
          </div>
        </div>

        {/* Selected day */}
        <div className="bg-white rounded-2xl border shadow-sm flex flex-col">
          <div className="px-4 py-4 border-b">
            <h2 className="font-bold text-gray-700">
              {selectedDay ? `שיעורים ב-${selectedDay}/4` : 'בחר יום בלוח'}
            </h2>
          </div>
          <div className="flex-1 p-4">
            {selectedSchedule.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">אין שיעורים פתוחים לצפייה ביום זה</p>
            ) : (
              <div className="space-y-3">
                {selectedSchedule.map((entry, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-3 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-bold text-sm text-gray-800">{entry.teacher}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{entry.time}</span>
                    </div>
                    <p className="text-xs text-blue-600 font-medium">{entry.subject} | {entry.class}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{entry.topic}</p>
                    <div className="flex gap-2 mt-2.5">
                      <button
                        onClick={() => { setMessageModal(entry); setMessageSent(false); setMessageText(''); }}
                        className="flex-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded-lg transition-colors"
                      >
                        ✉️ שלח הודעה
                      </button>
                      <button
                        onClick={() => { setFeedbackModal(entry); setFeedbackSent(false); setFeedbackText(''); }}
                        className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 py-1.5 rounded-lg transition-colors"
                      >
                        📋 משוב
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message modal */}
      {messageModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setMessageModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            {messageSent ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-3">✅</div>
                <p className="font-bold text-gray-800">ההודעה נשלחה!</p>
                <p className="text-sm text-gray-500 mt-1">ל-{messageModal.teacher}</p>
                <button onClick={() => setMessageModal(null)} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm">סגור</button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-gray-800 mb-1">שלח הודעה ל-{messageModal.teacher}</h3>
                <p className="text-sm text-gray-500 mb-4">בנוגע לשיעור: {messageModal.subject} — {messageModal.topic}</p>
                <textarea
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder={`שלום ${messageModal.teacher},\n\nאשמח להיכנס לשיעורך ב-${selectedDay}/4 בשעה ${messageModal.time}.\n\nתודה, דוד`}
                  className="w-full border rounded-xl p-3 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setMessageModal(null)} className="flex-1 border text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">ביטול</button>
                  <button onClick={() => setMessageSent(true)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">שלח הודעה</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Feedback modal */}
      {feedbackModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setFeedbackModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            {feedbackSent ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-3">✅</div>
                <p className="font-bold text-gray-800">המשוב נשלח!</p>
                <p className="text-sm text-gray-500 mt-1">{feedbackModal.teacher} יקבל את המשוב שלך</p>
                <button onClick={() => setFeedbackModal(null)} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm">סגור</button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-gray-800 mb-1">משוב על שיעור — {feedbackModal.teacher}</h3>
                <p className="text-sm text-gray-500 mb-4">{feedbackModal.subject} | {feedbackModal.topic}</p>
                <p className="text-sm font-medium text-gray-700 mb-2">דירוג כללי:</p>
                <div className="flex gap-2 mb-4">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setFeedbackScore(n)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${feedbackScore >= n ? 'bg-yellow-400 border-yellow-500 text-white' : 'border-gray-200 text-gray-400'}`}>
                      ★
                    </button>
                  ))}
                </div>
                {[
                  { label: 'ניהול כיתה', placeholder: 'כיצד המורה ניהל את הכיתה?' },
                  { label: 'שיטת הוראה', placeholder: 'אילו שיטות הוראה נעשה בהן שימוש?' },
                  { label: 'מה למדתי', placeholder: 'מה אני לוקח לשיעורים שלי?' },
                ].map(field => (
                  <div key={field.label} className="mb-3">
                    <label className="text-xs font-medium text-gray-600 mb-1 block">{field.label}</label>
                    <textarea placeholder={field.placeholder} className="w-full border rounded-lg p-2 text-xs h-16 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                ))}
                <div className="flex gap-3 mt-2">
                  <button onClick={() => setFeedbackModal(null)} className="flex-1 border text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">ביטול</button>
                  <button onClick={() => setFeedbackSent(true)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">שלח משוב</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
