# Architecture

## Overview
Static React SPA. No backend. All generation happens client-side.

## Data Flow
```
User Input (Wizard Form)
  → Zustand Store (ProjectConfig)
    → fileSelector.ts (decides which MD files)
      → generator.ts (fills templates with config)
        → MDPreview (renders output)
          → exporter.ts (ZIP or clipboard)
```

## Core Modules

### `src/logic/fileSelector.ts`
Rule-based engine. Takes `ProjectConfig`, returns `MDFileKey[]`.
Always includes: CLAUDE_MD (or AGENTS_MD for codex, OPENCODE_AGENTS_MD for opencode, GEMINI_MD for antigravity), ARCHITECTURE_MD, PROGRESS_MD, README_MD, PRD_MD, GITIGNORE, LLMS_TXT.
Conditionally adds based on config flags and selectedSkills.
`getFilename(key, config)` maps MDFileKey → actual file path (e.g. `.cursor/rules/project.mdc`).

### `src/logic/generator.ts`
Calls each selected template function with config.
Returns `GeneratedFile[]` — `{ key, filename, content, warning? }`.
Warns when CLAUDE_MD or AGENTS_MD exceed 150 lines.

### `src/logic/skillsHelper.ts`
Utility functions: `hasSkill(config, id)`, `hasAnySkill(config, ids[])`.
Used by CLAUDE_md.ts and ARCHITECTURE_md.ts to inject skill-specific content.

### `src/logic/commands.ts`
Per-stack CLI string helpers: `getDevCmd`, `getBuildCmd`, `getTestCmd`, `getLintCmd`, `getDepsLabel`, `getTestFilePattern`.
Used by templates to output accurate quick-start commands.

### `src/logic/ignorePatterns.ts`
Returns build output dirs and dependency dirs per stack.
Used by CLAUDE_md.ts (never-read list) and GITIGNORE_tmpl.ts.

### `src/logic/exporter.ts`
- `copyToClipboard(content)` — single file
- `downloadZip(files, projectName)` — JSZip bundle → `{name}-md-files.zip`

### `src/store/projectStore.ts`
Single Zustand store with persist middleware (key: `vibemd-wizard`).
Persists: `step` + `config`. Excludes: `generatedFiles` (derived state).
`updateConfig()` auto-generates files when `config.name` is non-empty.

## Template Contract
Every template file exports one default function:
```ts
export default function templateName(config: ProjectConfig): string
```
Tiny templates (< 30 lines) are inline lambdas in `src/templates/index.ts`.

## Component Tree
```
App
├── WizardLayout
│   ├── Step1_Basics      (name, description, type, scale, aiTool)
│   ├── Step2_Stack       (frontend, backend, databases, queues, packageManager)
│   ├── Step3_Goals       (auth, payments, testing, deployment, tokenEfficiency, aiRole)
│   ├── Step4_Skills      (85 skills across 10 categories, search + bulk select)
│   └── Step5_Review      (config summary + file list + generate/download)
└── PreviewLayout
    ├── FileList (sidebar — Core / Contextual grouping)
    └── MDPreview (main panel — rendered + raw toggle)
```

## State Shape
```ts
ProjectConfig {
  // Step 1
  name, description, type, scale, aiTool,
  // Step 2
  frontend, backend, databases, queues, packageManager,
  // Step 3
  hasAuth, hasPayments, hasTesting, hasDeployment, tokenEfficiency, aiRole,
  // Step 4
  selectedSkills: string[]
}
```

## Generated File Types (46 MDFileKey values)

**Always included (7):**
CLAUDE_MD | AGENTS_MD | OPENCODE_AGENTS_MD | GEMINI_MD, README_MD, ARCHITECTURE_MD, PROGRESS_MD, PRD_MD, GITIGNORE, LLMS_TXT

**AI Tool-specific:**
| Tool | Files |
|------|-------|
| claude | CLAUDE_SETTINGS_JSON, MCP_CONFIG_JSON |
| cursor | CURSOR_RULES_MD, CURSORIGNORE |
| windsurf | WINDSURFIGNORE, WINDSURF_RULES_MD |
| copilot | COPILOT_INSTRUCTIONS_MD |
| opencode | OPENCODE_JSON, OPENCODE_SKILL_CONTEXT_MD, OPENCODE_SKILL_REVIEW_MD, +OPENCODE_SKILL_TESTDRIVEN_MD, +OPENCODE_AGENT_DESIGNER_MD, +OPENCODE_AGENT_FRONTEND_MD, +OPENCODE_AGENT_BACKEND_MD, +OPENCODE_AGENT_DEVOPS_MD |
| antigravity | ANTIGRAVITY_AGENTS_MD, ANTIGRAVITY_SKILL_REVIEW_MD, ANTIGRAVITY_WORKFLOW_SETUP_MD, +ANTIGRAVITY_SKILL_TEST_MD, +ANTIGRAVITY_WORKFLOW_DEPLOY_MD |

**Feature-conditional:**
DATABASE_SCHEMA_MD, SECURITY_MD, API_SPEC_MD, TESTING_STRATEGY_MD, DEPLOYMENT_MD, DESIGN_SYSTEM_MD, ERROR_HANDLING_MD, DEPENDENCY_AUDIT_MD, INCIDENT_RESPONSE_MD

**Team/scale-conditional:**
TASKS_MD, GIT_WORKFLOW_MD, CONTRIBUTING_MD

**Token mode-conditional:**
IMPLEMENTATION_PLAN_MD, TECH_STACK_MD, DECISIONS_MD, CONTEXT_MAP_MD
