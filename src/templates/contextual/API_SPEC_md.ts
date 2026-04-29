// src/templates/contextual/API_SPEC_md.ts
import type { ProjectConfig } from '../../types';

export default function API_SPEC_md(config: ProjectConfig): string {
  return `# API Spec — ${config.name}

## Base URL
- Dev: \`http://localhost:3000/api\`
- Prod: \`https://your-domain.com/api\`

## Auth
${config.hasAuth ? '- Bearer token in `Authorization` header\n- `401` if missing/invalid, `403` if unauthorized\n' : '- No auth required\n'}\

## Endpoints

### Health
\`\`\`
GET /health
Response: { status: "ok" }
\`\`\`

_Add endpoints below as you build them:_

### [Resource Name]
\`\`\`
GET    /[resource]          List
POST   /[resource]          Create
GET    /[resource]/:id      Get one
PUT    /[resource]/:id      Update
DELETE /[resource]/:id      Delete
\`\`\`

**Request body (POST/PUT):**
\`\`\`json
{
  "field": "type"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "string",
  "field": "value"
}
\`\`\`

## Error Format
\`\`\`json
{ "error": "message", "code": "ERROR_CODE" }
\`\`\`

## Status Codes
| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad request |
| 401 | Unauthenticated |
| 403 | Forbidden |
| 404 | Not found |
| 500 | Server error |
`;
}
