import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Search, ArrowLeft, Sparkles, Check, Loader2, CheckCircle2, ArrowRight, Link2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import ShareDialog from "@/components/ShareDialog";

const ProjectMirror = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [title, setTitle] = useState("Untitled Brief");
  const [brief, setBrief] = useState("");
  const [spec, setSpec] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [approving, setApproving] = useState(false);
  const [activeTab, setActiveTab] = useState<"brief" | "mirror">("brief");

  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Load project
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) {
        toast({ variant: "destructive", title: "Project not found" });
        navigate("/dashboard", { replace: true });
        return;
      }
      setTitle(data.title);
      setBrief(data.brief || "");
      setSpec(data.spec || "");
      setConfidence(data.confidence || 0);
      setApproved(data.approved || false);
      setLoading(false);
    };
    load();
  }, [id]);

  // Debounced auto-save
  const saveToDb = useCallback(
    async (fields: { title?: string; brief?: string; spec?: string; confidence?: number }) => {
      if (!id) return;
      setSaving(true);
      await supabase
        .from("projects")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", id);
      setSaving(false);
    },
    [id]
  );

  const debouncedSave = useCallback(
    (fields: { title?: string; brief?: string; spec?: string; confidence?: number }) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => saveToDb(fields), 1000);
    },
    [saveToDb]
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    debouncedSave({ title: val });
  };

  const handleBriefChange = (val: string) => {
    setBrief(val);
    debouncedSave({ brief: val });
  };

  const handleSpecChange = (val: string) => {
    setSpec(val);
    debouncedSave({ spec: val });
  };

  const handleGenerate = async () => {
    if (brief.trim().length < 10) {
      toast({ variant: "destructive", title: "Brief too short", description: "Write at least 10 characters before generating." });
      return;
    }
    setIsGenerating(true);
    setSpec("");
    setConfidence(0);
    if (isMobile) setActiveTab("mirror");

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-spec`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ brief, title }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Generation failed" }));
        toast({ variant: "destructive", title: "Generation failed", description: err.error || "Please try again." });
        setIsGenerating(false);
        return;
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullSpec = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullSpec += content;
              setSpec(fullSpec);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      const sections = ["Architecture", "Data Model", "API Design", "Error Handling", "Security", "Testing", "Effort Estimate", "Acceptance Criteria", "Risks"];
      const found = sections.filter(s => fullSpec.includes(s)).length;
      const conf = Math.min(98, Math.round((found / sections.length) * 85 + 10));
      setConfidence(conf);
      saveToDb({ spec: fullSpec, confidence: conf });
    } catch (e) {
      console.error("Generation error:", e);
      toast({ variant: "destructive", title: "Generation failed", description: "Something went wrong. Please try again." });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Shared panel content
  const briefPanel = (
    <div className="flex h-full flex-col">
      {!isMobile && (
        <div className="border-b border-border/50 px-4 py-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Product Brief</span>
        </div>
      )}
      <textarea
        className="flex-1 resize-none bg-transparent p-4 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/40 font-mono"
        value={brief}
        onChange={(e) => handleBriefChange(e.target.value)}
        placeholder="Write your product brief here…"
      />
    </div>
  );

  const mirrorPanel = (
    <div className="flex h-full flex-col">
      {!isMobile && (
        <div className="border-b border-border/50 px-4 py-2">
          <span className="text-xs font-medium uppercase tracking-wider text-primary">Technical Mirror</span>
        </div>
      )}
      {isGenerating ? (
        <div className="flex-1 space-y-3 p-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${Math.random() * 40 + 50}%`, animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      ) : spec ? (
        <textarea
          className="flex-1 resize-none bg-transparent p-4 text-sm leading-relaxed text-foreground outline-none font-mono"
          value={spec}
          onChange={(e) => handleSpecChange(e.target.value)}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Click "Generate Mirror" to create a technical spec</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <div className="flex h-auto min-h-[48px] flex-wrap items-center justify-between gap-2 border-b border-border/50 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Search className="h-4 w-4 text-primary shrink-0" />
            <input
              className="bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/40 min-w-0 w-full"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Project title…"
            />
          </div>
          {saving && <span className="text-[10px] text-muted-foreground/50 shrink-0">Saving…</span>}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Confidence meter */}
          <div className="flex items-center gap-1.5 rounded-full border border-border/50 px-2 py-1 sm:px-3">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-accent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${confidence}, 100`}
              />
            </svg>
            <span className="text-xs text-muted-foreground">{confidence ? `${confidence}%` : "—"}</span>
          </div>
          <ShareDialog projectId={id!} specContent={spec} />
          <Button size="sm" variant="outline" className="gap-1.5 text-xs sm:text-sm" onClick={handleGenerate} disabled={isGenerating}>
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            {isGenerating ? "Generating…" : isMobile ? "Generate" : "Generate Mirror"}
          </Button>
          <Button
            size="sm"
            className={`gap-1.5 text-xs sm:text-sm ${approved ? "bg-emerald-600 hover:bg-emerald-600 text-white" : ""}`}
            disabled={!spec || approving || approved}
            onClick={async () => {
              setApproving(true);
              const { error } = await supabase
                .from("projects")
                .update({ approved: true, updated_at: new Date().toISOString() })
                .eq("id", id!);
              setApproving(false);
              if (error) {
                toast({ variant: "destructive", title: "Failed to approve" });
                return;
              }
              setApproved(true);
              toast({ title: "Spec approved", description: "Your spec brief has been approved." });
            }}
          >
            {approving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
            {approved ? "Approved" : "Approve"}
          </Button>
        </div>
      </div>

      {/* Approval success banner */}
      {approved && (
        <div className="mx-3 sm:mx-4 mt-3 mb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-accent/30 bg-accent/10 px-4 sm:px-5 py-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
            <div>
              <p className="text-sm font-medium text-accent">Your spec has been approved!</p>
              <p className="text-xs text-muted-foreground">Share it with your team or return to your dashboard.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ShareDialog projectId={id!} specContent={spec}>
              <Button size="sm" variant="outline" className="gap-1.5 border-accent/30 text-accent hover:bg-accent/10 hover:text-accent flex-1 sm:flex-initial">
                <Link2 className="h-3.5 w-3.5" />
                Create Link
              </Button>
            </ShareDialog>
            <Link to="/dashboard" className="flex-1 sm:flex-initial">
              <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground hover:text-foreground w-full">
                Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Mobile: Tab switcher with swipe */}
      {isMobile ? (
        <>
          <div className="flex border-b border-border/50">
            <button
              className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === "brief"
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("brief")}
            >
              Product Brief
            </button>
            <button
              className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === "mirror"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("mirror")}
            >
              Technical Mirror
            </button>
          </div>
          <div
            className="flex-1 overflow-hidden"
            onTouchStart={(e) => {
              const touch = e.touches[0];
              (e.currentTarget as HTMLDivElement).dataset.touchStartX = String(touch.clientX);
            }}
            onTouchEnd={(e) => {
              const startX = Number((e.currentTarget as HTMLDivElement).dataset.touchStartX || 0);
              const endX = e.changedTouches[0].clientX;
              const diff = startX - endX;
              if (diff > 50) setActiveTab("mirror");
              if (diff < -50) setActiveTab("brief");
            }}
          >
            {activeTab === "brief" ? briefPanel : mirrorPanel}
          </div>
        </>
      ) : (
        /* Desktop: Resizable side-by-side */
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={50} minSize={30}>
            {briefPanel}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            {mirrorPanel}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};

export default ProjectMirror;
