// src/templates/contextual/CURSORIGNORE_tmpl.ts
// Cursor indexes project files for AI context — exclude noisy/irrelevant files.
import type { ProjectConfig } from '../../types';
import {
  getBuildOutputDirs,
  getDependencyDirs,
  getTestArtifacts,
  getMediaFiles,
  getLockfile,
  getPythonArtifacts,
} from '../../logic/ignorePatterns';

export default function CURSORIGNORE_tmpl(config: ProjectConfig): string {
  return [
    '# Build & output — not useful for AI context',
    ...getBuildOutputDirs(config),
    '',
    '# Dependencies',
    ...getDependencyDirs(config),
    '',
    '# Lock files — too noisy, zero signal',
    getLockfile(config),
    '',
    '# Generated assets',
    '*.min.js',
    '*.min.css',
    '',
    '# Test artifacts',
    ...getTestArtifacts(),
    '*.snap',
    '',
    '# Media & binary',
    ...getMediaFiles(),
    '',
    '# Python artifacts',
    ...getPythonArtifacts(config),
    '',
    '# OS & editor',
    '.DS_Store',
    'Thumbs.db',
  ]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
}
