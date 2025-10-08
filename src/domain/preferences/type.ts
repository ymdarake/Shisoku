import type { Difficulty, Language } from '../../types';

export interface UserPreferences {
    isBgmOn: boolean;
    isSfxOn: boolean;
    language: Language;
    difficulty: Difficulty;
}


