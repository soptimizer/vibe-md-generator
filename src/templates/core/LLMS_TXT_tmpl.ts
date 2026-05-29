// src/templates/core/LLMS_TXT_tmpl.ts
import type { ProjectConfig } from '../../types';

export default function LLMS_TXT_tmpl(config: ProjectConfig): string {
  const contextFiles: string[] = [
    `- [AI Instructions](./CLAUDE.md): Project rules, commands, boundaries, and AI role`,
    `- [Architecture](./ARCHITECTURE.md): System design, folder structure, and constraints`,
    `- [Progress](./PROGRESS.md): Current status and session log`,
    `- [PRD](./PRD.md): Product requirements and user stories`,
    `- [README](./README.md): Quick start guide`,
  ];

  if (config.databases.length > 0) {
    contextFiles.push(`- [Database Schema](./DATABASE_SCHEMA.md): Schema definitions and indexing strategy`);
  }
  if (config.hasAuth || config.hasPayments) {
    contextFiles.push(`- [Security](./SECURITY.md): Auth flows, payment handling, and data protection rules`);
  }
  if (config.type === 'api' || config.type === 'service' || config.backend !== 'none') {
    contextFiles.push(`- [API Spec](./API_SPEC.md): Endpoint documentation and request/response schemas`);
  }
  if (config.hasTesting) {
    contextFiles.push(`- [Testing Strategy](./TESTING_STRATEGY.md): Test approach, patterns, and coverage goals`);
  }
  if (config.hasDeployment) {
    contextFiles.push(`- [Deployment](./DEPLOYMENT.md): Infrastructure, environment variables, and deploy procedures`);
  }
  if (config.frontend !== 'none') {
    contextFiles.push(`- [Design System](./DESIGN_SYSTEM.md): Component conventions and styling guidelines`);
  }
  if (config.scale !== 'solo') {
    contextFiles.push(`- [Git Workflow](./GIT_WORKFLOW.md): Branch strategy and PR conventions`);
    contextFiles.push(`- [Contributing](./CONTRIBUTING.md): Development setup and contribution guidelines`);
  }

  const stack: string[] = [];
  if (config.frontend !== 'none') stack.push(config.frontend);
  if (config.backend !== 'none') stack.push(config.backend);
  if (config.databases.length > 0) stack.push(...config.databases);

  return `# ${config.name}

> ${config.description}

## Stack
${stack.length > 0 ? stack.map(s => `- ${s}`).join('\n') : '- See TECH_STACK.md'}

## Context Files

${contextFiles.join('\n')}

## Optional
- [llms-full.txt](./llms-full.txt): Full context dump (generate with \`cat CLAUDE.md ARCHITECTURE.md PROGRESS.md > llms-full.txt\`)
`;
}
