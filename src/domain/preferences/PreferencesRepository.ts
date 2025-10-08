import type { UserPreferences } from './type';

export interface PreferencesRepository {
    load(): Promise<UserPreferences | null>;
    save(prefs: UserPreferences): Promise<void>;
}


