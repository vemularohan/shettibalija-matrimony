import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { SITE_NAME, SITE_NAME_TE } from "@/lib/site";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { useLanguage } from "@/lib/i18n";
import heroImage from "@/assets/login-wedding-telangana.jpg";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { returnTo?: string } => {
    const returnTo = search["returnTo"];
    return typeof returnTo === "string" ? { returnTo } : {};
  },
  component: LoginPage,
  head: () => ({
    meta: [
      { title: `Login | ${SITE_NAME}` },
      { name: "description", content: "Sign in to your Shettibalija Matrimony account" },
    ],
  }),
});

function friendlyAuthError(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("network") || message.includes("fetch")) {
    return "We couldn't connect right now. Please check your internet connection and try again.";
  }
  if (message.includes("email not confirmed")) {
    return "Please confirm your email address before signing in. Check your inbox for the confirmation link.";
  }
  if (message.includes("invalid login credentials") || message.includes("invalid credentials")) {
    return "Email or password is incorrect. Please verify your details.";
  }
  return "Those login details don't look right. Please check your email and password and try again.";
}

function getReturnPath(): string {
  if (typeof window === "undefined") return "/dashboard";
  const returnTo = new URLSearchParams(window.location.search).get("returnTo");
  if (!returnTo?.startsWith("/") || returnTo.startsWith("//")) return "/dashboard";

  try {
    const destination = new URL(returnTo, window.location.origin);
    if (
      destination.pathname === "/login" ||
      destination.pathname === "/register" ||
      destination.pathname.startsWith("/auth/callback")
    ) {
      return "/dashboard";
    }
  } catch {
    return "/dashboard";
  }

  return returnTo;
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function LoginPage() {
  const { user, loading } = useAuth();
  const { lang, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isTelugu = lang === "te";

  async function routeUserAfterAuth(userId: string) {
    try {
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      if (isAdmin === true) {
        void navigate({ to: "/admin" });
        return;
      }

      const { data: profile } = await supabase
        .from("matrimonial_profiles")
        .select("id, declaration_accepted")
        .eq("owner_id", userId)
        .maybeSingle();

      if (profile?.id && profile.declaration_accepted) {
        void navigate({ to: getReturnPath() });
      } else {
        void navigate({ to: "/onboarding" });
      }
    } catch {
      void navigate({ to: getReturnPath() });
    }
  }

  useEffect(() => {
    if (!loading && user) {
      void routeUserAfterAuth(user.id);
    }
  }, [user, loading]);

  async function handleGoogleSignIn() {
    setErrorMessage(null);
    setGoogleSubmitting(true);
    try {
      const returnTo = getReturnPath();
      const callbackUrl = `${window.location.origin}/auth/callback${
        returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""
      }`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      });

      if (error) throw error;
    } catch (error) {
      const raw = error instanceof Error ? error.message : "";
      if (
        raw.toLowerCase().includes("not enabled") ||
        raw.toLowerCase().includes("validation_failed")
      ) {
        setErrorMessage(
          isTelugu
            ? "Google సైన్-ఇన్ ప్రస్తుతం సిద్ధంగా లేదు. దయచేసి ఇమెయిల్ ద్వారా సైన్ ఇన్ చేయండి."
            : "Google sign-in is not yet enabled in Supabase. Please sign in using your email and password.",
        );
      } else {
        const message = friendlyAuthError(error);
        setErrorMessage(message);
      }
      toast.error(errorMessage || "Google sign-in could not be initiated.");
    } finally {
      setGoogleSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      toast.success(isTelugu ? "తిరిగి స్వాగతం!" : "Welcome back!");
      if (authData.user) {
        await routeUserAfterAuth(authData.user.id);
      } else {
        void navigate({ to: getReturnPath() });
      }
    } catch (error) {
      const message = friendlyAuthError(error);
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasswordReset() {
    const address = email.trim();
    if (!address) {
      setErrorMessage(
        isTelugu
          ? "పాస్‌వర్డ్ రీసెట్ లింక్ కోసం ముందుగా మీ ఇమెయిల్ నమోదు చేయండి."
          : "Enter your email address first to receive a password reset link.",
      );
      return;
    }

    setErrorMessage(null);
    setResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(address, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success(
        isTelugu
          ? "మీ ఇమెయిల్‌ను తనిఖీ చేయండి — రీసెట్ లింక్ పంపించాం."
          : "Check your email — we sent a password reset link.",
      );
    } catch (error) {
      const message = friendlyAuthError(error);
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setResetting(false);
    }
  }

  const returnParam = getReturnPath();
  const registerSearch =
    returnParam && returnParam !== "/dashboard" ? { returnTo: returnParam } : {};

  return (
    <div className="login-experience">
      <section className="login-experience__visual" aria-label="Shettibalija family community">
        <img src={heroImage} alt="A bride and groom during a Telangana Hindu wedding ritual" />
        <div className="login-experience__visual-wash" />
        <div className="login-experience__visual-copy">
          <span className="login-experience__eyebrow">
            <span />
            {isTelugu ? "శెట్టిబలిజ కుటుంబాల కోసం" : "For Shettibalija families"}
          </span>
          <h1>
            {isTelugu ? (
              <>
                మన సమాజం కోసం.
                <br />
                మన విలువలతో.
              </>
            ) : (
              <>
                Meaningful matches.
                <br />
                Rooted in community.
              </>
            )}
          </h1>
          <p>
            {isTelugu
              ? "మీ జీవిత భాగస్వామి కోసం గౌరవప్రదమైన పరిచయాలు."
              : "A private matrimonial space for introductions shaped by family, values and trust."}
          </p>
        </div>
        <div className="login-experience__visual-caption">
          <LockKeyhole size={15} strokeWidth={1.8} />
          <span>
            {isTelugu ? "మీ వివరాలు మీ నియంత్రణలోనే ఉంటాయి" : "Your details stay in your control"}
          </span>
        </div>
      </section>

      <section className="login-experience__panel">
        <div className="login-experience__panel-top">
          <div className="login-experience__language" aria-label="Language selector">
            <button
              type="button"
              className={lang === "en" ? "is-active" : ""}
              onClick={() => setLanguage("en")}
            >
              English
            </button>
            <span>|</span>
            <button
              type="button"
              className={lang === "te" ? "is-active" : ""}
              onClick={() => setLanguage("te")}
            >
              తెలుగు
            </button>
          </div>
        </div>

        <div className="login-experience__form-wrap">
          <ShettibalijaLogo size="md" linkToHome priority />
          <p className="login-experience__brand">{isTelugu ? SITE_NAME_TE : SITE_NAME}</p>
          <p className="login-experience__kicker">
            {isTelugu ? "సభ్యుల ప్రవేశం" : "Member access"}
          </p>
          <h2>{isTelugu ? "తిరిగి స్వాగతం" : "Welcome back"}</h2>
          <p className="login-experience__intro">
            {isTelugu
              ? "మీ వివాహ పరిచయ ప్రయాణాన్ని కొనసాగించడానికి సైన్ ఇన్ చేయండి."
              : "Sign in to continue your matrimonial journey."}
          </p>

          {errorMessage ? (
            <div className="login-experience__error" role="alert">
              {errorMessage}
            </div>
          ) : null}

          {/* Option A — Continue with Google */}
          <button
            type="button"
            onClick={() => void handleGoogleSignIn()}
            disabled={googleSubmitting || submitting}
            className="login-experience__google-btn mt-5"
          >
            {googleSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin text-[#24103F]" />
                <span>{isTelugu ? "కనెక్ట్ అవుతోంది..." : "Connecting to Google..."}</span>
              </>
            ) : (
              <>
                <GoogleIcon />
                <span>{isTelugu ? "Google తో కొనసాగండి" : "Continue with Google"}</span>
              </>
            )}
          </button>

          <div className="login-experience__divider">
            <span>{isTelugu ? "లేదా ఇమెయిల్‌తో" : "or with email"}</span>
          </div>

          <form onSubmit={handleSubmit} className="login-experience__form">
            <div className="login-experience__field">
              <Label htmlFor="login-email">{isTelugu ? "ఇమెయిల్ చిరునామా" : "Email address"}</Label>
              <Input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder={isTelugu ? "మీ ఇమెయిల్ నమోదు చేయండి" : "name@example.com"}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={submitting || resetting || googleSubmitting}
              />
            </div>

            <div className="login-experience__field">
              <div className="login-experience__label-row">
                <Label htmlFor="login-password">{isTelugu ? "పాస్‌వర్డ్" : "Password"}</Label>
                <button
                  type="button"
                  className="login-experience__forgot"
                  onClick={() => void handlePasswordReset()}
                  disabled={submitting || resetting || googleSubmitting}
                >
                  {resetting
                    ? isTelugu
                      ? "పంపుతోంది..."
                      : "Sending..."
                    : isTelugu
                      ? "పాస్‌వర్డ్ మర్చిపోయారా?"
                      : "Forgot password?"}
                </button>
              </div>
              <div className="login-experience__password">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={submitting || googleSubmitting}
                />
                <button
                  type="button"
                  className="login-experience__password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="login-experience__submit"
              disabled={submitting || googleSubmitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>{isTelugu ? "సైన్ ఇన్ అవుతోంది..." : "Signing you in..."}</span>
                </>
              ) : (
                <>
                  <span>{isTelugu ? "సైన్ ఇన్" : "Sign in with Email"}</span>
                  <ArrowRight size={17} />
                </>
              )}
            </Button>
          </form>

          <div className="login-experience__divider">
            <span>{isTelugu ? "ఖాతా లేదా?" : "don't have an account?"}</span>
          </div>

          <div className="login-experience__register">
            <p>
              {isTelugu ? "శెట్టిబలిజ మ్యాట్రిమోనీకి కొత్తవారా?" : "New to Shettibalija Matrimony?"}
            </p>
            <span>
              {isTelugu
                ? "మీ ఖాతాను సృష్టించి, మీ మ్యాట్రిమోనీ ప్రొఫైల్ ప్రారంభించండి."
                : "Create your free account first. Then we'll guide you through your matrimony profile."}
            </span>
            <Link
              to="/register"
              search={registerSearch}
              className="login-experience__register-link"
            >
              {isTelugu ? "ఖాతా సృష్టించండి (ఉచితం)" : "Create Free Account"}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-5 flex items-center justify-center gap-4 text-[12px] text-[#6B6570]">
            <Link to="/help" className="hover:text-[#24103F] hover:underline">
              {isTelugu ? "సహాయం & మద్దతు" : "Help & Support"}
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-[#24103F] hover:underline">
              {isTelugu ? "నిబంధనలు" : "Terms"}
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-[#24103F] hover:underline">
              {isTelugu ? "గోప్యత" : "Privacy"}
            </Link>
          </div>

          <p className="login-experience__privacy">
            <LockKeyhole size={14} />
            {isTelugu
              ? "మీ సంప్రదింపు వివరాలు మీ గోప్యతా సెట్టింగ్‌ల ప్రకారం మాత్రమే పంచబడతాయి."
              : "Your contact details are shared only according to your privacy and connection settings."}
          </p>
        </div>
      </section>
    </div>
  );
}
