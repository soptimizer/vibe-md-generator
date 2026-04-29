import type { ProjectConfig } from '../../types';

interface ContextRow {
  task: string;
  readFirst: string[];
  optional: string[];
}

export default function CONTEXT_MAP_md(config: ProjectConfig): string {
  const hasBackend = config.type === 'api' || config.backend !== 'none';
  const hasDatabase = config.databases.length > 0;
  const claudeOrAgents = config.aiTool === 'codex' ? 'AGENTS.md' : 'CLAUDE.md';

  const rows: ContextRow[] = [
    {
      task: 'New feature',
      readFirst: ['PRD.md', 'ARCHITECTURE.md'],
      optional: ['TASKS.md'],
    },
    {
      task: 'Bug fix',
      readFirst: [claudeOrAgents, 'PROGRESS.md'],
      optional: ['ARCHITECTURE.md'],
    },
    ...(config.frontend !== 'none'
      ? [
          {
            task: 'UI component',
            readFirst: ['DESIGN_SYSTEM.md', 'ARCHITECTURE.md'],
            optional: ['PRD.md'],
          },
        ]
      : []),
    ...(hasBackend
      ? [
          {
            task: 'API endpoint',
            readFirst: ['API_SPEC.md', 'ARCHITECTURE.md'],
            optional: ['SECURITY.md'],
          },
        ]
      : []),
    ...(hasDatabase
      ? [
          {
            task: 'DB schema change',
            readFirst: ['DATABASE_SCHEMA.md', 'ARCHITECTURE.md'],
            optional: ['SECURITY.md'],
          },
        ]
      : []),
    ...(config.hasAuth
      ? [
          {
            task: 'Auth change',
            readFirst: ['SECURITY.md', claudeOrAgents],
            optional: ['API_SPEC.md'],
          },
        ]
      : []),
    ...(config.hasPayments
      ? [
          {
            task: 'Payment change',
            readFirst: ['SECURITY.md', claudeOrAgents],
            optional: ['API_SPEC.md'],
          },
        ]
      : []),
    {
      task: 'Refactor',
      readFirst: ['ARCHITECTURE.md', claudeOrAgents],
      optional: ['DECISIONS.md'],
    },
    {
      task: 'Code review',
      readFirst: [claudeOrAgents],
      optional: config.hasTesting ? ['TESTING_STRATEGY.md'] : [],
    },
  ];

  const header = `# Context Map — ${config.name}

| Task | Read First | Optional |
|------|------------|----------|`;

  const tableRows = rows
    .map((r) => {
      const readFirst = r.readFirst.join(', ');
      const optional = r.optional.length > 0 ? r.optional.join(', ') : '—';
      return `| ${r.task} | ${readFirst} | ${optional} |`;
    })
    .join('\n');

  return `${header}
${tableRows}

> Before starting any task, read the files in the "Read First" column.
> This prevents context gaps that lead to inconsistent implementations.
`;
}
