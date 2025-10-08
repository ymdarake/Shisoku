import type { RankingRepository } from '../../domain/ranking/RankingRepository';
import type { Difficulty } from '../../types';
import type { RankingEntry } from '../../domain/ranking/type';

const RANKING_KEY = 'mathPuzzleRanking';
const keyFor = (difficulty?: Difficulty) => (difficulty ? `${RANKING_KEY}:${difficulty}` : RANKING_KEY);
const MAX_RANKING_ENTRIES = 10;

export class LocalStorageRankingRepository implements RankingRepository {
    async getRankings(difficulty?: Difficulty): Promise<RankingEntry[]> {
        try {
            const rankingsJson = localStorage.getItem(keyFor(difficulty));
            if (!rankingsJson) return [];
            const parsed = JSON.parse(rankingsJson);
            if (!Array.isArray(parsed)) return [];
            const sanitized: RankingEntry[] = parsed.filter((item: any) =>
                item && typeof item.score === 'number' && typeof item.time === 'number' && typeof item.date === 'string'
            );
            return sanitized;
        } catch (error) {
            console.warn('Failed to parse rankings from localStorage', error);
            return [];
        }
    }

    async saveRanking(newEntry: RankingEntry, difficulty?: Difficulty): Promise<RankingEntry[]> {
        const rankings = await this.getRankings(difficulty);
        rankings.push(newEntry);
        rankings.sort((a, b) => (a.score !== b.score ? b.score - a.score : a.time - b.time));
        const updated = rankings.slice(0, MAX_RANKING_ENTRIES);
        try {
            localStorage.setItem(keyFor(difficulty), JSON.stringify(updated));
        } catch (error) {
            console.warn('Failed to save rankings to localStorage', error);
        }
        return updated;
    }
}


