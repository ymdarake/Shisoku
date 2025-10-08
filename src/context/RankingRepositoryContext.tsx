import React, { createContext, useContext } from 'react';
import type { RankingRepository } from '../domain/ranking/RankingRepository';

const RankingRepositoryContext = createContext<RankingRepository | null>(null);

interface RankingRepositoryProviderProps {
    repository: RankingRepository;
    children: React.ReactNode;
}

export const RankingRepositoryProvider: React.FC<RankingRepositoryProviderProps> = ({ repository, children }) => {
    return (
        <RankingRepositoryContext.Provider value={repository}>{children}</RankingRepositoryContext.Provider>
    );
};

export const useRankingRepository = (): RankingRepository => {
    const repo = useContext(RankingRepositoryContext);
    if (!repo) throw new Error('RankingRepositoryContext not provided');
    return repo;
};


