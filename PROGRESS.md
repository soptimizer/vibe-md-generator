# Progress

## Status: Phase 5 — Skills Integration & 2025 AI Tools

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
- [x] Step 2 — Stack (frontend, backend, databases, queues, packageManager)
- [x] Step 3 — Features & Goals (auth, payments, testing, deployment, token efficiency, AI role)
- [x] Step 4 — Skills (85 skills across 10 categories with search + bulk select)
- [x] Step 5 — Review (config summary + file list preview + generate trigger)
- [x] Step indicator in App.tsx (visual progress bar)
- [x] fileSelector.ts — rule-based file selection engine (25 file types)
- [x] generator.ts — template runner with line-count warnings
- [x] All 25 template files (5 core + 17 contextual + 2 inline + AGENTS_MD alias)
- [x] exporter.ts — clipboard copy + ZIP download (JSZip)
- [x] Preview panel in App.tsx — file tabs, content viewer, copy button, ZIP button

### Phase 3 — Preview & Export
- [x] MDPreview component with react-markdown rendering (+ Raw toggle)
- [x] FileList sidebar (Core / Contextual grouping)
- [x] Error boundaries
- [x] Responsive polish (mobile layout)

### Phase 4 — Bug Fixes
- [x] getBuildCmd() Python null type bypass fixed → `python -m build`
- [x] Step4_Review.tsx dead code removed (superseded by Step4_Skills + Step5_Review)
- [x] API_SPEC_md.ts hardcoded port 3000 → dynamic per backend
- [x] ErrorBoundary Turkish messages → English
- [x] PROGRESS.md and ARCHITECTURE.md updated to reflect 5-step wizard

## In Progress (Phase 5)

### Skills Integration
- [ ] `skillsHelper.ts` utility module
- [ ] CLAUDE_md.ts — `getSkillRules()` skill-specific rule injection
- [ ] ARCHITECTURE_md.ts — `getSkillSections()` skill-specific architecture sections

### 2025 AI Tool Support
- [ ] `llms.txt` template (generated for all projects)
- [ ] GitHub Copilot Instructions (`.github/copilot-instructions.md`)
- [ ] Windsurf Rules (`WINDSURF_RULES.md`)
- [ ] MCP Config JSON (`.claude/mcp.json`)
- [ ] Add `'copilot'` to AITool type + Step1 UI

### UX Improvements
- [ ] localStorage persistence (Zustand persist middleware)
- [ ] Auto-generate on config change
- [ ] Warning banner in MDPreview / FileList badge
- [ ] Skill suggestions based on stack selection

### Quality
- [ ] vitest test setup + fileSelector / commands / generator tests
- [ ] TypeScript `any` fix in Step2_Stack.tsx
- [ ] generateFiles() guard for empty config.name

## Known Issues
_None_

## Decisions Log
- Chose Zustand over Context API: simpler, no provider boilerplate
- Chose JSZip over server-side: keeps app fully static
- Templates as plain TS functions: testable, no DSL needed
- AGENTS_MD reuses CLAUDE_md function, only filename differs
- Inline lambdas for IMPLEMENTATION_PLAN_MD and TECH_STACK_MD (too small to warrant a file)
- Skills inject into existing templates (CLAUDE.md, ARCHITECTURE.md) rather than creating separate files per skill
