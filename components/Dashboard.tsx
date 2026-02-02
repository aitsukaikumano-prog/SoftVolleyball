
import React from 'react';
import { TeamStats, GroupType } from '../types';

interface DashboardProps {
  stats: TeamStats[];
  group: GroupType;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-300">
          <tr>
            <th className="py-3 px-3 text-left w-12">順位</th>
            <th className="py-3 px-3 text-left">チーム</th>
            <th className="py-3 px-3 text-center">勝点</th>
            <th className="py-3 px-3 text-center">得失点</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {stats.map((stat, idx) => (
            <tr key={stat.teamId} className={idx === 0 ? "bg-yellow-50/30" : ""}>
              <td className="py-4 px-3">
                <span className={`w-7 h-7 flex items-center justify-center rounded-full text-[11px] font-black shadow-sm ${
                  idx === 0 ? "bg-yellow-400 text-white ring-2 ring-yellow-200" : 
                  idx === 1 ? "bg-slate-300 text-white" : 
                  idx === 2 ? "bg-amber-600 text-white" : "bg-white text-slate-400 border border-slate-200"
                }`}>
                  {stat.rank}
                </span>
              </td>
              <td className="py-4 px-3 font-black text-slate-800 text-[13px]">{stat.name}</td>
              <td className="py-4 px-3 text-center font-black text-indigo-600 text-[15px]">{stat.points}</td>
              <td className="py-3 px-3 text-center">
                <div className="text-[9px] font-bold text-slate-400 mb-0.5">{stat.totalGained}-{stat.totalLost}</div>
                <div className="font-black text-slate-900 text-[14px]">
                  {stat.scoreDiff > 0 ? `+${stat.scoreDiff}` : stat.scoreDiff === 0 ? '0' : stat.scoreDiff}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
