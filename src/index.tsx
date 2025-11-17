
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { RankingRepositoryProvider } from './context/RankingRepositoryContext';
import { PreferencesRepositoryProvider } from './context/PreferencesRepositoryContext';
import { LocalStorageRankingRepository } from './repository/localStorage/LocalStorageRankingRepository';
import { LocalStoragePreferencesRepository } from './repository/localStorage/LocalStoragePreferencesRepository';
import { FirebaseRankingRepository } from './repository/firebase/FirebaseRankingRepository';
import { initializeFirebase } from './config/firebase';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Firebaseを初期化（環境変数が設定されていない場合はnull）
const firebaseDb = initializeFirebase();

// Firebase優先、未設定の場合はlocalStorageをフォールバックとして使用
const rankingRepository = firebaseDb
  ? new FirebaseRankingRepository(firebaseDb)
  : new LocalStorageRankingRepository();

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <RankingRepositoryProvider repository={rankingRepository}>
      <PreferencesRepositoryProvider repository={new LocalStoragePreferencesRepository()}>
        <App />
      </PreferencesRepositoryProvider>
    </RankingRepositoryProvider>
  </React.StrictMode>
);
