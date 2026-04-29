import { useProjectStore } from '../../store/projectStore';
import { selectFiles, getFilename } from '../../logic/fileSelector';
import { getDepsLabel } from '../../logic/commands';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';

export default function Step4_Review() {
  const { config, step, setStep, generateFiles, generatedFiles } = useProjectStore();
  const selectedKeys = selectFiles(config);

  const handleGenerate = () => {
    generateFiles();
  };

  const configRows: Array<{ label: string; value: string }> = [
    { label: 'Name', value: config.name },
    { label: 'Type', value: config.type },
    { label: 'Scale', value: config.scale },
    { label: 'AI tool', value: config.aiTool },
    { label: 'Frontend', value: config.frontend },
    { label: 'Backend', value: config.backend },
    { label: 'Databases', value: config.databases.length > 0 ? config.databases.join(', ') : 'none' },
    { label: 'Queues', value: config.queues.length > 0 ? config.queues.join(', ') : 'none' },
    { label: 'Deps', value: getDepsLabel(config) },
    { label: 'Auth', value: config.hasAuth ? 'yes' : 'no' },
    { label: 'Payments', value: config.hasPayments ? 'yes' : 'no' },
    { label: 'Testing', value: config.hasTesting ? 'yes' : 'no' },
    { label: 'Deployment', value: config.hasDeployment ? 'yes' : 'no' },
    { label: 'Token mode', value: config.tokenEfficiency },
  ];

  return (
    <Card className="shadow-xl shadow-black/20">
      <CardHeader className="pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Wizard</p>
        <CardTitle className="text-2xl font-semibold">Step 4 — Review</CardTitle>
      </CardHeader>
      
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Config</p>
          <div className="grid gap-1 rounded-md border bg-muted/30 p-2">
            {configRows.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-2 rounded-md bg-background px-2 py-1">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Files to generate ({selectedKeys.length})
          </p>
          <ul className="grid gap-1">
            {selectedKeys.map((key) => (
              <li key={key} className="rounded-md border bg-muted/30 px-2 py-1">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="font-mono text-[11px] text-foreground truncate">{getFilename(key, config)}</span>
                  </div>
                  <span className="text-sm font-bold text-primary shrink-0">✓</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between pt-4 border-t border-border/50">
        <Button variant="outline" onClick={() => setStep(step - 1)}>
          Back
        </Button>
        <div className="grid gap-2 sm:w-[260px]">
          <Button onClick={handleGenerate} className="w-full">
            {generatedFiles.length > 0 ? 'Re-generate files' : 'Generate files'}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Generation produces a ZIP containing all selected Markdown files and ignore templates.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
