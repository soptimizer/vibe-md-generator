// src/templates/core/README_md.ts
import type { ProjectConfig } from '../../types';
import { getInstallCmd, getDevCmd, getDepsLabel } from '../../logic/commands';

export default function README_md(config: ProjectConfig): string {
  const aiFile = config.aiTool === 'codex' ? 'AGENTS.md' : 'CLAUDE.md';
  const stackParts = [
    config.frontend !== 'none' ? config.frontend : null,
    config.backend !== 'none' ? config.backend : null,
    config.databases.length > 0 ? config.databases.join(', ') : null,
    config.queues.length > 0 ? config.queues.join(', ') : null,
  ].filter(Boolean).join(' + ') || 'none';

  return `# ${config.name}

${config.description}

## Quick Context for AI

- **Project:** ${config.name} — ${config.description}
- **Type:** ${config.type} | **Scale:** ${config.scale}
- **Stack:** ${stackParts}
- **AI Tool:** ${config.aiTool} — read [${aiFile}](./${aiFile}) for full context
- **Current phase:** See [PROGRESS.md](./PROGRESS.md)

## Getting Started

\`\`\`bash
${getInstallCmd(config)}
${getDevCmd(config)}
\`\`\`

## Stack
${config.frontend !== 'none' ? `- **Frontend:** ${config.frontend}\n` : ''}\
${config.backend !== 'none' ? `- **Backend:** ${config.backend}\n` : ''}\
${config.databases.length > 0 ? `- **Databases:** ${config.databases.join(', ')}\n` : ''}\
${config.queues.length > 0 ? `- **Queues:** ${config.queues.join(', ')}\n` : ''}\
- **Deps:** ${getDepsLabel(config)}

## Docs
- [Architecture](./ARCHITECTURE.md)
- [Progress](./PROGRESS.md)${config.scale !== 'solo' ? '\n- [Tasks](./TASKS.md)' : ''}
`;
}
