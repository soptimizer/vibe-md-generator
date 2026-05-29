// src/logic/fileSelector.ts
import type { ProjectConfig, MDFileKey } from '../types';

export function selectFiles(config: ProjectConfig): MDFileKey[] {
  const files: MDFileKey[] = [];

  // Always required
  if (config.aiTool === 'codex') files.push('AGENTS_MD');
  else if (config.aiTool === 'opencode') files.push('OPENCODE_AGENTS_MD');
  else if (config.aiTool === 'antigravity') files.push('GEMINI_MD');
  else files.push('CLAUDE_MD');
  files.push('PRD_MD');
  files.push('README_MD');
  files.push('ARCHITECTURE_MD');
  files.push('PROGRESS_MD');
  files.push('GITIGNORE');
  files.push('LLMS_TXT');

  // AI tool-specific ignore & rules files
  if (config.aiTool === 'claude') {
    files.push('CLAUDE_SETTINGS_JSON');
    files.push('MCP_CONFIG_JSON');
  }
  if (config.aiTool === 'cursor') {
    files.push('CURSOR_RULES_MD');
    files.push('CURSORIGNORE');
  }
  if (config.aiTool === 'windsurf') {
    files.push('WINDSURFIGNORE');
    files.push('WINDSURF_RULES_MD');
  }
  if (config.aiTool === 'copilot') {
    files.push('COPILOT_INSTRUCTIONS_MD');
  }
  if (config.aiTool === 'opencode') {
    files.push('OPENCODE_JSON');
    files.push('OPENCODE_SKILL_CONTEXT_MD');
    files.push('OPENCODE_SKILL_REVIEW_MD');
    if (config.hasTesting) files.push('OPENCODE_SKILL_TESTDRIVEN_MD');
    if (config.frontend !== 'none') {
      files.push('OPENCODE_AGENT_DESIGNER_MD');
      files.push('OPENCODE_AGENT_FRONTEND_MD');
    }
    if (config.backend !== 'none') files.push('OPENCODE_AGENT_BACKEND_MD');
    if (config.hasDeployment) files.push('OPENCODE_AGENT_DEVOPS_MD');
  }
  if (config.aiTool === 'antigravity') {
    files.push('ANTIGRAVITY_AGENTS_MD');
    files.push('ANTIGRAVITY_SKILL_REVIEW_MD');
    files.push('ANTIGRAVITY_WORKFLOW_SETUP_MD');
    if (config.hasTesting) files.push('ANTIGRAVITY_SKILL_TEST_MD');
    if (config.hasDeployment) files.push('ANTIGRAVITY_WORKFLOW_DEPLOY_MD');
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

  // API / service projects
  if (config.type === 'api' || config.type === 'service' || config.backend !== 'none') {
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

  // Dependency audit for team projects or projects with deployment
  if (config.hasDeployment || config.scale !== 'solo') {
    files.push('DEPENDENCY_AUDIT_MD');
  }

  // Incident response for team projects with deployment
  if (config.hasDeployment && config.scale !== 'solo') {
    files.push('INCIDENT_RESPONSE_MD');
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
    LLMS_TXT: 'llms.txt',
    COPILOT_INSTRUCTIONS_MD: '.github/copilot-instructions.md',
    WINDSURF_RULES_MD: 'WINDSURF_RULES.md',
    MCP_CONFIG_JSON: '.claude/mcp.json',
    OPENCODE_AGENTS_MD: 'AGENTS.md',
    OPENCODE_JSON: 'opencode.json',
    OPENCODE_AGENT_DESIGNER_MD: '.agent/agents/designer.md',
    OPENCODE_AGENT_FRONTEND_MD: '.agent/agents/frontend-dev.md',
    OPENCODE_AGENT_BACKEND_MD: '.agent/agents/backend-dev.md',
    OPENCODE_AGENT_DEVOPS_MD: '.agent/agents/devops.md',
    OPENCODE_SKILL_CONTEXT_MD: '.agent/skills/project-context-primer/SKILL.md',
    OPENCODE_SKILL_REVIEW_MD: '.agent/skills/code-review/SKILL.md',
    OPENCODE_SKILL_TESTDRIVEN_MD: '.agent/skills/test-driven-execution/SKILL.md',
    DEPENDENCY_AUDIT_MD: 'DEPENDENCY_AUDIT.md',
    INCIDENT_RESPONSE_MD: 'INCIDENT_RESPONSE.md',
    GEMINI_MD: 'GEMINI.md',
    ANTIGRAVITY_AGENTS_MD: 'AGENTS.md',
    ANTIGRAVITY_SKILL_REVIEW_MD: '.agent/skills/review.md',
    ANTIGRAVITY_SKILL_TEST_MD: '.agent/skills/test.md',
    ANTIGRAVITY_WORKFLOW_SETUP_MD: '.agent/workflows/setup.md',
    ANTIGRAVITY_WORKFLOW_DEPLOY_MD: '.agent/workflows/deploy.md',
  };
  return map[key];
}
