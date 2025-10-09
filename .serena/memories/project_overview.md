Project: Shisoku (四則演算パズルゲーム)
Purpose: A math puzzle game using four numbers and operations to reach a target.
Tech stack: React 19, TypeScript 5.8, Vite 6, Tailwind CSS 3, Tone.js, Vitest + Testing Library.
Architecture: Repository / UseCase / Context / Hook (React). UseCase class pattern with DI; repositories for preferences and ranking (LocalStorage/InMemory). Composition Root in src/index.tsx.
Key modules: src/component/* (UI), src/usecase/* (SaveScoreUseCase, LoadRankingsUseCase), src/repository/* (LocalStorage/InMemory), src/domain/* (interfaces/types), src/service/* (audio/gameLogic).
Docs: docs/react-data-architecture.md, docs/architecture-general.md, docs/architecture-flutter.md, docs/architecture-go.md.
