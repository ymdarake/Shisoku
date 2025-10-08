import type { PreferencesRepository } from '../domain/preferences/PreferencesRepository';
import { LocalStoragePreferencesRepository } from '../repositories/localStorage/LocalStoragePreferencesRepository';
import type { UserPreferences } from '../types';

let preferencesRepository: PreferencesRepository = new LocalStoragePreferencesRepository();

export const setPreferencesRepository = (repo: PreferencesRepository) => {
    preferencesRepository = repo;
};

export const repoLoadPreferences = (): Promise<UserPreferences | null> => {
    return preferencesRepository.load();
};

export const repoSavePreferences = (prefs: UserPreferences): Promise<void> => {
    return preferencesRepository.save(prefs);
};


