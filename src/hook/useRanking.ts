import { useEffect, useMemo, useRef, useState } from 'react'
import type { Difficulty } from '../types'
import type { RankingEntry } from '../domain/ranking/type'
import { useRankingRepository } from '../context/RankingRepositoryContext'
import { LoadRankingsUseCase } from '../usecase/loadRankings'

export function useRanking(difficulty: Difficulty) {
    const repo = useRankingRepository()
    const cacheRef = useRef<Map<string, RankingEntry[]>>(new Map())
    const [list, setList] = useState<RankingEntry[] | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let active = true
        const key = difficulty
        const cached = cacheRef.current.get(key)
        if (cached) {
            setList(cached)
            return
        }
        setLoading(true)
        const uc = new LoadRankingsUseCase()
        uc.execute(repo, difficulty).then(res => {
            if (!active) return
            cacheRef.current.set(key, res)
            setList(res)
            setLoading(false)
        })
        return () => { active = false }
    }, [repo, difficulty])

    return useMemo(() => ({ list, loading }), [list, loading])
}


