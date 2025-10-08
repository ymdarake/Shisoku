
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { RankingServiceProvider } from './context/RankingServiceContext';
import { PreferencesServiceProvider } from './context/PreferencesServiceContext';
import { LocalStorageRankingRepository } from './repository/localStorage/LocalStorageRankingRepository';
import { LocalStoragePreferencesRepository } from './repository/localStorage/LocalStoragePreferencesRepository';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <RankingServiceProvider repository={new LocalStorageRankingRepository()}>
      <PreferencesServiceProvider repository={new LocalStoragePreferencesRepository()}>
        <App />
      </PreferencesServiceProvider>
    </RankingServiceProvider>
  </React.StrictMode>
);
