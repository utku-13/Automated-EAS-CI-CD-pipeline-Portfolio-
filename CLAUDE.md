# Project: TodoApp (ToDo-CI/CD)

## Overview
A React Native Todo app built with Expo. Persists data locally using SQLite via `expo-sqlite`. Single-screen, portrait-only, targets iOS and Android.

## Key Files
- `App.js` — entire app (single component, all logic inline)
- `app.json` — Expo config (name: TodoApp, slug: todo-app, version: 1.0.0)
- `package.json` — dependencies (expo ~51, expo-sqlite ~14, react-native 0.74.5)

## Architecture
- Single `App` component with `useState` for todos list and input text
- `useRef` holds the SQLite db instance (opened once on mount via `useEffect`)
- SQLite table: `todos (id INTEGER PK AUTOINCREMENT, text TEXT NOT NULL, completed INTEGER DEFAULT 0)`
- All DB operations are async; every mutation calls `load()` to re-fetch state
- No navigation, no external state management, no backend

## Dev Commands
```bash
npm start          # start Expo dev server
npm run ios        # run on iOS simulator
npm run android    # run on Android emulator
```

## Project Name Convention
Folder is named `ToDo-CI:CD` — CI/CD pipeline setup is planned/in progress for this project.

## Notes
- No tests yet
- No TypeScript (plain JS)
- `.expo/` and `node_modules/` are gitignored
