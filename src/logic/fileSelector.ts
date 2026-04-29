// src/logic/fileSelector.ts
import type { ProjectConfig, MDFileKey } from '../types';

export function selectFiles(config: ProjectConfig): MDFileKey[] {
  const files: MDFileKey[] = [];

  // Always required
  files.push(config.aiTool === 'codex' ? 'AGENTS_MD' : 'CLAUDE_MD');
  files.push('PRD_MD');
  files.push('README_MD');
  files.push('ARCHITECTURE_MD');
  files.push('PROGRESS_MD');
  files.push('GITIGNORE');

  // AI tool-specific ignore & rules files
  if (config.aiTool === 'claude') {
    files.push('CLAUDE_SETTINGS_JSON');
  }
  if (config.aiTool === 'cursor') {
    files.push('CURSOR_RULES_MD');
    files.push('CURSORIGNORE');
  }
  if (config.aiTool === 'windsurf') {
    files.push('WINDSURFIGNORE');
  }

  // Team projects
  if (config.scale !== 'solo') {
    files.push('TASKS_MD');
  }

  // Comprehensive token mode adds planning docs
  if (config.tokenEfficiency === 'comprehensive') {
    files.push('IMPLEMENTATION_PLAN_MD');
    files.push('TECH_STACK_MD');
  }

  // Database
  if (config.databases.length > 0) {
    files.push('DATABASE_SCHEMA_MD');
  }

  // Security-sensitive
  if (config.hasAuth || config.hasPayments) {
    files.push('SECURITY_MD');
  }

  // API projects
  if (config.type === 'api' || config.backend !== 'none') {
    files.push('API_SPEC_MD');
  }

  // Testing
  if (config.hasTesting) {
    files.push('TESTING_STRATEGY_MD');
  }

  // Deployment guide
  if (config.hasDeployment) {
    files.push('DEPLOYMENT_MD');
  }

  // Git workflow + contributing guide for team projects
  if (config.scale !== 'solo') {
    files.push('GIT_WORKFLOW_MD');
    files.push('CONTRIBUTING_MD');
  }

  // Design system for frontend projects
  if (config.frontend !== 'none') {
    files.push('DESIGN_SYSTEM_MD');
  }

  // Architectural decision log for team or comprehensive projects
  if (config.tokenEfficiency === 'comprehensive' || config.scale !== 'solo') {
    files.push('DECISIONS_MD');
  }

  // Context map for comprehensive token mode
  if (config.tokenEfficiency === 'comprehensive') {
    files.push('CONTEXT_MAP_MD');
  }

  // Error handling guide for any project with a real frontend or backend
  if (config.frontend !== 'none' || config.backend !== 'none') {
    files.push('ERROR_HANDLING_MD');
  }

  return files;
}

export function getFilename(key: MDFileKey, config: ProjectConfig): string {
  const map: Record<MDFileKey, string> = {
    CLAUDE_MD: 'CLAUDE.md',
    AGENTS_MD: 'AGENTS.md',
    README_MD: 'README.md',
    ARCHITECTURE_MD: 'ARCHITECTURE.md',
    PROGRESS_MD: 'PROGRESS.md',
    TASKS_MD: 'TASKS.md',
    IMPLEMENTATION_PLAN_MD: 'IMPLEMENTATION_PLAN.md',
    TECH_STACK_MD: 'TECH_STACK.md',
    DATABASE_SCHEMA_MD: 'DATABASE_SCHEMA.md',
    SECURITY_MD: 'SECURITY.md',
    API_SPEC_MD: 'API_SPEC.md',
    TESTING_STRATEGY_MD: 'TESTING_STRATEGY.md',
    PRD_MD: 'PRD.md',
    CURSOR_RULES_MD: '.cursor/rules/project.mdc',
    GITIGNORE: '.gitignore',
    CURSORIGNORE: '.cursorignore',
    WINDSURFIGNORE: '.windsurfignore',
    CLAUDE_SETTINGS_JSON: '.claude/settings.json',
    DEPLOYMENT_MD: 'DEPLOYMENT.md',
    GIT_WORKFLOW_MD: 'GIT_WORKFLOW.md',
    DESIGN_SYSTEM_MD: 'DESIGN_SYSTEM.md',
    CONTRIBUTING_MD: 'CONTRIBUTING.md',
    DECISIONS_MD: 'DECISIONS.md',
    CONTEXT_MAP_MD: 'CONTEXT_MAP.md',
    ERROR_HANDLING_MD: 'ERROR_HANDLING.md',
  };
  return map[key];
}
