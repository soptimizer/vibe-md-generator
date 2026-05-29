import type { ProjectConfig } from '../../types';

function getSeverityTable(config: ProjectConfig): string {
  const rows = [
    '| **P1 — Critical** | Production is down or data is lost | Immediate — all hands |',
    '| **P2 — High** | Core feature broken, significant user impact | Within 30 minutes |',
    '| **P3 — Medium** | Degraded experience, workaround exists | Within 4 hours |',
    '| **P4 — Low** | Minor issue, cosmetic or edge-case | Next sprint |',
  ];
  if (config.hasPayments) {
    rows.splice(1, 0, '| **P1 — Payment** | Payment processing failure | Immediate — escalate to payment provider |');
  }
  return `| Severity | Definition | Response Time |\n|----------|------------|---------------|\n${rows.join('\n')}`;
}

function getContainmentSteps(config: ProjectConfig): string {
  const steps = [
    '1. Identify the last known-good deployment and prepare a rollback',
    '2. Enable maintenance mode or rate-limit the affected endpoint if possible',
  ];
  if (config.databases.length > 0) {
    steps.push('3. Verify database integrity — check for corrupted rows or failed migrations');
  }
  if (config.hasAuth) {
    steps.push('4. If the incident involves auth: revoke all active sessions as a precaution');
  }
  if (config.hasPayments) {
    steps.push('5. If payments are affected: disable the checkout flow and notify the payment provider');
  }
  steps.push(`${steps.length + 1}. Communicate status to affected users (use a status page or direct message)`);
  return steps.join('\n');
}

export default function INCIDENT_RESPONSE_md(config: ProjectConfig): string {
  return `# Incident Response — ${config.name}

## Severity Levels

${getSeverityTable(config)}

---

## Phase 1 — Triage (< 5 min)
1. Confirm the incident is real (not a monitoring fluke)
2. Assign a severity level from the table above
3. Designate an **incident commander** — one person coordinates, others execute
4. Open a dedicated communication channel (Slack thread, war room, etc.)
5. Start an incident log: timestamp every action taken

## Phase 2 — Containment
${getContainmentSteps(config)}

## Phase 3 — Root Cause & Fix
1. Read recent git log: \`git log --oneline -20\`
2. Check application logs and error tracking for the first occurrence
3. Reproduce the issue in staging if possible before fixing in production
4. Apply the smallest change that resolves the incident
5. Deploy fix → verify with smoke tests → confirm incident is resolved
6. If fix is risky: roll back first, fix forward on a branch

## Phase 4 — Post-Mortem (within 48 h)
Complete the template below and add it to \`DECISIONS.md\`:

\`\`\`
## Incident: <title> — <date>

**Duration:** <start> → <end>
**Severity:** P?
**Impact:** <users / features affected>

### Timeline
- HH:MM — First alert / report
- HH:MM — Incident declared
- HH:MM — Containment applied
- HH:MM — Root cause identified
- HH:MM — Fix deployed
- HH:MM — Incident resolved

### Root Cause
<What went wrong and why>

### What Went Well
- ...

### What Could Be Improved
- ...

### Action Items
- [ ] <Owner> — <task> — <due date>
\`\`\`

---

## Useful Commands During an Incident
\`\`\`bash
# Recent commits
git log --oneline -20

# Revert last deployment
git revert HEAD --no-edit && git push
${config.databases.length > 0 ? '\n# Check DB connection\n# (replace with your DB health-check command)' : ''}\
\`\`\`

---
_Review and update this document after every P1 / P2 incident._
`;
}
