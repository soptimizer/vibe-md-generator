# VibeMD Generator

Generate project-specific Markdown files for AI-assisted (vibe) coding.

Select your project type, stack, and goals → get a ready-to-use set of `.md` files optimized for token efficiency.

## What It Generates

| File | Always? | Purpose |
|------|---------|---------|
| `CLAUDE.md` / `AGENTS.md` | ✅ | AI onboarding context |
| `ARCHITECTURE.md` | ✅ | Technical decisions |
| `PROGRESS.md` | ✅ | Session continuity |
| `README.md` | ✅ | Project overview |
| `TASKS.md` | Team projects | Task tracking |
| `DATABASE_SCHEMA.md` | Has DB | Schema reference |
| `SECURITY.md` | Has auth/payments | Off-limits + rules |
| `API_SPEC.md` | API projects | Endpoint docs |
| `TESTING_STRATEGY.md` | Has testing | Test conventions |
| `TECH_STACK.md` | High efficiency | Stack decisions |

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

## Project Docs
- [Architecture](./ARCHITECTURE.md)
- [Implementation Plan](./IMPLEMENTATION_PLAN.md)
- [Progress](./PROGRESS.md)
- [Tasks](./TASKS.md)
