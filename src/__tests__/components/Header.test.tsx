import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Header } from '../../component/Header'

describe('Header - title click behavior', () => {
    const baseProps = {
        title: '数式パズルゲーム',
        language: 'ja' as const,
        onLanguageChange: vi.fn(),
        languageLabel: '言語',
        isBgmOn: true,
        isSfxOn: true,
        onToggleBgm: vi.fn(),
        onToggleSfx: vi.fn(),
        onTitleClick: vi.fn(),
        locale: {
            bgmOn: 'BGM ON',
            bgmOff: 'BGM OFF',
            sfxOn: '効果音 ON',
            sfxOff: '効果音 OFF',
        },
    }

    it('calls onTitleClick when title is clicked', async () => {
        render(<Header {...baseProps} />)

        const titleButton = screen.getByRole('button', { name: baseProps.title })
        await userEvent.click(titleButton)

        expect(baseProps.onTitleClick).toHaveBeenCalled()
    })
})
