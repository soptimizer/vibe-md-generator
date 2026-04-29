// src/templates/core/CLAUDE_md.ts
import type { ProjectConfig } from '../../types';
import { getDevCmd, getBuildCmd, getTestCmd, getLintCmd, getDepsLabel } from '../../logic/commands';
import { getBuildOutputDirs, getDependencyDirs } from '../../logic/ignorePatterns';

function getBoundaries(config: ProjectConfig): string {
  const always: string[] = [
    '- Read the existing file before editing it',
    '- Keep secrets out of source code',
  ];
  const askFirst: string[] = [];
  const never: string[] = [
    '- Hardcode secrets, tokens, or credentials',
  ];

  if (config.hasAuth || config.hasPayments) {
    const paths: string[] = [];
    if (config.hasAuth) paths.push('auth');
    if (config.hasPayments) paths.push('payment');
    askFirst.push(`- Touch ${paths.join(' or ')} files (${paths.map(p => `/src/${p}/**`).join(', ')})`);
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
    never.push('- Delete existing tests');
  }

  const offLimitsDirs = [
    ...getBuildOutputDirs(config),
    ...getDependencyDirs(config),
    'coverage/',
  ];
  never.push(`- Read or modify files in: ${offLimitsDirs.join(', ')} — generated output, not source code`);

  return `## Boundaries

**Always do**
${always.join('\n')}

**Ask first**
${askFirst.length ? askFirst.join('\n') : '- (nothing project-specific — use judgement)'}

**Never do**
${never.join('\n')}`;
}

function getReferences(config: ProjectConfig): string {
  const refs = ['- Architecture: @ARCHITECTURE.md', '- Progress: @PROGRESS.md'];
  if (config.databases.length > 0) refs.push('- DB Schema: @DATABASE_SCHEMA.md');
  if (config.hasAuth || config.hasPayments) refs.push('- Security rules: @SECURITY.md');
  if (config.type === 'api') refs.push('- API spec: @API_SPEC.md');
  if (config.frontend !== 'none') refs.push('- Design system: @DESIGN_SYSTEM.md');
  if (config.scale !== 'solo') refs.push('- Git workflow: @GIT_WORKFLOW.md');
  return refs.join('\n');
}

function getAIRole(config: ProjectConfig): string {
  const roleMap: Record<string, string> = {
    'assistant': 'Make suggestions and wait for approval before implementing',
    'pair-programmer': 'Implement directly. Ask only for ambiguous requirements',
    'reviewer-only': 'Review and comment only. Do not write or modify code unless explicitly asked',
  };
  return roleMap[config.aiRole];
}

function getLayerSeparation(config: ProjectConfig): string {
  const lines: string[] = ['## Layer Separation Rules'];

  if (config.frontend === 'react' || config.frontend === 'nextjs') {
    lines.push('- **components/**: JSX only — no fetch calls, no business logic');
    lines.push('- **hooks/**: Custom hooks own side effects, data fetching, transformations');
    lines.push('- **store/**: Global state — no direct API calls inside reducers/slices');
    lines.push('- Rule: if a function can be extracted from a component and tested in isolation, it belongs in hooks/ or utils/');
  } else if (config.frontend === 'vue') {
    lines.push('- **components/**: Template + display logic only — no fetch calls');
    lines.push('- **composables/**: Reusable reactive logic (Vue equivalent of hooks)');
    lines.push('- **stores/**: Pinia stores for global state — no business rules inline in templates');
    lines.push('- Rule: business logic lives in composables, not component `<script>` blocks');
  } else if (config.frontend === 'svelte') {
    lines.push('- **components/**: Markup + local display state only');
    lines.push('- **stores/**: Shared reactive state via Svelte stores');
    lines.push('- **lib/**: Business logic and utilities — imported by both components and stores');
    lines.push('- Rule: side effects go in stores or load functions, not component scripts');
  }

  if (config.backend === 'nodejs') {
    lines.push('- **routes/**: Parse request + call controller — zero business logic');
    lines.push('- **controllers/**: Orchestrate services, format response — no DB queries');
    lines.push('- **services/**: All business rules live here — testable without HTTP context');
    lines.push('- **models/**: DB queries only — no business rules');
  } else if (config.backend === 'python') {
    lines.push('- **routers/**: HTTP layer only — delegate to services immediately');
    lines.push('- **services/**: Business logic — must be callable from tests without HTTP');
    lines.push('- **models/**: ORM definitions + DB queries — no business rules');
    lines.push('- **dependencies/**: FastAPI dependency injection — auth, DB sessions, etc.');
  } else if (config.backend === 'go') {
    lines.push('- **handler/**: HTTP decoding/encoding — calls service, returns response');
    lines.push('- **service/**: Business logic — no HTTP or DB knowledge');
    lines.push('- **repository/**: DB access only — returns domain types, no business logic');
  } else if (config.backend === 'rust') {
    lines.push('- **handlers/**: Request parsing + response formatting — no business logic');
    lines.push('- **services/**: Business rules — independently testable');
    lines.push('- **models/**: Data structures + DB queries — no business logic');
  } else if (config.backend === 'dotnet') {
    lines.push('- **Controllers/**: API Endpoints — no business logic');
    lines.push('- **Services/**: Core business rules — independently testable');
    lines.push('- **Models/**: Entity definitions and DTOs');
  }

  if (lines.length === 1) return '';
  return lines.join('\n');
}

function getReviewChecklist(config: ProjectConfig): string {
  const items: string[] = [
    '- [ ] No unused variables or dead code',
    '- [ ] No hardcoded secrets or credentials',
    '- [ ] Error handling on all external calls',
  ];

  if (config.frontend === 'react' || config.frontend === 'nextjs') {
    items.push('- [ ] No missing keys in list renders');
    items.push('- [ ] No direct DOM manipulation');
  }
  if (config.frontend === 'vue' || config.frontend === 'svelte') {
    items.push('- [ ] Reactive state not mutated directly');
  }
  if (config.backend === 'nodejs' || config.backend === 'python' || config.backend === 'go' || config.backend === 'rust' || config.backend === 'dotnet') {
    items.push('- [ ] All user inputs validated before processing');
    items.push('- [ ] Database queries use parameterized statements');
  }
  if (config.hasTesting) {
    items.push('- [ ] New logic has matching tests');
    items.push(`- [ ] \`${getTestCmd(config)}\` passes`);
  }
  if (config.hasAuth || config.hasPayments) {
    items.push('- [ ] Auth/payment paths are not bypassable');
    items.push('- [ ] Sensitive data never logged');
  }

  return items.join('\n');
}

export default function CLAUDE_md(config: ProjectConfig): string {
  const buildCmd = getBuildCmd(config);
  return `# ${config.name}

${config.description}

## Role
${getAIRole(config)}

## Stack
- Frontend: ${config.frontend === 'none' ? 'N/A' : config.frontend}
- Backend: ${config.backend === 'none' ? 'N/A' : config.backend}
- Databases: ${config.databases.length > 0 ? config.databases.join(', ') : 'N/A'}
- Queues: ${config.queues.length > 0 ? config.queues.join(', ') : 'N/A'}
- Deps: ${getDepsLabel(config)}

## Commands
- Dev: \`${getDevCmd(config)}\`
${buildCmd ? `- Build: \`${buildCmd}\`\n` : ''}\
- Lint: \`${getLintCmd(config)}\`${config.hasTesting ? `\n- Test: \`${getTestCmd(config)}\`` : ''}

${getLayerSeparation(config)}

## File Structure Discipline
- **Edit existing files first** — never create a new file if a relevant one already exists
- Check the folder structure in \`ARCHITECTURE.md\` before deciding where new code goes
- One module = one responsibility; no catch-all utils files
- New files must fit an established folder (components/, routes/, utils/…) — if none fits, ask

## Code Style
- Clear, descriptive variable and function names
- No commented-out code — delete it
- Check for similar patterns before creating utilities

${getBoundaries(config)}

## Working Modes

### 🏗 Build Mode
When adding a new feature or file:
- Check \`ARCHITECTURE.md\` for the correct folder and naming conventions
- Read existing similar implementations first — repeat the pattern, don't invent a new one
- Update the Feature Registry below once the feature is complete

### 🔍 Review Mode
When reviewing code:
- Check only the items in the Review Checklist below
- Suggest changes, don't apply them directly
- List findings in order of severity — most critical first

### ♻️ Refactor Mode
When restructuring existing code:
- Do not change observable behaviour — structure only
- One module at a time
- Run tests before and after the refactor

## Review Checklist
_Run through this before marking any task done._
${getReviewChecklist(config)}

## Feature Registry

| Feature | Status | Key Files | Notes |
|---------|--------|-----------|-------|
| _example: Auth login_ | ✅ Done | \`src/auth/login.ts\` | JWT, 15min expiry |

> Update this table after implementing each feature. AI should read this before
> starting new work to avoid duplicating or breaking existing implementations.

## References
${getReferences(config)}
`;
}
