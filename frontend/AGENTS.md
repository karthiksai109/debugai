# AGENTS.md - DebugAI Frontend

## What
React dashboard for viewing AI-powered backend debug analyses. Shows stats, charts, analysis history, and a manual submission form.

## Stack
- React 18, Vite 6, Tailwind CSS 3
- Recharts for data visualization
- No router library, tab-based navigation in App.jsx
- API calls proxied to backend via Vite dev server

## File Map
```
src/
  main.jsx              - Entry point
  App.jsx               - Root component, tab navigation
  api.js                - All fetch calls to backend
  index.css             - Tailwind imports + base styles
  components/
    Dashboard.jsx       - Stats cards, severity/category charts, recent list
    AnalysisList.jsx    - Full table of all analyses
    SubmitForm.jsx      - Manual log submission with examples
    AnalysisDetail.jsx  - Single analysis deep view
```

## Run
```
npm install
npm run dev     # starts on port 5173, proxies /api to localhost:3001
npm run build   # production build to dist/
```

## Conventions
- Functional components only
- State managed with useState/useEffect, no external state lib
- Tailwind utility classes, no custom CSS except index.css base
- Dark theme (gray-950 background)
- All API calls in api.js, components never call fetch directly
