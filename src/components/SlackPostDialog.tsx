import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Hash, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Channel { id: string; name: string; is_private: boolean }

interface Props {
  projectId: string;
  projectTitle: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export default function SlackPostDialog({ projectId, projectTitle, open, onOpenChange }: Props) {
  const { toast } = useToast();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    supabase.functions.invoke("list-slack-channels").then(({ data, error }) => {
      setLoading(false);
      if (error || !data?.channels) {
        toast({ variant: "destructive", title: "Couldn't load Slack channels", description: error?.message || data?.error });
        return;
      }
      setChannels(data.channels);
    });
  }, [open, toast]);

  const handlePost = async () => {
    if (!selected) return;
    setPosting(true);
    const { data, error } = await supabase.functions.invoke("post-to-slack", {
      body: { projectId, channelId: selected },
    });
    setPosting(false);
    if (error || data?.error) {
      toast({ variant: "destructive", title: "Post failed", description: error?.message || data?.error });
      return;
    }
    toast({ title: "Posted to Slack", description: `Sent "${projectTitle}" to #${channels.find(c => c.id === selected)?.name}` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post to Slack</DialogTitle>
          <DialogDescription>Choose a channel to share <strong>{projectTitle}</strong>.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger>
              <SelectValue placeholder="Select a channel…" />
            </SelectTrigger>
            <SelectContent>
              {channels.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <span className="inline-flex items-center gap-2">
                    {c.is_private ? <Lock className="h-3 w-3" /> : <Hash className="h-3 w-3" />}
                    {c.name}
                  </span>
                </SelectItem>
              ))}
              {channels.length === 0 && (
                <div className="px-2 py-3 text-xs text-muted-foreground">No channels available.</div>
              )}
            </SelectContent>
          </Select>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={posting}>Cancel</Button>
          <Button onClick={handlePost} disabled={!selected || posting}>
            {posting && <Loader2 className="h-4 w-4 animate-spin" />} Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}