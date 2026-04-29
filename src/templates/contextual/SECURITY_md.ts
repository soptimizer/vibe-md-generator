// src/templates/contextual/SECURITY_md.ts
import type { ProjectConfig } from '../../types';

export default function SECURITY_md(config: ProjectConfig): string {
  return `# Security — ${config.name}

## Off-Limits
Never modify these without explicit instruction:
${config.hasAuth ? '- `/src/auth/**` — authentication logic\n- `/src/middleware/**` — auth middleware\n' : ''}\
${config.hasPayments ? '- `/src/payments/**` — payment processing\n- `/src/billing/**` — billing logic\n' : ''}\
- '.env' and any secrets/credentials file
- Any file with "token", "secret", "key" in the name

## Environment Variables
- Never hardcode secrets in source code
- Never commit '.env' to git
- Use '.env.example' with dummy values for documentation

## Input Validation
- Validate all user inputs server-side
- Sanitize before any database query
- Never trust client-sent IDs for ownership checks
${config.hasAuth ? `
## Auth Rules
- Verify session/JWT on every protected route
- Invalidate tokens on logout
- Use short-lived access tokens + refresh tokens
` : ''}\
${config.hasPayments ? `
## Payment Rules
- Never log full card numbers or CVV
- Use payment provider's hosted fields (Stripe Elements, etc.)
- Always verify webhook signatures
` : ''}\
_Review this file before any auth or payment-related changes._
`;
}
