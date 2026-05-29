# VibeMD Generator

Web app that generates project-specific AI context markdown files for vibe coders based on selected parameters.

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Zustand (state, localStorage persist)
- JSZip (export)
- react-markdown (preview)
- vitest (tests)

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`
- Test: `npm run test`
- Test watch: `npm run test:watch`

## Structure
```
src/
  components/wizard/    # 5-step wizard (Step1–Step5)
  components/preview/   # live MD preview (FileList, MDPreview, PreviewLayout)
  components/ui/        # shadcn/ui primitives (button, select, checkbox, …)
  templates/
    core/               # always-required MD templates (6 files)
    contextual/         # conditional MD templates (31 files)
    index.ts            # templateRegistry: Record<MDFileKey, fn>
  logic/
    fileSelector.ts     # rule engine → MDFileKey[]
    generator.ts        # calls templateRegistry, returns GeneratedFile[]
    skillsHelper.ts     # hasSkill(), hasAnySkill()
    exporter.ts         # copyToClipboard(), downloadZip()
    commands.ts         # per-stack CLI command strings
    ignorePatterns.ts   # build output + dependency dir helpers
  store/
    projectStore.ts     # Zustand store with localStorage persist
  types/
    index.ts            # ProjectConfig, MDFileKey, GeneratedFile, WizardStore
  lib/
    utils.ts            # cn() Tailwind merge utility
```

## Key Rules
- All templates export one default function: `(config: ProjectConfig) => string`
- `fileSelector.ts` is the single source of truth for which files get generated
- Never hardcode project name — always use `config.name`
- Keep generated MD files under 80 lines each
- `any` type forbidden — every value must have an explicit TypeScript type
- Components max 150 lines — split if longer
- shadcn/ui first for any new UI element; write custom only when shadcn doesn't cover it
- `localStorage` access only through Zustand persist middleware — never directly

## Boundaries
**Never do**
- Modify `templateRegistry` in `index.ts` without adding the corresponding `MDFileKey` to `types/index.ts`
- Add a new MDFileKey without wiring it in `fileSelector.ts` AND `getFilename()` AND `templateRegistry`
- Call `generateFiles()` when `config.name` is empty
- Create a separate template file for content < 30 lines — use an inline lambda in `index.ts` instead

**Ask first**
- Adding a new `AITool` value (requires: types, fileSelector, Step1 UI, template wiring)
- Changing the Zustand persist key (breaks localStorage for existing users)

## References
- Types: @src/types/index.ts
- File selection logic: @src/logic/fileSelector.ts
- Template registry: @src/templates/index.ts
- Architecture: @ARCHITECTURE.md
- Progress: @PROGRESS.md
