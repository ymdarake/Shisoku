import { describe, it, vi, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { RankingScreen } from '../../components/RankingScreen'

// Mock repoGetRankings to control data per difficulty
vi.mock('../../services/ranking', () => ({
    repoGetRankings: async (difficulty?: 'easy' | 'normal' | 'hard') => {
        if (difficulty === 'easy') return Promise.resolve([{ name: 'E', score: 1, time: 10, date: '2025-01-01' }])
        if (difficulty === 'hard') return Promise.resolve([{ name: 'H', score: 9, time: 30, date: '2025-01-01' }])
        return Promise.resolve([{ name: 'N', score: 5, time: 20, date: '2025-01-01' }])
    },
}))

describe('RankingScreen - difficulty tabs', () => {
    const locale = {
        ranking: 'ランキング',
        rank: '順位',
        name: '名前',
        time: 'タイム',
        date: '日付',
        score: 'スコア: {score} / {total}',
        noRankings: 'まだランキングがありません。一番乗りを目指そう！',
        backToMenu: 'メニューに戻る',
        difficultyEasy: 'かんたん',
        difficultyNormal: 'ふつう',
        difficultyHard: 'むずかしい',
    }

    beforeEach(() => {
        // nothing
    })

    it('shows initial difficulty list and switches on tab click', async () => {
        render(
            <RankingScreen
                rankings={[{ name: 'N0', score: 2, time: 40, date: '2025-01-01' }]}
                onBackToTop={() => { }}
                locale={locale as any}
                difficulty="normal"
            />
        )

        // initial shows normal label; wait for async list
        expect(screen.getByText('ふつう')).toBeInTheDocument()
        await screen.findByText('N')

        // switch to easy
        await userEvent.click(screen.getByRole('button', { name: /かんたん/i }))
        await screen.findByText('E')

        // switch to hard
        await userEvent.click(screen.getByRole('button', { name: /むずかしい/i }))
        await screen.findByText('H')
    })

    it('renders empty state when no rankings for a difficulty', async () => {
        // Override mock for this test case: return empty for hard
        const mod = await import('../../services/ranking')
        // @ts-expect-error test override
        mod.repoGetRankings = async (difficulty?: 'easy' | 'normal' | 'hard') => {
            if (difficulty === 'hard') return Promise.resolve([])
            return Promise.resolve([{ name: 'N', score: 5, time: 20, date: '2025-01-01' }])
        }

        render(
            <RankingScreen
                rankings={[{ name: 'N0', score: 2, time: 40, date: '2025-01-01' }]}
                onBackToTop={() => { }}
                locale={locale as any}
                difficulty="normal"
            />
        )

        // Switch to hard (empty)
        await userEvent.click(screen.getByRole('button', { name: /むずかしい/i }))
        await screen.findByText(locale.noRankings)
    })

    it('updates heading difficulty label on tab change', async () => {
        render(
            <RankingScreen
                rankings={[]}
                onBackToTop={() => { }}
                locale={locale as any}
                difficulty="easy"
            />
        )

        // initial: easy
        expect(screen.getByText(/ランキング \(かんたん\)/)).toBeInTheDocument()

        // change to normal
        await userEvent.click(screen.getByRole('button', { name: /ふつう/i }))
        expect(await screen.findByText(/ランキング \(ふつう\)/)).toBeInTheDocument()
    })
})

