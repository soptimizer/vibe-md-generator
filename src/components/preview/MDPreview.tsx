import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { copyToClipboard } from '../../logic/exporter';
import { FileText, Copy, Check, Code, Eye } from 'lucide-react';

interface Props {
  filename: string;
  content: string;
  warning?: string;
}

export default function MDPreview({ filename, content, warning }: Props) {
  const [raw, setRaw]       = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(content);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div className="flex flex-col overflow-hidden h-full">
      {/* Toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-3 py-2 bg-card/60">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden="true" />
          <span className="font-mono text-xs text-muted-foreground truncate">{filename}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {/* Raw / Preview toggle */}
          <div className="flex items-center rounded-md border border-border/60 bg-muted/30 p-0.5">
            <button
              type="button"
              onClick={() => setRaw(false)}
              title="Rendered preview"
              className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors cursor-pointer ${!raw ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Eye className="h-3 w-3" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setRaw(true)}
              title="Raw markdown"
              className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors cursor-pointer ${raw ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Code className="h-3 w-3" />
              <span className="hidden sm:inline">Raw</span>
            </button>
          </div>

          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy to clipboard"
            className={`flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer ${
              copied
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Warning banner */}
      {warning && (
        <div className="flex shrink-0 items-center gap-2 border-b border-amber-500/20 bg-amber-500/8 px-3 py-2">
          <svg className="h-3.5 w-3.5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
          </svg>
          <p className="text-xs text-amber-400">{warning}</p>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        {raw ? (
          <pre className="text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap font-mono">{content}</pre>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-code:text-primary prose-a:text-primary prose-headings:text-foreground prose-p:text-foreground/85 prose-li:text-foreground/85">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
