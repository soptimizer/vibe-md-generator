// src/templates/contextual/AIDER_tmpl.ts
import type { ProjectConfig } from '../../types';
import { getTestCmd, getLintCmd } from '../../logic/commands';

export function AIDER_CONF_tmpl(config: ProjectConfig): string {
  const modelMap: Record<string, string> = {
    claude: 'claude-sonnet-4-6',
    cursor: 'claude-sonnet-4-6',
    windsurf: 'claude-sonnet-4-6',
    gemini: 'gemini/gemini-2.5-pro',
    generic: 'claude-sonnet-4-6',
    codex: 'o3',
    copilot: 'gpt-4o',
    opencode: 'claude-sonnet-4-6',
    antigravity: 'gemini/gemini-2.5-pro',
    aider: 'claude-sonnet-4-6',
  };

  const model = modelMap[config.aiTool] ?? 'claude-sonnet-4-6';

  return `## Aider configuration for ${config.name}
model: ${model}
auto-commits: false
no-dirty-commits: true
read: AIDER_CONVENTIONS.md
${config.hasTesting ? `test-cmd: ${getTestCmd(config)}\n` : ''}\
${config.frontend !== 'none' || config.backend !== 'none' ? `lint-cmd: ${getLintCmd(config)}\n` : ''}\
attribute-author: false
attribute-committer: false
`;
}

export function AIDER_CONVENTIONS_md(config: ProjectConfig): string {
  const neverRules: string[] = [
    '- Never commit secrets or API keys',
    '- Never leave empty catch blocks',
  ];

  if (config.frontend === 'react' || config.frontend === 'nextjs') {
    neverRules.push('- Never use array index as a React key for dynamic lists');
    neverRules.push('- Never call hooks conditionally');
  }
  if (config.backend === 'python') {
    neverRules.push('- Never use mutable default arguments');
    neverRules.push('- Never catch bare `except:`');
  }
  if (config.backend === 'nodejs') {
    neverRules.push('- Never block the event loop with synchronous I/O in request handlers');
  }
  if (config.hasTesting) {
    neverRules.push('- Never delete tests to make the suite pass');
    neverRules.push('- Never mock what you can test with real implementations');
  }
  if (config.scale !== 'solo') {
    neverRules.push('- Never push directly to main — always open a PR');
  }

  return `# Aider Conventions — ${config.name}

${config.description}

## Stack
- Frontend: ${config.frontend === 'none' ? 'N/A' : config.frontend}
- Backend: ${config.backend === 'none' ? 'N/A' : config.backend}
- Databases: ${config.databases.length > 0 ? config.databases.join(', ') : 'N/A'}

## Conventions
- Prefer editing existing files over creating new ones
- Follow the folder structure defined in ARCHITECTURE.md
- One responsibility per module
- Clear, descriptive names — no abbreviations
${config.hasTesting ? '- Write tests alongside any new logic\n' : ''}\

## Never Do
${neverRules.join('\n')}

## References
- Architecture: ARCHITECTURE.md
- Progress: PROGRESS.md
${config.databases.length > 0 ? '- DB Schema: DATABASE_SCHEMA.md\n' : ''}\
${config.hasAuth || config.hasPayments ? '- Security: SECURITY.md\n' : ''}\
`;
}
