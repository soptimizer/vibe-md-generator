// src/templates/contextual/CLAUDE_SETTINGS_JSON_tmpl.ts
// Generates .claude/settings.json — Claude Code's native ignore mechanism.
// ignorePatterns prevents Claude from reading build output and generated files,
// keeping its context window focused on actual source code.
import type { ProjectConfig } from '../../types';
import { getClaudeIgnoreGlobs } from '../../logic/ignorePatterns';

export default function CLAUDE_SETTINGS_JSON_tmpl(config: ProjectConfig): string {
  const patterns = getClaudeIgnoreGlobs(config);
  return JSON.stringify({ ignorePatterns: patterns }, null, 2) + '\n';
}
