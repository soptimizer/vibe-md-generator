import { useProjectStore } from './store/projectStore';
import { selectFiles } from './logic/fileSelector';
import Step1_Basics from './components/wizard/Step1_Basics';
import Step2_Stack from './components/wizard/Step2_Stack';
import Step3_Goals from './components/wizard/Step3_Goals';
import Step4_Review from './components/wizard/Step4_Review';
import PreviewLayout from './components/preview/PreviewLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { Button } from '@/components/ui/button';

const STEP_LABELS = ['Basics', 'Stack', 'Features', 'Review'];

function StepIndicator({ current, onNavigate }: { current: number; onNavigate: (step: number) => void }) {
  return (
    <div className="flex flex-nowrap items-center gap-1 sm:gap-1.5 overflow-x-auto custom-scrollbar-hide pb-2 shrink-0">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isDone = stepNum < current;
        return (
          <div key={label} className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => isDone && onNavigate(stepNum)}
              disabled={!isDone}
              className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                  : isDone
                  ? 'cursor-pointer bg-primary/20 text-primary hover:bg-primary/35'
                  : 'cursor-default bg-muted text-muted-foreground'
              }`}
            >
              {isDone ? '✓' : stepNum}
            </button>
            <span className={`text-xs sm:text-sm whitespace-nowrap transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              {label}
            </span>
            {i < STEP_LABELS.length - 1 && (
              <div className={`h-px w-2 sm:w-4 shrink-0 transition-colors ${isDone ? 'bg-primary/40' : 'bg-border'}`} />
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
    : '—';

  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden">
      <div className="flex flex-col h-full w-full p-3 sm:px-4 sm:py-3">
        {/* Header */}
        <header className="mb-3 shrink-0 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M10 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
                <path d="m20 17-1.09-1.09M14.91 15.91 16 17" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl leading-tight">VibeMD Generator</h1>
              <p className="text-xs text-muted-foreground">
                Generate AI-context Markdown files for your project.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (window.confirm('Reset all wizard progress? This cannot be undone.')) reset();
            }}
            className="shrink-0 text-muted-foreground hover:text-destructive hover:border-destructive transition-colors self-start sm:self-auto"
          >
            Reset
          </Button>
        </header>

        <div className="flex-1 min-h-0 grid gap-4 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
          {/* Left — Wizard */}
          <div className="flex flex-col h-full space-y-3 overflow-y-auto overflow-x-hidden pr-1 pb-4 custom-scrollbar">
            <StepIndicator current={step} onNavigate={setStep} />
            <ErrorBoundary>
              <WizardStep step={step} />
            </ErrorBoundary>
          </div>

          {/* Right — Preview + summary */}
          <div className="flex flex-col h-full space-y-3 min-h-0 overflow-hidden pb-2">
            {/* Live config bar */}
            <div className="shrink-0 flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2 shadow-sm overflow-x-auto custom-scrollbar-hide">
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary whitespace-nowrap">Live config</span>
                <span className="text-sm font-semibold text-foreground whitespace-nowrap">{config.name || 'Untitled project'}</span>
                <span className="h-4 w-px bg-border" />
                <span className="text-xs text-muted-foreground whitespace-nowrap">{config.type}</span>
                <span className="h-4 w-px bg-border hidden sm:block" />
                <span className="text-xs text-muted-foreground hidden sm:block whitespace-nowrap">{stackLabel}</span>
                <span className="h-4 w-px bg-border hidden md:block" />
                <span className="text-xs text-muted-foreground hidden md:block whitespace-nowrap">{config.aiTool}</span>
              </div>
              <span className="shrink-0 rounded-full bg-primary/15 border border-primary/25 px-2.5 py-1 text-[10px] font-semibold text-primary whitespace-nowrap">
                {selectedKeys.length} files
              </span>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              <ErrorBoundary>
                <PreviewLayout files={generatedFiles} projectName={config.name} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
