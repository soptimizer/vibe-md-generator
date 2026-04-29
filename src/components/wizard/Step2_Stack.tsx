import { useEffect, useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import type { ProjectConfig } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { MultiSelect } from '../ui/multi-select';

const allFrontends: Array<ProjectConfig['frontend']> = ['react', 'vue', 'nextjs', 'svelte', 'vanilla', 'none'];
const allBackends: Array<ProjectConfig['backend']> = ['nodejs', 'python', 'go', 'rust', 'dotnet', 'none'];
const allDatabases: Array<ProjectConfig['databases'][number]> = ['postgresql', 'mongodb', 'sqlite', 'mysql', 'redis', 'elastic', 'bigquery', 'clickhouse'];
const allQueues: Array<ProjectConfig['queues'][number]> = ['kafka', 'rabbitmq'];
const packageManagers: Array<ProjectConfig['packageManager']> = ['npm', 'pnpm', 'bun', 'yarn'];

const NO_FRONTEND_TYPES: Array<ProjectConfig['type']> = ['api', 'cli', 'library'];
const NO_BACKEND_TYPES: Array<ProjectConfig['type']> = ['library'];

type StackIntent = 'frontend' | 'backend' | 'none';

function SelectField({
  label,
  value,
  onChange,
  options,
  disabled,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center">
      <Label className={`text-sm font-medium ${disabled ? 'text-muted-foreground' : ''}`}>{label}</Label>
      <div className="space-y-2">
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger className={disabled ? 'bg-muted/50 text-muted-foreground' : ''}>
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

function MultiSelectField({
  label,
  values,
  onChange,
  options,
  disabled,
  hint,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: string[];
  disabled?: boolean;
  hint?: string;
  placeholder?: string;
}) {
  const selectOptions = options.map((o) => ({ label: o, value: o }));

  return (
    <div className="grid gap-2 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center">
      <Label className={`text-sm font-medium ${disabled ? 'text-muted-foreground' : ''}`}>{label}</Label>
      <div className="space-y-2">
        <MultiSelect
          options={selectOptions}
          onValueChange={onChange}
          defaultValue={values}
          placeholder={placeholder || `Select ${label.toLowerCase()}...`}
          disabled={disabled}
          maxCount={4}
          hideSelectAll
          className={disabled ? 'bg-muted/50 text-muted-foreground' : ''}
        />
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

export default function Step2_Stack() {
  const { config, updateConfig, step, setStep } = useProjectStore();

  const frontendForced = NO_FRONTEND_TYPES.includes(config.type);
  const backendForced = NO_BACKEND_TYPES.includes(config.type);
  const hasBackend = config.backend !== 'none';
  const hasFrontend = config.frontend !== 'none';
  const frontendAllowed = !frontendForced;
  const backendAllowed = !backendForced;
  const [stackIntent, setStackIntent] = useState<StackIntent>(() => {
    if (hasFrontend) return 'frontend';
    if (hasBackend) return 'backend';
    if (frontendAllowed) return 'frontend';
    if (backendAllowed) return 'backend';
    return 'none';
  });
  const needsPackageManager = stackIntent === 'frontend' || config.backend === 'nodejs';

  const chooseStackIntent = (intent: StackIntent) => {
    setStackIntent(intent);

    if (intent === 'frontend') {
      updateConfig({
        frontend: config.frontend !== 'none' ? config.frontend : 'react',
        backend: 'none',
        databases: [],
        queues: [],
      });
      return;
    }

    if (intent === 'backend') {
      updateConfig({
        backend: config.backend !== 'none' ? config.backend : 'nodejs',
        frontend: 'none',
      });
      return;
    }
  };

  useEffect(() => {
    if (frontendForced && config.frontend !== 'none') {
      updateConfig({ frontend: 'none' });
    }
    if (frontendForced && stackIntent === 'frontend') {
      setStackIntent('backend');
    }
  }, [config.type, frontendForced, stackIntent]);

  useEffect(() => {
    if (backendForced && config.backend !== 'none') {
      updateConfig({ backend: 'none', databases: [], queues: [] });
    }
    if (backendForced && stackIntent === 'backend') {
      setStackIntent('frontend');
    }
  }, [config.type, backendForced, stackIntent]);

  useEffect(() => {
    if (!hasBackend && (config.databases.length > 0 || config.queues.length > 0)) {
      updateConfig({ databases: [], queues: [] });
    }
  }, [config.backend]);

  useEffect(() => {
    if (config.frontend !== 'none' && stackIntent !== 'frontend') {
      setStackIntent('frontend');
    }
    if (config.backend !== 'none' && stackIntent !== 'backend') {
      setStackIntent('backend');
    }
  }, [config.frontend, config.backend]);

  const handleChange = (key: keyof ProjectConfig) => (value: any) => {
    const updates: Partial<ProjectConfig> = { [key]: value } as Partial<ProjectConfig>;
    if (key === 'backend' && value === 'none') {
      updates.databases = [];
      updates.queues = [];
    }
    updateConfig(updates);
  };

  return (
    <Card className="shadow-xl shadow-black/20">
      <CardHeader className="pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Wizard</p>
        <CardTitle className="text-2xl font-semibold">Step 2 — Tech stack</CardTitle>
        <CardDescription className="max-w-2xl text-sm">
          Select the frontend, backend and database options that match your project type.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => chooseStackIntent('frontend')}
            disabled={!frontendAllowed}
            className={`rounded-xl border p-4 text-left transition-colors ${
              stackIntent === 'frontend'
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-muted-foreground'
            } ${!frontendAllowed ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <p className="font-semibold text-foreground">Frontend app</p>
            <p className="mt-1 text-sm opacity-80">
              Only choose a frontend framework and package manager.
            </p>
          </button>
          <button
            type="button"
            onClick={() => chooseStackIntent('backend')}
            disabled={!backendAllowed}
            className={`rounded-xl border p-4 text-left transition-colors ${
              stackIntent === 'backend'
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-muted-foreground'
            } ${!backendAllowed ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <p className="font-semibold text-foreground">Backend app</p>
            <p className="mt-1 text-sm opacity-80">
              Choose backend, database and package manager when needed.
            </p>
          </button>
        </div>

        {stackIntent === 'frontend' && (
          <div className="grid gap-4">
            <SelectField
              label="Frontend"
              value={config.frontend}
              onChange={handleChange('frontend')}
              options={allFrontends}
            />
            {needsPackageManager && (
              <SelectField
                label="Package manager"
                value={config.packageManager}
                onChange={handleChange('packageManager')}
                options={packageManagers}
              />
            )}
          </div>
        )}

        {stackIntent === 'backend' && (
          <div className="grid gap-4">
            <SelectField
              label="Backend"
              value={config.backend}
              onChange={handleChange('backend')}
              options={allBackends}
            />
            {hasBackend && (
              <>
                <MultiSelectField
                  label="Databases"
                  values={config.databases}
                  onChange={handleChange('databases')}
                  options={allDatabases}
                  placeholder="Select databases..."
                />
                <MultiSelectField
                  label="Queues / Brokers"
                  values={config.queues}
                  onChange={handleChange('queues')}
                  options={allQueues}
                  placeholder="Select queues..."
                />
              </>
            )}
            {needsPackageManager && (
              <SelectField
                label="Package manager"
                value={config.packageManager}
                onChange={handleChange('packageManager')}
                options={packageManagers}
              />
            )}
          </div>
        )}

        {stackIntent === 'none' && (
          <div className="rounded-xl border bg-muted/50 p-4 text-sm text-muted-foreground">
            This project type does not require a frontend or backend stack selection.
            Continue to the next step to configure features and documentation.
          </div>
        )}

        {!hasBackend && stackIntent === 'backend' && (
          <p className="text-sm text-muted-foreground text-center pt-2">
            Database and package manager appear as soon as you choose a backend.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border/50">
        <Button variant="outline" onClick={() => setStep(step - 1)}>
          Back
        </Button>
        <Button onClick={() => setStep(step + 1)}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
