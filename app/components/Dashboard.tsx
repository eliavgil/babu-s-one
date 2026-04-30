'use client';
import { STUDENTS, DASHBOARD_TASKS, DASHBOARD_EVENTS, WEEK_DATES, DAYS_HEBREW, AttendanceStatus } from '../data';
import { useState } from 'react';
import AssistantBar, { SchoolActions } from './AssistantBar';

const statusColor: Record<AttendanceStatus, string> = {
  'נוכח':  'bg-green-100 text-green-700',
  'חיסור': 'bg-red-100 text-red-600',
  'איחור': 'bg-amber-100 text-amber-700',
};
const statusDot: Record<AttendanceStatus, string> = {
  'נוכח':  'bg-green-500',
  'חיסור': 'bg-red-500',
  'איחור': 'bg-amber-400',
};

export default function Dashboard({ onViewProfile, onNavigate, onOpenBotPage, schoolActions }: { onViewProfile: () => void; onNavigate: (p: string) => void; onOpenBotPage: () => void; schoolActions: SchoolActions }) {
  const [tasks, setTasks] = useState(DASHBOARD_TASKS);
  const todayAbsences = STUDENTS.filter(s => s.attendance[4] === 'חיסור').length;
  const todayLate     = STUDENTS.filter(s => s.attendance[4] === 'איחור').length;
  const weekAbsences  = STUDENTS.reduce((sum, s) => sum + s.attendance.filter(a => a === 'חיסור').length, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Assistant bar */}
      <AssistantBar onNavigate={onNavigate} onOpenBotPage={onOpenBotPage} actions={schoolActions} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">שלום, דוד 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5">יום חמישי, 24 באפריל 2026 | כיתת החינוך: י׳ג</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white rounded-xl shadow-sm border px-4 py-3 text-center">
            <p className="text-2xl font-bold text-red-500">{todayAbsences}</p>
            <p className="text-xs text-gray-500">חיסורים היום</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border px-4 py-3 text-center">
            <p className="text-2xl font-bold text-amber-500">{todayLate}</p>
            <p className="text-xs text-gray-500">איחורים היום</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border px-4 py-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{weekAbsences}</p>
            <p className="text-xs text-gray-500">חיסורים השבוע</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border px-4 py-3 text-center">
            <p className="text-2xl font-bold text-green-600">20</p>
            <p className="text-xs text-gray-500">תלמידים בכיתה</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Students grid - takes 2 columns */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-800">תלמידי כיתה י׳ג — נוכחות שבועית</h2>
            <div className="flex gap-4 text-xs text-gray-500">
              {DAYS_HEBREW.map((d, i) => (
                <span key={i} className="w-12 text-center font-medium">{d}<br /><span className="text-gray-400">{WEEK_DATES[i]}</span></span>
              ))}
            </div>
          </div>
          <div className="divide-y max-h-[500px] overflow-y-auto">
            {STUDENTS.map(student => (
              <div key={student.id} className="flex items-center px-5 py-2.5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 w-44 shrink-0">
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <button
                    onClick={student.id === 7 ? onViewProfile : undefined}
                    className={`text-sm font-medium text-right leading-tight ${student.id === 7 ? 'text-blue-600 hover:underline cursor-pointer' : 'text-gray-800'}`}
                  >
                    {student.name}
                  </button>
                </div>
                <div className="flex gap-4 mr-auto">
                  {student.attendance.map((status, i) => (
                    <div key={i} className="w-12 flex justify-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[status]}`}>
                        {status === 'נוכח' ? '✓' : status === 'חיסור' ? '✕' : 'א'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t bg-gray-50 flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"/>נוכח</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"/>חיסור</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/>איחור</span>
            <span className="mr-auto text-blue-600 cursor-pointer hover:underline" onClick={onViewProfile}>← לחץ על "דניאל מזרחי" לפרופיל מפורט</span>
          </div>
        </div>

        {/* Right column: tasks + events */}
        <div className="space-y-5">
          {/* Tasks */}
          <div className="bg-white rounded-2xl shadow-sm border">
            <div className="px-5 py-4 border-b">
              <h2 className="font-bold text-gray-800">משימות לביצוע</h2>
            </div>
            <div className="p-4 space-y-2">
              {tasks.map(task => (
                <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${task.done ? 'bg-gray-50 opacity-60' : task.urgent ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
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

          {/* Events */}
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
    </div>
  );
}
