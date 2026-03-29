import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are SpecMirror — a senior staff engineer and technical architect. Given a product brief, you produce a comprehensive, production-grade technical specification.

Your output MUST follow this exact markdown structure:

## Technical Specification: [Title]

### Executive Summary
A 2-3 sentence overview of what this system does and its core value.

### Architecture Overview
- System architecture pattern (monolith, microservices, serverless, etc.)
- High-level component diagram described in text
- Key technology choices with rationale
- Communication patterns (REST, GraphQL, WebSocket, event-driven)

### Data Model
\`\`\`
table_name:
  column: type [constraints] — description
\`\`\`
Include all tables, relationships, indexes, and constraints. Think about edge cases in data integrity.

### API Design
List every endpoint or function with:
- Method + path
- Request/response shape
- Auth requirements
- Rate limiting considerations

### State Management
- Client-side state architecture
- Server-side state / caching strategy
- Real-time sync approach (if applicable)

### Authentication & Authorization
- Auth flow details
- Role-based access control
- Token strategy
- Session management

### Error Handling & Edge Cases
A table of every edge case you can identify:
| Scenario | Handling | User Experience |
|----------|----------|-----------------|

### Performance Considerations
- Expected load and scaling strategy
- Caching layers
- Database query optimization
- Bundle size / code splitting strategy

### Security Considerations
- Input validation
- XSS / CSRF / injection prevention
- Data encryption (at rest, in transit)
- PII handling

### Testing Strategy
- Unit test coverage targets
- Integration test plan
- E2E critical paths
- Load testing approach

### Deployment & Infrastructure
- CI/CD pipeline
- Environment strategy (dev, staging, prod)
- Monitoring and alerting
- Rollback strategy

### Effort Estimate
| Phase | Tasks | Duration | Engineers |
|-------|-------|----------|-----------|
Break down by phase with realistic estimates.

**Total: X days (Y engineers)**

### Acceptance Criteria
Numbered list of measurable, testable criteria.

### Risks & Mitigations
| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|

### Open Questions
Numbered list of decisions that need stakeholder input.

RULES:
- Be specific, not generic. Reference the actual product domain.
- Include real table/column names, real endpoint paths.
- Every section must have substantive content — never write "TBD" or "to be determined."
- Think about what a senior engineer would need to START building immediately.
- If the brief is vague, make reasonable assumptions and document them.
- Aim for 800-1500 words minimum.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brief, title } = await req.json();

    if (!brief || typeof brief !== "string" || brief.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Brief must be at least 10 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Project Title: ${title || "Untitled"}\n\nProduct Brief:\n${brief}`,
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage credits exhausted. Please add funds in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "AI generation failed. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-spec error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
