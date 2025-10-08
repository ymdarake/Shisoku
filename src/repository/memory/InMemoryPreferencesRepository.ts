import type { PreferencesRepository } from '../../domain/preferences/PreferencesRepository';
import type { UserPreferences } from '../../domain/preferences/type';

export class InMemoryPreferencesRepository implements PreferencesRepository {
    private prefs: UserPreferences | null = null;

    async load(): Promise<UserPreferences | null> {
        return this.prefs ? { ...this.prefs } : null;
    }

    async save(prefs: UserPreferences): Promise<void> {
        this.prefs = { ...prefs };
    }
}


