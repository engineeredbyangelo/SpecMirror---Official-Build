import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FREE_DAILY_LIMIT = 5;

const HALLUCINATION_RULES = `
CRITICAL RULES:
- Do NOT invent features, integrations, APIs, or requirements the user did not mention or that are not clearly relevant to their project.
- Only reference technologies and patterns the user explicitly mentioned, or that are standard/obvious for the domain described.
- If you must make an assumption about a feature, technology, or requirement, prefix it with **[Assumed]** and briefly explain why.
- Assumptions SHOULD influence the confidence of your specification — more assumptions = lower confidence.
- Stay tightly aligned with the product brief. Do not embellish or add scope.
- Be specific to the user's domain, not generic boilerplate.`;

const TECHNICAL_SPEC_PROMPT = `You are SpecMirror — a senior staff engineer and technical architect. Given a product brief, you produce a comprehensive, production-grade technical specification.

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

${HALLUCINATION_RULES}

ADDITIONAL RULES:
- Be specific, not generic. Reference the actual product domain.
- Include real table/column names, real endpoint paths.
- Every section must have substantive content — never write "TBD" or "to be determined."
- Think about what a senior engineer would need to START building immediately.
- If the brief is vague, make reasonable assumptions and document them with [Assumed].
- Aim for 800-1500 words minimum.`;

const PRD_PROMPT = `You are SpecMirror — a senior product manager and strategist. Given a product brief, you produce a comprehensive Product Requirements Document (PRD).

Your output MUST follow this exact markdown structure:

## Product Requirements Document: [Title]

### Executive Summary
A 2-3 sentence overview of the product vision and target outcome.

### Problem Statement
- What problem does this solve?
- Who experiences this problem?
- What is the current alternative / workaround?

### Target Users
- Primary persona(s) with demographics and behaviors
- Secondary persona(s) if applicable
- Jobs-to-be-done framework

### User Stories
Organized by priority:

**Must Have (P0)**
- As a [user], I want [action] so that [outcome]

**Should Have (P1)**
- As a [user], I want [action] so that [outcome]

**Nice to Have (P2)**
- As a [user], I want [action] so that [outcome]

### Feature Breakdown
For each major feature:
- Feature name
- Description
- User flow (step by step)
- Acceptance criteria
- Edge cases

### Information Architecture
- Site map / navigation structure
- Key screens and their purpose
- Content hierarchy

### Success Metrics
| Metric | Target | Measurement Method |
|--------|--------|--------------------|

### Competitive Analysis
| Competitor | Strengths | Weaknesses | Our Differentiator |
|------------|-----------|------------|-------------------|

### Go-to-Market Considerations
- Launch strategy
- Key milestones
- Dependencies and blockers

### Timeline & Phases
| Phase | Scope | Duration | Dependencies |
|-------|-------|----------|-------------|

### Risks & Mitigations
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|

### Open Questions
Numbered list of decisions that need stakeholder input.

${HALLUCINATION_RULES}

ADDITIONAL RULES:
- Ground every feature and story in the user's actual brief.
- Be specific to the product domain — avoid generic PM templates.
- Prioritize ruthlessly — not everything is P0.
- If the brief is vague, make reasonable assumptions and mark them with [Assumed].
- Aim for 800-1500 words minimum.`;

const SPEC_TYPE_MAP: Record<string, { prompt: string; label: string }> = {
  "technical-spec": { prompt: TECHNICAL_SPEC_PROMPT, label: "Technical Specification" },
  "prd": { prompt: PRD_PROMPT, label: "Product Requirements Doc" },
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-SPEC] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brief, title, projectId, specType } = await req.json();

    if (!brief || typeof brief !== "string" || brief.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Brief must be at least 10 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const selectedType = SPEC_TYPE_MAP[specType] ? specType : "technical-spec";
    const systemPrompt = SPEC_TYPE_MAP[selectedType].prompt;
    logStep("Generation type", { selectedType });

    // Authenticate user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check subscription status via Stripe
    let isSubscribed = false;
    try {
      const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
      if (stripeKey && user.email) {
        const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        if (customers.data.length > 0) {
          const subscriptions = await stripe.subscriptions.list({
            customer: customers.data[0].id,
            status: "active",
            limit: 1,
          });
          isSubscribed = subscriptions.data.length > 0;
        }
      }
    } catch (e) {
      logStep("Stripe check failed, defaulting to free tier", { error: String(e) });
    }

    logStep("Subscription status", { isSubscribed });

    // Rate limit check for free users
    if (!isSubscribed) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count, error: countError } = await supabaseClient
        .from("generation_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", today.toISOString());

      if (countError) {
        logStep("Error checking generation count", { error: countError.message });
      }

      const todayCount = count ?? 0;
      logStep("Daily generation count", { todayCount, limit: FREE_DAILY_LIMIT });

      if (todayCount >= FREE_DAILY_LIMIT) {
        return new Response(
          JSON.stringify({
            error: `You've reached your daily limit of ${FREE_DAILY_LIMIT} generations. Upgrade to Pro for unlimited spec generations.`,
            rateLimited: true,
            dailyLimit: FREE_DAILY_LIMIT,
            used: todayCount,
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Log this generation
    await supabaseClient.from("generation_logs").insert({
      user_id: user.id,
      project_id: projectId || null,
    });

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
          { role: "system", content: systemPrompt },
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
