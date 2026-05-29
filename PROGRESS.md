# Progress

## Status: Phase 5 — COMPLETE ✅

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
- [x] fileSelector.ts — rule-based file selection engine
- [x] generator.ts — template runner with line-count warnings
- [x] 6 core templates (CLAUDE_md, ARCHITECTURE_md, PROGRESS_md, README_md, GITIGNORE, LLMS_TXT)
- [x] exporter.ts — clipboard copy + ZIP download (JSZip)
- [x] Preview panel — file tabs, content viewer, copy button, ZIP button

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

### Phase 5 — Skills Integration & 2025 AI Tools
- [x] `skillsHelper.ts` — `hasSkill()` / `hasAnySkill()` utility module
- [x] CLAUDE_md.ts — `getSkillRules()` skill-specific rule injection (auth, caching, observability, containers, a11y, testing, code-review, microservices, queues, AI/ML)
- [x] ARCHITECTURE_md.ts — `getSkillSections()` skill-specific architecture sections (containers, caching, microservices, RAG/ML, queues)
- [x] `llms.txt` template (generated for all projects)
- [x] GitHub Copilot Instructions (`.github/copilot-instructions.md`)
- [x] Windsurf Rules (`WINDSURF_RULES.md`) + `.windsurfignore`
- [x] MCP Config JSON (`.claude/mcp.json`)
- [x] `'copilot'` added to AITool type + Step1 UI
- [x] `'opencode'` support — OPENCODE_AGENTS_MD, OPENCODE_JSON, 3 skills, 4 agent personas
- [x] `'antigravity'` support — GEMINI_MD, ANTIGRAVITY_AGENTS_MD, 2 skills, 2 workflows
- [x] DEPENDENCY_AUDIT_MD — dependency review + upgrade plan template
- [x] INCIDENT_RESPONSE_MD — severity levels, escalation path, postmortem template
- [x] localStorage persistence via Zustand persist middleware (key: `vibemd-wizard`)
- [x] Auto-generate on config change (triggered in `updateConfig()`)
- [x] vitest test setup + fileSelector / commands tests
- [x] TypeScript `any` eliminated across wizard components
- [x] `generateFiles()` guard for empty `config.name`
- [x] `commands.ts` — per-stack CLI helpers (install, dev, build, test, lint)
- [x] `ignorePatterns.ts` — build output + dependency dir helpers
- [x] Review checklist in CLAUDE_md.ts (framework-aware)
- [x] Working modes (Build / Review / Refactor) in CLAUDE_md.ts
- [x] Feature Registry table in CLAUDE_md.ts

## In Progress (Phase 6)

### Content Quality
- [ ] Skill suggestions auto-applied from stack (e.g. react → ui-builder, state-management)
- [ ] Warning banner in MDPreview when file exceeds 150 lines
- [ ] FileList badge showing warning count

### New AI Tool Support
- [ ] `'gemini'` as standalone AITool (currently Antigravity uses GEMINI_MD)
- [ ] Codex / OpenAI Codex native support (currently reuses AGENTS_MD alias)

### UX
- [ ] Dark mode toggle
- [ ] Copy-all-as-ZIP button in preview header
- [ ] Shareable config link (lz-string compressed URL param)

### Quality
- [ ] generator.ts unit tests
- [ ] Template snapshot tests (golden files)
- [ ] Playwright e2e: full wizard → download ZIP → verify file names

## Known Issues
_None_

## Decisions Log
- Chose Zustand over Context API: simpler, no provider boilerplate
- Chose JSZip over server-side: keeps app fully static
- Templates as plain TS functions: testable, no DSL needed
- AGENTS_MD reuses CLAUDE_md function, only filename differs (same for OPENCODE_AGENTS_MD)
- Inline lambdas for IMPLEMENTATION_PLAN_MD and TECH_STACK_MD (too small to warrant a file)
- Skills inject into existing templates (CLAUDE.md, ARCHITECTURE.md) rather than creating separate files per skill
- Antigravity uses GEMINI_MD as the primary AI context file (Gemini is the underlying model)
- OpenCode uses `.agent/` folder structure for agents and skills (mirrors OpenCode spec)
