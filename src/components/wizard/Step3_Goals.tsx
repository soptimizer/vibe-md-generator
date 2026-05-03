import { useProjectStore } from '../../store/projectStore';
import type { ProjectConfig, TokenEfficiency, AIRole } from '../../types';
import { Button } from '../ui/button';
import { Lock, CreditCard, TestTube2, Rocket, Bot, Code2, Eye, Zap, Scale, BookOpen } from 'lucide-react';

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
);
const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
);
const MiniCheck = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 6 5 9 10 3" /></svg>
);

const featureOptions = [
  { key: 'hasAuth',       label: 'Authentication', hint: 'Adds SECURITY.md auth guidelines',   Icon: Lock        },
  { key: 'hasPayments',   label: 'Payments',        hint: 'Adds SECURITY.md payment notes',     Icon: CreditCard  },
  { key: 'hasTesting',    label: 'Testing',          hint: 'Adds TESTING_STRATEGY.md',           Icon: TestTube2   },
  { key: 'hasDeployment', label: 'Deployment',       hint: 'Includes deployment notes in docs',  Icon: Rocket      },
] as const;

const aiRoleOptions: Array<{ value: AIRole; label: string; hint: string; Icon: React.ComponentType<{className?: string}> }> = [
  { value: 'assistant',       label: 'Assistant',        hint: 'AI suggests, you decide',  Icon: Bot   },
  { value: 'pair-programmer', label: 'Pair Programmer',  hint: 'AI writes, you guide',      Icon: Code2 },
  { value: 'reviewer-only',   label: 'Reviewer',         hint: 'AI only reviews code',      Icon: Eye   },
];

const tokenOptions: Array<{ value: TokenEfficiency; label: string; hint: string; Icon: React.ComponentType<{className?: string}> }> = [
  { value: 'minimal',       label: 'Minimal',   hint: 'Core files — low cost',       Icon: Zap      },
  { value: 'balanced',      label: 'Balanced',  hint: 'Core + context — rec.',        Icon: Scale    },
  { value: 'comprehensive', label: 'Complete',  hint: 'All files + planning',         Icon: BookOpen },
];

export default function Step3_Goals() {
  const { config, updateConfig, step, setStep } = useProjectStore();

  const toggle = (key: keyof ProjectConfig) => (val: boolean) => updateConfig({ [key]: val } as Partial<ProjectConfig>);

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-5 shadow-xl shadow-black/30">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 border border-primary/25 text-sm font-bold text-primary">3</span>
        <div>
          <h2 className="text-base font-bold text-foreground">Features &amp; goals</h2>
          <p className="text-xs text-muted-foreground">Enable features and set AI preferences</p>
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Feature toggles */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Features</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {featureOptions.map(({ key, label, hint, Icon }) => {
            const checked = config[key] as boolean;
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key)(!checked)}
                className={`option-card relative flex items-start gap-3 rounded-xl border p-3.5 text-left cursor-pointer ${checked ? 'selected' : 'border-border/60 bg-muted/20'}`}
              >
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 transition-colors ${checked ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <span className="text-sm font-semibold text-foreground">{label}</span>
                  <p className="text-xs text-muted-foreground leading-snug mt-0.5">{hint}</p>
                </div>
                {checked && (
                  <span className="absolute top-2.5 right-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <MiniCheck />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Role */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">AI Role</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Choose one</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {aiRoleOptions.map(({ value, label, hint, Icon }) => {
            const active = config.aiRole === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateConfig({ aiRole: value })}
                className={`option-card relative flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left cursor-pointer ${active ? 'selected' : 'border-border/60 bg-muted/20'}`}
              >
                <Icon className={`h-4 w-4 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <p className="font-semibold text-sm text-foreground leading-tight">{label}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-snug">{hint}</p>
                </div>
                {active && <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground"><MiniCheck /></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Token efficiency */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Token efficiency</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Choose one</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {tokenOptions.map(({ value, label, hint, Icon }) => {
            const active = config.tokenEfficiency === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateConfig({ tokenEfficiency: value })}
                className={`option-card relative flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left cursor-pointer ${active ? 'selected' : 'border-border/60 bg-muted/20'}`}
              >
                <Icon className={`h-4 w-4 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <p className="font-semibold text-sm text-foreground leading-tight">{label}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-snug">{hint}</p>
                </div>
                {active && <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground"><MiniCheck /></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-1.5"><ChevronLeft />Back</Button>
        <Button onClick={() => setStep(step + 1)} className="gap-1.5">Review<ChevronRight /></Button>
      </div>
    </div>
  );
}
