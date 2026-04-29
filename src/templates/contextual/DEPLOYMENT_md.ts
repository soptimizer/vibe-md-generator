// src/templates/contextual/DEPLOYMENT_md.ts
import type { ProjectConfig } from '../../types';
import { getInstallCmd, getBuildCmd, getStartCmd, isJSProject } from '../../logic/commands';

function getPlatformSection(config: ProjectConfig): string {
  const hasNode = config.backend === 'nodejs';
  const hasPython = config.backend === 'python';
  const hasGo = config.backend === 'go';
  const hasDotnet = config.backend === 'dotnet';
  const hasFrontend = config.frontend !== 'none';

  if (config.type === 'api' || config.backend !== 'none') {
    const platform = hasNode ? 'Railway / Render / Fly.io' : hasPython ? 'Railway / Render' : hasGo ? 'Fly.io / Railway' : hasDotnet ? 'Azure / Railway' : 'Your platform';
    const buildCmd = getBuildCmd(config);
    return `## Recommended Platform
${platform}

## Build & Start
\`\`\`bash
# Install
${getInstallCmd(config)}
${buildCmd ? `\n# Build\n${buildCmd}\n` : ''}\
# Start
${getStartCmd(config)}
\`\`\`
`;
  }

  if (hasFrontend) {
    return `## Recommended Platform
Vercel (recommended) / Netlify / Cloudflare Pages

## Build & Deploy
\`\`\`bash
# Install
${getInstallCmd(config)}

# Build
${getBuildCmd(config)}

# Output directory: dist/ (or build/ for Next.js)
\`\`\`
`;
  }

  return `## Platform
Choose a platform suited to your project type.\n`;
}

function getEnvSection(config: ProjectConfig): string {
  const vars: string[] = [];
  if (isJSProject(config)) {
    vars.push('NODE_ENV=production');
  } else if (config.backend === 'go') {
    vars.push('APP_ENV=production');
  } else if (config.backend === 'python') {
    vars.push('ENVIRONMENT=production');
  } else if (config.backend === 'dotnet') {
    vars.push('ASPNETCORE_ENVIRONMENT=Production');
  } else {
    vars.push('APP_ENV=production');
  }
  if (config.databases.some(db => ['postgresql', 'mysql', 'sqlite', 'clickhouse', 'mongodb'].includes(db))) vars.push('DATABASE_URL=');
  if (config.databases.includes('redis')) vars.push('REDIS_URL=');
  if (config.databases.includes('elastic')) vars.push('ELASTICSEARCH_URL=');
  if (config.databases.includes('bigquery')) vars.push('GOOGLE_APPLICATION_CREDENTIALS=');
  if (config.queues.includes('kafka')) vars.push('KAFKA_BROKERS=');
  if (config.queues.includes('rabbitmq')) vars.push('RABBITMQ_URL=');
  if (config.hasAuth) vars.push('AUTH_SECRET=', 'JWT_SECRET=');
  if (config.hasPayments) vars.push('STRIPE_SECRET_KEY=', 'STRIPE_WEBHOOK_SECRET=');
  return vars.join('\n');
}

function getSmokeTests(config: ProjectConfig): string {
  const checks: string[] = [
    '- [ ] App loads without console errors',
    '- [ ] Environment variables are injected correctly',
  ];
  if (config.frontend !== 'none') checks.push('- [ ] Home page renders correctly');
  if (config.hasAuth) checks.push('- [ ] Login / register flow works end-to-end');
  if (config.hasPayments) checks.push('- [ ] Payment checkout does not throw errors');
  if (config.databases.length > 0) checks.push('- [ ] Database connection is healthy');
  if (config.queues.length > 0) checks.push('- [ ] Message broker connection is healthy');
  if (config.type === 'api' || config.backend !== 'none') checks.push('- [ ] /health or root endpoint returns 200');
  checks.push('- [ ] No 500 errors in logs after first 5 minutes');
  return checks.join('\n');
}

export default function DEPLOYMENT_md(config: ProjectConfig): string {
  return `# Deployment — ${config.name}

${getPlatformSection(config)}
## Environment Variables
Create a \`.env\` file locally (never commit it). Configure the same vars in your hosting platform:

\`\`\`env
${getEnvSection(config)}
\`\`\`

## Pre-Deploy Checklist
- [ ] All tests pass locally
- [ ] \`.env.example\` is up to date
- [ ] No hardcoded secrets in source code
- [ ] \`PROGRESS.md\` reflects current state
${config.databases.some(db => ['postgresql', 'mysql', 'sqlite', 'clickhouse'].includes(db)) ? '- [ ] Database migrations are applied\n' : ''}\
${config.hasAuth ? '- [ ] Auth callback URLs are set for the new domain\n' : ''}\
${config.hasPayments ? '- [ ] Stripe webhook URL is updated to production endpoint\n' : ''}\

## Smoke Tests (run after every deploy)
${getSmokeTests(config)}

## Rollback
If a deployment breaks production:
1. Revert to the last known-good deployment in the platform dashboard
2. Identify the failing commit with \`git log --oneline\`
3. Fix forward on a new branch — do not force-push main

---
_Keep this file updated as infra evolves._
`;
}
