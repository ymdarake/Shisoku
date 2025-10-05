import type { RankingEntry } from '../types';

const RANKING_KEY = 'mathPuzzleRanking';
const MAX_RANKING_ENTRIES = 10;

export const getRankings = (): RankingEntry[] => {
  try {
    const rankingsJson = localStorage.getItem(RANKING_KEY);
    if (!rankingsJson) {
      return [];
    }
    return JSON.parse(rankingsJson);
  } catch (error) {
    console.error("Failed to parse rankings from localStorage", error);
    return [];
  }
};

export const saveRanking = (newEntry: RankingEntry): RankingEntry[] => {
  const rankings = getRankings();
  rankings.push(newEntry);

  // Sort by score (desc), then time (asc)
  rankings.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    return a.time - b.time;
  });

  const updatedRankings = rankings.slice(0, MAX_RANKING_ENTRIES);

  try {
    localStorage.setItem(RANKING_KEY, JSON.stringify(updatedRankings));
  } catch (error) {
    console.error("Failed to save rankings to localStorage", error);
  }
  
  return updatedRankings;
};
