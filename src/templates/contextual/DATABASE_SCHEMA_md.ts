// src/templates/contextual/DATABASE_SCHEMA_md.ts
import type { ProjectConfig } from '../../types';

export default function DATABASE_SCHEMA_md(config: ProjectConfig): string {
  const isSQL = config.databases.some(db => ['postgresql', 'mysql', 'sqlite', 'clickhouse'].includes(db));

  return `# Database Schema — ${config.name}

## Engines: ${config.databases.join(', ')}

${isSQL ? `## Tables

### users
| Column | Type | Notes |
|--------|------|-------|
| id | UUID / SERIAL | Primary key |
| created_at | TIMESTAMP | Auto |
| updated_at | TIMESTAMP | Auto |
| _add columns here_ | | |

_Add more tables below as needed_

## Indexes
\`\`\`sql
-- Add index definitions here
CREATE INDEX idx_users_email ON users(email);
\`\`\`

## Migrations
- Use migration files, never alter schema manually in production
- Name format: \`YYYY-MM-DD_description.sql\`
` : `## Collections

### users
\`\`\`json
{
  "_id": "ObjectId",
  "createdAt": "Date",
  "updatedAt": "Date"
}
\`\`\`

_Add more collections below as needed_
`}\
## Rules
- Always read this file before writing any database query
- Update when schema changes
- Include indexes for all foreign keys and frequently queried fields
`;
}
