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
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12 bg-muted/30">
      <Card className="w-full max-w-md shadow-md border border-[#E8E2D8] bg-white rounded-2xl">
        <CardHeader className="text-center space-y-2 items-center pb-4">
          <ShettibalijaLogo size="lg" linkToHome priority />
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D9A514]">
              {SITE_NAME_TE}
            </p>
            <CardTitle className="font-serif text-3xl text-[#32105F]">Member Login</CardTitle>
            <CardDescription>
              Access your matrimony profile, interests, and matching candidates
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {errorMessage ? (
            <div
              className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
              role="alert"
            >
              {errorMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email Address</Label>
              <Input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
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
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </Button>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account yet?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Create Profile
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
