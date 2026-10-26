import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo, ChangeEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Camera,
  Heart,
  HelpCircle,
  Loader2,
  Lock,
  Save,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { PHOTO_BUCKET, SITE_NAME, SITE_NAME_TE } from "@/lib/site";
import {
  type DetailedProfileFormData,
  INITIAL_DETAILED_FORM_DATA,
  calculateAgeFromDob,
} from "@/lib/detailed-profile-types";
import {
  reconstructDetailedFormData,
  saveDetailedMatrimonialProfile,
} from "@/lib/detailed-profile-api";
import {
  COMMUNITY_PROFESSION_SUGGESTIONS,
  COMPLEXION_OPTIONS,
  CURRENCY_OPTIONS,
  EDUCATION_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  FAMILY_TYPE_OPTIONS,
  FOOD_HABIT_OPTIONS,
  GENDER_OPTIONS,
  HEIGHT_CHOICES,
  LIFESTYLE_HABIT_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  NAKSHATRA_OPTIONS,
  OCCUPATION_OPTIONS,
  RASHI_OPTIONS,
  SALARY_PERIOD_OPTIONS,
  STATES,
} from "@/lib/options";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
  head: () => ({
    meta: [
      { title: `Create Your Matrimony Profile | ${SITE_NAME}` },
      { name: "description", content: "Complete your matrimonial profile in simple steps" },
    ],
  }),
});

const PROFILE_FOR_OPTIONS = [
  { value: "myself", label: "Myself", labelTe: "నా కోసం" },
  { value: "daughter", label: "My Daughter", labelTe: "నా కుమార్తె" },
  { value: "son", label: "My Son", labelTe: "నా కుమారుడు" },
  { value: "brother", label: "My Brother", labelTe: "నా సోదరుడు" },
  { value: "sister", label: "My Sister", labelTe: "నా సోదరి" },
  { value: "relative", label: "My Relative", labelTe: "నా బంధువు" },
  { value: "friend", label: "My Friend", labelTe: "నా స్నేహితుడు" },
] as const;

const TOTAL_STEPS = 8;

export function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const { lang, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const isTe = lang === "te";

  const [step, setStep] = useState(1);
  const [profileId, setProfileId] = useState<string | undefined>(undefined);
  const [profileCode, setProfileCode] = useState<string>("");
  const [formData, setFormData] = useState<DetailedProfileFormData>(() => ({
    ...INITIAL_DETAILED_FORM_DATA,
  }));

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [savingProgress, setSavingProgress] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [returningUser, setReturningUser] = useState(false);

  // 1. Authentication guard & initial data loading
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      void navigate({ to: "/login", search: { returnTo: "/onboarding" } });
      return;
    }

    let isMounted = true;

    async function loadExistingState() {
      try {
        const [
          { data: existingProfile },
          { data: privateDetails },
          { data: partnerPreferences },
          { data: photos },
        ] = await Promise.all([
          supabase.from("matrimonial_profiles").select("*").eq("owner_id", user!.id).maybeSingle(),
          supabase
            .from("profile_private_details")
            .select("*")
            .eq("owner_id", user!.id)
            .maybeSingle(),
          supabase.from("partner_preferences").select("*").eq("owner_id", user!.id).maybeSingle(),
          supabase
            .from("profile_photos")
            .select("storage_path, is_primary")
            .eq("owner_id", user!.id),
        ]);

        if (!isMounted) return;

        if (existingProfile?.id) {
          setProfileId(existingProfile.id);
          setProfileCode(existingProfile.profile_code || "");

          if (existingProfile.declaration_accepted) {
            // Already complete!
            setCompleted(true);
          } else {
            setReturningUser(true);
          }

          const reconstructed = reconstructDetailedFormData({
            profile: existingProfile as Record<string, unknown>,
            privateDetails: privateDetails as Record<string, unknown>,
            partnerPreferences: partnerPreferences as Record<string, unknown>,
          });

          setFormData((prev) => ({ ...prev, ...reconstructed }));
        } else {
          // Check if quick lead data was captured from homepage
          try {
            const rawLead = sessionStorage.getItem("sbm_quick_lead_data");
            if (rawLead) {
              const parsed = JSON.parse(rawLead) as Record<string, string>;
              setFormData((prev) => {
                const nextProfileFor = parsed["profileFor"] || prev.profileFor;
                return {
                  ...prev,
                  fullName: parsed["fullName"] || prev.fullName,
                  contactNumber: parsed["contactNumber"] || prev.contactNumber,
                  gender:
                    parsed["gender"] === "groom" || parsed["gender"] === "bride"
                      ? (parsed["gender"] as "bride" | "groom")
                      : prev.gender,
                  ...(nextProfileFor ? { profileFor: nextProfileFor } : {}),
                };
              });
            }
          } catch {
            // ignore
          }
        }

        if (photos && photos.length > 0) {
          const primary = photos.find((p) => p.is_primary) || photos[0];
          if (primary?.storage_path) {
            const { data: signedUrlData } = await supabase.storage
              .from(PHOTO_BUCKET)
              .createSignedUrl(primary.storage_path, 3600);
            if (signedUrlData?.signedUrl) {
              setUploadedPhotoUrl(signedUrlData.signedUrl);
            }
          }
        }
      } catch (err) {
        console.error("Error loading onboarding profile:", err);
      } finally {
        if (isMounted) setLoadingInitial(false);
      }
    }

    void loadExistingState();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading, navigate]);

  function updateField<K extends keyof DetailedProfileFormData>(
    field: K,
    value: DetailedProfileFormData[K],
  ) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Calculate completion percentage based on current state
  const completionPercent = useMemo(() => {
    let score = 0;
    const total = 100;

    if (formData.fullName.trim()) score += 15;
    if (formData.gender) score += 10;
    if (formData.dateOfBirth) score += 10;
    if (formData.nativePlace.trim()) score += 10;
    if (formData.education) score += 10;
    if (formData.occupation) score += 10;
    if (formData.fatherProfession.trim() || formData.familyAbout.trim()) score += 10;
    if (formData.heightCm) score += 10;
    if (formData.preferredAgeMin && formData.preferredAgeMax) score += 10;
    if (uploadedPhotoUrl) score += 5;

    return Math.min(100, Math.round((score / total) * 100));
  }, [formData, uploadedPhotoUrl]);

  // Progressive background save to database
  async function persistProgress(
    customData?: DetailedProfileFormData,
  ): Promise<string | undefined> {
    if (!user) return undefined;
    setSavingProgress(true);
    try {
      const dataToSave = customData || formData;
      const res = await saveDetailedMatrimonialProfile({
        userId: user.id,
        profileId,
        formData: dataToSave,
      });
      if (res.profileId) {
        setProfileId(res.profileId);
      }
      return res.profileId;
    } catch (err) {
      console.error("Failed to persist onboarding step:", err);
      toast.error(
        isTe ? "పురోగతిని సేవ్ చేయడంలో సమస్య ఏర్పడింది." : "Failed to auto-save step progress.",
      );
      return undefined;
    } finally {
      setSavingProgress(false);
    }
  }

  async function handleNextStep() {
    // Step validation
    if (step === 1) {
      if (!formData.fullName.trim()) {
        toast.error(isTe ? "దయచేసి పేరు నమోదు చేయండి." : "Please enter the candidate's full name.");
        return;
      }
      if (!formData.gender) {
        toast.error(isTe ? "దయచేసి లింగాన్ని ఎంచుకోండి." : "Please select bride or groom.");
        return;
      }
      if (!formData.dateOfBirth) {
        toast.error(isTe ? "దయచేసి పుట్టిన తేదీని నమోదు చేయండి." : "Please enter date of birth.");
        return;
      }
      const age = calculateAgeFromDob(formData.dateOfBirth);
      if (age < 18) {
        toast.error(isTe ? "కనీస వయస్సు 18 సంవత్సరాలు ఉండాలి." : "Minimum age is 18 years.");
        return;
      }
    }

    if (step === 3) {
      if (!formData.education) {
        toast.error(isTe ? "దయచేసి విద్యార్హతను ఎంచుకోండి." : "Please select highest education.");
        return;
      }
    }

    // Persist progress to database
    await persistProgress();

    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handlePreviousStep() {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleFinalSubmit() {
    if (!formData.declarationAccepted) {
      toast.error(
        isTe
          ? "దయచేసి నిబంధనలను మరియు ప్రకటనను అంగీకరించండి."
          : "Please accept the community declaration to publish your profile.",
      );
      return;
    }

    setSavingProgress(true);
    try {
      const finalData: DetailedProfileFormData = {
        ...formData,
        declarationAccepted: true,
        declarationAcceptedAt: new Date().toISOString(),
      };

      const savedId = await persistProgress(finalData);

      // Fetch assigned profile code
      if (savedId || profileId) {
        const { data: p } = await supabase
          .from("matrimonial_profiles")
          .select("profile_code")
          .eq("id", savedId || profileId!)
          .maybeSingle();

        if (p?.profile_code) {
          setProfileCode(p.profile_code);
        }
      }

      setCompleted(true);
      toast.success(
        isTe
          ? "మీ మ్యాట్రిమోనీ ప్రొఫైల్ విజయవంతంగా సమర్పించబడింది!"
          : "Your matrimonial profile has been submitted successfully!",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not complete profile submission.");
    } finally {
      setSavingProgress(false);
    }
  }

  // Client-side image compress & upload
  async function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const rawFile = e.target.files?.[0];
    if (!rawFile || !user) return;

    if (!rawFile.type.startsWith("image/")) {
      toast.error("Please upload a JPG or PNG image.");
      return;
    }

    setPhotoUploading(true);
    try {
      // Ensure profile exists first so we can link the photo
      let effectiveProfileId = profileId;
      if (!effectiveProfileId) {
        effectiveProfileId = await persistProgress();
      }

      const filePath = `${user.id}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(filePath, rawFile, { upsert: true, contentType: "image/jpeg" });

      if (uploadError) throw uploadError;

      if (effectiveProfileId) {
        await supabase.from("profile_photos").insert({
          owner_id: user.id,
          profile_id: effectiveProfileId,
          storage_path: filePath,
          is_primary: true,
        });

        await supabase
          .from("matrimonial_profiles")
          .update({ has_profile_photo: true })
          .eq("id", effectiveProfileId);
      }

      const { data: signedData } = await supabase.storage
        .from(PHOTO_BUCKET)
        .createSignedUrl(filePath, 3600);
      setUploadedPhotoUrl(signedData?.signedUrl ?? null);
      toast.success(
        isTe ? "ఫోటో విజయవంతంగా అప్‌లోడ్ చేయబడింది." : "Profile photo uploaded successfully!",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload photo.");
    } finally {
      setPhotoUploading(false);
    }
  }

  if (loadingInitial) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-[#FAF8F3]">
        <div className="text-center">
          <ShettibalijaLogo size="md" linkToHome />
          <div className="mx-auto mt-6 flex h-10 w-10 items-center justify-center text-[#D1A329]">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <p className="mt-3 text-sm font-medium text-[#6B6570]">
            {isTe ? "వివరాలు సిద్ధం చేస్తున్నాము..." : "Loading your profile workspace..."}
          </p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-[#FAF8F3] px-4 py-16">
        <div className="w-full max-w-xl border border-[#ded5c8] bg-white p-8 text-center shadow-sm sm:p-12">
          <ShettibalijaLogo size="md" linkToHome />
          <div className="mx-auto mt-7 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#087333]">
            <CheckCircle2 size={36} />
          </div>
          <span className="mt-5 inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-[#a37d1c]">
            {isTe ? "సమర్పణ పూర్తయింది" : "Profile Complete"}
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#24103F]">
            {isTe ? "మీ ప్రొఫైల్ విజయవంతంగా సిద్ధమైంది!" : "Your profile is ready!"}
          </h1>
          {profileCode ? (
            <div className="mx-auto mt-4 inline-block rounded border border-[#ded5c8] bg-[#FAF8F3] px-4 py-1.5 font-mono text-sm font-bold text-[#24103F]">
              ID: {profileCode}
            </div>
          ) : null}
          <p className="mx-auto mt-4 max-w-md text-[13px] leading-6 text-[#6B6570]">
            {isTe
              ? "మీ మ్యాట్రిమోనీ ప్రొఫైల్ సేవ్ చేయబడింది. సమీక్ష తర్వాత సమాజ అన్వేషణలో ప్రదర్శించబడుతుంది. ఇప్పుడు మీరు మ్యాచ్‌లను పరిశీలించవచ్చు."
              : "Your matrimonial profile has been safely stored and submitted for community review. In the meantime, you can begin exploring matches."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/dashboard" className="sbm-button sbm-button--primary">
              <span>{isTe ? "డ్యాష్‌బోర్డ్‌కు వెళ్లండి" : "Go to Dashboard"}</span>
              <ArrowRight size={17} />
            </Link>
            <Link to="/search" className="sbm-button sbm-button--outline">
              <span>{isTe ? "మ్యాచ్‌లను చూడండి" : "Discover Matches"}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const calculatedAge = formData.dateOfBirth ? calculateAgeFromDob(formData.dateOfBirth) : 0;

  return (
    <div className="min-h-screen bg-[#FAF8F3] pb-24 pt-8">
      {/* Top Header */}
      <header className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex items-center justify-between border-b border-[#ded5c8] pb-5">
          <div className="flex items-center gap-3">
            <ShettibalijaLogo size="sm" linkToHome />
            <div>
              <p className="font-serif text-sm font-bold text-[#24103F]">
                {isTe ? SITE_NAME_TE : SITE_NAME}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[#a37d1c]">
                {isTe ? "మ్యాట్రిమోనీ ఆన్‌బోర్డింగ్" : "Matrimony Onboarding"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-[#6B6570]">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-1.5 py-0.5 ${lang === "en" ? "font-bold text-[#24103F]" : ""}`}
              >
                EN
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setLanguage("te")}
                className={`px-1.5 py-0.5 ${lang === "te" ? "font-bold text-[#24103F]" : ""}`}
              >
                తెలుగు
              </button>
            </div>

            <button
              type="button"
              onClick={async () => {
                await persistProgress();
                toast.success(isTe ? "పురోగతి సేవ్ చేయబడింది." : "Progress saved.");
                void navigate({ to: "/dashboard" });
              }}
              disabled={savingProgress}
              className="inline-flex items-center gap-1.5 border border-[#ded5c8] bg-white px-3 py-1.5 text-xs font-semibold text-[#24103F] hover:bg-[#FAF8F3]"
            >
              <Save size={13} />
              <span>{isTe ? "సేవ్ & నిష్క్రమణ" : "Save & Exit"}</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-[#6B6570]">
            <span className="font-medium text-[#24103F]">
              {isTe ? `దశ ${step} / ${TOTAL_STEPS}` : `Step ${step} of ${TOTAL_STEPS}`}
            </span>
            <span>
              {completionPercent}% {isTe ? "పూర్తయింది" : "Complete"}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden bg-[#e6dfd5]">
            <div
              className="h-full bg-[#087333] transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {returningUser ? (
          <div className="mt-4 flex items-center justify-between rounded border border-[#ded5c8] bg-white px-4 py-2.5 text-xs text-[#6B6570]">
            <span>
              {isTe
                ? `తిరిగి స్వాగతం, ${formData.fullName || "సభ్యులు"}. మీ ప్రొఫైల్ వివరాలను కొనసాగించండి.`
                : `Welcome back, ${formData.fullName || "Member"}. Let's continue your profile.`}
            </span>
            <span className="font-semibold text-[#087333]">
              {isTe ? "పురోగతి భద్రపరచబడింది" : "Draft saved"}
            </span>
          </div>
        ) : null}
      </header>

      {/* Main Form Body */}
      <main className="mx-auto mt-8 max-w-4xl px-4 sm:px-6">
        <div className="border border-[#ded5c8] bg-white p-6 shadow-sm sm:p-10">
          {/* STEP 1: ABOUT YOU */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#a37d1c]">
                  {isTe ? "దశ 1: ప్రాథమిక వివరాలు" : "Step 1: About You"}
                </span>
                <h2 className="mt-1 font-serif text-2xl font-bold text-[#24103F]">
                  {isTe
                    ? "ఈ ప్రొఫైల్ ఎవరి కోసం సృష్టిస్తున్నారు?"
                    : "Who are you creating this profile for?"}
                </h2>
                <p className="mt-1 text-xs text-[#6B6570]">
                  {isTe
                    ? "అభ్యర్థిని ఎవరు ప్రాతినిధ్యం వహిస్తున్నారో ఎంచుకోండి."
                    : "Select who will be represented by this matrimonial profile."}
                </p>
              </div>

              {/* Profile For Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {PROFILE_FOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      updateField("profileFor", opt.value);
                      if (opt.value === "daughter" || opt.value === "sister") {
                        updateField("gender", "bride");
                      } else if (opt.value === "son" || opt.value === "brother") {
                        updateField("gender", "groom");
                      }
                    }}
                    className={`rounded border p-3 text-left transition-all ${
                      formData.profileFor === opt.value
                        ? "border-[#24103F] bg-[#FAF8F3] font-semibold text-[#24103F] shadow-sm"
                        : "border-[#ded5c8] bg-white text-[#6B6570] hover:border-[#a37d1c]"
                    }`}
                  >
                    <p className="text-xs">{isTe ? opt.labelTe : opt.label}</p>
                  </button>
                ))}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="full-name" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "పూర్తి పేరు (ఇంటిపేరుతో సహా) *" : "Full Name (including Surname) *"}
                  </Label>
                  <Input
                    id="full-name"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder={isTe ? "ఉదా: శెట్టి వెంకటేశ్వర్లు" : "e.g. Shetti Venkateswarlu"}
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "లింగం *" : "Gender *"}
                  </Label>
                  <div className="mt-1.5 flex gap-3">
                    {GENDER_OPTIONS.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => updateField("gender", g.value)}
                        className={`flex-1 rounded border py-2.5 text-center text-xs font-semibold transition-all ${
                          formData.gender === g.value
                            ? "border-[#24103F] bg-[#24103F] text-white"
                            : "border-[#ded5c8] bg-white text-[#24103F] hover:bg-[#FAF8F3]"
                        }`}
                      >
                        {isTe ? g.labelTe : g.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="dob" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "పుట్టిన తేదీ *" : "Date of Birth *"}
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    required
                    className="mt-1.5"
                  />
                  {calculatedAge > 0 ? (
                    <p className="mt-1 text-[11px] text-[#087333]">
                      {isTe ? `వయస్సు: ${calculatedAge} సంవత్సరాలు` : `Age: ${calculatedAge} years`}
                    </p>
                  ) : null}
                </div>

                <div>
                  <Label htmlFor="contact" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "సంప్రదింపు నంబర్ *" : "Contact Phone Number *"}
                  </Label>
                  <Input
                    id="contact"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => updateField("contactNumber", e.target.value)}
                    placeholder="10-digit mobile number"
                    required
                    className="mt-1.5"
                  />
                  <p className="mt-1 text-[10px] text-[#6B6570]">
                    {isTe
                      ? "ఇది పబ్లిక్‌గా కనిపించదు."
                      : "Private by default. Never published openly."}
                  </p>
                </div>

                <div>
                  <Label htmlFor="native-place" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "స్వస్థలం (Native Place)" : "Native Place (Town / Village / District)"}
                  </Label>
                  <Input
                    id="native-place"
                    value={formData.nativePlace}
                    onChange={(e) => updateField("nativePlace", e.target.value)}
                    placeholder="e.g. Amalapuram, Konaseema"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="present-place" className="text-xs font-semibold text-[#24103F]">
                    {isTe
                      ? "ప్రస్తుత నివాసం (Current Location)"
                      : "Current Location (City / State)"}
                  </Label>
                  <Input
                    id="present-place"
                    value={formData.presentPlace}
                    onChange={(e) => updateField("presentPlace", e.target.value)}
                    placeholder="e.g. Hyderabad, Telangana"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="community-prof" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "సాంప్రదాయ / కుల వృత్తి" : "Community / Traditional Profession"}
                  </Label>
                  <select
                    id="community-prof"
                    value={formData.communityProfession}
                    onChange={(e) => updateField("communityProfession", e.target.value)}
                    className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                  >
                    <option value="">{isTe ? "ఎంచుకోండి" : "Select suggestion"}</option>
                    {COMMUNITY_PROFESSION_SUGGESTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {isTe ? s.labelTe : s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="marital-status" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "వైవాహిక స్థితి *" : "Marital Status *"}
                  </Label>
                  <select
                    id="marital-status"
                    value={formData.maritalStatus}
                    onChange={(e) =>
                      updateField(
                        "maritalStatus",
                        e.target.value as DetailedProfileFormData["maritalStatus"],
                      )
                    }
                    className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                  >
                    {MARITAL_STATUS_OPTIONS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {isTe ? m.labelTe : m.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: HOROSCOPE */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#a37d1c]">
                  {isTe ? "దశ 2: జాతక వివరాలు (ఐచ్ఛికం)" : "Step 2: Horoscope Details (Optional)"}
                </span>
                <h2 className="mt-1 font-serif text-2xl font-bold text-[#24103F]">
                  {isTe ? "జాతక సమాచారం" : "Horoscope & Astrological Details"}
                </h2>
                <p className="mt-1 text-xs text-[#6B6570]">
                  {isTe
                    ? "కుటుంబాలు సరిపోలికను పరిశీలించడానికి ఈ వివరాలు ఉపయోగపడతాయి. వివరాలు లేకపోతే వదిలివేయవచ్చు."
                    : "Astrological matching helps families assess compatibility. You may skip any field you do not have right now."}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="star" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "నక్షత్రం (Star / Nakshatra)" : "Star / Nakshatra"}
                  </Label>
                  <select
                    id="star"
                    value={formData.star}
                    onChange={(e) => updateField("star", e.target.value)}
                    className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                  >
                    <option value="">{isTe ? "ఎంచుకోండి" : "Select Star"}</option>
                    {NAKSHATRA_OPTIONS.map((n) => (
                      <option key={n.value} value={n.value}>
                        {isTe ? n.labelTe : n.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="rashi" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "రాశి (Moon Sign / Rashi)" : "Moon Sign / Rashi"}
                  </Label>
                  <select
                    id="rashi"
                    value={formData.rashi}
                    onChange={(e) => updateField("rashi", e.target.value)}
                    className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                  >
                    <option value="">{isTe ? "ఎంచుకోండి" : "Select Rashi"}</option>
                    {RASHI_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {isTe ? r.labelTe : r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="gothram" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "గోత్రం (Gothram)" : "Gothram"}
                  </Label>
                  <Input
                    id="gothram"
                    value={formData.gothram}
                    onChange={(e) => updateField("gothram", e.target.value)}
                    placeholder="e.g. Siva, Vishnu, Janardhana"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="tob" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "పుట్టిన సమయం (Time of Birth)" : "Time of Birth"}
                  </Label>
                  <Input
                    id="tob"
                    type="time"
                    value={formData.timeOfBirth}
                    onChange={(e) => updateField("timeOfBirth", e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="pob" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "పుట్టిన స్థలం (Place of Birth)" : "Place of Birth"}
                  </Label>
                  <Input
                    id="pob"
                    value={formData.placeOfBirth}
                    onChange={(e) => updateField("placeOfBirth", e.target.value)}
                    placeholder="City, District"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="horoscope-avail" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "జాతకం అందుబాటులో ఉందా?" : "Horoscope Availability"}
                  </Label>
                  <select
                    id="horoscope-avail"
                    value={formData.horoscopeAvailable}
                    onChange={(e) =>
                      updateField("horoscopeAvailable", e.target.value === "yes" ? "yes" : "no")
                    }
                    className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                  >
                    <option value="yes">
                      {isTe ? "అవును, అందుబాటులో ఉంది" : "Yes, Available"}
                    </option>
                    <option value="no">{isTe ? "లేదు" : "Not Available"}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: EDUCATION & CAREER */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#a37d1c]">
                  {isTe ? "దశ 3: విద్య & ఉద్యోగం" : "Step 3: Education & Career"}
                </span>
                <h2 className="mt-1 font-serif text-2xl font-bold text-[#24103F]">
                  {isTe ? "చదువు మరియు వృత్తి వివరాలు" : "Education & Professional Background"}
                </h2>
                <p className="mt-1 text-xs text-[#6B6570]">
                  {isTe
                    ? "అభ్యర్థి విద్యార్హత మరియు ఉద్యోగ వివరాలను నమోదు చేయండి."
                    : "Enter details regarding degrees, job designation and employer details."}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="education" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "అత్యున్నత విద్యార్హత *" : "Highest Education *"}
                  </Label>
                  <select
                    id="education"
                    value={formData.education}
                    onChange={(e) => updateField("education", e.target.value)}
                    required
                    className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                  >
                    <option value="">{isTe ? "ఎంచుకోండి" : "Select Education"}</option>
                    {EDUCATION_OPTIONS.map((edu) => (
                      <option key={edu} value={edu}>
                        {edu}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="occupation" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "వృత్తి విభాగం" : "Occupation Category"}
                  </Label>
                  <select
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => updateField("occupation", e.target.value)}
                    className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                  >
                    <option value="">{isTe ? "ఎంచుకోండి" : "Select Occupation"}</option>
                    {OCCUPATION_OPTIONS.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="designation" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "హోదా / ఉద్యోగ బిరుదు" : "Designation / Role Title"}
                  </Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => updateField("designation", e.target.value)}
                    placeholder="e.g. Senior Software Engineer / Manager"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="emp-type" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "ఉద్యోగ రకం" : "Employment Type"}
                  </Label>
                  <select
                    id="emp-type"
                    value={formData.employmentType}
                    onChange={(e) => updateField("employmentType", e.target.value)}
                    className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                  >
                    <option value="">{isTe ? "ఎంచుకోండి" : "Select Employment Type"}</option>
                    {EMPLOYMENT_TYPE_OPTIONS.map((et) => (
                      <option key={et.value} value={et.value}>
                        {isTe ? et.labelTe : et.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="job-location" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "ఉద్యోగ స్థలం" : "Job Location (City / Country)"}
                  </Label>
                  <Input
                    id="job-location"
                    value={formData.jobLocation}
                    onChange={(e) => updateField("jobLocation", e.target.value)}
                    placeholder="e.g. Hyderabad, Bengaluru, USA"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="salary" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "వార్షిక ఆదాయం (ఐచ్ఛికం)" : "Annual Income (Optional)"}
                  </Label>
                  <div className="mt-1.5 flex gap-2">
                    <select
                      value={formData.salaryCurrency}
                      onChange={(e) => updateField("salaryCurrency", e.target.value)}
                      className="w-24 rounded border border-[#ded5c8] bg-white p-2 text-xs text-[#24103F]"
                    >
                      {CURRENCY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.value}
                        </option>
                      ))}
                    </select>
                    <Input
                      id="salary"
                      value={formData.salaryAmount}
                      onChange={(e) => updateField("salaryAmount", e.target.value)}
                      placeholder="e.g. 12,00,000"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: FAMILY */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#a37d1c]">
                  {isTe ? "దశ 4: కుటుంబ వివరాలు" : "Step 4: Family Details"}
                </span>
                <h2 className="mt-1 font-serif text-2xl font-bold text-[#24103F]">
                  {isTe ? "కుటుంబ నేపథ్యం" : "Family Background"}
                </h2>
                <p className="mt-1 text-xs text-[#6B6570]">
                  {isTe
                    ? "తల్లిదండ్రులు, తోబుట్టువులు మరియు కుటుంబ నేపథ్య వివరాలు."
                    : "Information regarding parents, siblings and roots."}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="father-name" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "తండ్రి పేరు" : "Father's Name"}
                  </Label>
                  <Input
                    id="father-name"
                    value={formData.fatherName}
                    onChange={(e) => updateField("fatherName", e.target.value)}
                    placeholder="Father's full name"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="father-prof" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "తండ్రి వృత్తి" : "Father's Profession"}
                  </Label>
                  <Input
                    id="father-prof"
                    value={formData.fatherProfession}
                    onChange={(e) => updateField("fatherProfession", e.target.value)}
                    placeholder="e.g. Business / Government / Retired"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="mother-name" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "తల్లి పేరు" : "Mother's Name"}
                  </Label>
                  <Input
                    id="mother-name"
                    value={formData.motherName}
                    onChange={(e) => updateField("motherName", e.target.value)}
                    placeholder="Mother's full name"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="mother-prof" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "తల్లి వృత్తి" : "Mother's Profession"}
                  </Label>
                  <Input
                    id="mother-prof"
                    value={formData.motherProfession}
                    onChange={(e) => updateField("motherProfession", e.target.value)}
                    placeholder="e.g. Homemaker / Teacher"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="family-type" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "కుటుంబ రకం" : "Family Type"}
                  </Label>
                  <select
                    id="family-type"
                    value={formData.familyType}
                    onChange={(e) =>
                      updateField(
                        "familyType",
                        e.target.value as DetailedProfileFormData["familyType"],
                      )
                    }
                    className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                  >
                    {FAMILY_TYPE_OPTIONS.map((ft) => (
                      <option key={ft.value} value={ft.value}>
                        {isTe ? ft.labelTe : ft.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="brothers" className="text-xs font-semibold text-[#24103F]">
                      {isTe ? "సోదరులు (Brothers)" : "Brothers"}
                    </Label>
                    <Input
                      id="brothers"
                      type="number"
                      min={0}
                      max={10}
                      value={formData.brothersCount}
                      onChange={(e) => updateField("brothersCount", Number(e.target.value))}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sisters" className="text-xs font-semibold text-[#24103F]">
                      {isTe ? "సోదరీమణులు (Sisters)" : "Sisters"}
                    </Label>
                    <Input
                      id="sisters"
                      type="number"
                      min={0}
                      max={10}
                      value={formData.sistersCount}
                      onChange={(e) => updateField("sistersCount", Number(e.target.value))}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="family-about" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "కుటుంబ వివరణ" : "Family Summary / Native Heritage"}
                  </Label>
                  <Textarea
                    id="family-about"
                    value={formData.familyAbout}
                    onChange={(e) => updateField("familyAbout", e.target.value)}
                    placeholder="Brief note about your family values, native background, etc."
                    rows={3}
                    className="mt-1.5 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: LIFESTYLE & ATTRIBUTES */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#a37d1c]">
                  {isTe ? "దశ 5: జీవనశైలి & రూపురేఖలు" : "Step 5: Lifestyle & Appearance"}
                </span>
                <h2 className="mt-1 font-serif text-2xl font-bold text-[#24103F]">
                  {isTe ? "వ్యక్తిగత రూపురేఖలు మరియు జీవన విధానం" : "Physical Attributes & Habits"}
                </h2>
                <p className="mt-1 text-xs text-[#6B6570]">
                  {isTe
                    ? "ఎత్తు, ఆహారపు అలవాట్లు మరియు జీవనశైలి వివరాలు."
                    : "Height, complexion, dietary preferences and lifestyle habits."}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="height" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "ఎత్తు (Height)" : "Height"}
                  </Label>
                  <select
                    id="height"
                    value={formData.heightCm || ""}
                    onChange={(e) => updateField("heightCm", Number(e.target.value) || 0)}
                    className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                  >
                    <option value="">{isTe ? "ఎత్తు ఎంచుకోండి" : "Select Height"}</option>
                    {HEIGHT_CHOICES.map((h) => (
                      <option key={h.cm} value={h.cm}>
                        {h.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="complexion" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "ఛాయ (Complexion)" : "Complexion"}
                  </Label>
                  <select
                    id="complexion"
                    value={formData.complexion}
                    onChange={(e) => updateField("complexion", e.target.value)}
                    className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                  >
                    <option value="">{isTe ? "ఎంచుకోండి" : "Select Complexion"}</option>
                    {COMPLEXION_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {isTe ? c.labelTe : c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="food" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "ఆహారపు అలవాటు (Dietary Preference)" : "Dietary Habit"}
                  </Label>
                  <select
                    id="food"
                    value={formData.foodHabit}
                    onChange={(e) =>
                      updateField(
                        "foodHabit",
                        e.target.value as DetailedProfileFormData["foodHabit"],
                      )
                    }
                    className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                  >
                    <option value="">{isTe ? "ఎంచుకోండి" : "Select Diet"}</option>
                    {FOOD_HABIT_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {isTe ? f.labelTe : f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="smoking" className="text-xs font-semibold text-[#24103F]">
                      {isTe ? "ధూమపానం" : "Smoking"}
                    </Label>
                    <select
                      id="smoking"
                      value={formData.smoking}
                      onChange={(e) =>
                        updateField("smoking", e.target.value as DetailedProfileFormData["smoking"])
                      }
                      className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                    >
                      {LIFESTYLE_HABIT_OPTIONS.map((l) => (
                        <option key={l.value} value={l.value}>
                          {isTe ? l.labelTe : l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="drinking" className="text-xs font-semibold text-[#24103F]">
                      {isTe ? "మద్యపానం" : "Drinking"}
                    </Label>
                    <select
                      id="drinking"
                      value={formData.drinking}
                      onChange={(e) =>
                        updateField(
                          "drinking",
                          e.target.value as DetailedProfileFormData["drinking"],
                        )
                      }
                      className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                    >
                      {LIFESTYLE_HABIT_OPTIONS.map((l) => (
                        <option key={l.value} value={l.value}>
                          {isTe ? l.labelTe : l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="about-me" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "వ్యక్తిత్వ పరిచయం (About Candidate)" : "About the Candidate"}
                  </Label>
                  <Textarea
                    id="about-me"
                    value={formData.familyAbout}
                    onChange={(e) => updateField("familyAbout", e.target.value)}
                    placeholder="Share hobbies, life outlook, and personal values."
                    rows={3}
                    className="mt-1.5 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PARTNER PREFERENCES */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#a37d1c]">
                  {isTe ? "దశ 6: కోరుకునే భాగస్వామి" : "Step 6: Partner Preferences"}
                </span>
                <h2 className="mt-1 font-serif text-2xl font-bold text-[#24103F]">
                  {isTe ? "మీ భాగస్వామి నుంచి మీ అంచనాలు" : "What are you looking for?"}
                </h2>
                <p className="mt-1 text-xs text-[#6B6570]">
                  {isTe
                    ? "వయస్సు, విద్య, ఉద్యోగం మరియు ఇతర ప్రాధాన్యతలు."
                    : "Preferred age, height, education and location for ideal matches."}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "కోరుకునే వయస్సు పరిధి" : "Preferred Age Range"}
                  </Label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Input
                      type="number"
                      min={18}
                      max={70}
                      value={formData.preferredAgeMin || ""}
                      onChange={(e) => updateField("preferredAgeMin", Number(e.target.value) || 0)}
                      placeholder="Min Age (e.g. 21)"
                    />
                    <span className="text-xs text-[#6B6570]">{isTe ? "నుండి" : "to"}</span>
                    <Input
                      type="number"
                      min={18}
                      max={70}
                      value={formData.preferredAgeMax || ""}
                      onChange={(e) => updateField("preferredAgeMax", Number(e.target.value) || 0)}
                      placeholder="Max Age (e.g. 29)"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pref-edu" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "కోరుకునే విద్యార్హత" : "Preferred Education"}
                  </Label>
                  <select
                    id="pref-edu"
                    value={formData.preferredEducation}
                    onChange={(e) => updateField("preferredEducation", e.target.value)}
                    className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                  >
                    <option value="">{isTe ? "ఏదైనా పర్వాలేదు" : "Any Education"}</option>
                    {EDUCATION_OPTIONS.map((edu) => (
                      <option key={edu} value={edu}>
                        {edu}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="pref-occ" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "కోరుకునే వృత్తి" : "Preferred Occupation"}
                  </Label>
                  <select
                    id="pref-occ"
                    value={formData.preferredOccupation}
                    onChange={(e) => updateField("preferredOccupation", e.target.value)}
                    className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                  >
                    <option value="">{isTe ? "ఏదైనా పర్వాలేదు" : "Any Occupation"}</option>
                    {OCCUPATION_OPTIONS.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="pref-marital" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "వైవాహిక స్థితి ప్రాధాన్యత" : "Preferred Marital Status"}
                  </Label>
                  <select
                    id="pref-marital"
                    value={formData.preferredMaritalStatus}
                    onChange={(e) =>
                      updateField(
                        "preferredMaritalStatus",
                        e.target.value as DetailedProfileFormData["preferredMaritalStatus"],
                      )
                    }
                    className="mt-1.5 w-full rounded border border-[#ded5c8] bg-white p-2.5 text-xs text-[#24103F]"
                  >
                    <option value="">{isTe ? "ఏదైనా పర్వాలేదు" : "Any Marital Status"}</option>
                    {MARITAL_STATUS_OPTIONS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {isTe ? m.labelTe : m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="pref-notes" className="text-xs font-semibold text-[#24103F]">
                    {isTe ? "ఇతర ఆకాంక్షలు / నిబంధనలు" : "Specific Expectations & Notes"}
                  </Label>
                  <Textarea
                    id="pref-notes"
                    value={formData.requirementsText}
                    onChange={(e) => updateField("requirementsText", e.target.value)}
                    placeholder="Mention preferred location, lifestyle, or family values."
                    rows={3}
                    className="mt-1.5 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: PHOTOS */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#a37d1c]">
                  {isTe ? "దశ 7: ప్రొఫైల్ ఫోటో" : "Step 7: Profile Photo"}
                </span>
                <h2 className="mt-1 font-serif text-2xl font-bold text-[#24103F]">
                  {isTe ? "వ్యక్తిగత ప్రొఫైల్ ఫోటోను జోడించండి" : "Add an Individual Portrait"}
                </h2>
                <p className="mt-1 text-xs text-[#6B6570]">
                  {isTe
                    ? "స్పష్టమైన వ్యక్తిగత ఫోటో కుటుంబాల గుర్తింపుకు ఎంతో ముఖ్యం. ఫోటోలు సురక్షితంగా రక్షించబడతాయి."
                    : "Families look for a clear, recent portrait. Your photos are protected by privacy settings."}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#ded5c8] bg-[#FAF8F3] p-8 text-center sm:p-12">
                {uploadedPhotoUrl ? (
                  <div className="space-y-4">
                    <img
                      src={uploadedPhotoUrl}
                      alt="Uploaded portrait"
                      className="mx-auto h-48 w-40 rounded object-cover shadow-sm"
                    />
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#087333]">
                      <CheckCircle2 size={16} />
                      <span>{isTe ? "ఫోటో జోడించబడింది" : "Photo successfully attached"}</span>
                    </div>
                    <label
                      htmlFor="photo-upload-input"
                      className="inline-block cursor-pointer text-xs font-medium text-[#24103F] underline"
                    >
                      {isTe ? "వేరొక ఫోటో మార్చండి" : "Change or upload different photo"}
                    </label>
                  </div>
                ) : (
                  <div>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#D1A329] shadow-sm">
                      <Camera size={26} />
                    </div>
                    <p className="mt-4 font-semibold text-[#24103F]">
                      {isTe
                        ? "స్పష్టమైన వ్యక్తిగత పోర్ట్రెయిట్ అప్‌లోడ్ చేయండి"
                        : "Upload your profile photo"}
                    </p>
                    <p className="mx-auto mt-1 max-w-xs text-[11px] text-[#6B6570]">
                      {isTe
                        ? "JPG లేదా PNG ఫార్మాట్. గ్రూప్ ఫోటోలు అనుమతించబడవు."
                        : "Individual recent portrait only. Stored in private matrimonial storage."}
                    </p>

                    <label
                      htmlFor="photo-upload-input"
                      className={`sbm-button sbm-button--primary mt-5 inline-flex cursor-pointer ${
                        photoUploading ? "pointer-events-none opacity-60" : ""
                      }`}
                    >
                      {photoUploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>{isTe ? "అప్‌లోడ్ అవుతోంది..." : "Uploading photo..."}</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span>{isTe ? "ఫోటో ఎంచుకోండి" : "Select Photo from Device"}</span>
                        </>
                      )}
                    </label>
                  </div>
                )}

                <input
                  id="photo-upload-input"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handlePhotoUpload}
                  disabled={photoUploading}
                  className="hidden"
                />
              </div>

              <div className="flex items-start gap-2.5 rounded border border-[#ded5c8] bg-[#FAF8F3] p-4 text-xs text-[#6B6570]">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#087333]" />
                <p>
                  {isTe
                    ? "ప్రొఫైల్ ఫోటోలు పబ్లిక్ ఇంటర్నెట్‌లో ఉచితంగా డౌన్‌లోడ్ చేసుకోలేరు. కేవలం లాగిన్ అయిన ధృవీకృత సభ్యులకు మాత్రమే ప్రదర్శించబడతాయి."
                    : "Private photos are protected at the data layer. You control who has permission to view your high-resolution portrait."}
                </p>
              </div>
            </div>
          )}

          {/* STEP 8: CONSENT & DECLARATION */}
          {step === 8 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#a37d1c]">
                  {isTe ? "దశ 8: సమ్మతి & ప్రకటన" : "Step 8: Consent & Declaration"}
                </span>
                <h2 className="mt-1 font-serif text-2xl font-bold text-[#24103F]">
                  {isTe ? "ప్రొఫైల్ నిర్ధారణ మరియు ప్రకటన" : "Review & Publish Profile"}
                </h2>
                <p className="mt-1 text-xs text-[#6B6570]">
                  {isTe
                    ? "ప్రొఫైల్ సమర్పించే ముందు దయచేసి క్రింది ప్రకటనను చదివి అంగీకరించండి."
                    : "Please read and confirm the community declaration before publishing your profile."}
                </p>
              </div>

              {/* Summary card */}
              <div className="rounded border border-[#ded5c8] bg-[#FAF8F3] p-5 text-xs">
                <p className="font-semibold text-[#24103F]">
                  {isTe ? "ప్రొఫైల్ సారాంశం" : "Profile Summary Preview"}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 text-[#6B6570]">
                  <div>
                    <strong>{isTe ? "పేరు" : "Name"}:</strong> {formData.fullName || "—"}
                  </div>
                  <div>
                    <strong>{isTe ? "లింగం" : "Gender"}:</strong>{" "}
                    {formData.gender === "groom" ? "Groom" : "Bride"}
                  </div>
                  <div>
                    <strong>{isTe ? "పుట్టిన తేదీ" : "DOB"}:</strong> {formData.dateOfBirth || "—"}{" "}
                    ({calculatedAge} yrs)
                  </div>
                  <div>
                    <strong>{isTe ? "విద్య" : "Education"}:</strong> {formData.education || "—"}
                  </div>
                  <div>
                    <strong>{isTe ? "ఉద్యోగం" : "Occupation"}:</strong> {formData.occupation || "—"}
                  </div>
                  <div>
                    <strong>{isTe ? "స్వస్థలం" : "Native Place"}:</strong>{" "}
                    {formData.nativePlace || "—"}
                  </div>
                </div>
              </div>

              {/* Declaration Text Box */}
              <div className="rounded border border-[#ded5c8] bg-white p-5 text-xs leading-6 text-[#24103F]">
                <p className="font-bold text-[#24103F]">
                  {isTe
                    ? "సభ్యత్వ ప్రకటన (Solemn Declaration):"
                    : "Official Community Declaration:"}
                </p>
                <p className="mt-2 text-[#6B6570]">
                  {isTe
                    ? "నేను శెట్టిబలిజ కమ్యూనిటీ మ్యాట్రిమోనీ వేదికపై నమోదు చేస్తున్న వివరాలన్నీ సత్యమైనవని, సరైనవని ప్రమాణపూర్వకంగా ప్రకటిస్తున్నాను. నా కుటుంబ సభ్యుల అంగీకారంతోనే ఈ ప్రొఫైల్ వివరాలు సమర్పిస్తున్నాను. ఇతర సభ్యుల గోప్యతను, గౌరవాన్ని కాపాడతానని హామీ ఇస్తున్నాను."
                    : "I hereby solemnly declare that all information furnished in this matrimonial profile is true, correct, and complete to the best of my knowledge and belief. I affirm that this profile is being submitted with proper family consent for the sole purpose of genuine matrimonial matchmaking within the Shettibalija community. I agree to respect the privacy, sanctity and safety of other members."}
                </p>
              </div>

              <div className="flex items-start gap-3 rounded border border-[#ded5c8] bg-[#FAF8F3] p-4 text-xs">
                <input
                  type="checkbox"
                  id="final-declaration-check"
                  checked={formData.declarationAccepted}
                  onChange={(e) => updateField("declarationAccepted", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#ded5c8] text-[#24103F] focus:ring-[#24103F]"
                  required
                />
                <label htmlFor="final-declaration-check" className="font-semibold text-[#24103F]">
                  {isTe
                    ? "నేను పై ప్రకటనను చదివి అంగీకరిస్తున్నాను. నా ప్రొఫైల్‌ను సమాజ సమీక్ష కోసం సమర్పించడానికి సమ్మతిస్తున్నాను. *"
                    : "I have read, understood and solemnly accept the declaration above. I hereby authorize publication of this profile for matrimonial review. *"}
                </label>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-10 flex items-center justify-between border-t border-[#ded5c8] pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePreviousStep}
                disabled={savingProgress}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6570] hover:text-[#24103F]"
              >
                <ArrowLeft size={15} />
                <span>{isTe ? "మునుపటి దశ" : "Previous Step"}</span>
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={() => void handleNextStep()}
                disabled={savingProgress}
                className="sbm-button sbm-button--primary"
              >
                {savingProgress ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{isTe ? "సేవ్ అవుతోంది..." : "Saving..."}</span>
                  </>
                ) : (
                  <>
                    <span>{isTe ? "తర్వాతి దశకు కొనసాగండి" : "Save & Continue"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => void handleFinalSubmit()}
                disabled={savingProgress || !formData.declarationAccepted}
                className="sbm-button sbm-button--primary bg-[#087333] hover:bg-[#07602b]"
              >
                {savingProgress ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{isTe ? "సమర్పిస్తున్నాము..." : "Publishing profile..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>{isTe ? "ప్రొఫైల్ ప్రచురించండి" : "Publish Matrimony Profile"}</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
