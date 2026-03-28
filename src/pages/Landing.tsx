import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, Users, Layers, ArrowRight, Play, Search } from "lucide-react";

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
            <a href="#how-it-helps" className="transition-colors hover:text-foreground">How it helps</a>
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
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Now in public beta
          </div>
          <h1 className="mb-8 text-6xl font-bold leading-[1.05] tracking-tighter md:text-8xl">
            Product briefs.{" "}
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Technical specs.</span>
            <br />
            One mirror.
          </h1>
          <p className="mx-auto mb-12 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
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
          <p className="mt-14 text-xs text-muted-foreground/50">
            Trusted by teams at Linear, Vercel, and 200+ more
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="border-y border-white/[0.06] py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-2xl leading-relaxed text-muted-foreground md:text-3xl">
            <span className="text-foreground font-medium">SpecMirror is the missing link</span>{" "}
            between product intuition and engineering reality. Write a brief like a human. Get a perfect technical spec in seconds. Collaborate in real time. Ship faster.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 md:py-40">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-4xl font-bold tracking-tight md:text-5xl">
            Built exactly like Linear.
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Feels like magic.</span>
          </h2>
          <div className="mt-20 grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Layers className="h-6 w-6" />}
              title="Live Mirror View"
              description="Side-by-side product brief + technical spec with real-time diffs and confidence meter."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Instant AI Generation"
              description="One click turns any brief into architecture notes, effort estimates, and acceptance criteria."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Seamless Collaboration"
              description="Comments, presence, version history — everything you love about Linear, but for specs."
            />
          </div>
        </div>
      </section>

      {/* Preview — Animated Mirror Demo */}
      <section id="preview" className="border-y border-white/[0.06] py-32 md:py-40">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-4xl font-bold tracking-tight md:text-5xl">
            See SpecMirror in action
          </h2>
          <p className="mb-16 text-center text-lg text-muted-foreground">
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
          <div className="grid gap-8 md:grid-cols-3">
            <PersonaCard num="01" title="Product Managers" description="Stop rewriting the same idea 17 times. Get engineering feedback before it's too late." />
            <PersonaCard num="02" title="Engineers" description={'Influence scope on day zero instead of week three. No more "this is impossible" surprises.'} />
            <PersonaCard num="03" title="Leadership" description="See alignment scores and confidence metrics across every feature in one place." />
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

/* ── Feature Card (Glassmorphism) ── */
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="glass-card rounded-2xl p-10">
    <div className="mb-5 inline-flex rounded-xl bg-primary/10 p-3.5 text-primary">
      {icon}
    </div>
    <h3 className="mb-3 text-xl font-semibold">{title}</h3>
    <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
  </div>
);

/* ── Persona Card (Glassmorphism + watermark number) ── */
const PersonaCard = ({ num, title, description }: { num: string; title: string; description: string }) => (
  <div className="glass-card relative overflow-hidden rounded-2xl p-10">
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
    <div className="grid gap-4 md:grid-cols-2">
      {/* Brief Panel */}
      <div className="glass-card relative rounded-2xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Product Brief
          </p>
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-white/[0.1]" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/[0.1]" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/[0.1]" />
          </div>
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
      <div className="glass-card relative rounded-2xl border-primary/20 p-8">
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
  );
};

export default Landing;
