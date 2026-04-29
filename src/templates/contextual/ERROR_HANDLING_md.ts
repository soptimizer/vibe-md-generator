// src/templates/contextual/ERROR_HANDLING_md.ts
import type { ProjectConfig } from '../../types';

export default function ERROR_HANDLING_md(config: ProjectConfig): string {
  const sections: string[] = [`# Error Handling — ${config.name}\n`];

  if (config.frontend === 'react' || config.frontend === 'nextjs') {
    sections.push(`## React Error Boundaries
- Wrap each major page/route with an \`<ErrorBoundary>\` component
- Wrap third-party widgets and async-heavy subtrees individually
- \`fallback\` UI must show a user-friendly message, never a raw stack trace
- Log caught errors to your error reporting service (e.g. Sentry) inside \`componentDidCatch\`

## Async Functions
- Every \`async\` function must have a \`try/catch\` — never leave a promise unhandled
- Re-throw only when the caller is expected to handle the error; otherwise surface it to the user

## Fetch / HTTP Errors
- Check \`response.ok\` after every \`fetch\` call; throw on non-2xx
- Show a **toast notification** for transient errors (network, 5xx)
- Show an **inline error message** next to the relevant element for validation / 4xx errors
- Never display raw error messages from the server to the user

## Form Validation Errors
- Display field-level messages directly below the input, not in a global banner
- Use consistent format: plain text, ≤ 1 sentence, imperative tone (e.g. "Enter a valid email address")
- Clear the error as soon as the user corrects the field
`);
  }

  if (config.frontend === 'vue') {
    sections.push(`## Vue Error Handling
- Use \`onErrorCaptured\` in parent components to intercept child errors; return \`false\` to stop propagation
- In \`async setup()\`, wrap the entire body in \`try/catch\`; set a reactive \`error\` ref and render it in the template
- Pinia actions must catch internally and either set an \`error\` state or re-throw — never swallow silently
\`\`\`ts
// Pinia action pattern
async fetchData() {
  try {
    this.data = await api.getData();
  } catch (err) {
    this.error = err instanceof Error ? err.message : 'Unknown error';
    throw err; // re-throw so callers can react if needed
  }
}
\`\`\`
`);
  }

  if (config.frontend === 'svelte') {
    sections.push(`## Svelte Error Handling
- Use \`{#await}\` blocks with an \`{:catch error}\` clause for every async data load
\`\`\`svelte
{#await loadData()}
  <Spinner />
{:then data}
  <DataView {data} />
{:catch error}
  <ErrorMessage message={error.message} />
{/await}
\`\`\`
- Do not let errors bubble to the Svelte top-level uncaught; handle them in the nearest \`{:catch}\`
`);
  }

  if (config.backend === 'nodejs') {
    sections.push(`## Node.js / Express Error Handling
- Register a global error-handler middleware **last** (after all routes):
\`\`\`ts
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err, path: req.path }); // log server-side
  res.status(500).json({ error: 'Internal server error' }); // generic client message
});
\`\`\`
- Use \`express-async-errors\` (or explicit try/catch) in every async route — unhandled promise rejections crash the process
- HTTP status codes:
  - \`400\` — bad request / validation failure
  - \`401\` — unauthenticated
  - \`403\` — unauthorized (authenticated but no permission)
  - \`404\` — resource not found
  - \`422\` — unprocessable entity (semantic validation)
  - \`5xx\` — unexpected server error (never expose details to client)
- **Log**: request path, error message, stack trace, correlation ID
- **Never log**: passwords, tokens, full request bodies that may contain PII, payment details
`);
  }

  if (config.backend === 'python') {
    sections.push(`## Python / FastAPI Error Handling
- Raise \`HTTPException\` for expected client errors:
\`\`\`python
raise HTTPException(status_code=404, detail="Resource not found")
\`\`\`
- Register \`@app.exception_handler\` for domain-specific exceptions to keep route code clean:
\`\`\`python
@app.exception_handler(DomainError)
async def domain_error_handler(request: Request, exc: DomainError):
    return JSONResponse(status_code=400, content={"error": str(exc)})
\`\`\`
- Pydantic validation errors are caught automatically by FastAPI; customize the 422 response shape via \`RequestValidationError\` handler if needed
- Return a consistent error envelope: \`{ "error": "<message>" }\` — never expose internal tracebacks
`);
  }

  if (config.backend === 'go') {
    sections.push(`## Go Error Handling
- Wrap errors with context at every layer using \`fmt.Errorf\`:
\`\`\`go
if err != nil {
    return fmt.Errorf("fetchUser: %w", err)
}
\`\`\`
- Define sentinel errors for expected conditions so callers can use \`errors.Is\`:
\`\`\`go
var ErrNotFound = errors.New("not found")
\`\`\`
- In HTTP handlers, map domain errors to status codes explicitly — never let internal errors reach the client:
\`\`\`go
if errors.Is(err, ErrNotFound) {
    http.Error(w, "not found", http.StatusNotFound)
    return
}
log.Printf("unexpected error: %v", err)
http.Error(w, "internal server error", http.StatusInternalServerError)
\`\`\`
- Never ignore returned errors with \`_\`; handle or propagate every one
`);
  }

  if (config.backend === 'dotnet') {
    sections.push(`## .NET Core Error Handling
- Use global exception handling middleware:
\`\`\`csharp
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;
        
        // Log the exception here
        
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = "Internal server error" });
    });
});
\`\`\`
- Return structured \`ProblemDetails\` for API errors (RFC 7807):
\`\`\`csharp
return ValidationProblem(ModelState);
\`\`\`
- Never leak stack traces to the client in production environment
`);
  }

  if (config.hasAuth) {
    sections.push(`## Auth Error Responses
- Always return a **generic** message for auth failures — do not reveal whether the email exists or the password was wrong
  - Correct: \`"Invalid credentials"\`
  - Wrong: \`"No account found with this email"\` or \`"Incorrect password"\`
- Use constant-time comparison for tokens/passwords to prevent timing attacks
- Log auth failures server-side with rate-limit context; never log the attempted password
`);
  }

  if (config.hasPayments) {
    sections.push(`## Payment Error Logging
- **Never** log card numbers, CVV, expiry dates, or full PAN — not even partial values beyond the last 4 digits
- Log only: payment intent ID, amount, currency, error code from the provider (e.g. Stripe error code)
- Surface provider error codes to internal logs only; show the user a generic retry message
- Always verify webhook signatures before processing; reject and log unverified events
`);
  }

  sections.push(`---
> AI must follow these patterns for all error handling. Never swallow errors silently.`);

  return sections.join('\n');
}
