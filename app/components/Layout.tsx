'use client';
import { TEACHER } from '../data';

type Page = 'dashboard' | 'assessment' | 'tutor' | 'observation' | 'substitute' | 'meetings' | 'tracking' | 'payments' | 'parentcomms' | 'support';

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: 'dashboard',    label: 'עמוד הבית',                     icon: '🏠' },
  { id: 'support',      label: 'מענים אישיים',                  icon: '🧩' },
  { id: 'tracking',     label: 'מעקב פדגוגי-רגשי-חברתי',       icon: '📊' },
  { id: 'parentcomms',  label: 'תקשורת הורים',                  icon: '💬' },
  { id: 'assessment',   label: 'מאגר משימות הערכה',             icon: '📝' },
  { id: 'substitute',   label: 'מאגר מילוי מקום',              icon: '📚' },
  { id: 'tutor',        label: 'בוטים אישיים',                  icon: '🤖' },
  { id: 'meetings',     label: 'סיכום ישיבות',                  icon: '🎙' },
  { id: 'observation',  label: 'שיעורי צפייה',                  icon: '👁' },
  { id: 'payments',     label: 'ניהול תשלומים',                 icon: '💳' },
];

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function Layout({ currentPage, onNavigate, onLogout, children }: LayoutProps) {
  return (
    <div dir="rtl" className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-800 text-white flex flex-col shadow-xl">
        {/* Teacher info */}
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <img src={TEACHER.photo} alt={TEACHER.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-400" />
            <div>
              <p className="font-bold text-sm leading-tight">{TEACHER.name}</p>
              <p className="text-xs text-slate-400 leading-tight mt-0.5">{TEACHER.subject}</p>
              <p className="text-xs text-blue-400 leading-tight">מחנך כיתה {TEACHER.homeroom}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-all text-right
                ${currentPage === item.id
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-500 mb-2 text-center">מופעל על ידי AI | גרסת הדגמה</div>
          <button
            onClick={onLogout}
            className="w-full text-xs text-slate-400 hover:text-white py-1.5 rounded hover:bg-slate-700 transition-colors"
          >
            יציאה מהמערכת
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
