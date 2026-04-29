// src/templates/core/ARCHITECTURE_md.ts
import type { ProjectConfig } from '../../types';
import { getDepsLabel } from '../../logic/commands';

function buildProjectTree(config: ProjectConfig): string {
  const root = `${config.name.toLowerCase().replace(/\s+/g, '-')}/`;
  const lines: string[] = [root];

  if (config.frontend === 'nextjs') {
    lines.push('├── app/');
    lines.push('│   ├── (routes)/');
    lines.push('│   ├── layout.tsx');
    lines.push('│   └── page.tsx');
    lines.push('├── components/');
    lines.push('├── lib/');
    lines.push('├── hooks/');
    lines.push('├── types/');
    lines.push('├── public/');
  } else if (config.frontend === 'react') {
    lines.push('├── src/');
    lines.push('│   ├── components/');
    lines.push('│   ├── pages/');
    lines.push('│   ├── hooks/');
    lines.push('│   ├── store/');
    lines.push('│   ├── utils/');
    lines.push('│   ├── types/');
    lines.push('│   └── assets/');
  } else if (config.frontend === 'vue') {
    lines.push('├── src/');
    lines.push('│   ├── components/');
    lines.push('│   ├── views/');
    lines.push('│   ├── composables/');
    lines.push('│   ├── stores/');
    lines.push('│   ├── utils/');
    lines.push('│   └── types/');
  } else if (config.frontend === 'svelte') {
    lines.push('├── src/');
    lines.push('│   ├── routes/');
    lines.push('│   ├── lib/');
    lines.push('│   │   ├── components/');
    lines.push('│   │   └── stores/');
    lines.push('│   └── types/');
  } else if (config.frontend !== 'none') {
    lines.push('├── src/');
    lines.push('│   ├── components/');
    lines.push('│   ├── utils/');
    lines.push('│   └── types/');
  }

  if (config.backend === 'nodejs') {
    lines.push('├── src/');
    lines.push('│   ├── routes/');
    lines.push('│   ├── controllers/');
    lines.push('│   ├── services/');
    lines.push('│   ├── middleware/');
    lines.push('│   └── models/');
  } else if (config.backend === 'python') {
    lines.push('├── app/');
    lines.push('│   ├── routers/');
    lines.push('│   ├── services/');
    lines.push('│   ├── models/');
    lines.push('│   └── dependencies/');
  } else if (config.backend === 'go') {
    lines.push('├── cmd/');
    lines.push('├── internal/');
    lines.push('│   ├── handler/');
    lines.push('│   ├── service/');
    lines.push('│   └── repository/');
    lines.push('├── pkg/');
  } else if (config.backend === 'rust') {
    lines.push('├── src/');
    lines.push('│   ├── handlers/');
    lines.push('│   ├── services/');
    lines.push('│   └── models/');
  } else if (config.backend === 'dotnet') {
    lines.push('├── src/');
    lines.push('│   ├── Controllers/');
    lines.push('│   ├── Services/');
    lines.push('│   └── Models/');
  }

  if (config.databases.length > 0) {
    lines.push('├── db/');
    lines.push('│   └── migrations/');
  }

  if (config.hasTesting) lines.push('├── tests/');
  lines.push('├── .gitignore');
  lines.push('└── CLAUDE.md');

  return lines.join('\n');
}

export default function ARCHITECTURE_md(config: ProjectConfig): string {
  const hasDB = config.databases.length > 0;
  const hasQueue = config.queues.length > 0;
  const hasBackend = config.backend !== 'none';
  const hasFrontend = config.frontend !== 'none';

  const mermaidFlow = [
    '    User',
    hasFrontend ? `    User --> Frontend[${config.frontend} UI]` : null,
    hasBackend ? `    ${hasFrontend ? 'Frontend' : 'User'} --> API[${config.backend} API]` : null,
    ...config.databases.map(db => `    ${hasBackend ? 'API' : hasFrontend ? 'Frontend' : 'User'} --> DB_${db}[(${db})]`),
    ...config.queues.map(q => `    ${hasBackend ? 'API' : hasFrontend ? 'Frontend' : 'User'} --> Q_${q}[[${q}]]`),
    config.hasAuth ? `    API --> Auth[Auth Service]` : null,
    config.hasPayments ? `    API --> Pay[Payment Provider]` : null,
  ].filter(Boolean).join('\n');

  return `# Architecture — ${config.name}

## Overview
${config.description}
Type: **${config.type}** | Scale: **${config.scale}**

## Visual Architecture
> Diagram: [Open in Eraser.io / Miro / Figma](_paste-link-here_)
> Replace the link above with your team's live diagram. Keep the Mermaid snapshot below in sync after major changes.

\`\`\`mermaid
graph TD
${mermaidFlow}
\`\`\`

## Layer Separation

| Layer | Responsibility | What NOT to put here |
|-------|---------------|----------------------|
| **Presentation** | Rendering, user events, form state | Business rules, direct DB calls |
| **Business Logic** | Rules, validations, transformations | UI state, HTTP specifics |
| **Data Access** | DB queries, external API calls | Business rules, rendering |

> Keep these layers decoupled. Business logic must be testable without the UI or DB.

## Data Flow
\`\`\`
${hasFrontend ? `${config.frontend} UI` : 'Client'}${hasBackend ? ` → ${config.backend} API` : ''}${hasDB ? ` → ${config.databases.join(', ')}` : ''}${hasQueue ? ` → ${config.queues.join(', ')}` : ''}
\`\`\`

## Key Decisions
| Decision | Choice | Reason |
|----------|--------|--------|
| Frontend | ${config.frontend} | _fill in_ |
| Backend | ${config.backend} | _fill in_ |
| Databases | ${config.databases.length > 0 ? config.databases.join(', ') : 'none'} | _fill in_ |
| Queues | ${config.queues.length > 0 ? config.queues.join(', ') : 'none'} | _fill in_ |
| Deps | ${getDepsLabel(config)} | _fill in_ |

## Decision Log

| Date | Decision | Alternatives Considered | Outcome |
|------|----------|------------------------|---------|
| _YYYY-MM-DD_ | _describe decision_ | _what else was considered_ | _result_ |

> Add a row here before any significant architectural change.
> Keep this in sync with DECISIONS.md if it exists.

## Project Structure
\`\`\`
${buildProjectTree(config)}
\`\`\`

## Constraints
- Files under 300 lines — split if larger
- No circular dependencies between modules
- One responsibility per module
- Edit existing files before creating new ones
${config.hasAuth ? '- Auth logic isolated in /auth — never inline in routes\n' : ''}\
${config.hasPayments ? '- Payment logic isolated in /payments — never inline in components\n' : ''}\

_Update this file after any significant architectural change._
`;
}
