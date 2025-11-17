import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase設定
// IMPORTANT: 本番環境では環境変数を使用してください
// 現在はプレースホルダーです。Firebaseコンソールから取得した値に置き換えてください
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID'
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

/**
 * Firebaseアプリを初期化
 * 環境変数が設定されていない場合はnullを返す
 */
export const initializeFirebase = (): Firestore | null => {
  // 既に初期化済みの場合は既存のインスタンスを返す
  if (db) return db;

  // 環境変数が設定されていない場合はnullを返す（Firebase機能を無効化）
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    console.warn('Firebase環境変数が設定されていません。グローバルランキング機能は無効です。');
    return null;
  }

  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
    return db;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return null;
  }
};

/**
 * Firestoreインスタンスを取得
 */
export const getDb = (): Firestore | null => {
  if (!db) {
    return initializeFirebase();
  }
  return db;
};
