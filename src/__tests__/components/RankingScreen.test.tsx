import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { RankingScreen } from '../../component/RankingScreen'
import { RankingServiceProvider } from '../../context/RankingServiceContext'
import type { RankingRepository } from '../../domain/ranking/RankingRepository'

class StubRankingRepository implements RankingRepository {
    async getRankings(difficulty?: 'easy' | 'normal' | 'hard') {
        if (difficulty === 'easy') return [{ name: 'E', score: 1, time: 10, date: '2025-01-01' }]
        if (difficulty === 'hard') return []
        return [{ name: 'N', score: 5, time: 20, date: '2025-01-01' }]
    }
    async saveRanking(newEntry: any, difficulty?: 'easy' | 'normal' | 'hard') {
        const list = await this.getRankings(difficulty)
        return [...list, newEntry]
    }
}

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
            <RankingServiceProvider repository={new StubRankingRepository()}>
                <RankingScreen
                    rankings={[{ name: 'N0', score: 2, time: 40, date: '2025-01-01' }]}
                    onBackToTop={() => { }}
                    locale={locale as any}
                    difficulty="normal"
                />
            </RankingServiceProvider>
        )

        // initial shows normal label; wait for async list
        expect(screen.getByText('ふつう')).toBeInTheDocument()
        await screen.findByText('N')

        // switch to easy
        await userEvent.click(screen.getByRole('button', { name: /かんたん/i }))
        await screen.findByText('E')

        // switch to hard (empty)
        await userEvent.click(screen.getByRole('button', { name: /むずかしい/i }))
        await screen.findByText(locale.noRankings)
    })

    it('renders empty state when no rankings for a difficulty', async () => {
        render(
            <RankingServiceProvider repository={new StubRankingRepository()}>
                <RankingScreen
                    rankings={[{ name: 'N0', score: 2, time: 40, date: '2025-01-01' }]}
                    onBackToTop={() => { }}
                    locale={locale as any}
                    difficulty="normal"
                />
            </RankingServiceProvider>
        )

        // Switch to hard (empty)
        await userEvent.click(screen.getByRole('button', { name: /むずかしい/i }))
        await screen.findByText(locale.noRankings)
    })

    it('updates heading difficulty label on tab change', async () => {
        render(
            <RankingServiceProvider repository={new StubRankingRepository()}>
                <RankingScreen
                    rankings={[]}
                    onBackToTop={() => { }}
                    locale={locale as any}
                    difficulty="easy"
                />
            </RankingServiceProvider>
        )

        // initial: easy
        expect(screen.getByText(/ランキング \(かんたん\)/)).toBeInTheDocument()

        // change to normal
        await userEvent.click(screen.getByRole('button', { name: /ふつう/i }))
        expect(await screen.findByText(/ランキング \(ふつう\)/)).toBeInTheDocument()
    })
})

