// src/templates/contextual/CURSOR_RULES_md.ts
import type { ProjectConfig } from '../../types';

function getOffLimitsPaths(config: ProjectConfig): string {
  const paths: string[] = [];
  if (config.hasAuth) {
    paths.push('  - src/auth/**');
    paths.push('  - src/middleware/**');
  }
  if (config.hasPayments) {
    paths.push('  - src/payments/**');
    paths.push('  - src/billing/**');
  }
  paths.push('  - .env');
  return paths.join('\n');
}

function getStackRules(config: ProjectConfig): string {
  const rules: string[] = [];
  if (config.frontend !== 'none') {
    rules.push(`- Frontend is **${config.frontend}** — match existing component patterns`);
  }
  if (config.backend !== 'none') {
    rules.push(`- Backend is **${config.backend}** — follow existing folder structure`);
  }
  if (config.databases.length > 0) {
    rules.push(`- Databases: **${config.databases.join(', ')}** — always use the ORM/query builder/SDK, never raw queries when possible`);
  }
  if (config.queues.length > 0) {
    rules.push(`- Queues: **${config.queues.join(', ')}**`);
  }
  return rules.length > 0 ? rules.join('\n') : '- Follow the stack defined in TECH_STACK.md';
}

function getDeprecatedPatterns(config: ProjectConfig): string {
  const entries: string[] = [];

  if (config.frontend === 'react' || config.frontend === 'nextjs') {
    entries.push(
      '❌ class components → ✅ function components + hooks\nWhy: hooks compose better and class lifecycle is harder to reason about',
      '❌ useEffect for derived state → ✅ useMemo\nWhy: effects run after render and cause extra cycles',
      '❌ prop drilling 3+ levels → ✅ context or store\nWhy: deeply drilled props make refactoring and testing painful',
    );
  }

  if (config.frontend === 'vue') {
    entries.push(
      '❌ Options API → ✅ Composition API + <script setup>\nWhy: better TypeScript inference and co-location of related logic',
      '❌ this.$emit without typing → ✅ defineEmits<{...}>()\nWhy: untyped emits break IDE autocomplete and silent runtime errors',
    );
  }

  if (config.backend === 'nodejs') {
    entries.push(
      '❌ callback hell → ✅ async/await\nWhy: callbacks nest deeply, making error handling brittle',
      '❌ require() → ✅ ES module import\nWhy: static imports enable tree-shaking and top-level await',
      '❌ string concatenation in SQL → ✅ parameterized queries\nWhy: SQL injection vulnerability',
    );
  }

  if (config.backend === 'python') {
    entries.push(
      '❌ mutable default arguments → ✅ None + body assignment\nWhy: mutable defaults are shared across all calls, causing subtle bugs',
      '❌ bare except → ✅ except SpecificError\nWhy: bare except swallows KeyboardInterrupt and SystemExit',
    );
  }

  if (config.backend === 'go') {
    entries.push(
      '❌ panic for business errors → ✅ error return values\nWhy: panic unwinds the stack and bypasses structured error handling',
      '❌ global state → ✅ dependency injection\nWhy: global state makes testing and concurrency unpredictable',
    );
  }

  if (config.backend === 'dotnet') {
    entries.push(
      '❌ Fat Controllers → ✅ Service Layer\nWhy: Keeps controllers lean and logic reusable',
      '❌ synchronous I/O → ✅ async/await\nWhy: Prevents thread pool starvation',
    );
  }

  if (entries.length === 0) return '';

  return `\n## Deprecated Patterns\n\n${entries.join('\n\n')}\n`;
}

function getCanonicalPattern(config: ProjectConfig): string {
  const sections: string[] = [];

  if (config.frontend === 'react' || config.frontend === 'nextjs') {
    sections.push(`## Canonical Pattern — React

### Custom Hook (useResource pattern)
\`\`\`ts
// src/hooks/use${toPascal(config.name)}Data.ts
import { useState, useEffect } from 'react';

interface Use${toPascal(config.name)}DataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function use${toPascal(config.name)}Data<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): Use${toPascal(config.name)}DataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => { if (!cancelled) setData(result); })
      .catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}
\`\`\`

### Component (props interface + JSX)
\`\`\`tsx
// src/components/${toPascal(config.name)}Card.tsx
interface ${toPascal(config.name)}CardProps {
  title: string;
  description: string;
  onAction: () => void;
  disabled?: boolean;
}

export function ${toPascal(config.name)}Card({ title, description, onAction, disabled = false }: ${toPascal(config.name)}CardProps) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
      <button
        onClick={onAction}
        disabled={disabled}
        className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
      >
        Go
      </button>
    </div>
  );
}
\`\`\``);
  }

  if (config.frontend === 'vue') {
    sections.push(`## Canonical Pattern — Vue

### Composable (script setup + TypeScript)
\`\`\`ts
// src/composables/use${toPascal(config.name)}Data.ts
import { ref, onMounted } from 'vue';

export function use${toPascal(config.name)}Data<T>(fetcher: () => Promise<T>) {
  const data = ref<T | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      data.value = await fetcher();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  }

  onMounted(load);
  return { data, loading, error, reload: load };
}
\`\`\`

### Component using the composable
\`\`\`vue
<script setup lang="ts">
import { use${toPascal(config.name)}Data } from '@/composables/use${toPascal(config.name)}Data';

const { data, loading, error } = use${toPascal(config.name)}Data(() => fetch('/api/items').then(r => r.json()));
</script>

<template>
  <div v-if="loading">Loading…</div>
  <div v-else-if="error" class="text-red-600">{{ error }}</div>
  <ul v-else>
    <li v-for="item in data" :key="item.id">{{ item.name }}</li>
  </ul>
</template>
\`\`\``);
  }

  if (config.frontend === 'svelte') {
    sections.push(`## Canonical Pattern — Svelte

### Store + component integration
\`\`\`ts
// src/stores/${toCamel(config.name)}Store.ts
import { writable, derived } from 'svelte/store';

interface Item { id: string; name: string; }

function create${toPascal(config.name)}Store() {
  const items = writable<Item[]>([]);
  const loading = writable(false);
  const error = writable<string | null>(null);

  async function load() {
    loading.set(true);
    error.set(null);
    try {
      const res = await fetch('/api/items');
      items.set(await res.json());
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      loading.set(false);
    }
  }

  return { items, loading, error, load };
}

export const ${toCamel(config.name)}Store = create${toPascal(config.name)}Store();
\`\`\`

\`\`\`svelte
<!-- src/components/${toPascal(config.name)}List.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { ${toCamel(config.name)}Store } from '../stores/${toCamel(config.name)}Store';
  const { items, loading, error, load } = ${toCamel(config.name)}Store;
  onMount(load);
</script>

{#if $loading}<p>Loading…</p>
{:else if $error}<p class="error">{$error}</p>
{:else}
  <ul>{#each $items as item}<li>{item.name}</li>{/each}</ul>
{/if}
\`\`\``);
  }

  if (config.backend === 'nodejs') {
    sections.push(`## Canonical Pattern — Node.js

### Route → Controller → Service (3-file slice)
\`\`\`ts
// src/routes/items.route.ts
import { Router } from 'express';
import { ItemsController } from '../controllers/items.controller';

const router = Router();
const ctrl = new ItemsController();

router.get('/', ctrl.list);
router.post('/', ctrl.create);

export default router;
\`\`\`

\`\`\`ts
// src/controllers/items.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ItemsService } from '../services/items.service';

export class ItemsController {
  private svc = new ItemsService();

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.svc.findAll());
    } catch (err) { next(err); }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(await this.svc.create(req.body as { name: string }));
    } catch (err) { next(err); }
  };
}
\`\`\`

\`\`\`ts
// src/services/items.service.ts
// Replace db with your ORM client (Prisma, Drizzle, etc.)
import { db } from '../db';

export class ItemsService {
  findAll() { return db.item.findMany(); }
  create(data: { name: string }) { return db.item.create({ data }); }
}
\`\`\``);
  }

  if (config.backend === 'python') {
    sections.push(`## Canonical Pattern — Python

### Router → Service (dependency injection)
\`\`\`python
# src/services/items_service.py
from dataclasses import dataclass
from typing import Protocol

class ItemRepository(Protocol):
    def find_all(self) -> list[dict]: ...
    def create(self, name: str) -> dict: ...

@dataclass
class ItemsService:
    repo: ItemRepository

    def list_items(self) -> list[dict]:
        return self.repo.find_all()

    def add_item(self, name: str) -> dict:
        if not name.strip():
            raise ValueError("name cannot be blank")
        return self.repo.create(name)
\`\`\`

\`\`\`python
# src/routers/items.py
from fastapi import APIRouter, Depends
from .deps import get_items_service
from .services.items_service import ItemsService

router = APIRouter(prefix="/items", tags=["items"])

@router.get("/")
def list_items(svc: ItemsService = Depends(get_items_service)) -> list[dict]:
    return svc.list_items()

@router.post("/", status_code=201)
def create_item(payload: dict, svc: ItemsService = Depends(get_items_service)) -> dict:
    return svc.add_item(payload["name"])
\`\`\``);
  }

  if (config.backend === 'go') {
    sections.push(`## Canonical Pattern — Go

### Handler → Service → Repository (interface-driven)
\`\`\`go
// internal/domain/item.go
package domain

type Item struct {
    ID   string
    Name string
}

type ItemRepository interface {
    FindAll() ([]Item, error)
    Create(name string) (Item, error)
}

type ItemService interface {
    List() ([]Item, error)
    Add(name string) (Item, error)
}
\`\`\`

\`\`\`go
// internal/service/item_service.go
package service

import "${toCamel(config.name)}/internal/domain"

type itemService struct{ repo domain.ItemRepository }

func NewItemService(repo domain.ItemRepository) domain.ItemService {
    return &itemService{repo: repo}
}

func (s *itemService) List() ([]domain.Item, error)          { return s.repo.FindAll() }
func (s *itemService) Add(name string) (domain.Item, error)  { return s.repo.Create(name) }
\`\`\`

\`\`\`go
// internal/handler/item_handler.go
package handler

import (
    "encoding/json"
    "net/http"
    "${toCamel(config.name)}/internal/domain"
)

type ItemHandler struct{ svc domain.ItemService }

func NewItemHandler(svc domain.ItemService) *ItemHandler { return &ItemHandler{svc: svc} }

func (h *ItemHandler) List(w http.ResponseWriter, r *http.Request) {
    items, err := h.svc.List()
    if err != nil { http.Error(w, err.Error(), http.StatusInternalServerError); return }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(items)
}
\`\`\``);
  }

  if (config.backend === 'dotnet') {
    sections.push(`## Canonical Pattern — .NET

### Controller → Service
\`\`\`csharp
// src/Controllers/ItemsController.cs
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly IItemService _service;

    public ItemsController(IItemService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> List()
    {
        return Ok(await _service.ListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateItemDto dto)
    {
        return CreatedAtAction(nameof(List), await _service.AddAsync(dto.Name));
    }
}
\`\`\`

\`\`\`csharp
// src/Services/ItemService.cs
public class ItemService : IItemService
{
    private readonly AppDbContext _context;

    public ItemService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Item>> ListAsync()
    {
        return await _context.Items.ToListAsync();
    }

    public async Task<Item> AddAsync(string name)
    {
        var item = new Item { Name = name };
        _context.Items.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }
}
\`\`\``);
  }

  if (sections.length === 0) return '';
  return '\n' + sections.join('\n\n') + '\n';
}

function toPascal(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (c: string) => c.toUpperCase());
}

function toCamel(str: string): string {
  const pascal = toPascal(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function buildMetadataBlock(config: ProjectConfig): string {
  const today = new Date();
  const lastReviewed = today.toISOString().slice(0, 10);
  const nextReview = new Date(today);
  nextReview.setDate(nextReview.getDate() + 30);
  const nextReviewStr = nextReview.toISOString().slice(0, 10);

  const lines: string[] = ['---', 'framework-versions:'];
  if (config.frontend !== 'none') {
    lines.push(`  frontend: ${config.frontend} latest stable — update this when you upgrade`);
  }
  if (config.backend !== 'none') {
    lines.push(`  backend: ${config.backend} latest stable — update this when you upgrade`);
  }
  lines.push(`last-reviewed: ${lastReviewed}`);
  lines.push(`next-review: ${nextReviewStr}`);
  lines.push('---');

  return lines.join('\n');
}

export default function CURSOR_RULES_md(config: ProjectConfig): string {
  return `---
description: Project rules for ${config.name}
globs: ["**/*"]
alwaysApply: true
---

# ${config.name} — Cursor Rules

${buildMetadataBlock(config)}

## Project Context
${config.description}

Read these files before making any change:
- \`ARCHITECTURE.md\` — system design, layer separation, and folder structure
- \`PROGRESS.md\` — what is done and what is next
${config.frontend !== 'none' ? '- `DESIGN_SYSTEM.md` — color tokens, typography, component conventions\n' : ''}\
${config.databases.length > 0 ? '- `DATABASE_SCHEMA.md` — current schema\n' : ''}\
${config.hasAuth || config.hasPayments ? '- `SECURITY.md` — off-limits paths and rules\n' : ''}\
${config.scale !== 'solo' ? '- `GIT_WORKFLOW.md` — branch naming and PR conventions\n' : ''}\

## Stack Rules
${getStackRules(config)}

## Coding Rules
- **Edit existing files before creating new ones** — always
- Respect the layer separation defined in \`ARCHITECTURE.md\` (Presentation / Business Logic / Data Access)
- Check for similar patterns before writing a utility
- No commented-out code — delete it
- No \`any\` types — use explicit types
- Keep functions under 40 lines; split if longer
${config.frontend !== 'none' ? '- UI: follow color tokens and typography from `DESIGN_SYSTEM.md` — no raw hex values\n' : ''}\

## Off-Limits (never modify without explicit instruction)
${getOffLimitsPaths(config)}

## Vertical Slice Workflow
When implementing a feature, go DB → API → UI in one slice:
1. Define/migrate the data model
2. Implement the backend logic / API route
3. Connect the frontend to the new endpoint
4. Mark the task done in \`PROGRESS.md\`

## After Each Feature
Update \`PROGRESS.md\` to reflect what shipped.
${getDeprecatedPatterns(config)}${getCanonicalPattern(config)}
> ⚠️ Review these rules when upgrading framework versions. Stale rules generate
> outdated code patterns.
---`;
}
