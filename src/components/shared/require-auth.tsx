import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RequireAuth({ children }: { children: ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}

export function AdminGuard({ children }: { children: ReactNode }) {
  return <AuthGate admin>{children}</AuthGate>;
}

function AuthGate({ children, admin }: { children: ReactNode; admin?: boolean }) {
  const { user, loading, isAdmin, isModerator } = useAuth();
  const { lang } = useLanguage();
  const location = useRouterState({
    select: (state) => state.location,
  });
  const returnTo = `${location.pathname}${location.searchStr}`;
  const loginHref = `/login?returnTo=${encodeURIComponent(returnTo)}`;

  if (loading) {
    return (
      <div className="sbm-page min-h-[70vh] bg-[#FAF8F3]">
        <div className="sbm-container py-16">
          <div className="sbm-skeleton h-4 w-28" />
          <div className="sbm-skeleton mt-5 h-12 w-2/3 max-w-xl" />
          <div className="sbm-skeleton mt-4 h-4 w-1/2 max-w-md" />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
            <div className="sbm-skeleton h-56 w-full" />
            <div className="sbm-skeleton h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user && admin) {
    return <AdminLogin />;
  }

  if (!user) {
    return (
      <div className="sbm-page min-h-[70vh] bg-[#FAF8F3]">
        <div className="sbm-container grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          <div>
            <span className="sbm-kicker">
              {lang === "te" ? "సభ్యులకు మాత్రమే" : "For members only"}
            </span>
            <h1 className="sbm-heading mt-4 max-w-xl">
              {lang === "te"
                ? "అన్వేషణ ప్రైవేట్‌గా ఉండాలి. అందుకే లాగిన్ అవసరం."
                : "Discovery should feel private. That is why this page is protected."}
            </h1>
            <p className="sbm-body mt-5 max-w-lg">
              {lang === "te"
                ? "ప్రొఫైల్స్, ఫోటోలు మరియు సంప్రదింపు వివరాలు నమోదిత సభ్యులకు మాత్రమే. మీ వివరాలు మీ నియంత్రణలో ఉంటాయి."
                : "Profiles, photos and contact details are available to signed-in members only. Your own information stays within the controls you choose."}
            </p>

            <dl className="mt-9 grid gap-5 border-t border-[#ded5c8] pt-6 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-2 text-[12px] font-bold text-[#24103F]">
                  <Lock className="h-3.5 w-3.5 text-[#D1A329]" aria-hidden />
                  {lang === "te" ? "గోప్యత రక్షణ" : "Privacy at the data layer"}
                </dt>
                <dd className="mt-1.5 text-[12px] leading-6 text-[#6B6570]">
                  {lang === "te"
                    ? "సంప్రదింపు వివరాలు మరియు జాతక పత్రాలు బహిరంగంగా కనిపించవు."
                    : "Contact details and horoscope documents are not placed on the open web."}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-[12px] font-bold text-[#24103F]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#087333]" aria-hidden />
                  {lang === "te" ? "సమీక్షించిన ప్రొఫైల్స్" : "Reviewed profiles"}
                </dt>
                <dd className="mt-1.5 text-[12px] leading-6 text-[#6B6570]">
                  {lang === "te"
                    ? "ప్రొఫైల్స్ అన్వేషణలో కనిపించే ముందు నిర్వాహకులు సమీక్షిస్తారు."
                    : "Profiles are reviewed by administrators before they appear in discovery."}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border border-[#ded5c8] bg-white p-6 sm:p-8">
            <ShettibalijaLogo size="md" linkToHome />
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a37d1c]">
              {SITE_NAME}
            </p>
            <h2 className="mt-3 font-serif text-3xl text-[#24103F]">
              {lang === "te" ? "మీ ప్రయాణాన్ని కొనసాగించండి." : "Continue your journey."}
            </h2>
            <p className="mt-3 text-[13px] leading-7 text-[#6B6570]">
              {lang === "te"
                ? "మీ ఖాతాలోకి ప్రవేశించి ప్రొఫైల్స్ చూడండి, ఆసక్తులు పంపండి మరియు షార్ట్‌లిస్ట్ చేయండి."
                : "Sign in to explore profiles, send interest, keep a shortlist and manage your introduction."}
            </p>

            <div className="mt-7 flex flex-col gap-2.5">
              <a href={loginHref} className="sbm-button sbm-button--primary w-full">
                {lang === "te" ? "లాగిన్" : "Login"}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/register" className="sbm-button sbm-button--outline w-full">
                {lang === "te" ? "కొత్త ప్రొఫైల్ సృష్టించండి" : "Create a new profile"}
              </Link>
            </div>

            <p className="mt-5 border-t border-[#e5ddd1] pt-4 text-[11px] leading-5 text-[#6B6570]">
              {lang === "te"
                ? "మీకు ఖాతా లేకపోతే, నమోదు ఉచితం. ప్రొఫైల్ సమీక్ష తర్వాత అన్వేషణలో కనిపిస్తుంది."
                : "Registration is free. A new profile appears in discovery after review."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (admin && !isAdmin && !isModerator) {
    return (
      <div className="sbm-page min-h-[60vh] bg-[#FAF8F3]">
        <div className="sbm-container max-w-xl py-20 text-center">
          <p className="sbm-kicker justify-center">Staff access</p>
          <h1 className="sbm-heading mt-4">Admin access required</h1>
          <p className="sbm-body mt-4">
            Your account does not have staff permission. If you believe this is a mistake, contact
            the community administrators.
          </p>
          <Link to="/dashboard" className="sbm-button sbm-button--primary mt-6">
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
    } catch (error) {
      const message =
        error instanceof Error && error.message.toLowerCase().includes("network")
          ? "We could not connect to the administration service. Please try again."
          : "Those administrator credentials were not accepted.";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="sbm-page flex min-h-[70vh] items-center bg-[#FAF8F3]">
      <div className="sbm-container w-full max-w-lg py-14 sm:py-20">
        <div className="border border-[#ded5c8] bg-white p-6 shadow-sm sm:p-9">
          <ShettibalijaLogo size="md" linkToHome />
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a37d1c]">
            {SITE_NAME} · Administration
          </p>
          <h1 className="sbm-heading mt-3">Administrator sign in</h1>
          <p className="sbm-body mt-3">
            Sign in with an account that has an administrator or moderator role.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-2"
              />
            </div>
            {errorMessage ? (
              <p role="alert" className="text-sm text-red-700">
                {errorMessage}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="sbm-button sbm-button--primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in to administration"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <Link
            to="/"
            className="mt-6 inline-flex text-sm font-semibold text-[#087333] hover:underline"
          >
            Return to member website
          </Link>
        </div>
      </div>
    </div>
  );
}
