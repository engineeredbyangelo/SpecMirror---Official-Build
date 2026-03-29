import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, Users, Layers, ArrowRight, Play, Search, FileText, Zap, Lock, GitBranch } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen glass-bg noise-overlay text-foreground relative">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-background/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <Search className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold tracking-tight">SpecMirror</span>
          </div>
          <div className="hidden items-center gap-10 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#preview" className="transition-colors hover:text-foreground">See it in action</a>
            <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Start for free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-40 pb-32 md:pt-48 md:pb-40 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Now in public beta
          </div>
          <h1 className="mb-10 text-5xl font-bold leading-[1.05] tracking-tighter sm:text-6xl md:text-8xl">
            Product briefs.{" "}
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Technical specs.</span>
            <br />
            One mirror.
          </h1>
          <p className="mx-auto mb-14 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            The Linear-style app that instantly translates product ideas into precise engineering specs — with live collaboration and AI superpowers.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8 text-base" asChild>
              <Link to="/signup">
                Try it free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-white/[0.1] bg-white/[0.03] text-base backdrop-blur-sm hover:bg-white/[0.06]">
              <Play className="h-4 w-4" />
              Watch 47-second demo
            </Button>
          </div>
          <p className="mt-16 text-xs text-muted-foreground/50">
            Trusted by teams at Linear, Vercel, and 200+ more
          </p>
        </div>
      </section>

      {/* Visual Explainer — How it works */}
      <section id="how-it-works" className="border-y border-white/[0.06] py-32 md:py-40">
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-6 text-center text-sm font-medium uppercase tracking-widest text-primary">How it works</p>
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight md:text-4xl">
            From fuzzy idea to{" "}
            <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">production-ready spec</span>
          </h2>
          <p className="mx-auto mb-20 max-w-2xl text-center text-lg text-muted-foreground leading-relaxed">
            SpecMirror is the missing link between product intuition and engineering reality. Write a brief like a human. Get a perfect technical spec in seconds.
          </p>

          {/* Step flow */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-accent/30 to-transparent hidden md:block" />

            <div className="space-y-16 md:space-y-24">
              <StepRow
                step="01"
                icon={<FileText className="h-6 w-6" />}
                title="Write your brief naturally"
                description="Describe what you want to build in plain language — no templates, no jargon. Just your product thinking."
                visual={
                  <div className="glass-card rounded-xl p-6">
                    <div className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Product Brief</div>
                    <div className="space-y-2.5">
                      <div className="typing-line h-3 rounded-sm" style={{ ["--target-width" as string]: "80%", animationDelay: "0s", background: "hsl(226 70% 55.5% / 0.25)" }} />
                      <div className="typing-line h-3 rounded-sm" style={{ ["--target-width" as string]: "90%", animationDelay: "0.3s", background: "hsl(0 0% 100% / 0.08)" }} />
                      <div className="typing-line h-3 rounded-sm" style={{ ["--target-width" as string]: "65%", animationDelay: "0.6s", background: "hsl(0 0% 100% / 0.08)" }} />
                      <div className="typing-line h-3 rounded-sm" style={{ ["--target-width" as string]: "75%", animationDelay: "0.9s", background: "hsl(0 0% 100% / 0.08)" }} />
                    </div>
                  </div>
                }
                align="left"
              />
              <StepRow
                step="02"
                icon={<Zap className="h-6 w-6" />}
                title="AI mirrors your intent"
                description="Our AI reads your brief and generates a comprehensive technical spec — architecture, data models, APIs, effort estimates, and acceptance criteria."
                visual={
                  <div className="glass-card rounded-xl p-6 border-primary/20">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-widest text-primary">Technical Mirror</span>
                      <span className="text-xs font-medium text-accent" style={{ animation: "pulse-glow 2s ease-in-out infinite" }}>Generating…</span>
                    </div>
                    <div className="shimmer rounded-lg p-0.5">
                      <div className="space-y-2.5 rounded-lg bg-background/80 p-4">
                        <div className="spec-line h-3 rounded-sm" style={{ width: "45%", animationDelay: "0.5s", background: "hsl(160 84% 39% / 0.3)" }} />
                        <div className="spec-line h-3 rounded-sm" style={{ width: "80%", animationDelay: "0.8s", background: "hsl(0 0% 100% / 0.08)" }} />
                        <div className="spec-line h-3 rounded-sm" style={{ width: "70%", animationDelay: "1.1s", background: "hsl(0 0% 100% / 0.08)" }} />
                        <div className="spec-line h-3 rounded-sm" style={{ width: "50%", animationDelay: "1.4s", background: "hsl(160 84% 39% / 0.3)" }} />
                        <div className="spec-line h-3 rounded-sm" style={{ width: "85%", animationDelay: "1.7s", background: "hsl(0 0% 100% / 0.08)" }} />
                      </div>
                    </div>
                  </div>
                }
                align="right"
              />
              <StepRow
                step="03"
                icon={<GitBranch className="h-6 w-6" />}
                title="Collaborate and ship"
                description="Share encrypted specs with your team. Track versions, review diffs, and sync approved specs directly to Linear or Jira."
                visual={
                  <div className="glass-card rounded-xl p-6">
                    <div className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Share & Sync</div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-3 border border-white/[0.06]">
                        <Lock className="h-4 w-4 text-accent shrink-0" />
                        <div className="flex-1">
                          <div className="h-2.5 rounded-sm bg-white/[0.1] w-3/4" />
                        </div>
                        <div className="h-6 w-14 rounded bg-accent/20 flex items-center justify-center text-[10px] font-medium text-accent">Copied</div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-3 border border-white/[0.06]">
                        <div className="h-5 w-5 rounded bg-primary/20 shrink-0" />
                        <div className="flex-1">
                          <div className="h-2.5 rounded-sm bg-white/[0.1] w-1/2" />
                        </div>
                        <div className="h-6 w-14 rounded bg-primary/20 flex items-center justify-center text-[10px] font-medium text-primary">Synced</div>
                      </div>
                    </div>
                  </div>
                }
                align="left"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features — Staggered Cards */}
      <section id="features" className="py-32 md:py-40">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-4xl font-bold tracking-tight md:text-5xl">
            Built exactly like Linear.
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Feels like magic.</span>
          </h2>
          <p className="mx-auto mb-20 max-w-xl text-center text-lg text-muted-foreground">
            Every detail obsessed over. Every interaction considered.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:mt-0">
              <FeatureCard
                icon={<Layers className="h-6 w-6" />}
                title="Live Mirror View"
                description="Side-by-side product brief + technical spec with real-time diffs and confidence meter."
              />
            </div>
            <div className="md:mt-12">
              <FeatureCard
                icon={<Sparkles className="h-6 w-6" />}
                title="Instant AI Generation"
                description="One click turns any brief into architecture notes, effort estimates, and acceptance criteria."
              />
            </div>
            <div className="md:mt-24">
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Seamless Collaboration"
                description="Comments, presence, version history — everything you love about Linear, but for specs."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Preview — Animated Mirror Demo */}
      <section id="preview" className="border-y border-white/[0.06] py-32 md:py-40">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-4xl font-bold tracking-tight md:text-5xl">
            See SpecMirror in action
          </h2>
          <p className="mb-20 text-center text-lg text-muted-foreground">
            Dark mode. Linear speed. Zero friction.
          </p>
          <MirrorDemo />
        </div>
      </section>

      {/* How it helps */}
      <section id="how-it-helps" className="py-32 md:py-40">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-20 text-center text-4xl font-bold tracking-tight md:text-5xl">
            How SpecMirror helps every team
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:mt-0">
              <PersonaCard num="01" title="Product Managers" description="Stop rewriting the same idea 17 times. Get engineering feedback before it's too late." />
            </div>
            <div className="md:mt-8">
              <PersonaCard num="02" title="Engineers" description={'Influence scope on day zero instead of week three. No more "this is impossible" surprises.'} />
            </div>
            <div className="md:mt-16">
              <PersonaCard num="03" title="Leadership" description="See alignment scores and confidence metrics across every feature in one place." />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-white/[0.06] py-32">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="mb-16 text-center text-4xl font-bold tracking-tight md:text-5xl">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="dark-mode" className="border-white/[0.06]">
              <AccordionTrigger className="text-left text-base">Is it really dark mode only?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes. We believe beautiful dark interfaces make deep work feel better. No light mode in v0.1.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="linear" className="border-white/[0.06]">
              <AccordionTrigger className="text-left text-base">Does it integrate with Linear?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes — one-click sync turns an approved spec into a Linear issue with full context.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ai" className="border-white/[0.06]">
              <AccordionTrigger className="text-left text-base">What AI model does it use?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                SpecMirror uses state-of-the-art AI to generate technical specs from your product briefs. The AI is optimized for speed and accuracy.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pricing" className="border-white/[0.06]">
              <AccordionTrigger className="text-left text-base">Is it free?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                We offer a generous free tier. Start building specs today with no credit card required.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <Search className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">SpecMirror</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="hover:text-foreground transition-colors">Discord</a>
            <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="#" className="hover:text-foreground transition-colors">Roadmap</a>
          </div>
          <p className="text-xs text-muted-foreground/50">
            © 2026 SpecMirror. Made with love for builders who ship.
          </p>
        </div>
      </footer>
    </div>
  );
};

/* ── Step Row for visual explainer ── */
const StepRow = ({
  step,
  icon,
  title,
  description,
  visual,
  align,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  visual: React.ReactNode;
  align: "left" | "right";
}) => (
  <div className={`flex flex-col gap-8 md:flex-row md:items-center md:gap-16 ${align === "right" ? "md:flex-row-reverse" : ""}`}>
    <div className="flex-1 space-y-4">
      <div className="inline-flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <span className="text-sm font-bold uppercase tracking-widest text-primary">{step}</span>
      </div>
      <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
      <p className="text-base leading-relaxed text-muted-foreground max-w-md">{description}</p>
    </div>
    <div className="flex-1 max-w-md">{visual}</div>
  </div>
);

/* ── Feature Card (Enhanced Glassmorphism) ── */
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-10 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.07] hover:-translate-y-1 hover:shadow-[0_16px_48px_-12px_hsl(226_70%_55.5%/0.15)]">
    {/* Inner glow on hover */}
    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    <div className="relative z-10">
      <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-3.5 text-primary border border-primary/20">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
    </div>
  </div>
);

/* ── Persona Card (Enhanced Glassmorphism + watermark number) ── */
const PersonaCard = ({ num, title, description }: { num: string; title: string; description: string }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-10 backdrop-blur-xl transition-all duration-500 hover:border-accent/30 hover:bg-white/[0.07] hover:-translate-y-1 hover:shadow-[0_16px_48px_-12px_hsl(160_84%_39%/0.12)]">
    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/[0.04] via-transparent to-primary/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[7rem] font-bold leading-none text-white/[0.03]">
      {num}
    </span>
    <div className="relative z-10">
      <span className="mb-4 inline-block text-sm font-medium text-primary">{num}</span>
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
    </div>
  </div>
);

/* ── Animated Mirror Demo ── */
const MirrorDemo = () => {
  const briefLines = [
    { text: "User Authentication Flow", width: "65%", isHeading: true },
    { text: "Users should be able to sign up with email", width: "85%" },
    { text: "and password. Social login via Google and", width: "80%" },
    { text: "GitHub. Password reset via email link.", width: "70%" },
    { text: "Session Management", width: "50%", isHeading: true },
    { text: "Keep users logged in for 30 days with", width: "75%" },
    { text: "refresh token rotation.", width: "55%" },
  ];

  const specLines = [
    { text: "Architecture", width: "40%", isSection: true },
    { text: "JWT + httpOnly cookies, bcrypt hashing", width: "80%" },
    { text: "OAuth2 flow for Google/GitHub providers", width: "78%" },
    { text: "Effort Estimate", width: "45%", isSection: true },
    { text: "~3 sprint points — 2 days implementation", width: "82%" },
    { text: "Acceptance Criteria", width: "50%", isSection: true },
    { text: "✓ Email signup with verification flow", width: "72%" },
    { text: "✓ Social login creates linked profile", width: "70%" },
    { text: "✓ Refresh tokens rotate on each use", width: "68%" },
  ];

  return (
    <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-sm">
      {/* Window chrome */}
      <div className="mb-2 flex items-center gap-2 px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-white/[0.08]" />
          <div className="h-3 w-3 rounded-full bg-white/[0.08]" />
          <div className="h-3 w-3 rounded-full bg-white/[0.08]" />
        </div>
        <div className="mx-auto flex h-7 w-64 items-center justify-center rounded-md bg-white/[0.04] text-[11px] text-muted-foreground/50">
          specmirror.app/project/auth-flow
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {/* Brief Panel */}
        <div className="rounded-xl bg-white/[0.03] p-8 border border-white/[0.06]">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Product Brief
            </p>
          </div>
          <div className="space-y-3">
            {briefLines.map((line, i) => (
              <div
                key={i}
                className="typing-line h-3 rounded-sm"
                style={{
                  ["--target-width" as string]: line.width,
                  animationDelay: `${i * 0.4}s`,
                  background: line.isHeading
                    ? "hsl(226 70% 55.5% / 0.25)"
                    : "hsl(0 0% 100% / 0.08)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Spec Panel */}
        <div className="rounded-xl bg-white/[0.03] p-8 border border-primary/20">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Technical Mirror
            </p>
            {/* Confidence Ring */}
            <div className="relative flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 56 56" className="rotate-[-90deg]">
                <circle cx="28" cy="28" r="25" fill="none" stroke="hsl(0 0% 100% / 0.06)" strokeWidth="3" />
                <circle
                  cx="28" cy="28" r="25" fill="none"
                  stroke="hsl(160 84% 39%)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="confidence-ring"
                  style={{ ["--target-offset" as string]: "9.4" }}
                />
              </svg>
              <span className="text-xs font-medium text-accent" style={{ animation: "pulse-glow 2s ease-in-out 3s infinite" }}>94%</span>
            </div>
          </div>
          <div className="shimmer rounded-lg p-0.5">
            <div className="space-y-3 rounded-lg bg-background/80 p-4">
              {specLines.map((line, i) => (
                <div
                  key={i}
                  className="spec-line h-3 rounded-sm"
                  style={{
                    width: line.width,
                    animationDelay: `${2 + i * 0.3}s`,
                    background: line.isSection
                      ? "hsl(160 84% 39% / 0.3)"
                      : "hsl(0 0% 100% / 0.08)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
