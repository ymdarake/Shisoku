import type { Difficulty } from '../types';
import type { RankingEntry } from '../domain/ranking/type';
import type { RankingRepository } from '../domain/ranking/RankingRepository';
import { LocalStorageRankingRepository } from '../repository/localStorage/LocalStorageRankingRepository';

/**
 * Repository パターン: ランキングデータへの抽象化されたアクセス
 * - 既定は LocalStorage 実装
 * - DB 等へ移行する場合は setRankingRepository() で差し替え可能
 */
let rankingRepository: RankingRepository = new LocalStorageRankingRepository();

export const setRankingRepository = (repo: RankingRepository) => {
  rankingRepository = repo;
};

export const repoGetRankings = (difficulty?: Difficulty): Promise<RankingEntry[]> => {
  return rankingRepository.getRankings(difficulty);
};

export const repoSaveRanking = (newEntry: RankingEntry, difficulty?: Difficulty): Promise<RankingEntry[]> => {
  return rankingRepository.saveRanking(newEntry, difficulty);
};
