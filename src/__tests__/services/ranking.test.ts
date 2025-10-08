import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getRankings, saveRanking } from '../../services/ranking';
import type { RankingEntry } from '../../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock as Storage;

describe('ranking service', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('getRankings', () => {
    it('should return empty array when no rankings exist', () => {
      const rankings = getRankings();
      expect(rankings).toEqual([]);
    });

    it('should return stored rankings', () => {
      const mockRankings: RankingEntry[] = [
        { score: 10, time: 120, date: '2025-01-01' },
        { score: 8, time: 150, date: '2025-01-02' },
      ];
      localStorage.setItem('mathPuzzleRanking', JSON.stringify(mockRankings));

      const rankings = getRankings();
      expect(rankings).toEqual(mockRankings);
    });

    it('should return empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('mathPuzzleRanking', 'invalid json');

      const rankings = getRankings();
      expect(rankings).toEqual([]);
    });
  });

  describe('saveRanking', () => {
    it('should save a new ranking entry', () => {
      const newEntry: RankingEntry = {
        score: 9,
        time: 100,
        date: '2025-01-01',
      };

      const result = saveRanking(newEntry);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(newEntry);
    });

    it('should sort rankings by score (descending)', () => {
      const entry1: RankingEntry = { score: 5, time: 100, date: '2025-01-01' };
      const entry2: RankingEntry = { score: 10, time: 100, date: '2025-01-02' };
      const entry3: RankingEntry = { score: 7, time: 100, date: '2025-01-03' };

      saveRanking(entry1);
      saveRanking(entry2);
      const result = saveRanking(entry3);

      expect(result[0].score).toBe(10);
      expect(result[1].score).toBe(7);
      expect(result[2].score).toBe(5);
    });

    it('should sort by time (ascending) when scores are equal', () => {
      const entry1: RankingEntry = { score: 8, time: 150, date: '2025-01-01' };
      const entry2: RankingEntry = { score: 8, time: 100, date: '2025-01-02' };
      const entry3: RankingEntry = { score: 8, time: 200, date: '2025-01-03' };

      saveRanking(entry1);
      saveRanking(entry2);
      const result = saveRanking(entry3);

      expect(result[0].time).toBe(100);
      expect(result[1].time).toBe(150);
      expect(result[2].time).toBe(200);
    });

    it('should keep only top 10 entries', () => {
      // Add 12 entries
      for (let i = 0; i < 12; i++) {
        saveRanking({
          score: i,
          time: 100,
          date: `2025-01-${String(i + 1).padStart(2, '0')}`,
        });
      }

      const rankings = getRankings();
      expect(rankings).toHaveLength(10);
      // Should keep the highest scores (11, 10, 9, ...)
      expect(rankings[0].score).toBe(11);
      expect(rankings[9].score).toBe(2);
    });

    it('should persist rankings to localStorage', () => {
      const entry: RankingEntry = { score: 7, time: 120, date: '2025-01-01' };

      saveRanking(entry);

      const stored = localStorage.getItem('mathPuzzleRanking');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toEqual(entry);
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock setItem to throw an error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      const entry: RankingEntry = { score: 5, time: 100, date: '2025-01-01' };

      // Should not throw
      expect(() => saveRanking(entry)).not.toThrow();

      // Restore original setItem
      localStorage.setItem = originalSetItem;
    });
  });

  describe('difficulty-aware rankings', () => {
    it('stores and reads rankings separately per difficulty', () => {
      saveRanking({ score: 3, time: 90, date: '2025-01-01' }, 'easy');
      saveRanking({ score: 5, time: 80, date: '2025-01-01' }, 'normal');
      saveRanking({ score: 7, time: 70, date: '2025-01-01' }, 'hard');

      const easy = getRankings('easy');
      const normal = getRankings('normal');
      const hard = getRankings('hard');

      expect(easy).toHaveLength(1);
      expect(normal).toHaveLength(1);
      expect(hard).toHaveLength(1);

      expect(easy[0].score).toBe(3);
      expect(normal[0].score).toBe(5);
      expect(hard[0].score).toBe(7);
    });
  });
});
