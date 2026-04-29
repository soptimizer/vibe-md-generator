// src/templates/index.ts
import type { ProjectConfig, MDFileKey } from '../types';
import { getDepsLabel } from '../logic/commands';
import CLAUDE_md from './core/CLAUDE_md';
import ARCHITECTURE_md from './core/ARCHITECTURE_md';
import PROGRESS_md from './core/PROGRESS_md';
import README_md from './core/README_md';
import SECURITY_md from './contextual/SECURITY_md';
import DATABASE_SCHEMA_md from './contextual/DATABASE_SCHEMA_md';
import API_SPEC_md from './contextual/API_SPEC_md';
import TESTING_STRATEGY_md from './contextual/TESTING_STRATEGY_md';
import TASKS_md from './contextual/TASKS_md';
import PRD_md from './contextual/PRD_md';
import CURSOR_RULES_md from './contextual/CURSOR_RULES_md';
import GITIGNORE_tmpl from './core/GITIGNORE_tmpl';
import CURSORIGNORE_tmpl from './contextual/CURSORIGNORE_tmpl';
import WINDSURFIGNORE_tmpl from './contextual/WINDSURFIGNORE_tmpl';
import CLAUDE_SETTINGS_JSON_tmpl from './contextual/CLAUDE_SETTINGS_JSON_tmpl';
import DEPLOYMENT_md from './contextual/DEPLOYMENT_md';
import GIT_WORKFLOW_md from './contextual/GIT_WORKFLOW_md';
import DESIGN_SYSTEM_md from './contextual/DESIGN_SYSTEM_md';
import CONTRIBUTING_md from './contextual/CONTRIBUTING_md';
import DECISIONS_md from './contextual/DECISIONS_md';
import CONTEXT_MAP_md from './contextual/CONTEXT_MAP_md';
import ERROR_HANDLING_md from './contextual/ERROR_HANDLING_md';

// AGENTS.md is same as CLAUDE.md but with different filename
const AGENTS_md = CLAUDE_md;

export const templateRegistry: Record<MDFileKey, (config: ProjectConfig) => string> = {
  CLAUDE_MD: CLAUDE_md,
  AGENTS_MD: AGENTS_md,
  README_MD: README_md,
  ARCHITECTURE_MD: ARCHITECTURE_md,
  PROGRESS_MD: PROGRESS_md,
  TASKS_MD: TASKS_md,
  IMPLEMENTATION_PLAN_MD: (config) => `# Implementation Plan — ${config.name}

## Vertical Slice Strategy
Build each feature DB → API → UI in one complete slice before starting the next.

## Slices

### Slice 0 — Project Skeleton
- [ ] Repo, dependencies, folder structure
- [ ] Environment variables and config
- [ ] CI/CD baseline${config.hasDeployment ? '\n- [ ] Deployment pipeline' : ''}

### Slice 1 — Core Data Model
- [ ] Define schema / data structures
${config.databases.length > 0 ? `- [ ] Create database migrations\n` : ''}\
- [ ] Seed with minimal test data

### Slice 2 — Core Feature${config.hasAuth ? '\n- [ ] Auth: register + login + session' : ''}
- [ ] Main happy-path feature (DB → API → UI)
- [ ] Error states and validation

### Slice 3 — Secondary Features
${config.hasPayments ? '- [ ] Payment integration\n' : ''}\
${config.hasTesting ? '- [ ] Test coverage for Slice 2\n' : ''}\
- [ ] Additional features from PRD

### Slice 4 — Polish
- [ ] Error boundaries and fallbacks
- [ ] Performance pass
- [ ] Update PROGRESS.md and README.md

---
_Mark each item when done. Do not start the next slice before the current one is working end-to-end._
`,
  TECH_STACK_MD: (config) => `# Tech Stack — ${config.name}

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | ${config.frontend === 'none' ? 'N/A' : config.frontend} | — |
| Backend | ${config.backend === 'none' ? 'N/A' : config.backend} | — |
| Databases | ${config.databases.length === 0 ? 'N/A' : config.databases.join(', ')} | — |
| Queues | ${config.queues.length === 0 ? 'N/A' : config.queues.join(', ')} | — |
| Deps | ${getDepsLabel(config)} | — |
`,
  DATABASE_SCHEMA_MD: DATABASE_SCHEMA_md,
  SECURITY_MD: SECURITY_md,
  API_SPEC_MD: API_SPEC_md,
  TESTING_STRATEGY_MD: TESTING_STRATEGY_md,
  PRD_MD: PRD_md,
  CURSOR_RULES_MD: CURSOR_RULES_md,
  GITIGNORE: GITIGNORE_tmpl,
  CURSORIGNORE: CURSORIGNORE_tmpl,
  WINDSURFIGNORE: WINDSURFIGNORE_tmpl,
  CLAUDE_SETTINGS_JSON: CLAUDE_SETTINGS_JSON_tmpl,
  DEPLOYMENT_MD: DEPLOYMENT_md,
  GIT_WORKFLOW_MD: GIT_WORKFLOW_md,
  DESIGN_SYSTEM_MD: DESIGN_SYSTEM_md,
  CONTRIBUTING_MD: CONTRIBUTING_md,
  DECISIONS_MD: DECISIONS_md,
  CONTEXT_MAP_MD: CONTEXT_MAP_md,
  ERROR_HANDLING_MD: ERROR_HANDLING_md,
};
