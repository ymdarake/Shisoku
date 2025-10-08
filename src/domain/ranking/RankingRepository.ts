import type { RankingEntry, Difficulty } from '../../types';

export interface RankingRepository {
    getRankings(difficulty?: Difficulty): Promise<RankingEntry[]>;
    saveRanking(newEntry: RankingEntry, difficulty?: Difficulty): Promise<RankingEntry[]>;
}


