import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, FileText, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NotionPage { id: string; title: string }

interface Props {
  projectId: string;
  projectTitle: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export default function NotionExportDialog({ projectId, projectTitle, open, onOpenChange }: Props) {
  const { toast } = useToast();
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [missingToken, setMissingToken] = useState(false);

  const search = async (q: string) => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("export-to-notion", {
      body: { action: "search", query: q },
    });
    setLoading(false);
    if (data?.code === "missing_token") {
      setMissingToken(true);
      return;
    }
    if (error || data?.error) {
      toast({ variant: "destructive", title: "Notion search failed", description: error?.message || data?.error });
      return;
    }
    setPages(data.pages || []);
  };

  useEffect(() => {
    if (!open) return;
    setMissingToken(false);
    setPages([]);
    setQuery("");
    search("");
  }, [open]);

  const handleExport = async (parentPageId: string) => {
    setExporting(true);
    const { data, error } = await supabase.functions.invoke("export-to-notion", {
      body: { action: "create", projectId, parentPageId },
    });
    setExporting(false);
    if (error || data?.error) {
      toast({ variant: "destructive", title: "Export failed", description: error?.message || data?.error });
      return;
    }
    toast({
      title: "Exported to Notion",
      description: data.url ? "Click to open in Notion." : "Page created.",
    });
    if (data.url) window.open(data.url, "_blank");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export to Notion</DialogTitle>
          <DialogDescription>Pick a parent page for <strong>{projectTitle}</strong>.</DialogDescription>
        </DialogHeader>

        {missingToken ? (
          <div className="rounded-md border border-border/50 bg-muted/30 p-4 text-sm space-y-2">
            <p className="font-medium">Notion isn't connected yet.</p>
            <p className="text-muted-foreground">
              Create a Notion internal integration token, then add it to your project secrets as <code className="text-xs bg-background px-1 py-0.5 rounded">NOTION_API_KEY</code>. Make sure to share at least one Notion page with the integration.
            </p>
            <a
              href="https://www.notion.so/my-integrations"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
            >
              Create integration <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              placeholder="Search your Notion pages…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") search(query); }}
            />
            <div className="max-h-72 overflow-auto rounded-md border border-border/40">
              {loading ? (
                <div className="flex items-center justify-center py-6 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : pages.length === 0 ? (
                <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No pages found. Share a page with your integration in Notion.
                </p>
              ) : (
                pages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleExport(p.id)}
                    disabled={exporting}
                    className="flex w-full items-center gap-2 border-b border-border/30 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-accent/10 disabled:opacity-50"
                  >
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="flex-1 truncate">{p.title}</span>
                    {exporting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}