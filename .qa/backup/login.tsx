import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, HeartHandshake, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";
import { SITE_NAME, SITE_NAME_TE } from "@/lib/site";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { z } from "zod";
import matrimonyHomeHero from "@/assets/matrimony-home-hero-2026.jpg";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ returnTo: z.string().optional() }),
  component: LoginPage,
  head: () => ({
    meta: [
      { title: `Login | ${SITE_NAME}` },
      { name: "description", content: "Sign in to your Shettibalija Matrimony account" },
    ],
  }),
});

function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { returnTo } = Route.useSearch();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) void navigate({ to: getSafeReturnTo(returnTo) });
  }, [user, loading, navigate, returnTo]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword(
        method === "email" ? { email: email.trim(), password } : { phone: phone.trim(), password },
      );
      if (error) throw error;
      toast.success("Welcome back!");
      void navigate({ to: getSafeReturnTo(returnTo) });
    } catch (err) {
      const message = getErrorMessage(err, "Invalid email or password. Please try again.");
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetPassword() {
    if (method !== "email" || !email.trim()) {
      const message = "Enter your email address to receive a password reset link.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) {
      const message = getErrorMessage(error, "We could not send a reset link. Please try again.");
      setErrorMessage(message);
      toast.error(message);
      return;
    }
    toast.success("Password reset instructions have been sent to your email.");
  }

  return (
    <div className="account-stage">
      <aside className="account-stage-aside">
        <img src={matrimonyHomeHero} alt="A family discussing a matrimonial profile together" />
        <div className="account-stage-aside-shade" aria-hidden="true" />
        <div className="account-stage-aside-content">
          <Link to="/" className="account-stage-brand">
            <ShettibalijaLogo size="sm" priority />
            <span>
              <strong>{SITE_NAME}</strong>
              <small lang="te">{SITE_NAME_TE}</small>
            </span>
          </Link>
          <div className="account-stage-aside-copy">
            <p className="site-kicker">Member portal</p>
            <h1>Continue with the introductions that matter.</h1>
            <p>
              Return to your profile, conversations and carefully selected matches whenever it suits
              your family.
            </p>
          </div>
          <div className="account-stage-assurances">
            <span>
              <ShieldCheck className="h-4 w-4" />
              Private account access
            </span>
            <span>
              <HeartHandshake className="h-4 w-4" />
              Introductions on your terms
            </span>
          </div>
        </div>
      </aside>

      <main className="account-stage-main">
        <div className="account-stage-mobile-brand">
          <Link to="/" className="account-stage-brand">
            <ShettibalijaLogo size="sm" priority />
            <span>
              <strong>{SITE_NAME}</strong>
              <small lang="te">{SITE_NAME_TE}</small>
            </span>
          </Link>
        </div>
        <div className="account-stage-top">
          <Link to="/" className="account-back">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
          <p>
            New here? <Link to="/register">Start a profile</Link>
          </p>
        </div>
        <section className="account-form-wrap" aria-labelledby="login-title">
          <p className="site-kicker">Welcome back</p>
          <h2 id="login-title">Sign in to your member space.</h2>
          <p className="account-form-intro">
            Use the account details you created when starting your matrimonial profile.
          </p>
          {errorMessage ? (
            <div className="account-form-alert" role="alert">
              {errorMessage}
            </div>
          ) : null}
          <form onSubmit={handleSubmit} className="account-form">
            <div className="account-methods" role="tablist" aria-label="Sign in method">
              {(["email", "phone"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={method === option ? "is-selected" : ""}
                  onClick={() => setMethod(option)}
                >
                  {option === "email" ? "Email address" : "Mobile number"}
                </button>
              ))}
            </div>
            <div className="account-field">
              <Label htmlFor="login-email">
                {method === "email" ? "Email address" : "Mobile number"}
              </Label>
              <Input
                id="login-email"
                type={method === "email" ? "email" : "tel"}
                required
                autoComplete={method === "email" ? "email" : "tel"}
                placeholder={method === "email" ? "name@example.com" : "+91 98765 43210"}
                value={method === "email" ? email : phone}
                onChange={(event) =>
                  method === "email" ? setEmail(event.target.value) : setPhone(event.target.value)
                }
                disabled={submitting}
              />
            </div>
            <div className="account-field">
              <div className="account-field-label">
                <Label htmlFor="login-password">Password</Label>
                <button type="button" onClick={() => void handleResetPassword()}>
                  Forgot password?
                </button>
              </div>
              <div className="account-password">
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <label className="account-remember">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(event) => setKeepSignedIn(event.target.checked)}
              />
              Keep me signed in on this device
            </label>
            <Button type="submit" className="account-submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in to my account"}
            </Button>
          </form>
          <div className="account-form-next">
            <p>Creating a profile for yourself or a family member?</p>
            <Link to="/register">Begin a free profile</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function getSafeReturnTo(returnTo?: string) {
  return returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")
    ? (returnTo as "/")
    : "/dashboard";
}
