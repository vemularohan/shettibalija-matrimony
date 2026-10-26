import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { SITE_NAME, SITE_NAME_TE } from "@/lib/site";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { useLanguage } from "@/lib/i18n";
import heroImage from "@/assets/hero-wedding-telangana.jpg";

export const Route = createFileRoute("/register")({
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    returnTo?: string;
    name?: string;
    mobile?: string;
    gender?: string;
    profileFor?: string;
  } => {
    const res: {
      returnTo?: string;
      name?: string;
      mobile?: string;
      gender?: string;
      profileFor?: string;
    } = {};
    if (typeof search["returnTo"] === "string") res.returnTo = search["returnTo"];
    if (typeof search["name"] === "string") res.name = search["name"];
    if (typeof search["mobile"] === "string") res.mobile = search["mobile"];
    if (typeof search["gender"] === "string") res.gender = search["gender"];
    if (typeof search["profileFor"] === "string") res.profileFor = search["profileFor"];
    return res;
  },
  component: RegisterPage,
  head: () => ({
    meta: [
      { title: `Create Account | ${SITE_NAME}` },
      {
        name: "description",
        content: "Create your free account to begin your Shettibalija matrimonial journey",
      },
    ],
  }),
});

function friendlyAuthError(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("network") || message.includes("fetch")) {
    return "We couldn't connect right now. Please check your internet connection and try again.";
  }
  if (message.includes("already registered") || message.includes("user already exists")) {
    return "An account may already exist with this email address. Try signing in instead.";
  }
  if (message.includes("password")) {
    return "Please choose a stronger password (at least 6 characters).";
  }
  return error instanceof Error ? error.message : "Could not create account. Please try again.";
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

function RegisterPage() {
  const { user, loading } = useAuth();
  const { lang, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const isTelugu = lang === "te";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [awaitingVerificationEmail, setAwaitingVerificationEmail] = useState<string | null>(null);
  const [accountReady, setAccountReady] = useState(false);

  // Preserve lead parameters from homepage quick registration card
  useEffect(() => {
    if (typeof window !== "undefined") {
      const leadData: Record<string, string> = {};
      if (search.name) leadData["fullName"] = search.name;
      if (search.mobile) leadData["contactNumber"] = search.mobile;
      if (search.gender) leadData["gender"] = search.gender === "groom" ? "groom" : "bride";
      if (search.profileFor) leadData["profileFor"] = search.profileFor;

      if (Object.keys(leadData).length > 0) {
        try {
          sessionStorage.setItem("sbm_quick_lead_data", JSON.stringify(leadData));
        } catch {
          // ignore
        }
      }
    }
  }, [search.name, search.mobile, search.gender, search.profileFor]);

  // Handle countdown for resend verification
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // If already logged in, route to onboarding or dashboard
  useEffect(() => {
    if (!loading && user) {
      void supabase
        .from("matrimonial_profiles")
        .select("id, declaration_accepted")
        .eq("owner_id", user.id)
        .maybeSingle()
        .then(({ data: profile }) => {
          if (profile?.id && profile.declaration_accepted) {
            void navigate({ to: "/dashboard" });
          } else {
            void navigate({ to: "/onboarding" });
          }
        });
    }
  }, [user, loading, navigate]);

  async function handleGoogleSignUp() {
    setErrorMessage(null);
    setGoogleSubmitting(true);
    try {
      const returnTo = search.returnTo || "/onboarding";
      const callbackUrl = `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`;

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
            ? "Google సైన్-ఇన్ ప్రస్తుతం సిద్ధంగా లేదు. దయచేసి ఇమెయిల్ ద్వారా ఖాతా సృష్టించండి."
            : "Google sign-up is not yet enabled in Supabase settings. Please register using your email and password.",
        );
      } else {
        const message = friendlyAuthError(error);
        setErrorMessage(message);
      }
      toast.error(errorMessage || "Google sign-up could not be initiated.");
    } finally {
      setGoogleSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    const targetEmail = email.trim();
    if (!targetEmail || !targetEmail.includes("@")) {
      const msg = isTelugu
        ? "సరైన ఇమెయిల్ చిరునామా నమోదు చేయండి."
        : "Please enter a valid email address.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (password.length < 6) {
      const msg = isTelugu
        ? "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి."
        : "Password must be at least 6 characters.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = isTelugu
        ? "పాస్‌వర్డ్‌లు సరిపోలడం లేదు."
        : "Passwords do not match. Please verify.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (!termsAccepted) {
      const msg = isTelugu
        ? "దయచేసి నిబంధనలు మరియు గోప్యతా విధానాన్ని అంగీకరించండి."
        : "Please accept the Terms & Conditions and Privacy Policy.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);

    try {
      const callbackUrl = `${window.location.origin}/auth/callback?returnTo=/onboarding`;

      const { data, error } = await supabase.auth.signUp({
        email: targetEmail,
        password,
        options: {
          emailRedirectTo: callbackUrl,
          data: {
            full_name: search.name || "",
            account_type: search.profileFor === "myself" ? "self" : "parent_guardian",
            gender: search.gender || null,
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        // Authenticated immediately (email confirmation disabled or auto-confirmed)
        toast.success(
          isTelugu ? "మీ ఖాతా విజయవంతంగా సృష్టించబడింది!" : "Account created successfully!",
        );
        setAccountReady(true);
      } else {
        // Email confirmation link was sent
        setAwaitingVerificationEmail(targetEmail);
        setResendCooldown(60);
        toast.info(
          isTelugu
            ? "మీ ఇమెయిల్‌కు ధృవీకరణ లింక్ పంపించాము."
            : "Verification link sent to your email address.",
        );
      }
    } catch (error) {
      const message = friendlyAuthError(error);
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendVerification() {
    if (!awaitingVerificationEmail || resendCooldown > 0) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: awaitingVerificationEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?returnTo=/onboarding`,
        },
      });
      if (error) throw error;
      setResendCooldown(60);
      toast.success(
        isTelugu
          ? "ధృవీకరణ ఇమెయిల్ మళ్లీ పంపబడింది."
          : "Verification link resent. Please check your inbox and spam folder.",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to resend email.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="login-experience">
      <section className="login-experience__visual" aria-label="Shettibalija family community">
        <img src={heroImage} alt="A bride and groom during a traditional Telugu wedding ritual" />
        <div className="login-experience__visual-wash" />
        <div className="login-experience__visual-copy">
          <span className="login-experience__eyebrow">
            <span />
            {isTelugu ? "శెట్టిబలిజ కుటుంబాల కోసం" : "For Shettibalija families"}
          </span>
          <h1>
            {isTelugu ? (
              <>
                మన సంప్రదాయం.
                <br />
                మన గౌరవప్రదమైన బంధం.
              </>
            ) : (
              <>
                Find your life partner
                <br />
                within your community.
              </>
            )}
          </h1>
          <p>
            {isTelugu
              ? "ముందుగా ఉచిత ఖాతా సృష్టించండి. తర్వాత మీ మ్యాట్రిమోనీ ప్రొఫైల్ వివరాలు జోడించండి."
              : "Create your account first. Then tell us about yourself and what you're looking for."}
          </p>
        </div>
        <div className="login-experience__visual-caption">
          <LockKeyhole size={15} strokeWidth={1.8} />
          <span>
            {isTelugu
              ? "గోప్యత మరియు ప్రామాణికత మా ప్రధాన ప్రాధాన్యత"
              : "Privacy and trust at every step of your search"}
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

          {accountReady ? (
            /* Account Created & Authenticated Ready State */
            <div className="mt-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-[#087333]">
                <Sparkles size={28} />
              </div>
              <h2 className="mt-4 font-serif text-3xl font-bold text-[#24103F]">
                {isTelugu ? "మీ ఖాతా సిద్ధమైంది!" : "Your account is ready!"}
              </h2>
              <p className="mt-3 text-[13px] leading-6 text-[#6B6570]">
                {isTelugu
                  ? "ఇప్పుడు మీ మ్యాట్రిమోనీ ప్రొఫైల్‌ను సులభమైన దశల్లో రూపొందిద్దాం."
                  : "Now let's create your matrimonial profile so families can discover and connect with you."}
              </p>
              <div className="mt-8">
                <Link to="/onboarding" className="sbm-button sbm-button--primary w-full">
                  <span>{isTelugu ? "నా ప్రొఫైల్ ప్రారంభించండి" : "Start My Profile"}</span>
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          ) : awaitingVerificationEmail ? (
            /* Email Verification Awaiting State */
            <div className="mt-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-[#D1A329]">
                <Mail size={28} />
              </div>
              <h2 className="mt-4 font-serif text-3xl font-bold text-[#24103F]">
                {isTelugu ? "మీ ఇమెయిల్‌ను తనిఖీ చేయండి" : "Check your email"}
              </h2>
              <p className="mt-3 text-[13px] leading-6 text-[#6B6570]">
                {isTelugu
                  ? "మేము ధృవీకరణ లింక్‌ను పంపించాము:"
                  : "We've sent a verification link to your email address:"}
              </p>
              <p className="mt-1 font-semibold text-[#24103F]">{awaitingVerificationEmail}</p>
              <p className="mt-3 text-[12px] leading-5 text-[#6B6570]">
                {isTelugu
                  ? "ఆ లింక్‌పై క్లిక్ చేసి మీ ఖాతాను ధృవీకరించండి. ఆపై నేరుగా ప్రొఫైల్ ఆన్‌బోర్డింగ్‌కు కొనసాగండి."
                  : "Click the link in the email to verify your account and continue directly into profile onboarding."}
              </p>

              <div className="mt-7 flex flex-col gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleResendVerification()}
                  disabled={resending || resendCooldown > 0}
                  className="w-full"
                >
                  <RefreshCw size={15} className={resending ? "animate-spin" : ""} />
                  {resendCooldown > 0
                    ? `${isTelugu ? "మళ్లీ పంపడానికి వేచి ఉండండి" : "Resend in"} (${resendCooldown}s)`
                    : isTelugu
                      ? "ధృవీకరణ ఇమెయిల్ మళ్లీ పంపండి"
                      : "Resend verification email"}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setAwaitingVerificationEmail(null);
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-[12px] font-semibold text-[#087333] hover:underline"
                >
                  {isTelugu ? "వేరొక ఇమెయిల్ ఉపయోగించండి" : "Use a different email"}
                </button>
              </div>

              <div className="mt-6 border-t border-[#ded5c8] pt-4 text-center">
                <Link to="/login" className="text-[12px] text-[#6B6570] hover:text-[#24103F]">
                  {isTelugu ? "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి" : "Already verified? Sign in"}
                </Link>
              </div>
            </div>
          ) : (
            /* Standard Registration Form */
            <>
              <p className="login-experience__kicker">
                {isTelugu ? "ఉచిత నమోదు" : "Free registration"}
              </p>
              <h2>{isTelugu ? "ఖాతాను సృష్టించండి" : "Begin your journey"}</h2>
              <p className="login-experience__intro">
                {isTelugu
                  ? "ముందుగా మీ ఖాతా సృష్టించండి. తర్వాతి దశలో మీ మ్యాట్రిమోనీ ప్రొఫైల్ వివరాలను నమోదు చేయవచ్చు."
                  : "Create your account first. We'll help you build your matrimonial profile next."}
              </p>

              {errorMessage ? (
                <div className="login-experience__error" role="alert">
                  {errorMessage}
                </div>
              ) : null}

              {/* Option A — Continue with Google */}
              <button
                type="button"
                onClick={() => void handleGoogleSignUp()}
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
                  <Label htmlFor="register-email">
                    {isTelugu ? "ఇమెయిల్ చిరునామా" : "Email address"}
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={isTelugu ? "మీ ఇమెయిల్ నమోదు చేయండి" : "name@example.com"}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={submitting || googleSubmitting}
                  />
                </div>

                <div className="login-experience__field">
                  <Label htmlFor="register-password">{isTelugu ? "పాస్‌వర్డ్" : "Password"}</Label>
                  <div className="login-experience__password">
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      placeholder={isTelugu ? "కనీసం 6 అక్షరాలు" : "At least 6 characters"}
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

                <div className="login-experience__field">
                  <Label htmlFor="register-confirm-password">
                    {isTelugu ? "పాస్‌వర్డ్ నిర్ధారించండి" : "Confirm Password"}
                  </Label>
                  <Input
                    id="register-confirm-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={submitting || googleSubmitting}
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1 text-[12px] leading-5 text-[#6B6570]">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[#ded5c8] text-[#24103F] focus:ring-[#24103F]"
                    required
                  />
                  <label htmlFor="terms-checkbox">
                    {isTelugu ? (
                      <>
                        నేను{" "}
                        <Link to="/terms" className="text-[#087333] hover:underline">
                          నిబంధనలు
                        </Link>{" "}
                        మరియు{" "}
                        <Link to="/privacy" className="text-[#087333] hover:underline">
                          గోప్యతా విధానాన్ని
                        </Link>{" "}
                        అంగీకరిస్తున్నాను.
                      </>
                    ) : (
                      <>
                        I agree to the{" "}
                        <Link to="/terms" className="text-[#087333] hover:underline">
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-[#087333] hover:underline">
                          Privacy Policy
                        </Link>
                        .
                      </>
                    )}
                  </label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="login-experience__submit mt-2"
                  disabled={submitting || googleSubmitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      <span>{isTelugu ? "ఖాతా సృష్టిస్తున్నాము..." : "Creating account..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{isTelugu ? "ఉచిత ఖాతా సృష్టించండి" : "Create Free Account"}</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </Button>
              </form>

              <div className="login-experience__divider">
                <span>{isTelugu ? "ఇప్పటికే ఖాతా ఉందా?" : "already have an account?"}</span>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  search={search.returnTo ? { returnTo: search.returnTo } : {}}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#087333] hover:underline"
                >
                  <span>{isTelugu ? "ఇక్కడ సైన్ ఇన్ చేయండి" : "Sign in here"}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              <p className="login-experience__privacy mt-6">
                <LockKeyhole size={14} />
                {isTelugu
                  ? "మీ వివరాలు మా వద్ద సురక్షితం. మీ అనుమతి లేకుండా ఎలాంటి సమాచారం బహిర్గతం చేయబడదు."
                  : "Your privacy is protected. Contact details are never displayed publicly without your consent."}
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
