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
  const [phone, setPhone] = useState("");
  const [accountMethod, setAccountMethod] = useState<"email" | "phone">("email");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
        gender: qGender === "groom" || qGender === "bride" ? qGender : prev.gender,
      }));
    }
  }, []);

  async function handleProfileSubmit(formData: DetailedProfileFormData) {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (
      (accountMethod === "email" && (!email.trim() || !email.includes("@"))) ||
      (accountMethod === "phone" && !phone.trim())
    ) {
      const msg =
        accountMethod === "email"
          ? "Please enter a valid email address."
          : "Please enter a valid phone number with country code.";
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

    if (password !== confirmPassword) {
      const msg = "Passwords do not match.";
      setErrorMessage(msg);
      toast.error(msg);
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
      const { data: authData, error: authError } = await supabase.auth.signUp(
        accountMethod === "email"
          ? {
              email: email.trim(),
              password,
              options: {
                data: {
                  full_name: formData.fullName.trim(),
                  phone: formData.contactNumber.trim(),
                  gender: formData.gender,
                  created_for: formData.createdFor,
                  account_type: formData.createdFor === "self" ? "self" : "parent_guardian",
                },
              },
            }
          : {
              phone: phone.trim(),
              password,
              options: {
                data: {
                  full_name: formData.fullName.trim(),
                  phone: formData.contactNumber.trim(),
                  gender: formData.gender,
                  created_for: formData.createdFor,
                  account_type: formData.createdFor === "self" ? "self" : "parent_guardian",
                },
              },
            },
      );

      if (authError) throw authError;

      const newUser = authData.user;
      if (!newUser) {
        throw new Error("Registration failed to create an account.");
      }

      // If user session was immediately established, save full 10 sections into Supabase
      if (authData.session) {
        const savedProfile = await saveDetailedMatrimonialProfile({
          userId: newUser.id,
          formData,
        });
        toast.success(
          savedProfile.profileCode
            ? `Profile submitted for review. Your Matrimony ID is ${savedProfile.profileCode}.`
            : "Profile submitted for review.",
        );

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
    <div className="registration-stage">
      <header className="registration-stage-head">
        <div className="registration-shell">
          <div className="registration-topline">
            <Link to="/" className="registration-brand">
              <ShettibalijaLogo size="sm" priority />
              <span>
                <strong>{SITE_NAME}</strong>
                <small lang="te">{SITE_NAME_TE}</small>
              </span>
            </Link>
            <p>
              Already a member? <Link to="/login">Sign in</Link>
            </p>
          </div>
          <div className="registration-heading">
            <div>
              <p className="site-kicker">Create your profile</p>
              <h1>Start an introduction your family can feel good about.</h1>
            </div>
            <p>
              Build your profile in short, guided steps. You can save a local draft while you
              complete the details needed for community review.
            </p>
          </div>
          <ol className="registration-route" aria-label="Profile creation progress">
            <li className="is-current">
              <span>01</span>Account access
            </li>
            <li>
              <span>02</span>Profile details
            </li>
            <li>
              <span>03</span>Review &amp; submit
            </li>
          </ol>
        </div>
      </header>

      <div className="registration-shell registration-content">
        {errorMessage ? (
          <div className="registration-alert" role="alert">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="registration-success">
            <p>{successMessage}</p>
            <p>Please verify your email address to log in and manage your matrimony profile.</p>
            <div className="pt-2">
              <Button asChild size="lg" className="registration-success-action">
                <Link to="/login">Proceed to Login</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="registration-flow">
            {/* Account Login Credentials Card */}
            <Card className="registration-account-card">
              <CardHeader className="registration-account-heading">
                <p className="site-kicker">Step 1 of 3</p>
                <CardTitle>Create your secure account</CardTitle>
                <CardDescription>
                  Use this email address or mobile number to return and manage the profile you
                  create.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="registration-methods">
                  {(["email", "phone"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={accountMethod === option ? "is-selected" : ""}
                      onClick={() => setAccountMethod(option)}
                    >
                      Register with {option}
                    </button>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email">
                      {accountMethod === "email" ? "Email Address *" : "Phone Number *"}
                    </Label>
                    <Input
                      id="reg-email"
                      type={accountMethod === "email" ? "email" : "tel"}
                      required
                      autoComplete={accountMethod === "email" ? "email" : "tel"}
                      placeholder={
                        accountMethod === "email" ? "e.g. name@example.com" : "+91 98765 43210"
                      }
                      value={accountMethod === "email" ? email : phone}
                      onChange={(e) =>
                        accountMethod === "email"
                          ? setEmail(e.target.value)
                          : setPhone(e.target.value)
                      }
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
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-confirm-password">Confirm Password *</Label>
                    <Input
                      id="reg-confirm-password"
                      type="password"
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 10-Section Matrimonial Biodata Form */}
            <div className="registration-profile-steps">
              <DetailedProfileForm
                initialData={initialData}
                onSave={handleProfileSubmit}
                isSubmitting={submitting}
                submitButtonText="Register & Create Profile"
              />
            </div>

            <div className="registration-sign-in-note">
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
