# Tech Stack

## Frontend
| Tool | Version | Reason |
|------|---------|--------|
| React | 18 | Component model, wide ecosystem |
| TypeScript | 5 | Type safety for template functions |
| Vite | 5 | Fast dev server, simple config |
| Tailwind CSS | 3 | Utility-first, no CSS files needed |

## State
| Tool | Reason |
|------|--------|
| Zustand | No provider boilerplate, simple API |

## Utilities
| Tool | Reason |
|------|--------|
| JSZip | Client-side ZIP — no server needed |
| react-markdown | Render generated MD in preview panel |
| react-router-dom | Wizard step routing |

## Dev Tools
| Tool | Reason |
|------|--------|
| ESLint | Code quality |
| Prettier | Formatting |

## Deployment
- Platform: Vercel (free tier)
- Build: `npm run build` → `dist/`
- No env vars required (fully client-side)

## Not Using
- Redux — overkill for this state shape
- Next.js — no SSR needed, static is fine
- Any UI library — custom components only
