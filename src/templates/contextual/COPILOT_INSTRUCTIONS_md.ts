// src/templates/contextual/COPILOT_INSTRUCTIONS_md.ts
import type { ProjectConfig } from '../../types';
import { getDevCmd, getTestCmd, getLintCmd } from '../../logic/commands';
import { hasSkill } from '../../logic/skillsHelper';

function getStackSummary(config: ProjectConfig): string {
  const parts: string[] = [];
  if (config.frontend !== 'none') parts.push(`Frontend: ${config.frontend}`);
  if (config.backend !== 'none') parts.push(`Backend: ${config.backend}`);
  if (config.databases.length > 0) parts.push(`Databases: ${config.databases.join(', ')}`);
  if (config.queues.length > 0) parts.push(`Queues: ${config.queues.join(', ')}`);
  return parts.map(p => `- ${p}`).join('\n');
}

function getConventions(config: ProjectConfig): string {
  const rules: string[] = [
    '- Read existing files before editing them',
    '- Follow the folder structure defined in ARCHITECTURE.md',
    '- No hardcoded secrets, tokens, or credentials',
    '- Edit existing files before creating new ones',
  ];

  if (config.frontend === 'react' || config.frontend === 'nextjs') {
    rules.push('- Function components only — no class components');
    rules.push('- Custom hooks for side effects and data fetching');
  }
  if (config.frontend === 'vue') {
    rules.push('- Composition API with <script setup> — no Options API');
    rules.push('- Composables for shared reactive logic');
  }
  if (config.backend === 'nodejs') {
    rules.push('- routes/ → controllers/ → services/ → models/ layer order');
    rules.push('- Parameterized queries only — never string concatenation in SQL');
  }
  if (config.backend === 'python') {
    rules.push('- routers/ → services/ → models/ — no business logic in routers');
  }
  if (config.backend === 'go') {
    rules.push('- handler/ → service/ → repository/ — interfaces define boundaries');
  }
  if (config.hasTesting) {
    rules.push('- Tests required for all new business logic');
  }
  if (config.hasAuth || config.hasPayments) {
    rules.push('- Ask before modifying auth or payment paths');
  }
  if (hasSkill(config, 'auth-system')) {
    rules.push('- Never store auth tokens in localStorage — httpOnly cookies only');
  }
  if (hasSkill(config, 'accessibility')) {
    rules.push('- ARIA labels on all interactive elements, WCAG AA contrast minimum');
  }

  return rules.join('\n');
}

export default function COPILOT_INSTRUCTIONS_md(config: ProjectConfig): string {
  return `# GitHub Copilot Instructions — ${config.name}

${config.description}

## Project Stack
${getStackSummary(config)}

## Key Commands
- Dev: \`${getDevCmd(config)}\`
- Lint: \`${getLintCmd(config)}\`${config.hasTesting ? `\n- Test: \`${getTestCmd(config)}\`` : ''}

## Conventions
${getConventions(config)}

## Off-Limits Paths
- \`.env\` — never read or modify
${config.hasAuth ? '- `src/auth/**` — ask before touching\n' : ''}\
${config.hasPayments ? '- `src/payments/**` — ask before touching\n' : ''}\
- Build output and dependency directories

## Context Files
- Full architecture: @ARCHITECTURE.md
- Current progress: @PROGRESS.md
${config.databases.length > 0 ? '- DB schema: @DATABASE_SCHEMA.md\n' : ''}\
${config.hasAuth || config.hasPayments ? '- Security rules: @SECURITY.md\n' : ''}\

> This file is automatically read by GitHub Copilot in VS Code and JetBrains IDEs.
> Keep it in sync with CLAUDE.md after significant architecture changes.
`;
}
