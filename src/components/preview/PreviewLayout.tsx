import { useState } from 'react';
import type { GeneratedFile } from '../../types';
import FileList from './FileList';
import MDPreview from './MDPreview';
import { downloadZip } from '../../logic/exporter';
import { Download, FileText, Sparkles } from 'lucide-react';
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
      <div className="flex h-full min-h-64 flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border/40 bg-card/20">
        {/* Glowing placeholder icon */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-lg" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card">
            <FileText className="h-7 w-7 text-primary/60" aria-hidden="true" />
          </div>
        </div>
        <div className="text-center space-y-2 max-w-xs">
          <p className="text-sm font-semibold text-foreground/80">No files generated yet</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Complete the wizard steps and click{' '}
            <span className="font-semibold text-primary">Generate files</span>{' '}
            to preview your Markdown context files here.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50">
          <Sparkles className="h-3 w-3" />
          <span>AI-ready context • ZIP export</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* Toolbar */}
      <div className="shrink-0 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/80 px-3 py-2 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <FileText className="h-4 w-4 shrink-0 text-primary/60" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground truncate">{projectName || 'Untitled project'}</h2>
          <span className="text-xs text-muted-foreground hidden sm:block shrink-0">— generated files</span>
        </div>
        <Button
          onClick={() => downloadZip(files, projectName || 'project')}
          size="sm"
          className="shrink-0 gap-2"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          <span>ZIP</span>
          <span className="rounded-full bg-primary-foreground/15 px-1.5 py-0.5 text-[10px] font-mono leading-none tabular-nums">
            {files.length}
          </span>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row flex-1 min-h-0">
        {/* Mobile: horizontal tabs */}
        <div className="sm:w-52 shrink-0 min-h-0">
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:hidden custom-scrollbar-hide">
            {files.map((file, i) => (
              <button
                key={file.key}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 rounded-md px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer ${
                  i === activeIndex
                    ? 'bg-primary/15 text-primary font-semibold border border-primary/25'
                    : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                }`}
              >
                {file.filename}
              </button>
            ))}
          </div>
          {/* Desktop: file list sidebar */}
          <div className="hidden sm:block h-full overflow-y-auto custom-scrollbar pr-0.5">
            <FileList files={files} activeIndex={activeIndex} onSelect={setActiveIndex} />
          </div>
        </div>

        {/* Preview pane */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col rounded-xl border border-border/60 bg-card shadow-md shadow-black/20">
          {activeFile && <MDPreview filename={activeFile.filename} content={activeFile.content} warning={activeFile.warning} />}
        </div>
      </div>
    </div>
  );
}
