
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { RankingRepositoryProvider } from './context/RankingRepositoryContext';
import { PreferencesRepositoryProvider } from './context/PreferencesRepositoryContext';
import { LocalStorageRankingRepository } from './repository/localStorage/LocalStorageRankingRepository';
import { LocalStoragePreferencesRepository } from './repository/localStorage/LocalStoragePreferencesRepository';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <RankingRepositoryProvider repository={new LocalStorageRankingRepository()}>
      <PreferencesRepositoryProvider repository={new LocalStoragePreferencesRepository()}>
        <App />
      </PreferencesRepositoryProvider>
    </RankingRepositoryProvider>
  </React.StrictMode>
);
