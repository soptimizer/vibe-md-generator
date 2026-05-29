// src/templates/contextual/ANTIGRAVITY_AGENTS_md.ts
import type { ProjectConfig } from '../../types';
import { getDepsLabel } from '../../logic/commands';

export default function ANTIGRAVITY_AGENTS_md(config: ProjectConfig): string {
  return `# ${config.name} — Shared Agent Rules

> This file is read by all AI tools (Antigravity, Cursor, Claude Code, etc.).
> Tool-specific overrides live in GEMINI.md.

## Project Context

**${config.name}** — ${config.description}

- Type: ${config.type} | Scale: ${config.scale}
- Frontend: ${config.frontend === 'none' ? 'N/A' : config.frontend}
- Backend: ${config.backend === 'none' ? 'N/A' : config.backend}
- Databases: ${config.databases.length > 0 ? config.databases.join(', ') : 'N/A'}
- Package manager: ${getDepsLabel(config)}

## Universal Coding Standards

- One responsibility per function; keep functions under 40 lines
- Descriptive names over abbreviations — no single-letter variables outside loops
- No commented-out code — delete dead code, use git history to recover it
- No magic numbers — define named constants
- Edit existing files before creating new ones

## Security Baseline
${config.hasAuth ? '- Auth routes must always validate the session before processing\n' : ''}\
${config.hasPayments ? '- Payment logic is off-limits for autonomous changes — always ask first\n' : ''}\
- Never commit secrets, API keys, or credentials to source control
- Validate and sanitise all external input before use
- Parameterised queries only — no string-interpolated SQL

## Dependency Policy
- Do not add a new dependency to solve a problem solvable in < 20 lines of plain code
- Run \`${getDepsLabel(config)} audit\` after adding any dependency

## Context Files
- \`ARCHITECTURE.md\` — folder structure, data flow, module contracts
- \`PROGRESS.md\` — current sprint, completed features, blockers
- \`PRD.md\` — product requirements and success criteria
- \`GEMINI.md\` — Antigravity-specific overrides (higher priority than this file)
`;
}
