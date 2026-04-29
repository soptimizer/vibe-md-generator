// src/templates/contextual/WINDSURFIGNORE_tmpl.ts
// Windsurf indexes project files for AI context — exclude noisy/irrelevant files
import type { ProjectConfig } from '../../types';
import CURSORIGNORE_tmpl from './CURSORIGNORE_tmpl';

// Windsurf uses the same gitignore syntax and same indexing philosophy as Cursor
export default function WINDSURFIGNORE_tmpl(config: ProjectConfig): string {
  return CURSORIGNORE_tmpl(config);
}
