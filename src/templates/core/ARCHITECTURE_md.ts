// src/templates/core/ARCHITECTURE_md.ts
import type { ProjectConfig } from '../../types';
import { getDepsLabel } from '../../logic/commands';
import { hasSkill, hasAnySkill } from '../../logic/skillsHelper';

function buildProjectTree(config: ProjectConfig): string {
  const root = `${config.name.toLowerCase().replace(/\s+/g, '-')}/`;
  const lines: string[] = [root];

  if (config.frontend === 'nextjs') {
    lines.push('├── app/');
    lines.push('│   ├── (routes)/');
    lines.push('│   ├── layout.tsx');
    lines.push('│   └── page.tsx');
    lines.push('├── components/');
    lines.push('├── lib/');
    lines.push('├── hooks/');
    lines.push('├── types/');
    lines.push('├── public/');
  } else if (config.frontend === 'react') {
    lines.push('├── src/');
    lines.push('│   ├── components/');
    lines.push('│   ├── pages/');
    lines.push('│   ├── hooks/');
    lines.push('│   ├── store/');
    lines.push('│   ├── utils/');
    lines.push('│   ├── types/');
    lines.push('│   └── assets/');
  } else if (config.frontend === 'vue') {
    lines.push('├── src/');
    lines.push('│   ├── components/');
    lines.push('│   ├── views/');
    lines.push('│   ├── composables/');
    lines.push('│   ├── stores/');
    lines.push('│   ├── utils/');
    lines.push('│   └── types/');
  } else if (config.frontend === 'svelte') {
    lines.push('├── src/');
    lines.push('│   ├── routes/');
    lines.push('│   ├── lib/');
    lines.push('│   │   ├── components/');
    lines.push('│   │   └── stores/');
    lines.push('│   └── types/');
  } else if (config.frontend !== 'none') {
    lines.push('├── src/');
    lines.push('│   ├── components/');
    lines.push('│   ├── utils/');
    lines.push('│   └── types/');
  }

  if (config.backend === 'nodejs') {
    lines.push('├── src/');
    lines.push('│   ├── routes/');
    lines.push('│   ├── controllers/');
    lines.push('│   ├── services/');
    lines.push('│   ├── middleware/');
    lines.push('│   └── models/');
  } else if (config.backend === 'python') {
    lines.push('├── app/');
    lines.push('│   ├── routers/');
    lines.push('│   ├── services/');
    lines.push('│   ├── models/');
    lines.push('│   └── dependencies/');
  } else if (config.backend === 'go') {
    lines.push('├── cmd/');
    lines.push('├── internal/');
    lines.push('│   ├── handler/');
    lines.push('│   ├── service/');
    lines.push('│   └── repository/');
    lines.push('├── pkg/');
  } else if (config.backend === 'rust') {
    lines.push('├── src/');
    lines.push('│   ├── handlers/');
    lines.push('│   ├── services/');
    lines.push('│   └── models/');
  } else if (config.backend === 'dotnet') {
    lines.push('├── src/');
    lines.push('│   ├── Controllers/');
    lines.push('│   ├── Services/');
    lines.push('│   └── Models/');
  }

  if (config.databases.length > 0) {
    lines.push('├── db/');
    lines.push('│   └── migrations/');
  }

  if (config.hasTesting) lines.push('├── tests/');
  lines.push('├── .gitignore');
  lines.push('└── CLAUDE.md');

  return lines.join('\n');
}

function getSkillSections(config: ProjectConfig): string {
  const sections: string[] = [];

  if (hasAnySkill(config, ['docker', 'kubernetes'])) {
    const orchLine = hasSkill(config, 'kubernetes')
      ? '- Orchestration: Kubernetes (see k8s/ manifests)'
      : '- Deployment: Docker Compose (see docker-compose.yml)';
    sections.push(`## Container Architecture
- All services run as isolated containers — no host-level dependencies
- Multi-stage builds: builder stage compiles, final stage copies artifacts only
- Images tagged by git SHA in CI; \`latest\` only for local development
${orchLine}
- Secrets injected via environment variables — never baked into images`);
  }

  if (hasSkill(config, 'caching-system')) {
    sections.push(`## Caching Strategy
- **L1 (in-memory):** Request-scoped cache for expensive computations within a single request
- **L2 (Redis):** Cross-request shared cache; TTL set per resource type
- Cache keys: \`{service}:{resource}:{id}:{version}\`
- Invalidation: explicit on write, never on timer alone
- Never cache: auth tokens, payment state, user-specific PII`);
  }

  if (hasSkill(config, 'microservices-arch')) {
    sections.push(`## Service Boundaries
- Each service owns its own database schema — no cross-service DB joins
- Inter-service communication: REST for sync calls, message queue for async events
- Service contracts versioned via API version prefix (\`/v1/\`, \`/v2/\`)
- Health endpoints: \`GET /health\` (liveness) and \`GET /ready\` (readiness)
- Distributed tracing: propagate \`X-Request-ID\` header across all service calls`);
  }

  if (hasAnySkill(config, ['rag-systems', 'machine-learning', 'nlp-processing'])) {
    const isRAG = hasSkill(config, 'rag-systems');
    sections.push(`## ${isRAG ? 'RAG Pipeline' : 'ML Pipeline'} Architecture
${isRAG ? `- **Ingestion**: Document chunking → embedding generation → vector store upsert
- **Retrieval**: Query embedding → vector similarity search → top-k context selection
- **Generation**: Context + query → LLM → response with source citations
- Embeddings cached per content hash; regenerated only when source changes
- Prompt templates versioned in \`prompts/\` — treat them as code` : `- **Training**: Feature pipeline → model training → evaluation → artifact storage
- **Serving**: Model loaded once at startup; predictions served synchronously
- **Evaluation**: Offline metrics (F1, AUC) + online A/B testing framework
- Model artifacts stored in object storage; version pinned in config`}
- All AI outputs validated before storage or display — include confidence threshold`);
  }

  if (hasSkill(config, 'queue-system')) {
    sections.push(`## Message Queue Architecture
- **Producer**: Fire-and-forget with at-least-once delivery guarantee
- **Consumer**: Idempotent handlers — duplicate messages must not cause side effects
- Dead-letter queue (DLQ): messages failing after 3 retries go to DLQ for manual inspection
- Message schema: JSON with \`{ id, type, payload, timestamp, version }\`
- Queue names: \`{service}.{event}\` (e.g., \`orders.created\`, \`payments.failed\`)`);
  }

  if (sections.length === 0) return '';
  return '\n' + sections.join('\n\n');
}

export default function ARCHITECTURE_md(config: ProjectConfig): string {
  const hasDB = config.databases.length > 0;
  const hasQueue = config.queues.length > 0;
  const hasBackend = config.backend !== 'none';
  const hasFrontend = config.frontend !== 'none';

  const mermaidFlow = [
    '    User',
    hasFrontend ? `    User --> Frontend[${config.frontend} UI]` : null,
    hasBackend ? `    ${hasFrontend ? 'Frontend' : 'User'} --> API[${config.backend} API]` : null,
    ...config.databases.map(db => `    ${hasBackend ? 'API' : hasFrontend ? 'Frontend' : 'User'} --> DB_${db}[(${db})]`),
    ...config.queues.map(q => `    ${hasBackend ? 'API' : hasFrontend ? 'Frontend' : 'User'} --> Q_${q}[[${q}]]`),
    config.hasAuth ? `    API --> Auth[Auth Service]` : null,
    config.hasPayments ? `    API --> Pay[Payment Provider]` : null,
  ].filter(Boolean).join('\n');

  return `# Architecture — ${config.name}

## Overview
${config.description}
Type: **${config.type}** | Scale: **${config.scale}**

## Visual Architecture
> Diagram: [Open in Eraser.io / Miro / Figma](_paste-link-here_)
> Replace the link above with your team's live diagram. Keep the Mermaid snapshot below in sync after major changes.

\`\`\`mermaid
graph TD
${mermaidFlow}
\`\`\`

## Layer Separation

| Layer | Responsibility | What NOT to put here |
|-------|---------------|----------------------|
| **Presentation** | Rendering, user events, form state | Business rules, direct DB calls |
| **Business Logic** | Rules, validations, transformations | UI state, HTTP specifics |
| **Data Access** | DB queries, external API calls | Business rules, rendering |

> Keep these layers decoupled. Business logic must be testable without the UI or DB.

## Data Flow
\`\`\`
${hasFrontend ? `${config.frontend} UI` : 'Client'}${hasBackend ? ` → ${config.backend} API` : ''}${hasDB ? ` → ${config.databases.join(', ')}` : ''}${hasQueue ? ` → ${config.queues.join(', ')}` : ''}
\`\`\`

## Key Decisions
| Decision | Choice | Reason |
|----------|--------|--------|
| Frontend | ${config.frontend} | _fill in_ |
| Backend | ${config.backend} | _fill in_ |
| Databases | ${config.databases.length > 0 ? config.databases.join(', ') : 'none'} | _fill in_ |
| Queues | ${config.queues.length > 0 ? config.queues.join(', ') : 'none'} | _fill in_ |
| Deps | ${getDepsLabel(config)} | _fill in_ |

## Decision Log

| Date | Decision | Alternatives Considered | Outcome |
|------|----------|------------------------|---------|
| _YYYY-MM-DD_ | _describe decision_ | _what else was considered_ | _result_ |

> Add a row here before any significant architectural change.
> Keep this in sync with DECISIONS.md if it exists.

## Project Structure
\`\`\`
${buildProjectTree(config)}
\`\`\`

## Constraints
- Files under 300 lines — split if larger
- No circular dependencies between modules
- One responsibility per module
- Edit existing files before creating new ones
${config.hasAuth ? '- Auth logic isolated in /auth — never inline in routes\n' : ''}\
${config.hasPayments ? '- Payment logic isolated in /payments — never inline in components\n' : ''}\
${getSkillSections(config)}

_Update this file after any significant architectural change._
`;
}
