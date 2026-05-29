// src/templates/contextual/GIT_WORKFLOW_md.ts
import type { ProjectConfig } from '../../types';

function getBranchStrategy(config: ProjectConfig): string {
  if (config.scale === 'enterprise') {
    return `## Branch Strategy
\`\`\`
main          ← production, always deployable
develop       ← integration branch, merge features here first
feature/*     ← new features (branch from develop)
fix/*         ← bug fixes (branch from develop)
hotfix/*      ← critical prod fixes (branch from main, merge to main + develop)
release/*     ← release prep (branch from develop)
\`\`\`

**Rules:**
- Never commit directly to \`main\` or \`develop\`
- \`main\` is updated only via release or hotfix branches
- All feature PRs target \`develop\`, not \`main\``;
  }

  return `## Branch Strategy
\`\`\`
main          ← production, always deployable
feature/*     ← new features
fix/*         ← bug fixes
chore/*       ← tooling, deps, config (no production code change)
\`\`\`

**Rules:**
- Never commit directly to \`main\`
- One feature per branch — keep PRs focused and reviewable`;
}

function getPRTemplate(config: ProjectConfig): string {
  const testing = config.hasTesting ? '\n- [ ] Tests added / updated and passing' : '';
  return `## Pull Request Template
When opening a PR, include:

\`\`\`markdown
## What
<!-- One sentence: what does this PR do? -->

## Why
<!-- Why is this change needed? Link to task/issue if applicable. -->

## How
<!-- Brief description of the approach -->

## Checklist
- [ ] Tested locally on the happy path
- [ ] No unrelated changes included${testing}
- [ ] PROGRESS.md updated if a feature shipped
\`\`\``;
}

export default function GIT_WORKFLOW_md(config: ProjectConfig): string {
  return `# Git Workflow — ${config.name}

${getBranchStrategy(config)}

## Commit Message Format
Use [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`
<type>(<scope>): <short summary>

feat(auth): add email verification flow
fix(api): handle null response from payment provider
chore(deps): bump typescript to 5.4
docs(readme): update setup instructions
\`\`\`

**Types:** \`feat\` · \`fix\` · \`chore\` · \`docs\` · \`refactor\` · \`test\` · \`perf\`

- Summary: present tense, lowercase, no period at end
- Keep under 72 characters
- Reference issue numbers in the body, not the subject line

${getPRTemplate(config)}

## Code Review Guidelines
- Review within **24 hours** of PR opening
- Approve only when you'd be comfortable owning the code
- Leave comments as suggestions, not demands
- At least **1 approval** required before merging${config.scale === 'enterprise' ? '\n- 2 approvals required for changes to auth, payments, or infra' : ''}

## Merge Strategy
- Use **Squash and Merge** for feature branches (clean history on main)
- Use **Merge Commit** for release branches (preserves context)
- Delete the source branch after merging

## Documentation Sync
After merging any PR that changes behaviour, the author must update:

| Changed | Update |
|---------|--------|
| New feature shipped | \`PROGRESS.md\` — mark done, move to Completed |
| Architecture changed | \`ARCHITECTURE.md\` — update component tree / data flow |
| New dependency added | \`TECH_STACK.md\` (if present) — add entry with reason |
| API contract changed | \`API_SPEC.md\` (if present) — reflect new endpoints/schemas |
| Known issue resolved | \`PROGRESS.md\` Known Issues — remove the entry |

A PR that ships code without updating the relevant doc files is **not complete**.

---
_Update this file when your team changes its process._
`;
}
