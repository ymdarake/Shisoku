import type { RankingRepository } from '../domain/ranking/RankingRepository';
import type { Difficulty } from '../types';

export class LoadRankingsUseCase {
    execute(repo: RankingRepository, difficulty?: Difficulty) {
        return repo.getRankings(difficulty)
    }
}


