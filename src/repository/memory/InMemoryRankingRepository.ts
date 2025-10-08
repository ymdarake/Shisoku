import type { RankingRepository } from '../../domain/ranking/RankingRepository';
import type { RankingEntry } from '../../domain/ranking/type';
import type { Difficulty } from '../../types';

export class InMemoryRankingRepository implements RankingRepository {
    private store: Record<string, RankingEntry[]> = {};

    async getRankings(difficulty?: Difficulty): Promise<RankingEntry[]> {
        const key = difficulty ?? 'normal';
        return [...(this.store[key] ?? [])];
    }

    async saveRanking(newEntry: RankingEntry, difficulty?: Difficulty): Promise<RankingEntry[]> {
        const key = difficulty ?? 'normal';
        const list = this.store[key] ? [...this.store[key]] : [];
        list.push(newEntry);
        list.sort((a, b) => (a.score !== b.score ? b.score - a.score : a.time - b.time));
        this.store[key] = list.slice(0, 10);
        return [...this.store[key]];
    }
}


