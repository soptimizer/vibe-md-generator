import { useProjectStore } from '../../store/projectStore';
import type { ProjectConfig } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

const projectTypes: Array<ProjectConfig['type']> = ['webapp', 'api', 'game', 'cli', 'library', 'mobile'];
const projectScales: Array<ProjectConfig['scale']> = ['solo', 'small-team', 'enterprise'];
const aiTools: Array<ProjectConfig['aiTool']> = ['claude', 'cursor', 'windsurf', 'codex', 'generic'];

function Field({
  label,
  value,
  onChange,
  hint,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  type?: 'text' | 'textarea';
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-start">
      <Label className="text-sm font-medium mt-2.5">{label}</Label>
      <div>
        {type === 'textarea' ? (
          <Textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={hint}
            className="min-h-[60px] resize-y"
          />
        ) : (
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={hint}
          />
        )}
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
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
    <Card className="shadow-xl shadow-black/20">
      <CardHeader className="pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Wizard</p>
        <CardTitle className="text-2xl font-semibold">Step 1 — Project basics</CardTitle>
        <CardDescription className="max-w-2xl text-sm">
          Enter your project name, description, and the core metadata that drives file generation.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field
          label="Project name"
          value={config.name}
          onChange={handleChange('name')}
          hint="e.g. my-saas-app"
        />
        <Field
          label="Project description"
          value={config.description}
          onChange={handleChange('description')}
          hint="A short summary of what this project does"
          type="textarea"
        />
        <div className="grid gap-4 mt-2">
          <SelectField label="Project type" value={config.type} onChange={handleChange('type')} options={projectTypes} />
          <SelectField label="Team size" value={config.scale} onChange={handleChange('scale')} options={projectScales} />
          <SelectField label="AI tool" value={config.aiTool} onChange={handleChange('aiTool')} options={aiTools} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border/50">
        {!canContinue ? (
          <p className="text-sm text-destructive">
            {!config.name.trim() && !config.description.trim()
              ? 'Name and description are required'
              : !config.name.trim()
              ? 'Project name is required'
              : 'Project description is required'}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your selections are reflected live in the preview panel.
          </p>
        )}
        <Button
          onClick={() => setStep(step + 1)}
          disabled={!canContinue}
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
