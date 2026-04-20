import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search, Plus, FileText, Loader2, Trash2, Share2,
  CheckCircle2, Link2, Hash, ArrowRight, Lock, Sparkles
} from "lucide-react";
import { useAuth, STRIPE_TIERS } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ShareDialog from "@/components/ShareDialog";
import OnboardingDialog from "@/components/OnboardingDialog";

interface Project {
  id: string;
  title: string;
  confidence: number;
  updated_at: string;
  approved: boolean;
}

const Dashboard = () => {
  const { user, signOut, subscriptionTier } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [shareProject, setShareProject] = useState<{ id: string; spec: string } | null>(null);
  const [usage, setUsage] = useState<number>(0);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const tier = (subscriptionTier ?? "free") as "free" | "basic" | "pro";
  const tierConfig = STRIPE_TIERS[tier];
  const monthlyLimit = tierConfig.monthly_limit;
  const tierLabel = tierConfig.name;
  const slackUnlocked = tier === "basic" || tier === "pro";

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("id, title, confidence, updated_at, approved")
      .order("updated_at", { ascending: false });
    if (data) setProjects(data as Project[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Load monthly usage + onboarding flag
  useEffect(() => {
    if (!user) return;
    (async () => {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const { count } = await supabase
        .from("generation_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", monthStart.toISOString());
      setUsage(count ?? 0);

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profile && (profile as any).onboarding_completed === false) {
        setShowOnboarding(true);
      }
    })();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNewProject = async () => {
    if (!user) return;
    setCreating(true);
    const { data, error } = await supabase
      .from("projects")
      .insert({ user_id: user.id, title: "Untitled Brief" })
      .select("id")
      .single();
    setCreating(false);
    if (error) {
      toast({ variant: "destructive", title: "Failed to create project" });
      return;
    }
    navigate(`/project/${data.id}`);
  };

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    await supabase.from("projects").delete().eq("id", projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    toast({ title: "Project deleted" });
  };

  const handleShare = async (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const { data } = await supabase
      .from("projects")
      .select("spec")
      .eq("id", projectId)
      .single();
    setShareProject({ id: projectId, spec: data?.spec || "" });
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const drafts = projects.filter((p) => !p.approved);
  const approved = projects.filter((p) => p.approved);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">SpecMirror</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.user_metadata?.full_name || user?.email}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/50 px-2.5 py-1 text-[10px] font-medium">
                <span className={`h-1.5 w-1.5 rounded-full ${tier === "pro" ? "bg-primary" : tier === "basic" ? "bg-accent" : "bg-muted-foreground"}`} />
                <span className="text-foreground">{tierLabel}</span>
                <span className="text-muted-foreground">· {usage}/{monthlyLimit}</span>
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Log out
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your briefs, specs & integrations
            </p>
          </div>
          <Button className="gap-2" onClick={handleNewProject} disabled={creating}>
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            New Brief
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          /* Bento Grid */
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* ── Draft Briefs ── */}
            <Card className="glass-card md:col-span-1 lg:col-span-2 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-primary" />
                  Draft Briefs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {drafts.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No drafts yet — create your first brief!
                  </p>
                ) : (
                  drafts.slice(0, 5).map((project) => (
                    <Link
                      key={project.id}
                      to={`/project/${project.id}`}
                      className="group flex items-center justify-between rounded-md border border-border/30 bg-background/50 px-4 py-3 transition-colors hover:border-primary/30"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {project.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Updated {timeAgo(project.updated_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <span className="text-xs text-muted-foreground">
                          {project.confidence}%
                        </span>
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${project.confidence}%` }}
                          />
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                          onClick={(e) => handleDelete(e, project.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </Link>
                  ))
                )}
                {drafts.length > 5 && (
                  <p className="pt-1 text-center text-xs text-muted-foreground">
                    +{drafts.length - 5} more drafts
                  </p>
                )}
              </CardContent>
            </Card>

            {/* ── Integrations ── */}
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Hash className="h-4 w-4 text-accent" />
                  Integrations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 rounded-md border border-border/30 bg-background/50 px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#4A154B]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
                      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zm-2.521 10.124a2.528 2.528 0 0 1 2.521 2.52A2.528 2.528 0 0 1 15.166 24a2.528 2.528 0 0 1-2.521-2.522v-2.52h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Slack</p>
                    <p className="text-xs text-muted-foreground">
                      Share specs to channels
                    </p>
                  </div>
                  {slackUnlocked ? (
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={() => toast({ title: "Slack setup", description: "Slack workspace setup will open shortly." })}>
                      Connect
                    </Button>
                  ) : (
                    <a href="/#pricing" className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/15 transition-colors">
                      <Lock className="h-2.5 w-2.5" />
                      Upgrade to Basic
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-3 rounded-md border border-border/30 bg-background/50 px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Notion</p>
                    <p className="text-xs text-muted-foreground">
                      Export specs to pages (PDF / Notion)
                    </p>
                  </div>
                  {tier === "pro" ? (
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={() => toast({ title: "Custom export", description: "PDF/Notion export will open shortly." })}>
                      <Sparkles className="h-3 w-3" /> Use
                    </Button>
                  ) : (
                    <a href="/#pricing" className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/15 transition-colors">
                      <Lock className="h-2.5 w-2.5" />
                      Upgrade to Pro
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ── Approved Spec Briefs ── */}
            <Card className="glass-card md:col-span-1 lg:col-span-2 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span className="text-accent">Approved Spec Briefs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {approved.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No approved specs yet. Approve a brief to see it here.
                  </p>
                ) : (
                  approved.map((project) => (
                    <Link
                      key={project.id}
                      to={`/project/${project.id}`}
                      className="group flex items-center justify-between rounded-md border border-accent/20 bg-accent/5 px-4 py-3 transition-colors hover:border-accent/40"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">
                            {project.title}
                          </p>
                          <span className="shrink-0 text-[10px] font-semibold text-accent">
                            Approved
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Updated {timeAgo(project.updated_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-accent"
                          onClick={(e) => handleShare(e, project.id)}
                        >
                          <Share2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                          onClick={(e) => handleDelete(e, project.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>

            {/* ── Encrypted Links ── */}
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Link2 className="h-4 w-4 text-primary" />
                  Encrypted Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                {approved.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    Approve a spec to generate shareable encrypted links.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Create secure, encrypted links for any approved spec to share with your team.
                    </p>
                    {approved.slice(0, 3).map((project) => (
                      <button
                        key={project.id}
                        className="flex w-full items-center justify-between rounded-md border border-border/30 bg-background/50 px-4 py-3 text-left transition-colors hover:border-primary/30"
                        onClick={(e) => handleShare(e as any, project.id)}
                      >
                        <span className="truncate text-sm">{project.title}</span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {shareProject && (
        <ShareDialog
          projectId={shareProject.id}
          specContent={shareProject.spec}
          defaultOpen
          onOpenChange={(open) => {
            if (!open) setShareProject(null);
          }}
        />
      )}

      <OnboardingDialog open={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </div>
  );
};

export default Dashboard;
