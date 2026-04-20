import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, GitBranch, Check, ArrowRight, ArrowLeft, PencilLine, Loader2 } from "lucide-react";
import { EXAMPLE_BRIEFS, type ExampleBrief } from "@/lib/exampleBriefs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

const OnboardingDialog = ({ open, onClose }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<ExampleBrief | "blank" | null>(null);
  const [creating, setCreating] = useState(false);

  const markCompleteAndClose = async () => {
    if (user) {
      await supabase.from("profiles").update({ onboarding_completed: true } as any).eq("user_id", user.id);
    }
    onClose();
  };

  const handleFinish = async () => {
    if (!user || !selected) return;
    setCreating(true);
    const isBlank = selected === "blank";
    const payload = isBlank
      ? { user_id: user.id, title: "Untitled Brief" }
      : { user_id: user.id, title: (selected as ExampleBrief).title, brief: (selected as ExampleBrief).brief };
    const { data, error } = await supabase.from("projects").insert(payload).select("id").single();
    setCreating(false);
    if (error || !data) {
      toast({ variant: "destructive", title: "Could not create project" });
      return;
    }
    await markCompleteAndClose();
    navigate(`/project/${data.id}`);
  };

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) markCompleteAndClose(); }}>
      <DialogContent className="max-w-2xl border-white/[0.08] bg-background/95 backdrop-blur-2xl p-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/[0.04] pointer-events-none" />

        {/* Progress dots */}
        <div className="relative flex justify-center gap-2 pt-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === step ? "w-8 bg-primary" : i < step ? "w-1.5 bg-accent" : "w-1.5 bg-white/[0.1]"}`}
            />
          ))}
        </div>

        <div className="relative px-8 pt-6 pb-8 min-h-[420px] flex flex-col">
          {step === 0 && (
            <div className="flex-1 flex flex-col items-center text-center justify-center">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Welcome to SpecMirror</h2>
              <p className="mt-3 text-muted-foreground max-w-md">
                From idea to deploy-ready spec in seconds. Let's set up your first brief — it takes less than a minute.
              </p>
              <Button size="lg" className="mt-8 gap-2" onClick={next}>
                Let's go <ArrowRight className="h-4 w-4" />
              </Button>
              <button onClick={markCompleteAndClose} className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
                Skip for now
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl font-bold tracking-tight">Pick a starting point</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Try one of our examples or start from scratch.
              </p>
              <div className="mt-5 grid gap-2.5 flex-1">
                {EXAMPLE_BRIEFS.map((ex) => {
                  const isSel = selected !== "blank" && selected?.id === ex.id;
                  return (
                    <button
                      key={ex.id}
                      onClick={() => setSelected(ex)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                        isSel
                          ? "border-primary/50 bg-primary/[0.06]"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="text-2xl shrink-0">{ex.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{ex.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{ex.tagline}</p>
                      </div>
                      {isSel && <Check className="h-4 w-4 text-primary shrink-0 mt-1" />}
                    </button>
                  );
                })}
                <button
                  onClick={() => setSelected("blank")}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                    selected === "blank"
                      ? "border-accent/50 bg-accent/[0.06]"
                      : "border-dashed border-white/[0.1] bg-transparent hover:border-white/[0.2]"
                  }`}
                >
                  <PencilLine className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">Start with my own brief</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Open a blank canvas and write from scratch.</p>
                  </div>
                  {selected === "blank" && <Check className="h-4 w-4 text-accent shrink-0 mt-1" />}
                </button>
              </div>
              <div className="mt-5 flex justify-between">
                <Button variant="ghost" onClick={prev} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={next} disabled={!selected} className="gap-2">Continue <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
              <p className="mt-1 text-sm text-muted-foreground">Three steps from idea to approved spec.</p>
              <div className="mt-6 space-y-3 flex-1">
                {[
                  { icon: FileText, title: "Write your brief", desc: "Describe your product in plain language. No templates." },
                  { icon: Sparkles, title: "Mirror with AI", desc: "SpecMirror generates a production-grade technical spec or PRD." },
                  { icon: GitBranch, title: "Approve & share", desc: "Edit, approve, and share encrypted links with your team." },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                      <s.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{i + 1}. {s.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-between">
                <Button variant="ghost" onClick={prev} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={next} className="gap-2">Continue <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 flex flex-col items-center text-center justify-center">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
                <Check className="h-7 w-7 text-accent" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">You're ready</h2>
              <p className="mt-3 text-muted-foreground max-w-md">
                {selected === "blank"
                  ? "We'll open a blank brief for you to start writing."
                  : `We'll pre-fill your brief with the "${(selected as ExampleBrief)?.title}" example. You can edit anything.`}
              </p>
              <Button size="lg" className="mt-8 gap-2" onClick={handleFinish} disabled={creating || !selected}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create my first brief <ArrowRight className="h-4 w-4" /></>}
              </Button>
              <button onClick={prev} className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
                Back
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;