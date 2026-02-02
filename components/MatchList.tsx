
import React from 'react';
import { MatchResult, Team, UserRole } from '../types';

interface MatchListProps {
  matches: MatchResult[];
  teams: Team[];
  role: UserRole;
  onEdit: (match: MatchResult) => void;
}

const MatchList: React.FC<MatchListProps> = ({ matches, teams, role, onEdit }) => {
  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Unknown';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* テーブルヘッダー - カラム比率を再調整 [試合:50px, 対戦チーム:1fr, 審判:140px] */}
      <div className="grid grid-cols-[50px_1fr_140px] bg-slate-50 border-b border-slate-300 text-center text-[11px] font-black text-slate-700 py-3.5 px-2">
        <div className="border-r border-slate-200">試合</div>
        <div className="border-r border-slate-200">対戦チーム</div>
        <div>審判</div>
      </div>

      <div className="divide-y divide-slate-200">
        {matches.map(match => {
          const team1Sets = match.sets.filter(s => (s.team1 || 0) > (s.team2 || 0)).length;
          const team2Sets = match.sets.filter(s => (s.team2 || 0) > (s.team1 || 0)).length;

          return (
            <div 
              key={match.id} 
              className={`grid grid-cols-[50px_1fr_140px] items-stretch text-center min-h-[90px] hover:bg-slate-50/50 transition-colors ${match.isCompleted ? 'bg-slate-50/20' : ''}`}
            >
              {/* 試合番号 */}
              <div className="flex items-center justify-center font-black text-slate-400 text-sm border-r border-slate-100 bg-slate-50/30">
                {match.matchNumber}
              </div>

              {/* 対戦チーム（中央の広いカラム） */}
              <div className="flex flex-col justify-center gap-2 px-3 py-3 border-r border-slate-100">
                <div className="flex items-center justify-center w-full">
                  <span className="flex-1 text-[13px] font-black text-slate-900 text-right leading-tight break-words">
                    {getTeamName(match.team1Id)}
                  </span>
                  <div className="mx-2 shrink-0 flex flex-col items-center">
                    <span className="text-[9px] font-black text-slate-300 italic tracking-tighter">VS</span>
                  </div>
                  <span className="flex-1 text-[13px] font-black text-slate-900 text-left leading-tight break-words">
                    {getTeamName(match.team2Id)}
                  </span>
                </div>
                
                {/* 状況・結果表示 */}
                <div className="flex justify-center">
                  {match.isCompleted ? (
                    <div className="flex items-center gap-3 bg-indigo-600 px-5 py-1.5 rounded-2xl text-[14px] text-white font-black shadow-lg shadow-indigo-100/50">
                      <span className="w-4 text-center">{team1Sets}</span>
                      <span className="opacity-40 text-[10px] font-light">-</span>
                      <span className="w-4 text-center">{team2Sets}</span>
                    </div>
                  ) : (
                    role === UserRole.ADMIN ? (
                      <button 
                        onClick={() => onEdit(match)}
                        className="text-[10px] font-black text-indigo-600 bg-white px-5 py-1.5 rounded-full border border-indigo-200 shadow-sm hover:bg-indigo-50 active:scale-95 transition-all"
                      >
                        結果入力
                      </button>
                    ) : (
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                        待機中
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* 審判（幅をしっかり確保した右端のカラム） */}
              <div className="flex items-center justify-center text-[11px] font-bold text-slate-600 leading-snug px-4 py-3 bg-slate-50/10 text-center break-words overflow-hidden">
                {match.referee}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchList;
