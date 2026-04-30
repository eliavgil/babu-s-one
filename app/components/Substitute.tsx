'use client';
import { useState } from 'react';
import { SUBSTITUTE_LESSONS } from '../data';

export default function Substitute() {
  const [expanded, setExpanded] = useState<number | null>(1);

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">מאגר חומרי מילוי מקום</h1>
        <p className="text-gray-500 text-sm mt-1">שיעורים מוכנים מראש — כשנעדר, המחליף פותח ומתחיל. אפס שיעורים אבודים.</p>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-l from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            { icon: '👩‍🏫', title: 'מורה מכין מראש', desc: 'שיעור שלם עם כל הרכיבים' },
            { icon: '🤒', title: 'מורה נעדר', desc: 'פותח את החומר — מחליף' },
            { icon: '🤖', title: 'בוט NotebookLM', desc: 'עונה לשאלות התלמידים' },
            { icon: '📊', title: 'שיעור מלא', desc: 'ממשיכים ללמוד, ולא מבזבזים שיעור' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl mb-1">{s.icon}</div>
              <p className="font-semibold text-sm">{s.title}</p>
              <p className="text-blue-200 text-xs mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lessons list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-700">השיעורים שהכנת</h2>
          <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            + הוסף שיעור חדש
          </button>
        </div>

        {SUBSTITUTE_LESSONS.map(lesson => (
          <div key={lesson.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === lesson.id ? null : lesson.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg flex items-center justify-center">📚</div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{lesson.topic}</p>
                  <p className="text-sm text-gray-500">{lesson.subject} | {lesson.class} | {lesson.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${lesson.level === 'ממוצע' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                  רמה: {lesson.level}
                </span>
                <span className="text-gray-400 text-lg">{expanded === lesson.id ? '▲' : '▼'}</span>
              </div>
            </button>

            {expanded === lesson.id && (
              <div className="border-t bg-gray-50 p-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Presentation */}
                  <div className="bg-white rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🎬</span>
                      <p className="font-semibold text-sm text-gray-800">מצגת + סרטון</p>
                    </div>
                    <p className="text-sm text-gray-700">{lesson.components.presentation.title}</p>
                    <p className="text-xs text-gray-400">{lesson.components.presentation.slides} שקפים</p>
                    <p className="text-sm text-gray-700 mt-2">{lesson.components.video.title}</p>
                    <p className="text-xs text-gray-400">{lesson.components.video.duration}</p>
                    <button className="mt-3 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-1.5 rounded-lg transition-colors">
                      פתח מצגת / סרטון
                    </button>
                  </div>

                  {/* NotebookLM */}
                  <div className="bg-white rounded-xl border p-4 border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🤖</span>
                      <p className="font-semibold text-sm text-gray-800">בוט NotebookLM</p>
                    </div>
                    <p className="text-sm text-gray-700">{lesson.components.notebooklm.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{lesson.components.notebooklm.note}</p>
                    <a
                      href={lesson.components.notebooklm.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1.5 rounded-lg transition-colors block text-center"
                    >
                      פתח NotebookLM ←
                    </a>
                  </div>

                  {/* Resources */}
                  <div className="bg-white rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🔗</span>
                      <p className="font-semibold text-sm text-gray-800">מקורות לימוד נוספים</p>
                    </div>
                    <ul className="space-y-1.5">
                      {lesson.components.resources.map((r, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                          <span className="text-blue-400 mt-0.5">→</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Assignments + Quiz */}
                  <div className="bg-white rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">✏️</span>
                      <p className="font-semibold text-sm text-gray-800">משימות ושאלות</p>
                    </div>
                    <p className="text-xs font-medium text-gray-500 mb-1">משימות לתלמידים:</p>
                    <ul className="space-y-1 mb-3">
                      {lesson.components.assignments.map((a, i) => (
                        <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                          <span className="text-green-500 font-bold mt-0.5">{i + 1}.</span>{a}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs font-medium text-gray-500 mb-1">שאלות לבדיקת הבנה:</p>
                    <ul className="space-y-1">
                      {lesson.components.quiz.map((q, i) => (
                        <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold mt-0.5">?</span>{q}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
