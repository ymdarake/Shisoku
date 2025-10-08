import type { UserPreferences } from './types';

export interface PreferencesRepository {
    load(): Promise<UserPreferences | null>;
    save(prefs: UserPreferences): Promise<void>;
}


