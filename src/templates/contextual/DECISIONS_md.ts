// src/templates/contextual/DECISIONS_md.ts
import type { ProjectConfig } from '../../types';

export default function DECISIONS_md(config: ProjectConfig): string {
  const today = new Date().toISOString().slice(0, 10);

  const entries: string[] = [];

  if (config.frontend !== 'none') {
    entries.push(`### Frontend Framework — ${config.frontend}
- **Date:** ${today}
- **Status:** Decided
- **Decision:** Use ${config.frontend} as the UI layer
- **Reason:** _fill in_
- **Consequences:** _fill in_`);
  }

  if (config.backend !== 'none') {
    entries.push(`### Backend Runtime — ${config.backend}
- **Date:** ${today}
- **Status:** Decided
- **Decision:** Use ${config.backend} for the server layer
- **Reason:** _fill in_
- **Consequences:** _fill in_`);
  }

  if (config.databases.length > 0) {
    entries.push(`### Databases — ${config.databases.join(', ')}
- **Date:** ${today}
- **Status:** Decided
- **Decision:** Use ${config.databases.join(', ')} as the data store(s)
- **Reason:** _fill in_
- **Consequences:** _fill in_`);
  }

  if (config.queues.length > 0) {
    entries.push(`### Queues — ${config.queues.join(', ')}
- **Date:** ${today}
- **Status:** Decided
- **Decision:** Use ${config.queues.join(', ')} for message brokering
- **Reason:** _fill in_
- **Consequences:** _fill in_`);
  }

  if (config.frontend !== 'none' || config.backend === 'nodejs') {
    entries.push(`### Package Manager — ${config.packageManager}
- **Date:** ${today}
- **Status:** Decided
- **Decision:** Use ${config.packageManager} for dependency management
- **Reason:** _fill in_
- **Consequences:** _fill in_`);
  }

  if (config.hasAuth) {
    entries.push(`### Auth Strategy
- **Date:** ${today}
- **Status:** Decided
- **Decision:** _fill in_ (e.g. JWT, session-based, OAuth provider)
- **Reason:** _fill in_
- **Consequences:** _fill in_`);
  }

  if (config.hasPayments) {
    entries.push(`### Payment Provider
- **Date:** ${today}
- **Status:** Decided
- **Decision:** _fill in_ (e.g. Stripe, Paddle, LemonSqueezy)
- **Reason:** _fill in_
- **Consequences:** _fill in_`);
  }

  return `# Architectural Decisions — ${config.name}

> Add a new entry here before implementing any significant architectural change.
> AI should read this file before suggesting structural refactors.

## How to Use

For every significant architectural choice, add a new entry to **Decision Log** using the format below.
Keep entries brief — one decision per block. Update **Status** as the project evolves:
- **Decided** — actively in use
- **Revisiting** — under evaluation for change
- **Superseded** — replaced; reference the new entry

## Decision Log

${entries.join('\n\n')}
`;
}
