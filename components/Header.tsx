
import React from 'react';
import { GroupType, UserRole } from '../types';

interface HeaderProps {
  activeGroup: GroupType;
  onGroupChange: (group: GroupType) => void;
  role: UserRole;
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
  onToggleAdminTools: () => void;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeGroup, onGroupChange, role, syncStatus, onToggleAdminTools, onRefresh }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20 border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <i className="fas fa-volleyball-ball text-white text-sm"></i>
          </div>
          <div className="min-w-0">
            <h1 className="text-[13px] font-black text-slate-800 leading-tight truncate">
              矢野町内混成ソフトバーレーボール大会
            </h1>
            <div className="flex items-center gap-1 mt-0.5" onClick={onRefresh}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                syncStatus === 'success' ? 'bg-green-500' : 
                syncStatus === 'error' ? 'bg-red-500' : 
                'bg-amber-500 animate-pulse'
              }`}></span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'error' ? 'Offline' : 'Live'}
              </span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onToggleAdminTools}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 active:scale-90 transition shrink-0"
        >
          <i className={`fas ${role === UserRole.ADMIN ? 'fa-share-nodes' : 'fa-info-circle'} text-sm`}></i>
        </button>
      </div>
      
      <div className="flex max-w-lg mx-auto bg-white border-t">
        <button 
          onClick={() => onGroupChange('A')}
          className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${
            activeGroup === 'A' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-400'
          }`}
        >
          Group A
        </button>
        <button 
          onClick={() => onGroupChange('B')}
          className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${
            activeGroup === 'B' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-400'
          }`}
        >
          Group B
        </button>
      </div>
    </header>
  );
};

export default Header;