import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, Users, Layers, ArrowRight, Play, Search, FileText, Zap, Lock, GitBranch, X, Check, Loader2, ClipboardList, Code2, Download, MessageSquare, BookOpen, Star } from "lucide-react";
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
  const [checkoutLoading, setCheckoutLoading] = useState<null | "basic" | "pro">(null);
  const [showDemo, setShowDemo] = useState(false);
  const [activeDocType, setActiveDocType] = useState<'prd' | 'spec'>('prd');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCheckout = async (tier: "basic" | "pro") => {
    if (!user) {
      navigate("/signup");
      return;
    }
    setCheckoutLoading(tier);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: STRIPE_TIERS[tier].price_id },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch {
      toast.error("Could not start checkout. Please try again.");
    } finally {
      setCheckoutLoading(null);
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
            <a href="#integrations" className="transition-colors hover:text-foreground">Integrations</a>
            <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
            <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" className="magnetic" asChild>
              <Link to="/signup">Start for free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Sticky mini-nav after scroll */}
      <div
        className={`fixed left-1/2 top-3 z-40 hidden -translate-x-1/2 transition-all duration-500 md:block ${
          scrolled ? "translate-y-12 opacity-100" : "-translate-y-4 pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-background/80 px-2 py-1.5 text-xs text-muted-foreground backdrop-blur-2xl shadow-[0_8px_32px_-8px_hsl(226_70%_55%_/_0.25)]">
          <a href="#how-it-works" className="rounded-full px-3 py-1 transition-colors hover:bg-white/[0.04] hover:text-foreground">How</a>
          <a href="#features" className="rounded-full px-3 py-1 transition-colors hover:bg-white/[0.04] hover:text-foreground">Features</a>
          <a href="#integrations" className="rounded-full px-3 py-1 transition-colors hover:bg-white/[0.04] hover:text-foreground">Integrations</a>
          <a href="#pricing" className="rounded-full px-3 py-1 transition-colors hover:bg-white/[0.04] hover:text-foreground">Pricing</a>
          <Button size="sm" className="magnetic ml-1 h-7 rounded-full px-3 text-xs" asChild>
            <Link to="/signup">Try free</Link>
          </Button>
        </div>
      </div>

      {/* Hero — premium two-column */}
      <section className="relative px-6 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/4 h-[480px] w-[480px] rounded-full bg-primary/[0.035] blur-3xl" />
        <div className="absolute top-1/2 right-1/4 h-[420px] w-[420px] rounded-full bg-accent/[0.025] blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          {/* Left: copy + CTAs */}
          <div className="text-center lg:text-left">
            <FadeSection>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                AI Spec Generator for product teams
              </div>
            </FadeSection>
            <FadeSection delay={0.08}>
              <h1 className="mb-6 text-[44px] font-bold leading-[0.95] tracking-tighter sm:text-6xl lg:text-[72px]">
                From idea to{" "}
                <span className="liquid-text">production-ready spec.</span>
                <br className="hidden sm:block" />
                <span className="text-foreground/85">In 30 seconds.</span>
              </h1>
            </FadeSection>
            <FadeSection delay={0.16}>
              <p className="mx-auto mb-9 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-base lg:mx-0">
                Stop writing PRDs. Start shipping. SpecMirror turns rough product briefs into structured, engineering-ready specs — encrypted, versioned, and exportable to PDF, Notion, and Slack.
              </p>
            </FadeSection>
            <FadeSection delay={0.22}>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Button size="lg" className="magnetic gap-2 px-7 text-base shadow-[0_8px_24px_-8px_hsl(226_70%_55%_/_0.55)]" asChild>
                  <Link to="/signup">
                    Try free — no card
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="magnetic gap-2 border-white/[0.1] bg-white/[0.03] text-base backdrop-blur-sm hover:bg-white/[0.06]"
                  onClick={() => setShowDemo(true)}
                >
                  <Play className="h-4 w-4" />
                  Watch 60-sec demo
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground/70 lg:text-left">
                Free forever for 6 specs/month · No credit card · Cancel anytime
              </p>
            </FadeSection>
          </div>

          {/* Right: live demo card */}
          <FadeSection delay={0.28}>
            <div className="premium-card relative overflow-hidden p-1.5">
              <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-accent/15 blur-2xl" />
              <MirrorDemo />
            </div>
          </FadeSection>
        </div>
      </section>

      {/* Trust strip */}
      <FadeSection>
        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-8">
          <div className="premium-card flex flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 py-5 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-foreground/85"><span className="font-semibold text-foreground">10,000+</span> specs generated</span>
            </div>
            <div className="hidden h-3 w-px bg-white/[0.08] md:block" />
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent" />
              <span className="text-foreground/85"><span className="font-semibold text-foreground">94%</span> avg confidence</span>
            </div>
            <div className="hidden h-3 w-px bg-white/[0.08] md:block" />
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-foreground/85"><span className="font-semibold text-foreground">4.9</span> from beta users</span>
            </div>
            <div className="hidden h-3 w-px bg-white/[0.08] md:block" />
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-accent" />
              <span className="text-foreground/85">End-to-end encrypted</span>
            </div>
          </div>
        </div>
      </FadeSection>

      <div className="section-divider mx-auto max-w-5xl" />

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
              {/* Step 01 — Write your brief */}
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

              {/* Step 02 — Choose your output */}
              <FadeSection>
                <StepRow
                  step="02"
                  icon={<ClipboardList className="h-5 w-5" />}
                  title="Choose your output"
                  description="Pick the document that fits your stage. Need user stories and acceptance criteria? Go with a Product Requirements Doc. Need architecture, APIs, and data models? Choose Technical Specification."
                  visual={
                    <div className="glass-card rounded-xl p-5">
                      <div className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Select Output</div>
                      <div className="grid grid-cols-2 gap-3">
                        {/* PRD card */}
                        <div className="rounded-lg border border-primary/30 bg-primary/[0.06] p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-xs font-semibold text-primary">PRD</span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <div className="h-1 w-1 rounded-full bg-primary/50" />
                              <span className="text-[10px] text-muted-foreground">User stories</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="h-1 w-1 rounded-full bg-primary/50" />
                              <span className="text-[10px] text-muted-foreground">Acceptance criteria</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="h-1 w-1 rounded-full bg-primary/50" />
                              <span className="text-[10px] text-muted-foreground">Priority rankings</span>
                            </div>
                          </div>
                        </div>
                        {/* Tech Spec card */}
                        <div className="rounded-lg border border-accent/30 bg-accent/[0.06] p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-accent" />
                            <span className="text-xs font-semibold text-accent">Tech Spec</span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <div className="h-1 w-1 rounded-full bg-accent/50" />
                              <span className="text-[10px] text-muted-foreground">Architecture</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="h-1 w-1 rounded-full bg-accent/50" />
                              <span className="text-[10px] text-muted-foreground">API contracts</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="h-1 w-1 rounded-full bg-accent/50" />
                              <span className="text-[10px] text-muted-foreground">Data models</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  align="right"
                />
              </FadeSection>

              {/* Step 03 — SpecAI generates */}
              <FadeSection>
                <StepRow
                  step="03"
                  icon={<Zap className="h-5 w-5" />}
                  title="SpecAI builds your document"
                  description="Trained on thousands of real-world technical documents, SpecAI generates production-grade specs or PRDs — complete with architecture, API definitions, data models, and a dedicated confidence score that tells you how well your brief was understood."
                  visual={
                    <div className="glass-card rounded-xl p-5 border-primary/20">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-widest text-primary">SpecAI</span>
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
                      {/* Confidence badge */}
                      <div className="mt-3 flex justify-end">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold text-accent">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                          94% confidence
                        </div>
                      </div>
                    </div>
                  }
                  align="left"
                />
              </FadeSection>

              {/* Step 04 — Collaborate and ship */}
              <FadeSection>
                <StepRow
                  step="04"
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
                  align="right"
                />
              </FadeSection>
            </div>
          </div>
        </div>
      </section>

      {/* Features — Immersive Linear-Inspired Section */}
      <section id="features" className="relative py-20 md:py-28 overflow-hidden">
        {/* Deep gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-background to-accent/[0.03]" />
        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/[0.03] blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <FadeSection>
            <SectionHeader
              label="Features"
              title="Precision-crafted."
              highlight="Feels like magic."
              description="Every detail obsessed over. Every interaction considered."
            />
          </FadeSection>

          {/* Zone 1 + Zone 2: Dashboard Hero with Floating Nodes */}
          <div className="relative">
            {/* SVG Cyber-line connectors — desktop only */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{ zIndex: 1 }}>
              <defs>
                <linearGradient id="cyber-gradient-left" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="hsl(226 70% 55.5% / 0)" />
                  <stop offset="50%" stopColor="hsl(226 70% 55.5% / 0.3)" />
                  <stop offset="100%" stopColor="hsl(226 70% 55.5% / 0.1)" />
                </linearGradient>
                <linearGradient id="cyber-gradient-right" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="hsl(160 84% 39% / 0.1)" />
                  <stop offset="50%" stopColor="hsl(160 84% 39% / 0.3)" />
                  <stop offset="100%" stopColor="hsl(160 84% 39% / 0)" />
                </linearGradient>
              </defs>
              {/* Left connector */}
              <line x1="0%" y1="35%" x2="18%" y2="45%" stroke="url(#cyber-gradient-left)" strokeWidth="1" filter="drop-shadow(0 0 6px hsl(226 70% 55.5% / 0.2))" />
              {/* Right connector */}
              <line x1="82%" y1="45%" x2="100%" y2="35%" stroke="url(#cyber-gradient-right)" strokeWidth="1" filter="drop-shadow(0 0 6px hsl(160 84% 39% / 0.2))" />
            </svg>

            <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-5">
              {/* Left floating node */}
              <FadeSection delay={0.2} className="md:w-52 shrink-0 self-center">
                <div className="animate-float rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-xl" style={{ boxShadow: "0 0 40px hsl(226 70% 55.5% / 0.06)" }}>
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold tracking-tight">Instant AI Generation</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">One click transforms briefs into production specs.</p>
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-accent/70">Streaming</span>
                  </div>
                </div>
              </FadeSection>

              {/* Central Dashboard Hero */}
              <FadeSection className="flex-1 min-w-0">
                <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8 backdrop-blur-xl overflow-hidden" style={{ boxShadow: "0 0 80px hsl(226 70% 55.5% / 0.04), 0 0 40px hsl(160 84% 39% / 0.02)" }}>
                  {/* Neon glow behind */}
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-primary/[0.06] blur-3xl" />

                  <div className="relative z-10">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Layers className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold tracking-tight md:text-xl">Live Mirror View</h3>
                          <p className="text-xs text-muted-foreground">Real-time brief → spec transformation</p>
                        </div>
                      </div>
                      {/* Confidence badge */}
                      <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5" style={{ boxShadow: "0 0 20px hsl(160 84% 39% / 0.15)" }}>
                        <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                        <span className="font-mono text-[10px] font-semibold text-accent">94%</span>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-accent/60">confidence</span>
                      </div>
                    </div>

                    {/* Dual-view interface */}
                    <div className="grid grid-cols-2 gap-px rounded-xl border border-white/[0.06] bg-white/[0.04] overflow-hidden">
                      {/* Brief pane */}
                      <div className="p-4 md:p-5 space-y-2.5 bg-background/40">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">Brief</span>
                        <div className="space-y-2">
                          <div className="typing-line h-2 rounded-sm" style={{ ["--target-width" as string]: "80%", animationDelay: "0s", background: "hsl(226 70% 55.5% / 0.25)" }} />
                          <div className="typing-line h-2 rounded-sm" style={{ ["--target-width" as string]: "95%", animationDelay: "0.3s", background: "hsl(0 0% 100% / 0.07)" }} />
                          <div className="typing-line h-2 rounded-sm" style={{ ["--target-width" as string]: "60%", animationDelay: "0.6s", background: "hsl(0 0% 100% / 0.07)" }} />
                          <div className="typing-line h-2 rounded-sm" style={{ ["--target-width" as string]: "75%", animationDelay: "0.9s", background: "hsl(0 0% 100% / 0.07)" }} />
                          <div className="typing-line h-2 rounded-sm" style={{ ["--target-width" as string]: "50%", animationDelay: "1.2s", background: "hsl(0 0% 100% / 0.05)" }} />
                        </div>
                      </div>
                      {/* Spec pane */}
                      <div className="p-4 md:p-5 space-y-2.5 bg-background/60 border-l border-white/[0.06]">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-primary/60">Spec</span>
                        <div className="space-y-2">
                          <div className="spec-line h-2 rounded-sm" style={{ width: "45%", animationDelay: "0.5s", background: "hsl(160 84% 39% / 0.3)" }} />
                          <div className="spec-line h-2 rounded-sm" style={{ width: "85%", animationDelay: "0.8s", background: "hsl(0 0% 100% / 0.07)" }} />
                          <div className="spec-line h-2 rounded-sm" style={{ width: "70%", animationDelay: "1.1s", background: "hsl(0 0% 100% / 0.07)" }} />
                          <div className="spec-line h-2 rounded-sm" style={{ width: "55%", animationDelay: "1.4s", background: "hsl(160 84% 39% / 0.25)" }} />
                          <div className="spec-line h-2 rounded-sm" style={{ width: "90%", animationDelay: "1.7s", background: "hsl(0 0% 100% / 0.05)" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeSection>

              {/* Right floating node */}
              <FadeSection delay={0.3} className="md:w-52 shrink-0 self-center">
                <div className="animate-float-delayed rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-xl" style={{ boxShadow: "0 0 40px hsl(160 84% 39% / 0.06)" }}>
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Users className="h-4 w-4" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold tracking-tight">Seamless Collaboration</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">Encrypted sharing, version history, team presence.</p>
                  <div className="mt-3 flex gap-0.5">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-5 w-5 rounded-full border-2 border-background bg-gradient-to-br from-primary/40 to-accent/30" style={{ marginLeft: i > 0 ? "-4px" : 0 }} />
                    ))}
                    <span className="ml-1 self-center text-[9px] text-muted-foreground/60">+4</span>
                  </div>
                </div>
              </FadeSection>
            </div>
          </div>

          {/* Zone 3: PRD vs Tech Spec Interactive Toggle */}
          <FadeSection delay={0.4}>
            <div className="mt-6 mx-auto max-w-2xl">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500" style={{ boxShadow: activeDocType === 'prd' ? "0 0 30px hsl(226 70% 55.5% / 0.06), inset 0 0 0 1px hsl(226 70% 55.5% / 0.08)" : "0 0 30px hsl(160 84% 39% / 0.06), inset 0 0 0 1px hsl(160 84% 39% / 0.08)" }}>
                {/* Toggle bar */}
                <div className="mb-5 flex items-center justify-center">
                  <div className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-1">
                    <button
                      onClick={() => setActiveDocType('prd')}
                      className={`relative rounded-full px-5 py-2 text-xs font-semibold transition-all duration-300 ${activeDocType === 'prd' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                      style={activeDocType === 'prd' ? { boxShadow: "0 0 16px hsl(226 70% 55.5% / 0.3)" } : {}}
                    >
                      Product Requirements
                    </button>
                    <button
                      onClick={() => setActiveDocType('spec')}
                      className={`relative rounded-full px-5 py-2 text-xs font-semibold transition-all duration-300 ${activeDocType === 'spec' ? 'bg-accent text-accent-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                      style={activeDocType === 'spec' ? { boxShadow: "0 0 16px hsl(160 84% 39% / 0.3)" } : {}}
                    >
                      Technical Spec
                    </button>
                  </div>
                </div>

                {/* Content panel */}
                <motion.div
                  key={activeDocType}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {activeDocType === 'prd' ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-base font-bold text-foreground">Product Requirements Doc</span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Best for <span className="text-foreground/80 font-medium">PMs and founders</span>. Align your team on <span className="text-foreground/80 font-medium">what</span> to build with structured user stories, acceptance criteria, and priority rankings.
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {["User stories", "Acceptance criteria", "Priorities", "Feature breakdown", "Success metrics"].map(tag => (
                          <span key={tag} className="rounded-full border border-primary/20 bg-primary/[0.06] px-2.5 py-0.5 font-mono text-[10px] font-medium text-primary/80">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <Code2 className="h-5 w-5 text-accent" />
                        <span className="text-base font-bold text-foreground">Technical Specification</span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Best for <span className="text-foreground/80 font-medium">engineers and tech leads</span>. Know exactly <span className="text-foreground/80 font-medium">how</span> to build it with system architecture, API contracts, and data models.
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {["Architecture", "API contracts", "Data models", "Infrastructure", "Security"].map(tag => (
                          <span key={tag} className="rounded-full border border-accent/20 bg-accent/[0.06] px-2.5 py-0.5 font-mono text-[10px] font-medium text-accent/80">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* Integrations — Ship-anywhere export grid */}
      <section id="integrations" className="relative py-20 md:py-28 overflow-hidden border-t border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background" />
        <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-primary/[0.05] blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-72 w-72 rounded-full bg-accent/[0.04] blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <FadeSection>
            <SectionHeader
              label="Integrations"
              title="Ship your spec"
              highlight="anywhere."
              description="Approved specs don't sit in a tab. Export as a branded PDF, push to Notion, or post straight to a Slack channel — all from one menu on your dashboard."
            />
          </FadeSection>

          <div className="grid gap-5 md:grid-cols-3">
            {/* PDF Export */}
            <FadeSection delay={0.05}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.04]" style={{ boxShadow: "0 0 40px hsl(226 70% 55.5% / 0.04)" }}>
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/[0.08] blur-2xl transition-opacity duration-500 group-hover:opacity-150" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Download className="h-5 w-5" />
                  </div>
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-base font-bold tracking-tight">PDF Export</h3>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-primary">Pro</span>
                  </div>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">Branded, print-ready PDF with cover page, sectioned spec, and confidence score. One click.</p>
                  <div className="rounded-lg border border-white/[0.06] bg-background/60 p-3">
                    <div className="aspect-[3/4] rounded-md bg-zinc-950 border border-white/[0.04] p-3 flex flex-col">
                      <div className="font-mono text-[8px] font-bold tracking-widest text-primary mb-1.5">SPECMIRROR</div>
                      <div className="h-px w-8 bg-primary mb-2" />
                      <div className="space-y-1 flex-1">
                        <div className="h-1.5 w-3/4 rounded-sm bg-white/[0.1]" />
                        <div className="h-1.5 w-1/2 rounded-sm bg-white/[0.06]" />
                        <div className="h-px w-full bg-white/[0.04] my-1.5" />
                        <div className="h-1.5 w-2/3 rounded-sm bg-white/[0.06]" />
                        <div className="h-1.5 w-4/5 rounded-sm bg-white/[0.06]" />
                        <div className="h-1.5 w-3/5 rounded-sm bg-white/[0.06]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeSection>

            {/* Notion Export */}
            <FadeSection delay={0.1}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500 hover:border-accent/30 hover:bg-white/[0.04]" style={{ boxShadow: "0 0 40px hsl(160 84% 39% / 0.04)" }}>
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-accent/[0.08] blur-2xl transition-opacity duration-500" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-base font-bold tracking-tight">Notion Export</h3>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-primary">Pro</span>
                  </div>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">Push the full spec into any parent Notion page as structured blocks — headings, paragraphs, code.</p>
                  <div className="rounded-lg border border-white/[0.06] bg-background/60 p-3">
                    <div className="aspect-[3/4] rounded-md bg-zinc-950 border border-white/[0.04] p-3 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="h-3 w-3 rounded-sm bg-accent/30" />
                        <div className="h-1.5 flex-1 rounded-sm bg-white/[0.1]" />
                      </div>
                      <div className="h-2 w-2/3 rounded-sm bg-white/[0.12]" />
                      <div className="h-1 w-full rounded-sm bg-white/[0.05]" />
                      <div className="h-1 w-5/6 rounded-sm bg-white/[0.05]" />
                      <div className="mt-1 rounded-sm border-l-2 border-accent/40 bg-white/[0.03] p-1.5 space-y-1">
                        <div className="h-1 w-3/4 rounded-sm bg-accent/20" />
                        <div className="h-1 w-1/2 rounded-sm bg-accent/15" />
                      </div>
                      <div className="h-1 w-2/3 rounded-sm bg-white/[0.05]" />
                    </div>
                  </div>
                </div>
              </div>
            </FadeSection>

            {/* Slack Integration */}
            <FadeSection delay={0.15}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.04]" style={{ boxShadow: "0 0 40px hsl(226 70% 55.5% / 0.04)" }}>
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/[0.08] blur-2xl transition-opacity duration-500" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-base font-bold tracking-tight">Slack Post</h3>
                    <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-accent">Basic + Pro</span>
                  </div>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">Connect your workspace, pick a channel, and post the approved spec with rich Block Kit formatting.</p>
                  <div className="rounded-lg border border-white/[0.06] bg-background/60 p-3">
                    <div className="aspect-[3/4] rounded-md bg-zinc-950 border border-white/[0.04] p-3 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] text-muted-foreground/60">#</span>
                        <div className="h-1.5 w-16 rounded-sm bg-white/[0.1]" />
                      </div>
                      <div className="flex items-start gap-1.5">
                        <div className="h-4 w-4 rounded-sm bg-gradient-to-br from-primary/40 to-accent/30 shrink-0" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-1">
                            <div className="h-1.5 w-12 rounded-sm bg-white/[0.15]" />
                            <div className="h-1 w-6 rounded-sm bg-white/[0.05]" />
                          </div>
                          <div className="h-1 w-full rounded-sm bg-white/[0.06]" />
                          <div className="h-1 w-4/5 rounded-sm bg-white/[0.06]" />
                          <div className="mt-1.5 rounded-sm border-l-2 border-primary/40 bg-white/[0.03] p-1.5 space-y-1">
                            <div className="h-1 w-2/3 rounded-sm bg-primary/20" />
                            <div className="h-1 w-3/4 rounded-sm bg-white/[0.05]" />
                            <div className="h-1 w-1/2 rounded-sm bg-white/[0.05]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeSection>
          </div>

          <FadeSection delay={0.2}>
            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-5 backdrop-blur-xl md:flex-row">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-accent shrink-0" />
                <p className="text-sm text-muted-foreground">
                  All exports stay <span className="text-foreground/90 font-medium">end-to-end encrypted</span> until they reach your destination. No middleman storage.
                </p>
              </div>
              <Button size="sm" variant="outline" className="gap-2 border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] shrink-0" asChild>
                <a href="#pricing">
                  See plans
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* Why Not ChatGPT — Competitive Differentiation (Immersive) */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Deep gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] via-background to-primary/[0.04]" />
        <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-accent/[0.04] blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 h-80 w-80 rounded-full bg-primary/[0.04] blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <FadeSection>
            <div className="mb-14 text-center">
              <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary">Built different</p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Not another{" "}
                <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">chatbot.</span>
              </h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed md:text-lg">
                SpecMirror's AI is hyper-trained on thousands of real-world technical documents, architecture patterns, and production specs. It doesn't guess. It knows.
              </p>
            </div>
          </FadeSection>

          {/* Comparison table — glassmorphic */}
          <div className="mb-16 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl" style={{ boxShadow: "0 0 60px hsl(226 70% 55.5% / 0.04), 0 0 30px hsl(160 84% 39% / 0.02)" }}>
            {/* Desktop: 3-column table */}
            <div className="hidden md:block">
              <div className="grid grid-cols-[1fr,1fr,1fr] border-b border-white/[0.06]">
                <div className="p-5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">Capability</div>
                <div className="p-5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60 border-l border-white/[0.06]">Generic AI</div>
                <div className="p-5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary border-l border-white/[0.06]">SpecMirror</div>
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
                      <X className="h-4 w-4 shrink-0 mt-0.5 text-destructive/50" />
                      <span className="text-sm text-muted-foreground/60">{row.generic}</span>
                    </div>
                    <div className="p-5 flex items-start gap-2.5 border-l border-white/[0.06] bg-accent/[0.03]">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-accent" style={{ filter: "drop-shadow(0 0 6px hsl(160 84% 39% / 0.4))" }} />
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
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">{row.capability}</p>
                    <div className="flex items-start gap-2">
                      <X className="h-4 w-4 shrink-0 mt-0.5 text-destructive/50" />
                      <div>
                        <span className="font-mono text-[9px] font-medium uppercase tracking-wider text-muted-foreground/40">Generic AI</span>
                        <p className="text-sm text-muted-foreground/60">{row.generic}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 rounded-lg bg-accent/[0.05] p-2.5 -mx-1">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-accent" style={{ filter: "drop-shadow(0 0 6px hsl(160 84% 39% / 0.4))" }} />
                      <div>
                        <span className="font-mono text-[9px] font-medium uppercase tracking-wider text-primary">SpecMirror</span>
                        <p className="text-sm text-foreground/90">{row.spec}</p>
                      </div>
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>

          {/* Training depth visual — floating pills */}
          <FadeSection>
            <div className="text-center mb-8">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary mb-2">Training depth</p>
              <p className="text-muted-foreground text-sm">Purpose-built on real engineering knowledge</p>
            </div>
          </FadeSection>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              "API References", "RFC Standards", "Infrastructure Patterns", "Security Best Practices",
              "Database Schemas", "CI/CD Pipelines", "System Design Docs", "Architecture Patterns",
            ].map((label, i) => (
              <FadeSection key={label} delay={0.05 * i}>
                <div className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 font-mono text-xs text-foreground/70 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:text-foreground/90 hover:bg-white/[0.05]" style={{ boxShadow: "0 0 20px hsl(226 70% 55.5% / 0.03)" }}>
                  {label}
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — Immersive */}
      <section id="pricing" className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-background to-accent/[0.03]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-primary/[0.03] blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <FadeSection>
            <SectionHeader
              label="Pricing"
              title="Simple, transparent"
              highlight="pricing"
              description="Start free. Upgrade when you need unlimited power."
            />
          </FadeSection>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {/* Free */}
            <FadeSection>
              <div className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 backdrop-blur-xl transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04]">
                <div className="mb-6">
                  <h3 className="text-lg font-bold">Free</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">$0</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">Try SpecMirror on personal projects.</p>
                </div>
                <ul className="mb-8 flex-1 space-y-2.5 text-sm text-muted-foreground">
                  {[
                    "6 generations / month",
                    "SpecAI (standard model)",
                    "Encrypted sharing",
                    "Version history",
                    "Confidence scoring",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="lg" className="w-full border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06]" asChild>
                  <Link to="/signup">Get started free</Link>
                </Button>
              </div>
            </FadeSection>

            {/* Basic */}
            <FadeSection delay={0.05}>
              <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-xl transition-all duration-500 hover:border-white/[0.16] hover:bg-white/[0.04]">
                <div className="mb-6">
                  <h3 className="text-lg font-bold">Basic</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">$12</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">For active builders who need more power.</p>
                </div>
                <ul className="mb-8 flex-1 space-y-2.5 text-sm text-muted-foreground">
                  {[
                    "16 generations / month",
                    "SpecAI v2 (stronger model)",
                    "Encrypted team sharing",
                    "Version history",
                    "Slack integration",
                    "Priority support",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="lg" className="w-full gap-2 border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08]" onClick={() => handleCheckout("basic")} disabled={checkoutLoading !== null}>
                  {checkoutLoading === "basic" ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Start Basic <ArrowRight className="h-4 w-4" /></>}
                </Button>
              </div>
            </FadeSection>

            {/* Pro */}
            <FadeSection delay={0.1}>
              <div className="relative flex h-full flex-col rounded-2xl border border-primary/30 bg-white/[0.02] p-7 backdrop-blur-xl transition-all duration-500 hover:border-primary/50 hover:bg-white/[0.04]" style={{ boxShadow: "0 0 60px hsl(226 70% 55.5% / 0.08), inset 0 0 0 1px hsl(226 70% 55.5% / 0.05)" }}>
                <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 font-mono text-[10px] font-medium text-primary-foreground uppercase tracking-wider" style={{ boxShadow: "0 0 12px hsl(226 70% 55.5% / 0.4)" }}>
                  Most popular
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-bold">Pro</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">$24</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">For teams that ship fast with the strongest AI.</p>
                </div>
                <ul className="mb-8 flex-1 space-y-2.5 text-sm text-muted-foreground">
                  {[
                    "30 generations / month",
                    "SpecAI Pro (strongest model)",
                    "Everything in Basic",
                    "Custom export (PDF / Notion)",
                    "Priority support",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="magnetic w-full gap-2" onClick={() => handleCheckout("pro")} disabled={checkoutLoading !== null}>
                  {checkoutLoading === "pro" ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Start Pro <ArrowRight className="h-4 w-4" /></>}
                </Button>
                <p className="mt-3 text-center text-[11px] text-muted-foreground/70">Cancel anytime · 7-day money-back</p>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* FAQ + Final CTA */}
      <section id="faq" className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] via-background to-primary/[0.03]" />
        <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-accent/[0.03] blur-3xl" />

        <div className="relative z-10 mx-auto max-w-2xl px-6">
          <FadeSection>
            <SectionHeader label="FAQ" title="Frequently asked" highlight="questions" />
          </FadeSection>
          <FadeSection delay={0.1}>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1 backdrop-blur-xl" style={{ boxShadow: "0 0 40px hsl(226 70% 55.5% / 0.03)" }}>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-is" className="border-white/[0.06] px-5">
                  <AccordionTrigger className="text-left text-base">What exactly does SpecMirror generate?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    You write a plain-English project brief — goals, audience, key features. SpecMirror&apos;s AI mirrors it back as a structured technical spec covering architecture, auth strategy, data models, API surface, and infrastructure — ready for your engineering team to build from.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="who-for" className="border-white/[0.06] px-5">
                  <AccordionTrigger className="text-left text-base">Who is this built for?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Product managers, founders, and technical leads who need to translate product thinking into engineering-ready specs without spending hours writing boilerplate. If you&apos;ve ever lost context between &ldquo;what we want&rdquo; and &ldquo;how to build it,&rdquo; SpecMirror closes that gap.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="accuracy" className="border-white/[0.06] px-5">
                  <AccordionTrigger className="text-left text-base">How accurate are the generated specs?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Every spec includes a confidence score so you know where the AI is certain and where it needs your input. You review, edit, and approve before anything ships — SpecMirror is a starting point, not an autopilot.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="sharing" className="border-white/[0.06] px-5">
                  <AccordionTrigger className="text-left text-base">How does encrypted sharing work?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Once you approve a spec, you can generate an AES-encrypted link with an optional expiry. Share it with your team or stakeholders — they can view the spec without needing an account, and the link self-destructs after expiration.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pricing" className="border-white/[0.06] px-5">
                  <AccordionTrigger className="text-left text-base">What&apos;s included in the free tier?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Free accounts get 5 AI spec generations per day with full confidence scoring and encrypted sharing. The Pro plan unlocks unlimited daily generations, priority processing, and upcoming integrations like Slack sync. No credit card required to start.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="data" className="border-white/[0.06] px-5">
                  <AccordionTrigger className="text-left text-base">Is my data safe?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Your briefs and specs are stored securely with row-level security policies. Shared links use client-side AES-GCM encryption — we never store the decryption key. Your product ideas stay yours.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </FadeSection>
        </div>

        {/* Final CTA card */}
        <div className="relative z-10 mx-auto mt-20 max-w-5xl px-6">
          <FadeSection delay={0.05}>
            <div className="premium-card relative overflow-hidden p-10 text-center md:p-14">
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-primary/[0.12] blur-3xl" />
              <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 h-56 w-[500px] rounded-full bg-accent/[0.08] blur-3xl" />
              <div className="relative">
                <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-primary">Ready when you are</p>
                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
                  Ready to{" "}
                  <span className="liquid-text">ship faster?</span>
                </h2>
                <p className="mx-auto mb-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  Join 1,200+ founders and product teams turning briefs into engineering-ready specs in seconds.
                </p>
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button size="lg" className="magnetic gap-2 px-8 text-base shadow-[0_8px_24px_-8px_hsl(226_70%_55%_/_0.55)]" asChild>
                    <Link to="/signup">
                      Start free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="magnetic gap-2 border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06]" asChild>
                    <a href="#pricing">See pricing</a>
                  </Button>
                </div>
                <p className="mt-5 text-xs text-muted-foreground/70">
                  No credit card · 6 free specs / month · Cancel anytime
                </p>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* Footer — Immersive */}
      <footer className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.04] via-background to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-40 w-[600px] rounded-full bg-primary/[0.03] blur-3xl" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <Search className="h-5 w-5 text-primary" style={{ filter: "drop-shadow(0 0 6px hsl(226 70% 55.5% / 0.4))" }} />
            <span className="text-lg font-semibold">SpecMirror</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="https://github.com/engineeredbyangelo/SpecMirror---Official-Build" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="/roadmap" className="hover:text-foreground transition-colors">Roadmap</a>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[0.15em]">
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

/* ── Animated Mirror Demo with real text (~30s looping) ── */
const MirrorDemo = () => {
  const [phase, setPhase] = useState<"typing" | "loading" | "reveal">("typing");
  const [visibleBriefLines, setVisibleBriefLines] = useState(0);
  const [visibleSpecLines, setVisibleSpecLines] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [confidence, setConfidence] = useState(0);

  const briefLines = [
    "I want to build an AI assistant platform for small business owners who aren't technical.",
    "Users describe what they need in plain English and the app creates AI agents that handle tasks for them.",
    "Things like sorting emails, drafting replies, scheduling social posts, summarizing documents.",
    "It needs a simple dashboard where they can see what their agents are doing and approve actions before they run.",
    "Should have a free tier with basic agents and a paid plan that unlocks custom workflows and integrations.",
  ];

  const specSections = [
    { heading: "Executive Summary", lines: [
      "A no-code AI agent platform enabling non-technical users to automate repetitive business tasks through natural language. Core value: replaces manual busywork with supervised AI agents that users can trust and control.",
    ]},
    { heading: "Architecture Overview", lines: [
      "Next.js web app with responsive mobile-first UI",
      "Supabase (Postgres + Auth + Edge Functions + Realtime)",
      "OpenAI GPT-4o for agent reasoning + tool execution",
      "Stripe billing with free tier gating + usage metering",
    ]},
    { heading: "Data Model", lines: [
      "users → agents (1:many), agents → tasks (1:many)",
      "agents: id, user_id, name, instructions text, tools jsonb",
      "tasks: id, agent_id, status, input, output, approved_at",
      "integrations: id, user_id, provider, credentials_encrypted",
    ]},
    { heading: "API Design", lines: [
      "POST /api/agents → create agent from natural language prompt",
      "GET /api/agents/:id/tasks → task history with status filters",
      "POST /api/tasks/:id/approve → human-in-the-loop confirmation",
    ]},
    { heading: "Auth & Authorization", lines: [
      "Supabase Auth with email + Google OAuth",
      "JWT with 15-min access / 7-day refresh rotation",
      "RLS policies: users see only own agents, tasks, and integrations",
    ]},
    { heading: "Effort Estimate", lines: [
      "Phase 1: Auth + agent builder + dashboard → 4 days",
      "Phase 2: Task execution engine + approvals → 5 days",
      "Phase 3: Integrations + billing + usage limits → 4 days",
      "Total: ~13 days (2 engineers)",
    ]},
    { heading: "Acceptance Criteria", lines: [
      "✓ User creates working agent from plain English in <60s",
      "✓ Agent executes task only after user approval",
      "✓ Free tier limits to 3 agents and 50 tasks/month",
      "✓ Dashboard shows real-time agent activity feed",
    ]},
  ];

  const flatSpecLines = specSections.flatMap(s => [
    { text: s.heading, isSection: true },
    ...s.lines.map(l => ({ text: l, isSection: false })),
  ]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    setPhase("typing");
    setVisibleBriefLines(0);
    setVisibleSpecLines(0);
    setConfidence(0);

    // Type brief lines — 800ms each for readability
    briefLines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleBriefLines(i + 1), (i + 1) * 800));
    });

    const briefDone = (briefLines.length + 1) * 800;

    // Loading shimmer phase
    timers.push(setTimeout(() => setPhase("loading"), briefDone));

    // Reveal spec lines
    const revealStart = briefDone + 2000;
    timers.push(setTimeout(() => {
      setPhase("reveal");
      flatSpecLines.forEach((_, i) => {
        timers.push(setTimeout(() => setVisibleSpecLines(i + 1), i * 200));
      });
      // Animate confidence counter
      const targetConfidence = 94;
      for (let c = 0; c <= targetConfidence; c++) {
        timers.push(setTimeout(() => setConfidence(c), c * 15));
      }
    }, revealStart));

    // Hold on the completed spec, then restart
    const totalDuration = revealStart + flatSpecLines.length * 200 + 5000;
    timers.push(setTimeout(() => setCycle(c => c + 1), totalDuration));

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  return (
    <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-sm">
      {/* Window chrome */}
      <div className="mb-2 flex items-center gap-2 px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-white/[0.08]" />
          <div className="h-3 w-3 rounded-full bg-white/[0.08]" />
          <div className="h-3 w-3 rounded-full bg-white/[0.08]" />
        </div>
        <div className="mx-auto flex h-7 w-72 items-center justify-center rounded-md bg-white/[0.04] text-[11px] text-muted-foreground/50">
          specmirror.app/project/ai-agent-platform
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {/* Brief Panel */}
        <div className="rounded-xl bg-white/[0.03] p-5 border border-white/[0.06]">
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Product Brief</p>
          </div>
          <div className="space-y-2.5 text-sm leading-relaxed text-foreground/80 min-h-[180px]">
            {briefLines.slice(0, visibleBriefLines).map((line, i) => (
              <p key={i} className="animate-fade-in">{line}</p>
            ))}
            {phase === "typing" && visibleBriefLines < briefLines.length && (
              <span className="inline-block h-4 w-0.5 animate-pulse bg-primary" />
            )}
          </div>
        </div>

        {/* Spec Panel */}
        <div className="rounded-xl bg-white/[0.03] p-5 border border-primary/20">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Technical Mirror</p>
            {phase === "reveal" && confidence > 0 && (
              <div className="relative flex items-center gap-2 animate-fade-in">
                <svg width="28" height="28" viewBox="0 0 56 56" className="rotate-[-90deg]">
                  <circle cx="28" cy="28" r="25" fill="none" stroke="hsl(0 0% 100% / 0.06)" strokeWidth="3" />
                  <circle
                    cx="28" cy="28" r="25" fill="none"
                    stroke="hsl(160 84% 39%)" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 25}`}
                    strokeDashoffset={`${2 * Math.PI * 25 * (1 - confidence / 100)}`}
                  />
                </svg>
                <span className="text-xs font-medium text-accent tabular-nums" style={{ animation: "pulse-glow 2s ease-in-out infinite" }}>{confidence}%</span>
              </div>
            )}
          </div>

          {phase === "typing" && (
            <div className="flex min-h-[180px] items-center justify-center">
              <p className="text-xs text-muted-foreground/40">Waiting for brief…</p>
            </div>
          )}

          {phase === "loading" && (
            <div className="min-h-[180px] space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${35 + Math.random() * 55}%`, animationDelay: `${i * 80}ms` }} />
              ))}
              <p className="mt-3 text-[10px] font-medium uppercase tracking-widest text-accent/60" style={{ animation: "pulse-glow 1.5s ease-in-out infinite" }}>Generating technical specification…</p>
            </div>
          )}

          {phase === "reveal" && (
            <div className="space-y-1 text-xs leading-relaxed text-foreground/80 min-h-[180px] max-h-[320px] overflow-y-auto scrollbar-thin">
              {flatSpecLines.slice(0, visibleSpecLines).map((line, i) => (
                <p
                  key={i}
                  className={`animate-fade-in ${line.isSection ? "font-semibold text-accent text-[13px] mt-3 first:mt-0 border-b border-white/[0.06] pb-1" : "pl-3 text-foreground/70"}`}
                >
                  {line.isSection ? `### ${line.text}` : `• ${line.text}`}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
