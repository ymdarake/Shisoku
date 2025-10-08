import type { RankingRepository } from '../domain/ranking/RankingRepository';
import type { Difficulty } from '../types';

export function loadRankings(repo: RankingRepository, difficulty?: Difficulty) {
    return repo.getRankings(difficulty);
}


