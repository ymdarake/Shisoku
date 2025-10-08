import type { RankingRepository } from '../domain/ranking/RankingRepository';
import type { RankingEntry } from '../domain/ranking/type';
import type { Difficulty } from '../types';

export interface Clock {
    nowISO(): string;
}

const systemClock: Clock = { nowISO: () => new Date().toISOString() };

export async function saveScore(
    repo: RankingRepository,
    entry: Omit<RankingEntry, 'date'> | RankingEntry,
    difficulty?: Difficulty,
    clock: Clock = systemClock
) {
    const withDate: RankingEntry = {
        ...entry,
        date: (entry as RankingEntry).date ?? clock.nowISO(),
    } as RankingEntry;
    return repo.saveRanking(withDate, difficulty);
}


