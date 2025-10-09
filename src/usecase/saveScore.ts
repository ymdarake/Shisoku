import type { RankingRepository } from '../domain/ranking/RankingRepository';
import type { RankingEntry } from '../domain/ranking/type';
import type { Difficulty } from '../types';

export interface Clock {
    nowISO(): string;
}

const systemClock: Clock = { nowISO: () => new Date().toISOString() };

export class SaveScoreUseCase {
    private readonly clock: Clock

    constructor(clock: Clock = systemClock) {
        this.clock = clock
    }

    async execute(
        repo: RankingRepository,
        entry: Omit<RankingEntry, 'date'> | RankingEntry,
        difficulty?: Difficulty,
    ) {
        const withDate: RankingEntry = {
            ...entry,
            date: (entry as RankingEntry).date ?? this.clock.nowISO(),
        } as RankingEntry
        return repo.saveRanking(withDate, difficulty)
    }
}


