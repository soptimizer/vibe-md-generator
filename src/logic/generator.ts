// src/logic/generator.ts
import type { ProjectConfig, GeneratedFile } from '../types';
import { selectFiles, getFilename } from './fileSelector';
import { templateRegistry } from '../templates';

const LINE_LIMIT = 150;
const LINE_LIMIT_KEYS = new Set<string>(['CLAUDE_MD', 'AGENTS_MD']);

export function generateFiles(config: ProjectConfig): GeneratedFile[] {
  const selectedKeys = selectFiles(config);

  return selectedKeys.map((key) => {
    const content = templateRegistry[key](config);
    const lineCount = content.split('\n').length;
    const warning =
      LINE_LIMIT_KEYS.has(key) && lineCount > LINE_LIMIT
        ? `This file exceeds 150 lines. AI instruction-following quality may decrease. Consider splitting into multiple reference files.`
        : undefined;

    return { key, filename: getFilename(key, config), content, warning };
  });
}
