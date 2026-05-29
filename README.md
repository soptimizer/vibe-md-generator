<div align="center">

<img src="public/vite.svg" width="64" height="64" alt="VibeMD Generator" />

# VibeMD Generator

**Generate AI-context Markdown files for your project — in seconds.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000000?style=flat-square)](https://ui.shadcn.com/)
[![License](https://img.shields.io/badge/license-MIT-22C55E?style=flat-square)](LICENSE)

[**Live Demo →**](https://vibemd-generator.vercel.app) &nbsp;·&nbsp; [Report Bug](https://github.com/senaikalafat/vibemd-generator/issues) &nbsp;·&nbsp; [Request Feature](https://github.com/senaikalafat/vibemd-generator/issues)

</div>

---

## What is VibeMD Generator?

VibeMD Generator is a **client-side wizard** that produces a tailored set of Markdown context files for any project — ready to be dropped into your codebase and consumed by AI coding assistants like [Claude](https://claude.ai), [Cursor](https://cursor.sh), [Windsurf](https://codeium.com/windsurf), or [Codex](https://openai.com/index/openai-codex/).

Instead of writing `CLAUDE.md`, `ARCHITECTURE.md`, `TASKS.md` and a dozen other context files by hand, you answer **5 short steps** in the wizard and download a ZIP. Done.

> **Zero backend. Zero accounts. Everything runs in your browser.**

---

## ✨ Features

- 🧙 **5-step guided wizard** — project basics, tech stack, features & goals, skills, review
- 📄 **Smart file selection** — only generates the files your project actually needs
- 👁️ **Live Markdown preview** — rendered + raw view with one-click copy
- 📦 **ZIP export** — download everything in one click
- 🌗 **Dark-first UI** — polished dark theme with Plus Jakarta Sans
- ⚡ **Fully client-side** — no data leaves your browser
- 🔄 **Live config bar** — see your choices reflected in real-time

---

## 📁 Generated Files

**Always included**

| File | Purpose |
|------|---------|
| `CLAUDE.md` / `AGENTS.md` / `GEMINI.md` | AI onboarding context: role, stack, conventions |
| `README.md` | Project overview for humans and AI |
| `ARCHITECTURE.md` | Folder structure, data flow, design decisions |
| `PROGRESS.md` | Session continuity — what's done, what's next |
| `PRD.md` | Product requirements & scope |
| `llms.txt` | Plain-text project context for LLM tools |
| `.gitignore` | Sensible defaults per stack |

**AI tool-specific**

| Tool | Files |
|------|-------|
| Claude | `.claude/settings.json`, `.claude/mcp.json` |
| Cursor | `.cursor/rules/project.mdc`, `.cursorignore` |
| Windsurf | `.windsurfignore`, `WINDSURF_RULES.md` |
| Copilot | `.github/copilot-instructions.md` |
| OpenCode | `opencode.json`, `.agent/agents/*.md`, `.agent/skills/*.md` |
| Antigravity | `AGENTS.md`, `.agent/skills/*.md`, `.agent/workflows/*.md` |

**Feature-conditional**

| File | Included when |
|------|--------------|
| `TASKS.md` | Team / enterprise scale |
| `TECH_STACK.md` | Comprehensive token mode |
| `DATABASE_SCHEMA.md` | Has a database |
| `SECURITY.md` | Auth or payments enabled |
| `API_SPEC.md` | API / service / backend project |
| `TESTING_STRATEGY.md` | Testing enabled |
| `DEPLOYMENT.md` | Deployment enabled |
| `DESIGN_SYSTEM.md` | Frontend project |
| `ERROR_HANDLING.md` | Frontend or backend project |
| `GIT_WORKFLOW.md` | Team / enterprise scale |
| `CONTRIBUTING.md` | Team / enterprise scale |
| `DECISIONS.md` | Comprehensive mode or team scale |
| `CONTEXT_MAP.md` | Comprehensive token mode |
| `IMPLEMENTATION_PLAN.md` | Comprehensive token mode |
| `DEPENDENCY_AUDIT.md` | Deployment or team scale |
| `INCIDENT_RESPONSE.md` | Deployment + team scale |

---

## 🖥️ Screenshots

| Step 1 — Project Basics | Step 3 — Features & Goals |
|---|---|
| Name, type, scale, AI tool | Auth, payments, testing, AI role & token mode |

| Step 5 — Review | Live Preview |
|---|---|
| Config summary + file manifest | Rendered Markdown with sidebar navigation |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm**, **pnpm**, **bun**, or **yarn**

### Install & Run

```bash
# Clone the repository
git clone https://github.com/senaikalafat/vibemd-generator.git
cd vibemd-generator

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## 🗺️ How It Works

```
User Input (5-step wizard)
  └─▶ Zustand Store (ProjectConfig)
        └─▶ fileSelector.ts        ← decides which .md files to include
              └─▶ templateRegistry ← 37 typed template functions
                    └─▶ generator.ts ← assembles GeneratedFile[]
                          └─▶ MDPreview (renders output in the browser)
                                └─▶ exporter.ts (ZIP download or clipboard copy)
```

All templates live in `src/templates/` and export a single pure function:

```ts
export default function myTemplate(config: ProjectConfig): string { ... }
```

Adding a new template is as simple as writing that function and registering it in `fileSelector.ts`.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript 5.5 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| UI primitives | Radix UI |
| Icons | Lucide React |
| State | Zustand |
| Markdown | react-markdown + remark-gfm |
| ZIP export | JSZip |
| Font | Plus Jakarta Sans + Geist Variable |

---

## 📂 Project Structure

```
vibemd-generator/
├── src/
│   ├── components/
│   │   ├── wizard/           # Step1_Basics … Step5_Review
│   │   ├── preview/          # PreviewLayout, FileList, MDPreview
│   │   └── ui/               # shadcn/ui components
│   ├── logic/
│   │   ├── fileSelector.ts   # Rule engine — which files to generate
│   │   ├── generator.ts      # Calls templateRegistry, assembles GeneratedFile[]
│   │   ├── skillsHelper.ts   # hasSkill(), hasAnySkill()
│   │   ├── commands.ts       # Per-stack CLI command strings
│   │   ├── ignorePatterns.ts # Build output + dependency dir helpers
│   │   └── exporter.ts       # ZIP + clipboard export
│   ├── store/
│   │   └── projectStore.ts   # Zustand store with localStorage persist
│   ├── templates/
│   │   ├── index.ts          # templateRegistry: Record<MDFileKey, fn>
│   │   ├── core/             # 6 always-required templates
│   │   └── contextual/       # 31 conditional templates
│   ├── types/
│   │   └── index.ts          # ProjectConfig, MDFileKey, GeneratedFile, WizardStore
│   ├── lib/
│   │   └── utils.ts          # cn() Tailwind merge utility
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.ts
└── vite.config.ts
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feat/my-feature`
5. Open a Pull Request

### Adding a New Template

1. Add the key to `MDFileKey` in `src/types/index.ts`
2. Create `src/templates/contextual/MY_TEMPLATE_md.ts` and export a default function `(config: ProjectConfig) => string`
3. Register it in `src/templates/index.ts` (import + add to `templateRegistry`)
4. Add `getFilename()` mapping in `src/logic/fileSelector.ts`
5. Add the selection rule in `selectFiles()` in `src/logic/fileSelector.ts`

---

## 📝 License

MIT © [Senai Kalafat](https://github.com/senaikalafat)

---

<div align="center">

Made with ☕ and a lot of Markdown

**[⭐ Star this repo](https://github.com/senaikalafat/vibemd-generator)** if you find it useful!

</div>
