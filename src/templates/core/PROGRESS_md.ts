// src/templates/core/PROGRESS_md.ts
import type { ProjectConfig } from '../../types';

export default function PROGRESS_md(config: ProjectConfig): string {
  return `# Progress — ${config.name}

## Status: Phase 1 — Setup

## Completed
- [x] Project initialized
- [x] MD files generated (VibeMD Generator)

## In Progress
- [ ] Core setup and configuration

## Up Next
- [ ] First feature implementation
- [ ] Basic tests${config.hasDeployment ? '\n- [ ] Deployment pipeline' : ''}

## AI Session Log

> Fill this in at the end of each AI session. It prevents context loss
> between sessions and avoids re-explaining completed work.

<!-- Session Template:
## Session — YYYY-MM-DD
**Goal:** _what was attempted_
**Completed:** _what was actually done_
**Files changed:** _list key files_
**Decisions made:** _any architectural choices_
**Left for next session:** _unfinished items_
-->

_No sessions logged yet._

## Decisions Log
_Document key decisions here as the project evolves._
| Date | Decision | Reason |
|------|----------|--------|
| — | Project started | — |

## Known Issues
_None yet_

---
_Read this at the start of every session. Update when milestones complete._

## Context Reset
If the AI loses track of the project, re-share these files before continuing:
1. \`CLAUDE.md\` — rules, stack, commands
2. \`ARCHITECTURE.md\` — structure and constraints
3. \`PROGRESS.md\` — this file (current state)
Then say: **"Read these files, then continue from where we left off."**
`;
}
