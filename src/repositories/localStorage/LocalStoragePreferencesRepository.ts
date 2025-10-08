import type { PreferencesRepository } from '../../domain/preferences/PreferencesRepository';
import type { UserPreferences } from '../../domain/preferences/types';

const KEY = 'mathPuzzlePreferences:v1';

export class LocalStoragePreferencesRepository implements PreferencesRepository {
    async load(): Promise<UserPreferences | null> {
        try {
            const raw = localStorage.getItem(KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') return null;
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


