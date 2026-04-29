# Implementation Plan

## Phase 1 — Foundation
**Goal:** Runnable app skeleton with types and store.

Steps:
1. Init Vite project: `npm create vite@latest . -- --template react-ts`
2. Install deps: `tailwindcss zustand jszip react-markdown react-router-dom`
3. Configure Tailwind (`tailwind.config.ts`, `index.css`)
4. Write `src/types/index.ts` — all shared types
5. Write `src/store/projectStore.ts` — Zustand store
6. Write `src/App.tsx` — basic routing shell

**Verify:** `npm run dev` shows blank app with no TS errors.

---

## Phase 2 — Templates & Logic
**Goal:** File selection + content generation working.

Steps:
1. Write 4 core templates: `CLAUDE_md`, `ARCHITECTURE_md`, `PROGRESS_md`, `README_md`
2. Write 6 contextual templates: `SECURITY_md`, `DATABASE_md`, `API_SPEC_md`, `TASKS_md`, `TESTING_md`, `TECH_STACK_md`
3. Write `src/logic/fileSelector.ts`
4. Write `src/logic/generator.ts`
5. Unit test: call generator with mock config, assert output strings

**Verify:** `generator(mockConfig)` returns correct file list with non-empty content.

---

## Phase 3 — UI
**Goal:** Full wizard + preview working end-to-end.

Steps:
1. Build `Step1_Basics`, `Step2_Stack`, `Step3_Goals`, `Step4_Review`
2. Build `FileList` sidebar component
3. Build `MDPreview` using react-markdown
4. Build `exporter.ts` (clipboard + JSZip)
5. Wire everything to Zustand store

**Verify:** Select options → see generated MD → download ZIP.

---

## Phase 4 — Polish
**Goal:** Production-ready, deployed.

Steps:
1. Responsive layout (mobile wizard)
2. Error states + loading
3. `npm run build` — zero errors
4. Deploy to Vercel

**Verify:** Live URL works on mobile + desktop.
