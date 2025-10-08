import { describe, it, expect, beforeEach, vi } from 'vitest'
import { repoLoadPreferences, repoSavePreferences } from '../../services/preferences'
import type { UserPreferences } from '../../types'

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value
        },
        removeItem: (key: string) => {
            delete store[key]
        },
        clear: () => {
            store = {}
        },
    }
})()

// @ts-expect-error assign to global
global.localStorage = localStorageMock as Storage

describe('preferences repository (localStorage)', () => {
    beforeEach(() => {
        localStorageMock.clear()
        vi.clearAllMocks()
    })

    it('should return null when no preferences are stored', async () => {
        const loaded = await repoLoadPreferences()
        expect(loaded).toBeNull()
    })

    it('should save and load preferences round-trip', async () => {
        const prefs: UserPreferences = {
            isBgmOn: false,
            isSfxOn: true,
            language: 'en',
            difficulty: 'hard',
        }
        await repoSavePreferences(prefs)
        const loaded = await repoLoadPreferences()
        expect(loaded).toEqual(prefs)
    })

    it('should handle invalid JSON gracefully and return null', async () => {
        localStorage.setItem('mathPuzzlePreferences:v1', 'not json')
        const loaded = await repoLoadPreferences()
        expect(loaded).toBeNull()
    })
})


