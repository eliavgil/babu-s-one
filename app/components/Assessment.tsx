'use client';

const CLASS_REPORT = [
  { student: 'יעל רוזנברג',  score: 95, feedback: 'הסבר מקיף ומדויק של כל הסעיפים. שימוש מצוין בדוגמאות.' },
  { student: 'אורנה ציון',   score: 91, feedback: 'תשובות מלאות. סעיף 3 דורש הרחבה קטנה על "הפרדת רשויות".' },
  { student: 'מיה אברהם',    score: 94, feedback: 'מצוין בכל הסעיפים. ניסוח ברור ומבוסס.' },
  { student: 'ניר שפיר',     score: 88, feedback: 'הבנה טובה. ב"סעיף 2" — הגדרת "ריבונות" לא מדויקת לחלוטין.' },
  { student: 'גל ברק',       score: 85, feedback: 'עבודה טובה. חסר ציטוט חוק לסעיף 4.' },
  { student: 'נועה פרידמן',  score: 87, feedback: 'תשובות ברורות. ב"סעיף 1" — הרחב על "זכויות אדם vs אזרח".' },
  { student: 'דניאל מזרחי',  score: 72, feedback: 'הבנה בסיסית. סעיפים 3–4 שטחיים. מומלץ לחזור על "ביקורת שיפוטית".' },
  { student: 'יובל לוי',     score: 81, feedback: 'טוב. ב"סעיף 2" — דוגמה לא מתאימה לנושא. שאר הסעיפים — בסדר.' },
];

const GAPS = [
  { topic: 'ביקורת שיפוטית', percent: 65, count: 7 },
  { topic: 'הפרדת רשויות', percent: 55, count: 9 },
  { topic: 'הגדרת ריבונות', percent: 45, count: 11 },
  { topic: 'זכויות אדם vs אזרח', percent: 40, count: 12 },
];

export default function Assessment() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">מאגר משימות הערכה</h1>
        <p className="text-gray-500 text-sm mt-1">המערכת משתמשת ב-StudyWise לבדיקה אוטומטית ומשוב מיידי לתלמידים</p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { step: '1', title: 'המורה מגדיר משימה', desc: 'שאלות, קריטריוני ניקוד ורמת קושי', icon: '✏️' },
          { step: '2', title: 'התלמיד מגיש', desc: 'מגיש תשובות ב-StudyWise בכל מכשיר', icon: '📤' },
          { step: '3', title: 'AI בודק ומשיב', desc: 'משוב מיידי ומפורט לכל תשובה', icon: '🤖' },
          { step: '4', title: 'תמונת כיתה', desc: 'המורה רואה פערים בזמן אמת', icon: '📊' },
        ].map(item => (
          <div key={item.step} className="bg-white rounded-xl border shadow-sm p-4 text-center">
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">{item.step}</div>
            <p className="font-semibold text-sm text-gray-800">{item.title}</p>
            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* StudyWise link */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-blue-800">StudyWise — פלטפורמת ההערכה</h3>
          <p className="text-blue-700 text-sm mt-1">יצירת מבחנים, בדיקה אוטומטית, משוב מפורט לתלמיד — הכל במקום אחד</p>
        </div>
        <a
          href="https://studywise.co.il"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap"
        >
          פתח את StudyWise ←
        </a>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Class gaps */}
        <div className="bg-white rounded-2xl shadow-sm border">
          <div className="px-5 py-4 border-b">
            <h2 className="font-bold text-gray-800">פערי הבנה בכיתה — זמן אמת</h2>
            <p className="text-xs text-gray-500 mt-0.5">לאחר מבחן: "מבנה השלטון בישראל" | כיתה י׳ג | 24/4/26</p>
          </div>
          <div className="p-5 space-y-4">
            {GAPS.map(gap => (
              <div key={gap.topic}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{gap.topic}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${gap.percent < 50 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                    {gap.count} תלמידים טעו
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${gap.percent < 50 ? 'bg-red-400' : 'bg-amber-400'}`}
                    style={{ width: `${100 - gap.percent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{100 - gap.percent}% הצליחו</p>
              </div>
            ))}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
              <p className="text-xs text-amber-800 font-medium">💡 המלצת AI: מומלץ לחזור על "ביקורת שיפוטית" ו-"הפרדת רשויות" בשיעור הבא</p>
            </div>
          </div>
        </div>

        {/* Individual feedback */}
        <div className="bg-white rounded-2xl shadow-sm border">
          <div className="px-5 py-4 border-b">
            <h2 className="font-bold text-gray-800">משוב AI לתלמידים</h2>
            <p className="text-xs text-gray-500 mt-0.5">כל תלמיד קיבל משוב אוטומטי מיד לאחר ההגשה</p>
          </div>
          <div className="divide-y max-h-[400px] overflow-y-auto">
            {CLASS_REPORT.map((r, i) => (
              <div key={i} className="px-5 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-800">{r.student}</span>
                  <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${r.score >= 90 ? 'bg-green-100 text-green-700' : r.score >= 75 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                    {r.score}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{r.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
