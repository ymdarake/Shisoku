import { describe, it, expect } from 'vitest'
import type { PreferencesRepository } from '../../domain/preferences/PreferencesRepository'
import { InMemoryPreferencesRepository } from '../../repository/memory/InMemoryPreferencesRepository'

const runPreferencesContract = (factory: () => PreferencesRepository) => {
    describe('PreferencesRepository contract', () => {
        it('saves and loads round-trip', async () => {
            const repo = factory()
            const prefs = { isBgmOn: true, isSfxOn: false, language: 'ja', difficulty: 'normal' as const }
            await repo.save(prefs)
            const loaded = await repo.load()
            expect(loaded).toEqual(prefs)
        })

        it('returns null when no data', async () => {
            const repo = factory()
            const loaded = await repo.load()
            expect(loaded).toBeNull()
        })
    })
}

// Run the contract against InMemory implementation
runPreferencesContract(() => new InMemoryPreferencesRepository())


