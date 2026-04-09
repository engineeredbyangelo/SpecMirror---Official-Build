# SpecMirror

**Turn rough product ideas into production-ready specs and PRDs in seconds.**

---

## What Is SpecMirror?

SpecMirror is an AI-powered platform that transforms plain-language product briefs into comprehensive technical specifications and product requirement documents (PRDs). Whether you're a founder sketching out a new feature or an engineering lead scoping a complex system, SpecMirror bridges the gap between *what you want to build* and *how to build it*.

Choose your output — a **Technical Specification** for engineering teams or a **PRD** for product-driven workflows — and get a production-grade document in seconds.

## Why SpecMirror?

The gap between product intent and engineering execution is where projects fail. Vague briefs become ambiguous tickets. Ambiguous tickets become misaligned implementations. Misaligned implementations become rewrites and missed deadlines.

**SpecMirror closes that gap with AI that understands architecture.**

Our engine, **SpecAI**, is trained on thousands of real-world technical documents — API designs, system architectures, database schemas, and deployment strategies. It doesn't just reformat your brief. It produces structured, opinionated, implementation-ready documentation with:

- **Data models** — real table names, column types, constraints, and relationships
- **API design** — endpoints, request/response shapes, auth requirements
- **Architecture decisions** — state management, caching, service boundaries
- **Security considerations** — auth flows, input validation, encryption, PII handling
- **Testing strategies** — coverage targets, test types, critical paths
- **Effort estimates** — broken down by phase with honest timelines
- **Confidence scores** — so you know how much of the spec is inferred vs. explicit

## PRD vs. Technical Specification

| | PRD | Technical Specification |
|---|---|---|
| **Audience** | Product managers, stakeholders, designers | Engineers, architects, tech leads |
| **Focus** | *What* to build and *why* | *How* to build it |
| **Contains** | User stories, success metrics, requirements | Data models, API contracts, system design |
| **Best for** | Aligning teams on vision and scope | Starting implementation immediately |

Not sure which one you need? Start with a PRD for stakeholder alignment, then generate a Technical Spec from the same brief when you're ready to build.

## Who This Is For

- **Engineering Leads** — Stop translating ambiguous requests into technical plans. Get a structured starting point in seconds.
- **Product Managers** — Communicate your vision in engineering-ready language without a 90-minute meeting.
- **Startup Founders** — Ship faster by compressing days of alignment into minutes.
- **Agencies & Consultancies** — Scope projects with professional, detailed specs that reduce scope creep before contracts are signed.

## How It Works

1. **Write your brief** — Describe what you want to build in plain language. No format required.
2. **Choose your output** — Select Technical Specification or PRD based on your needs.
3. **SpecAI generates your document** — Our AI engine produces a comprehensive, structured document with a confidence score.
4. **Review, approve, and share** — Refine the output, approve it, and share via encrypted links with your team.

## Principles

- **Specificity over generality** — Real table names, real endpoints, real decisions. No placeholder text.
- **Assumptions are documented** — When your brief is vague, SpecMirror makes reasonable assumptions and calls them out explicitly.
- **Security is built in** — Every spec includes security considerations from day one.
- **Honest effort estimates** — No sandbagging, no optimistic fantasies.
- **Share securely** — Encrypted, expiring share links keep your architecture details safe.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 18 + TypeScript 5 |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS v3 + shadcn/ui |
| **Animations** | Framer Motion |
| **Backend** | Supabase (edge functions, auth, database, storage) |
| **AI Engine** | SpecAI via Gemini 3 pro |
| **Encryption** | AES-256-GCM (Web Crypto API, client-side) |
| **Testing** | Vitest + Playwright |
| **Deployment** | Lovable Cloud |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-org/specmirror.git
cd specmirror

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app runs at `http://localhost:5173`. See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines, project structure, and code style.

## License

MIT

---

**SpecMirror** — Because the best code starts with the best spec.
