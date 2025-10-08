import type { RankingRepository } from '../domain/ranking/RankingRepository';
import type { RankingEntry } from '../domain/ranking/type';
import type { Difficulty } from '../types';

export class RankingService {
    private readonly repository: RankingRepository;

    constructor(repository: RankingRepository) {
        this.repository = repository;
    }

    getRankings(difficulty?: Difficulty): Promise<RankingEntry[]> {
        return this.repository.getRankings(difficulty);
    }

    saveRanking(entry: RankingEntry, difficulty?: Difficulty): Promise<RankingEntry[]> {
        return this.repository.saveRanking(entry, difficulty);
    }
}


