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
Always includes: CLAUDE_MD, ARCHITECTURE_MD, PROGRESS_MD, README_MD.
Conditionally adds based on config flags.

### `src/logic/generator.ts`
Calls each selected template function with config.
Returns `{ filename: string, content: string }[]`.

### `src/logic/exporter.ts`
- `copyToClipboard(content)` — single file
- `downloadZip(files)` — JSZip bundle

### `src/store/projectStore.ts`
Single Zustand store. Holds `ProjectConfig` + `currentStep`.

## Template Contract
Every template file exports one default function:
```ts
export default function templateName(config: ProjectConfig): string
```

## Component Tree
```
App
├── WizardLayout
│   ├── Step1_Basics
│   ├── Step2_Stack
│   ├── Step3_Goals
│   └── Step4_Review
└── PreviewLayout
    ├── FileList (sidebar)
    └── MDPreview (main panel)
```

## State Shape
```ts
ProjectConfig {
  name, description, type, scale, aiTool,
  frontend, backend, database,
  hasAuth, hasPayments, hasTesting,
  hasDeployment, tokenEfficiency, teamSize
}
```
