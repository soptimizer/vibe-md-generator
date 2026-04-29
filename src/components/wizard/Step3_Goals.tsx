import { useProjectStore } from '../../store/projectStore';
import type { ProjectConfig, TokenEfficiency, AIRole } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';

const aiRoleOptions: Array<{ value: AIRole; label: string; hint: string }> = [
  { value: 'assistant', label: 'Assistant', hint: 'AI suggests, you decide' },
  { value: 'pair-programmer', label: 'Pair Programmer', hint: 'AI writes, you guide' },
  { value: 'reviewer-only', label: 'Reviewer', hint: 'AI only reviews code' },
];

const tokenOptions: Array<{ value: TokenEfficiency; label: string; hint: string }> = [
  { value: 'minimal', label: 'Minimal', hint: 'Core files — low cost' },
  { value: 'balanced', label: 'Balanced', hint: 'Core + context — rec.' },
  { value: 'comprehensive', label: 'Complete', hint: 'All files + planning' },
];

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex flex-col w-full rounded-xl border px-3 py-2.5 text-left cursor-pointer transition-colors ${
        checked
          ? 'border-primary bg-primary/10'
          : 'border-border bg-card hover:border-muted-foreground'
      }`}
    >
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground leading-snug mt-0.5">{hint}</span>
    </button>
  );
}

export default function Step3_Goals() {
  const { config, updateConfig, step, setStep } = useProjectStore();

  const toggle = (key: keyof ProjectConfig) => (value: boolean) => {
    updateConfig({ [key]: value } as Partial<ProjectConfig>);
  };

  return (
    <Card className="shadow-xl shadow-black/20">
      <CardHeader className="pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Wizard</p>
        <CardTitle className="text-2xl font-semibold">Step 3 — Features & goals</CardTitle>
      </CardHeader>
      
      <CardContent className="grid gap-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle label="Authentication" hint="Adds SECURITY.md with auth guidelines" checked={config.hasAuth} onChange={toggle('hasAuth')} />
          <Toggle label="Payments" hint="Adds SECURITY.md with payment handling notes" checked={config.hasPayments} onChange={toggle('hasPayments')} />
          <Toggle label="Testing" hint="Adds TESTING_STRATEGY.md" checked={config.hasTesting} onChange={toggle('hasTesting')} />
          <Toggle label="Deployment" hint="Includes deployment notes in generated docs" checked={config.hasDeployment} onChange={toggle('hasDeployment')} />
        </div>

        <div className="mt-2">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">AI Role</p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Choose one</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {aiRoleOptions.map(({ value, label, hint }) => (
              <button
                key={value}
                type="button"
                onClick={() => updateConfig({ aiRole: value })}
                className={`flex flex-col rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  config.aiRole === value
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-muted-foreground'
                }`}
              >
                <p className="font-semibold text-sm leading-tight break-words text-foreground">{label}</p>
                <p className="mt-1.5 text-xs opacity-80 leading-snug">{hint}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">Token efficiency</p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Choose one</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {tokenOptions.map(({ value, label, hint }) => (
              <button
                key={value}
                type="button"
                onClick={() => updateConfig({ tokenEfficiency: value })}
                className={`flex flex-col rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  config.tokenEfficiency === value
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-muted-foreground'
                }`}
              >
                <p className="font-semibold text-sm leading-tight break-words text-foreground">{label}</p>
                <p className="mt-1.5 text-xs opacity-80 leading-snug">{hint}</p>
              </button>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border/50">
        <Button variant="outline" onClick={() => setStep(step - 1)}>
          Back
        </Button>
        <Button onClick={() => setStep(step + 1)}>
          Review
        </Button>
      </CardFooter>
    </Card>
  );
}
