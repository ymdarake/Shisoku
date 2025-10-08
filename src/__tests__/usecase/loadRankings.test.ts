import { describe, it, expect } from 'vitest'
import { InMemoryRankingRepository } from '../../repository/memory/InMemoryRankingRepository'
import { loadRankings } from '../../usecase/loadRankings'

describe('usecase/loadRankings', () => {
    it('loads rankings for given difficulty', async () => {
        const repo = new InMemoryRankingRepository()
        await repo.saveRanking({ name: 'A', score: 1, time: 10, date: '2025-01-01' }, 'easy')
        await repo.saveRanking({ name: 'B', score: 2, time: 10, date: '2025-01-01' }, 'hard')
        const easy = await loadRankings(repo, 'easy')
        expect(easy).toHaveLength(1)
        expect(easy[0].name).toBe('A')
    })
})


