import { useState } from 'react';
import type { GeneratedFile } from '../../types';
import FileList from './FileList';
import MDPreview from './MDPreview';
import { downloadZip } from '../../logic/exporter';
import { Button } from '../ui/button';

interface Props {
  files: GeneratedFile[];
  projectName: string;
}

export default function PreviewLayout({ files, projectName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFile = files[activeIndex];

  if (files.length === 0) {
    return (
      <div className="flex h-full min-h-64 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border/50 bg-card/30 text-muted-foreground">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-muted/30">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground/70">No files generated yet</p>
          <p className="text-xs">
            Complete the wizard and click <span className="font-semibold text-primary">Generate files</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* Toolbar */}
      <div className="shrink-0 flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2 shadow-sm">
        <div className="flex items-baseline gap-3 min-w-0">
          <h2 className="text-base font-semibold text-foreground truncate">{projectName || 'Untitled project'}</h2>
          <p className="text-xs text-muted-foreground hidden sm:block shrink-0">Browse and download generated files.</p>
        </div>
        <Button
          onClick={() => downloadZip(files, projectName || 'project')}
          size="sm"
          className="shrink-0 gap-2"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          ZIP
          <span className="rounded-full bg-primary-foreground/15 px-1.5 py-0.5 text-[10px] font-mono leading-none tabular-nums">{files.length}</span>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-3 flex-1 min-h-0">
        {/* Mobile horizontal scroll tabs */}
        <div className="sm:w-56 shrink-0 min-h-0">
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:hidden custom-scrollbar-hide">
            {files.map((file, i) => (
              <button
                key={file.key}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                  i === activeIndex
                    ? 'bg-primary/20 text-primary font-semibold border border-primary/30'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                }`}
              >
                {file.filename}
              </button>
            ))}
          </div>
          <div className="hidden sm:block h-full overflow-y-auto custom-scrollbar pr-1">
            <FileList files={files} activeIndex={activeIndex} onSelect={setActiveIndex} />
          </div>
        </div>

        {/* Preview pane */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col rounded-xl border border-border bg-card shadow-sm">
          {activeFile && <MDPreview filename={activeFile.filename} content={activeFile.content} />}
        </div>
      </div>
    </div>
  );
}
