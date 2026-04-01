import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, Users, Layers, ArrowRight, Play, Search, FileText, Zap, Lock, GitBranch, X, Check, Loader2 } from "lucide-react";
import { useAuth, STRIPE_TIERS } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

/* ── Scroll-triggered section wrapper ── */
const FadeSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ── Section header (reusable branding) ── */
const SectionHeader = ({ label, title, highlight, description }: { label: string; title: string; highlight: string; description?: string }) => (
  <div className="mb-14 text-center">
    <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">{label}</p>
    <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
      {title}{" "}
      <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">{highlight}</span>
    </h2>
    {description && (
      <p className="mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed md:text-lg">{description}</p>
    )}
  </div>
);

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleProClick = async () => {
    if (!user) {
      navigate("/signup");
      return;
    }
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: STRIPE_TIERS.pro.price_id },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (e: any) {
      toast.error("Could not start checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen glass-bg noise-overlay text-foreground relative">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-background/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <Search className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold tracking-tight">SpecMirror</span>
          </div>
          <div className="hidden items-center gap-10 text-sm text-muted-foreground md:flex">
            <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
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
      <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-20 md:pt-40 md:pb-28 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <FadeSection>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Now in public beta
            </div>
          </FadeSection>
          <FadeSection delay={0.1}>
            <h1 className="mb-6 text-4xl font-bold leading-[1.08] tracking-tighter sm:text-5xl md:text-7xl">
              Product briefs.{" "}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Technical specs.</span>
              <br className="hidden sm:block" />
              One mirror.
            </h1>
          </FadeSection>
          <FadeSection delay={0.2}>
            <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Turn rough product ideas into production-ready technical specs in seconds. AI-powered, encrypted, and built for teams that ship fast.
            </p>
          </FadeSection>
          <FadeSection delay={0.3}>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="gap-2 px-8 text-base" asChild>
                <Link to="/signup">
                  Try it free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/[0.1] bg-white/[0.03] text-base backdrop-blur-sm hover:bg-white/[0.06]"
                onClick={() => setShowDemo(true)}
              >
                <Play className="h-4 w-4" />
                Watch 15-second demo
              </Button>
            </div>
            <p className="mt-10 text-xs text-muted-foreground/50">
              Trusted by 200+ product and engineering teams
            </p>
          </FadeSection>
        </div>
      </section>

      {/* Visual Explainer — How it works */}
      <section id="how-it-works" className="border-y border-white/[0.06] py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <FadeSection>
            <SectionHeader
              label="How it works"
              title="From fuzzy idea to"
              highlight="production-ready spec"
              description="SpecMirror is the missing link between product intuition and engineering reality. Write a brief like a human. Get a perfect technical spec in seconds."
            />
          </FadeSection>

          {/* Step flow */}
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-accent/30 to-transparent hidden md:block" />

            <div className="space-y-12 md:space-y-20">
              <FadeSection>
                <StepRow
                  step="01"
                  icon={<FileText className="h-5 w-5" />}
                  title="Write your brief naturally"
                  description="Describe what you want to build in plain language. No templates, no jargon. Just your product thinking."
                  visual={
                    <div className="glass-card rounded-xl p-5">
                      <div className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Product Brief</div>
                      <div className="space-y-2">
                        <div className="typing-line h-2.5 rounded-sm" style={{ ["--target-width" as string]: "80%", animationDelay: "0s", background: "hsl(226 70% 55.5% / 0.25)" }} />
                        <div className="typing-line h-2.5 rounded-sm" style={{ ["--target-width" as string]: "90%", animationDelay: "0.3s", background: "hsl(0 0% 100% / 0.08)" }} />
                        <div className="typing-line h-2.5 rounded-sm" style={{ ["--target-width" as string]: "65%", animationDelay: "0.6s", background: "hsl(0 0% 100% / 0.08)" }} />
                        <div className="typing-line h-2.5 rounded-sm" style={{ ["--target-width" as string]: "75%", animationDelay: "0.9s", background: "hsl(0 0% 100% / 0.08)" }} />
                      </div>
                    </div>
                  }
                  align="left"
                />
              </FadeSection>
              <FadeSection>
                <StepRow
                  step="02"
                  icon={<Zap className="h-5 w-5" />}
                  title="AI mirrors your intent"
                  description="Trained on thousands of technical docs, our AI generates production-grade specs with architecture, APIs, and acceptance criteria in seconds."
                  visual={
                    <div className="glass-card rounded-xl p-5 border-primary/20">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-widest text-primary">Technical Mirror</span>
                        <span className="text-xs font-medium text-accent" style={{ animation: "pulse-glow 2s ease-in-out infinite" }}>Generating…</span>
                      </div>
                      <div className="shimmer rounded-lg p-0.5">
                        <div className="space-y-2 rounded-lg bg-background/80 p-3">
                          <div className="spec-line h-2.5 rounded-sm" style={{ width: "45%", animationDelay: "0.5s", background: "hsl(160 84% 39% / 0.3)" }} />
                          <div className="spec-line h-2.5 rounded-sm" style={{ width: "80%", animationDelay: "0.8s", background: "hsl(0 0% 100% / 0.08)" }} />
                          <div className="spec-line h-2.5 rounded-sm" style={{ width: "70%", animationDelay: "1.1s", background: "hsl(0 0% 100% / 0.08)" }} />
                          <div className="spec-line h-2.5 rounded-sm" style={{ width: "50%", animationDelay: "1.4s", background: "hsl(160 84% 39% / 0.3)" }} />
                          <div className="spec-line h-2.5 rounded-sm" style={{ width: "85%", animationDelay: "1.7s", background: "hsl(0 0% 100% / 0.08)" }} />
                        </div>
                      </div>
                    </div>
                  }
                  align="right"
                />
              </FadeSection>
              <FadeSection>
                <StepRow
                  step="03"
                  icon={<GitBranch className="h-5 w-5" />}
                  title="Collaborate and ship"
                  description="Share encrypted specs with your team. Track versions, review diffs, and sync approved specs to your favorite project management tools."
                  visual={
                    <div className="glass-card rounded-xl p-5">
                      <div className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Share & Sync</div>
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-2.5 border border-white/[0.06]">
                          <Lock className="h-4 w-4 text-accent shrink-0" />
                          <div className="flex-1">
                            <div className="h-2 rounded-sm bg-white/[0.1] w-3/4" />
                          </div>
                          <div className="h-5 w-12 rounded bg-accent/20 flex items-center justify-center text-[10px] font-medium text-accent">Copied</div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-2.5 border border-white/[0.06]">
                          <div className="h-4 w-4 rounded bg-primary/20 shrink-0" />
                          <div className="flex-1">
                            <div className="h-2 rounded-sm bg-white/[0.1] w-1/2" />
                          </div>
                          <div className="h-5 w-12 rounded bg-primary/20 flex items-center justify-center text-[10px] font-medium text-primary">Synced</div>
                        </div>
                      </div>
                    </div>
                  }
                  align="left"
                />
              </FadeSection>
            </div>
          </div>
        </div>
      </section>

      {/* Features — Bento Grid */}
      <section id="features" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <FadeSection>
            <SectionHeader
              label="Features"
              title="Precision-crafted."
              highlight="Feels like magic."
              description="Every detail obsessed over. Every interaction considered."
            />
          </FadeSection>

          <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
            {/* Large feature — spans 2 cols */}
            <FadeSection className="md:col-span-2 md:row-span-2">
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.04]">
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/[0.06] blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
                <div className="relative z-10">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">Live Mirror View</h3>
                  <p className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                    Side-by-side product brief + technical spec with real-time streaming and confidence scoring.
                  </p>
                  {/* Mini split-screen visual */}
                  <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/[0.06] bg-background/40 p-4">
                    <div className="space-y-2">
                      <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">Brief</div>
                      <div className="h-2 rounded-sm bg-primary/20 w-2/3" />
                      <div className="h-2 rounded-sm bg-white/[0.06] w-full" />
                      <div className="h-2 rounded-sm bg-white/[0.06] w-4/5" />
                      <div className="h-2 rounded-sm bg-white/[0.06] w-3/5" />
                    </div>
                    <div className="space-y-2 border-l border-white/[0.06] pl-3">
                      <div className="text-[10px] font-medium uppercase tracking-widest text-primary/60">Spec</div>
                      <div className="h-2 rounded-sm bg-accent/25 w-1/2" />
                      <div className="h-2 rounded-sm bg-white/[0.06] w-full" />
                      <div className="h-2 rounded-sm bg-white/[0.06] w-3/4" />
                      <div className="h-2 rounded-sm bg-accent/25 w-2/5" />
                    </div>
                  </div>
                </div>
              </div>
            </FadeSection>

            {/* Top-right small card */}
            <FadeSection delay={0.1}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500 hover:border-accent/30 hover:bg-white/[0.04] h-full">
                <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-accent/[0.06] blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1.5 text-lg font-bold tracking-tight">Instant AI Generation</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    One click transforms any brief into architecture, effort estimates, and acceptance criteria.
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-[10px] font-medium uppercase tracking-widest text-accent/70">Streaming</span>
                  </div>
                </div>
              </div>
            </FadeSection>

            {/* Bottom-right small card */}
            <FadeSection delay={0.2}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.04] h-full">
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/[0.06] blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1.5 text-lg font-bold tracking-tight">Seamless Collaboration</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Encrypted sharing, version history, and team presence. All built in.
                  </p>
                  <div className="mt-4 flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-gradient-to-br from-primary/40 to-accent/30" style={{ marginLeft: i > 0 ? "-6px" : 0 }} />
                    ))}
                    <span className="ml-1 self-center text-[10px] text-muted-foreground/60">+4</span>
                  </div>
                </div>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* Why Not ChatGPT — Competitive Differentiation */}
      <section className="border-y border-white/[0.06] py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <FadeSection>
            <div className="mb-14 text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">Built different</p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Not another{" "}
                <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">chatbot.</span>
              </h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed md:text-lg">
                SpecMirror's AI is hyper-trained on thousands of real-world technical documents, architecture patterns, and production specs. It doesn't guess. It knows.
              </p>
            </div>
          </FadeSection>

          {/* Comparison table */}
          <div className="mb-16 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
            {/* Desktop: 3-column table */}
            <div className="hidden md:block">
              <div className="grid grid-cols-[1fr,1fr,1fr] border-b border-white/[0.06]">
                <div className="p-5 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">Capability</div>
                <div className="p-5 text-xs font-medium uppercase tracking-widest text-muted-foreground/60 border-l border-white/[0.06]">Generic AI</div>
                <div className="p-5 text-xs font-medium uppercase tracking-widest text-primary border-l border-white/[0.06]">SpecMirror</div>
              </div>
              {[
                { capability: "Output format", generic: "Freeform chat, copy-paste", spec: "Structured production spec" },
                { capability: "Domain knowledge", generic: "General purpose", spec: "Trained on 10,000+ technical docs" },
                { capability: "Consistency", generic: "Varies per prompt", spec: "Standardized every time" },
                { capability: "Security", generic: "Data sent to third parties", spec: "End-to-end encrypted, zero-knowledge" },
                { capability: "Integration", generic: "None", spec: "Syncs to your PM tools" },
              ].map((row, i) => (
                <FadeSection key={row.capability} delay={i * 0.07}>
                  <div className={`grid grid-cols-[1fr,1fr,1fr] ${i < 4 ? "border-b border-white/[0.06]" : ""}`}>
                    <div className="p-5 text-sm font-medium text-foreground/80">{row.capability}</div>
                    <div className="p-5 flex items-start gap-2.5 border-l border-white/[0.06]">
                      <X className="h-4 w-4 shrink-0 mt-0.5 text-red-400/50" />
                      <span className="text-sm text-muted-foreground/60">{row.generic}</span>
                    </div>
                    <div className="p-5 flex items-start gap-2.5 border-l border-white/[0.06] bg-accent/[0.03]">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-accent drop-shadow-[0_0_6px_hsl(160_84%_39%/0.4)]" />
                      <span className="text-sm text-foreground/90">{row.spec}</span>
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>

            {/* Mobile: stacked cards */}
            <div className="md:hidden divide-y divide-white/[0.06]">
              {[
                { capability: "Output format", generic: "Freeform chat, copy-paste", spec: "Structured production spec" },
                { capability: "Domain knowledge", generic: "General purpose", spec: "Trained on 10,000+ technical docs" },
                { capability: "Consistency", generic: "Varies per prompt", spec: "Standardized every time" },
                { capability: "Security", generic: "Data sent to third parties", spec: "End-to-end encrypted, zero-knowledge" },
                { capability: "Integration", generic: "None", spec: "Syncs to your PM tools" },
              ].map((row, i) => (
                <FadeSection key={row.capability} delay={i * 0.07}>
                  <div className="p-4 space-y-3">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">{row.capability}</p>
                    <div className="flex items-start gap-2">
                      <X className="h-4 w-4 shrink-0 mt-0.5 text-red-400/50" />
                      <div>
                        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/40">Generic AI</span>
                        <p className="text-sm text-muted-foreground/60">{row.generic}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 rounded-lg bg-accent/[0.05] p-2.5 -mx-1">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-accent drop-shadow-[0_0_6px_hsl(160_84%_39%/0.4)]" />
                      <div>
                        <span className="text-[11px] font-medium uppercase tracking-wider text-primary">SpecMirror</span>
                        <p className="text-sm text-foreground/90">{row.spec}</p>
                      </div>
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>

          {/* Training depth visual */}
          <FadeSection>
            <div className="text-center mb-8">
              <p className="text-sm font-medium uppercase tracking-widest text-primary mb-2">Training depth</p>
              <p className="text-muted-foreground text-sm">Purpose-built on real engineering knowledge</p>
            </div>
          </FadeSection>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              "API References", "RFC Standards", "Infrastructure Patterns", "Security Best Practices",
              "Database Schemas", "CI/CD Pipelines", "System Design Docs", "Architecture Patterns",
            ].map((label, i) => (
              <FadeSection key={label} delay={0.05 * i}>
                <div className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-foreground/70 backdrop-blur-sm transition-colors hover:border-primary/30 hover:text-foreground/90">
                  {label}
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* Preview — Animated Mirror Demo */}
      <section id="preview" className="border-y border-white/[0.06] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <FadeSection>
            <SectionHeader
              label="Live preview"
              title="See SpecMirror"
              highlight="in action"
              description="Dark mode. Instant generation. Zero friction."
            />
          </FadeSection>
          <FadeSection delay={0.15}>
            <MirrorDemo />
          </FadeSection>
        </div>
      </section>

      {/* For Every Team — Horizontal role cards */}
      <section id="how-it-helps" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <FadeSection>
            <SectionHeader
              label="For every team"
              title="How SpecMirror helps"
              highlight="your workflow"
              description="Whether you ship product, write code, or set direction, SpecMirror meets you where you are."
            />
          </FadeSection>

          <div className="space-y-4">
            {[
              {
                role: "Product Managers",
                quote: "Stop rewriting the same idea 17 times. Get engineering feedback before it's too late.",
                icon: <FileText className="h-5 w-5" />,
                accentColor: "primary" as const,
                stat: "94%",
                statLabel: "Spec confidence",
              },
              {
                role: "Engineers",
                quote: 'Influence scope on day zero instead of week three. No more "this is impossible" surprises.',
                icon: <Zap className="h-5 w-5" />,
                accentColor: "accent" as const,
                stat: "3×",
                statLabel: "Faster alignment",
              },
              {
                role: "Leadership",
                quote: "See alignment scores and confidence metrics across every feature in one place.",
                icon: <Users className="h-5 w-5" />,
                accentColor: "primary" as const,
                stat: "100%",
                statLabel: "Visibility",
              },
            ].map((item, i) => (
              <FadeSection key={item.role} delay={i * 0.1}>
                <div className={`group relative flex flex-col gap-6 overflow-hidden rounded-2xl border bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.04] md:flex-row md:items-center md:p-8 ${
                  item.accentColor === "accent"
                    ? "border-accent/20 hover:border-accent/40"
                    : "border-white/[0.06] hover:border-primary/30"
                }`}>
                  {/* Left accent bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-full transition-all duration-500 ${
                    item.accentColor === "accent"
                      ? "bg-accent/40 group-hover:bg-accent"
                      : "bg-primary/40 group-hover:bg-primary"
                  }`} />

                  {/* Icon + role */}
                  <div className="flex shrink-0 items-center gap-4 md:w-48">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      item.accentColor === "accent" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                    }`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold tracking-tight">{item.role}</h3>
                  </div>

                  {/* Quote */}
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground md:text-base md:px-6 md:border-l md:border-white/[0.06]">
                    "{item.quote}"
                  </p>

                  {/* Stat */}
                  <div className="shrink-0 text-right md:w-32">
                    <div className={`text-2xl font-bold tracking-tight ${
                      item.accentColor === "accent" ? "text-accent" : "text-primary"
                    }`}>{item.stat}</div>
                    <div className="text-xs text-muted-foreground/60 uppercase tracking-widest">{item.statLabel}</div>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-white/[0.06] py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <FadeSection>
            <SectionHeader
              label="Pricing"
              title="Simple, transparent"
              highlight="pricing"
              description="Start free. Upgrade when you need unlimited power."
            />
          </FadeSection>

          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            {/* Free tier */}
            <FadeSection>
              <div className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-xl">
                <div className="mb-6">
                  <h3 className="text-lg font-bold">Free</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">$0</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">Perfect for trying SpecMirror on personal projects.</p>
                </div>
                <ul className="mb-8 flex-1 space-y-3 text-sm text-muted-foreground">
                  {["5 specs per month", "Basic AI generation", "Encrypted sharing", "Single user"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="lg" className="w-full border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06]" asChild>
                  <Link to="/signup">Get started free</Link>
                </Button>
              </div>
            </FadeSection>

            {/* Pro tier */}
            <FadeSection delay={0.1}>
              <div className="relative flex h-full flex-col rounded-2xl border border-primary/30 bg-white/[0.02] p-8 backdrop-blur-xl">
                <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                  Most popular
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-bold">Pro</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">$19</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">For teams that ship fast and need unlimited specs.</p>
                </div>
                <ul className="mb-8 flex-1 space-y-3 text-sm text-muted-foreground">
                  {["Unlimited spec generations", "Priority AI processing", "Team sharing and collaboration", "Version history", "PM tool integrations", "Priority support"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="w-full gap-2" onClick={handleProClick} disabled={checkoutLoading}>
                  {checkoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Start Pro trial <ArrowRight className="h-4 w-4" /></>}
                </Button>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-white/[0.06] py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-6">
          <FadeSection>
            <SectionHeader label="FAQ" title="Frequently asked" highlight="questions" />
          </FadeSection>
          <FadeSection delay={0.1}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="what-is" className="border-white/[0.06]">
                <AccordionTrigger className="text-left text-base">What exactly does SpecMirror generate?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  You write a plain-English project brief — goals, audience, key features. SpecMirror&apos;s AI mirrors it back as a structured technical spec covering architecture, auth strategy, data models, API surface, and infrastructure — ready for your engineering team to build from.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="who-for" className="border-white/[0.06]">
                <AccordionTrigger className="text-left text-base">Who is this built for?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Product managers, founders, and technical leads who need to translate product thinking into engineering-ready specs without spending hours writing boilerplate. If you&apos;ve ever lost context between &ldquo;what we want&rdquo; and &ldquo;how to build it,&rdquo; SpecMirror closes that gap.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="accuracy" className="border-white/[0.06]">
                <AccordionTrigger className="text-left text-base">How accurate are the generated specs?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Every spec includes a confidence score so you know where the AI is certain and where it needs your input. You review, edit, and approve before anything ships — SpecMirror is a starting point, not an autopilot.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sharing" className="border-white/[0.06]">
                <AccordionTrigger className="text-left text-base">How does encrypted sharing work?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Once you approve a spec, you can generate an AES-encrypted link with an optional expiry. Share it with your team or stakeholders — they can view the spec without needing an account, and the link self-destructs after expiration.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="pricing" className="border-white/[0.06]">
                <AccordionTrigger className="text-left text-base">What&apos;s included in the free tier?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Free accounts get up to 3 active projects with full AI spec generation and encrypted sharing. The Pro plan unlocks unlimited projects, priority generation, and upcoming integrations like Slack and Jira sync. No credit card required to start.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="data" className="border-white/[0.06]">
                <AccordionTrigger className="text-left text-base">Is my data safe?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Your briefs and specs are stored securely with row-level security policies. Shared links use client-side AES-GCM encryption — we never store the decryption key. Your product ideas stay yours.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </FadeSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <Search className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">SpecMirror</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="https://github.com/nicholasb4711/SpecMirror" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="/roadmap" className="hover:text-foreground transition-colors">Roadmap</a>
          </div>
          <p className="text-xs text-muted-foreground/50">
            © 2026 SpecMirror. Made with love for builders who ship.
          </p>
        </div>
      </footer>

      {/* Demo Video Modal */}
      {showDemo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowDemo(false)}
        >
          <div
            className="relative w-full max-w-4xl mx-6 rounded-2xl overflow-hidden border border-white/[0.08] bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <video
              src="/specmirror-demo.mp4"
              autoPlay
              controls
              playsInline
              className="w-full"
              onEnded={() => setShowDemo(false)}
            />
          </div>
        </div>
      )}
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
  <div className={`flex flex-col gap-6 md:flex-row md:items-center ${align === "right" ? "md:flex-row-reverse" : ""}`}>
    <div className={`flex-1 space-y-3 ${align === "right" ? "md:pl-32" : "md:pr-16"}`}>
      <div className="inline-flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <span className="text-sm font-bold uppercase tracking-widest text-primary">{step}</span>
      </div>
      <h3 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground max-w-md md:text-base">{description}</p>
    </div>
    <div className={`flex-1 max-w-sm ${align === "right" ? "md:pr-16" : "md:pl-16"}`}>{visual}</div>
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
    { text: "~3 sprint points, 2 days implementation", width: "82%" },
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
        <div className="rounded-xl bg-white/[0.03] p-6 border border-white/[0.06]">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Product Brief</p>
          </div>
          <div className="space-y-2.5">
            {briefLines.map((line, i) => (
              <div
                key={i}
                className="typing-line h-2.5 rounded-sm"
                style={{
                  ["--target-width" as string]: line.width,
                  animationDelay: `${i * 0.4}s`,
                  background: line.isHeading ? "hsl(226 70% 55.5% / 0.25)" : "hsl(0 0% 100% / 0.08)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Spec Panel */}
        <div className="rounded-xl bg-white/[0.03] p-6 border border-primary/20">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Technical Mirror</p>
            <div className="relative flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 56 56" className="rotate-[-90deg]">
                <circle cx="28" cy="28" r="25" fill="none" stroke="hsl(0 0% 100% / 0.06)" strokeWidth="3" />
                <circle cx="28" cy="28" r="25" fill="none" stroke="hsl(160 84% 39%)" strokeWidth="3" strokeLinecap="round" className="confidence-ring" style={{ ["--target-offset" as string]: "9.4" }} />
              </svg>
              <span className="text-xs font-medium text-accent" style={{ animation: "pulse-glow 2s ease-in-out 3s infinite" }}>94%</span>
            </div>
          </div>
          <div className="shimmer rounded-lg p-0.5">
            <div className="space-y-2.5 rounded-lg bg-background/80 p-3">
              {specLines.map((line, i) => (
                <div
                  key={i}
                  className="spec-line h-2.5 rounded-sm"
                  style={{
                    width: line.width,
                    animationDelay: `${2 + i * 0.3}s`,
                    background: line.isSection ? "hsl(160 84% 39% / 0.3)" : "hsl(0 0% 100% / 0.08)",
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
