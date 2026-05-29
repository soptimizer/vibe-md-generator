// src/types/index.ts

export type ProjectType = 'webapp' | 'api' | 'service' | 'game' | 'cli' | 'library' | 'mobile';
export type ProjectScale = 'solo' | 'small-team' | 'enterprise';
export type AITool = 'claude' | 'cursor' | 'windsurf' | 'codex' | 'copilot' | 'generic';
export type Frontend = 'react' | 'vue' | 'nextjs' | 'svelte' | 'vanilla' | 'none';
export type Backend = 'nodejs' | 'python' | 'go' | 'rust' | 'dotnet' | 'none';
export type Database = 'postgresql' | 'mongodb' | 'sqlite' | 'mysql' | 'redis' | 'elastic' | 'bigquery' | 'clickhouse';
export type Queue = 'kafka' | 'rabbitmq';
export type TokenEfficiency = 'minimal' | 'balanced' | 'comprehensive';
export type AIRole = 'assistant' | 'pair-programmer' | 'reviewer-only';

export interface ProjectConfig {
  // Step 1
  name: string;
  description: string;
  type: ProjectType;
  scale: ProjectScale;
  aiTool: AITool;

  // Step 2
  frontend: Frontend;
  backend: Backend;
  databases: Database[];
  queues: Queue[];
  packageManager: 'npm' | 'pnpm' | 'bun' | 'yarn';

  // Step 3
  hasAuth: boolean;
  hasPayments: boolean;
  hasTesting: boolean;
  hasDeployment: boolean;
  tokenEfficiency: TokenEfficiency;
  aiRole: AIRole;

  // Step 4
  selectedSkills: string[];
}

export type MDFileKey =
  | 'CLAUDE_MD'
  | 'AGENTS_MD'
  | 'README_MD'
  | 'ARCHITECTURE_MD'
  | 'PROGRESS_MD'
  | 'TASKS_MD'
  | 'IMPLEMENTATION_PLAN_MD'
  | 'TECH_STACK_MD'
  | 'DATABASE_SCHEMA_MD'
  | 'SECURITY_MD'
  | 'API_SPEC_MD'
  | 'TESTING_STRATEGY_MD'
  | 'PRD_MD'
  | 'CURSOR_RULES_MD'
  | 'GITIGNORE'
  | 'CURSORIGNORE'
  | 'WINDSURFIGNORE'
  | 'CLAUDE_SETTINGS_JSON'
  | 'DEPLOYMENT_MD'
  | 'GIT_WORKFLOW_MD'
  | 'DESIGN_SYSTEM_MD'
  | 'CONTRIBUTING_MD'
  | 'DECISIONS_MD'
  | 'CONTEXT_MAP_MD'
  | 'ERROR_HANDLING_MD'
  | 'LLMS_TXT'
  | 'COPILOT_INSTRUCTIONS_MD'
  | 'WINDSURF_RULES_MD'
  | 'MCP_CONFIG_JSON';

export interface GeneratedFile {
  key: MDFileKey;
  filename: string;
  content: string;
  warning?: string;
}

export interface WizardStore {
  step: number;
  config: ProjectConfig;
  generatedFiles: GeneratedFile[];
  setStep: (step: number) => void;
  updateConfig: (partial: Partial<ProjectConfig>) => void;
  generateFiles: () => void;
  reset: () => void;
}
