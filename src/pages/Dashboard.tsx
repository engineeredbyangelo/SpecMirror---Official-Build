import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Plus, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const mockProjects = [
  { id: "1", title: "User Onboarding Flow", updatedAt: "2 hours ago", confidence: 78 },
  { id: "2", title: "Payments Integration", updatedAt: "1 day ago", confidence: 45 },
  { id: "3", title: "Search & Filters", updatedAt: "3 days ago", confidence: 92 },
];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Brief
          </Button>
        </div>
        <div className="space-y-2">
          {mockProjects.map((project) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-5 py-4 transition-colors hover:border-primary/30 hover:bg-card/80"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{project.title}</p>
                  <p className="text-xs text-muted-foreground">Updated {project.updatedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{project.confidence}%</span>
                <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${project.confidence}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
