'use client';
import { useState } from 'react';
import { STUDENT_PROFILE } from '../data';
import { BotDisciplineEntry, BotNote } from '../page';

const tabs = ['ביוגרפיה', 'ציונים ואקדמיה', 'משמעת ונוכחות', 'מעקב חברתי-רגשי', 'משימות מחנך'];

const trendIcon = (t: string) => t === 'up' ? '↑' : t === 'down' ? '↓' : '→';
const trendColor = (t: string) => t === 'up' ? 'text-green-600' : t === 'down' ? 'text-red-500' : 'text-gray-500';
const scoreColor = (s: number) => s >= 85 ? 'bg-green-100 text-green-700' : s >= 70 ? 'bg-blue-100 text-blue-700' : s >= 55 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600';

const p = STUDENT_PROFILE;

export default function StudentProfile({ onBack, botDiscipline = [], botNotes = [] }: { onBack: () => void; botDiscipline?: BotDisciplineEntry[]; botNotes?: BotNote[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const [taskDone, setTaskDone] = useState<Record<number, boolean>>({});

  const myDiscipline = botDiscipline.filter(d => d.studentId === p.id);
  const myNotes = botNotes.filter(n => n.studentId === p.id);
  const allDiscipline = [...myDiscipline.map(d => ({ date: d.date, type: d.type, desc: d.desc, isNew: true })), ...p.discipline.map(d => ({ ...d, isNew: false }))];

  const avg = Math.round(p.grades.reduce((sum, g) => sum + g.scores[g.scores.length - 1], 0) / p.grades.length);

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      <button onClick={onBack} className="text-sm text-blue-600 hover:underline flex items-center gap-1">← חזרה לעמוד הבית</button>

      {/* Student header */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex items-start gap-6">
          <img src={p.photo} alt={p.name} className="w-24 h-24 rounded-2xl object-cover shadow-md" />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{p.name}</h1>
                <p className="text-gray-500 mt-0.5">כיתה {p.class} | גיל {p.age} | {p.dob}</p>
              </div>
              <div className="flex gap-3">
                <div className="text-center bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                  <p className="text-2xl font-bold text-amber-600">{p.absences}</p>
                  <p className="text-xs text-gray-500">חיסורים</p>
                </div>
                <div className="text-center bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
                  <p className="text-2xl font-bold text-orange-500">{p.lates}</p>
                  <p className="text-xs text-gray-500">איחורים</p>
                </div>
                <div className="text-center bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                  <p className="text-2xl font-bold text-blue-600">{avg}</p>
                  <p className="text-xs text-gray-500">ממוצע</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {p.hobbies.map((h, i) => <span key={i} className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-full">{h}</span>)}
              {p.closeFriends.map((f, i) => <span key={i} className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full">👥 {f}</span>)}
            </div>
          </div>
        </div>

        {/* Alert banner */}
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-sm text-red-700">
            <strong>התראת AI:</strong> ירידה בציוני ספרות (55→48) וחרדה אקדמית גבוהה (7.5/10). מומלץ פעולה מיידית. ראה פרטים בלשוניות.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${activeTab === i ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Tab 0: Biography */}
          {activeTab === 0 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-700 mb-3">פרטים אישיים</h3>
                <div className="space-y-2 text-sm">
                  {[
                    ['כתובת', p.address],
                    ['מצב משפחתי', p.familyStatus],
                    ['אחים', p.siblings[0]],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-gray-500 w-28 shrink-0">{k}:</span>
                      <span className="text-gray-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-700 mb-3">פרטי קשר הורים</h3>
                <div className="space-y-3">
                  {p.parents.map((parent, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                      <p className="font-semibold text-sm text-gray-800">{parent.name} <span className="text-gray-500 font-normal">({parent.role})</span></p>
                      <p className="text-xs text-gray-600 mt-1">📞 {parent.phone}</p>
                      <p className="text-xs text-gray-600">✉️ {parent.email}</p>
                      <p className="text-xs text-blue-600 mt-1">{parent.custody}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Grades */}
          {activeTab === 1 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700">ציונים אחרונים לפי מקצוע</h3>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span className="text-green-600 font-medium">↑ מגמה חיובית</span>
                  <span className="text-red-500 font-medium">↓ מגמה שלילית</span>
                </div>
              </div>
              <div className="space-y-3">
                {p.grades.map((g, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-gray-700 w-36 shrink-0">{g.subject}</span>
                    <div className="flex gap-2">
                      {g.scores.map((score, j) => (
                        <span key={j} className={`text-sm font-bold px-3 py-1.5 rounded-lg ${j === g.scores.length - 1 ? scoreColor(score) : 'bg-gray-100 text-gray-500'}`}>
                          {score}
                        </span>
                      ))}
                    </div>
                    <span className={`text-sm font-bold mr-1 ${trendColor(g.trend)}`}>{trendIcon(g.trend)}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${g.scores[g.scores.length-1] >= 80 ? 'bg-green-400' : g.scores[g.scores.length-1] >= 60 ? 'bg-blue-400' : 'bg-red-400'}`}
                        style={{ width: `${g.scores[g.scores.length-1]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm font-bold text-green-800 mb-2">💪 נקודות חוזק</p>
                  <p className="text-sm text-green-700">חינוך גופני, אזרחות, אנגלית</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="text-sm font-bold text-red-800 mb-2">⚠️ נקודות חולשה</p>
                  <p className="text-sm text-red-700">ספרות עברית (ירידה), פיזיקה, מתמטיקה</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Discipline */}
          {activeTab === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <p className="text-4xl font-bold text-amber-600">{p.absences}</p>
                  <p className="text-sm text-gray-600 mt-1">סה"כ חיסורים מתחילת שנה</p>
                  <p className="text-xs text-red-500 mt-0.5">ממוצע כיתה: 5 | פי {Math.round(p.absences / 5)} מהממוצע</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                  <p className="text-4xl font-bold text-orange-500">{p.lates}</p>
                  <p className="text-sm text-gray-600 mt-1">סה"כ איחורים מתחילת שנה</p>
                  <p className="text-xs text-amber-600 mt-0.5">ממוצע כיתה: 3 | גבוה מהממוצע</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-700 mb-3">אירועי משמעת ותיעוד</h3>
                {myNotes.length > 0 && (
                  <div className="mb-3 space-y-1.5">
                    {myNotes.map((n, i) => (
                      <div key={i} className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full shrink-0 font-medium">🤖 בוט</span>
                        <p className="text-sm text-blue-800">{n.text}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  {allDiscipline.map((d, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${d.isNew ? 'border-indigo-300 bg-indigo-50 ring-1 ring-indigo-300' : d.type === 'משמעת' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${d.isNew ? 'bg-indigo-100 text-indigo-700' : d.type === 'משמעת' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {d.isNew ? '🤖 חדש' : d.type}
                      </span>
                      <div>
                        <p className="text-sm text-gray-800">{d.desc}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{d.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Emotional */}
          {activeTab === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-700">שאלון רגשי-חברתי</h3>
                <span className="text-xs text-gray-500">מולא: {p.emotional.date}</span>
              </div>
              <div className="space-y-3">
                {p.emotional.scores.map((item, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${item.alert ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <div className="flex items-center gap-2">
                        {item.alert && <span className="text-xs text-red-600 font-medium">⚠️ גבוה</span>}
                        <span className={`text-sm font-bold ${item.value >= 7 ? 'text-red-600' : item.value >= 5 ? 'text-amber-600' : 'text-green-600'}`}>{item.value}/10</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.value >= 7 ? 'bg-red-500' : item.value >= 5 ? 'bg-amber-400' : 'bg-green-500'}`}
                        style={{ width: `${item.value * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-bold text-gray-700 mb-3">המלצות AI — פעולות מוצעות</h3>
                <div className="space-y-2">
                  {p.emotional.aiRecommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white border rounded-xl p-3 shadow-sm">
                      <span className="text-xl shrink-0">{rec.icon}</span>
                      <p className="text-sm text-gray-700 leading-relaxed">{rec.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Tasks */}
          {activeTab === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-700">משימות מחנך — {p.name}</h3>
                <button className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">+ הוסף משימה</button>
              </div>
              <div className="space-y-2">
                {p.tasks.map(task => (
                  <div key={task.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-colors
                    ${task.status === 'done' ? 'bg-gray-50 border-gray-200 opacity-70' : task.status === 'inprogress' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0
                      ${task.status === 'done' ? 'bg-green-500 text-white' : task.status === 'inprogress' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {task.status === 'done' ? '✓' : task.status === 'inprogress' ? '⟳' : '○'}
                    </span>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.text}</p>
                      <p className={`text-xs mt-0.5 ${task.status === 'done' ? 'text-green-600' : task.status === 'inprogress' ? 'text-blue-600' : 'text-gray-400'}`}>{task.date}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${task.status === 'done' ? 'bg-green-100 text-green-700' : task.status === 'inprogress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                      {task.status === 'done' ? 'בוצע' : task.status === 'inprogress' ? 'בתהליך' : 'ממתין'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
