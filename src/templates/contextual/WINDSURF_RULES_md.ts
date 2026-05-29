// src/templates/contextual/WINDSURF_RULES_md.ts
import type { ProjectConfig } from '../../types';
import { getDevCmd, getTestCmd, getLintCmd } from '../../logic/commands';
import { hasSkill } from '../../logic/skillsHelper';

function getStackRules(config: ProjectConfig): string {
  const rules: string[] = [];
  if (config.frontend !== 'none') {
    rules.push(`- Frontend is **${config.frontend}** — match existing component patterns`);
  }
  if (config.backend !== 'none') {
    rules.push(`- Backend is **${config.backend}** — follow existing folder structure`);
  }
  if (config.databases.length > 0) {
    rules.push(`- Databases: **${config.databases.join(', ')}** — always use ORM/query builder, no raw queries when avoidable`);
  }
  if (config.queues.length > 0) {
    rules.push(`- Queues: **${config.queues.join(', ')}** — consumers must be idempotent`);
  }
  return rules.length > 0 ? rules.join('\n') : '- Follow the stack defined in TECH_STACK.md';
}

function getDeprecatedPatterns(config: ProjectConfig): string {
  const entries: string[] = [];

  if (config.frontend === 'react' || config.frontend === 'nextjs') {
    entries.push('❌ Class components → ✅ Function components + hooks');
    entries.push('❌ useEffect for derived state → ✅ useMemo');
    entries.push('❌ Prop drilling 3+ levels → ✅ Context or store');
  }
  if (config.frontend === 'vue') {
    entries.push('❌ Options API → ✅ Composition API + <script setup>');
    entries.push('❌ Untyped $emit → ✅ defineEmits<{...}>()');
  }
  if (config.backend === 'nodejs') {
    entries.push('❌ Callbacks → ✅ async/await');
    entries.push('❌ String SQL concatenation → ✅ Parameterized queries');
  }
  if (config.backend === 'python') {
    entries.push('❌ Mutable default arguments → ✅ None + body assignment');
    entries.push('❌ bare except → ✅ except SpecificError');
  }
  if (config.backend === 'go') {
    entries.push('❌ panic for business errors → ✅ error return values');
    entries.push('❌ Global state → ✅ Dependency injection');
  }

  if (entries.length === 0) return '';
  return `\n## Deprecated Patterns\n\n${entries.join('\n')}\n`;
}

function getSkillConstraints(config: ProjectConfig): string {
  const rules: string[] = [];

  if (hasSkill(config, 'auth-system')) {
    rules.push('- Never store auth tokens in localStorage — httpOnly cookies only');
  }
  if (hasSkill(config, 'caching-system')) {
    rules.push('- Cache invalidation must be explicit; never assume stale data is acceptable');
  }
  if (hasSkill(config, 'accessibility')) {
    rules.push('- ARIA labels required on all interactive elements; WCAG AA contrast minimum');
  }
  if (hasSkill(config, 'logging-monitoring')) {
    rules.push('- Never log PII, tokens, or credentials');
  }

  if (rules.length === 0) return '';
  return `\n## Skill-Specific Constraints\n\n${rules.join('\n')}\n`;
}

export default function WINDSURF_RULES_md(config: ProjectConfig): string {
  return `# Windsurf Rules — ${config.name}

## Project Context
${config.description}

**Stack**
${getStackRules(config)}

## Commands
- Dev: \`${getDevCmd(config)}\`
- Lint: \`${getLintCmd(config)}\`${config.hasTesting ? `\n- Test: \`${getTestCmd(config)}\`` : ''}

## Core Rules
- Read existing files before editing them
- Check ARCHITECTURE.md for correct folder placement before creating new files
- Edit existing files before creating new ones
- No hardcoded secrets, tokens, or credentials
- Files over 300 lines must be split into modules
${config.scale !== 'solo' ? '- No direct pushes to main/master — always use PRs\n' : ''}\
${config.hasTesting ? '- Tests required for all new business logic\n' : ''}\
${config.hasAuth ? '- Ask before modifying auth paths (`src/auth/**`)\n' : ''}\
${config.hasPayments ? '- Ask before modifying payment paths (`src/payments/**`)\n' : ''}\
${getSkillConstraints(config)}
## Off-Limits
- \`.env\` — never read or modify
- Build output directories
- Dependency directories (node_modules, vendor, etc.)
${getDeprecatedPatterns(config)}
## References
- Architecture: @ARCHITECTURE.md
- Progress: @PROGRESS.md
${config.databases.length > 0 ? '- DB Schema: @DATABASE_SCHEMA.md\n' : ''}\
${config.hasAuth || config.hasPayments ? '- Security: @SECURITY.md\n' : ''}\
`;
}
