import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";
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
  const { lang } = useLanguage();
  const isTe = lang === "te";
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
        gender: qGender === "groom" ? "groom" : qGender === "bride" ? "bride" : prev.gender,
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
    <div className="min-h-screen bg-[#FAF8F3] pb-16">
      <div className="register-frontdoor">
        <div className="register-frontdoor__inner">
          <div className="register-frontdoor__brand">
            <ShettibalijaLogo size="md" linkToHome priority />
            <span>{SITE_NAME_TE}</span>
          </div>
          <div className="register-frontdoor__copy">
            <p>
              {isTe
                ? "మీ సమాజం. మీ కథ. మీ తదుపరి అధ్యాయం."
                : "Your community. Your story. Your next chapter."}
            </p>
            <h1>
              {isTe ? "మీ మ్యాట్రిమోనీ ప్రొఫైల్ సృష్టించండి" : "Create your matrimonial profile"}
            </h1>
            <p>
              {isTe
                ? "మీ కుటుంబానికి ఆలోచనాత్మకమైన ప్రొఫైల్, మరియు అర్థవంతమైన శెట్టిబలిజ పరిచయాలను మరింత గోప్యంగా ప్రారంభించే మార్గం."
                : "A thoughtful profile for your family, and a more private way to begin meaningful Shettibalija introductions."}
            </p>
            <div className="register-frontdoor__note">
              <span aria-hidden>·</span>
              {isTe
                ? "ఏ దశలోనైనా డ్రాఫ్ట్ సేవ్ చేసి తిరిగి రావచ్చు. సంప్రదింపు వివరాలు డిఫాల్ట్‌గా గోప్యంగా ఉంటాయి."
                : "You can save a draft and return at any step. Contact details stay private by default."}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-7 px-4 py-8 sm:px-6">
        {errorMessage ? (
          <div
            className="border-l-2 border-[#b64e3b] bg-[#fff5f2] px-4 py-3 text-[12px] leading-6 text-[#8c3024]"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="border border-[#087333]/25 bg-[#eef5f0] px-6 py-10 text-center sm:px-10">
            <p className="font-serif text-3xl leading-tight text-[#24103F]">{successMessage}</p>
            <p className="mx-auto mt-3 max-w-md text-[13px] leading-7 text-[#5f5765]">
              {isTe
                ? "మీ మ్యాట్రిమోనీ ప్రొఫైల్‌ను నిర్వహించడానికి దయచేసి మీ ఇమెయిల్ చిరునామాను ధృవీకరించండి."
                : "Please verify your email address to log in and manage your matrimony profile."}
            </p>
            <div className="mt-6">
              <Button
                asChild
                className="rounded-none bg-[#087333] px-6 text-white hover:bg-[#065c29]"
              >
                <Link to="/login" search={{}}>
                  {isTe ? "లాగిన్‌కు కొనసాగండి" : "Proceed to login"}
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-7">
            <section className="sbm-form__account">
              <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-10">
                <div>
                  <span className="sbm-kicker">{isTe ? "ఖాతా" : "Account"}</span>
                  <h2 className="mt-3 font-serif text-3xl text-[#24103F]">
                    {isTe ? "మీ లాగిన్ వివరాలు" : "Your login details"}
                  </h2>
                  <p className="mt-2 max-w-sm text-[12px] leading-6 text-[#6B6570]">
                    {isTe
                      ? "మీ ప్రొఫైల్, ఆసక్తులు మరియు షార్ట్‌లిస్ట్‌కు తిరిగి రావడానికి ఈ ఇమెయిల్ మరియు పాస్‌వర్డ్‌ను ఉపయోగిస్తారు. మేము పబ్లిక్ లాగిన్ సృష్టించము."
                      : "You will use this email and password to return to your profile, interests and shortlist. We do not create a public login."}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email">
                      {isTe ? "ఇమెయిల్ చిరునామా *" : "Email address *"}
                    </Label>
                    <Input
                      id="reg-email"
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
                    <Label htmlFor="reg-password">
                      {isTe
                        ? "పాస్‌వర్డ్ (కనీసం 6 అక్షరాలు) *"
                        : "Password (at least 6 characters) *"}
                    </Label>
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
              </div>
            </section>

            <DetailedProfileForm
              initialData={initialData}
              onSave={handleProfileSubmit}
              isSubmitting={submitting}
              submitButtonText={
                isTe ? "నమోదు చేసి ప్రొఫైల్ సృష్టించండి" : "Register and create profile"
              }
            />

            <div className="border-t border-[#ded5c8] pt-5 text-center text-[12px] text-[#6B6570]">
              {isTe ? "ఇప్పటికే నమోదు చేసుకున్నారా?" : "Already registered?"}{" "}
              <Link to="/login" search={{}} className="font-semibold text-[#087333] underline">
                {isTe ? "మీ ఖాతాలో సైన్ ఇన్ చేయండి" : "Sign in to your account"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
