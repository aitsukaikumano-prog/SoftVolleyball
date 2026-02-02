
import { Team, GroupType } from './types';

export const INITIAL_TEAMS: Team[] = [
  // Group A
  { id: 'a1', name: 'Jイレブン', group: 'A' },
  { id: 'a2', name: 'くまさき', group: 'A' },
  { id: 'a3', name: '矢野', group: 'A' },
  { id: 'a4', name: '矢野西', group: 'A' },
  // Group B
  { id: 'b1', name: 'やねこいね', group: 'B' },
  { id: 'b2', name: '矢野南', group: 'B' },
  { id: 'b3', name: '瀬戸内石材店', group: 'B' },
  { id: 'b4', name: '矢野413', group: 'B' },
  { id: 'b5', name: '咲ちゃん', group: 'B' },
];

export const GROUP_CONFIG = {
  A: {
    maxSets: 3,
    win20: 3,
    win21: 2,
    lose12: 1,
    lose02: 0,
    label: 'グループA',
    matchType: '3セットマッチ',
    rules: '①勝点(2-0勝:3、2-1勝:2、1-2負:1、0-2負:0) ②得失点 ③ジャンケン'
  },
  B: {
    maxSets: 2,
    win20: 2,
    draw11: 1,
    lose02: 0,
    label: 'グループB',
    matchType: '2セットマッチ',
    rules: '①勝点(2-0勝:2、1-1引:1、0-2負:0) ②得失点 ③ジャンケン'
  }
};
