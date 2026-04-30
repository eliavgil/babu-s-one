'use client';
import { useState } from 'react';
import { MEETING_TYPES, SAMPLE_MEETING_SUMMARY } from '../data';

type Step = 'setup' | 'recording' | 'processing' | 'summary';

export default function Meetings() {
  const [step, setStep] = useState<Step>('setup');
  const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setStep('recording');
    const t = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    setTimer(t);
  };

  const stopRecording = () => {
    if (timer) clearInterval(timer);
    setIsRecording(false);
    setStep('processing');
    setTimeout(() => setStep('summary'), 3000);
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const reset = () => {
    setStep('setup');
    setRecordingSeconds(0);
    setMeetingType(MEETING_TYPES[0]);
  };

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">סיכום ישיבות אוטומטי</h1>
        <p className="text-gray-500 text-sm mt-1">הקלט את הישיבה — AI מתמלל, מסכם ומחלץ משימות אוטומטית</p>
      </div>

      {step === 'setup' && (
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🎙</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">הכן ישיבה להקלטה</h2>
            <p className="text-gray-500 text-sm mb-6">בחר את סוג הישיבה לפני ההקלטה — ה-AI ינתח את התוכן בהתאם</p>

            <div className="text-right mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">סוג הישיבה:</label>
              <div className="grid grid-cols-2 gap-2">
                {MEETING_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setMeetingType(type)}
                    className={`py-2.5 px-3 rounded-xl text-sm border-2 transition-colors text-right ${meetingType === type ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-right mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">מה יקרה אחרי ההקלטה:</p>
              {['תמלול אוטומטי של כל הנאמר', 'חילוץ נושאים עיקריים', 'זיהוי החלטות', 'משימות עם שם אחראי + תאריך'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <span className="text-green-500">✓</span>{item}
                </div>
              ))}
            </div>

            <button
              onClick={startRecording}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl text-lg transition-colors"
            >
              🔴 התחל הקלטה
            </button>
          </div>
        </div>
      )}

      {step === 'recording' && (
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-red-200 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-500" />
                </div>
              </div>
            </div>
            <p className="text-2xl font-mono font-bold text-gray-800 mb-2">{formatTime(recordingSeconds)}</p>
            <p className="text-red-500 font-medium mb-1">● מקליט...</p>
            <p className="text-gray-500 text-sm mb-2">{meetingType}</p>
            <p className="text-xs text-gray-400 mb-8">דבר בצורה ברורה — המיקרופון פעיל</p>

            {/* Fake audio wave */}
            <div className="flex items-center justify-center gap-0.5 h-8 mb-8">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-red-400 rounded-full animate-pulse"
                  style={{ height: `${Math.random() * 24 + 4}px`, animationDelay: `${i * 50}ms` }}
                />
              ))}
            </div>

            <button
              onClick={stopRecording}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 rounded-xl text-lg transition-colors"
            >
              ■ עצור והפק סיכום
            </button>
          </div>
        </div>
      )}

      {step === 'processing' && (
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl border shadow-sm p-10 text-center">
            <div className="text-5xl mb-4 animate-bounce">🤖</div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">מעבד את הישיבה...</h2>
            <div className="space-y-3">
              {[
                { label: 'תמלול הקלטה', done: true },
                { label: 'ניתוח תוכן ונושאים', done: true },
                { label: 'חילוץ החלטות ומשימות', done: false },
                { label: 'פירמוט סיכום סופי', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    {item.done ? '✓' : ''}
                  </span>
                  <span className={item.done ? 'text-gray-700' : 'text-gray-400'}>{item.label}</span>
                  {!item.done && <span className="text-xs text-blue-500 animate-pulse">מעבד...</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="space-y-5">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-bold text-green-800">הסיכום מוכן!</p>
                <p className="text-sm text-green-700">{SAMPLE_MEETING_SUMMARY.type} | {SAMPLE_MEETING_SUMMARY.date}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-white border text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">📋 העתק</button>
              <button className="bg-white border text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">📤 שלח לצוות</button>
              <button onClick={reset} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">+ ישיבה חדשה</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Header info */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><span>📋</span> פרטי הישיבה</h3>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2"><span className="text-gray-500 w-20">סוג:</span><span className="font-medium">{SAMPLE_MEETING_SUMMARY.type}</span></div>
                <div className="flex gap-2"><span className="text-gray-500 w-20">תאריך:</span><span>{SAMPLE_MEETING_SUMMARY.date}</span></div>
                <div className="flex gap-2"><span className="text-gray-500 w-20">שעות:</span><span>{SAMPLE_MEETING_SUMMARY.time}</span></div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-500 mb-2">משתתפים:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_MEETING_SUMMARY.attendees.map((a, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">{a}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Topics */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><span>🗣</span> נושאים שעלו</h3>
              <ul className="space-y-2">
                {SAMPLE_MEETING_SUMMARY.topics.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-500 font-bold mt-0.5">•</span>{t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Decisions */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><span>✅</span> החלטות</h3>
              <ul className="space-y-2">
                {SAMPLE_MEETING_SUMMARY.decisions.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span>{d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action items */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><span>📌</span> משימות לביצוע</h3>
              <div className="space-y-2">
                {SAMPLE_MEETING_SUMMARY.actions.map((a, i) => (
                  <div key={i} className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{a.task}</p>
                      <p className="text-xs text-gray-500">אחראי: <span className="text-blue-600 font-medium">{a.owner}</span></p>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-lg shrink-0 mr-2">{a.due}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
