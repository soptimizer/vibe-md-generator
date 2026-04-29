import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { copyToClipboard } from '../../logic/exporter';
import { Button } from '../ui/button';

interface Props {
  filename: string;
  content: string;
}

export default function MDPreview({ filename, content }: Props) {
  const [raw, setRaw] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(content);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2 bg-muted/10">
        <div className="flex items-center gap-2 min-w-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary" aria-hidden="true">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="font-mono text-xs text-muted-foreground truncate">{filename}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRaw((r) => !r)}
            className="h-6 text-xs px-2.5"
          >
            {raw ? 'Preview' : 'Raw'}
          </Button>
          <Button
            variant={copied ? 'secondary' : 'ghost'}
            size="sm"
            onClick={handleCopy}
            className="h-6 text-xs px-2.5 min-w-[52px]"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
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
