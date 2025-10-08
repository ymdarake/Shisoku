import React from 'react'
import type { Difficulty } from '../types'

interface Props {
    difficulty: Difficulty
    onSelect: (d: Difficulty) => void
    locale: { [key: string]: any }
}

export const DifficultySelector: React.FC<Props> = ({ difficulty, onSelect, locale }) => {
    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => onSelect('easy')}
                className={`px-3 py-1 rounded-md text-sm font-semibold transition ${difficulty === 'easy' ? 'bg-green-600 text-white' : 'bg-green-100 dark:bg-green-900/30'}`}
            >
                {locale.difficultyEasy}
            </button>
            <button
                onClick={() => onSelect('normal')}
                className={`px-3 py-1 rounded-md text-sm font-semibold transition ${difficulty === 'normal' ? 'bg-blue-600 text-white' : 'bg-blue-100 dark:bg-blue-900/30'}`}
            >
                {locale.difficultyNormal}
            </button>
            <button
                onClick={() => onSelect('hard')}
                className={`px-3 py-1 rounded-md text-sm font-semibold transition ${difficulty === 'hard' ? 'bg-red-600 text-white' : 'bg-red-100 dark:bg-red-900/30'}`}
            >
                {locale.difficultyHard}
            </button>
        </div>
    )
}


