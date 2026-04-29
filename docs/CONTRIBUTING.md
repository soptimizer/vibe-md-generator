# Contributing

## Adding a New Template

1. Create `src/templates/contextual/YOUR_TEMPLATE_md.ts`
2. Export a default function: `(config: ProjectConfig) => string`
3. Add key to `MDFileKey` union in `src/types/index.ts`
4. Add filename mapping in `src/logic/fileSelector.ts` → `getFilename()`
5. Add selection rule in `fileSelector.ts` → `selectFiles()`
6. Register in `src/templates/index.ts`
7. Test: verify output with a sample config

## Template Guidelines
- Keep output under 80 lines
- Use config values — never hardcode project names
- Only include sections relevant to the config flags
- Use conditional blocks for optional sections

## Branch Naming
- `feature/template-name` for new templates
- `fix/description` for bug fixes
- `chore/description` for maintenance
