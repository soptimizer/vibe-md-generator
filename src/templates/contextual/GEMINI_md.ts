// src/templates/contextual/GEMINI_md.ts
import type { ProjectConfig } from '../../types';
import { getDevCmd, getBuildCmd, getTestCmd, getLintCmd, getDepsLabel } from '../../logic/commands';
import { hasSkill, hasAnySkill } from '../../logic/skillsHelper';

function getAIRole(config: ProjectConfig): string {
  const roleMap: Record<string, string> = {
    'assistant': 'Make suggestions and wait for approval before implementing.',
    'pair-programmer': 'Implement directly. Ask only when requirements are ambiguous.',
    'reviewer-only': 'Review and comment only — do not write or modify code unless explicitly asked.',
  };
  return roleMap[config.aiRole];
}

function getTokenMode(config: ProjectConfig): string {
  if (config.tokenEfficiency === 'minimal') {
    return '- Skip explanations. Output code only. No preamble, no summary.';
  }
  if (config.tokenEfficiency === 'comprehensive') {
    return '- Explain your reasoning. Include trade-offs and alternatives considered.';
  }
  return '- Brief reasoning when non-obvious. Code-first, explanations second.';
}

function getBoundaries(config: ProjectConfig): string {
  const always: string[] = [
    '- Read the file before editing it',
    '- Keep secrets out of source code',
    '- Follow the layer separation defined in ARCHITECTURE.md',
  ];
  const askFirst: string[] = [];
  const never: string[] = [
    '- Hardcode API keys, tokens, or credentials',
  ];

  if (config.hasAuth || config.hasPayments) {
    const paths = [
      ...(config.hasAuth ? ['auth'] : []),
      ...(config.hasPayments ? ['payment'] : []),
    ];
    askFirst.push(`- Modify ${paths.join(' or ')} logic without explicit approval`);
  }

  if (config.backend !== 'none') {
    askFirst.push('- Run or generate schema migrations');
    askFirst.push('- Add or rename environment variables');
  }

  if (config.scale !== 'solo') {
    never.push('- Push directly to main/master');
  }

  if (config.hasTesting) {
    always.push('- Add tests for any new logic');
    never.push('- Delete existing tests to make the suite pass');
  }

  return `## Boundaries

**Always do**
${always.join('\n')}

**Ask first**
${askFirst.length ? askFirst.join('\n') : '- (nothing project-specific — use judgement)'}

**Never do**
${never.join('\n')}`;
}

function getSkillRules(config: ProjectConfig): string {
  const rules: string[] = [];

  if (hasSkill(config, 'auth-system')) {
    rules.push('- **Auth**: Never store tokens in localStorage — use httpOnly cookies or in-memory only');
    rules.push('- **Auth**: Session invalidation must be server-side');
  }
  if (hasSkill(config, 'caching-system')) {
    rules.push('- **Caching**: Invalidate explicitly — never assume stale data is acceptable');
    rules.push('- **Caching**: Cache keys must include all parameters that affect the result');
  }
  if (hasSkill(config, 'logging-monitoring')) {
    rules.push('- **Observability**: Never log PII, tokens, card numbers, or passwords');
    rules.push('- **Observability**: All errors must be captured with context (request ID, user ID)');
  }
  if (hasSkill(config, 'accessibility')) {
    rules.push('- **A11y**: Every interactive element must have a descriptive ARIA label or visible text');
    rules.push('- **A11y**: Color contrast must meet WCAG AA (4.5:1 normal text, 3:1 large)');
  }
  if (hasSkill(config, 'queue-system')) {
    rules.push('- **Queues**: All consumers must be idempotent — messages may be delivered more than once');
    rules.push('- **Queues**: Failed messages go to a dead-letter queue; never silently drop them');
  }
  if (hasAnySkill(config, ['rag-systems', 'machine-learning'])) {
    rules.push('- **AI/ML**: Model outputs must be validated before being shown to users or stored');
    rules.push('- **AI/ML**: Prompt templates must be versioned alongside code');
  }

  if (rules.length === 0) return '';
  return `## Skill-Specific Rules\n${rules.join('\n')}`;
}

function getReferences(config: ProjectConfig): string {
  const refs = ['- Architecture: @ARCHITECTURE.md', '- Progress: @PROGRESS.md', '- Tasks: @AGENTS.md'];
  if (config.databases.length > 0) refs.push('- DB Schema: @DATABASE_SCHEMA.md');
  if (config.hasAuth || config.hasPayments) refs.push('- Security rules: @SECURITY.md');
  if (config.type === 'api') refs.push('- API spec: @API_SPEC.md');
  if (config.frontend !== 'none') refs.push('- Design system: @DESIGN_SYSTEM.md');
  return refs.join('\n');
}

export default function GEMINI_md(config: ProjectConfig): string {
  const buildCmd = getBuildCmd(config);
  const skillRules = getSkillRules(config);
  return `# ${config.name}

${config.description}

## Gemini Role
${getAIRole(config)}

## Token Mode
${getTokenMode(config)}

## Stack
- Frontend: ${config.frontend === 'none' ? 'N/A' : config.frontend}
- Backend: ${config.backend === 'none' ? 'N/A' : config.backend}
- Databases: ${config.databases.length > 0 ? config.databases.join(', ') : 'N/A'}
- Queues: ${config.queues.length > 0 ? config.queues.join(', ') : 'N/A'}
- Package manager: ${getDepsLabel(config)}

## Commands
- Dev: \`${getDevCmd(config)}\`
${buildCmd ? `- Build: \`${buildCmd}\`\n` : ''}\
- Lint: \`${getLintCmd(config)}\`${config.hasTesting ? `\n- Test: \`${getTestCmd(config)}\`` : ''}

## Agentic Skills
- Review skill: \`.agent/skills/review.md\` — run before every commit
${config.hasTesting ? '- Test-driven skill: `.agent/skills/test.md` — use when implementing new features\n' : ''}\
- Setup workflow: \`.agent/workflows/setup.md\` — run on first clone
${config.hasDeployment ? '- Deploy workflow: `.agent/workflows/deploy.md` — run when shipping\n' : ''}\
${skillRules ? `\n${skillRules}\n` : ''}
${getBoundaries(config)}

## References
${getReferences(config)}
`;
}
