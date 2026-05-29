import { useProjectStore } from '../../store/projectStore';
import type { ProjectConfig } from '../../types';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { AlertCircle } from 'lucide-react';

const projectTypes: Array<ProjectConfig['type']> = ['webapp', 'api', 'service', 'game', 'cli', 'library', 'mobile'];
const projectScales: Array<ProjectConfig['scale']> = ['solo', 'small-team', 'enterprise'];
const aiTools: Array<ProjectConfig['aiTool']> = ['claude', 'cursor', 'windsurf', 'codex', 'copilot', 'opencode', 'antigravity', 'generic'];

const projectTypeIcons: Record<string, string> = {
  webapp: '🌐', api: '⚡', service: '⚙️', game: '🎮', cli: '💻', library: '📦', mobile: '📱',
};
const aiToolIcons: Record<string, string> = {
  claude: 'C', cursor: 'Cs', windsurf: 'W', codex: 'Cx', copilot: 'Co', opencode: 'Oc', antigravity: 'Ag', generic: 'G',
};

function Field({
  label, id, value, onChange, hint, type = 'text',
}: {
  label: string; id: string; value: string;
  onChange: (value: string) => void; hint?: string; type?: 'text' | 'textarea';
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      {type === 'textarea' ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hint}
          className="min-h-[72px] resize-none text-sm bg-muted/30 border-border/60 focus:border-primary/60 transition-colors"
        />
      ) : (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hint}
          className="text-sm bg-muted/30 border-border/60 focus:border-primary/60 transition-colors"
        />
      )}
    </div>
  );
}

function SelectField({
  label, id, value, onChange, options,
}: {
  label: string; id: string; value: string;
  onChange: (value: string) => void; options: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="text-sm bg-muted/30 border-border/60 focus:border-primary/60 transition-colors">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>{option}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function Step1_Basics() {
  const { config, updateConfig, step, setStep } = useProjectStore();

  const handleChange = (key: keyof ProjectConfig) => (value: string) => {
    updateConfig({ [key]: value } as Partial<ProjectConfig>);
  };

  const canContinue = config.name.trim().length > 0 && config.description.trim().length > 0;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-5 shadow-xl shadow-black/30">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 border border-primary/25 text-sm font-bold text-primary">
          1
        </span>
        <div>
          <h2 className="text-base font-bold text-foreground">Project basics</h2>
          <p className="text-xs text-muted-foreground">Name, description, and core metadata</p>
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Fields */}
      <div className="flex flex-col gap-4">
        <Field
          label="Project name"
          id="project-name"
          value={config.name}
          onChange={handleChange('name')}
          hint="e.g. my-saas-app"
        />
        <Field
          label="Project description"
          id="project-description"
          value={config.description}
          onChange={handleChange('description')}
          hint="A short summary of what this project does"
          type="textarea"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <SelectField label="Type"     id="project-type"  value={config.type}    onChange={handleChange('type')}    options={projectTypes} />
          <SelectField label="Scale"    id="team-scale"    value={config.scale}   onChange={handleChange('scale')}   options={projectScales} />
          <SelectField label="AI tool"  id="ai-tool"       value={config.aiTool}  onChange={handleChange('aiTool')}  options={aiTools} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {!canContinue ? (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {!config.name.trim() && !config.description.trim()
              ? 'Name and description are required'
              : !config.name.trim()
              ? 'Project name is required'
              : 'Project description is required'}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Selections are reflected live in the preview.
          </p>
        )}
        <Button
          onClick={() => setStep(step + 1)}
          disabled={!canContinue}
          className="shrink-0 gap-2"
        >
          Continue
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
