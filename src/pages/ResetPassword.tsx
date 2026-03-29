import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Detect recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecoveryMode(true);
    }

    // Also listen for PASWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecoveryMode(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (resetError) {
      setError("Something went wrong. Please try again.");
      toast({ variant: "destructive", title: "Error", description: resetError.message });
    } else {
      setSent(true);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (updateError) {
      setError("Failed to update password. Please try again.");
      toast({ variant: "destructive", title: "Error", description: updateError.message });
    } else {
      setPasswordUpdated(true);
    }
  };

  // Success state after password update
  if (passwordUpdated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-accent" />
          <h1 className="text-2xl font-bold tracking-tight">Password updated</h1>
          <p className="text-sm text-muted-foreground">Your password has been reset successfully.</p>
          <Link to="/login" className="inline-block text-sm text-primary hover:underline">Sign in with your new password</Link>
        </div>
      </div>
    );
  }

  // Recovery mode — set new password
  if (isRecoveryMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-foreground">
              <Search className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">SpecMirror</span>
            </Link>
            <h1 className="mt-6 text-2xl font-bold tracking-tight">Set new password</h1>
            <p className="mt-2 text-sm text-muted-foreground">Enter your new password below</p>
          </div>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading} />
              {newPassword.length > 0 && newPassword.length < 8 && (
                <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Success state after sending reset email
  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-accent" />
          <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent a reset link to <span className="font-medium text-foreground">{email}</span>.
          </p>
          <Link to="/login" className="inline-block text-sm text-primary hover:underline">Back to sign in</Link>
        </div>
      </div>
    );
  }

  // Default — request reset link
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-foreground">
            <Search className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">SpecMirror</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Reset password</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your email and we'll send you a reset link</p>
        </div>
        <form onSubmit={handleRequestReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
