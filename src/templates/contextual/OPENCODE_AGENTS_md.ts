import type { ProjectConfig } from '../../types';
import { getDevCmd, getTestCmd, getLintCmd } from '../../logic/commands';

function getActivePersonas(config: ProjectConfig): string {
  const personas: string[] = [];
  if (config.frontend !== 'none') {
    personas.push('- **Aria** (Designer) — `.agent/agents/designer.md`');
    personas.push('- **Felix** (Frontend) — `.agent/agents/frontend-dev.md`');
  }
  if (config.backend !== 'none') {
    personas.push('- **Bora** (Backend) — `.agent/agents/backend-dev.md`');
  }
  if (config.hasDeployment) {
    personas.push('- **Deva** (DevOps) — `.agent/agents/devops.md`');
  }
  return personas.length > 0 ? personas.join('\n') : '- No specialized personas configured';
}

export default function OPENCODE_AGENTS_md(config: ProjectConfig): string {
  return `# OpenCode Agent Setup — ${config.name}

Bu dosya OpenCode tarafından her oturumda otomatik okunur.

---

## Mandatory First Step

Her yeni oturumda \`.agent/skills/project-context-primer/SKILL.md\` oku ve uygula. Bu adım atlanamaz.

---

## Project

**${config.name}** — ${config.description}

**Scale:** ${config.scale} | **AI Role:** ${config.aiRole}

---

## Critical Rules

### Security
- \`DROP\`, \`DELETE\`, \`TRUNCATE\`, \`rm -rf\`, \`git push --force\` (main branch): **Ask for confirmation before running**
${config.hasAuth ? '- Never modify auth paths without explicit user approval\n' : ''}\
${config.hasPayments ? '- Never modify payment paths without explicit user approval\n' : ''}\
- Never read or modify \`.env\` files
- Never log passwords, tokens, or PII

### Tests
${config.hasTesting ? `- Run \`${getTestCmd(config)}\` before marking any task done
- If passing tests break, stop and report immediately
- Never skip tests to unblock implementation` : '- No test suite configured — add tests before deploying critical changes'}

### File Permissions
- \`ARCHITECTURE.md\` — read-only reference, do not overwrite
- \`PROGRESS.md\` — update status only, never delete history entries
- Build output and \`node_modules\` / \`vendor\` — never touch

### Git Commits
- Format: \`type(scope): description\` (conventional commits)
- Types: \`feat\`, \`fix\`, \`refactor\`, \`docs\`, \`test\`, \`chore\`
${config.scale !== 'solo' ? '- Never push directly to main/master — always use PRs\n' : ''}\
---

## Commands

- Dev: \`${getDevCmd(config)}\`
- Lint: \`${getLintCmd(config)}\`${config.hasTesting ? `\n- Test: \`${getTestCmd(config)}\`` : ''}

---

## Active Agent Personas

${getActivePersonas(config)}

---

## Skills

- \`.agent/skills/project-context-primer/SKILL.md\` — session init (mandatory)
- \`.agent/skills/code-review/SKILL.md\` — pre-commit checklist
${config.hasTesting ? '- `.agent/skills/test-driven-execution/SKILL.md` — TDD workflow\n' : ''}\
---

## References

- Architecture: @ARCHITECTURE.md
- Progress: @PROGRESS.md
- PRD: @PRD.md
${config.databases.length > 0 ? '- DB Schema: @DATABASE_SCHEMA.md\n' : ''}\
${config.hasAuth || config.hasPayments ? '- Security: @SECURITY.md\n' : ''}\
`;
}
