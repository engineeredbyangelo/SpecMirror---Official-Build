# Contributing to SpecMirror

Thanks for your interest in contributing to SpecMirror. This guide will help you get started.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Edge Functions](#edge-functions)
- [Design System](#design-system)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

Be respectful, constructive, and collaborative. We're building tools for engineers — let's treat each other like the professionals we are.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch from `main`
4. Make your changes
5. Submit a pull request

## Development Setup

### Prerequisites

- **Node.js** 18+ (or Bun)
- **npm**, **pnpm**, or **bun** for package management

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/specmirror.git
cd specmirror

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

The project uses Lovable Cloud for backend services. Environment variables are managed automatically in the Lovable environment. For local development, create a `.env.local` file:

```
VITE_SUPABASE_URL=<your-backend-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/              # shadcn/ui primitives (do not edit directly)
├── contexts/            # React context providers (auth, etc.)
├── hooks/               # Custom React hooks
├── integrations/        # Backend client configuration (auto-generated, do not edit)
├── lib/                 # Utility functions (crypto, helpers)
├── pages/               # Route-level page components
└── index.css            # Design tokens and global styles

supabase/
└── functions/           # Backend edge functions
```

### Key Files

| File | Purpose | Editable? |
|------|---------|-----------|
| `src/integrations/supabase/client.ts` | Backend client | ❌ Auto-generated |
| `src/integrations/supabase/types.ts` | Database types | ❌ Auto-generated |
| `src/index.css` | Design tokens | ✅ With care |
| `tailwind.config.ts` | Tailwind theme | ✅ With care |
| `supabase/functions/*` | Edge functions | ✅ |

## Making Changes

### Before You Start

- Check existing issues and PRs to avoid duplicate work
- For significant changes, open an issue first to discuss the approach
- Keep PRs focused — one feature or fix per PR

### Branch Naming

```
feature/add-slack-integration
fix/share-link-expiry
refactor/dashboard-layout
docs/update-readme
```

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add encrypted link expiry selector
fix: resolve share dialog not closing on success
refactor: extract spec renderer into standalone component
docs: add contributing guidelines
chore: update dependencies
```

### Rules

- Use present tense ("add feature" not "added feature")
- Use lowercase for the description
- Keep the subject line under 72 characters
- Reference issue numbers where applicable: `feat: add export to PDF (#42)`

## Pull Request Process

1. **Update tests** if your change affects existing behavior
2. **Run the linter** before submitting: `npm run lint`
3. **Build successfully**: `npm run build`
4. **Write a clear PR description** explaining:
   - What the change does
   - Why it's needed
   - How to test it
   - Screenshots for UI changes
5. **Request review** from at least one maintainer
6. **Address feedback** promptly — we aim to merge within 48 hours of approval

## Code Style

### TypeScript

- Strict mode is enabled — no `any` types without justification
- Use explicit return types on exported functions
- Prefer `interface` over `type` for object shapes
- Use barrel exports sparingly

### React

- Functional components only
- Prefer composition over prop drilling — use context where appropriate
- Keep components small and focused (under ~150 lines)
- Co-locate component-specific hooks and utilities

```tsx
// ✅ Good — focused, typed, readable
interface SpecCardProps {
  title: string;
  status: "draft" | "approved";
  onShare: () => void;
}

const SpecCard = ({ title, status, onShare }: SpecCardProps) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        {status === "approved" && (
          <Badge className="text-emerald-400">Approved</Badge>
        )}
      </CardHeader>
    </Card>
  );
};
```

### Styling

- **Always use semantic design tokens** — never hardcode colors
- Use `text-foreground`, `bg-background`, `border-border`, etc.
- Custom colors belong in `index.css` as CSS variables, then referenced in `tailwind.config.ts`
- SpecMirror is **dark mode only** — do not add light mode variants

```tsx
// ❌ Wrong
<div className="bg-black text-white border-gray-700">

// ✅ Correct
<div className="bg-card text-foreground border-border">
```

## Edge Functions

Edge functions live in `supabase/functions/` and run on Deno.

### Guidelines

- Each function gets its own directory with an `index.ts`
- Always include CORS headers for browser requests
- Validate all input — never trust client data
- Use environment variables for secrets (never hardcode)
- Handle errors gracefully with appropriate HTTP status codes

```typescript
// Standard edge function structure
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Your logic here
    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

## Design System

SpecMirror uses a strict dark-mode design system. Key tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | zinc-950 | Page background |
| `--primary` | indigo-500 | Buttons, links, accents |
| `--accent` | emerald-400 | Success states, approved badges |
| `--foreground` | white/zinc-100 | Primary text |
| `--muted` | zinc-400 | Secondary text |

When adding new UI components:
- Start with shadcn/ui primitives where possible
- Follow the existing Linear-inspired aesthetic
- Use `framer-motion` for animations
- Test at common viewport sizes (mobile, tablet, desktop)

## Reporting Issues

### Bug Reports

Include:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS
- Screenshots or screen recordings
- Console errors (if any)

### Feature Requests

Include:
- The problem you're trying to solve
- Your proposed solution
- Alternative approaches you've considered
- Who benefits from this change

---

## Questions?

Open a [Discussion](https://github.com/your-org/specmirror/discussions) or reach out to the maintainers. We're happy to help you find the right place to contribute.

**Welcome aboard — let's build better specs together.**
