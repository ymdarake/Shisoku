import type { PreferencesRepository } from '../domain/preferences/PreferencesRepository';
import type { UserPreferences } from '../domain/preferences/type';

export class PreferencesService {
    private readonly repository: PreferencesRepository;

    constructor(repository: PreferencesRepository) {
        this.repository = repository;
    }

    load(): Promise<UserPreferences | null> {
        return this.repository.load();
    }

    save(prefs: UserPreferences): Promise<void> {
        return this.repository.save(prefs);
    }
}


