import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { UserPreferences } from '../../domain/preferences/type'
import type { PreferencesRepository } from '../../domain/preferences/PreferencesRepository'
import { LocalStoragePreferencesRepository } from '../../repository/localStorage/LocalStoragePreferencesRepository'

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

describe('preferences repository (via DI)', () => {
    let repo: PreferencesRepository
    beforeEach(() => {
        localStorageMock.clear()
        vi.clearAllMocks()
        repo = new LocalStoragePreferencesRepository()
    })

    it('should return null when no preferences are stored', async () => {
        const loaded = await repo.load()
        expect(loaded).toBeNull()
    })

    it('should save and load preferences round-trip', async () => {
        const prefs: UserPreferences = {
            isSoundOn: true,
            language: 'en',
            difficulty: 'hard',
        }
        await repo.save(prefs)
        const loaded = await repo.load()
        expect(loaded).toEqual(prefs)
    })

    it('should handle invalid JSON gracefully and return null', async () => {
        localStorage.setItem('mathPuzzlePreferences:v1', 'not json')
        const loaded = await repo.load()
        expect(loaded).toBeNull()
    })

    it('should migrate old format (isBgmOn, isSfxOn) to new format (isSoundOn)', async () => {
        // 旧形式のデータを直接localStorageに保存
        const oldPrefs = {
            isBgmOn: true,
            isSfxOn: true,
            language: 'ja',
            difficulty: 'normal',
        }
        localStorage.setItem('mathPuzzlePreferences:v1', JSON.stringify(oldPrefs))

        // ロード時に新形式に変換されることを確認
        const loaded = await repo.load()
        expect(loaded).toEqual({
            isSoundOn: true,
            language: 'ja',
            difficulty: 'normal',
        })
    })

    it('should migrate old format with mixed sound settings to false', async () => {
        // BGMはON、SFXはOFFの場合
        const oldPrefs = {
            isBgmOn: true,
            isSfxOn: false,
            language: 'en',
            difficulty: 'easy',
        }
        localStorage.setItem('mathPuzzlePreferences:v1', JSON.stringify(oldPrefs))

        // どちらか一方がfalseの場合、isSoundOnはfalseになる
        const loaded = await repo.load()
        expect(loaded).toEqual({
            isSoundOn: false,
            language: 'en',
            difficulty: 'easy',
        })
    })
})


