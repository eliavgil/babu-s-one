'use client';
import { useState } from 'react';

const USERS = [
  { username: 'dcohen', password: '1234', name: 'דוד כהן' },
  { username: 'slabne', password: '1234', name: 'שרית לבנה' },
];

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('school_demo_user', user.name);
      onLogin();
    } else {
      setError('שם משתמש או סיסמה שגויים');
    }
  };

  const quickLogin = () => {
    setUsername('dcohen');
    setPassword('1234');
    localStorage.setItem('school_demo_user', 'דוד כהן');
    onLogin();
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-800 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-8 py-8 text-center">
          <div className="text-5xl mb-3">🏫</div>
          <h1 className="text-white text-2xl font-bold">מערכת ניהול חינוכי</h1>
          <p className="text-blue-200 text-sm mt-1">מופעל על ידי בינה מלאכותית</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם משתמש</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="הכנס שם משתמש"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
          >
            כניסה למערכת
          </button>

          <div className="border-t pt-4">
            <p className="text-xs text-gray-400 text-center mb-3">כניסה מהירה להדגמה</p>
            <button
              type="button"
              onClick={quickLogin}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <img src="https://i.pravatar.cc/24?img=33" className="w-6 h-6 rounded-full" alt="" />
              דוד כהן — מחנך כיתה י׳ג
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
