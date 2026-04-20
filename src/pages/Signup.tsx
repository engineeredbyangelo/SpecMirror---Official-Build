import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState<number[]>([]);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval>>();

  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (session) navigate("/dashboard", { replace: true });
  }, [session, navigate]);

  useEffect(() => {
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, []);

  const startCooldown = () => {
    setCooldown(30);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          setFailedAttempts([]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const now = Date.now();
    const recentAttempts = failedAttempts.filter((t) => now - t < 60000);
    if (recentAttempts.length >= 5) {
      startCooldown();
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });
    setLoading(false);

    if (authError) {
      setFailedAttempts((prev) => [...prev, Date.now()]);
      if (authError.message.toLowerCase().includes("already registered")) {
        setError("An account with this email already exists.");
      } else {
        setError("Something went wrong. Please try again.");
        toast({ variant: "destructive", title: "Error", description: authError.message });
      }
    } else {
      setSuccess(true);
    }
  };

  const isDisabled = loading || cooldown > 0;

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-accent" />
          <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>. Click it to activate your account.
          </p>
          <Link to="/login" className="text-sm text-primary hover:underline">Back to sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-foreground">
            <Search className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">SpecMirror</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Start turning briefs into specs</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" type="text" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} disabled={isDisabled} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isDisabled} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isDisabled} />
            {password.length > 0 && password.length < 8 && (
              <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {cooldown > 0 && <p className="text-sm text-muted-foreground">Too many attempts. Try again in {cooldown}s.</p>}
          <Button className="w-full" type="submit" disabled={isDisabled}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
          </Button>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or</span></div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            disabled={isDisabled}
            onClick={async () => {
              await lovable.auth.signInWithOAuth("google", {
                redirect_uri: `${window.location.origin}/dashboard`,
              });
            }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
