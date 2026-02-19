import React, { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import AnalysisList from './components/AnalysisList.jsx';
import SubmitForm from './components/SubmitForm.jsx';
import AnalysisDetail from './components/AnalysisDetail.jsx';

const TABS = ['Dashboard', 'Analyses', 'Submit'];

export default function App() {
  const [tab, setTab] = useState('Dashboard');
  const [selectedId, setSelectedId] = useState(null);

  function handleViewDetail(id) {
    setSelectedId(id);
  }

  function handleBack() {
    setSelectedId(null);
  }

  if (selectedId) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Nav tab={tab} setTab={setTab} />
        <main className="max-w-6xl mx-auto px-4 py-6">
          <AnalysisDetail id={selectedId} onBack={handleBack} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Nav tab={tab} setTab={(t) => { setTab(t); setSelectedId(null); }} />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab === 'Dashboard' && <Dashboard onViewDetail={handleViewDetail} />}
        {tab === 'Analyses' && <AnalysisList onViewDetail={handleViewDetail} />}
        {tab === 'Submit' && <SubmitForm onDone={(id) => { setSelectedId(id); }} />}
      </main>
    </div>
  );
}

function Nav({ tab, setTab }) {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-sm font-bold text-gray-950">D</div>
          <span className="text-lg font-semibold text-gray-100">DebugAI</span>
        </div>
        <nav className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
