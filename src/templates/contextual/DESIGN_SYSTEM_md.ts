// src/templates/contextual/DESIGN_SYSTEM_md.ts
import type { ProjectConfig } from '../../types';

function getFrameworkSection(config: ProjectConfig): string {
  if (config.frontend === 'react' || config.frontend === 'nextjs') {
    return `## Component Rules
- One component per file, named to match the filename
- Props interface defined above the component: \`interface ButtonProps { ... }\`
- No inline styles — use utility classes or CSS modules
- Keep components under 150 lines; extract sub-components if longer
- Colocate component-specific styles and tests with the component file`;
  }
  if (config.frontend === 'vue') {
    return `## Component Rules
- Single File Components (.vue) only
- Script setup syntax (\`<script setup lang="ts">\`)
- No inline styles — use scoped \`<style>\` or utility classes
- Emit events with explicit type definitions
- Keep components under 150 lines`;
  }
  if (config.frontend === 'svelte') {
    return `## Component Rules
- One component per \`.svelte\` file
- TypeScript in \`<script lang="ts">\`
- Prefer stores over prop drilling for shared state
- Keep components under 150 lines`;
  }
  return `## Component Rules
- One component per file
- No inline styles
- Keep components focused and under 150 lines`;
}

function getColorSection(): string {
  return `## Color Tokens
Define design tokens in your CSS/config — never use raw hex values in components:

\`\`\`css
:root {
  --color-primary:    #your-brand-color;
  --color-secondary:  #your-secondary-color;
  --color-surface:    #ffffff;
  --color-background: #f9fafb;
  --color-text:       #111827;
  --color-text-muted: #6b7280;
  --color-border:     #e5e7eb;
  --color-error:      #ef4444;
  --color-success:    #22c55e;
}
\`\`\``;
}

function getTypographySection(): string {
  return `## Typography Scale
\`\`\`
heading-xl  → 2.25rem / 700 weight  → page titles
heading-lg  → 1.5rem  / 700 weight  → section headers
heading-md  → 1.25rem / 600 weight  → card titles
body-lg     → 1.125rem / 400        → lead text
body        → 1rem    / 400         → default body
body-sm     → 0.875rem / 400        → captions, labels
code        → 0.875rem / mono       → inline code
\`\`\``;
}

export default function DESIGN_SYSTEM_md(config: ProjectConfig): string {
  return `# Design System — ${config.name}

This file is the single source of truth for UI decisions.
The AI should read this before touching any visual component.

## Design Reference
| Resource | Link |
|----------|------|
| Figma file | _Paste your Figma URL here_ |
| Storybook | _Paste your Storybook URL here (if applicable)_ |
| Brand guidelines | _Paste link or leave N/A_ |

> Figma is the authority for all visual decisions. Check it before implementing any UI.
> If no Figma file exists yet, document design decisions directly in this file.

## Guiding Principle
Consistency over creativity. Reuse existing tokens and components before adding new ones.

${getColorSection()}

${getTypographySection()}

## Spacing Scale
Use a base-4 spacing scale: \`4px · 8px · 12px · 16px · 24px · 32px · 48px · 64px\`
Never use arbitrary pixel values — map to the nearest scale step.

${getFrameworkSection(config)}

## Naming Conventions
| Entity | Convention | Example |
|--------|-----------|---------|
| Component files | PascalCase | \`UserCard.tsx\` |
| CSS class names | kebab-case | \`user-card__title\` |
| CSS variables | kebab-case | \`--color-primary\` |
| Event handlers | on + PascalCase | \`onSubmitForm\` |

## Accessibility Baseline
- All interactive elements must be keyboard-navigable
- Images need descriptive \`alt\` text
- Color contrast ratio ≥ 4.5:1 for body text
- Form inputs must have associated \`<label>\` elements
- Use semantic HTML (button, nav, main, section) over generic divs

## Icon Library
_Define your icon library here (e.g., Lucide, Heroicons, Phosphor)._
Use one library project-wide — never mix.

---
_Update color tokens and typography when the design changes. AI should never invent new tokens._
`;
}
