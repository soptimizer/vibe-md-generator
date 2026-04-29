// src/logic/exporter.ts
import type { GeneratedFile } from '../types';

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
