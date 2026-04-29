// src/logic/ignorePatterns.ts
// Single source of truth for all AI/VCS ignore patterns.
// GITIGNORE_tmpl, CURSORIGNORE_tmpl, WINDSURFIGNORE_tmpl, and CLAUDE_SETTINGS_JSON_tmpl
// all derive their patterns from here so they never drift.
import type { ProjectConfig } from '../types';

export function getBuildOutputDirs(config: ProjectConfig): string[] {
  if (config.frontend === 'nextjs') return ['.next/', 'out/'];
  if (config.frontend !== 'none') return ['dist/', 'build/'];
  if (config.backend === 'go') return ['bin/', 'tmp/'];
  if (config.backend === 'rust') return ['target/'];
  if (config.backend === 'dotnet') return ['bin/', 'obj/'];
  if (config.backend !== 'none') return ['dist/', 'build/'];
  return ['dist/', 'build/'];
}

export function getDependencyDirs(config: ProjectConfig): string[] {
  const dirs: string[] = [];
  if (config.frontend !== 'none' || config.backend === 'nodejs') dirs.push('node_modules/');
  if (config.backend === 'python') dirs.push('.venv/', 'venv/', '__pycache__/');
  if (config.backend === 'go') dirs.push('vendor/');
  return dirs;
}

export function getTestArtifacts(): string[] {
  return ['coverage/', '.nyc_output/', '__snapshots__/'];
}

export function getMediaFiles(): string[] {
  return ['*.png', '*.jpg', '*.jpeg', '*.gif', '*.ico', '*.mp4', '*.mp3', '*.woff', '*.woff2', '*.ttf'];
}

export function getLockfile(config: ProjectConfig): string {
  const map: Record<string, string> = {
    npm: 'package-lock.json',
    yarn: 'yarn.lock',
    pnpm: 'pnpm-lock.yaml',
    bun: 'bun.lockb',
  };
  return map[config.packageManager] ?? 'package-lock.json';
}

export function getOtherLockfiles(config: ProjectConfig): string[] {
  const all: Record<string, string[]> = {
    npm: ['yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
    yarn: ['package-lock.json', 'pnpm-lock.yaml', 'bun.lockb'],
    pnpm: ['package-lock.json', 'yarn.lock', 'bun.lockb'],
    bun: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'],
  };
  return all[config.packageManager] ?? [];
}

export function getPythonArtifacts(config: ProjectConfig): string[] {
  if (config.backend !== 'python') return [];
  return ['*.pyc', '*.pyo', '*.egg-info/'];
}

export function getSqliteFiles(config: ProjectConfig): string[] {
  if (!config.databases.includes('sqlite')) return [];
  return ['*.sqlite', '*.db', '*.db-journal'];
}

/** Flat glob list suitable for .claude/settings.json ignorePatterns (no trailing slash). */
export function getClaudeIgnoreGlobs(config: ProjectConfig): string[] {
  return [
    ...getBuildOutputDirs(config).map((d) => `${d.replace(/\/$/, '')}/**`),
    ...getDependencyDirs(config).map((d) => `${d.replace(/\/$/, '')}/**`),
    ...getTestArtifacts().map((d) => `${d.replace(/\/$/, '')}/**`),
    '*.min.js',
    '*.min.css',
    '*.snap',
    ...getMediaFiles(),
    ...getPythonArtifacts(config),
    ...getSqliteFiles(config),
    'logs/**',
    '*.log',
  ];
}
