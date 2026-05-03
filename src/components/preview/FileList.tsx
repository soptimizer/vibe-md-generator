import type { GeneratedFile, MDFileKey } from '../../types';
import { AlertTriangle, FileText, FileJson, GitBranchPlus } from 'lucide-react';

const CORE_KEYS: Set<MDFileKey> = new Set([
  'CLAUDE_MD', 'AGENTS_MD', 'README_MD', 'ARCHITECTURE_MD', 'PROGRESS_MD', 'GITIGNORE',
]);

interface Props {
  files: GeneratedFile[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

function getFileIcon(filename: string) {
  if (filename.endsWith('.json')) return <FileJson className="h-3 w-3 text-amber-400 shrink-0" />;
  if (filename === '.gitignore') return <GitBranchPlus className="h-3 w-3 text-emerald-400 shrink-0" />;
  return <FileText className="h-3 w-3 text-muted-foreground shrink-0" />;
}

function FileButton({ file, index, activeIndex, onSelect }: {
  file: GeneratedFile; index: number; activeIndex: number; onSelect: (i: number) => void;
}) {
  const isActive = index === activeIndex;
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      className={`file-btn group relative flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left cursor-pointer transition-colors ${
        isActive
          ? 'bg-primary/12 text-primary border border-primary/25'
          : 'text-muted-foreground hover:text-foreground border border-transparent'
      }`}
    >
      {getFileIcon(file.filename)}
      <span className="font-mono text-[11px] truncate flex-1">{file.filename}</span>
      {file.warning && (
        <span className="ml-auto" aria-label={file.warning} title={file.warning}>
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
        </span>
      )}
    </button>
  );
}

export default function FileList({ files, activeIndex, onSelect }: Props) {
  const coreFiles       = files.map((f, i) => ({ file: f, index: i })).filter(({ file }) =>  CORE_KEYS.has(file.key));
  const contextualFiles = files.map((f, i) => ({ file: f, index: i })).filter(({ file }) => !CORE_KEYS.has(file.key));

  return (
    <aside className="flex min-w-0 h-full flex-col gap-3 rounded-xl border border-border/60 bg-card/80 p-2">
      {coreFiles.length > 0 && (
        <div>
          <p className="mb-1.5 px-1 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Core</p>
          <div className="grid gap-0.5">
            {coreFiles.map(({ file, index }) => (
              <FileButton key={file.key} file={file} index={index} activeIndex={activeIndex} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}
      {contextualFiles.length > 0 && (
        <div>
          <p className="mb-1.5 px-1 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Contextual</p>
          <div className="grid gap-0.5">
            {contextualFiles.map(({ file, index }) => (
              <FileButton key={file.key} file={file} index={index} activeIndex={activeIndex} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
