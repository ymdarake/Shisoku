import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { EndScreen } from '../../components/EndScreen'

vi.mock('../../utils/share', async (orig) => {
    const actual = await (orig as any)()
    return {
        ...actual,
        openTwitterShare: vi.fn(),
    }
})

describe('EndScreen - share button i18n and behavior', () => {
    const baseProps = {
        results: [
            { problem: { numbers: [1, 2, 3, 4], target: 6 }, userAnswer: '1+2+3', isCorrect: true, skipped: false },
        ],
        onPlayAgain: vi.fn(),
        onBackToTop: vi.fn(),
        onSaveRanking: vi.fn(),
        totalQuestions: 10,
        totalTime: 123,
    } as const

    it('renders share button label and aria-label from i18n (ja)', () => {
        const locale = {
            finalResults: '最終結果',
            score: 'スコア: {score} / {total}',
            time: 'タイム',
            enterYourName: '名前を入力してスコアを保存',
            saveScore: 'ランキングに登録',
            playAgain: 'もう一度プレイ',
            backToTop: 'トップに戻る',
            question: '問題',
            yourAnswer: 'あなたの回答',
            status: '結果',
            statusSkipped: 'スキップ',
            statusCorrect: '正解',
            statusIncorrect: '不正解',
            shareScore: 'スコアをシェア',
            shareScoreAria: 'スコアをTwitter/Xでシェア',
        }

        render(<EndScreen {...baseProps} results={baseProps.results} locale={locale as any} />)

        const button = screen.getByRole('button', { name: locale.shareScoreAria })
        expect(button).toBeInTheDocument()
        expect(screen.getByText(locale.shareScore)).toBeInTheDocument()
    })

    it('clicking share button calls openTwitterShare with score/time/total', async () => {
        const { openTwitterShare } = await import('../../utils/share')
        const locale = {
            finalResults: 'Final Results',
            score: 'Score: {score} / {total}',
            time: 'Time',
            enterYourName: 'Enter',
            saveScore: 'Save',
            playAgain: 'Play Again',
            backToTop: 'Back to Top',
            question: 'Question',
            yourAnswer: 'Your Answer',
            status: 'Status',
            statusSkipped: 'Skipped',
            statusCorrect: 'Correct',
            statusIncorrect: 'Incorrect',
            shareScore: 'Share Score',
            shareScoreAria: 'Share score on Twitter/X',
        }

        render(<EndScreen {...baseProps} results={baseProps.results} locale={locale as any} />)

        const button = screen.getByRole('button', { name: locale.shareScoreAria })
        await userEvent.click(button)

        expect(openTwitterShare).toHaveBeenCalledWith({
            score: 1,
            time: baseProps.totalTime,
            totalQuestions: baseProps.totalQuestions,
        })
    })
})
