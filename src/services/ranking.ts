import type { RankingEntry, Difficulty } from '../types';

const RANKING_KEY = 'mathPuzzleRanking';
const keyFor = (difficulty?: Difficulty) => (difficulty ? `${RANKING_KEY}:${difficulty}` : RANKING_KEY);
const MAX_RANKING_ENTRIES = 10;

export const getRankings = (difficulty?: Difficulty): RankingEntry[] => {
  try {
    const rankingsJson = localStorage.getItem(keyFor(difficulty));
    if (!rankingsJson) {
      return [];
    }
    // Guard against non-JSON or unexpected shapes
    const parsed = JSON.parse(rankingsJson);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Best-effort validation of item shape
    const sanitized: RankingEntry[] = parsed.filter((item) =>
      item && typeof item.score === 'number' && typeof item.time === 'number' && typeof item.date === 'string'
    );
    return sanitized;
  } catch (error) {
    // Avoid failing tests due to noisy console errors on corrupted localStorage
    console.warn("Failed to parse rankings from localStorage", error);
    return [];
  }
};

export const saveRanking = (newEntry: RankingEntry, difficulty?: Difficulty): RankingEntry[] => {
  const rankings = getRankings(difficulty);
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
    localStorage.setItem(keyFor(difficulty), JSON.stringify(updatedRankings));
  } catch (error) {
    // Log as warning to avoid failing CI due to console.error policies
    console.warn("Failed to save rankings to localStorage", error);
  }

  return updatedRankings;
};
