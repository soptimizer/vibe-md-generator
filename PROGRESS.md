# Progress

## Status: Phase 4 — Deploy

## Completed

### Phase 1 — Scaffold
- [x] Project scaffolded (Vite + React + TS + Tailwind)
- [x] Folder structure created
- [x] Core MD files written (CLAUDE.md, ARCHITECTURE.md, this file)
- [x] TypeScript types defined (`src/types/index.ts`)
- [x] Template contract established
- [x] Zustand store + app shell implemented (`src/store/projectStore.ts`)

### Phase 2 — Wizard & Templates
- [x] Step 1 — Basics (name, description, type, scale, aiTool)
- [x] Step 2 — Stack (frontend, backend, database, packageManager)
- [x] Step 3 — Features & Goals (auth, payments, testing, deployment, token efficiency)
- [x] Step 4 — Review (config summary + file list preview + generate trigger)
- [x] Step indicator in App.tsx (visual progress bar)
- [x] fileSelector.ts — rule-based file selection engine
- [x] generator.ts — template runner
- [x] All 12 template files (4 core + 5 contextual + 2 inline + AGENTS_MD alias)
- [x] exporter.ts — clipboard copy + ZIP download (JSZip)
- [x] Preview panel in App.tsx — file tabs, content viewer, copy button, ZIP button

### Phase 3 — Preview & Export
- [x] MDPreview component with react-markdown rendering (+ Raw toggle)
- [x] FileList sidebar (replaces current tab buttons)
- [x] Error boundaries
- [x] Responsive polish (mobile layout)

## Up Next (Phase 4)
- [ ] Deploy to Vercel
- [ ] OG meta tags + favicon

## Known Issues
_None_

## Decisions Log
- Chose Zustand over Context API: simpler, no provider boilerplate
- Chose JSZip over server-side: keeps app fully static
- Templates as plain TS functions: testable, no DSL needed
- AGENTS_MD reuses CLAUDE_md function, only filename differs
- Inline lambdas for IMPLEMENTATION_PLAN_MD and TECH_STACK_MD (too small to warrant a file)
