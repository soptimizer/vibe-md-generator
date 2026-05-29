// src/templates/contextual/ANTIGRAVITY_WORKFLOWS.ts
import type { ProjectConfig } from '../../types';
import { getDevCmd, getLintCmd, getTestCmd, getDepsLabel } from '../../logic/commands';

export function ANTIGRAVITY_WORKFLOW_SETUP_md(config: ProjectConfig): string {
  return `# Workflow: Project Setup
// turbo

## Purpose
Run this workflow once after cloning the repository to verify the environment is ready.

## Steps

### 1. Install Dependencies
\`\`\`bash
${getDepsLabel(config)} install
\`\`\`

### 2. Configure Environment
- Copy \`.env.example\` to \`.env\` (if it exists)
- Fill in required environment variables — refer to ARCHITECTURE.md for the full list
${config.databases.length > 0 ? `- Ensure ${config.databases.join(' and ')} are running and reachable\n` : ''}
### 3. Verify Dev Server
\`\`\`bash
${getDevCmd(config)}
\`\`\`
Confirm the application starts without errors.

### 4. Run Lint
\`\`\`bash
${getLintCmd(config)}
\`\`\`
Confirm no lint errors on a fresh checkout.
${config.hasTesting ? `
### 5. Run Tests
\`\`\`bash
${getTestCmd(config)}
\`\`\`
Confirm all tests pass before making any changes.
` : ''}
### ${config.hasTesting ? '6' : '5'}. Read Context Files
- \`ARCHITECTURE.md\` — understand module boundaries and data flow
- \`PROGRESS.md\` — understand current state and what is in progress
- \`PRD.md\` — understand the product goals

## Output
If all steps succeed: environment is ready. Report the dev server URL.
If any step fails: stop, report the exact error, and wait for instructions.
`;
}

export function ANTIGRAVITY_WORKFLOW_DEPLOY_md(config: ProjectConfig): string {
  return `# Workflow: Deploy
// turbo

## Purpose
Run this workflow when shipping a new release to production.

## Pre-Deploy Checklist
- [ ] All planned tasks for this release are marked done in PROGRESS.md
- [ ] \`${getLintCmd(config)}\` passes with no errors
${config.hasTesting ? `- [ ] \`${getTestCmd(config)}\` passes with no failures\n` : ''}\
- [ ] No uncommitted changes in the working tree
- [ ] PROGRESS.md updated with the release summary

## Steps

### 1. Build
\`\`\`bash
${getDepsLabel(config)} run build
\`\`\`
Confirm build succeeds with no errors.

### 2. Review Environment Variables
- Verify production environment variables are set (not development values)
- Confirm no secrets are embedded in build output
${config.databases.length > 0 ? `
### 3. Run Migrations
- Apply any pending database migrations
- Verify rollback plan exists before applying
` : ''}
### ${config.databases.length > 0 ? '4' : '3'}. Deploy
- Follow the deployment procedure in DEPLOYMENT.md
- Monitor logs immediately after deployment for unexpected errors

### ${config.databases.length > 0 ? '5' : '4'}. Smoke Test
- Verify the critical user paths work in production
${config.hasAuth ? '- Confirm login / logout still works\n' : ''}\
${config.hasPayments ? '- Confirm checkout flow is functional\n' : ''}\

## Rollback
If the smoke test fails:
1. Roll back to the previous deployment immediately
2. Document what went wrong in PROGRESS.md
3. Do not re-deploy until the root cause is identified and fixed

## Output
Report: ✅ Deployed successfully (version + timestamp) | ❌ Rollback triggered (reason)
`;
}
