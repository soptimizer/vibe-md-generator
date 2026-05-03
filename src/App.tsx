import { useProjectStore } from './store/projectStore';
import { selectFiles } from './logic/fileSelector';
import Step1_Basics from './components/wizard/Step1_Basics';
import Step2_Stack from './components/wizard/Step2_Stack';
import Step3_Goals from './components/wizard/Step3_Goals';
import Step4_Review from './components/wizard/Step4_Review';
import PreviewLayout from './components/preview/PreviewLayout';
import ErrorBoundary from './components/ErrorBoundary';

const STEPS = [
  { label: 'Basics',   num: 1 },
  { label: 'Stack',    num: 2 },
  { label: 'Features', num: 3 },
  { label: 'Review',   num: 4 },
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
  return <Step4_Review />;
}

export default function App() {
  const { step, setStep, generatedFiles, config, reset } = useProjectStore();
  const selectedKeys = selectFiles(config);
  const stackLabel = config.frontend !== 'none'
    ? config.frontend
    : config.backend !== 'none'
    ? config.backend
    : null;

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
        <div className="flex flex-col h-full border-r border-border/40 overflow-y-auto overflow-x-hidden custom-scrollbar">
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
