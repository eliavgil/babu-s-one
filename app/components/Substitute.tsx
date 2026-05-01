'use client';
import { useState } from 'react';

interface TaskItem { num: number; title: string; desc: string; duration: string; icon: string }
interface TopicData { tasks: TaskItem[]; bot: { name: string; desc: string; link: string } }

const SUBJECTS: Record<string, { topics: string[]; color: string; light: string }> = {
  'אזרחות':      { topics: ['מבנה השלטון בישראל', 'הכנסת וחקיקה', 'מערכת המשפט', 'זכויות אדם ואזרח', 'ריבוי תרבויות', 'בחירות ודמוקרטיה'], color: 'text-blue-700', light: 'bg-blue-50 border-blue-200' },
  'מתמטיקה':     { topics: ['פונקציה ריבועית', 'גיאומטריה — פיתגורס', 'טריגונומטריה', 'משוואות ממעלה שנייה', 'סטטיסטיקה ותרשימים', 'הסתברות'], color: 'text-violet-700', light: 'bg-violet-50 border-violet-200' },
  'ספרות עברית': { topics: ['"הכניסיני תחת כנפך" — ביאליק', '"והיה העקוב למישור" — עגנון', 'ניתוח שיר מודרני', 'פרוזה ישראלית עכשווית', 'ספרות השואה'], color: 'text-amber-700', light: 'bg-amber-50 border-amber-200' },
  'היסטוריה':    { topics: ['קום המדינה ומלחמת העצמאות', 'מלחמת העולם השנייה', 'המנדט הבריטי', 'השואה', 'ישראל בעשורים הראשונים'], color: 'text-orange-700', light: 'bg-orange-50 border-orange-200' },
  'אנגלית':      { topics: ['Reading Comprehension', 'Opinion Essay Writing', 'Grammar — Present Perfect', 'Vocabulary Building', 'Speaking & Discussion'], color: 'text-emerald-700', light: 'bg-emerald-50 border-emerald-200' },
  'פיזיקה':      { topics: ['חוקי ניוטון', 'אלקטרומגנטיות', 'אופטיקה', 'תרמודינמיקה', 'מבוא לקוונטים'], color: 'text-cyan-700', light: 'bg-cyan-50 border-cyan-200' },
  'תנ"ך':        { topics: ['סיפור יוסף ואחיו', 'נבואות ישעיהו', 'מגילת רות', 'משלי ואמרות חכמה', 'ספר בראשית — בריאה'], color: 'text-yellow-700', light: 'bg-yellow-50 border-yellow-200' },
  'ביולוגיה':    { topics: ['מבנה התא', 'גנטיקה ותורשה', 'מערכת העיכול', 'אקולוגיה', 'אבולוציה'], color: 'text-green-700', light: 'bg-green-50 border-green-200' },
};

const CLASSES = ["כיתות י'", 'כיתות י"א', 'כיתות י"ב', 'כיתות י"ג', 'כיתות י"ד', 'כלל השכבה'];

const TOPIC_DATA: Record<string, TopicData> = {
  'מבנה השלטון בישראל': {
    tasks: [
      { num: 1, title: 'קריאה ועיון',     desc: 'קראו עמ׳ 45–62 בספר הלימוד: שלושת הרשויות ויחסי הגומלין ביניהן. סמנו מושגי מפתח.',        duration: '10 דק׳', icon: '📖' },
      { num: 2, title: 'מפת מושגים',       desc: 'שרטטו מפת מושגים של שלוש הרשויות: מה התפקיד? מי מחזיק? מה הקשר ביניהן?',                   duration: '12 דק׳', icon: '🗺' },
      { num: 3, title: 'עבודת צוות',       desc: 'בקבוצות של 3: כל קבוצה "מייצגת" רשות אחת ומציגה אותה בפני הכיתה. 3 דקות לקבוצה.',        duration: '12 דק׳', icon: '👥' },
      { num: 4, title: 'שאל את הבוט', desc: 'היכנסו לבוט NotebookLM — כתבו 3 שאלות שעלו לכם תוך כדי הלמידה. שתפו את התשובות בכיתה.', duration: '6 דק׳',  icon: '🤖' },
    ],
    bot: { name: 'בוט מומחה — מבנה השלטון', desc: 'מאומן על ספר הלימוד, פסיקות ומאמרים. עונה על כל שאלה בעברית.', link: 'https://notebooklm.google.com' },
  },
  'הכנסת וחקיקה': {
    tasks: [
      { num: 1, title: 'סרטון',           desc: 'צפו בסרטון "כך עובדת הכנסת" (8:32 — ערוץ עכשיו). רשמו 3 עובדות חדשות שלא ידעתם.',         duration: '12 דק׳', icon: '🎬' },
      { num: 2, title: 'חוק בפעולה',      desc: 'בחרו חוק שעבר לאחרונה וסכמו את תהליך חקיקתו ב-5 שלבים. כתבו מי הגיש ומי הצביע.',         duration: '12 דק׳', icon: '⚖️' },
      { num: 3, title: 'ויכוח כיתתי',     desc: 'הצביעו בידיים: האם חברי כנסת צריכים ליהנות מחסינות? 6 דקות דיון — כל צד מציג טיעונים.',  duration: '8 דק׳',  icon: '🗳' },
      { num: 4, title: 'שאל את הבוט', desc: 'שאלו: "מה ההבדל בין קריאה ראשונה לשלישית?" ו-"מה הצעת חוק פרטית?"',                      duration: '8 דק׳',  icon: '🤖' },
    ],
    bot: { name: 'בוט מומחה — הכנסת', desc: 'כולל סמכויות, נהלי חקיקה, פסיקות ידועות וחוקי יסוד.', link: 'https://notebooklm.google.com' },
  },
  'מערכת המשפט': {
    tasks: [
      { num: 1, title: 'פירמידת בתי המשפט', desc: 'שרטטו את פירמידת בתי המשפט בישראל. כתבו ליד כל ערכאה את התפקיד ודוגמה לתיק.',             duration: '10 דק׳', icon: '⚖️' },
      { num: 2, title: 'פסק דין מפורסם',    desc: 'בחרו פסק דין ידוע (מזרחי נ׳ בנק הפועלים / בגץ הנגב...) — מה קרה, מה ההחלטה ולמה זה חשוב.', duration: '14 דק׳', icon: '📋' },
      { num: 3, title: 'ביקורת שיפוטית',    desc: 'קראו הגדרת "ביקורת שיפוטית" וכתבו פסקה: מדוע היא חשובה לדמוקרטיה? מה הסיכון לביטולה?',    duration: '10 דק׳', icon: '✍️' },
      { num: 4, title: 'שאל את הבוט',   desc: 'שאלו: "מה ההבדל בין הליך פלילי לאזרחי?" — ובקשו 2 דוגמאות מפורטות.',                        duration: '6 דק׳',  icon: '🤖' },
    ],
    bot: { name: 'בוט מומחה — מערכת המשפט', desc: 'כולל פסיקות, מושגי יסוד, ביקורת שיפוטית ושאלות בגרות.', link: 'https://notebooklm.google.com' },
  },
  'פונקציה ריבועית': {
    tasks: [
      { num: 1, title: 'חזרה על הנוסחאות', desc: 'סכמו בדף: 3 צורות של הפונקציה הריבועית — מה כל פרמטר מייצג? מתי משתמשים בכל צורה?',        duration: '8 דק׳',  icon: '📐' },
      { num: 2, title: 'תרגילים מדורגים',  desc: 'פתרו 8 תרגילים מעמ׳ 87–89: שרשרת, גרף, נקודות חיתוך עם צירים.',                              duration: '20 דק׳', icon: '✏️' },
      { num: 3, title: 'עבודת זוגות',      desc: 'בזוגות: כל אחד מסביר לשותף שלב אחד — אחד מסביר "השלמה לריבוע", השני מסביר "נקודת קדקוד".',  duration: '8 דק׳',  icon: '👥' },
      { num: 4, title: 'שאל את הבוט',  desc: 'נתקעתם? שאלו את הבוט: "הסבר לי שלב אחר שלב כיצד מוצאים נקודות חיתוך עם ציר X".',           duration: '9 דק׳',  icon: '🤖' },
    ],
    bot: { name: 'בוט מתמטיקה — ריבועית', desc: 'מסביר צעד-אחר-צעד, מציע תרגילים נוספים ובודק הבנה.', link: 'https://notebooklm.google.com' },
  },
  'גיאומטריה — פיתגורס': {
    tasks: [
      { num: 1, title: 'הוכחת המשפט',     desc: 'קראו את הוכחת משפט פיתגורס בספר. שרטטו את הריבועים על שלושת הצלעות ורשמו את המשמעות.',    duration: '10 דק׳', icon: '📐' },
      { num: 2, title: 'תרגולים',         desc: 'פתרו 10 תרגילים — מהתרגיל הפשוט לתרגיל ה"הפוך" (מוצאים צלע חסרה). עמ׳ 145–147.',           duration: '20 דק׳', icon: '✏️' },
      { num: 3, title: 'בעיה מציאותית',  desc: 'פתרו בזוגות: "סולם בגובה 5 מטר נשען על קיר — בסיסו 3 מטר מהקיר. עד איפה הוא מגיע?"',       duration: '8 דק׳',  icon: '🏗' },
      { num: 4, title: 'שאל את הבוט', desc: 'שאלו: "מתי משפט פיתגורס לא עובד?" ו-"מה משולש פיתגורסאי?"',                                  duration: '7 דק׳',  icon: '🤖' },
    ],
    bot: { name: 'בוט מתמטיקה — גיאומטריה', desc: 'מסביר משפטים, הוכחות ופותר בעיות מדורגות.', link: 'https://notebooklm.google.com' },
  },
  '"הכניסיני תחת כנפך" — ביאליק': {
    tasks: [
      { num: 1, title: 'קריאה בקול',    desc: 'קראו את השיר ביחד בקול — כל תלמיד קורא בית אחד בתורו. קראו פעמיים.',                          duration: '8 דק׳',  icon: '📖' },
      { num: 2, title: 'ניתוח דימויים', desc: 'מצאו 3 דימויים או מטאפורות. לכל אחד: מה הדימוי? למה משול? מה הרגש שהוא מעורר?',               duration: '12 דק׳', icon: '🔍' },
      { num: 3, title: 'דיון כיתתי',    desc: 'שאלת הדיון: "מיהי ה׳אחות הגדולה׳ בשיר — אם, דת, לאומיות?" הגנו על עמדתכם בטיעונים מהטקסט.', duration: '12 דק׳', icon: '💬' },
      { num: 4, title: 'שאל את הבוט',  desc: 'שאלו: "מה הרקע הביוגרפי של ביאליק שהשפיע על שיר זה?" ו-"אילו שירים דומים כתב?"',            duration: '8 דק׳',  icon: '🤖' },
    ],
    bot: { name: 'בוט ביאליק — "הכניסיני"', desc: 'מאומן על כל יצירות ביאליק, רקע היסטורי ופרשנויות ספרותיות.', link: 'https://notebooklm.google.com' },
  },
  '"והיה העקוב למישור" — עגנון': {
    tasks: [
      { num: 1, title: 'קריאה',         desc: 'קראו את הפרק שנקבע לשיעור. סמנו: 2 משפטים שמרגשים אתכם ו-2 שמבלבלים אתכם.',                  duration: '12 דק׳', icon: '📖' },
      { num: 2, title: 'דמויות',        desc: 'ממפו את הדמויות הראשיות: שם, תכונות, יחס לאמונה ויחס לכפר. רשמו בטבלה.',                       duration: '10 דק׳', icon: '👤' },
      { num: 3, title: 'סמלים',         desc: 'בקבוצות: מצאו 2 סמלים ביצירה. מה הם מייצגים? איך הם קשורים לנושא האמונה והשבירה?',           duration: '12 דק׳', icon: '🔍' },
      { num: 4, title: 'שאל את הבוט',  desc: 'שאלו: "מה הנושא המרכזי של היצירה?" ו-"מה הקשר בין עגנון לאמונה הדתית?"',                      duration: '6 דק׳',  icon: '🤖' },
    ],
    bot: { name: 'בוט עגנון — "העקוב למישור"', desc: 'כולל ניתוחים, סמלים, רקע יצירה ופרשנויות אקדמיות.', link: 'https://notebooklm.google.com' },
  },
  'קום המדינה ומלחמת העצמאות': {
    tasks: [
      { num: 1, title: 'ציר זמן',       desc: 'שרטטו ציר זמן: מהצהרת בלפור (1917) לקום המדינה (1948). סמנו 8 אירועים מרכזיים.',              duration: '12 דק׳', icon: '📅' },
      { num: 2, title: 'תוכנית החלוקה', desc: 'בדקו מפת תוכנית האו"ם: מה קיבלה ישראל? למה הערבים דחו? כתבו 3 טיעונים מכל צד.',              duration: '12 דק׳', icon: '🗺' },
      { num: 3, title: 'עדות אישית',    desc: 'קראו עדות של לוחם ממלחמת העצמאות. כתבו 5 שורות: מה הרגשתם? מה הדבר שהפתיע אתכם ביותר?',      duration: '10 דק׳', icon: '📝' },
      { num: 4, title: 'שאל את הבוט',  desc: 'שאלו: "מה היו הסיבות להכרזת המדינה ב-1948 דווקא?" ו-"מי היו מנהיגי המלחמה?"',                 duration: '6 דק׳',  icon: '🤖' },
    ],
    bot: { name: 'בוט היסטוריה — קום המדינה', desc: 'כולל מסמכים היסטוריים, עדויות, מפות ופסיקות.', link: 'https://notebooklm.google.com' },
  },
  'Reading Comprehension': {
    tasks: [
      { num: 1, title: 'Pre-Reading',         desc: 'Look at the title and first paragraph only. Predict: what is the text about? Write 2 sentences.', duration: '5 min',  icon: '👁' },
      { num: 2, title: 'Active Reading',      desc: 'Read the full text. Underline: 3 key ideas, 2 unknown words, 1 sentence you find important.',   duration: '15 min', icon: '📖' },
      { num: 3, title: 'Comprehension',       desc: 'Answer questions 1–5 from the worksheet. Write full sentences. Compare answers in pairs.',        duration: '12 min', icon: '✍️' },
      { num: 4, title: 'Ask the Bot',         desc: 'Ask the bot what each underlined word means in context. Then ask: "What is the main idea?"',      duration: '8 min',  icon: '🤖' },
    ],
    bot: { name: 'English Reading Bot', desc: 'Trained on reading strategies, vocabulary, and comprehension skills. Answers in English or Hebrew.', link: 'https://notebooklm.google.com' },
  },
  'חוקי ניוטון': {
    tasks: [
      { num: 1, title: 'שלושת החוקים', desc: 'כתבו בלשונכם את שלושת חוקי ניוטון. לכל חוק — דוגמה יומיומית שמרגישה מוכרת לכם.',               duration: '10 דק׳', icon: '📝' },
      { num: 2, title: 'חישובים',      desc: 'פתרו 5 בעיות חישוב מעמ׳ 112–115 בספר. הראו את כל השלבים.',                                        duration: '18 דק׳', icon: '🔢' },
      { num: 3, title: 'ניסוי פשוט',  desc: 'בזוגות: שחררו חפצים שונים מאותה גובה. האם הם נוחתים יחד? מה ניוטון היה אומר?',                   duration: '8 דק׳',  icon: '🧪' },
      { num: 4, title: 'שאל את הבוט', desc: 'שאלו: "מה ההבדל בין מסה למשקל?" ו-"למה עצמים נופלים באותו קצב בוואקום?"',                       duration: '4 דק׳',  icon: '🤖' },
    ],
    bot: { name: 'בוט פיזיקה — מכניקה', desc: 'כולל כל נושאי המכניקה הקלאסית, נוסחאות ובעיות פתורות.', link: 'https://notebooklm.google.com' },
  },
};

function getTopicData(topic: string, subject: string): TopicData {
  if (TOPIC_DATA[topic]) return TOPIC_DATA[topic];
  return {
    tasks: [
      { num: 1, title: 'קריאה ועיון',   desc: `קראו את החומר בספר הלימוד על "${topic}". סמנו 3 מושגים חשובים ורשמו הגדרה לכל אחד.`,              duration: '10 דק׳', icon: '📖' },
      { num: 2, title: 'סיכום אישי',    desc: `כתבו סיכום של הנושא "${topic}" — 8 עד 12 שורות במילים שלכם, ללא העתקה מהספר.`,                    duration: '15 דק׳', icon: '✍️' },
      { num: 3, title: 'עבודה קבוצתית', desc: `בקבוצות של 3-4: הכינו 5 שאלות על "${topic}" שתוכלו לשאול כיתה אחרת. בחרו את השאלה הטובה ביותר.`, duration: '12 דק׳', icon: '👥' },
      { num: 4, title: 'שאל את הבוט',  desc: `פנו לבוט ושאלו: "הסבר לי את "${topic}" בצורה פשוטה" ולאחר מכן "תן לי 3 שאלות לבדיקת הבנה".`,     duration: '8 דק׳',  icon: '🤖' },
    ],
    bot: { name: `בוט מומחה — ${topic}`, desc: `מאומן על כל חומרי ${subject} הרלוונטיים. שאלו כל שאלה בעברית.`, link: 'https://notebooklm.google.com' },
  };
}

const TASK_COLORS = ['bg-blue-50 border-blue-200', 'bg-violet-50 border-violet-200', 'bg-amber-50 border-amber-200', 'bg-emerald-50 border-emerald-200'];

const TOOLS = [
  {
    name: 'NotebookLM',
    logo: '📓',
    color: 'bg-blue-600',
    tagline: 'הבוט שיודע הכל על הנושא',
    desc: 'מעלים חומרי לימוד (PDF, מצגת, טקסט) ומקבלים בוט שיודע לענות על כל שאלה ממש מתוך החומרים. אידיאלי לשיעורי מילוי מקום.',
    steps: ['העלה ספר לימוד / PDF של הנושא', 'NotebookLM יוצר בוט ייעודי', 'התלמידים שואלים — הבוט עונה מהחומרים'],
    tip: 'מומלץ להכין בוט לכל יחידת לימוד בתחילת שנה.',
    link: 'https://notebooklm.google.com',
  },
  {
    name: 'Curipod',
    logo: '🎯',
    color: 'bg-teal-600',
    tagline: 'מצגת אינטראקטיבית ב-3 דקות',
    desc: 'כותבים נושא — Curipod מייצר מצגת שלמה עם שאלות, סקרים ופעילויות לתלמידים. התלמידים עונים מהטלפון ורואים תוצאות בזמן אמת.',
    steps: ['כתוב נושא + כיתה', 'Curipod מייצר שיעור מלא', 'התלמידים מצטרפים בקוד QR'],
    tip: 'אידיאלי כאשר אין מצגת מוכנה — גם שיעור ספונטאני נראה מקצועי.',
    link: 'https://curipod.com',
  },
  {
    name: 'Magic School AI',
    logo: '✨',
    color: 'bg-pink-600',
    tagline: 'יוצר תוכניות שיעור תוך שניות',
    desc: 'כלי AI המיועד ספציפית למורים. יוצר: תוכניות שיעור, דפי עבודה, שאלות לדיון, מטלות ועוד — כל אחד מותאם לכיתה ורמה.',
    steps: ['בחר כלי (תוכנית שיעור, דף עבודה...)', 'הכנס כיתה, מקצוע, נושא', 'קבל תוצר מוכן בשניות'],
    tip: 'יש מעל 80 כלים שונים — כולל "שיעור מילוי מקום" מוכן.',
    link: 'https://www.magicschool.ai',
  },
  {
    name: 'Canva AI',
    logo: '🎨',
    color: 'bg-red-500',
    tagline: 'מצגות יפות בלי מאמץ',
    desc: 'Canva מציעה עשרות תבניות מצגות לחינוך + כלי AI שמייצר מצגת שלמה מטקסט בלבד. נראה מקצועי, קל לשינוי ומותאם לכל כיתה.',
    steps: ['פתח Canva ← "ייצר מצגת ב-AI"', 'כתב נושא + מספר שקפים', 'ערוך, הוסף תמונות, שתף'],
    tip: 'לאחר יצירה — שנו צבעים וסגנון ל"סגנון בית ספרי" אחיד.',
    link: 'https://www.canva.com',
  },
];

export default function Substitute() {
  const [cls, setCls]         = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic]     = useState('');
  const [result, setResult]   = useState<{ cls: string; subject: string; topic: string; data: TopicData } | null>(null);

  const topics = subject ? SUBJECTS[subject]?.topics ?? [] : [];

  const handleGenerate = () => {
    if (!cls || !subject || !topic) return;
    setResult({ cls, subject, topic, data: getTopicData(topic, subject) });
    setTimeout(() => document.getElementById('substitute-results')?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const subjectStyle = subject ? SUBJECTS[subject] : null;

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">מאגר מילוי מקום</h1>
        <p className="text-gray-500 text-sm mt-1">בחרו כיתה, מקצוע ונושא — וקבלו שיעור מוכן עם בוט ייעודי. אפס שיעורים אבודים.</p>
      </div>

      {/* Selector card */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-gray-800 text-lg">בניית שיעור מילוי מקום</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">כיתה</label>
            <select
              value={cls}
              onChange={e => setCls(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            >
              <option value="">בחר כיתה...</option>
              {CLASSES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">מקצוע</label>
            <select
              value={subject}
              onChange={e => { setSubject(e.target.value); setTopic(''); }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            >
              <option value="">בחר מקצוע...</option>
              {Object.keys(SUBJECTS).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">נושא</label>
            <select
              value={topic}
              onChange={e => setTopic(e.target.value)}
              disabled={!subject}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">בחר נושא...</option>
              {topics.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={!cls || !subject || !topic}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          צור חומרי שיעור ←
        </button>
      </div>

      {/* Results */}
      {result && (
        <div id="substitute-results" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{result.topic}</h2>
              <p className={`text-sm font-medium mt-0.5 ${subjectStyle?.color ?? 'text-gray-600'}`}>
                {result.subject} | {result.cls} | 45 דקות
              </p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">✓ שיעור מוכן</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Tasks — 2 cols */}
            <div className="col-span-2 grid grid-cols-2 gap-3">
              {result.data.tasks.map((task, i) => (
                <div key={task.num} className={`rounded-xl border p-4 ${TASK_COLORS[i]}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{task.icon}</span>
                    <span className="text-xs font-bold text-gray-400">שלב {task.num}</span>
                    <span className="mr-auto text-xs font-medium text-gray-500 bg-white rounded-full px-2 py-0.5 border">{task.duration}</span>
                  </div>
                  <p className="font-bold text-sm text-gray-800 mb-1">{task.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{task.desc}</p>
                </div>
              ))}
            </div>

            {/* Bot card — 1 col */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl p-5 text-white flex flex-col">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-bold text-sm leading-tight mb-2">{result.data.bot.name}</h3>
              <p className="text-slate-300 text-xs leading-relaxed flex-1">{result.data.bot.desc}</p>
              <a
                href={result.data.bot.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full bg-white text-slate-900 font-bold text-sm py-2.5 rounded-lg text-center hover:bg-slate-100 transition-colors"
              >
                פתח את הבוט ←
              </a>
              <p className="text-slate-500 text-xs mt-2 text-center">NotebookLM | מאומן על חומרי הנושא</p>
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-100 pt-2" />

      {/* Process explanation */}
      <div className="space-y-4">
        <h2 className="font-bold text-gray-800 text-lg">איך זה עובד בכיתה?</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { step: '1', icon: '👩‍🏫', title: 'מורה מכין מראש', desc: 'בוחר נושא, מקבל 4 משימות ובוט ייעודי. שולח לינק למחליף.' },
            { step: '2', icon: '🤒', title: 'מורה נעדר', desc: 'המחליף פותח את העמוד, קורא את 4 המשימות — ומתחיל מיד.' },
            { step: '3', icon: '📱', title: 'תלמידים פתחו בוט', desc: 'תלמידים נכנסים לבוט NotebookLM ושואלים שאלות על הנושא.' },
            { step: '4', icon: '✅', title: 'שיעור שלם', desc: 'כל 45 הדקות מנוצלות. ללא שיעור אבוד, ללא בלגן.' },
          ].map(s => (
            <div key={s.step} className="bg-white rounded-xl border shadow-sm p-4 text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">{s.step}</div>
              <p className="font-semibold text-sm text-gray-800">{s.title}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="font-bold text-amber-800 text-sm mb-2">💡 טיפים למחליף</p>
          <ul className="space-y-1.5">
            {[
              'הקרינו את המשימות על הלוח — כך כולם רואים מה צריך לעשות.',
              'תנו לתלמידים 2 דקות לקרוא את כל המשימות לפני שמתחילים.',
              'הבוט עונה בעברית — עודדו תלמידים לשאול שאלות שנתקעו בהן.',
              'בסוף השיעור — בקשו מ-2 תלמידים לשתף מה למדו מהבוט.',
            ].map((tip, i) => (
              <li key={i} className="text-xs text-amber-700 flex items-start gap-2">
                <span className="shrink-0 font-bold mt-0.5">→</span>{tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tools */}
      <div className="space-y-4">
        <h2 className="font-bold text-gray-800 text-lg">כלי AI מרכזיים לשיעורי מילוי מקום</h2>
        <div className="grid grid-cols-2 gap-4">
          {TOOLS.map(tool => (
            <div key={tool.name} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className={`${tool.color} px-5 py-3 flex items-center gap-3`}>
                <span className="text-2xl">{tool.logo}</span>
                <div>
                  <p className="font-bold text-white text-sm">{tool.name}</p>
                  <p className="text-white text-opacity-80 text-xs opacity-80">{tool.tagline}</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-gray-600 leading-relaxed">{tool.desc}</p>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">איך מתחילים:</p>
                  <ol className="space-y-1">
                    {tool.steps.map((step, i) => (
                      <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                        <span className="shrink-0 w-4 h-4 rounded-full bg-gray-100 text-gray-500 font-bold text-center leading-4 text-[10px]">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-500"><span className="font-semibold">טיפ:</span> {tool.tip}</p>
                </div>
                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-800 py-1.5 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  כניסה ל-{tool.name} ←
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
