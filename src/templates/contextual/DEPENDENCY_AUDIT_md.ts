import type { ProjectConfig } from '../../types';
import { isJSProject } from '../../logic/commands';

function getAuditCmds(config: ProjectConfig): string {
  const lines: string[] = [];

  if (isJSProject(config)) {
    const pm = config.packageManager;
    const auditCmd =
      pm === 'pnpm' ? 'pnpm audit --audit-level=high' :
      pm === 'yarn' ? 'yarn audit --level high' :
      pm === 'bun'  ? 'bun audit' :
                      'npm audit --audit-level=high --production';
    const outdatedCmd =
      pm === 'pnpm' ? 'pnpm outdated' :
      pm === 'yarn' ? 'yarn outdated' :
      pm === 'bun'  ? 'bun outdated' :
                      'npm outdated';
    lines.push(`# Vulnerability scan\n${auditCmd}`);
    lines.push(`# Outdated packages\n${outdatedCmd}`);
  }

  if (config.backend === 'python') {
    lines.push('# Python vulnerability scan (requires pip-audit)\npip-audit');
    lines.push('# Outdated packages\npip list --outdated');
  }

  if (config.backend === 'go') {
    lines.push('# Go vulnerability scan (requires govulncheck)\ngovulncheck ./...');
    lines.push('# Outdated modules\ngo list -u -m all');
  }

  if (config.backend === 'rust') {
    lines.push('# Rust vulnerability scan (requires cargo-audit)\ncargo audit');
    lines.push('# Outdated crates\ncargo outdated');
  }

  if (config.backend === 'dotnet') {
    lines.push('# .NET vulnerability scan\ndotnet list package --vulnerable');
    lines.push('# Outdated packages\ndotnet list package --outdated');
  }

  return lines.map((block) => `\`\`\`bash\n${block}\n\`\`\``).join('\n\n');
}

export default function DEPENDENCY_AUDIT_md(config: ProjectConfig): string {
  return `# Dependency Audit — ${config.name}

## When to Run
- Before every release / deployment
- Monthly routine (add to calendar or CI schedule)
- After adding a new dependency

## Audit Commands

${getAuditCmds(config)}

## Severity Tiers

| Severity | Action | Deadline |
|----------|--------|----------|
| **Critical** | Block release — patch or replace immediately | Same day |
| **High** | Patch before next release | Within 1 week |
| **Moderate** | Schedule fix in next sprint | Within 1 month |
| **Low / Info** | Track in backlog | Next routine audit |

## Remediation Process
1. Run the audit commands above and capture output
2. For each **critical / high** finding:
   - Check if a patched version exists: update and verify tests pass
   - If no patch exists: evaluate replacing the package or adding a workaround
   - Document the decision in \`DECISIONS.md\` if the risk is accepted
3. Commit dependency updates separately from feature work
4. Re-run the audit to confirm findings are resolved

## Checklist (pre-release)
- [ ] No critical or high vulnerabilities in production dependencies
- [ ] \`${isJSProject(config) ? (config.packageManager === 'npm' ? 'package-lock.json' : 'lockfile') : 'lock file'}\` committed and up to date
- [ ] New dependencies reviewed for maintenance status (last commit, open issues)
${config.hasAuth ? '- [ ] Auth-related packages (passport, jwt, bcrypt…) are on latest stable\n' : ''}\
${config.hasPayments ? '- [ ] Payment SDK (stripe…) is on latest stable\n' : ''}\

---
_Run this audit before every release. Document accepted risks in DECISIONS.md._
`;
}
