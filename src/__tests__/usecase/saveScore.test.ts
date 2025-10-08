import { describe, it, expect } from 'vitest'
import { InMemoryRankingRepository } from '../../repository/memory/InMemoryRankingRepository'
import { saveScore } from '../../usecase/saveScore'

describe('usecase/saveScore', () => {
    it('adds ISO date when missing and saves via repository', async () => {
        const repo = new InMemoryRankingRepository()
        const fixedISO = '2025-01-01T00:00:00.000Z'
        const result = await saveScore(
            repo,
            { name: 'X', score: 2, time: 10 } as any,
            'normal',
            { nowISO: () => fixedISO }
        )
        expect(result[0].date).toBe(fixedISO)
    })
})


