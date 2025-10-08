import React, { createContext, useContext } from 'react';
import type { PreferencesRepository } from '../domain/preferences/PreferencesRepository';

const PreferencesRepositoryContext = createContext<PreferencesRepository | null>(null);

interface PreferencesRepositoryProviderProps {
    repository: PreferencesRepository;
    children: React.ReactNode;
}

export const PreferencesRepositoryProvider: React.FC<PreferencesRepositoryProviderProps> = ({ repository, children }) => {
    return (
        <PreferencesRepositoryContext.Provider value={repository}>{children}</PreferencesRepositoryContext.Provider>
    );
};

export const usePreferencesRepository = (): PreferencesRepository => {
    const repo = useContext(PreferencesRepositoryContext);
    if (!repo) throw new Error('PreferencesRepositoryContext not provided');
    return repo;
};


