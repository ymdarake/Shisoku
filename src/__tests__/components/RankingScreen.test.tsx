import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { RankingScreen } from '../../components/RankingScreen'

// Mock repoGetRankings to control data per difficulty
vi.mock('../../services/ranking', () => ({
    repoGetRankings: (difficulty?: 'easy' | 'normal' | 'hard') => {
        if (difficulty === 'easy') return [{ name: 'E', score: 1, time: 10, date: '2025-01-01' }]
        if (difficulty === 'hard') return [{ name: 'H', score: 9, time: 30, date: '2025-01-01' }]
        return [{ name: 'N', score: 5, time: 20, date: '2025-01-01' }]
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

        // initial shows normal data
        expect(screen.getByText('ふつう')).toBeInTheDocument()
        expect(screen.getByText('N')).toBeInTheDocument()

        // switch to easy
        await userEvent.click(screen.getByRole('button', { name: /かんたん/i }))
        expect(screen.getByText('E')).toBeInTheDocument()

        // switch to hard
        await userEvent.click(screen.getByRole('button', { name: /むずかしい/i }))
        expect(screen.getByText('H')).toBeInTheDocument()
    })
})

