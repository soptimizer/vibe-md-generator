// src/templates/contextual/PRD_md.ts
import type { ProjectConfig } from '../../types';

function getUserStories(config: ProjectConfig): string {
  const stories: string[] = [];

  if (config.type === 'webapp' || config.type === 'mobile') {
    stories.push('- As a user, I can navigate the app without errors or dead ends');
  }
  if (config.type === 'api') {
    stories.push('- As a developer, I can authenticate and call all endpoints from the docs');
  }
  if (config.type === 'cli') {
    stories.push('- As a developer, I can run the CLI with --help and see all commands');
  }
  if (config.type === 'library') {
    stories.push('- As a developer, I can install the package and use the public API');
  }
  if (config.hasAuth) {
    stories.push('- As a user, I can register, log in, and log out securely');
    stories.push('- As a user, I can reset my password via email');
  }
  if (config.hasPayments) {
    stories.push('- As a user, I can subscribe, upgrade, and cancel a plan');
    stories.push('- As a user, I receive a receipt after every successful payment');
  }
  if (config.databases.length > 0) {
    stories.push('- As a user, my data persists across sessions');
  }
  if (config.hasDeployment) {
    stories.push('- As an operator, I can deploy a new version with a single command');
  }

  return stories.length > 0 ? stories.join('\n') : '- As a user, I can accomplish the core workflow end-to-end';
}

function getOutOfScope(config: ProjectConfig): string {
  const oos: string[] = [];
  if (!config.hasAuth) oos.push('- User authentication / accounts');
  if (!config.hasPayments) oos.push('- Payment processing');
  if (!config.hasTesting) oos.push('- Automated test suite');
  if (!config.hasDeployment) oos.push('- CI/CD pipeline');
  return oos.length > 0 ? oos.join('\n') : '- Nothing explicitly excluded yet';
}

function getNonFunctionalRequirements(config: ProjectConfig): string {
  const perfRows: string[] = [];
  if (config.frontend !== 'none') {
    perfRows.push('| Initial page load | < 3 s on 4G | Lighthouse / WebPageTest |');
    perfRows.push('| Time to interactive | < 5 s on 4G | Lighthouse TTI |');
    perfRows.push('| JS bundle size | < 300 KB gzipped | Vite build output |');
  }
  if (config.backend !== 'none') {
    perfRows.push('| API p95 GET latency | < 200 ms | APM / k6 load test |');
    perfRows.push('| API p95 POST latency | < 500 ms | APM / k6 load test |');
  }
  perfRows.push('| CI build time | < 5 min | CI pipeline logs |');

  const reliRows: string[] = [];
  if (config.scale === 'enterprise') {
    reliRows.push('| Uptime SLA | ≥ 99.9 % (< 8.7 h/year downtime) | Uptime monitor (e.g. Better Uptime) |');
    reliRows.push('| Load capacity | ≥ 1 000 concurrent users | k6 / Locust stress test |');
    reliRows.push('| Recovery time (RTO) | < 1 hour | Incident runbook drill |');
  } else {
    reliRows.push('| Uptime | ≥ 99 % per month | Uptime monitor |');
  }
  reliRows.push('| Unhandled error rate | < 0.1 % of sessions | Sentry / error tracker |');
  reliRows.push('| Mean time to recovery | < 4 h | Post-incident review |');
  if (config.databases.length > 0) {
    reliRows.push('| DB query timeout | 5 s hard limit | ORM / driver config |');
    reliRows.push('| Connection pool size | max 20 connections | Pool config + monitoring |');
  }

  const secRows: string[] = [
    '| Transport security | HTTPS everywhere; HSTS enabled | SSL Labs scan |',
    '| Dependency CVEs | Zero high/critical open CVEs | `npm audit` / Dependabot |',
  ];
  if (config.hasAuth) {
    secRows.push('| Session timeout | Inactive sessions expire after 30 min | Auth config + e2e test |');
    secRows.push('| Brute-force protection | Account locked after 5 failed attempts / 10 min | Rate-limiter middleware |');
  }
  if (config.hasPayments) {
    secRows.push('| PCI compliance | No raw card data stored; tokenise via provider | Payment provider audit |');
  }

  const testingSection = config.hasTesting
    ? `\n\n### Test Coverage\n| Metric | Target | Measurement |\n|--------|--------|-------------|\n| Unit test coverage | ≥ 80 % | vitest / jest coverage report |\n| Integration test coverage | ≥ 60 % | Coverage report |\n| CI gate | All tests must pass on every PR | CI pipeline |`
    : '';

  return `## Non-Functional Requirements

### Performance
| Metric | Target | Measurement |
|--------|--------|-------------|
${perfRows.join('\n')}

### Reliability
| Metric | Target | Measurement |
|--------|--------|-------------|
${reliRows.join('\n')}

### Security
| Metric | Target | Measurement |
|--------|--------|-------------|
${secRows.join('\n')}${testingSection}`;
}

function getAcceptanceCriteria(config: ProjectConfig): string {
  const criteria: string[] = [
    `- **Happy Path:** Given the app is running, When a user completes the core workflow of ${config.name}, Then the expected result is achieved without errors`,
    `- **Error Scenario:** Given an unexpected input or network failure, When the user interacts with ${config.name}, Then a clear error message is shown and no data is lost`,
  ];

  if (config.hasAuth) {
    criteria.push(
      `- **Login:** Given a registered user, When they submit valid credentials, Then they are authenticated and redirected to the dashboard`,
      `- **Logout:** Given an authenticated user, When they click logout, Then their session is terminated and they are redirected to the login page`,
      `- **Unauthorized Access:** Given an unauthenticated user, When they navigate to a protected route, Then they are redirected to the login page with a 401 response`,
    );
  }

  if (config.hasPayments) {
    criteria.push(
      `- **Successful Payment:** Given a user with valid payment details, When they complete checkout, Then the transaction is confirmed and a receipt is sent`,
      `- **Failed Payment:** Given a user with a declined card, When they attempt checkout, Then the payment is rejected with a clear error message and no charge is made`,
      `- **Refund:** Given a completed transaction, When a refund is requested, Then the amount is returned within the provider's SLA and the user is notified`,
    );
  }

  if (config.type === 'api') {
    criteria.push(
      `- **Rate Limiting:** Given a client exceeding the allowed request rate, When they send additional requests, Then the API returns 429 Too Many Requests with a Retry-After header`,
      `- **Invalid Input:** Given a malformed or missing required field, When the client sends the request, Then the API returns 400 Bad Request with a descriptive validation error`,
      `- **Missing Auth Header:** Given a request without a valid Authorization header, When the client calls a protected endpoint, Then the API returns 401 Unauthorized`,
    );
  }

  if (config.hasTesting) {
    criteria.push(
      `- **Test Coverage:** Given all acceptance criteria above, When the test suite runs, Then every scenario has a corresponding automated test case and all tests pass`,
    );
  }

  return criteria.join('\n');
}

export default function PRD_md(config: ProjectConfig): string {
  return `# PRD — ${config.name}

## Overview
${config.description}

**Type:** ${config.type} | **Scale:** ${config.scale} | **AI tool:** ${config.aiTool}

## Goals
1. Ship a working ${config.type} that solves the core problem described above
2. Keep the codebase maintainable for ${config.scale === 'solo' ? 'a solo developer' : 'the team'}
3. Deliver a reliable user experience with clear error handling

## User Stories
${getUserStories(config)}

## Definition of Done
- [ ] Core user stories pass manual testing
- [ ] No unhandled runtime errors in the happy path
- [ ] README explains how to run the project locally
${config.hasTesting ? '- [ ] Test suite passes with no failures\n' : ''}\
${config.hasDeployment ? '- [ ] App is accessible at the production URL\n' : ''}\

## Success Metrics
- Core user stories pass manual testing without guidance
- Onboarding: a new ${config.scale === 'solo' ? 'developer' : 'team member'} can run the project locally within 15 minutes
${config.hasDeployment ? '- Deploy completes without manual intervention\n' : ''}\
${config.hasTesting ? '- Test suite stays green on every merge\n' : ''}\

${getNonFunctionalRequirements(config)}

## Constraints
- No external dependencies beyond what is listed in the stack
${config.scale === 'solo' ? '- Solo maintainer: avoid over-engineering, keep it simple\n' : ''}\
${config.hasAuth ? '- Auth must follow OWASP guidelines\n' : ''}\
${config.hasPayments ? '- PCI-DSS: never store raw card data\n' : ''}\

## Out of Scope (v1)
${getOutOfScope(config)}

## Acceptance Criteria
${getAcceptanceCriteria(config)}

---
_Update acceptance criteria as features are defined. Keep this file under 80 lines._
`;
}
