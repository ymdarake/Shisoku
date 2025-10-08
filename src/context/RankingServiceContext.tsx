import React, { createContext, useContext } from 'react';
import { RankingService } from '../service/RankingService';
import type { RankingRepository } from '../domain/ranking/RankingRepository';

const RankingServiceContext = createContext<RankingService | null>(null);

interface RankingServiceProviderProps {
    repository: RankingRepository;
    children: React.ReactNode;
}

export const RankingServiceProvider: React.FC<RankingServiceProviderProps> = ({ repository, children }) => {
    const service = new RankingService(repository);
    return (
        <RankingServiceContext.Provider value={service}>{children}</RankingServiceContext.Provider>
    );
};

export const useRankingService = (): RankingService => {
    const svc = useContext(RankingServiceContext);
    if (!svc) throw new Error('RankingServiceContext not provided');
    return svc;
};


