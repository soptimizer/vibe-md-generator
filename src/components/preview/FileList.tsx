import type { GeneratedFile, MDFileKey } from '../../types';

const CORE_KEYS: Set<MDFileKey> = new Set([
  'CLAUDE_MD', 'AGENTS_MD', 'README_MD', 'ARCHITECTURE_MD', 'PROGRESS_MD', 'GITIGNORE',
]);

interface Props {
  files: GeneratedFile[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

function FileButton({ file, index, activeIndex, onSelect }: {
  file: GeneratedFile;
  index: number;
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      className={`group relative flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left font-mono text-xs transition-colors ${
        index === activeIndex
          ? 'bg-primary/15 text-primary font-semibold border border-primary/20'
          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground border border-transparent'
      }`}
    >
      <span className="truncate">{file.filename}</span>
      {file.warning && (
        <span
          aria-label={file.warning}
          title={file.warning}
          className="ml-auto shrink-0 text-amber-400 cursor-default"
        >
          ⚠
        </span>
      )}
    </button>
  );
}

export default function FileList({ files, activeIndex, onSelect }: Props) {
  const coreFiles = files.map((f, i) => ({ file: f, index: i })).filter(({ file }) => CORE_KEYS.has(file.key));
  const contextualFiles = files.map((f, i) => ({ file: f, index: i })).filter(({ file }) => !CORE_KEYS.has(file.key));

  return (
    <aside className="flex min-w-0 h-full flex-col gap-3 rounded-xl border border-border bg-card p-2">
      {coreFiles.length > 0 && (
        <div>
          <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Core</p>
          <div className="grid gap-1">
            {coreFiles.map(({ file, index }) => (
              <FileButton key={file.key} file={file} index={index} activeIndex={activeIndex} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}
      {contextualFiles.length > 0 && (
        <div>
          <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contextual</p>
          <div className="grid gap-1">
            {contextualFiles.map(({ file, index }) => (
              <FileButton key={file.key} file={file} index={index} activeIndex={activeIndex} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
