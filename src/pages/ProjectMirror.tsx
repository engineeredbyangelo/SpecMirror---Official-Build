import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Search, ArrowLeft, Sparkles, Check } from "lucide-react";
import { useState } from "react";

const ProjectMirror = () => {
  const { id } = useParams();
  const [brief, setBrief] = useState("## User Onboarding Flow\n\nWe need a smooth onboarding experience that guides new users through setting up their workspace, inviting team members, and creating their first project.\n\n### Key Goals\n- Reduce time-to-value under 3 minutes\n- Support both individual and team signups\n- Progressive disclosure — don't overwhelm");
  const [spec, setSpec] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSpec(`## Technical Specification: User Onboarding Flow

### Architecture
- Multi-step wizard component with progress indicator
- State management via React context + URL params for resumability
- Backend: Supabase Edge Function for workspace provisioning

### Data Model
\`\`\`
workspaces: id, name, owner_id, created_at
workspace_members: workspace_id, user_id, role, invited_at
onboarding_state: user_id, current_step, completed_steps[], started_at
\`\`\`

### Effort Estimate
- Frontend wizard: 3 days
- Backend provisioning: 2 days
- Email invitations: 1 day
- **Total: ~6 days (1 engineer)**

### Acceptance Criteria
- [ ] User completes onboarding in < 3 minutes
- [ ] Team invitations send email with magic link
- [ ] Progress persists across sessions
- [ ] Skip option available at every step

### Risks
- Email deliverability for invitations (medium)
- Complex state if user navigates away mid-flow (low)`);
      setIsGenerating(false);
    }, 2000);
  };

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
            <span className="text-sm font-medium">Project #{id}</span>
          </div>
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
                strokeDasharray={`${spec ? 78 : 0}, 100`}
              />
            </svg>
            <span className="text-xs text-muted-foreground">{spec ? "78%" : "—"}</span>
          </div>
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
              onChange={(e) => setBrief(e.target.value)}
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
                onChange={(e) => setSpec(e.target.value)}
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
