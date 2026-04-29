// src/templates/contextual/TESTING_STRATEGY_md.ts
import type { ProjectConfig } from '../../types';
import { getTestCmd, getTestFilePattern } from '../../logic/commands';

export default function TESTING_STRATEGY_md(config: ProjectConfig): string {
  const testCmd = getTestCmd(config);
  const testFilePattern = getTestFilePattern(config);

  return `# Testing Strategy — ${config.name}

## Run Tests
\`\`\`bash
${testCmd}
\`\`\`

## Test Types

### Unit Tests
- Location: \`tests/unit/\` or ${testFilePattern}
- Scope: pure functions, utilities, business logic
- Rule: one test file per source file

${config.backend !== 'none' ? `### Integration Tests
- Location: \`tests/integration/\`
- Scope: API routes, database operations
- Use test database — never run against production

` : ''}\
${config.frontend !== 'none' ? `### Component Tests
- Location: co-located \`*.test.tsx\`
- Scope: UI components in isolation
- Test behavior, not implementation

` : ''}\
## Conventions
- Describe blocks map to functions/components
- Test names: "should [expected behavior] when [condition]"
- One assertion focus per test
- Mock external services — never call real APIs in tests
${config.hasAuth ? '- Auth tests: cover both authenticated and unauthenticated states\n' : ''}\
${config.hasPayments ? '- Payment tests: use provider test keys only, never real cards\n' : ''}\

## Coverage Goal
- Minimum: 60% for solo projects
- Minimum: 80% for team/enterprise

## AI-Generated Code Review Gates

Before merging AI-generated code, verify all applicable gates:

**Every project:**
- [ ] No hardcoded strings that should be constants or env vars
- [ ] No TODO comments left in production code
- [ ] All functions have a single responsibility
- [ ] Error cases are handled, not just happy path
${config.backend !== 'none' ? `
**Backend:**
- [ ] All inputs validated before processing
- [ ] No raw SQL string concatenation
- [ ] Authentication checked before business logic
` : ''}\
${config.frontend !== 'none' ? `
**Frontend:**
- [ ] No direct DOM manipulation outside designated utilities
- [ ] Loading and error states handled in all async components
- [ ] No inline styles — utility classes or CSS modules only
` : ''}\
${config.hasTesting ? `
**Tests:**
- [ ] New feature has at least one happy-path test
- [ ] Error scenarios have corresponding test cases
- [ ] Mock usage justified (real implementations preferred)
` : ''}\
${config.hasAuth ? `
**Auth:**
- [ ] Protected routes actually protected (not just hidden)
- [ ] Token expiry handled gracefully
` : ''}\
`;
}
