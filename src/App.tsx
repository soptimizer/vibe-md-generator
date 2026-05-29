import { useEffect, useState } from 'react';
import { useProjectStore } from './store/projectStore';
import { selectFiles } from './logic/fileSelector';
import { encodeConfigToUrl, decodeConfigFromUrl } from './logic/exporter';
import Step1_Basics from './components/wizard/Step1_Basics';
import Step2_Stack from './components/wizard/Step2_Stack';
import Step3_Goals from './components/wizard/Step3_Goals';
import Step4_Skills from './components/wizard/Step4_Skills';
import Step5_Review from './components/wizard/Step5_Review';
import PreviewLayout from './components/preview/PreviewLayout';
import ErrorBoundary from './components/ErrorBoundary';

const STEPS = [
  { label: 'Basics',   num: 1 },
  { label: 'Stack',    num: 2 },
  { label: 'Features', num: 3 },
  { label: 'Skills',   num: 4 },
  { label: 'Review',   num: 5 },
];

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="2 6 5 9 10 3" />
    </svg>
  );
}

function StepIndicator({ current, onNavigate }: { current: number; onNavigate: (step: number) => void }) {
  return (
    <div className="flex items-center gap-0 shrink-0">
      {STEPS.map(({ label, num }, i) => {
        const isActive = num === current;
        const isDone   = num < current;
        return (
          <div key={label} className="flex items-center">
            <button
              type="button"
              onClick={() => isDone && onNavigate(num)}
              disabled={!isDone}
              className={`group flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors duration-150 ${
                isDone ? 'cursor-pointer hover:bg-primary/10' : 'cursor-default'
              }`}
            >
              {/* Circle */}
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md glow-primary-sm'
                    : isDone
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-muted/60 text-muted-foreground border border-border'
                }`}
              >
                {isDone ? <CheckIcon /> : num}
              </span>
              {/* Label */}
              <span
                className={`text-xs font-medium transition-colors duration-150 whitespace-nowrap ${
                  isActive ? 'text-foreground' : isDone ? 'text-primary/80' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </button>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div className="h-px w-3 shrink-0 mx-0.5 transition-colors duration-300" style={{
                background: isDone
                  ? 'oklch(0.62 0.22 264 / 0.5)'
                  : 'oklch(1 0 0 / 10%)',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function WizardStep({ step }: { step: number }) {
  if (step === 1) return <Step1_Basics />;
  if (step === 2) return <Step2_Stack />;
  if (step === 3) return <Step3_Goals />;
  if (step === 4) return <Step4_Skills />;
  return <Step5_Review />;
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export default function App() {
  const { step, setStep, generatedFiles, config, reset, theme, toggleTheme, updateConfig } = useProjectStore();
  const [linkCopied, setLinkCopied] = useState(false);
  const selectedKeys = selectFiles(config);

  // Load config from shared URL on first mount
  useEffect(() => {
    const shared = decodeConfigFromUrl();
    if (shared) {
      updateConfig(shared);
      // Clear the URL param after loading
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stackLabel = config.frontend !== 'none'
    ? config.frontend
    : config.backend !== 'none'
    ? config.backend
    : null;

  const handleCopyLink = async () => {
    if (!config.name.trim()) return;
    const url = encodeConfigToUrl(config);
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Clipboard unavailable — silently ignore
    }
  };

  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden">
      {/* ── Top bar ── */}
      <header className="shrink-0 flex items-center justify-between gap-4 border-b border-border/60 bg-card/60 backdrop-blur-sm px-4 py-2.5">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 border border-primary/25 glow-primary-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M9.5 13h5M9.5 17h3" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight gradient-text leading-none">VibeMD Generator</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">AI-context Markdown files</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-border/60 shrink-0 hidden sm:block" />

        {/* Step indicator */}
        <div className="flex-1 flex justify-center min-w-0 overflow-x-auto custom-scrollbar-hide">
          <StepIndicator current={step} onNavigate={setStep} />
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-border/60 shrink-0 hidden sm:block" />

        {/* Share link button */}
        <button
          type="button"
          onClick={handleCopyLink}
          disabled={!config.name.trim()}
          title={config.name.trim() ? 'Copy shareable config link' : 'Enter a project name first'}
          className={`shrink-0 flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-xs font-medium transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
            linkCopied
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'border-border/60 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40'
          }`}
        >
          <LinkIcon />
          <span className="hidden sm:inline">{linkCopied ? 'Copied!' : 'Share'}</span>
        </button>

        {/* Dark / Light toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="shrink-0 flex items-center justify-center h-8 w-8 rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors duration-150 cursor-pointer"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={() => { if (window.confirm('Reset all wizard progress? This cannot be undone.')) reset(); }}
          title="Reset all progress"
          className="shrink-0 flex items-center justify-center h-8 w-8 rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/8 transition-colors duration-150 cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </header>

      {/* ── Live config strip ── */}
      <div className="shrink-0 flex items-center gap-2 border-b border-border/40 bg-background/60 px-4 py-1.5 overflow-x-auto custom-scrollbar-hide">
        <span className="text-[9px] uppercase tracking-[0.22em] font-bold text-primary/80 shrink-0">Live</span>
        <div className="h-3 w-px bg-border/60 shrink-0" />
        <span className="text-xs font-semibold text-foreground/90 shrink-0 truncate max-w-[160px]">
          {config.name || 'Untitled'}
        </span>
        {config.type && (
          <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary shrink-0">
            {config.type}
          </span>
        )}
        {stackLabel && (
          <span className="inline-flex items-center rounded-full bg-accent/60 border border-border/60 px-2 py-0.5 text-[10px] font-medium text-foreground/70 shrink-0">
            {stackLabel}
          </span>
        )}
        {config.aiTool && (
          <span className="inline-flex items-center rounded-full bg-accent/60 border border-border/60 px-2 py-0.5 text-[10px] font-medium text-foreground/70 shrink-0 hidden md:inline-flex">
            {config.aiTool}
          </span>
        )}
        <div className="flex-1" />
        <span className="shrink-0 text-[10px] font-semibold text-muted-foreground">
          {selectedKeys.length} <span className="font-normal">files</span>
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 min-h-0 grid gap-0 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
        {/* Left — Wizard */}
        <div className="flex flex-col h-full border-r border-border/40 overflow-hidden">
          <div className="p-3 sm:p-4">
            <ErrorBoundary>
              <div className="animate-scale-in">
                <WizardStep step={step} />
              </div>
            </ErrorBoundary>
          </div>
        </div>

        {/* Right — Preview */}
        <div className="flex flex-col h-full min-h-0 overflow-hidden p-3 sm:p-4">
          <ErrorBoundary>
            <PreviewLayout files={generatedFiles} projectName={config.name} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
