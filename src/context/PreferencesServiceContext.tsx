import React, { createContext, useContext } from 'react';
import { PreferencesService } from '../service/PreferencesService';
import type { PreferencesRepository } from '../domain/preferences/PreferencesRepository';

const PreferencesServiceContext = createContext<PreferencesService | null>(null);

interface PreferencesServiceProviderProps {
    repository: PreferencesRepository;
    children: React.ReactNode;
}

export const PreferencesServiceProvider: React.FC<PreferencesServiceProviderProps> = ({ repository, children }) => {
    const service = new PreferencesService(repository);
    return (
        <PreferencesServiceContext.Provider value={service}>{children}</PreferencesServiceContext.Provider>
    );
};

export const usePreferencesService = (): PreferencesService => {
    const svc = useContext(PreferencesServiceContext);
    if (!svc) throw new Error('PreferencesServiceContext not provided');
    return svc;
};


