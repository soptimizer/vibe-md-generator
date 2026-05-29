import { useState, useMemo } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { Button } from '../ui/button';
import {
  Server, Palette, Container, Brain, Globe, PenLine,
  BarChart3, BookOpen, Wrench, ChevronRight, Check, Star, Search, X, Sparkles
} from 'lucide-react';
import type { ProjectConfig } from '../../types';

function getSuggestedSkillIds(config: ProjectConfig): string[] {
  const suggestions: string[] = [];

  if (config.frontend === 'react' || config.frontend === 'nextjs') {
    suggestions.push('ui-builder', 'component-system', 'state-management');
  }
  if (config.frontend === 'vue' || config.frontend === 'svelte') {
    suggestions.push('ui-builder', 'component-system');
  }
  if (config.frontend !== 'none') {
    suggestions.push('responsive-design', 'seo-optimization');
  }
  if (config.backend !== 'none') {
    suggestions.push('api-builder', 'logging-monitoring');
  }
  if (config.databases.includes('postgresql') || config.databases.includes('mysql') || config.databases.includes('sqlite')) {
    suggestions.push('database-designer', 'sql-optimizer');
  }
  if (config.databases.includes('mongodb')) {
    suggestions.push('database-designer');
  }
  if (config.hasAuth) {
    suggestions.push('auth-system');
  }
  if (config.hasTesting) {
    suggestions.push('testing');
  }
  if (config.hasDeployment) {
    suggestions.push('docker', 'cicd-pipeline');
  }
  if (config.queues.length > 0) {
    suggestions.push('queue-system');
  }
  if (config.scale !== 'solo') {
    suggestions.push('code-review', 'documentation');
  }

  return [...new Set(suggestions)];
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface Skill {
  id: string;
  name: string;
  description: string;
  stars: number;
}
interface SkillCategory {
  id: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  accent: string;      // text colour
  bgAccent: string;    // badge bg
  skills: Skill[];
}

// ─── Data ────────────────────────────────────────────────────────────────────
const CATEGORIES: SkillCategory[] = [
  {
    id: 'backend',
    label: 'Backend',
    Icon: Server,
    accent: 'text-blue-400',
    bgAccent: 'bg-blue-400/10 border-blue-400/25 text-blue-400',
    skills: [
      { id: 'api-builder',           name: 'API Builder',            description: 'REST/GraphQL API scaffolding',       stars: 48200 },
      { id: 'auth-system',           name: 'Authentication System',  description: 'JWT / OAuth auth flows',            stars: 61300 },
      { id: 'database-designer',     name: 'Database Designer',      description: 'Schema design & migrations',        stars: 39700 },
      { id: 'sql-optimizer',         name: 'SQL Optimizer',          description: 'Query performance tuning',          stars: 27400 },
      { id: 'microservices-arch',    name: 'Microservices Arch.',    description: 'Distributed service patterns',      stars: 52100 },
      { id: 'caching-system',        name: 'Caching System',         description: 'Redis / in-memory strategies',      stars: 33600 },
      { id: 'queue-system',          name: 'Queue System',           description: 'Message queue setup',              stars: 29800 },
      { id: 'logging-monitoring',    name: 'Logging & Monitoring',   description: 'Observability stack',              stars: 44500 },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    Icon: Palette,
    accent: 'text-violet-400',
    bgAccent: 'bg-violet-400/10 border-violet-400/25 text-violet-400',
    skills: [
      { id: 'ui-builder',            name: 'UI Builder',             description: 'Component-driven interface',        stars: 71200 },
      { id: 'component-system',      name: 'Component System',       description: 'Reusable design system',           stars: 58900 },
      { id: 'state-management',      name: 'State Management',       description: 'Global / local state patterns',    stars: 66400 },
      { id: 'responsive-design',     name: 'Responsive Design',      description: 'Mobile-first layouts',             stars: 43100 },
      { id: 'animation-system',      name: 'Animation System',       description: 'Motion & micro-interactions',      stars: 31700 },
      { id: 'accessibility',         name: 'Accessibility',          description: 'WCAG compliance & a11y',           stars: 25300 },
      { id: 'seo-optimization',      name: 'SEO Optimization',       description: 'Meta, schema & performance',       stars: 37800 },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps',
    Icon: Container,
    accent: 'text-emerald-400',
    bgAccent: 'bg-emerald-400/10 border-emerald-400/25 text-emerald-400',
    skills: [
      { id: 'docker',                name: 'Docker',                 description: 'Containerisation & images',        stars: 88700 },
      { id: 'kubernetes',            name: 'Kubernetes',             description: 'Container orchestration',         stars: 94200 },
      { id: 'cicd-pipeline',         name: 'CI/CD Pipeline',         description: 'Automated build & deploy',        stars: 62500 },
      { id: 'iac',                   name: 'Infrastructure as Code', description: 'Terraform / Pulumi infra',        stars: 57300 },
      { id: 'monitoring-system',     name: 'Monitoring System',      description: 'Metrics, alerts & dashboards',    stars: 41200 },
      { id: 'deployment-automation', name: 'Deployment Automation',  description: 'Zero-downtime deploy flows',      stars: 35600 },
    ],
  },
  {
    id: 'ai-data',
    label: 'AI / Data',
    Icon: Brain,
    accent: 'text-amber-400',
    bgAccent: 'bg-amber-400/10 border-amber-400/25 text-amber-400',
    skills: [
      { id: 'data-analysis',         name: 'Data Analysis',          description: 'Statistical exploration',         stars: 53400 },
      { id: 'data-visualization',    name: 'Data Visualization',     description: 'Charts, graphs & dashboards',     stars: 47100 },
      { id: 'machine-learning',      name: 'Machine Learning',       description: 'Model training & evaluation',     stars: 82600 },
      { id: 'nlp-processing',        name: 'NLP Processing',         description: 'Text & language pipelines',       stars: 69300 },
      { id: 'recommendation-system', name: 'Recommendation System',  description: 'Personalisation engine',          stars: 38900 },
      { id: 'anomaly-detection',     name: 'Anomaly Detection',      description: 'Outlier & fraud detection',       stars: 29400 },
      { id: 'forecasting',           name: 'Forecasting',            description: 'Time-series prediction',          stars: 33200 },
      { id: 'rag-systems',           name: 'RAG Systems',            description: 'Retrieval-augmented generation',  stars: 61800 },
    ],
  },
  {
    id: 'web',
    label: 'Web',
    Icon: Globe,
    accent: 'text-cyan-400',
    bgAccent: 'bg-cyan-400/10 border-cyan-400/25 text-cyan-400',
    skills: [
      { id: 'web-scraping',          name: 'Web Scraping',           description: 'Structured data extraction',      stars: 44700 },
      { id: 'seo-analysis',          name: 'SEO Analysis',           description: 'Site audit & rankings',           stars: 31900 },
      { id: 'keyword-research',      name: 'Keyword Research',       description: 'Search volume & intent',          stars: 18600 },
      { id: 'web-auditing',          name: 'Web Auditing',           description: 'Performance & compliance',        stars: 22300 },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    Icon: PenLine,
    accent: 'text-pink-400',
    bgAccent: 'bg-pink-400/10 border-pink-400/25 text-pink-400',
    skills: [
      { id: 'content-writing',       name: 'Content Writing',        description: 'Long-form & editorial copy',      stars: 26500 },
      { id: 'copywriting',           name: 'Copywriting',            description: 'High-conversion marketing text',  stars: 21400 },
      { id: 'summarization',         name: 'Summarization',          description: 'AI-assisted text condensing',     stars: 34800 },
    ],
  },
  {
    id: 'business',
    label: 'Business',
    Icon: BarChart3,
    accent: 'text-orange-400',
    bgAccent: 'bg-orange-400/10 border-orange-400/25 text-orange-400',
    skills: [
      { id: 'market-research',       name: 'Market Research',        description: 'Competitive landscape analysis',  stars: 28100 },
      { id: 'lead-generation',       name: 'Lead Generation',        description: 'Prospect acquisition flows',      stars: 19700 },
      { id: 'sales-funnels',         name: 'Sales Funnels',          description: 'Conversion pipeline design',      stars: 23900 },
      { id: 'growth-strategy',       name: 'Growth Strategy',        description: 'Acquisition & retention tactics', stars: 31500 },
    ],
  },
  {
    id: 'productivity',
    label: 'Productivity',
    Icon: BookOpen,
    accent: 'text-teal-400',
    bgAccent: 'bg-teal-400/10 border-teal-400/25 text-teal-400',
    skills: [
      { id: 'task-management',       name: 'Task Management',        description: 'Project & issue tracking',        stars: 36200 },
      { id: 'note-taking',           name: 'Note Taking',            description: 'Knowledge base organisation',     stars: 29600 },
      { id: 'time-tracking',         name: 'Time Tracking',          description: 'Pomodoro & billable hours',       stars: 24100 },
      { id: 'workflow-automation',   name: 'Workflow Automation',    description: 'No-code process automation',      stars: 43700 },
    ],
  },
  {
    id: 'dev-tools',
    label: 'Developer Tools',
    Icon: Wrench,
    accent: 'text-slate-300',
    bgAccent: 'bg-slate-300/10 border-slate-300/25 text-slate-300',
    skills: [
      { id: 'code-review',           name: 'Code Review',            description: 'PR feedback & best practices',    stars: 37400 },
      { id: 'testing',               name: 'Testing',                description: 'Unit, integration & E2E tests',   stars: 55800 },
      { id: 'debugging',             name: 'Debugging',              description: 'Root-cause analysis tools',       stars: 41300 },
      { id: 'documentation',         name: 'Documentation',          description: 'API docs & code comments',        stars: 32600 },
    ],
  },
];

const ALL_SKILLS = CATEGORIES.flatMap((c) => c.skills);
const TOTAL = ALL_SKILLS.length;

function fmtStars(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Step4_Skills() {
  const { config, updateConfig, step, setStep } = useProjectStore();
  const selected = new Set(config.selectedSkills ?? []);
  const [openCats, setOpenCats] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    updateConfig({ selectedSkills: Array.from(next) });
  };

  const toggleCat = (id: string) => {
    const next = new Set(openCats);
    next.has(id) ? next.delete(id) : next.add(id);
    setOpenCats(next);
  };

  const selectAll = () => updateConfig({ selectedSkills: ALL_SKILLS.map((s) => s.id) });
  const clearAll  = () => updateConfig({ selectedSkills: [] });

  const suggestedIds = useMemo(() => getSuggestedSkillIds(config), [config]);
  const unselectedSuggestions = suggestedIds.filter((id) => !selected.has(id));

  const applySuggestions = () => {
    const next = new Set([...Array.from(selected), ...suggestedIds]);
    updateConfig({ selectedSkills: Array.from(next) });
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-xl shadow-black/30">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 border border-primary/25 text-sm font-bold text-primary">
          4
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-foreground leading-tight">Skills</h2>
          <p className="text-xs text-muted-foreground">Choose AI skills for your project context</p>
        </div>
        {selected.size > 0 && (
          <span className="shrink-0 rounded-full bg-primary/15 border border-primary/25 px-2.5 py-0.5 text-[11px] font-bold text-primary tabular-nums">
            {selected.size}/{TOTAL}
          </span>
        )}
      </div>

      <div className="h-px bg-border/50" />

      {/* ── Search + bulk ── */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              // auto-open all cats when searching
              if (e.target.value.trim()) {
                setOpenCats(new Set(CATEGORIES.map((c) => c.id)));
              }
            }}
            placeholder="Search skills…"
            className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors duration-150"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors duration-150 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <button
          onClick={selectAll}
          className="shrink-0 h-8 px-3 rounded-lg border border-border/60 bg-muted/20 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors duration-150 cursor-pointer"
        >
          All
        </button>
        <button
          onClick={clearAll}
          className="shrink-0 h-8 px-3 rounded-lg border border-border/60 bg-muted/20 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-destructive/40 hover:bg-destructive/5 transition-colors duration-150 cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* ── Suggestions ── */}
      {unselectedSuggestions.length > 0 && !q && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary/70 shrink-0" />
              <span className="text-[11px] font-semibold text-primary/80">Suggested for your stack</span>
            </div>
            <button
              type="button"
              onClick={applySuggestions}
              className="shrink-0 text-[10px] font-semibold text-primary hover:underline cursor-pointer"
            >
              Apply all
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {unselectedSuggestions.slice(0, 8).map((id) => {
              const skill = ALL_SKILLS.find((s) => s.id === id);
              if (!skill) return null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(id)}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  + {skill.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Category accordion ── */}
      <div
        className="flex flex-col gap-1.5 overflow-y-auto pr-0.5 custom-scrollbar"
        style={{ maxHeight: 'calc(100dvh - 360px)', minHeight: '120px' }}
      >
        {CATEGORIES.map((cat) => {
          const catSkills = q
            ? cat.skills.filter((s) =>
                s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
              )
            : cat.skills;

          if (catSkills.length === 0) return null;

          const isOpen      = openCats.has(cat.id) || !!q;
          const catSelected = catSkills.filter((s) => selected.has(s.id)).length;

          return (
            <div
              key={cat.id}
              className="rounded-xl border border-border/50 overflow-hidden"
            >
              {/* Category header */}
              <button
                type="button"
                onClick={() => toggleCat(cat.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-muted/25 hover:bg-muted/45 transition-colors duration-150 cursor-pointer text-left"
              >
                <cat.Icon className={`h-3.5 w-3.5 shrink-0 ${cat.accent}`} />
                <span className={`text-[11px] font-bold uppercase tracking-wider ${cat.accent}`}>
                  {cat.label}
                </span>
                <span className="text-[10px] text-muted-foreground/50 leading-none">
                  {catSkills.length}
                </span>

                {catSelected > 0 && (
                  <span className={`ml-0.5 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${cat.bgAccent}`}>
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    {catSelected}
                  </span>
                )}

                <ChevronRight
                  className={`ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                />
              </button>

              {/* Skill rows */}
              {isOpen && (
                <div className="divide-y divide-border/30">
                  {catSkills.map((skill) => {
                    const isSelected = selected.has(skill.id);
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggle(skill.id)}
                        className={`group w-full flex items-center gap-3 px-3 py-2.5 text-left cursor-pointer transition-colors duration-150 ${
                          isSelected
                            ? 'bg-primary/8 hover:bg-primary/12'
                            : 'bg-card hover:bg-muted/20'
                        }`}
                      >
                        {/* Checkbox */}
                        <span
                          className={`shrink-0 flex h-4 w-4 items-center justify-center rounded border transition-colors duration-150 ${
                            isSelected
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'border-border/60 bg-transparent group-hover:border-primary/50'
                          }`}
                        >
                          {isSelected && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                        </span>

                        {/* Name + description */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold leading-tight truncate ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                            {skill.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground leading-snug mt-0.5 truncate">
                            {skill.description}
                          </p>
                        </div>

                        {/* Stars — always right-aligned, no shrink */}
                        <span className="shrink-0 flex items-center gap-0.5 text-[10px] text-amber-400/70 tabular-nums">
                          <Star className="h-2.5 w-2.5 fill-amber-400/70 stroke-none" />
                          {fmtStars(skill.stars)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty search state */}
        {q && CATEGORIES.every((cat) =>
          cat.skills.every((s) =>
            !s.name.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q)
          )
        ) && (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground/50">
            <Search className="h-6 w-6" />
            <p className="text-sm">No results for "<span className="text-foreground/60">{query}</span>"</p>
          </div>
        )}
      </div>

      {/* ── Selected chips (if any) ── */}
      {selected.size > 0 && !q && (
        <div className="shrink-0 flex flex-wrap gap-1.5 pt-0.5">
          {Array.from(selected).slice(0, 8).map((id) => {
            const skill = ALL_SKILLS.find((s) => s.id === id);
            if (!skill) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 pl-2 pr-1 py-0.5 text-[10px] font-medium text-primary"
              >
                {skill.name}
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-primary/20 transition-colors cursor-pointer"
                  aria-label={`Remove ${skill.name}`}
                >
                  <X className="h-2 w-2" />
                </button>
              </span>
            );
          })}
          {selected.size > 8 && (
            <span className="inline-flex items-center rounded-full bg-muted/40 border border-border/50 px-2 py-0.5 text-[10px] text-muted-foreground">
              +{selected.size - 8} more
            </span>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="shrink-0 flex items-center justify-between pt-1">
        <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 rotate-180" />
          Back
        </Button>
        <Button onClick={() => setStep(step + 1)} className="gap-1.5">
          Review
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
