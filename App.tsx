
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
import { database, ref, set, onValue, get } from './firebase';

const STORAGE_KEY = 'softvolley_local_data_v1';
const DB_PATH = 'tournament';

const App: React.FC = () => {
  // 表示モードの定義と初期値の設定：対戦カード(matches)を最初に
  const [viewMode, setViewMode] = useState<'matches' | 'ranking' | 'table'>('matches');
  
  const createInitialData = useCallback((): TournamentData => ({
    teams: INITIAL_TEAMS,
    matches: generateRoundRobinMatches(INITIAL_TEAMS),
    lastUpdated: new Date().toISOString(),
  }), []);

  // Firebaseを優先するため、初期状態はcreateInitialData()を使用
  const [data, setData] = useState<TournamentData>(createInitialData);

  const [role] = useState<UserRole>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('role') === 'admin' ? UserRole.ADMIN : UserRole.GENERAL;
  });

  const [activeGroup, setActiveGroup] = useState<GroupType>('A');
  const [editingMatch, setEditingMatch] = useState<MatchResult | null>(null);
  const [showAdminTools, setShowAdminTools] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'success'>('idle');

  const syncFromCloud = useCallback(() => {
    setSyncStatus('syncing');
    const dbRef = ref(database, DB_PATH);

    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const cloudData = snapshot.val();
          // Firebaseデータを常に優先
          setData(cloudData);
        }
        setSyncStatus('success');
      })
      .catch((error) => {
        console.error('Sync error:', error);
        setSyncStatus('error');
      });
  }, []);

  const syncToCloud = async (newData: TournamentData) => {
    setSyncStatus('syncing');
    try {
      const dbRef = ref(database, DB_PATH);
      await set(dbRef, newData);
      setSyncStatus('success');
    } catch (error) {
      console.error('Save error:', error);
      setSyncStatus('error');
    }
  };

  useEffect(() => {
    // 初回読み込み
    syncFromCloud();

    // リアルタイム同期を設定
    const dbRef = ref(database, DB_PATH);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const cloudData = snapshot.val();
        // Firebaseデータを常に優先
        setData(cloudData);
        setSyncStatus('success');
      }
    });

    return () => unsubscribe();
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
      // 全試合を未完了にし、スコアを0にリセット
      const resetMatches = initial.matches.map(match => ({
        ...match,
        sets: match.sets.map(() => ({ team1: 0, team2: 0 })),
        isCompleted: false
      }));
      const emptyData = {
        ...initial,
        matches: resetMatches,
        lastUpdated: new Date().toISOString()
      };
      setData(emptyData);
      syncToCloud(emptyData);
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
