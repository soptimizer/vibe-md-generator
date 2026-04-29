// src/templates/contextual/TASKS_md.ts
import type { ProjectConfig } from '../../types';

function getEpics(config: ProjectConfig): string {
  const epics: { name: string; features: string[] }[] = [];

  epics.push({
    name: 'Project Foundation',
    features: [
      '[ ] Repo setup: folder structure, dependencies, config files',
      '[ ] Environment variables and local dev environment',
      config.hasDeployment ? '[ ] CI/CD pipeline baseline' : '',
    ].filter(Boolean),
  });

  if (config.databases.length > 0) {
    epics.push({
      name: 'Data Layer',
      features: [
        `[ ] Define ${config.databases.join(' + ')} schema (see DATABASE_SCHEMA.md)`,
        '[ ] Run initial migration',
        '[ ] Seed with minimal test data',
      ],
    });
  }

  if (config.hasAuth) {
    epics.push({
      name: 'Authentication',
      features: [
        '[ ] Register endpoint / page',
        '[ ] Login endpoint / page',
        '[ ] Session management',
        '[ ] Protected route guards',
      ],
    });
  }

  epics.push({
    name: 'Core Feature',
    features: [
      '[ ] Happy-path implementation (DB → API → UI)',
      '[ ] Error states and input validation',
      '[ ] Loading states',
    ],
  });

  if (config.hasPayments) {
    epics.push({
      name: 'Payments',
      features: [
        '[ ] Payment provider setup',
        '[ ] Checkout flow',
        '[ ] Webhook handler',
        '[ ] Success / failure states',
      ],
    });
  }

  if (config.hasTesting) {
    epics.push({
      name: 'Quality',
      features: [
        '[ ] Unit tests for business logic',
        '[ ] Integration tests for API routes',
        config.frontend !== 'none' ? '[ ] Component tests for critical UI flows' : '',
      ].filter(Boolean),
    });
  }

  epics.push({
    name: 'Polish & Ship',
    features: [
      '[ ] Error boundaries and fallback UIs',
      '[ ] Performance pass',
      '[ ] Update README.md and PROGRESS.md',
      config.hasDeployment ? '[ ] Production deployment smoke tests' : '',
    ].filter(Boolean),
  });

  return epics
    .map(
      (e) =>
        `### Epic: ${e.name}\n${e.features.map((f) => `- ${f}`).join('\n')}`
    )
    .join('\n\n');
}

export default function TASKS_md(config: ProjectConfig): string {
  return `# Tasks — ${config.name}

> Structure: **Epic → Feature → Task**
> Move items between sections as work progresses. Keep total backlog under 20 items — break epics into sprints if needed.

## In Progress
_Nothing started yet — pick from Backlog below_

## Backlog

${getEpics(config)}

## Done
_Nothing shipped yet_

---
_One task per line. Mark done with [x]. After each Epic ships, update PROGRESS.md._
`;
}
