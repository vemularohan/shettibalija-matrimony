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
    <div className="min-h-[calc(100vh-16rem)] px-4 py-8 bg-muted/30">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center space-y-2 flex flex-col items-center">
          <ShettibalijaLogo size="lg" linkToHome priority />
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D9A514]">
              {SITE_NAME_TE}
            </p>
            <h1 className="font-serif text-3xl font-bold text-[#32105F] md:text-4xl">
              Create Your Matrimonial Profile
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Join verified Shettibalija families seeking marriage alliances with complete details
              in Telugu and English.
            </p>
          </div>
        </div>

        {errorMessage ? (
          <div
            className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center text-sm text-emerald-800 space-y-3">
            <p className="font-medium text-base">{successMessage}</p>
            <Button asChild variant="outline">
              <Link to="/login">Proceed to Login</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account Login Credentials Card */}
            <Card className="bg-white border-[#E8E2D8] shadow-sm rounded-2xl">
              <CardHeader className="pb-3 border-b border-[#D9A514]/20 mb-4">
                <CardTitle className="text-lg font-serif font-bold text-[#32105F]">
                  Account Credentials (Login Info)
                </CardTitle>
                <CardDescription>
                  Your email and password to access and update your matrimony account
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
