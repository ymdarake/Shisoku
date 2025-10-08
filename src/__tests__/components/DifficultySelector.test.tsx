import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { DifficultySelector } from '../../components/DifficultySelector'

describe('DifficultySelector', () => {
    const locale = {
        difficultyEasy: 'かんたん',
        difficultyNormal: 'ふつう',
        difficultyHard: 'むずかしい',
    } as const

    it('renders three difficulty buttons', () => {
        render(<DifficultySelector difficulty="normal" onSelect={vi.fn()} locale={locale as any} />)
        expect(screen.getByRole('button', { name: /かんたん/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /ふつう/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /むずかしい/i })).toBeInTheDocument()
    })

    it('calls onSelect when a difficulty is clicked', async () => {
        const onSelect = vi.fn()
        render(<DifficultySelector difficulty="normal" onSelect={onSelect} locale={locale as any} />)
        await userEvent.click(screen.getByRole('button', { name: /むずかしい/i }))
        expect(onSelect).toHaveBeenCalledWith('hard')
    })

    it('highlights the selected difficulty', () => {
        render(<DifficultySelector difficulty="easy" onSelect={vi.fn()} locale={locale as any} />)
        const easyBtn = screen.getByRole('button', { name: /かんたん/i })
        expect(easyBtn.className).toMatch(/bg-green-600|bg-green-500/)
    })
})

