// src/templates/index.ts
import type { ProjectConfig, MDFileKey } from '../types';
import { getDepsLabel } from '../logic/commands';
import CLAUDE_md from './core/CLAUDE_md';
import ARCHITECTURE_md from './core/ARCHITECTURE_md';
import PROGRESS_md from './core/PROGRESS_md';
import README_md from './core/README_md';
import LLMS_TXT_tmpl from './core/LLMS_TXT_tmpl';
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
import WINDSURF_RULES_md from './contextual/WINDSURF_RULES_md';
import CLAUDE_SETTINGS_JSON_tmpl from './contextual/CLAUDE_SETTINGS_JSON_tmpl';
import COPILOT_INSTRUCTIONS_md from './contextual/COPILOT_INSTRUCTIONS_md';
import MCP_CONFIG_JSON_tmpl from './contextual/MCP_CONFIG_JSON_tmpl';
import DEPLOYMENT_md from './contextual/DEPLOYMENT_md';
import GIT_WORKFLOW_md from './contextual/GIT_WORKFLOW_md';
import DESIGN_SYSTEM_md from './contextual/DESIGN_SYSTEM_md';
import CONTRIBUTING_md from './contextual/CONTRIBUTING_md';
import DECISIONS_md from './contextual/DECISIONS_md';
import CONTEXT_MAP_md from './contextual/CONTEXT_MAP_md';
import ERROR_HANDLING_md from './contextual/ERROR_HANDLING_md';
import OPENCODE_AGENTS_md from './contextual/OPENCODE_AGENTS_md';
import OPENCODE_JSON_tmpl from './contextual/OPENCODE_JSON_tmpl';
import {
  OPENCODE_AGENT_DESIGNER_md,
  OPENCODE_AGENT_FRONTEND_md,
  OPENCODE_AGENT_BACKEND_md,
  OPENCODE_AGENT_DEVOPS_md,
} from './contextual/OPENCODE_AGENT_personas';
import {
  OPENCODE_SKILL_CONTEXT_md,
  OPENCODE_SKILL_REVIEW_md,
  OPENCODE_SKILL_TESTDRIVEN_md,
} from './contextual/OPENCODE_SKILLS';
import DEPENDENCY_AUDIT_md from './contextual/DEPENDENCY_AUDIT_md';
import INCIDENT_RESPONSE_md from './contextual/INCIDENT_RESPONSE_md';
import GEMINI_md from './contextual/GEMINI_md';
import ANTIGRAVITY_AGENTS_md from './contextual/ANTIGRAVITY_AGENTS_md';
import {
  ANTIGRAVITY_SKILL_REVIEW_md,
  ANTIGRAVITY_SKILL_TEST_md,
} from './contextual/ANTIGRAVITY_SKILLS';
import {
  ANTIGRAVITY_WORKFLOW_SETUP_md,
  ANTIGRAVITY_WORKFLOW_DEPLOY_md,
} from './contextual/ANTIGRAVITY_WORKFLOWS';
import { AIDER_CONF_tmpl, AIDER_CONVENTIONS_md } from './contextual/AIDER_tmpl';
import DOCKER_COMPOSE_tmpl from './contextual/DOCKER_COMPOSE_tmpl';
import GITHUB_ACTIONS_CI_tmpl from './contextual/GITHUB_ACTIONS_CI_tmpl';

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
  LLMS_TXT: LLMS_TXT_tmpl,
  COPILOT_INSTRUCTIONS_MD: COPILOT_INSTRUCTIONS_md,
  WINDSURF_RULES_MD: WINDSURF_RULES_md,
  MCP_CONFIG_JSON: MCP_CONFIG_JSON_tmpl,
  OPENCODE_AGENTS_MD: OPENCODE_AGENTS_md,
  OPENCODE_JSON: OPENCODE_JSON_tmpl,
  OPENCODE_AGENT_DESIGNER_MD: OPENCODE_AGENT_DESIGNER_md,
  OPENCODE_AGENT_FRONTEND_MD: OPENCODE_AGENT_FRONTEND_md,
  OPENCODE_AGENT_BACKEND_MD: OPENCODE_AGENT_BACKEND_md,
  OPENCODE_AGENT_DEVOPS_MD: OPENCODE_AGENT_DEVOPS_md,
  OPENCODE_SKILL_CONTEXT_MD: OPENCODE_SKILL_CONTEXT_md,
  OPENCODE_SKILL_REVIEW_MD: OPENCODE_SKILL_REVIEW_md,
  OPENCODE_SKILL_TESTDRIVEN_MD: OPENCODE_SKILL_TESTDRIVEN_md,
  DEPENDENCY_AUDIT_MD: DEPENDENCY_AUDIT_md,
  INCIDENT_RESPONSE_MD: INCIDENT_RESPONSE_md,
  GEMINI_MD: GEMINI_md,
  ANTIGRAVITY_AGENTS_MD: ANTIGRAVITY_AGENTS_md,
  ANTIGRAVITY_SKILL_REVIEW_MD: ANTIGRAVITY_SKILL_REVIEW_md,
  ANTIGRAVITY_SKILL_TEST_MD: ANTIGRAVITY_SKILL_TEST_md,
  ANTIGRAVITY_WORKFLOW_SETUP_MD: ANTIGRAVITY_WORKFLOW_SETUP_md,
  ANTIGRAVITY_WORKFLOW_DEPLOY_MD: ANTIGRAVITY_WORKFLOW_DEPLOY_md,
  AIDER_CONF: AIDER_CONF_tmpl,
  AIDER_CONVENTIONS_MD: AIDER_CONVENTIONS_md,
  DOCKER_COMPOSE_YML: DOCKER_COMPOSE_tmpl,
  GITHUB_ACTIONS_CI_YML: GITHUB_ACTIONS_CI_tmpl,
};
