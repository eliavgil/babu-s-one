'use client';
import { STUDENTS, DASHBOARD_TASKS, DASHBOARD_EVENTS, AttendanceStatus, Student } from '../data';
import { useState } from 'react';
import AssistantBar, { SchoolActions } from './AssistantBar';

function getAbsentStreak(attendance: AttendanceStatus[]): number {
  let streak = 0;
  for (let i = attendance.length - 1; i >= 0; i--) {
    if (attendance[i] === 'חיסור') streak++;
    else break;
  }
  return streak;
}

const AI_TIPS: Record<number, string> = {
  1:  'ציון יפה במבחן האחרון (78). ממשיך במגמה יציבה.',
  2:  'שיפור ניכר בציונים לאחרונה. כדאי לחזק את המוטיבציה.',
  3:  'נפגש עם היועצת אתמול — המשך מעקב מומלץ.',
  4:  'ציון מצוין (91). מועמד לתוכנית מצוינות.',
  5:  'ריבוי חיסורים השבוע — כדאי לדבר עם ההורים.',
  6:  'יום הולדת עוד 5 ימים! כדאי לאחל בכיתה.',
  7:  'מעקב פעיל — נמצא בתהליך עם היועצת. ראה פרופיל מלא.',
  8:  'ביצועים מצוינים (88). יציב וממוקד.',
  9:  'חיסור היום — לא קיבלנו אישור מההורים.',
  10: 'ממתין לאישור הנחה בתשלומים — לא לשכוח לעדכן.',
  11: 'הציון הגבוה בכיתה (94). שקלי להציע העשרה נוספת.',
  12: 'איחרה היום — אמא שלחה הודעה שהייתה פגישה רפואית.',
  13: 'מלגה מלאה מאושרת. תפקוד תקין.',
  14: 'הגישה את הפרויקט בזמן — עבודה מרשימה.',
  15: 'ציון 90 — יציבה ומצטיינת.',
  16: 'פיגור בתשלום — הסכם פריסה בתהליך.',
  17: 'ציון 95 — המצטיינת של הכיתה השבוע.',
  18: 'חיסרה ביום רביעי — הגישה אישור.',
  19: 'כל המשימות מוגשות בזמן. תלמידה מסודרת.',
  20: 'קשיים כלכליים בבית — נמסר לרכזת רווחה.',
};

const ALERTS: Record<number, string> = {
  5:  'ריבוי חיסורים ואיחורים — 4 ימים החודש. לא הביא אישור הורים לטיול.',
  7:  'שני חיסורים ברצף באמצע השבוע. ציון ספרות בירידה.',
  9:  'חיסור היום ללא אישור הורים.',
  20: 'ציון נמוך (59) + 2 חיסורים השבוע.',
};

type TooltipState = { text: string; x: number; y: number; kind: 'tip' | 'alert' } | null;

function StudentCard({
  student,
  onViewProfile,
  onTooltip,
}: {
  student: Student;
  onViewProfile: () => void;
  onTooltip: (t: TooltipState) => void;
}) {
  const streak = getAbsentStreak(student.attendance);
  const tip = AI_TIPS[student.id];
  const alert = ALERTS[student.id] || (streak >= 2 ? `${streak} ימי חיסור ברצף` : null);

  const streakBg =
    streak === 0 ? 'bg-green-100 text-green-700' :
    streak === 1 ? 'bg-amber-100 text-amber-700' :
                   'bg-red-100 text-red-700';

  const show = (e: React.MouseEvent, kind: 'tip' | 'alert') => {
    const text = kind === 'tip' ? tip : alert;
    if (!text) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    onTooltip({ text, x: rect.left + rect.width / 2, y: rect.top, kind });
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors">
      <img src={student.photo} alt={student.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
      <button
        onClick={student.id === 7 ? onViewProfile : undefined}
        className={`text-sm font-medium text-right leading-tight flex-1 min-w-0 truncate ${
          student.id === 7 ? 'text-blue-600 hover:underline cursor-pointer' : 'text-gray-800 cursor-default'
        }`}
      >
        {student.name}
      </button>
      <div className="flex items-center gap-0.5 shrink-0">
        <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${streakBg}`}>
          {streak}
        </span>
        <button
          onMouseEnter={e => show(e, 'tip')}
          onMouseLeave={() => onTooltip(null)}
          onClick={e => show(e, 'tip')}
          className="w-7 h-7 flex items-center justify-center text-base hover:scale-110 transition-transform"
        >
          🤖
        </button>
        {alert ? (
          <button
            onMouseEnter={e => show(e, 'alert')}
            onMouseLeave={() => onTooltip(null)}
            onClick={e => show(e, 'alert')}
            className="w-7 h-7 flex items-center justify-center text-base hover:scale-110 transition-transform"
          >
            🛑
          </button>
        ) : (
          <span className="w-7 h-7" />
        )}
      </div>
    </div>
  );
}

export default function Dashboard({
  onViewProfile,
  onNavigate,
  onOpenBotPage,
  schoolActions,
}: {
  onViewProfile: () => void;
  onNavigate: (p: string) => void;
  onOpenBotPage: () => void;
  schoolActions: SchoolActions;
}) {
  const [tasks, setTasks] = useState(DASHBOARD_TASKS);
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <AssistantBar onNavigate={onNavigate} onOpenBotPage={onOpenBotPage} actions={schoolActions} />

      <div className="grid grid-cols-3 gap-6">
        {/* Students — 2 columns */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="font-bold text-gray-800">תלמידי הכיתה</h2>
          </div>
          <div className="p-3 grid grid-cols-2 gap-1.5 max-h-[540px] overflow-y-auto">
            {STUDENTS.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                onViewProfile={onViewProfile}
                onTooltip={setTooltip}
              />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border">
            <div className="px-5 py-4 border-b">
              <h2 className="font-bold text-gray-800">משימות לביצוע</h2>
            </div>
            <div className="p-4 space-y-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    task.done ? 'bg-gray-50 opacity-60' :
                    task.urgent ? 'bg-red-50 border-red-200' :
                    'bg-white border-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}
                    className="mt-0.5 shrink-0 accent-blue-600"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-tight ${task.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.text}</p>
                    <p className={`text-xs mt-0.5 ${task.urgent && !task.done ? 'text-red-500 font-medium' : 'text-gray-400'}`}>{task.due}</p>
                  </div>
                  {task.urgent && !task.done && <span className="text-red-400 text-xs shrink-0">דחוף</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border">
            <div className="px-5 py-4 border-b">
              <h2 className="font-bold text-gray-800">אירועים קרובים</h2>
            </div>
            <div className="p-4 space-y-2">
              {DASHBOARD_EVENTS.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <div className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1.5 rounded-lg text-center min-w-[44px]">
                    {ev.date}
                  </div>
                  <p className="text-sm text-gray-700">{ev.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating tooltip — rendered at root level to avoid overflow clipping */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y - 10,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
          className={`text-xs text-white rounded-xl px-3 py-2 shadow-xl max-w-[220px] text-right leading-relaxed ${
            tooltip.kind === 'alert' ? 'bg-red-700' : 'bg-slate-800'
          }`}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
