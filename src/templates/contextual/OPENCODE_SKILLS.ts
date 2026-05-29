import type { ProjectConfig } from '../../types';
import { getDevCmd, getTestCmd, getLintCmd } from '../../logic/commands';

function stackSummary(config: ProjectConfig): string {
  const parts: string[] = [];
  if (config.frontend !== 'none') parts.push(`Frontend: ${config.frontend}`);
  if (config.backend !== 'none') parts.push(`Backend: ${config.backend}`);
  if (config.databases.length > 0) parts.push(`DB: ${config.databases.join(', ')}`);
  return parts.length > 0 ? parts.join(' | ') : 'Stack not specified';
}

export function OPENCODE_SKILL_CONTEXT_md(config: ProjectConfig): string {
  return `# Skill: Project Context Primer

## Trigger
Run this skill at the start of every new session, before any other task.

## Steps

1. Read \`ARCHITECTURE.md\` — understand component tree, data flow, and module boundaries
2. Read \`PROGRESS.md\` — identify what is done, in progress, and blocked
3. Read \`PRD.md\` — understand product goals and user requirements
4. Read \`AGENTS.md\` — refresh session rules and persona assignments
5. Scan recent git log (\`git log --oneline -10\`) — understand what changed recently
6. Report a one-paragraph summary of current project state

## Project Snapshot (at generation time)

- **Name:** ${config.name}
- **Type:** ${config.type}
- **Scale:** ${config.scale}
- **Stack:** ${stackSummary(config)}
- **AI Role:** ${config.aiRole}
${config.hasAuth ? '- Auth: yes\n' : ''}\
${config.hasPayments ? '- Payments: yes\n' : ''}\
${config.hasTesting ? '- Testing: yes\n' : ''}\
${config.hasDeployment ? '- Deployment: yes\n' : ''}\

## Output
After completing the steps, briefly state:
- Current sprint focus (from PROGRESS.md)
- Any blockers
- Which persona(s) are relevant for today's work
`;
}

export function OPENCODE_SKILL_REVIEW_md(config: ProjectConfig): string {
  return `# Skill: Code Review

## Trigger
Run this skill before every commit or when asked to review a change.

## Checklist

### Correctness
- [ ] Logic matches the requirements in PRD.md or the task description
- [ ] Edge cases are handled (empty input, null, network failure)
- [ ] No hardcoded values that should come from config or environment

### Code Quality
- [ ] No \`any\` types — all TypeScript types are explicit
- [ ] No unused imports or dead code
- [ ] Files over 150–300 lines are split into modules
- [ ] Functions have a single responsibility

### Security
- [ ] No secrets, credentials, or tokens in code
- [ ] User input is validated and sanitised
${config.hasAuth ? '- [ ] Auth-protected routes remain protected\n' : ''}\
${config.hasPayments ? '- [ ] Payment logic has not been altered without approval\n' : ''}\
- [ ] No SQL string interpolation — parameterised queries only

### Tests
${config.hasTesting ? `- [ ] New business logic has test coverage
- [ ] \`${getTestCmd(config)}\` passes with no failures
- [ ] No tests have been deleted to make the suite pass` : '- [ ] (No test suite — consider adding tests for critical paths)'}

### Lint & Build
- [ ] \`${getLintCmd(config)}\` passes with no errors
- [ ] \`${getDevCmd(config)}\` starts without errors in dev

### Documentation
- [ ] PROGRESS.md updated if a feature is completed or blocked
- [ ] Inline comments added only where the WHY is non-obvious

## Output
Report: ✅ Ready to commit | ⚠️ Minor issues (list them) | ❌ Blocking issues (list them)
`;
}

export function OPENCODE_SKILL_TESTDRIVEN_md(config: ProjectConfig): string {
  return `# Skill: Test-Driven Execution

## Trigger
Use this skill when implementing a new feature or fixing a non-trivial bug.

## TDD Cycle

### 1. Write a Failing Test
- Identify the smallest observable behaviour to implement
- Write a test that asserts the expected outcome
- Run \`${getTestCmd(config)}\` — confirm it fails for the right reason (not a syntax error)

### 2. Write Minimal Implementation
- Write only enough code to make the failing test pass
- Do not add features not required by the current test
- Run \`${getTestCmd(config)}\` — confirm it passes

### 3. Refactor
- Clean up duplication and improve naming
- Run \`${getTestCmd(config)}\` again — must still pass
- Run \`${getLintCmd(config)}\` — no new lint errors

### 4. Repeat
- Move to the next behaviour
- Commit when a meaningful unit of behaviour is green

## Rules
- Never skip the failing-test step — it validates the test is real
- One assertion per test where possible
- Test names must describe behaviour, not implementation:
  - ✅ \`"returns 404 when user does not exist"\`
  - ❌ \`"test getUserById error branch"\`
${config.backend !== 'none' ? `- Integration tests must use a real ${config.databases.length > 0 ? config.databases[0] : 'database'} instance, not mocks\n` : ''}\

## Output
After completing a cycle: commit with message \`test: <behaviour>\` + \`feat: <implementation>\`
`;
}
