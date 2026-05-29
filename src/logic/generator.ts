// src/logic/generator.ts
import type { ProjectConfig, GeneratedFile, MDFileKey } from '../types';
import { selectFiles, getFilename } from './fileSelector';
import { templateRegistry } from '../templates';

const LINE_LIMIT = 150;
const LINE_LIMIT_KEYS = new Set<string>(['CLAUDE_MD', 'AGENTS_MD']);

// Files that get a "See Also" cross-reference footer (MD files only, not configs/ignores)
const CROSS_REF_SKIP: Set<MDFileKey> = new Set([
  'GITIGNORE', 'CURSORIGNORE', 'WINDSURFIGNORE',
  'CLAUDE_SETTINGS_JSON', 'MCP_CONFIG_JSON', 'OPENCODE_JSON',
  'AIDER_CONF', 'DOCKER_COMPOSE_YML', 'GITHUB_ACTIONS_CI_YML',
  'LLMS_TXT',
]);

// Which keys make sense to cross-reference from any given file
const CROSS_REF_CANDIDATES: MDFileKey[] = [
  'ARCHITECTURE_MD', 'DATABASE_SCHEMA_MD', 'API_SPEC_MD',
  'SECURITY_MD', 'TESTING_STRATEGY_MD', 'DEPLOYMENT_MD',
  'DESIGN_SYSTEM_MD', 'ERROR_HANDLING_MD',
];

function addCrossReferences(files: GeneratedFile[]): GeneratedFile[] {
  const keyToFile = new Map<MDFileKey, GeneratedFile>(files.map((f) => [f.key, f]));
  const candidatesPresent = CROSS_REF_CANDIDATES.filter((k) => keyToFile.has(k));

  if (candidatesPresent.length === 0) return files;

  return files.map((file) => {
    if (CROSS_REF_SKIP.has(file.key)) return file;
    if (!file.filename.endsWith('.md') && !file.filename.endsWith('.mdc')) return file;

    // Don't cross-ref a file to itself
    const refs = candidatesPresent
      .filter((k) => k !== file.key)
      .map((k) => `- [${keyToFile.get(k)!.filename}](${keyToFile.get(k)!.filename})`);

    if (refs.length === 0) return file;

    const footer = `\n---\n## See Also\n${refs.join('\n')}\n`;
    return { ...file, content: file.content + footer };
  });
}

export function generateFiles(config: ProjectConfig): GeneratedFile[] {
  const selectedKeys = selectFiles(config);

  const files = selectedKeys.map((key) => {
    const content = templateRegistry[key](config);
    const lineCount = content.split('\n').length;
    const warning =
      LINE_LIMIT_KEYS.has(key) && lineCount > LINE_LIMIT
        ? `This file exceeds 150 lines. AI instruction-following quality may decrease. Consider splitting into multiple reference files.`
        : undefined;

    return { key, filename: getFilename(key, config), content, warning };
  });

  return addCrossReferences(files);
}
