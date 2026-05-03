import { useEffect, useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import type { ProjectConfig } from '../../types';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { MultiSelect } from '../ui/multi-select';
import { Monitor, Server } from 'lucide-react';

const allFrontends: Array<ProjectConfig['frontend']> = ['react', 'vue', 'nextjs', 'svelte', 'vanilla', 'none'];
const allBackends: Array<ProjectConfig['backend']> = ['nodejs', 'python', 'go', 'rust', 'dotnet', 'none'];
const allDatabases: Array<ProjectConfig['databases'][number]> = ['postgresql', 'mongodb', 'sqlite', 'mysql', 'redis', 'elastic', 'bigquery', 'clickhouse'];
const allQueues: Array<ProjectConfig['queues'][number]> = ['kafka', 'rabbitmq'];
const packageManagers: Array<ProjectConfig['packageManager']> = ['npm', 'pnpm', 'bun', 'yarn'];
const NO_FRONTEND_TYPES: Array<ProjectConfig['type']> = ['api', 'cli', 'library'];
const NO_BACKEND_TYPES: Array<ProjectConfig['type']> = ['library'];
type StackIntent = 'frontend' | 'backend' | 'none';

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
);
const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
);
const MiniCheck = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 6 5 9 10 3" /></svg>
);

function SelectField({ label, id, value, onChange, options, disabled }: {
  label: string; id: string; value: string;
  onChange: (v: string) => void; options: string[]; disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className={`text-xs font-semibold uppercase tracking-wide ${disabled ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id} className={`text-sm border-border/60 transition-colors ${disabled ? 'opacity-50 bg-muted/20' : 'bg-muted/30 focus:border-primary/60'}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function MultiField({ label, values, onChange, options, placeholder }: {
  label: string; values: string[]; onChange: (v: string[]) => void; options: string[]; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      <MultiSelect
        options={options.map((o) => ({ label: o, value: o }))}
        onValueChange={onChange}
        defaultValue={values}
        placeholder={placeholder || `Select ${label.toLowerCase()}...`}
        maxCount={4}
        hideSelectAll
      />
    </div>
  );
}

export default function Step2_Stack() {
  const { config, updateConfig, step, setStep } = useProjectStore();
  const frontendForced = NO_FRONTEND_TYPES.includes(config.type);
  const backendForced  = NO_BACKEND_TYPES.includes(config.type);
  const hasBackend     = config.backend !== 'none';
  const [stackIntent, setStackIntent] = useState<StackIntent>(() => {
    if (config.frontend !== 'none') return 'frontend';
    if (config.backend  !== 'none') return 'backend';
    if (!frontendForced) return 'frontend';
    if (!backendForced)  return 'backend';
    return 'none';
  });
  const needsPkg = stackIntent === 'frontend' || config.backend === 'nodejs';

  const choose = (intent: StackIntent) => {
    setStackIntent(intent);
    if (intent === 'frontend') updateConfig({ frontend: config.frontend !== 'none' ? config.frontend : 'react', backend: 'none', databases: [], queues: [] });
    else if (intent === 'backend') updateConfig({ backend: config.backend !== 'none' ? config.backend : 'nodejs', frontend: 'none' });
  };

  useEffect(() => {
    if (frontendForced && config.frontend !== 'none') updateConfig({ frontend: 'none' });
    if (frontendForced && stackIntent === 'frontend') setStackIntent(backendForced ? 'none' : 'backend');
  }, [config.type]);

  useEffect(() => {
    if (backendForced && config.backend !== 'none') updateConfig({ backend: 'none', databases: [], queues: [] });
    if (backendForced && stackIntent === 'backend') setStackIntent(frontendForced ? 'none' : 'frontend');
  }, [config.type]);

  useEffect(() => {
    if (!hasBackend && (config.databases.length > 0 || config.queues.length > 0)) updateConfig({ databases: [], queues: [] });
  }, [config.backend]);

  useEffect(() => {
    if (config.frontend !== 'none' && stackIntent !== 'frontend') setStackIntent('frontend');
    if (config.backend  !== 'none' && stackIntent !== 'backend')  setStackIntent('backend');
  }, [config.frontend, config.backend]);

  const handleChange = (key: keyof ProjectConfig) => (value: any) => {
    const upd: Partial<ProjectConfig> = { [key]: value } as Partial<ProjectConfig>;
    if (key === 'backend' && value === 'none') { upd.databases = []; upd.queues = []; }
    updateConfig(upd);
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-5 shadow-xl shadow-black/30">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 border border-primary/25 text-sm font-bold text-primary">2</span>
        <div>
          <h2 className="text-base font-bold text-foreground">Tech stack</h2>
          <p className="text-xs text-muted-foreground">Frontend, backend, and database choices</p>
        </div>
      </div>

      <div className="h-px bg-border/50" />

      <div className="grid gap-3 sm:grid-cols-2">
        {([['frontend', Monitor, 'Frontend app', 'Framework + package manager', !frontendForced], ['backend', Server, 'Backend app', 'Server + DB + queues', !backendForced]] as const).map(([intent, Icon, title, desc, allowed]) => (
          <button
            key={intent}
            type="button"
            onClick={() => allowed && choose(intent as StackIntent)}
            disabled={!allowed}
            className={`option-card flex items-start gap-3 rounded-xl border p-4 text-left cursor-pointer ${stackIntent === intent ? 'selected' : 'border-border/60 bg-muted/20'} ${!allowed ? 'cursor-not-allowed opacity-40' : ''}`}
          >
            <Icon className={`h-5 w-5 mt-0.5 shrink-0 transition-colors ${stackIntent === intent ? 'text-primary' : 'text-muted-foreground'}`} />
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground">{title}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-snug">{desc}</p>
            </div>
            {stackIntent === intent && (
              <span className="ml-auto shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><MiniCheck /></span>
            )}
          </button>
        ))}
      </div>

      {stackIntent === 'frontend' && (
        <div className="grid gap-4 animate-fade-in-up">
          <SelectField label="Framework" id="frontend" value={config.frontend} onChange={handleChange('frontend')} options={allFrontends} />
          {needsPkg && <SelectField label="Package manager" id="pkg" value={config.packageManager} onChange={handleChange('packageManager')} options={packageManagers} />}
        </div>
      )}

      {stackIntent === 'backend' && (
        <div className="grid gap-4 animate-fade-in-up">
          <SelectField label="Runtime" id="backend" value={config.backend} onChange={handleChange('backend')} options={allBackends} />
          {hasBackend && (
            <div className="grid gap-4">
              <MultiField label="Databases" values={config.databases} onChange={handleChange('databases')} options={allDatabases} placeholder="None selected" />
              <MultiField label="Queues / Brokers" values={config.queues} onChange={handleChange('queues')} options={allQueues} placeholder="None selected" />
            </div>
          )}
          {needsPkg && <SelectField label="Package manager" id="pkg-be" value={config.packageManager} onChange={handleChange('packageManager')} options={packageManagers} />}
        </div>
      )}

      {stackIntent === 'none' && (
        <div className="rounded-xl border border-border/40 bg-muted/20 p-4 text-sm text-muted-foreground animate-fade-in-up">
          This project type doesn't require stack selection. Continue to configure features.
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-1.5"><ChevronLeft />Back</Button>
        <Button onClick={() => setStep(step + 1)} className="gap-1.5">Continue<ChevronRight /></Button>
      </div>
    </div>
  );
}
