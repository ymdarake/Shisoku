import type { Difficulty, DifficultyConfig } from '../types';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
    easy: {
        numberRange: [0, 5],
        targetRange: [0, 5],
        label: 'Easy',
    },
    normal: {
        numberRange: [0, 9],
        targetRange: [0, 9],
        label: 'Normal',
    },
    hard: {
        numberRange: [0, 9],
        targetRange: [0, 20],
        label: 'Hard',
    },
};

export const clampToRange = (min: number, max: number, value: number): number => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
};

