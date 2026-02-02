
import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, TournamentData, MatchResult, GroupType } from './types';
import { INITIAL_TEAMS } from './constants';
import { generateRoundRobinMatches, calculateStats } from './logic';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MatchList from './components/MatchList';
import AdminTools from './components/AdminTools';
import ScoreModal from './components/ScoreModal';
import TournamentTable from './components/TournamentTable';

const STORAGE_KEY = 'softvolley_local_data_v1';
const CLOUD_API = 'https://kvdb.io/A2W278mS3zLhW8WvXz6m9j/default_tournament';

const App: React.FC = () => {
  // 表示モードの定義と初期値の設定：対戦カード(matches)を最初に
  const [viewMode, setViewMode] = useState<'matches' | 'ranking' | 'table'>('matches');
  
  const createInitialData = useCallback((): TournamentData => ({
    teams: INITIAL_TEAMS,
    matches: generateRoundRobinMatches(INITIAL_TEAMS),
    lastUpdated: new Date().toISOString(),
  }), []);

  const [data, setData] = useState<TournamentData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return createInitialData();
  });

  const [role] = useState<UserRole>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('role') === 'admin' ? UserRole.ADMIN : UserRole.GENERAL;
  });

  const [activeGroup, setActiveGroup] = useState<GroupType>('A');
  const [editingMatch, setEditingMatch] = useState<MatchResult | null>(null);
  const [showAdminTools, setShowAdminTools] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'success'>('idle');

  const syncFromCloud = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      const response = await fetch(`${CLOUD_API}?t=${Date.now()}`);
      if (response.ok) {
        const cloudData = await response.json();
        if (new Date(cloudData.lastUpdated) > new Date(data.lastUpdated)) {
          setData(cloudData);
        }
        setSyncStatus('success');
      }
    } catch (e) {
      setSyncStatus('error');
    }
  }, [data.lastUpdated]);

  const syncToCloud = async (newData: TournamentData) => {
    setSyncStatus('syncing');
    try {
      await fetch(CLOUD_API, {
        method: 'POST',
        body: JSON.stringify(newData),
      });
      setSyncStatus('success');
    } catch (e) {
      setSyncStatus('error');
    }
  };

  useEffect(() => {
    syncFromCloud();
    const timer = setInterval(syncFromCloud, 30000);
    return () => clearInterval(timer);
  }, [syncFromCloud]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateMatch = (updatedMatch: MatchResult) => {
    const newMatches = data.matches.map(m => m.id === updatedMatch.id ? updatedMatch : m);
    const newData = {
      ...data,
      matches: newMatches,
      lastUpdated: new Date().toISOString()
    };
    setData(newData);
    setEditingMatch(null);
    if (role === UserRole.ADMIN) syncToCloud(newData);
  };

  const resetData = () => {
    if (window.confirm('全てのデータをリセットしますか？')) {
      const initial = createInitialData();
      setData(initial);
      syncToCloud(initial);
      setShowAdminTools(false);
    }
  };

  const stats = calculateStats(data.teams, data.matches, activeGroup);

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      <Header 
        activeGroup={activeGroup} 
        onGroupChange={setActiveGroup} 
        role={role}
        syncStatus={syncStatus}
        onToggleAdminTools={() => setShowAdminTools(!showAdminTools)}
        onRefresh={syncFromCloud}
      />

      <main className="container mx-auto px-4 pt-4 max-w-2xl">
        {/* タブセレクター */}
        <div className="flex bg-white rounded-lg p-1 mb-6 border border-slate-200 shadow-sm max-w-md mx-auto overflow-hidden">
          <button 
            onClick={() => setViewMode('matches')}
            className={`flex-1 py-2.5 text-[11px] font-black tracking-tight rounded-md transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'matches' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <i className="fas fa-volleyball-ball text-[10px]"></i>対戦カード
          </button>
          <button 
            onClick={() => setViewMode('ranking')}
            className={`flex-1 py-2.5 text-[11px] font-black tracking-tight rounded-md transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'ranking' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <i className="fas fa-list-ol text-[10px]"></i>順位表
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`flex-1 py-2.5 text-[11px] font-black tracking-tight rounded-md transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'table' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <i className="fas fa-table text-[10px]"></i>対戦表
          </button>
        </div>

        {/* 各モードに応じたコンテンツレンダリング */}
        {viewMode === 'matches' && (
          <div className="animate-in fade-in duration-300">
            <MatchList 
              matches={data.matches.filter(m => m.group === activeGroup).sort((a,b) => a.matchNumber - b.matchNumber)}
              teams={data.teams}
              role={role}
              onEdit={setEditingMatch}
            />
          </div>
        )}

        {viewMode === 'ranking' && (
          <div className="animate-in fade-in duration-300 max-w-lg mx-auto">
            <Dashboard stats={stats} group={activeGroup} />
          </div>
        )}

        {viewMode === 'table' && (
          <div className="animate-in fade-in duration-300 overflow-hidden">
            <TournamentTable 
              teams={data.teams} 
              matches={data.matches} 
              stats={stats} 
              group={activeGroup} 
            />
          </div>
        )}
      </main>

      {showAdminTools && (
        <AdminTools 
          onReset={resetData} 
          onClose={() => setShowAdminTools(false)} 
          role={role}
        />
      )}

      {editingMatch && (
        <ScoreModal 
          match={editingMatch}
          teams={data.teams}
          onSave={updateMatch}
          onCancel={() => setEditingMatch(null)}
        />
      )}

      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t p-3 flex flex-col items-center gap-1 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
          Last Sync: {new Date(data.lastUpdated).toLocaleTimeString('ja-JP')}
        </div>
        {role === UserRole.ADMIN && (
          <div className="text-[8px] text-indigo-500 font-black tracking-[0.2em]">管理者モード</div>
        )}
      </footer>
    </div>
  );
};

export default App;
