import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Search, ArrowLeft, Sparkles, Check, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ShareDialog from "@/components/ShareDialog";

const ProjectMirror = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState("Untitled Brief");
  const [brief, setBrief] = useState("");
  const [spec, setSpec] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleGenerate = () => {
    setIsGenerating(true);
    // Mock generation — AI integration is a separate task
    setTimeout(() => {
      const generated = `## Technical Specification: ${title}

### Architecture
- Multi-step wizard component with progress indicator
- State management via React context + URL params for resumability
- Backend: Edge Function for workspace provisioning

### Data Model
\`\`\`
workspaces: id, name, owner_id, created_at
workspace_members: workspace_id, user_id, role, invited_at
onboarding_state: user_id, current_step, completed_steps[], started_at
\`\`\`

### Effort Estimate
- Frontend: 3 days
- Backend: 2 days
- Integration: 1 day
- **Total: ~6 days (1 engineer)**

### Acceptance Criteria
- [ ] Core flow completes in < 3 minutes
- [ ] All edge cases handled gracefully
- [ ] Progress persists across sessions

### Risks
- Email deliverability (medium)
- Complex state management (low)`;
      setSpec(generated);
      setConfidence(78);
      saveToDb({ spec: generated, confidence: 78 });
      setIsGenerating(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <div className="flex h-12 items-center justify-between border-b border-border/50 px-4">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            <input
              className="bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/40"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Project title…"
            />
          </div>
          {saving && <span className="text-[10px] text-muted-foreground/50">Saving…</span>}
        </div>
        <div className="flex items-center gap-2">
          {/* Confidence meter */}
          <div className="flex items-center gap-2 rounded-full border border-border/50 px-3 py-1">
            <svg className="h-5 w-5 -rotate-90" viewBox="0 0 36 36">
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
          <Button size="sm" variant="outline" className="gap-2" onClick={handleGenerate} disabled={isGenerating}>
            <Sparkles className="h-3.5 w-3.5" />
            {isGenerating ? "Generating…" : "Generate Mirror"}
          </Button>
          <Button size="sm" className="gap-2" disabled={!spec}>
            <Check className="h-3.5 w-3.5" />
            Approve
          </Button>
        </div>
      </div>

      {/* Split panels */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex h-full flex-col">
            <div className="border-b border-border/50 px-4 py-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Product Brief</span>
            </div>
            <textarea
              className="flex-1 resize-none bg-transparent p-4 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/40 font-mono"
              value={brief}
              onChange={(e) => handleBriefChange(e.target.value)}
              placeholder="Write your product brief here…"
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex h-full flex-col">
            <div className="border-b border-border/50 px-4 py-2">
              <span className="text-xs font-medium uppercase tracking-wider text-primary">Technical Mirror</span>
            </div>
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
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectMirror;
