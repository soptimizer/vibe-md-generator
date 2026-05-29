// src/templates/contextual/ANTIGRAVITY_SKILLS.ts
import type { ProjectConfig } from '../../types';
import { getTestCmd, getLintCmd, getDevCmd } from '../../logic/commands';

export function ANTIGRAVITY_SKILL_REVIEW_md(config: ProjectConfig): string {
  return `# Skill: Code Review
// turbo

## When to Run
Before every commit, or when asked to review a change.

## Checklist

### Correctness
- [ ] Logic matches the requirements in PRD.md or the task description
- [ ] Edge cases are handled (empty input, null, network failure)
- [ ] No hardcoded values that should come from config or env

### Code Quality
- [ ] No unused imports or dead code
- [ ] Files over 300 lines are split into focused modules
- [ ] Functions have a single responsibility and are under 40 lines

### Security
- [ ] No secrets, credentials, or tokens committed to source
- [ ] User input is validated and sanitised before use
${config.hasAuth ? '- [ ] Auth-protected routes remain protected\n' : ''}\
${config.hasPayments ? '- [ ] Payment logic has not been altered without explicit approval\n' : ''}\
- [ ] Parameterised queries only — no string-interpolated SQL

### Tests
${config.hasTesting
  ? `- [ ] New business logic has test coverage\n- [ ] \`${getTestCmd(config)}\` passes with no failures\n- [ ] No tests have been deleted to make the suite pass`
  : '- [ ] (No test suite configured — consider adding tests for critical paths)'}

### Lint & Build
- [ ] \`${getLintCmd(config)}\` passes with no errors
- [ ] \`${getDevCmd(config)}\` starts without errors in dev mode

### Documentation
- [ ] PROGRESS.md updated if a feature is completed or blocked
- [ ] Comments added only where the WHY is non-obvious

## Output
Report: ✅ Ready to commit | ⚠️ Minor issues (list them) | ❌ Blocking issues (list them)
`;
}

export function ANTIGRAVITY_SKILL_TEST_md(config: ProjectConfig): string {
  return `# Skill: Test-Driven Execution
// turbo

## When to Run
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
- Remove duplication and improve naming
- Run \`${getTestCmd(config)}\` again — must still pass
- Run \`${getLintCmd(config)}\` — no new lint errors

### 4. Commit and Repeat
- Commit with message: \`test: <behaviour>\` followed by \`feat: <implementation>\`
- Move to the next behaviour

## Rules
- Never skip the failing-test step — it validates the test is real
- One assertion per test where possible
- Test names must describe behaviour, not implementation:
  - ✅ \`"returns 404 when user does not exist"\`
  - ❌ \`"test getUserById error branch"\`
${config.backend !== 'none' && config.databases.length > 0
  ? `- Integration tests must use a real ${config.databases[0]} instance, not mocks\n`
  : ''}
## Output
After completing a cycle: mark the test file reviewed and commit.
`;
}
