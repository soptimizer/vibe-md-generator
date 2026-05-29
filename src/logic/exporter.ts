// src/logic/exporter.ts
import type { GeneratedFile, ProjectConfig } from '../types';
import LZString from 'lz-string';

export async function copyToClipboard(content: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    return false;
  }
}

export async function downloadZip(files: GeneratedFile[], projectName: string): Promise<void> {
  // Dynamic import to keep bundle lean
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  files.forEach(({ filename, content }) => {
    zip.file(filename, content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-md-files.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

export function encodeConfigToUrl(config: ProjectConfig): string {
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(config));
  return `${window.location.origin}${window.location.pathname}?c=${compressed}`;
}

export function decodeConfigFromUrl(): ProjectConfig | null {
  const params = new URLSearchParams(window.location.search);
  const c = params.get('c');
  if (!c) return null;
  try {
    const json = LZString.decompressFromEncodedURIComponent(c);
    if (!json) return null;
    return JSON.parse(json) as ProjectConfig;
  } catch {
    return null;
  }
}
