import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/auth/callback")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { returnTo?: string; error?: string; error_description?: string; code?: string } => {
    const res: {
      returnTo?: string;
      error?: string;
      error_description?: string;
      code?: string;
    } = {};
    if (typeof search["returnTo"] === "string") res.returnTo = search["returnTo"];
    if (typeof search["error"] === "string") res.error = search["error"];
    if (typeof search["error_description"] === "string")
      res.error_description = search["error_description"];
    // PKCE flow: Supabase appends ?code=... to the redirectTo URL
    if (typeof search["code"] === "string") res.code = search["code"];
    return res;
  },
  component: AuthCallbackPage,
  head: () => ({
    meta: [{ title: `Signing In | ${SITE_NAME}` }],
  }),
});

function sanitizeReturnTo(raw: string | undefined): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  if (raw === "/login" || raw === "/register" || raw.startsWith("/auth/callback")) {
    return null;
  }
  return raw;
}

function AuthCallbackPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    return search.error_description || search.error || null;
  });
  const [statusText, setStatusText] = useState(
    lang === "te" ? "ధృవీకరిస్తున్నాము..." : "Completing sign in...",
  );

  useEffect(() => {
    if (search.error || search.error_description) {
      setErrorMessage(
        search.error_description ||
          search.error ||
          "Authentication could not be completed. Please try again.",
      );
      return;
    }

    let isMounted = true;

    async function handleAuthResolution() {
      try {
        let activeUser: import("@supabase/supabase-js").User | null = null;

        // PKCE flow: Supabase appends ?code=<auth_code> to the redirectTo URL.
        // We must explicitly exchange it; getSession() alone won't do it in SSR apps.
        const rawCode =
          search.code ??
          (typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("code")
            : null);

        if (rawCode) {
          setStatusText(lang === "te" ? "ధృవీకరిస్తున్నాము..." : "Completing sign in...");
          const { data, error } = await supabase.auth.exchangeCodeForSession(rawCode);
          if (error) {
            throw error;
          }
          activeUser = data.session?.user ?? null;
        }

        if (!activeUser) {
          // Implicit / hash flow fallback: check if session is already established
          const {
            data: { session },
          } = await supabase.auth.getSession();
          activeUser = session?.user ?? null;
        }

        if (!activeUser) {
          // Last resort: wait briefly for auth listener to pick up session from hash tokens
          const sessionPromise = new Promise<import("@supabase/supabase-js").User | null>(
            (resolve) => {
              const timeout = setTimeout(() => resolve(null), 3500);
              const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
                if (newSession?.user) {
                  clearTimeout(timeout);
                  sub.subscription.unsubscribe();
                  resolve(newSession.user);
                }
              });
            },
          );

          activeUser = await sessionPromise;
        }

        if (!isMounted) return;

        if (!activeUser) {
          setErrorMessage(
            lang === "te"
              ? "సైన్ ఇన్ వివరాలు గుర్తించలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి."
              : "We could not confirm your sign-in. Please try signing in again.",
          );
          return;
        }

        setStatusText(lang === "te" ? "ప్రొఫైల్ పరిశీలిస్తున్నాము..." : "Checking your profile...");

        // Check if admin
        const { data: isAdmin } = await supabase.rpc("has_role", {
          _user_id: activeUser.id,
          _role: "admin",
        });

        if (isAdmin === true) {
          void navigate({ to: "/admin" });
          return;
        }

        // Check if profile exists and whether onboarding is complete
        const { data: profile } = await supabase
          .from("matrimonial_profiles")
          .select("id, declaration_accepted")
          .eq("owner_id", activeUser.id)
          .maybeSingle();

        if (profile?.id && profile.declaration_accepted) {
          // User has completed matrimonial profile
          const target = sanitizeReturnTo(search.returnTo) || "/dashboard";
          window.location.assign(target);
        } else {
          // User needs onboarding
          void navigate({ to: "/onboarding" });
        }
      } catch (err) {
        if (!isMounted) return;
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during sign in. Please try again.",
        );
      }
    }

    void handleAuthResolution();

    return () => {
      isMounted = false;
    };
  }, [search.error, search.error_description, search.returnTo, search.code, lang, navigate]);

  const isTe = lang === "te";

  if (errorMessage) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#FAF8F3] px-4 py-16">
        <div className="w-full max-w-md border border-[#ded5c8] bg-white p-7 text-center shadow-sm sm:p-9">
          <ShettibalijaLogo size="md" linkToHome />
          <div className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-700">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-[#24103F]">
            {isTe ? "సైన్ ఇన్ విఫలమైంది" : "Sign in could not be completed"}
          </h1>
          <p className="mt-3 text-[13px] leading-6 text-[#6B6570]">{errorMessage}</p>
          <div className="mt-7">
            <Link to="/login" className="sbm-button sbm-button--primary w-full">
              {isTe ? "తిరిగి లాగిన్‌కు వెళ్లండి" : "Return to Sign In"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#FAF8F3] px-4 py-16">
      <div className="w-full max-w-md border border-[#ded5c8] bg-white p-8 text-center shadow-sm">
        <ShettibalijaLogo size="md" linkToHome />
        <div className="mx-auto mt-7 flex h-12 w-12 items-center justify-center text-[#D1A329]">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
        <h2 className="mt-4 font-serif text-2xl font-bold text-[#24103F]">
          {isTe ? "స్వాగతం" : "Welcome"}
        </h2>
        <p className="mt-2 text-[13px] text-[#6B6570]">{statusText}</p>
      </div>
    </div>
  );
}
