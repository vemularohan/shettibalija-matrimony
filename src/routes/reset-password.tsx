import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [{ title: `Reset Password | ${SITE_NAME}` }],
  }),
});

export function ResetPasswordPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isTe = lang === "te";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if recovery session is active
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setHasValidSession(Boolean(session));
      setIsReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasValidSession(true);
      }
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      const msg = isTe
        ? "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి."
        : "Password must be at least 6 characters.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = isTe ? "పాస్‌వర్డ్‌లు సరిపోలడం లేదు." : "Passwords do not match. Please verify.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccess(true);
      toast.success(
        isTe ? "పాస్‌వర్డ్ విజయవంతంగా నవీకరించబడింది!" : "Password updated successfully!",
      );
      setTimeout(() => {
        void navigate({ to: "/dashboard" });
      }, 2000);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Could not update password. Please try again.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-[#FAF8F3] px-4 py-16">
      <div className="w-full max-w-md border border-[#ded5c8] bg-white p-7 shadow-sm sm:p-9">
        <div className="text-center">
          <ShettibalijaLogo size="md" linkToHome />
          <h1 className="mt-5 font-serif text-2xl font-bold text-[#24103F]">
            {isTe ? "కొత్త పాస్‌వర్డ్ సెట్ చేయండి" : "Set New Password"}
          </h1>
          <p className="mt-2 text-[12px] leading-6 text-[#6B6570]">
            {isTe
              ? "మీ ఖాతా రక్షణ కోసం బలమైన పాస్‌వర్డ్‌ను ఎంచుకోండి."
              : "Choose a secure password of at least 6 characters for your account."}
          </p>
        </div>

        {success ? (
          <div className="mt-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[#087333]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="mt-4 font-semibold text-[#24103F]">
              {isTe ? "పాస్‌వర్డ్ నవీకరించబడింది!" : "Password successfully updated!"}
            </p>
            <p className="mt-2 text-[12px] text-[#6B6570]">
              {isTe ? "డ్యాష్‌బోర్డ్‌కు మళ్లిస్తున్నాము..." : "Redirecting you to your account..."}
            </p>
          </div>
        ) : isReady && !hasValidSession ? (
          <div className="mt-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="mt-4 font-semibold text-[#24103F]">
              {isTe ? "రీసెట్ లింక్ గడువు ముగిసింది" : "Password Reset Link Expired"}
            </p>
            <p className="mt-2 text-[12px] leading-6 text-[#6B6570]">
              {isTe
                ? "ఈ రీసెట్ లింక్ చెల్లదు లేదా గడువు ముగిసింది. దయచేసి లాగిన్ పేజీ నుండి కొత్త లింక్ కోసం అభ్యర్థించండి."
                : "This password reset link is invalid or has expired. Please request a new link from the login page."}
            </p>
            <div className="mt-6">
              <Link to="/login" className="sbm-button sbm-button--primary w-full">
                {isTe ? "లాగిన్ పేజీకి వెళ్లండి" : "Go to Sign In"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            {errorMessage ? (
              <div className="rounded border border-red-200 bg-red-50 p-3 text-[12px] text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <div>
              <Label htmlFor="new-password">{isTe ? "కొత్త పాస్‌వర్డ్" : "New Password"}</Label>
              <div className="relative mt-1.5">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6570] hover:text-[#24103F]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password">
                {isTe ? "పాస్‌వర్డ్ నిర్ధారించండి" : "Confirm Password"}
              </Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className="mt-1.5"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="sbm-button sbm-button--primary mt-2 w-full"
            >
              {submitting
                ? isTe
                  ? "నవీకరిస్తున్నాము..."
                  : "Updating password..."
                : isTe
                  ? "పాస్‌వర్డ్ సేవ్ చేయండి"
                  : "Save New Password"}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-[12px] font-semibold text-[#087333] hover:underline"
              >
                {isTe ? "లాగిన్‌కు తిరిగి వెళ్లండి" : "Back to Sign In"}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
