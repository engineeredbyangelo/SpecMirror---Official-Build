import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Share2, Copy, Check, Trash2, Loader2, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { generateKey, exportKey, encrypt, generateToken } from "@/lib/crypto";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  projectId: string;
  specContent: string;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

interface ShareLink {
  id: string;
  share_token: string;
  expires_at: string | null;
  created_at: string;
}

const ShareDialog = ({ projectId, specContent, defaultOpen, onOpenChange, children }: ShareDialogProps) => {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const [shares, setShares] = useState<ShareLink[]>([]);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [expiry, setExpiry] = useState("never");
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchShares = async () => {
    const { data } = await supabase
      .from("shared_specs")
      .select("id, share_token, expires_at, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    if (data) setShares(data);
  };

  useEffect(() => {
    if (open) {
      fetchShares();
      setGeneratedUrl(null);
    }
  }, [open]);

  const handleCreate = async () => {
    if (!user || !specContent.trim()) return;
    setCreating(true);
    try {
      const key = await generateKey();
      const keyB64 = await exportKey(key);
      const { ciphertext, iv } = await encrypt(specContent, key);
      const token = generateToken();

      const expiresAt = expiry === "never" ? null
        : expiry === "1h" ? new Date(Date.now() + 3600000).toISOString()
        : expiry === "24h" ? new Date(Date.now() + 86400000).toISOString()
        : new Date(Date.now() + 604800000).toISOString();

      const { error } = await supabase.from("shared_specs").insert({
        project_id: projectId,
        shared_by: user.id,
        share_token: token,
        encrypted_spec: ciphertext,
        encryption_iv: iv,
        expires_at: expiresAt,
      });

      if (error) throw error;

      const url = `${window.location.origin}/shared/${token}#${keyB64}`;
      setGeneratedUrl(url);
      await navigator.clipboard.writeText(url);
      toast({ title: "Link created & copied!" });
      fetchShares();
    } catch {
      toast({ variant: "destructive", title: "Failed to create share link" });
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    await supabase.from("shared_specs").delete().eq("id", id);
    setShares((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Share link revoked" });
  };

  const handleCopy = async (token: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/shared/${token}`);
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Link copied (without encryption key)", description: "The original creator URL with the key is needed for decryption." });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); onOpenChange?.(v); }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2" disabled={!specContent.trim()}>
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-primary" />
            Share Spec
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Select value={expiry} onValueChange={setExpiry}>
                <SelectTrigger className="w-32 border-border/50 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">No expiry</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="24h">24 hours</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleCreate} disabled={creating} className="flex-1 gap-2">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                Create Share Link
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Specs are encrypted client-side. The decryption key is in the URL — the server never sees plaintext.
            </p>
          </div>

          {generatedUrl && (
            <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
              <p className="mb-2 text-xs font-medium text-accent">Link created — copied to clipboard!</p>
              <code className="block break-all text-xs text-muted-foreground">{generatedUrl}</code>
            </div>
          )}

          {shares.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Active Links</p>
              {shares.map((share) => (
                <div key={share.id} className="flex items-center justify-between rounded-lg border border-border/30 bg-background/30 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <code className="block truncate text-xs text-muted-foreground">…/{share.share_token.slice(0, 12)}…</code>
                    <span className="text-[10px] text-muted-foreground/60">
                      {share.expires_at ? `Expires ${new Date(share.expires_at).toLocaleDateString()}` : "No expiry"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleCopy(share.share_token)}>
                      {copiedId === share.share_token ? <Check className="h-3 w-3 text-accent" /> : <Copy className="h-3 w-3" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleRevoke(share.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
