import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, ArrowRight } from "lucide-react";
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
    return "Please confirm your email address before signing in.";
  }
  return "Those login details don't look right. Please check your email and password and try again.";
}

function getReturnPath(): string {
  if (typeof window === "undefined") return "/dashboard";
  const returnTo = new URLSearchParams(window.location.search).get("returnTo");
  if (!returnTo?.startsWith("/") || returnTo.startsWith("//")) return "/dashboard";

  try {
    const destination = new URL(returnTo, window.location.origin);
    if (destination.pathname === "/login" || destination.pathname === "/register") {
      return "/dashboard";
    }
  } catch {
    return "/dashboard";
  }

  return returnTo;
}

function LoginPage() {
  const { user, loading } = useAuth();
  const { lang, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      void navigate({ to: getReturnPath() });
    }
  }, [user, loading, navigate]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      toast.success(lang === "te" ? "తిరిగి స్వాగతం!" : "Welcome back!");
      void navigate({ to: getReturnPath() });
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
        lang === "te"
          ? "పాస్‌వర్డ్ రీసెట్ లింక్ కోసం ముందుగా మీ ఇమెయిల్ నమోదు చేయండి."
          : "Enter your email address first to receive a password reset link.",
      );
      return;
    }

    setErrorMessage(null);
    setResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(address, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      toast.success(
        lang === "te"
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

  const isTelugu = lang === "te";

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
                disabled={submitting || resetting}
              />
            </div>

            <div className="login-experience__field">
              <div className="login-experience__label-row">
                <Label htmlFor="login-password">{isTelugu ? "పాస్‌వర్డ్" : "Password"}</Label>
                <button
                  type="button"
                  className="login-experience__forgot"
                  onClick={() => void handlePasswordReset()}
                  disabled={submitting || resetting}
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
                  disabled={submitting}
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
              disabled={submitting}
            >
              {submitting
                ? isTelugu
                  ? "సైన్ ఇన్ అవుతోంది..."
                  : "Signing you in..."
                : isTelugu
                  ? "సైన్ ఇన్"
                  : "Sign in"}
              {!submitting ? <ArrowRight size={17} /> : null}
            </Button>
          </form>

          <div className="login-experience__divider">
            <span>{isTelugu ? "లేదా" : "or"}</span>
          </div>

          <div className="login-experience__register">
            <p>
              {isTelugu ? "శెట్టిబలిజ మ్యాట్రిమోనీకి కొత్తవారా?" : "New to Shettibalija Matrimony?"}
            </p>
            <span>
              {isTelugu
                ? "మీ కుటుంబం కోసం ఒక ప్రైవేట్ వివాహ ప్రొఫైల్‌ను ప్రారంభించండి."
                : "Create your matrimonial profile and begin discovering meaningful matches."}
            </span>
            <Link to="/register" className="login-experience__register-link">
              {isTelugu ? "మ్యాట్రిమోనీ ప్రొఫైల్ సృష్టించండి" : "Create Matrimony Profile"}
              <ArrowRight size={16} />
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
