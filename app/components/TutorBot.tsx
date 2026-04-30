'use client';
import { useState, useRef, useEffect } from 'react';
import { STUDENTS, STUDENT_PROFILE } from '../data';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const STUDENT_OPTIONS = [
  { id: 7, name: 'דניאל מזרחי', subject: 'אזרחות', level: 'בינוני' },
  { id: 11, name: 'מיה אברהם',  subject: 'אזרחות', level: 'מצוין' },
  { id: 5, name: 'אלון גלזר',   subject: 'אזרחות', level: 'נמוך' },
];

const BOT_KNOWLEDGE: Record<string, string> = {
  'כנסת': `ממש שאלה טובה! הכנסת היא הרשות המחוקקת של ישראל.\n\n**מבנה הכנסת:**\n• 120 חברי כנסת\n• נבחרת לתקופה של 4 שנים\n• יושבת בירושלים\n\n**תפקידיה העיקריים:**\n1. חקיקת חוקים\n2. פיקוח על הממשלה\n3. אישור תקציב המדינה\n4. בחירת נשיא המדינה\n\nמה לא ברור? אשמח להרחיב.`,

  'זכויות': `שאלה מצוינת בנושא זכויות!\n\n**ההבדל בין זכויות אדם לזכויות אזרח:**\n\n🌍 **זכויות אדם** — לכל אדם בכל מקום:\n• חיים, חירות, כבוד\n• אין לשלול אותן\n\n🇮🇱 **זכויות אזרח** — לאזרחי המדינה בלבד:\n• הצבעה בבחירות\n• עבודה בשירות הציבורי\n\nבישראל, חוק יסוד: כבוד האדם וחירותו (1992) מגן על שתיהן.`,

  'דמוקרטיה': `שאלה יסודית! בוא נסביר יחד.\n\n**דמוקרטיה ישירה vs עקיפה:**\n\n✋ **ישירה** — האזרחים מצביעים ישירות על החלטות\n• בעיה: לא ישים במדינה גדולה\n• דוגמה: משאל עם (רפרנדום)\n\n🗳 **עקיפה (נציגותית)** — האזרחים בוחרים נציגים\n• ישראל היא דמוקרטיה עקיפה\n• הנציגים (ח"כים) מחליטים בשמנו\n\nישראל מה שייכת? עקיפה — אנחנו בוחרים כנסת.`,

  'ממשלה': `הממשלה היא הרשות המבצעת בישראל.\n\n**מבנה הממשלה:**\n• ראש הממשלה — מוביל את הממשלה\n• השרים — אחראים על משרדים שונים\n• מספר השרים משתנה בכל ממשלה\n\n**איך מקימים ממשלה?**\n1. בחירות לכנסת\n2. הנשיא מטיל תפקיד על חבר כנסת\n3. תוך 42 יום — חייב להציג ממשלה לכנסת\n4. כנסת מצביעת "אמון"\n\nרוצה שנעמיק בתהליך הקמת הממשלה?`,

  'default': `שאלה מעניינת! בוא נחשוב על זה יחד.\n\nכדי לענות על זה טוב, אני צריך קצת יותר פרטים. איזה נושא ספציפי תרצה לבדוק?\n\n**נושאים שאני מכסה:**\n• כנסת ומערכת החקיקה\n• זכויות אדם ואזרח\n• מבנה הממשלה\n• דמוקרטיה ישירה ועקיפה\n• מערכת המשפט\n• בחירות בישראל\n\nכתוב את הנושא ואסביר צעד אחרי צעד.`,
};

function getBotResponse(text: string, studentName: string, level: string): string {
  const lower = text.toLowerCase();
  let base = '';
  if (lower.includes('כנסת')) base = BOT_KNOWLEDGE['כנסת'];
  else if (lower.includes('זכויות')) base = BOT_KNOWLEDGE['זכויות'];
  else if (lower.includes('דמוקרטיה') || lower.includes('ישירה') || lower.includes('עקיפה')) base = BOT_KNOWLEDGE['דמוקרטיה'];
  else if (lower.includes('ממשלה')) base = BOT_KNOWLEDGE['ממשלה'];
  else base = BOT_KNOWLEDGE['default'];

  return base;
}

export default function TutorBot() {
  const [selectedStudent, setSelectedStudent] = useState(STUDENT_OPTIONS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const studentData = STUDENT_PROFILE;

  useEffect(() => {
    setMessages([{
      role: 'bot',
      text: `היי ${selectedStudent.name}! 👋\n\nאני הבוט האישי שלך לאזרחות. אני מכיר אותך — ראיתי שבמבחן האחרון שלך השגת ציון של **${selectedStudent.id === 7 ? 72 : selectedStudent.id === 11 ? 94 : 55}**, ושאתה ${selectedStudent.id === 7 ? 'מאוד חזק בנושאים של זכויות ומבנה ממשלה, אבל נראה שביקורת שיפוטית היה קצת פחות ברור' : selectedStudent.id === 11 ? 'מצטיין בכל הנושאים! ממשיכים לחזק ולהעמיק' : 'עובד קשה כדי להתקדם, ואני כאן לעזור צעד אחרי צעד'}.\n\n**חשוב לדעת:** אני כאן ללמד ולהסביר — לא לתת תשובות ישירות לשאלות מבחן 😊\n\nמה תרצה ללמוד היום?`
    }]);
  }, [selectedStudent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response = getBotResponse(userMsg, selectedStudent.name, selectedStudent.level);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 1200);
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-gray-800 mt-2">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('•') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') || line.startsWith('🌍') || line.startsWith('🇮🇱') || line.startsWith('✋') || line.startsWith('🗳')) {
        return <p key={i} className="mr-3 text-gray-700">{line}</p>;
      }
      if (line === '') return <div key={i} className="h-1" />;
      return <p key={i} className="text-gray-700">{line.replace(/\*\*(.*?)\*\*/g, (_, m) => m)}</p>;
    });
  };

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">בוטים אישיים לתלמידים</h1>
        <p className="text-gray-500 text-sm mt-1">מורה פרטי לכל תלמיד — מכיר את ההיסטוריה הלימודית שלו, זמין 24/7, לא נותן תשובות ישירות</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Student selector + info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border shadow-sm">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-bold text-gray-700">הצג בוט של תלמיד:</p>
            </div>
            <div className="p-3 space-y-2">
              {STUDENT_OPTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-right transition-colors ${selectedStudent.id === s.id ? 'bg-blue-50 border-2 border-blue-400' : 'border-2 border-transparent hover:bg-gray-50'}`}
                >
                  <img src={STUDENTS.find(st => st.id === s.id)?.photo} className="w-10 h-10 rounded-full" alt="" />
                  <div>
                    <p className="font-medium text-sm text-gray-800">{s.name}</p>
                    <p className={`text-xs ${s.level === 'מצוין' ? 'text-green-600' : s.level === 'בינוני' ? 'text-amber-600' : 'text-red-500'}`}>{s.level}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* What the bot knows */}
          <div className="bg-white rounded-2xl border shadow-sm p-4">
            <p className="text-sm font-bold text-gray-700 mb-3">מה הבוט יודע על {selectedStudent.name}:</p>
            <div className="space-y-2 text-xs text-gray-600">
              {[
                '📊 כל הציונים משנות לימוד קודמות',
                '📝 תוצאות מבחנים אחרונים',
                '💪 נקודות חוזק וחולשה מזוהות',
                '🎯 סגנון למידה מועדף',
                '📅 נוכחות ורקע כללי',
                '🔗 קצב התקדמות בנושאים שונים',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">{item}</div>
              ))}
            </div>
            <div className="mt-3 bg-blue-50 rounded-lg p-2.5">
              <p className="text-xs text-blue-700 font-medium">הבוט מסייע ללמוד — לא חושף תשובות</p>
            </div>
          </div>
        </div>

        {/* Chat window */}
        <div className="col-span-2 bg-white rounded-2xl border shadow-sm flex flex-col" style={{ height: '600px' }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b bg-gray-50 rounded-t-2xl">
            <img src={STUDENTS.find(s => s.id === selectedStudent.id)?.photo} className="w-9 h-9 rounded-full" alt="" />
            <div>
              <p className="font-bold text-sm text-gray-800">בוט אזרחות — {selectedStudent.name}</p>
              <p className="text-xs text-green-600">● מחובר עכשיו</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                }`}>
                  {msg.role === 'bot' ? formatText(msg.text) : <p>{msg.text}</p>}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-end">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          <div className="px-4 py-2 border-t flex gap-2 flex-wrap">
            {['מה זה כנסת?', 'זכויות אדם ואזרח', 'דמוקרטיה ישירה ועקיפה', 'מבנה הממשלה'].map(q => (
              <button
                key={q}
                onClick={() => { setInput(q); }}
                className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="כתוב שאלה על אזרחות..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={send}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              שלח
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
