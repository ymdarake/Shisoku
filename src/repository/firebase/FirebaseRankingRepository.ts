import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Firestore,
  Timestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import type { RankingRepository } from '../../domain/ranking/RankingRepository';
import type { RankingEntry } from '../../domain/ranking/type';
import type { Difficulty } from '../../types';

const COLLECTION_NAME = 'rankings';

export class FirebaseRankingRepository implements RankingRepository {
  private db: Firestore | null;

  constructor(db: Firestore | null) {
    this.db = db;
  }

  /**
   * グローバルランキングを取得
   */
  async getRankings(difficulty: Difficulty = 'normal'): Promise<RankingEntry[]> {
    if (!this.db) {
      console.warn('Firebase not initialized');
      return [];
    }

    try {
      const q = query(
        collection(this.db, COLLECTION_NAME),
        where('difficulty', '==', difficulty),
        orderBy('score', 'desc'),
        orderBy('time', 'asc'),
        limit(10)
      );

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          name: data.name,
          score: data.score,
          time: data.time,
          date: data.date || (data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString())
        } as RankingEntry;
      });
    } catch (error) {
      console.error('Failed to fetch global rankings:', error);
      return [];
    }
  }

  /**
   * グローバルランキングに保存
   */
  async saveRanking(newEntry: RankingEntry, difficulty: Difficulty = 'normal'): Promise<RankingEntry[]> {
    if (!this.db) {
      console.warn('Firebase not initialized');
      return [];
    }

    try {
      await addDoc(collection(this.db, COLLECTION_NAME), {
        name: newEntry.name.substring(0, 20), // 名前を20文字に制限
        score: newEntry.score,
        time: newEntry.time,
        difficulty,
        date: newEntry.date,
        createdAt: Timestamp.now()
      });

      // 保存後、最新のランキングを取得して返す
      return this.getRankings(difficulty);
    } catch (error) {
      console.error('Failed to save to global ranking:', error);
      return [];
    }
  }

  /**
   * リアルタイムでランキングを購読
   * @param difficulty 難易度
   * @param callback ランキング更新時のコールバック
   * @returns 購読解除関数
   */
  subscribeToRankings(
    difficulty: Difficulty,
    callback: (rankings: RankingEntry[]) => void
  ): Unsubscribe | null {
    if (!this.db) {
      console.warn('Firebase not initialized');
      return null;
    }

    try {
      const q = query(
        collection(this.db, COLLECTION_NAME),
        where('difficulty', '==', difficulty),
        orderBy('score', 'desc'),
        orderBy('time', 'asc'),
        limit(10)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const rankings = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            name: data.name,
            score: data.score,
            time: data.time,
            date: data.date || (data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString())
          } as RankingEntry;
        });
        callback(rankings);
      }, (error) => {
        console.error('Realtime subscription error:', error);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Failed to subscribe to rankings:', error);
      return null;
    }
  }
}
