import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { RankingRepositoryProvider } from '../../context/RankingRepositoryContext'
import type { RankingRepository } from '../../domain/ranking/RankingRepository'
import { useRanking } from '../../hook/useRanking'

class StubRepo implements RankingRepository {
    async getRankings(difficulty?: 'easy' | 'normal' | 'hard') {
        if (difficulty === 'easy') return [{ name: 'E', score: 1, time: 10, date: '2025-01-01' }]
        return []
    }
    async saveRanking(newEntry: any, difficulty?: 'easy' | 'normal' | 'hard') {
        return [newEntry]
    }
}

describe('hook/useRanking', () => {
    it('fetches and caches ranking per difficulty', async () => {
        const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
            <RankingRepositoryProvider repository={new StubRepo()}>{children}</RankingRepositoryProvider>
        )

        const { result, rerender } = renderHook(({ diff }: { diff: 'easy' | 'normal' | 'hard' }) => useRanking(diff), {
            wrapper,
            initialProps: { diff: 'easy' as const },
        })

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.list?.[0]?.name).toBe('E')

        // switch to hard (empty)
        rerender({ diff: 'hard' as const })
        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.list).toEqual([])
    })
})


