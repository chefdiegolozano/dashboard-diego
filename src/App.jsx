import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Calendar } from './components/Calendar';
import { Metrics } from './components/Metrics';
import { Pautas } from './components/Pautas';
import { Templates } from './components/Templates';
import { Checklist } from './components/Checklist';
import { Kanban } from './components/Kanban';
import { Workflow } from './components/Workflow';
import { Automation } from './components/Automation';
import { RulesPlaybook } from './components/RulesPlaybook';
import { Settings } from './components/Settings';
import { ToastContainer } from './components/ui/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PAUTAS_INICIAIS } from './data/pautas';
import { MANYCHAT_TRIGGERS_INICIAIS } from './data/manychatTriggers';

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('dl_session') === 'authenticated'
  );

  const handleLogout = () => {
    sessionStorage.removeItem('dl_session');
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />;
  }

  const [posts, setPosts] = useLocalStorage('dl_posts', []);
  const [pautas, setPautas] = useLocalStorage('dl_pautas', PAUTAS_INICIAIS);
  const [calendarData, setCalendarData] = useLocalStorage('dl_calendar', {});
  const [storiesData, setStoriesData] = useLocalStorage('dl_stories', {});
  const [drafts, setDrafts] = useLocalStorage('dl_drafts', []);
  const [checklists, setChecklists] = useLocalStorage('dl_checklists', []);
  const [kanban, setKanban] = useLocalStorage('dl_kanban', {});
  const [triggers, setTriggers] = useLocalStorage('dl_manychat', MANYCHAT_TRIGGERS_INICIAIS);
  const [apiKey, setApiKey] = useLocalStorage('dl_anthropic_key', '');

  const handleImport = (data) => {
    if (data.posts) setPosts(data.posts);
    if (data.pautas) setPautas(data.pautas);
    if (data.calendarData) setCalendarData(data.calendarData);
    if (data.storiesData) setStoriesData(data.storiesData);
    if (data.drafts) setDrafts(data.drafts);
    if (data.checklists) setChecklists(data.checklists);
    if (data.kanban) setKanban(data.kanban);
    if (data.triggers) setTriggers(data.triggers);
  };

  const handleReset = () => {
    setPosts([]);
    setPautas(PAUTAS_INICIAIS);
    setCalendarData({});
    setStoriesData({});
    setDrafts([]);
    setChecklists([]);
    setKanban({});
    setTriggers(MANYCHAT_TRIGGERS_INICIAIS);
  };

  const pages = {
    dashboard: <Dashboard posts={posts} />,
    calendario: <Calendar calendarData={calendarData} setCalendarData={setCalendarData} storiesData={storiesData} setStoriesData={setStoriesData} />,
    metricas: <Metrics posts={posts} setPosts={setPosts} />,
    pautas: <Pautas pautas={pautas} setPautas={setPautas} />,
    templates: <Templates drafts={drafts} setDrafts={setDrafts} apiKey={apiKey} />,
    checklist: <Checklist checklists={checklists} setChecklists={setChecklists} />,
    kanban: <Kanban kanban={kanban} setKanban={setKanban} apiKey={apiKey} />,
    workflow: <Workflow />,
    automacao: <Automation triggers={triggers} setTriggers={setTriggers} />,
    regras: <RulesPlaybook />,
    config: <Settings
      posts={posts} pautas={pautas} calendarData={calendarData}
      storiesData={storiesData} drafts={drafts} checklists={checklists}
      kanban={kanban} triggers={triggers}
      onImport={handleImport} onReset={handleReset}
      apiKey={apiKey} setApiKey={setApiKey}
    />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5EDE0' }}>
      <Sidebar active={active} onNavigate={setActive} onLogout={handleLogout} />
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh', background: '#F5EDE0' }}>
        {pages[active] || <div style={{ padding: '32px', color: '#999' }}>Seção não encontrada</div>}
      </main>
      <ToastContainer />
    </div>
  );
}
