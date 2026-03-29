import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { importKey, decrypt } from "@/lib/crypto";
import { Search, AlertTriangle, Lock } from "lucide-react";

const SharedSpec = () => {
  const { token } = useParams();
  const [spec, setSpec] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const keyB64 = window.location.hash.slice(1);
        if (!keyB64) {
          setError("Invalid share link — missing decryption key.");
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("shared_specs")
          .select("encrypted_spec, encryption_iv, expires_at")
          .eq("share_token", token)
          .maybeSingle();

        if (fetchError || !data) {
          setError("Link not found or has been revoked.");
          setLoading(false);
          return;
        }

        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          setError("This share link has expired.");
          setLoading(false);
          return;
        }

        const key = await importKey(keyB64);
        const plaintext = await decrypt(data.encrypted_spec, data.encryption_iv, key);
        setSpec(plaintext);
      } catch {
        setError("Failed to decrypt. The link may be invalid or corrupted.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-3 text-center">
          <Lock className="mx-auto h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">Decrypting spec…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-sm space-y-4 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="text-xl font-bold">Cannot Access Spec</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50">
        <div className="mx-auto flex h-12 max-w-4xl items-center gap-2 px-6">
          <Search className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">SpecMirror</span>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">Shared</span>
        </div>
      </nav>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">{spec}</pre>
      </main>
    </div>
  );
};

export default SharedSpec;
