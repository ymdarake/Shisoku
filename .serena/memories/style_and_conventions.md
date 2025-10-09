Language: TypeScript (strict-ish), React components with React 19 JSX.
Code style: Follow existing formatting; descriptive names; avoid 1-2 letter vars; early returns; avoid unnecessary try/catch; comments only for non-obvious rationale; Tailwind utility classes for styling.
Architecture conventions: Domain interfaces in src/domain/*; repositories singular; DI at composition root; hooks encapsulate fetching/caching; UseCase classes with execute(repo, ...); avoid direct repository calls from UI; tests under src/__tests__.
Security/Init: Follow ~/.claude/CLAUDE.md (Tone.js init timing and safety considerations).
