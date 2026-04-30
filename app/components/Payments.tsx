'use client';
import { useState } from 'react';
import { PAYMENTS, STUDENTS } from '../data';
import { BotPaymentOverride } from '../page';

const PAYMENT_TOTAL = 1200;

export default function Payments({ paymentOverrides = {} }: { paymentOverrides?: Record<number, BotPaymentOverride> }) {
  const [filter, setFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');
  const [whatsappModal, setWhatsappModal] = useState<typeof PAYMENTS[0] | null>(null);
  const [generatedMsg, setGeneratedMsg] = useState('');
  const [generating, setGenerating] = useState(false);
  const [msgCopied, setMsgCopied] = useState(false);

  // Merge base data with bot overrides
  const mergedPayments = PAYMENTS.map(p => {
    const ov = paymentOverrides[p.id];
    return ov ? { ...p, paid: ov.paid, date: ov.date } : p;
  });

  const filtered = mergedPayments.filter(p => {
    if (filter === 'paid')    return p.paid >= p.total && p.total > 0;
    if (filter === 'partial') return p.paid > 0 && p.paid < p.total;
    if (filter === 'unpaid')  return p.paid === 0 && p.total > 0;
    return true;
  });

  const totalCollected = mergedPayments.reduce((sum, p) => sum + p.paid, 0);
  const totalExpected  = mergedPayments.reduce((sum, p) => sum + p.total, 0);
  const unpaidCount    = mergedPayments.filter(p => p.paid < p.total && p.total > 0).length;

  const generateMessage = (payment: typeof PAYMENTS[0]) => {
    setGenerating(true);
    setGeneratedMsg('');
    setTimeout(() => {
      const remaining = payment.total - payment.paid;
      const msg = payment.paid === 0
        ? `שלום ${payment.parent} 😊\n\nאני דוד כהן, מחנך כיתה י׳ג.\nרציתי להזכיר בנוגע לתשלום עבור ${payment.name}.\n\nנכון לעכשיו טרם התקבל תשלום עבור ההשתלמות השנתית.\nסכום לתשלום: ${payment.total} ₪\n\nניתן לשלם באחת מהדרכים הבאות:\n• אפליקציית משלמים — https://pay.school.il\n• העברה בנקאית: בנק 12, סניף 123, חשבון 123456\n• מזומן במזכירות בית הספר\n\nאנא צרו איתנו קשר אם יש קושי בתשלום — נשמח לסייע 🙏\n\nתודה, דוד כהן`
        : `שלום ${payment.parent} 😊\n\nאני דוד כהן, מחנך כיתה י׳ג.\nתודה על תשלום ${payment.paid} ₪ שהתקבל ב-${payment.date}.\n\nנותר לתשלום: ${remaining} ₪\n\nניתן להשלים את היתרה באחת מהדרכים הבאות:\n• אפליקציית משלמים — https://pay.school.il\n• העברה בנקאית: בנק 12, סניף 123, חשבון 123456\n\nאנא צרו איתנו קשר אם יש קושי 🙏\n\nתודה, דוד כהן`;
      setGeneratedMsg(msg);
      setGenerating(false);
    }, 1500);
  };

  const getStatusBadge = (p: typeof PAYMENTS[0]) => {
    if (p.total === 0) return <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">מלגה מלאה</span>;
    if (p.paid >= p.total) return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">שולם</span>;
    if (p.paid > 0) return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">חלקי</span>;
    return <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">לא שולם</span>;
  };

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">ניהול תשלומים — כיתה י׳ג</h1>
        <p className="text-gray-500 text-sm mt-1">השתלמות שנתית | תשלום מלא: {PAYMENT_TOTAL} ₪</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'נגבה',       value: `${totalCollected.toLocaleString()} ₪`, sub: `מתוך ${totalExpected.toLocaleString()} ₪`, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
          { label: 'שילמו במלא', value: mergedPayments.filter(p => p.paid >= p.total && p.total > 0).length, sub: 'תלמידים', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
          { label: 'תשלום חלקי', value: mergedPayments.filter(p => p.paid > 0 && p.paid < p.total).length, sub: 'תלמידים', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
          { label: 'לא שילמו',   value: mergedPayments.filter(p => p.paid === 0 && p.total > 0).length, sub: 'תלמידים', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} rounded-xl border p-4 text-center`}>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            <p className="text-xs text-gray-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">אחוז גבייה כולל</span>
          <span className="text-sm font-bold text-blue-600">{Math.round((totalCollected / totalExpected) * 100)}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-l from-blue-500 to-blue-600 rounded-full transition-all" style={{ width: `${(totalCollected / totalExpected) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-gray-400">
          <span>{totalCollected.toLocaleString()} ₪ נגבו</span>
          <span>{(totalExpected - totalCollected).toLocaleString()} ₪ נותרו</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[['all','הכל'],['paid','שולם במלא'],['partial','תשלום חלקי'],['unpaid','לא שולם']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val as any)}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors ${filter === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['תלמיד', 'הורה/אחראי', 'שולם', 'חסר', 'פניות', 'תאריך', 'הערה', 'פעולות'].map(h => (
                <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(p => {
              const student = STUDENTS.find(s => s.id === p.id);
              const remaining = p.total - p.paid;
              return (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={student?.photo} className="w-8 h-8 rounded-full object-cover" alt="" />
                      <div>
                        <p className="font-medium text-gray-800">{p.name}</p>
                        {getStatusBadge(p)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.parent}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${p.paid >= p.total && p.total > 0 ? 'text-green-600' : p.paid > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                      {p.paid > 0 ? `${p.paid} ₪` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${remaining > 0 ? 'text-red-500' : 'text-gray-300'}`}>
                      {remaining > 0 ? `${remaining} ₪` : '✓'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.reminders > 0 ? (
                      <span className={`text-xs font-medium ${p.reminders >= 4 ? 'text-red-600' : 'text-amber-600'}`}>{p.reminders} פניות</span>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{p.date || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[140px]">
                    {p.note ? <span className="text-amber-700">{p.note}</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {remaining > 0 && p.total > 0 && (
                      <button
                        onClick={() => { setWhatsappModal(p); setGeneratedMsg(''); setMsgCopied(false); }}
                        className="flex items-center gap-1.5 bg-green-100 hover:bg-green-200 text-green-800 text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                      >
                        <span>💬</span> WhatsApp
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* WhatsApp modal */}
      {whatsappModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setWhatsappModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-800 mb-1">יצירת הודעת WhatsApp</h3>
            <p className="text-sm text-gray-500 mb-4">ל-{whatsappModal.parent} (הורה של {whatsappModal.name})</p>

            {!generatedMsg && !generating && (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">🤖</div>
                <p className="text-sm text-gray-600 mb-4">AI יכתוב הודעה מקצועית ואישית בהתאם לנתוני התשלום</p>
                <button
                  onClick={() => generateMessage(whatsappModal)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  ✨ צור הודעה אוטומטית
                </button>
              </div>
            )}

            {generating && (
              <div className="text-center py-6">
                <div className="text-4xl mb-3 animate-bounce">✍️</div>
                <p className="text-sm text-gray-500">מנסח הודעה...</p>
              </div>
            )}

            {generatedMsg && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{generatedMsg}</pre>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setWhatsappModal(null)} className="flex-1 border text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">סגור</button>
                  <button
                    onClick={() => { navigator.clipboard?.writeText(generatedMsg); setMsgCopied(true); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${msgCopied ? 'bg-green-100 text-green-700' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
                  >
                    {msgCopied ? '✓ הועתק!' : '📋 העתק הודעה'}
                  </button>
                  <a
                    href={`https://wa.me/${whatsappModal.parent.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(generatedMsg)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium text-center transition-colors"
                  >
                    📲 פתח WhatsApp
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
