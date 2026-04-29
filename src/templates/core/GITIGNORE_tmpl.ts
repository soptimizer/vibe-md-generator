// src/templates/core/GITIGNORE_tmpl.ts
import type { ProjectConfig } from '../../types';
import { isJSProject } from '../../logic/commands';
import {
  getBuildOutputDirs,
  getDependencyDirs,
  getOtherLockfiles,
  getPythonArtifacts,
  getSqliteFiles,
} from '../../logic/ignorePatterns';

export default function GITIGNORE_tmpl(config: ProjectConfig): string {
  const isJS = isJSProject(config);
  const buildDirs = getBuildOutputDirs(config);
  const depDirs = getDependencyDirs(config);
  const otherLocks = isJS ? getOtherLockfiles(config) : [];
  const pythonArtifacts = getPythonArtifacts(config);
  const sqliteFiles = getSqliteFiles(config);

  // Go/Rust/dotnet have language-specific extras not in getDependencyDirs
  const extraBackend: string[] = [];
  if (config.backend === 'go') extraBackend.push('/vendor/');
  if (config.backend === 'dotnet') extraBackend.push('[Oo]bj/');

  return [
    '# OS',
    '.DS_Store',
    'Thumbs.db',
    '',
    '# Editors',
    '.vscode/',
    '.idea/',
    '*.swp',
    '*.swo',
    '',
    '# Environment',
    '.env',
    '.env.local',
    '.env.*.local',
    '',
    '# Logs',
    '*.log',
    ...(isJS ? ['npm-debug.log*', 'yarn-debug.log*', 'pnpm-debug.log*'] : []),
    '',
    ...(depDirs.length > 0 ? ['# Dependencies', ...depDirs, ...otherLocks, ''] : []),
    '# Build output',
    ...buildDirs,
    ...extraBackend,
    ...(pythonArtifacts.length > 0 ? pythonArtifacts : []),
    '',
    '# Testing',
    'coverage/',
    '.nyc_output/',
    '__snapshots__/',
    '',
    ...(sqliteFiles.length > 0 ? ['# Database', ...sqliteFiles, ''] : []),
    '# Misc',
    '*.tsbuildinfo',
  ]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
}
