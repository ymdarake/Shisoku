import { describe, it, expect } from 'vitest'
import type { RankingRepository } from '../../domain/ranking/RankingRepository'
import { InMemoryRankingRepository } from '../../repository/memory/InMemoryRankingRepository'

const runRankingContract = (factory: () => RankingRepository) => {
    describe('RankingRepository contract', () => {
        it('saves and lists by difficulty with sort and limit', async () => {
            const repo = factory()
            await repo.saveRanking({ name: 'A', score: 5, time: 120, date: '2025-01-01' }, 'normal')
            await repo.saveRanking({ name: 'B', score: 7, time: 100, date: '2025-01-02' }, 'normal')
            await repo.saveRanking({ name: 'C', score: 7, time: 150, date: '2025-01-03' }, 'normal')

            const list = await repo.getRankings('normal')
            expect(list[0].score).toBe(7)
            expect(list[0].time).toBe(100)
            expect(list[1].score).toBe(7)
            expect(list[1].time).toBe(150)
            expect(list[2].score).toBe(5)
        })

        it('separates data per difficulty', async () => {
            const repo = factory()
            await repo.saveRanking({ name: 'E', score: 1, time: 10, date: '2025-01-01' }, 'easy')
            await repo.saveRanking({ name: 'H', score: 9, time: 50, date: '2025-01-01' }, 'hard')
            const easy = await repo.getRankings('easy')
            const hard = await repo.getRankings('hard')
            expect(easy).toHaveLength(1)
            expect(hard).toHaveLength(1)
        })
    })
}

// Run the contract against InMemory implementation
runRankingContract(() => new InMemoryRankingRepository())


