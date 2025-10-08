import type { Difficulty } from '../../types';
import type { RankingEntry } from './type';

export interface RankingRepository {
    getRankings(difficulty?: Difficulty): Promise<RankingEntry[]>;
    saveRanking(newEntry: RankingEntry, difficulty?: Difficulty): Promise<RankingEntry[]>;
}


