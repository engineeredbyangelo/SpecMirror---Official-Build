import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Plus, FileText, Loader2, Trash2, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ShareDialog from "@/components/ShareDialog";

interface Project {
  id: string;
  title: string;
  confidence: number;
  updated_at: string;
  approved: boolean;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [shareProject, setShareProject] = useState<{ id: string; spec: string } | null>(null);

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

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">SpecMirror</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.user_metadata?.full_name || user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>Log out</Button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your product briefs and specs</p>
          </div>
          <Button className="gap-2" onClick={handleNewProject} disabled={creating}>
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            New Brief
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="mb-4 h-10 w-10 text-muted-foreground/30" />
            <p className="text-muted-foreground">No projects yet. Create your first brief!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="group flex items-center justify-between rounded-lg border border-border/50 bg-card px-5 py-4 transition-colors hover:border-primary/30 hover:bg-card/80"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{project.title}</p>
                      {project.approved && (
                        <span className="text-xs font-semibold text-emerald-400">Approved Spec Brief</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Updated {timeAgo(project.updated_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{project.confidence}%</span>
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${project.confidence}%` }} />
                    </div>
                  </div>
                  {project.approved && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={(e) => handleShare(e, project.id)}
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                    onClick={(e) => handleDelete(e, project.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Share dialog triggered from dashboard */}
      {shareProject && (
        <ShareDialog
          projectId={shareProject.id}
          specContent={shareProject.spec}
          defaultOpen
          onOpenChange={(open) => { if (!open) setShareProject(null); }}
        />
      )}
    </div>
  );
};

export default Dashboard;
