'use client';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Assessment from './components/Assessment';
import TutorBot from './components/TutorBot';
import Observation from './components/Observation';
import Substitute from './components/Substitute';
import Meetings from './components/Meetings';
import StudentProfile from './components/StudentProfile';
import Payments from './components/Payments';
import ParentComms from './components/ParentComms';
import BotPage from './components/BotPage';
import PersonalSupport from './components/PersonalSupport';
import { SchoolActions } from './components/AssistantBar';

type Page = 'dashboard' | 'assessment' | 'tutor' | 'observation' | 'substitute' | 'meetings' | 'tracking' | 'payments' | 'parentcomms' | 'support' | 'bot' | 'profile';

export interface BotPaymentOverride { paid: number; date: string; }
export interface BotDisciplineEntry { studentId: number; date: string; type: string; desc: string; }
export interface BotNote { studentId: number; text: string; }

export default function SchoolDemo() {
  const [isLoggedIn, setIsLoggedIn]     = useState(false);
  const [currentPage, setCurrentPage]   = useState<Page>('dashboard');

  // ── Mutable state updated by bot ─────────────────────────────────────────
  const [paymentOverrides, setPaymentOverrides] = useState<Record<number, BotPaymentOverride>>({});
  const [botDiscipline, setBotDiscipline]       = useState<BotDisciplineEntry[]>([]);
  const [botNotes, setBotNotes]                 = useState<BotNote[]>([]);
  const [parentDraft, setParentDraft]           = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('school_demo_user')) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('school_demo_user');
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  const navigate = (page: string) => setCurrentPage(page as Page);

  // ── Callbacks exposed to AssistantBar ────────────────────────────────────
  const schoolActions: SchoolActions = {
    updatePayment: (studentId, paid, date) =>
      setPaymentOverrides(prev => ({ ...prev, [studentId]: { paid, date } })),

    addDiscipline: (studentId, desc) =>
      setBotDiscipline(prev => [...prev, {
        studentId, desc, date: '25/4/26', type: 'משמעת',
      }]),

    sendGroupMessage: (text) => setParentDraft(text),

    addNote: (studentId, text) =>
      setBotNotes(prev => [...prev, { studentId, text }]),
  };

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  const sidebarPage = (['profile', 'bot'] as Page[]).includes(currentPage) ? 'dashboard' : currentPage as Exclude<Page, 'profile' | 'bot'>;

  return (
    <Layout currentPage={sidebarPage as any} onNavigate={navigate as any} onLogout={handleLogout}>
      {currentPage === 'dashboard' && (
        <Dashboard
          onViewProfile={() => setCurrentPage('profile')}
          onNavigate={navigate}
          onOpenBotPage={() => setCurrentPage('bot')}
          schoolActions={schoolActions}
        />
      )}
      {currentPage === 'assessment'  && <Assessment />}
      {currentPage === 'tutor'       && <TutorBot />}
      {currentPage === 'observation' && <Observation />}
      {currentPage === 'substitute'  && <Substitute />}
      {currentPage === 'meetings'    && <Meetings />}
      {currentPage === 'tracking'    && (
        <StudentProfile
          onBack={() => setCurrentPage('dashboard')}
          botDiscipline={botDiscipline}
          botNotes={botNotes}
        />
      )}
      {currentPage === 'payments' && (
        <Payments paymentOverrides={paymentOverrides} />
      )}
      {currentPage === 'parentcomms' && (
        <ParentComms
          incomingDraft={parentDraft}
          onDraftConsumed={() => setParentDraft(null)}
        />
      )}
      {currentPage === 'support'  && <PersonalSupport />}
      {currentPage === 'bot'     && <BotPage />}
      {currentPage === 'profile' && (
        <StudentProfile
          onBack={() => setCurrentPage('dashboard')}
          botDiscipline={botDiscipline}
          botNotes={botNotes}
        />
      )}
    </Layout>
  );
}
