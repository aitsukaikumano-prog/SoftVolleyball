
import { MatchResult, Team, TeamStats, GroupType } from './types';
import { GROUP_CONFIG } from './constants';

export const calculateStats = (teams: Team[], matches: MatchResult[], group: GroupType): TeamStats[] => {
  const groupTeams = teams.filter(t => t.group === group);

  const statsMap: Record<string, TeamStats> = {};
  groupTeams.forEach(team => {
    statsMap[team.id] = {
      teamId: team.id,
      name: team.name,
      points: 0,
      totalGained: 0,
      totalLost: 0,
      scoreDiff: 0,
      rank: 0,
      matchesPlayed: 0
    };
  });

  matches.filter(m => m.group === group && m.isCompleted).forEach(match => {
    const t1 = statsMap[match.team1Id];
    const t2 = statsMap[match.team2Id];

    if (!t1 || !t2) return;

    t1.matchesPlayed++;
    t2.matchesPlayed++;

    let t1SetsWon = 0;
    let t2SetsWon = 0;

    match.sets.forEach(set => {
      const s1 = set.team1 || 0;
      const s2 = set.team2 || 0;
      
      t1.totalGained += s1;
      t1.totalLost += s2;
      t2.totalGained += s2;
      t2.totalLost += s1;

      if (s1 > s2) t1SetsWon++;
      else if (s2 > s1) t2SetsWon++;
    });

    t1.scoreDiff = t1.totalGained - t1.totalLost;
    t2.scoreDiff = t2.totalGained - t2.totalLost;

    if (group === 'A') {
      const config = GROUP_CONFIG['A'];
      if (t1SetsWon >= 2 && t2SetsWon === 0) t1.points += config.win20;
      else if (t1SetsWon >= 2 && t2SetsWon === 1) {
        t1.points += config.win21;
        t2.points += config.lose12;
      }
      else if (t2SetsWon >= 2 && t1SetsWon === 0) t2.points += config.win20;
      else if (t2SetsWon >= 2 && t1SetsWon === 1) {
        t2.points += config.win21;
        t1.points += config.lose12;
      }
    } else {
      const config = GROUP_CONFIG['B'];
      if (t1SetsWon === 2) {
        t1.points += config.win20;
      } else if (t2SetsWon === 2) {
        t2.points += config.win20;
      } else if (t1SetsWon === 1 && t2SetsWon === 1) {
        t1.points += config.draw11;
        t2.points += config.draw11;
      }
    }
  });

  const statsArray = Object.values(statsMap).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.scoreDiff - a.scoreDiff;
  });

  statsArray.forEach((stat, index) => {
    stat.rank = index + 1;
  });

  return statsArray;
};

/**
 * 添付画像（スケジュール表）の順番通りに試合を生成する
 * 15点マッチのサンプルスコアを初期入力
 */
export const generateRoundRobinMatches = (teams: Team[]): MatchResult[] => {
  const matches: MatchResult[] = [];
  
  // Group A (4チーム) - 3セットマッチ
  // Fix: Renamed t1/t2 to team1/team2 in the s array to match SetScore interface
  const groupAData = [
    { n: 1, t1: 'a1', t2: 'a3', ref: 'くまさき', s: [{team1:15,team2:10}, {team1:15,team2:12}, {team1:0,team2:0}] },
    { n: 2, t1: 'a2', t2: 'a4', ref: 'Jイレブン', s: [{team1:15,team2:13}, {team1:10,team2:15}, {team1:15,team2:11}] },
    { n: 3, t1: 'a1', t2: 'a4', ref: '矢野', s: [{team1:15,team2:5}, {team1:15,team2:7}, {team1:0,team2:0}] },
    { n: 4, t1: 'a2', t2: 'a3', ref: '矢野西', s: [{team1:12,team2:15}, {team1:15,team2:10}, {team1:15,team2:13}] },
    { n: 5, t1: 'a3', t2: 'a4', ref: 'Jイレブン・くまさき', s: [{team1:15,team2:8}, {team1:15,team2:14}, {team1:0,team2:0}] },
    { n: 6, t1: 'a1', t2: 'a2', ref: '矢野・矢野西', s: [{team1:15,team2:11}, {team1:15,team2:13}, {team1:0,team2:0}] },
  ];

  groupAData.forEach(m => {
    matches.push({
      id: `A-${m.n}`,
      group: 'A',
      matchNumber: m.n,
      team1Id: m.t1,
      team2Id: m.t2,
      referee: m.ref,
      sets: m.s,
      isCompleted: true
    });
  });

  // Group B (5チーム) - 2セットマッチ
  // Fix: Renamed t1/t2 to team1/team2 in the s array to match SetScore interface
  const groupBData = [
    { n: 1, t1: 'b1', t2: 'b2', ref: '咲ちゃん', s: [{team1:15,team2:10}, {team1:15,team2:12}] },
    { n: 2, t1: 'b3', t2: 'b4', ref: 'やねこいね', s: [{team1:15,team2:13}, {team1:13,team2:15}] },
    { n: 3, t1: 'b1', t2: 'b5', ref: '矢野南', s: [{team1:15,team2:8}, {team1:15,team2:7}] },
    { n: 4, t1: 'b2', t2: 'b3', ref: '矢野413・やねこいね', s: [{team1:11,team2:15}, {team1:15,team2:10}] },
    { n: 5, t1: 'b4', t2: 'b5', ref: '瀬戸内石材店', s: [{team1:15,team2:12}, {team1:15,team2:9}] },
    { n: 6, t1: 'b1', t2: 'b3', ref: '矢野南', s: [{team1:15,team2:13}, {team1:15,team2:14}] },
    { n: 7, t1: 'b2', t2: 'b4', ref: '咲ちゃん', s: [{team1:15,team2:11}, {team1:10,team2:15}] },
    { n: 8, t1: 'b3', t2: 'b5', ref: 'やねこいね', s: [{team1:15,team2:6}, {team1:15,team2:9}] },
    { n: 9, t1: 'b1', t2: 'b4', ref: '瀬戸内石材店', s: [{team1:15,team2:12}, {team1:11,team2:15}] },
    { n: 10, t1: 'b2', t2: 'b5', ref: '矢野413・やねこいね', s: [{team1:15,team2:13}, {team1:15,team2:11}] },
  ];

  groupBData.forEach(m => {
    matches.push({
      id: `B-${m.n}`,
      group: 'B',
      matchNumber: m.n,
      team1Id: m.t1,
      team2Id: m.t2,
      referee: m.ref,
      sets: m.s,
      isCompleted: true
    });
  });

  return matches;
};

export const findMatchBetweenTeams = (matches: MatchResult[], id1: string, id2: string) => {
  return matches.find(m => 
    (m.team1Id === id1 && m.team2Id === id2) || 
    (m.team2Id === id1 && m.team1Id === id2)
  );
};

export const calculateMatchPoints = (match: MatchResult, teamId: string): number => {
  if (!match.isCompleted) return 0;
  
  const isTeam1 = match.team1Id === teamId;
  let teamSets = 0;
  let opponentSets = 0;

  match.sets.forEach(set => {
    const s1 = set.team1 || 0;
    const s2 = set.team2 || 0;
    if (s1 === s2) return;
    if (s1 > s2) isTeam1 ? teamSets++ : opponentSets++;
    else if (s2 > s1) isTeam1 ? opponentSets++ : teamSets++;
  });

  if (match.group === 'A') {
    const config = GROUP_CONFIG['A'];
    if (teamSets >= 2 && opponentSets === 0) return config.win20;
    if (teamSets >= 2 && opponentSets === 1) return config.win21;
    if (teamSets === 1 && opponentSets >= 2) return config.lose12;
    return config.lose02;
  } else {
    const config = GROUP_CONFIG['B'];
    if (teamSets === 2) return config.win20;
    if (teamSets === 1 && opponentSets === 1) return config.draw11;
    return config.lose02;
  }
};
