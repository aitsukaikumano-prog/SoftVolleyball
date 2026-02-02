
import React, { useRef, useState, useEffect } from 'react';
import { Team, MatchResult, TeamStats, GroupType } from '../types';
import { findMatchBetweenTeams, calculateMatchPoints } from '../logic';
import { GROUP_CONFIG } from '../constants';

interface TournamentTableProps {
  teams: Team[];
  matches: MatchResult[];
  stats: TeamStats[];
  group: GroupType;
}

const TournamentTable: React.FC<TournamentTableProps> = ({ teams, matches, stats, group }) => {
  const groupTeams = teams.filter(t => t.group === group);
  const config = GROUP_CONFIG[group];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRightGradient, setShowRightGradient] = useState(false);
  const [showLeftGradient, setShowLeftGradient] = useState(false);

  // スクロール状態を監視して、左右にグラデーションを出すか決める
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    // 左側にスクロールの余地があるか
    setShowLeftGradient(scrollLeft > 10);
    // 右側にスクロールの余地があるか
    setShowRightGradient(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    handleScroll();
    // 画面サイズ変更時にも再計算
    const observer = new ResizeObserver(handleScroll);
    if (scrollRef.current) observer.observe(scrollRef.current);
    
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('resize', handleScroll);
      observer.disconnect();
    };
  }, [group, teams.length]);

  return (
    <div className="relative">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mb-6 relative">
        {/* 表の上部情報セクション */}
        <div className="flex border-b border-slate-300 min-h-[80px]">
          <div className="w-1/3 p-2 flex flex-col items-center justify-center border-r border-slate-300 bg-slate-50">
            <h2 className="text-sm font-black text-slate-800 text-center leading-tight">
              {config.label}<br />
              <span className="text-[11px] font-bold">({groupTeams.length}チーム)</span>
            </h2>
          </div>
          <div className="w-1/4 p-2 flex items-center justify-center border-r border-slate-300">
            <span className="text-xs font-black text-slate-700 whitespace-nowrap">
              {config.matchType}
            </span>
          </div>
          <div className="w-5/12 p-2 bg-white flex flex-col justify-center text-[9px] leading-relaxed text-slate-500 font-medium">
            <div>①勝点({group === 'A' ? '2-0勝:3, 2-1勝:2, 1-2負:1, 0-2負:0' : '2-0勝:2, 1-1引:1, 0-2負:0'})</div>
            <div>②得失点差</div>
          </div>
        </div>
        
        <div className="relative">
          {/* 
            左側のグラデーションオーバーレイ 
            固定列(70px)のすぐ右側に配置
          */}
          <div 
            className={`absolute top-0 left-[70px] bottom-0 w-20 bg-gradient-to-r from-white via-white/40 to-transparent z-20 pointer-events-none transition-opacity duration-300 ${
              showLeftGradient ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* 
            右側のグラデーションオーバーレイ 
            幅を広め(w-20)に設定して視認性を向上
          */}
          <div 
            className={`absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/40 to-transparent z-20 pointer-events-none transition-opacity duration-300 ${
              showRightGradient ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="overflow-x-auto overflow-y-hidden scrollbar-hide"
          >
            <table className="w-full text-[10px] border-collapse table-fixed">
              <thead>
                <tr className="bg-white border-b border-slate-300">
                  <th className="py-3 px-1 border-r border-slate-300 w-[70px] sticky left-0 bg-white z-30 shadow-[2px_0_8px_-2px_rgba(0,0,0,0.1)]"></th>
                  {groupTeams.map(team => (
                    <th key={team.id} className="py-3 px-1 border-r border-slate-300 w-[85px] font-bold text-slate-700 text-center overflow-hidden break-words">
                      <div className="line-clamp-2 leading-tight">{team.name}</div>
                    </th>
                  ))}
                  <th className="py-3 px-1 border-r-2 border-slate-400 w-[45px] bg-indigo-50 text-indigo-800 font-black text-center">勝点</th>
                  <th className="py-3 px-1 border-r border-slate-300 w-[70px] bg-slate-50 text-slate-800 font-black text-center">得失点</th>
                  <th className="py-3 px-1 w-[45px] bg-slate-50 text-slate-600 font-bold text-center">順位</th>
                </tr>
              </thead>
              <tbody>
                {groupTeams.map(rowTeam => {
                  const teamStat = stats.find(s => s.teamId === rowTeam.id);
                  return (
                    <tr key={rowTeam.id} className="border-b border-slate-200">
                      <td className="p-0 border-r border-slate-300 sticky left-0 bg-white z-30 shadow-[2px_0_8px_-2px_rgba(0,0,0,0.1)] w-[70px] h-[90px]">
                        <div className="flex items-center justify-center h-full px-1">
                          <div className="line-clamp-3 leading-tight font-bold text-slate-700 text-center">{rowTeam.name}</div>
                        </div>
                      </td>
                      
                      {groupTeams.map(colTeam => {
                        if (rowTeam.id === colTeam.id) {
                          return (
                            <td key={colTeam.id} className="bg-slate-50 border-r border-slate-300 relative p-0 h-[90px]">
                              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                <line x1="0" y1="0" x2="100%" y2="100%" stroke="#cbd5e1" strokeWidth="1" />
                              </svg>
                            </td>
                          );
                        }

                        const match = findMatchBetweenTeams(matches, rowTeam.id, colTeam.id);
                        if (!match || !match.isCompleted) {
                          return (
                            <td key={colTeam.id} className="border-r border-slate-300 p-0 h-[90px]">
                              <div className="flex flex-col items-center justify-center h-full">
                                <div className="space-y-1 text-slate-200 font-sans text-xs">
                                  {Array.from({ length: config.maxSets }).map((_, i) => (
                                    <div key={i} className="text-center w-8 border-b border-slate-100 last:border-0">-</div>
                                  ))}
                                </div>
                                <div className="mt-auto py-1 w-full text-center text-[9px] text-slate-300 font-bold bg-slate-50/50">勝点 : -</div>
                              </div>
                            </td>
                          );
                        }

                        const isTeam1 = match.team1Id === rowTeam.id;
                        const points = calculateMatchPoints(match, rowTeam.id);

                        return (
                          <td key={colTeam.id} className="border-r border-slate-300 p-0 h-[90px] hover:bg-slate-50 transition-colors">
                            <div className="flex flex-col items-center justify-center h-full">
                              <div className="flex flex-col justify-center flex-grow py-1">
                                {match.sets.map((set, i) => (
                                  <div key={i} className="text-center font-sans py-0.5 leading-none text-[11px] text-slate-800">
                                    <span className="inline-block w-4 text-right">{isTeam1 ? (set.team1 ?? '-') : (set.team2 ?? '-')}</span>
                                    <span className="mx-1 text-indigo-100 font-light">-</span>
                                    <span className="inline-block w-4 text-left">{isTeam1 ? (set.team2 ?? '-') : (set.team1 ?? '-')}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="w-full text-center py-1 text-[10px] font-black text-indigo-600 bg-indigo-50/30">
                                勝点 : {points}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                      
                      <td className="p-0 border-r-2 border-slate-400 bg-indigo-50/30 h-[90px]">
                        <div className="flex items-center justify-center h-full font-black text-indigo-700 text-sm">
                          {teamStat?.points || 0}
                        </div>
                      </td>
                      
                      <td className="p-0 border-r border-slate-300 bg-white h-[90px]">
                        <div className="flex flex-col h-full">
                          <div className="flex-1 flex items-center justify-center font-semibold text-slate-800 text-xs px-1 tracking-tight">
                            {teamStat ? `${teamStat.totalGained} - ${teamStat.totalLost}` : '-'}
                          </div>
                          <div className="border-t border-dotted border-slate-300 w-full"></div>
                          <div className="flex-1 flex items-center justify-center font-black text-slate-900 text-xs">
                            {teamStat ? (
                              teamStat.scoreDiff > 0 ? `${teamStat.scoreDiff}` :
                              teamStat.scoreDiff < 0 ? `${teamStat.scoreDiff}` : '0'
                            ) : '-'}
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-0 bg-slate-50/30 h-[90px]">
                        <div className="flex items-center justify-center h-full">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-black shadow-sm ${
                            teamStat?.rank === 1 ? 'bg-yellow-400 text-white' : 
                            teamStat?.rank === 2 ? 'bg-slate-300 text-white' : 
                            teamStat?.rank === 3 ? 'bg-amber-600 text-white' : 'bg-white text-slate-400 border border-slate-200'
                          }`}>
                            {teamStat?.rank || '-'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentTable;
