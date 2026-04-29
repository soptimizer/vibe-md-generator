# VibeMD Generator

Web app that generates project-specific MD files for vibe coders based on selected parameters.

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS
- Zustand (state)
- JSZip (export)
- react-markdown (preview)

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`

## Structure
```
src/
  components/wizard/   # 4-step form
  components/preview/  # live MD preview
  components/ui/       # shared components
  templates/core/      # always-required MD templates
  templates/contextual/ # conditional MD templates
  logic/               # file selection + generation engine
  store/               # Zustand project config store
  types/               # shared TypeScript types
```

## Key Rules
- All templates return typed string functions: `(config: ProjectConfig) => string`
- fileSelector.ts is the single source of truth for which files get generated
- Never hardcode project name — always use `config.name`
- Keep generated MD files under 80 lines each

## References
- Types: @src/types/index.ts
- File selection logic: @src/logic/fileSelector.ts
- Architecture: @ARCHITECTURE.md
- Progress: @PROGRESS.md
