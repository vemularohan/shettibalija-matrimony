import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";
import { SITE_NAME, SITE_NAME_TE } from "@/lib/site";
import { ShettibalijaLogo } from "@/components/brand/logo";

export const Route = createFileRoute("/login")({
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      void navigate({ to: "/dashboard" });
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

      if (error) {
        throw error;
      }

      toast.success("Welcome back!");
      void navigate({ to: "/dashboard" });
    } catch (err) {
      const message = getErrorMessage(err, "Invalid email or password. Please try again.");
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-16 bg-[#FAF9F6] overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-radial from-[#D9A514]/15 to-transparent blur-3xl" />

      <Card className="relative z-10 w-full max-w-md shadow-2xl border border-[#D9A514]/30 bg-white/95 backdrop-blur-md rounded-3xl p-2 sm:p-4">
        <CardHeader className="text-center space-y-3 items-center pb-4">
          <div className="rounded-2xl p-2 bg-[#21083F]/5 border border-[#D9A514]/20 shadow-xs">
            <ShettibalijaLogo size="lg" linkToHome priority />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D9A514]">
              {SITE_NAME_TE}
            </p>
            <CardTitle className="font-serif text-3xl font-bold text-[#21083F]">
              Member Login
            </CardTitle>
            <CardDescription className="text-xs">
              Access your matrimony profile, interests, and matching candidates
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {errorMessage ? (
            <div
              className="mb-4 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
              role="alert"
            >
              {errorMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-xs font-semibold text-[#21083F]">
                Email Address
              </Label>
              <Input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-xs font-semibold text-[#21083F]">
                  Password
                </Label>
              </div>
              <Input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className="h-11 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#21083F] via-[#2d0c54] to-[#351064] text-white font-bold hover:shadow-lg transition-all border border-[#D9A514]/30"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign In to Account"}
            </Button>

            <div className="mt-4 text-center text-sm text-muted-foreground pt-2 border-t border-border/60">
              Don't have an account yet?{" "}
              <Link to="/register" className="font-semibold text-[#087A32] hover:underline">
                Create Your Profile
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
