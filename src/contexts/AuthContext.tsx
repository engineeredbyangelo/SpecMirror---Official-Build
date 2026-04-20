import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type TierName = "free" | "basic" | "pro";

export const STRIPE_TIERS = {
  free: {
    name: "Free",
    price_id: null,
    product_id: null,
    monthly_limit: 6,
  },
  basic: {
    name: "Basic",
    price_id: "price_1TONGeL7RIZffIVhQzocYq38",
    product_id: "prod_UN7V4fhqmvvcHg",
    monthly_limit: 16,
  },
  pro: {
    name: "Pro",
    price_id: "price_1TONI5L7RIZffIVhOJwwa2Wx",
    product_id: "prod_UN7XkwywSGR7f6",
    monthly_limit: 30,
  },
} as const;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscribed: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
  signOut: () => Promise<void>;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  subscribed: false,
  subscriptionTier: null,
  subscriptionEnd: null,
  signOut: async () => {},
  checkSubscription: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      setSubscribed(data?.subscribed ?? false);
      // Map product_id to tier name
      if (data?.product_id === STRIPE_TIERS.pro.product_id) {
        setSubscriptionTier("pro");
      } else if (data?.product_id === STRIPE_TIERS.basic.product_id) {
        setSubscriptionTier("basic");
      } else {
        setSubscriptionTier(null);
      }
      setSubscriptionEnd(data?.subscription_end ?? null);
    } catch {
      setSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) {
          setTimeout(() => checkSubscription(), 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        checkSubscription();
      }
    });

    return () => subscription.unsubscribe();
  }, [checkSubscription]);

  // Periodic refresh every 60s
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(checkSubscription, 60_000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSubscribed(false);
    setSubscriptionTier(null);
    setSubscriptionEnd(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, subscribed, subscriptionTier, subscriptionEnd, signOut, checkSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};
