import type { PreferencesRepository } from '../../domain/preferences/PreferencesRepository';
import type { UserPreferences } from '../../domain/preferences/type';

const KEY = 'mathPuzzlePreferences:v1';

export class LocalStoragePreferencesRepository implements PreferencesRepository {
    async load(): Promise<UserPreferences | null> {
        try {
            const raw = localStorage.getItem(KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') return null;

            // マイグレーション: 旧形式（isBgmOn, isSfxOn）から新形式（isSoundOn）へ変換
            if ('isBgmOn' in parsed || 'isSfxOn' in parsed) {
                const isBgmOn = parsed.isBgmOn ?? true;
                const isSfxOn = parsed.isSfxOn ?? true;
                parsed.isSoundOn = isBgmOn && isSfxOn;
                delete parsed.isBgmOn;
                delete parsed.isSfxOn;
            }

            return parsed as UserPreferences;
        } catch {
            return null;
        }
    }

    async save(prefs: UserPreferences): Promise<void> {
        try {
            localStorage.setItem(KEY, JSON.stringify(prefs));
        } catch {
            // ignore
        }
    }
}


