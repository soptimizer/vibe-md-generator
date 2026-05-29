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
Always includes: CLAUDE_MD (or AGENTS_MD for codex), ARCHITECTURE_MD, PROGRESS_MD, README_MD, PRD_MD, GITIGNORE, LLMS_TXT.
Conditionally adds based on config flags and selectedSkills.

### `src/logic/generator.ts`
Calls each selected template function with config.
Returns `{ filename: string, content: string, warning?: string }[]`.
Warns when CLAUDE_MD or AGENTS_MD exceed 150 lines.

### `src/logic/skillsHelper.ts`
Utility functions: `hasSkill(config, id)`, `hasAnySkill(config, ids[])`.
Used by CLAUDE_md.ts and ARCHITECTURE_md.ts to inject skill-specific content.

### `src/logic/exporter.ts`
- `copyToClipboard(content)` — single file
- `downloadZip(files, projectName)` — JSZip bundle

### `src/store/projectStore.ts`
Single Zustand store with persist middleware. Holds `ProjectConfig` + `currentStep`.
`generatedFiles` is excluded from persistence (derived state).

## Template Contract
Every template file exports one default function:
```ts
export default function templateName(config: ProjectConfig): string
```

## Component Tree
```
App
├── WizardLayout
│   ├── Step1_Basics      (name, description, type, scale, aiTool)
│   ├── Step2_Stack       (frontend, backend, databases, queues, packageManager)
│   ├── Step3_Goals       (auth, payments, testing, deployment, tokenEfficiency, aiRole)
│   ├── Step4_Skills      (85 skills across 10 categories)
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

## Generated File Types (29 MDFileKey values)
Always: CLAUDE_MD | AGENTS_MD, README_MD, ARCHITECTURE_MD, PROGRESS_MD, PRD_MD, GITIGNORE, LLMS_TXT
Conditional: CLAUDE_SETTINGS_JSON, CURSOR_RULES_MD, CURSORIGNORE, WINDSURFIGNORE, WINDSURF_RULES_MD,
             COPILOT_INSTRUCTIONS_MD, MCP_CONFIG_JSON, TASKS_MD, IMPLEMENTATION_PLAN_MD, TECH_STACK_MD,
             DATABASE_SCHEMA_MD, SECURITY_MD, API_SPEC_MD, TESTING_STRATEGY_MD, DEPLOYMENT_MD,
             GIT_WORKFLOW_MD, CONTRIBUTING_MD, DESIGN_SYSTEM_MD, DECISIONS_MD, CONTEXT_MAP_MD, ERROR_HANDLING_MD
