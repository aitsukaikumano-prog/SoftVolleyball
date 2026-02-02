
import React, { useState } from 'react';
import { MatchResult, Team, SetScore } from '../types';

interface ScoreModalProps {
  match: MatchResult;
  teams: Team[];
  onSave: (match: MatchResult) => void;
  onCancel: () => void;
}

const ScoreModal: React.FC<ScoreModalProps> = ({ match, teams, onSave, onCancel }) => {
  const [sets, setSets] = useState<SetScore[]>(
    match.sets.map(s => ({ team1: s.team1 || 0, team2: s.team2 || 0 }))
  );

  const team1Name = teams.find(t => t.id === match.team1Id)?.name;
  const team2Name = teams.find(t => t.id === match.team2Id)?.name;

  const handleScoreChange = (index: number, team: 'team1' | 'team2', value: string) => {
    const num = parseInt(value, 10);
    const newSets = [...sets];
    newSets[index][team] = isNaN(num) ? 0 : num;
    setSets(newSets);
  };

  const handleComplete = () => {
    onSave({
      ...match,
      sets,
      isCompleted: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="bg-indigo-600 p-4 text-white">
          <h3 className="font-bold flex items-center gap-2">
            <i className="fas fa-edit"></i>
            スコア入力
          </h3>
          <p className="text-[10px] opacity-80 mt-1">{match.group === 'A' ? '3セットマッチ' : '2セットマッチ'}</p>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="w-1/3 text-left">{team1Name}</div>
            <div className="w-1/3 text-center">セットスコア</div>
            <div className="w-1/3 text-right">{team2Name}</div>
          </div>

          <div className="space-y-4">
            {sets.map((set, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-[10px] font-bold text-gray-400 w-8">Set {i+1}</div>
                <input 
                  type="number" 
                  inputMode="numeric"
                  value={set.team1 || ''} 
                  onChange={(e) => handleScoreChange(i, 'team1', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="0"
                />
                <div className="text-gray-300">-</div>
                <input 
                  type="number" 
                  inputMode="numeric"
                  value={set.team2 || ''} 
                  onChange={(e) => handleScoreChange(i, 'team2', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="0"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              onClick={onCancel}
              className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200"
            >
              キャンセル
            </button>
            <button 
              onClick={handleComplete}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200"
            >
              保存して終了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreModal;
