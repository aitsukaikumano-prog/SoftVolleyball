
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
  const [errors, setErrors] = useState<string[]>([]);

  const team1Name = teams.find(t => t.id === match.team1Id)?.name;
  const team2Name = teams.find(t => t.id === match.team2Id)?.name;

  const handleScoreChange = (index: number, team: 'team1' | 'team2', value: string) => {
    const num = parseInt(value, 10);
    const newSets = [...sets];
    newSets[index][team] = isNaN(num) ? 0 : num;
    setSets(newSets);
    setErrors([]);
  };

  const validateScores = (): string[] => {
    const validationErrors: string[] = [];

    sets.forEach((set, index) => {
      const s1 = set.team1 || 0;
      const s2 = set.team2 || 0;

      // 両方0点のセットはスキップ（入力なし）
      if (s1 === 0 && s2 === 0) return;

      // ソフトバレーのルール検証
      const max = Math.max(s1, s2);
      const min = Math.min(s1, s2);

      // 15点先取のルール
      if (max < 15) {
        validationErrors.push(`Set ${index + 1}: どちらかが15点以上必要です`);
      } else if (max === 15) {
        // 15点で終わる場合、相手は13点以下である必要がある
        if (min >= 14) {
          validationErrors.push(`Set ${index + 1}: 14-14以降は2点差が必要です`);
        }
      } else if (max > 15) {
        // 15点を超える場合、2点差が必要
        if (max - min < 2) {
          validationErrors.push(`Set ${index + 1}: 2点差が必要です (${s1}-${s2})`);
        }
      }
    });

    // 少なくとも1セットは入力が必要
    const hasInput = sets.some(s => (s.team1 || 0) > 0 || (s.team2 || 0) > 0);
    if (!hasInput) {
      validationErrors.push('少なくとも1セットのスコアを入力してください');
    }

    return validationErrors;
  };

  const handleComplete = () => {
    const validationErrors = validateScores();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

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
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12"></div>
            <div className="w-full text-center text-xs font-bold text-gray-500">{team1Name}</div>
            <div className="invisible">-</div>
            <div className="w-full text-center text-xs font-bold text-gray-500">{team2Name}</div>
          </div>

          <div className="space-y-4">
            {sets.map((set, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-[10px] font-bold text-gray-400 w-12 whitespace-nowrap">Set {i+1}</div>
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

          {errors.length > 0 && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <i className="fas fa-exclamation-circle text-red-500 text-sm mt-0.5"></i>
                <div className="flex-1">
                  <p className="text-xs font-bold text-red-700 mb-1">入力エラー</p>
                  <ul className="text-xs text-red-600 space-y-1">
                    {errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

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
