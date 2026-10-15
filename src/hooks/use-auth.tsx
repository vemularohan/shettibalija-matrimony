import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type AccountProfile = Tables<"profiles">;

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  account: AccountProfile | null;
  isAdmin: boolean;
  isModerator: boolean;
  loading: boolean;
  refreshAccount: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [account, setAccount] = useState<AccountProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadAccount(userId: string) {
    const [{ data: profile }, adminResult, moderatorResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
      supabase.rpc("has_role", { _user_id: userId, _role: "moderator" }),
    ]);
    setAccount(profile ?? null);
    setIsAdmin(adminResult.data === true);
    setIsModerator(moderatorResult.data === true);
  }

  useEffect(() => {
    let mounted = true;
    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        if (!mounted) return;
        setSession(data.session);
        if (data.session?.user.id) await loadAccount(data.session.user.id);
        setLoading(false);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user.id) {
        void loadAccount(nextSession.user.id);
      } else {
        setAccount(null);
        setIsAdmin(false);
        setIsModerator(false);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      account,
      isAdmin,
      isModerator,
      loading,
      refreshAccount: async () => {
        if (session?.user.id) await loadAccount(session.user.id);
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, account, isAdmin, isModerator, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
