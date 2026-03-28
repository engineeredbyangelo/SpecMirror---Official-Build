import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, Users, Layers, ArrowRight, Play, Search } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold tracking-tight">SpecMirror</span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
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
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 pt-14 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Now in public beta
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
            Product briefs.{" "}
            <br />
            <span className="text-primary">Technical specs.</span>
            <br />
            One mirror.
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            The Linear-style app that instantly translates product ideas into precise engineering specs — with live collaboration and AI superpowers.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link to="/signup">
                Try it free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Play className="h-4 w-4" />
              Watch 47-second demo
            </Button>
          </div>
          <p className="mt-10 text-xs text-muted-foreground/60">
            Trusted by teams at Linear, Vercel, and 200+ more
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="border-y border-border/50 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xl leading-relaxed text-muted-foreground md:text-2xl">
            <span className="text-foreground font-medium">SpecMirror is the missing link</span>{" "}
            between product intuition and engineering reality. Write a brief like a human. Get a perfect technical spec in seconds. Collaborate in real time. Ship faster.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight md:text-4xl">
            Built exactly like Linear.
            <br />
            <span className="text-primary">Feels like magic.</span>
          </h2>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Layers className="h-6 w-6" />}
              title="Live Mirror View"
              description="Side-by-side product brief + technical spec with real-time diffs and confidence meter."
              delay={0}
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Instant AI Generation"
              description="One click turns any brief into architecture notes, effort estimates, and acceptance criteria."
              delay={1}
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Seamless Collaboration"
              description="Comments, presence, version history — everything you love about Linear, but for specs."
              delay={2}
            />
          </div>
        </div>
      </section>

      {/* Preview */}
      <section id="preview" className="border-y border-border/50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-3 text-center text-3xl font-bold tracking-tight">
            See SpecMirror in action
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            Dark mode. Linear speed. Zero friction.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Product Brief (left)
              </p>
              <div className="space-y-3">
                <div className="h-3 w-3/4 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-5/6 rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
                <div className="mt-4 h-3 w-1/2 rounded bg-primary/20" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-4/5 rounded bg-muted" />
              </div>
            </div>
            <div className="rounded-xl border border-primary/30 bg-card p-6">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-primary">
                Technical Mirror (right)
              </p>
              <div className="space-y-3">
                <div className="h-3 w-1/2 rounded bg-accent/20" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-4/5 rounded bg-muted" />
                <div className="mt-4 h-3 w-2/3 rounded bg-accent/20" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it helps */}
      <section id="how-it-helps" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-16 text-center text-3xl font-bold tracking-tight">
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
      <section id="faq" className="border-t border-border/50 py-24">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="dark-mode" className="border-border/50">
              <AccordionTrigger className="text-left">Is it really dark mode only?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes. We believe beautiful dark interfaces make deep work feel better. No light mode in v0.1.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="linear" className="border-border/50">
              <AccordionTrigger className="text-left">Does it integrate with Linear?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes — one-click sync turns an approved spec into a Linear issue with full context.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ai" className="border-border/50">
              <AccordionTrigger className="text-left">What AI model does it use?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                SpecMirror uses state-of-the-art AI to generate technical specs from your product briefs. The AI is optimized for speed and accuracy.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pricing" className="border-border/50">
              <AccordionTrigger className="text-left">Is it free?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We offer a generous free tier. Start building specs today with no credit card required.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">SpecMirror</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Twitter</a>
            <a href="#" className="hover:text-foreground">Discord</a>
            <a href="#" className="hover:text-foreground">GitHub</a>
            <a href="#" className="hover:text-foreground">Roadmap</a>
          </div>
          <p className="text-xs text-muted-foreground/60">
            © 2026 SpecMirror. Made with love for builders who ship.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) => (
  <div
    className="group rounded-xl border border-border/50 bg-card p-8 transition-all hover:border-primary/30 hover:bg-card/80"
    style={{ animationDelay: `${delay * 150}ms` }}
  >
    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
      {icon}
    </div>
    <h3 className="mb-2 text-lg font-semibold">{title}</h3>
    <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
  </div>
);

const PersonaCard = ({ num, title, description }: { num: string; title: string; description: string }) => (
  <div className="flex gap-4">
    <span className="text-4xl font-bold text-primary/20">{num}</span>
    <div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default Landing;
