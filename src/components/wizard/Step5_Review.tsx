import type { ProjectConfig } from '../../types';
import { useProjectStore } from '../../store/projectStore';
import { selectFiles, getFilename } from '../../logic/fileSelector';
import { getDepsLabel } from '../../logic/commands';
import { Button } from '../ui/button';
import { downloadZip } from '../../logic/exporter';
import {
  Tag, Layers, Users, Bot, Monitor, Server, Database, Send,
  Package, Lock, CreditCard, TestTube2, Rocket, Zap,
  FileText, FileJson, GitBranchPlus, CheckCircle2, Download, Wrench
} from 'lucide-react';

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
);

const configRows: Array<{ key: string; icon: React.ComponentType<{className?: string}>; getValue: (c: ProjectConfig) => string }> = [
  { key: 'Name',        icon: Tag,           getValue: (c) => c.name },
  { key: 'Type',        icon: Layers,        getValue: (c) => c.type },
  { key: 'Scale',       icon: Users,         getValue: (c) => c.scale },
  { key: 'AI tool',     icon: Bot,           getValue: (c) => c.aiTool },
  { key: 'Frontend',    icon: Monitor,       getValue: (c) => c.frontend },
  { key: 'Backend',     icon: Server,        getValue: (c) => c.backend },
  { key: 'Databases',   icon: Database,      getValue: (c) => c.databases.length > 0 ? c.databases.join(', ') : 'none' },
  { key: 'Queues',      icon: Send,          getValue: (c) => c.queues.length > 0 ? c.queues.join(', ') : 'none' },
  { key: 'Deps',        icon: Package,       getValue: (c) => getDepsLabel(c) },
  { key: 'Auth',        icon: Lock,          getValue: (c) => c.hasAuth ? 'yes' : 'no' },
  { key: 'Payments',    icon: CreditCard,    getValue: (c) => c.hasPayments ? 'yes' : 'no' },
  { key: 'Testing',     icon: TestTube2,     getValue: (c) => c.hasTesting ? 'yes' : 'no' },
  { key: 'Deployment',  icon: Rocket,        getValue: (c) => c.hasDeployment ? 'yes' : 'no' },
  { key: 'Tokens',      icon: Zap,           getValue: (c) => c.tokenEfficiency },
  { key: 'Skills',      icon: Wrench,        getValue: (c) => (c.selectedSkills?.length ?? 0) > 0 ? `${c.selectedSkills!.length} selected` : 'none' },
];

function getFileIcon(filename: string) {
  if (filename.endsWith('.json')) return <FileJson className="h-3 w-3 text-amber-400 shrink-0" />;
  if (filename === '.gitignore') return <GitBranchPlus className="h-3 w-3 text-emerald-400 shrink-0" />;
  return <FileText className="h-3 w-3 text-primary/70 shrink-0" />;
}

export default function Step4_Review() {
  const { config, step, setStep, generateFiles, generatedFiles } = useProjectStore();
  const selectedKeys = selectFiles(config);

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-5 shadow-xl shadow-black/30">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 border border-primary/25 text-sm font-bold text-primary">5</span>
        <div>
          <h2 className="text-base font-bold text-foreground">Review</h2>
          <p className="text-xs text-muted-foreground">Confirm your configuration and generate files</p>
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Config + File list */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Config table */}
        <div>
          <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Configuration</p>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            {configRows.map(({ key, icon: Icon, getValue }, idx) => (
              <div key={key} className={`flex items-center justify-between gap-2 px-3 py-1.5 ${idx % 2 === 0 ? 'bg-muted/20' : 'bg-transparent'}`}>
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">{key}</span>
                </div>
                <span className="text-xs font-medium text-foreground shrink-0 max-w-[60%] truncate text-right">{getValue(config)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Files list */}
        <div>
          <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Files to generate ({selectedKeys.length})
          </p>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            {selectedKeys.map((key, idx) => {
              const filename = getFilename(key, config);
              return (
                <div key={key} className={`flex items-center gap-2 px-3 py-1.5 ${idx % 2 === 0 ? 'bg-muted/20' : 'bg-transparent'}`}>
                  {getFileIcon(filename)}
                  <span className="font-mono text-[11px] text-foreground truncate flex-1">{filename}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-1.5 sm:self-start">
          <ChevronLeft />Back
        </Button>
        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex gap-2">
            <Button onClick={() => generateFiles()} className="gap-2 flex-1 sm:flex-none">
              {generatedFiles.length > 0 ? 'Re-generate' : 'Generate files'}
            </Button>
            {generatedFiles.length > 0 && (
              <Button variant="outline" onClick={() => downloadZip(generatedFiles, config.name || 'project')} className="gap-2 shrink-0">
                <Download className="h-4 w-4" />
                ZIP
              </Button>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground text-right">Generates a ZIP with all selected Markdown files.</p>
        </div>
      </div>
    </div>
  );
}
