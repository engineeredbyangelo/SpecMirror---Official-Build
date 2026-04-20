import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, RotateCcw, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type TierName } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface VersionRow {
  id: string;
  version_number: number;
  title: string;
  brief: string | null;
  spec: string | null;
  confidence: number | null;
  created_at: string;
}

interface VersionsPanelProps {
  projectId: string;
  tier: TierName;
  onRestore: (v: { title: string; brief: string; spec: string; confidence: number }) => void;
}

const VersionsPanel = ({ projectId, tier, onRestore }: VersionsPanelProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState<VersionRow[]>([]);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const isLocked = tier === "free";

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("project_versions")
      .select("id, version_number, title, brief, spec, confidence, created_at")
      .eq("project_id", projectId)
      .order("version_number", { ascending: false });
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Couldn't load versions" });
      return;
    }
    setVersions(data ?? []);
  }, [projectId, toast]);

  useEffect(() => {
    if (open && !isLocked) load();
  }, [open, isLocked, load]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs sm:text-sm">
          <History className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          Versions
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Version History
          </SheetTitle>
          <SheetDescription>
            Snapshots are saved each time you approve a spec.
          </SheetDescription>
        </SheetHeader>

        {isLocked ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center px-6">
            <div className="rounded-full bg-muted p-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Version history is a paid feature</p>
              <p className="text-xs text-muted-foreground mt-1">
                Upgrade to Basic or Pro to restore past snapshots of your briefs and specs.
              </p>
            </div>
            <Link to="/#pricing" onClick={() => setOpen(false)}>
              <Button size="sm">Upgrade</Button>
            </Link>
          </div>
        ) : loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : versions.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-center px-6">
            <p className="text-sm text-muted-foreground">
              No snapshots yet. Approve a spec to create the first version.
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1 -mx-6 px-6 mt-2">
            <div className="space-y-2 pb-6">
              {versions.map((v) => (
                <div
                  key={v.id}
                  className="rounded-lg border border-border/60 bg-card/40 p-3 hover:border-border transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-primary">v{v.version_number}</span>
                        <span className="text-sm font-medium truncate">{v.title}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {new Date(v.created_at).toLocaleString()}
                        {typeof v.confidence === "number" && ` · ${v.confidence}% confidence`}
                      </p>
                      {v.brief && (
                        <p className="text-xs text-muted-foreground/80 mt-1.5 line-clamp-2">
                          {v.brief}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 shrink-0 h-8"
                      disabled={restoringId === v.id}
                      onClick={async () => {
                        setRestoringId(v.id);
                        onRestore({
                          title: v.title,
                          brief: v.brief ?? "",
                          spec: v.spec ?? "",
                          confidence: v.confidence ?? 0,
                        });
                        toast({ title: `Restored v${v.version_number}`, description: "Editor updated with this snapshot." });
                        setRestoringId(null);
                        setOpen(false);
                      }}
                    >
                      {restoringId === v.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <RotateCcw className="h-3 w-3" />
                      )}
                      Restore
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default VersionsPanel;