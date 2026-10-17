import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import { DetailedProfileForm } from "@/components/profile/detailed-profile-form";
import {
  type DetailedProfileFormData,
  INITIAL_DETAILED_FORM_DATA,
} from "@/lib/detailed-profile-types";
import { saveDetailedMatrimonialProfile } from "@/lib/detailed-profile-api";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({
    meta: [
      { title: `Register | ${SITE_NAME}` },
      { name: "description", content: "Create your Shettibalija Matrimony profile" },
    ],
  }),
});

function RegisterPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [initialData, setInitialData] = useState<DetailedProfileFormData>(() => ({
    ...INITIAL_DETAILED_FORM_DATA,
  }));

  useEffect(() => {
    if (!loading && user) {
      void navigate({ to: "/dashboard" });
    }
  }, [user, loading, navigate]);

  // Read query parameters from Hero Photo Gallery quick registration card
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const qName = params.get("name");
      const qPhone = params.get("mobile") || params.get("phone");
      const qGender = params.get("gender");

      setInitialData((prev) => ({
        ...prev,
        fullName: qName || prev.fullName,
        contactNumber: qPhone || prev.contactNumber,
        gender: qGender === "groom" ? "groom" : "bride",
      }));
    }
  }, []);

  async function handleProfileSubmit(formData: DetailedProfileFormData) {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !email.includes("@")) {
      const msg = "Please enter a valid email address.";
      setErrorMessage(msg);
      toast.error(msg);
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    if (password.length < 6) {
      const msg = "Password must be at least 6 characters.";
      setErrorMessage(msg);
      toast.error(msg);
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    if (!formData.declarationAccepted) {
      const msg = "You must accept the declaration to submit your profile.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
            phone: formData.contactNumber.trim(),
            gender: formData.gender,
          },
        },
      });

      if (authError) throw authError;

      const newUser = authData.user;
      if (!newUser) {
        throw new Error("Registration failed to create an account.");
      }

      // If user session was immediately established, save full 10 sections into Supabase
      if (authData.session) {
        try {
          await saveDetailedMatrimonialProfile({
            userId: newUser.id,
            formData,
          });
        } catch (saveErr) {
          console.warn("Error saving detailed profile after signup:", saveErr);
        }

        toast.success("Account and matrimonial profile created successfully!");
        void navigate({ to: "/dashboard" });
      } else {
        // Save form draft locally so user has all data when they log in after email confirmation
        try {
          localStorage.setItem("sbm_detailed_profile_draft_v1", JSON.stringify(formData));
        } catch {
          // ignore
        }
        setSuccessMessage(
          "Your account has been registered! Please check your email for a confirmation link to activate your profile.",
        );
        toast.success("Account registered. Please verify your email.");
      }
    } catch (err) {
      const msg = getErrorMessage(err, "Could not create account. Please try again.");
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-16">
      {/* Top Luxury Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#21083F] via-[#2d0c54] to-[#351064] text-white pt-24 pb-14 px-4 border-b border-[#D9A514]/30">
        <div className="mx-auto max-w-4xl text-center space-y-3 flex flex-col items-center">
          <div className="rounded-2xl p-2 bg-black/30 border border-[#D9A514]/30 shadow-md">
            <ShettibalijaLogo size="lg" linkToHome priority theme="dark" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#F4D477]">
              {SITE_NAME_TE}
            </p>
            <h1 className="mt-1 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Create Your Matrimonial Profile
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/80 max-w-xl mx-auto">
              Join verified Shettibalija families seeking marriage alliances with complete details
              in Telugu and English.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {errorMessage ? (
          <div
            className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center text-sm text-emerald-800 space-y-3 shadow-md">
            <p className="font-serif text-2xl font-bold text-emerald-900">{successMessage}</p>
            <p className="text-xs text-emerald-700">
              Please verify your email address to log in and manage your matrimony profile.
            </p>
            <div className="pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-[#087A32] text-white hover:bg-[#045522]"
              >
                <Link to="/login">Proceed to Login</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account Login Credentials Card */}
            <Card className="bg-white border-[#D9A514]/30 shadow-lg rounded-3xl p-2 sm:p-4">
              <CardHeader className="pb-3 border-b border-border/80 mb-4">
                <CardTitle className="text-lg font-serif font-bold text-[#21083F]">
                  Step 0: Account Credentials (Login Info)
                </CardTitle>
                <CardDescription className="text-xs">
                  Your email and password to access and update your matrimony account securely
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email">Email Address *</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="e.g. name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-password">Password (min 6 characters) *</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 10-Section Matrimonial Biodata Form */}
            <DetailedProfileForm
              initialData={initialData}
              onSave={handleProfileSubmit}
              isSubmitting={submitting}
              submitButtonText="Register & Create Profile"
            />

            <div className="text-center text-sm text-muted-foreground pt-2">
              Already registered?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign In to Your Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
