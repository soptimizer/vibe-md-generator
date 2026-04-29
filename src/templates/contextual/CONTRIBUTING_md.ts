// src/templates/contextual/CONTRIBUTING_md.ts
import type { ProjectConfig } from '../../types';
import { getInstallCmd, getDevCmd, getTestCmd, isJSProject } from '../../logic/commands';

function getSetupSection(config: ProjectConfig): string {
  const install = getInstallCmd(config);
  const dev = getDevCmd(config);
  const test = config.hasTesting ? `\n# Run tests\n${getTestCmd(config)}` : '';
  return `\`\`\`bash
# Clone and install
git clone <repo-url>
cd ${config.name.toLowerCase().replace(/\s+/g, '-')}
${install}

# Start dev server
${dev}${test}
\`\`\``;
}

function getWorkflowSection(config: ProjectConfig): string {
  if (config.scale === 'enterprise') {
    return `## Workflow
1. Pick an issue from the backlog and assign it to yourself
2. Branch from \`develop\`: \`git checkout -b feature/short-description\`
3. Work in small, focused commits (Conventional Commits format)
4. Open a draft PR early — no surprise large PRs
5. Request review when ready; address all comments before merging
6. Merge via **Squash and Merge** into \`develop\`
7. Update \`PROGRESS.md\` when the feature ships to \`main\`

> Issues are tracked in the project board. No branch without a linked issue.`;
  }

  return `## Workflow
1. Pick an item from \`TASKS.md\` or create a new task
2. Create a branch: \`git checkout -b feature/short-description\`
3. Commit often with clear messages (Conventional Commits)
4. Open a PR targeting \`main\` when the feature is ready
5. Get at least 1 review before merging
6. Update \`PROGRESS.md\` and \`TASKS.md\` after merging`;
}

function getCodeStandardsSection(config: ProjectConfig): string {
  const items: string[] = [
    '- Follow the patterns already in the codebase — consistency first',
    '- Edit existing files before creating new ones',
    '- No commented-out code — delete unused code',
    '- Keep functions under 40 lines; split if longer',
  ];
  if (isJSProject(config)) {
    items.push('- No `any` types — use explicit TypeScript types');
  }
  if (config.hasAuth || config.hasPayments) {
    items.push('- Never touch auth/payment logic without a security review');
  }
  if (config.hasTesting) {
    items.push('- New features must include tests; bug fixes should add a regression test');
  }
  return items.join('\n');
}

export default function CONTRIBUTING_md(config: ProjectConfig): string {
  return `# Contributing — ${config.name}

## Getting Started
${getSetupSection(config)}

${getWorkflowSection(config)}

## Code Standards
${getCodeStandardsSection(config)}

## Commit Messages
Use [Conventional Commits](https://www.conventionalcommits.org/):
\`\`\`
feat(scope): add thing
fix(scope): correct behaviour
chore(deps): bump package
docs: update README
\`\`\`

## What Belongs in a PR
- **One concern per PR** — a feature, a fix, or a refactor. Not all three.
- PR description must explain the *why*, not just the *what*
- Screenshots for any UI change
- Passing${config.hasTesting ? ' tests and' : ''} lint before requesting review

## Questions & Decisions
- Minor decisions: leave a comment in the PR
- Architectural decisions: update \`ARCHITECTURE.md\` and discuss in the PR description
- Blocked? Leave a comment on the issue and ping the team

---
_Keep this file accurate. Stale contributing guides erode trust._
`;
}
