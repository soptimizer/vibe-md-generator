import { describe, it, expect } from 'vitest';
import { selectFiles } from './fileSelector';
import type { ProjectConfig } from '../types';

const base: ProjectConfig = {
  name: 'test',
  description: 'Test project',
  type: 'webapp',
  scale: 'solo',
  aiTool: 'claude',
  frontend: 'react',
  backend: 'none',
  databases: [],
  queues: [],
  packageManager: 'npm',
  hasAuth: false,
  hasPayments: false,
  hasTesting: false,
  hasDeployment: false,
  tokenEfficiency: 'balanced',
  aiRole: 'assistant',
  selectedSkills: [],
};

describe('selectFiles — always required', () => {
  it('includes CLAUDE_MD for non-codex tools', () => {
    expect(selectFiles(base)).toContain('CLAUDE_MD');
  });

  it('includes AGENTS_MD instead of CLAUDE_MD for codex', () => {
    const files = selectFiles({ ...base, aiTool: 'codex' });
    expect(files).toContain('AGENTS_MD');
    expect(files).not.toContain('CLAUDE_MD');
  });

  it('always includes README_MD, ARCHITECTURE_MD, PROGRESS_MD, GITIGNORE, LLMS_TXT', () => {
    const files = selectFiles(base);
    expect(files).toContain('README_MD');
    expect(files).toContain('ARCHITECTURE_MD');
    expect(files).toContain('PROGRESS_MD');
    expect(files).toContain('GITIGNORE');
    expect(files).toContain('LLMS_TXT');
  });
});

describe('selectFiles — AI tool files', () => {
  it('includes CLAUDE_SETTINGS_JSON and MCP_CONFIG_JSON for claude', () => {
    const files = selectFiles({ ...base, aiTool: 'claude' });
    expect(files).toContain('CLAUDE_SETTINGS_JSON');
    expect(files).toContain('MCP_CONFIG_JSON');
  });

  it('includes CURSOR_RULES_MD and CURSORIGNORE for cursor', () => {
    const files = selectFiles({ ...base, aiTool: 'cursor' });
    expect(files).toContain('CURSOR_RULES_MD');
    expect(files).toContain('CURSORIGNORE');
  });

  it('includes WINDSURFIGNORE and WINDSURF_RULES_MD for windsurf', () => {
    const files = selectFiles({ ...base, aiTool: 'windsurf' });
    expect(files).toContain('WINDSURFIGNORE');
    expect(files).toContain('WINDSURF_RULES_MD');
  });

  it('includes COPILOT_INSTRUCTIONS_MD for copilot', () => {
    const files = selectFiles({ ...base, aiTool: 'copilot' });
    expect(files).toContain('COPILOT_INSTRUCTIONS_MD');
  });
});

describe('selectFiles — scale', () => {
  it('includes TASKS_MD and GIT_WORKFLOW_MD for team projects', () => {
    const files = selectFiles({ ...base, scale: 'small-team' });
    expect(files).toContain('TASKS_MD');
    expect(files).toContain('GIT_WORKFLOW_MD');
    expect(files).toContain('CONTRIBUTING_MD');
  });

  it('does NOT include TASKS_MD for solo', () => {
    expect(selectFiles(base)).not.toContain('TASKS_MD');
  });
});

describe('selectFiles — features', () => {
  it('includes DATABASE_SCHEMA_MD when databases is non-empty', () => {
    const files = selectFiles({ ...base, databases: ['postgresql'] });
    expect(files).toContain('DATABASE_SCHEMA_MD');
  });

  it('does NOT include DATABASE_SCHEMA_MD when databases is empty', () => {
    expect(selectFiles(base)).not.toContain('DATABASE_SCHEMA_MD');
  });

  it('includes SECURITY_MD when hasAuth', () => {
    expect(selectFiles({ ...base, hasAuth: true })).toContain('SECURITY_MD');
  });

  it('includes SECURITY_MD when hasPayments', () => {
    expect(selectFiles({ ...base, hasPayments: true })).toContain('SECURITY_MD');
  });

  it('does NOT include SECURITY_MD when neither auth nor payments', () => {
    expect(selectFiles(base)).not.toContain('SECURITY_MD');
  });

  it('includes API_SPEC_MD when backend is set', () => {
    const files = selectFiles({ ...base, backend: 'nodejs' });
    expect(files).toContain('API_SPEC_MD');
  });

  it('includes API_SPEC_MD when type is api', () => {
    const files = selectFiles({ ...base, type: 'api' });
    expect(files).toContain('API_SPEC_MD');
  });

  it('includes TESTING_STRATEGY_MD when hasTesting', () => {
    expect(selectFiles({ ...base, hasTesting: true })).toContain('TESTING_STRATEGY_MD');
  });

  it('includes DEPLOYMENT_MD when hasDeployment', () => {
    expect(selectFiles({ ...base, hasDeployment: true })).toContain('DEPLOYMENT_MD');
  });

  it('includes DESIGN_SYSTEM_MD when frontend is set', () => {
    const files = selectFiles({ ...base, frontend: 'react' });
    expect(files).toContain('DESIGN_SYSTEM_MD');
  });
});

describe('selectFiles — token efficiency', () => {
  it('includes IMPLEMENTATION_PLAN_MD and TECH_STACK_MD for comprehensive', () => {
    const files = selectFiles({ ...base, tokenEfficiency: 'comprehensive' });
    expect(files).toContain('IMPLEMENTATION_PLAN_MD');
    expect(files).toContain('TECH_STACK_MD');
    expect(files).toContain('CONTEXT_MAP_MD');
  });

  it('does NOT include IMPLEMENTATION_PLAN_MD for balanced', () => {
    expect(selectFiles(base)).not.toContain('IMPLEMENTATION_PLAN_MD');
  });
});
