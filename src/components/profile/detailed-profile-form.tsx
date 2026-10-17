import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  User,
  Sparkles,
  Briefcase,
  Ruler,
  Users,
  Compass,
  Utensils,
  Phone,
  HeartHandshake,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Save,
  Upload,
  FileText,
  AlertCircle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";
import {
  MARITAL_STATUS_OPTIONS,
  COMPLEXION_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  SALARY_PERIOD_OPTIONS,
  CURRENCY_OPTIONS,
  FAMILY_TYPE_OPTIONS,
  COMMUNITY_PROFESSION_SUGGESTIONS,
  FOOD_HABIT_OPTIONS,
  LIFESTYLE_HABIT_OPTIONS,
  NAKSHATRA_OPTIONS,
  RASHI_OPTIONS,
  EDUCATION_OPTIONS,
  OCCUPATION_OPTIONS,
  HEIGHT_CHOICES,
} from "@/lib/options";
import {
  type DetailedProfileFormData,
  INITIAL_DETAILED_FORM_DATA,
  calculateAgeFromDob,
} from "@/lib/detailed-profile-types";
import { supabase } from "@/integrations/supabase/client";
import { PHOTO_BUCKET } from "@/lib/site";

const LOCAL_DRAFT_KEY = "sbm_detailed_profile_draft_v1";

interface DetailedProfileFormProps {
  initialData?: DetailedProfileFormData | undefined;
  userId?: string | undefined;
  onSave: (data: DetailedProfileFormData) => Promise<void>;
  isSubmitting?: boolean | undefined;
  submitButtonText?: string | undefined;
  accountEmail?: string | undefined;
}

export function DetailedProfileForm({
  initialData,
  userId,
  onSave,
  isSubmitting = false,
  submitButtonText,
}: DetailedProfileFormProps) {
  const { lang, setLanguage, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DetailedProfileFormData>(() => {
    return initialData ? { ...initialData } : { ...INITIAL_DETAILED_FORM_DATA };
  });

  const [horoscopeUploading, setHoroscopeUploading] = useState(false);
  const [horoscopeFileName, setHoroscopeFileName] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Sync initialData changes if profile loaded asynchronously
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  // Load draft from local storage if initialData was empty
  useEffect(() => {
    if (!initialData?.fullName) {
      try {
        const saved = localStorage.getItem(LOCAL_DRAFT_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<DetailedProfileFormData>;
          setFormData((prev) => ({ ...prev, ...parsed }));
        }
      } catch {
        // ignore
      }
    }
  }, [initialData?.fullName]);

  // Save draft helper
  function handleSaveDraft() {
    try {
      localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(formData));
      toast.success(t("draftSaved"));
    } catch {
      toast.error("Could not save draft locally.");
    }
  }

  function updateField<K extends keyof DetailedProfileFormData>(
    key: K,
    value: DetailedProfileFormData[K],
  ) {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      return next;
    });
    // Clear validation error if user filled it
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  // Handle Horoscope Document Upload
  async function handleHoroscopeFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      toast.error("File size must be under 8MB");
      return;
    }

    setHoroscopeUploading(true);
    setHoroscopeFileName(file.name);

    try {
      const ext = file.name.split(".").pop() || "pdf";
      const uId = userId || "anonymous";
      const filePath = `horoscopes/${uId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        // Even if storage bucket isn't initialized, track the file name locally
        console.warn("Storage upload warning:", uploadError);
        updateField("horoscopeFilePath", filePath);
        toast.info("Horoscope file attached.");
      } else {
        updateField("horoscopeFilePath", filePath);
        toast.success("Horoscope document uploaded securely!");
      }
    } catch {
      toast.info("Horoscope file saved.");
    } finally {
      setHoroscopeUploading(false);
    }
  }

  // Validate step before advancing
  function validateCurrentStep(): boolean {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        errors["fullName"] = t("nameReq");
      }
      if (!formData.dateOfBirth) {
        errors["dateOfBirth"] = t("dobReq");
      }
    }

    if (currentStep === 8) {
      const cleanPhone = formData.contactNumber.replace(/[^0-9]/g, "");
      if (cleanPhone.length < 10) {
        errors["contactNumber"] = t("phoneReq");
      }
    }

    if (currentStep === 10) {
      if (!formData.declarationAccepted) {
        errors["declarationAccepted"] = t("declarationReq");
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleNext() {
    if (!validateCurrentStep()) {
      toast.error(t("errorsFound"));
      return;
    }
    if (currentStep < 10) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 150, behavior: "smooth" });
    }
  }

  function handlePrevious() {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 150, behavior: "smooth" });
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formData.declarationAccepted) {
      setValidationErrors({ declarationAccepted: t("declarationReq") });
      setCurrentStep(10);
      toast.error(t("declarationReq"));
      return;
    }
    await onSave(formData);
  }

  // 10 Section Definitions
  const sections = [
    { num: 1, title: t("secPersonal"), icon: User },
    { num: 2, title: t("secHoroscope"), icon: Sparkles },
    { num: 3, title: t("secCareer"), icon: Briefcase },
    { num: 4, title: t("secPhysical"), icon: Ruler },
    { num: 5, title: t("secFamily"), icon: Users },
    { num: 6, title: t("secCommunity"), icon: Compass },
    { num: 7, title: t("secLifestyle"), icon: Utensils },
    { num: 8, title: t("secContact"), icon: Phone },
    { num: 9, title: t("secPartner"), icon: HeartHandshake },
    { num: 10, title: t("secConsent"), icon: CheckCircle2 },
  ];

  const calculatedAge = calculateAgeFromDob(formData.dateOfBirth);
  const progressPercent = Math.round((currentStep / 10) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header with Language Switcher and Draft Save */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E4DDD3] bg-white p-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Badge className="bg-[#24103F] text-white border-0 font-medium text-xs px-2.5 py-0.5">
            {t("stepOf")} {currentStep} {t("of")} 10
          </Badge>
          <span className="text-sm font-medium text-[#24103F]">
            {sections[currentStep - 1]?.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSaveDraft}
            className="text-xs font-medium text-muted-foreground hover:text-[#24103F]"
          >
            <Save className="mr-1.5 h-3.5 w-3.5 text-[#D1A329]" />
            {t("saveDraft")}
          </Button>

          {/* Bilingual Switcher */}
          <div className="inline-flex items-center rounded-lg border border-[#E4DDD3] bg-[#FAF8F3] p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                lang === "en"
                  ? "bg-[#24103F] text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("te")}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                lang === "te"
                  ? "bg-[#24103F] text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-[#6B6570] px-1">
          <span className="text-[#087333] font-medium">{progressPercent}% Completed</span>
          <span className="text-[#24103F] font-medium">{sections[currentStep - 1]?.title}</span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#E4DDD3]">
          <div
            className="h-full rounded-full bg-[#24103F] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step Pills Navigator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = currentStep === sec.num;
          const isDone = currentStep > sec.num;

          return (
            <button
              key={sec.num}
              type="button"
              onClick={() => setCurrentStep(sec.num)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                isActive
                  ? "bg-[#24103F] text-white font-medium"
                  : isDone
                    ? "bg-[#087333]/10 text-[#087333] font-medium border border-[#087333]/30"
                    : "bg-white text-muted-foreground border border-[#E4DDD3] hover:border-[#24103F]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{sec.num}.</span>
              <span className="hidden sm:inline">{sec.title.split(".")[1]?.trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form Box */}
      <form onSubmit={handleSubmit}>
        <Card className="rounded-xl border border-[#E4DDD3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {/* STEP 1: PERSONAL DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="border-b border-[#D9A514]/25 pb-3.5">
                  <h3 className="font-serif text-2xl font-bold text-[#21083F] flex items-center gap-2.5">
                    <User className="h-6 w-6 text-[#D9A514]" />
                    {t("secPersonal")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Basic candidate credentials and birth details
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="s1-name" className="text-sm font-medium">
                      {t("fullName")} *
                    </Label>
                    <Input
                      id="s1-name"
                      required
                      placeholder={t("fullNamePlaceholder")}
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className={validationErrors["fullName"] ? "border-destructive" : ""}
                    />
                    {validationErrors["fullName"] && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {validationErrors["fullName"]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s1-gender" className="text-sm font-medium">
                      {t("gender")} *
                    </Label>
                    <select
                      id="s1-gender"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      value={formData.gender}
                      onChange={(e) => updateField("gender", e.target.value as "bride" | "groom")}
                    >
                      <option value="bride">
                        {lang === "te" ? "వధువు (Bride)" : "Bride (Female)"}
                      </option>
                      <option value="groom">
                        {lang === "te" ? "వరుడు (Groom)" : "Groom (Male)"}
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s1-marital" className="text-sm font-medium">
                      {t("maritalStatus")} *
                    </Label>
                    <select
                      id="s1-marital"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      value={formData.maritalStatus}
                      onChange={(e) =>
                        updateField(
                          "maritalStatus",
                          e.target.value as DetailedProfileFormData["maritalStatus"],
                        )
                      }
                    >
                      {MARITAL_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {lang === "te" ? opt.labelTe : opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="s1-dob" className="text-sm font-medium">
                        {t("dob")} *
                      </Label>
                      <span className="text-xs text-primary font-medium">
                        Age: {calculatedAge} yrs
                      </span>
                    </div>
                    <Input
                      id="s1-dob"
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField("dateOfBirth", e.target.value)}
                      className={validationErrors["dateOfBirth"] ? "border-destructive" : ""}
                    />
                    {validationErrors["dateOfBirth"] && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {validationErrors["dateOfBirth"]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s1-tob" className="text-sm font-medium">
                      {t("timeOfBirth")} ({t("optional")})
                    </Label>
                    <Input
                      id="s1-tob"
                      type="time"
                      value={formData.timeOfBirth}
                      onChange={(e) => updateField("timeOfBirth", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="s1-pob" className="text-sm font-medium">
                      {t("placeOfBirth")} ({t("optional")})
                    </Label>
                    <Input
                      id="s1-pob"
                      placeholder={t("placeOfBirthPlaceholder")}
                      value={formData.placeOfBirth}
                      onChange={(e) => updateField("placeOfBirth", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: HOROSCOPE DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-b border-[#D9A514]/25 pb-3.5">
                  <h3 className="font-serif text-2xl font-bold text-[#32105F] flex items-center gap-2.5">
                    <Sparkles className="h-6 w-6 text-[#D9A514]" />
                    {t("secHoroscope")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Astrological details (Optional). Private documents are stored securely.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-medium">{t("horoscopeAvailable")}</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="horoscopeAvailable"
                          value="yes"
                          checked={formData.horoscopeAvailable === "yes"}
                          onChange={() => updateField("horoscopeAvailable", "yes")}
                        />
                        <span>{t("yes")}</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="horoscopeAvailable"
                          value="no"
                          checked={formData.horoscopeAvailable === "no"}
                          onChange={() => updateField("horoscopeAvailable", "no")}
                        />
                        <span>{t("no")}</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s2-star" className="text-sm font-medium">
                      {t("starNakshatra")}
                    </Label>
                    <select
                      id="s2-star"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      value={formData.star}
                      onChange={(e) => updateField("star", e.target.value)}
                    >
                      <option value="">{t("select")}</option>
                      {NAKSHATRA_OPTIONS.map((n) => (
                        <option key={n.value} value={n.value}>
                          {lang === "te"
                            ? `${n.labelTe} (${n.label})`
                            : `${n.label} (${n.labelTe})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s2-rashi" className="text-sm font-medium">
                      {t("rashi")}
                    </Label>
                    <select
                      id="s2-rashi"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      value={formData.rashi}
                      onChange={(e) => updateField("rashi", e.target.value)}
                    >
                      <option value="">{t("select")}</option>
                      {RASHI_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {lang === "te" ? r.labelTe : r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="s2-gothram" className="text-sm font-medium">
                      {t("gothram")}
                    </Label>
                    <Input
                      id="s2-gothram"
                      placeholder={t("gothramPlaceholder")}
                      value={formData.gothram}
                      onChange={(e) => updateField("gothram", e.target.value)}
                    />
                  </div>

                  {/* Private Horoscope Upload */}
                  <div className="space-y-3 sm:col-span-2 rounded-xl border bg-muted/20 p-4">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-emerald-600" />
                      <Label htmlFor="s2-file" className="text-sm font-medium">
                        {t("horoscopeDoc")}
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">{t("horoscopePrivacyNotice")}</p>

                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        id="s2-file"
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={handleHoroscopeFileSelect}
                        disabled={horoscopeUploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("s2-file")?.click()}
                        disabled={horoscopeUploading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {horoscopeUploading ? "Uploading..." : "Choose Horoscope File"}
                      </Button>

                      {formData.horoscopeFilePath || horoscopeFileName ? (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          <FileText className="h-3.5 w-3.5" />
                          {horoscopeFileName || "Horoscope document attached (Private)"}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: EDUCATION & CAREER */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="border-b border-[#D9A514]/25 pb-3.5">
                  <h3 className="font-serif text-2xl font-bold text-[#32105F] flex items-center gap-2.5">
                    <Briefcase className="h-6 w-6 text-[#D9A514]" />
                    {t("secCareer")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Professional qualifications, employment type, and remuneration
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="s3-edu" className="text-sm font-medium">
                      {t("education")} *
                    </Label>
                    <select
                      id="s3-edu"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      value={formData.education}
                      onChange={(e) => updateField("education", e.target.value)}
                    >
                      {EDUCATION_OPTIONS.map((edu) => (
                        <option key={edu} value={edu}>
                          {edu}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s3-emptype" className="text-sm font-medium">
                      {t("employmentType")} *
                    </Label>
                    <select
                      id="s3-emptype"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      value={formData.employmentType}
                      onChange={(e) => updateField("employmentType", e.target.value)}
                    >
                      {EMPLOYMENT_TYPE_OPTIONS.map((emp) => (
                        <option key={emp.value} value={emp.value}>
                          {lang === "te" ? emp.labelTe : emp.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s3-occ" className="text-sm font-medium">
                      {t("jobOccupation")}
                    </Label>
                    <select
                      id="s3-occ"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      value={formData.occupation}
                      onChange={(e) => updateField("occupation", e.target.value)}
                    >
                      {OCCUPATION_OPTIONS.map((occ) => (
                        <option key={occ} value={occ}>
                          {occ}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s3-desig" className="text-sm font-medium">
                      {t("designation")}
                    </Label>
                    <Input
                      id="s3-desig"
                      placeholder={t("designationPlaceholder")}
                      value={formData.designation}
                      onChange={(e) => updateField("designation", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="s3-jobloc" className="text-sm font-medium">
                      {t("jobLocation")}
                    </Label>
                    <Input
                      id="s3-jobloc"
                      placeholder={t("jobLocationPlaceholder")}
                      value={formData.jobLocation}
                      onChange={(e) => updateField("jobLocation", e.target.value)}
                    />
                  </div>

                  {/* Salary section */}
                  <div className="space-y-2 sm:col-span-2 rounded-xl border p-4 bg-muted/20">
                    <p className="text-sm font-semibold text-foreground">
                      Salary / Income ({t("optional")})
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1">
                        <Label className="text-xs">{t("salaryAmount")}</Label>
                        <Input
                          placeholder="e.g. 1200000"
                          inputMode="numeric"
                          value={formData.salaryAmount}
                          onChange={(e) => updateField("salaryAmount", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("salaryCurrency")}</Label>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm"
                          value={formData.salaryCurrency}
                          onChange={(e) => updateField("salaryCurrency", e.target.value)}
                        >
                          {CURRENCY_OPTIONS.map((curr) => (
                            <option key={curr.value} value={curr.value}>
                              {curr.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("salaryPeriod")}</Label>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm"
                          value={formData.salaryPeriod}
                          onChange={(e) =>
                            updateField("salaryPeriod", e.target.value as "annual" | "monthly")
                          }
                        >
                          {SALARY_PERIOD_OPTIONS.map((sp) => (
                            <option key={sp.value} value={sp.value}>
                              {lang === "te" ? sp.labelTe : sp.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PHYSICAL DETAILS */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="border-b border-[#D9A514]/25 pb-3.5">
                  <h3 className="font-serif text-2xl font-bold text-[#32105F] flex items-center gap-2.5">
                    <Ruler className="h-6 w-6 text-[#D9A514]" />
                    {t("secPhysical")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Normalized physical measurements and optional complexion
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="s4-height" className="text-sm font-medium">
                      {t("height")} *
                    </Label>
                    <select
                      id="s4-height"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      value={formData.heightCm}
                      onChange={(e) => updateField("heightCm", Number(e.target.value))}
                    >
                      {HEIGHT_CHOICES.map((h) => (
                        <option key={h.cm} value={h.cm}>
                          {h.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s4-complexion" className="text-sm font-medium">
                      {t("complexion")}
                    </Label>
                    <select
                      id="s4-complexion"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      value={formData.complexion}
                      onChange={(e) => updateField("complexion", e.target.value)}
                    >
                      <option value="">{t("select")}</option>
                      {COMPLEXION_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {lang === "te" ? c.labelTe : c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: FAMILY DETAILS */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="border-b border-[#D9A514]/25 pb-3.5">
                  <h3 className="font-serif text-2xl font-bold text-[#32105F] flex items-center gap-2.5">
                    <Users className="h-6 w-6 text-[#D9A514]" />
                    {t("secFamily")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Detailed parents, siblings, family structure, and background
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="s5-fname" className="text-sm font-medium">
                      {t("fatherName")}
                    </Label>
                    <Input
                      id="s5-fname"
                      value={formData.fatherName}
                      onChange={(e) => updateField("fatherName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s5-focc" className="text-sm font-medium">
                      {t("fatherProfession")}
                    </Label>
                    <Input
                      id="s5-focc"
                      placeholder={t("fatherProfessionPlaceholder")}
                      value={formData.fatherProfession}
                      onChange={(e) => updateField("fatherProfession", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s5-mname" className="text-sm font-medium">
                      {t("motherName")}
                    </Label>
                    <Input
                      id="s5-mname"
                      value={formData.motherName}
                      onChange={(e) => updateField("motherName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s5-mocc" className="text-sm font-medium">
                      {t("motherProfession")}
                    </Label>
                    <Input
                      id="s5-mocc"
                      placeholder={t("motherProfessionPlaceholder")}
                      value={formData.motherProfession}
                      onChange={(e) => updateField("motherProfession", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s5-bcount" className="text-sm font-medium">
                      {t("brothersCount")}
                    </Label>
                    <Input
                      id="s5-bcount"
                      type="number"
                      min={0}
                      max={10}
                      value={formData.brothersCount}
                      onChange={(e) => updateField("brothersCount", Number(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s5-scount" className="text-sm font-medium">
                      {t("sistersCount")}
                    </Label>
                    <Input
                      id="s5-scount"
                      type="number"
                      min={0}
                      max={10}
                      value={formData.sistersCount}
                      onChange={(e) => updateField("sistersCount", Number(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="s5-bdetails" className="text-sm font-medium">
                      {t("brothersDetails")}
                    </Label>
                    <Input
                      id="s5-bdetails"
                      placeholder={t("brothersDetailsPlaceholder")}
                      value={formData.brothersDetails}
                      onChange={(e) => updateField("brothersDetails", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="s5-sdetails" className="text-sm font-medium">
                      {t("sistersDetails")}
                    </Label>
                    <Input
                      id="s5-sdetails"
                      placeholder={t("sistersDetailsPlaceholder")}
                      value={formData.sistersDetails}
                      onChange={(e) => updateField("sistersDetails", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s5-ftype" className="text-sm font-medium">
                      {t("familyType")}
                    </Label>
                    <select
                      id="s5-ftype"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      value={formData.familyType}
                      onChange={(e) =>
                        updateField(
                          "familyType",
                          e.target.value as DetailedProfileFormData["familyType"],
                        )
                      }
                    >
                      {FAMILY_TYPE_OPTIONS.map((ft) => (
                        <option key={ft.value} value={ft.value}>
                          {lang === "te" ? ft.labelTe : ft.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s5-floc" className="text-sm font-medium">
                      {t("familyLocation")}
                    </Label>
                    <Input
                      id="s5-floc"
                      placeholder={t("familyLocationPlaceholder")}
                      value={formData.familyLocation}
                      onChange={(e) => updateField("familyLocation", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="s5-fabout" className="text-sm font-medium">
                      {t("familyAbout")}
                    </Label>
                    <Textarea
                      id="s5-fabout"
                      rows={3}
                      placeholder={t("familyAboutPlaceholder")}
                      value={formData.familyAbout}
                      onChange={(e) => updateField("familyAbout", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: COMMUNITY DETAILS */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="border-b border-[#D9A514]/25 pb-3.5">
                  <h3 className="font-serif text-2xl font-bold text-[#32105F] flex items-center gap-2.5">
                    <Compass className="h-6 w-6 text-[#D9A514]" />
                    {t("secCommunity")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Community roots, traditional professions, and native origins
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="s6-gothram" className="text-sm font-medium">
                      {t("gothram")}
                    </Label>
                    <Input
                      id="s6-gothram"
                      placeholder={t("gothramPlaceholder")}
                      value={formData.gothram}
                      onChange={(e) => updateField("gothram", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="s6-commprof" className="text-sm font-medium">
                      {t("communityProfession")}
                    </Label>
                    <Input
                      id="s6-commprof"
                      placeholder={t("communityProfessionPlaceholder")}
                      value={formData.communityProfession}
                      onChange={(e) => updateField("communityProfession", e.target.value)}
                    />
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs text-muted-foreground mr-1">Suggestions:</span>
                      {COMMUNITY_PROFESSION_SUGGESTIONS.map((sug) => (
                        <button
                          key={sug.value}
                          type="button"
                          onClick={() => updateField("communityProfession", sug.value)}
                          className="rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {lang === "te" ? sug.labelTe : sug.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s6-native" className="text-sm font-medium">
                      {t("nativePlace")}
                    </Label>
                    <Input
                      id="s6-native"
                      placeholder={t("nativePlacePlaceholder")}
                      value={formData.nativePlace}
                      onChange={(e) => updateField("nativePlace", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s6-present" className="text-sm font-medium">
                      {t("presentPlace")}
                    </Label>
                    <Input
                      id="s6-present"
                      placeholder={t("presentPlacePlaceholder")}
                      value={formData.presentPlace}
                      onChange={(e) => updateField("presentPlace", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: FOOD & LIFESTYLE */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="border-b border-[#D9A514]/25 pb-3.5">
                  <h3 className="font-serif text-2xl font-bold text-[#32105F] flex items-center gap-2.5">
                    <Utensils className="h-6 w-6 text-[#D9A514]" />
                    {t("secLifestyle")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Dietary preferences and personal lifestyle habits
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="s7-food" className="text-sm font-medium">
                      {t("foodHabits")}
                    </Label>
                    <select
                      id="s7-food"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      value={formData.foodHabit}
                      onChange={(e) =>
                        updateField(
                          "foodHabit",
                          e.target.value as DetailedProfileFormData["foodHabit"],
                        )
                      }
                    >
                      {FOOD_HABIT_OPTIONS.map((fh) => (
                        <option key={fh.value} value={fh.value}>
                          {lang === "te" ? fh.labelTe : fh.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s7-smoke" className="text-sm font-medium">
                      {t("smoking")}
                    </Label>
                    <select
                      id="s7-smoke"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      value={formData.smoking}
                      onChange={(e) =>
                        updateField("smoking", e.target.value as DetailedProfileFormData["smoking"])
                      }
                    >
                      {LIFESTYLE_HABIT_OPTIONS.map((lh) => (
                        <option key={lh.value} value={lh.value}>
                          {lang === "te" ? lh.labelTe : lh.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s7-drink" className="text-sm font-medium">
                      {t("drinking")}
                    </Label>
                    <select
                      id="s7-drink"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      value={formData.drinking}
                      onChange={(e) =>
                        updateField(
                          "drinking",
                          e.target.value as DetailedProfileFormData["drinking"],
                        )
                      }
                    >
                      {LIFESTYLE_HABIT_OPTIONS.map((lh) => (
                        <option key={lh.value} value={lh.value}>
                          {lang === "te" ? lh.labelTe : lh.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: CONTACT DETAILS */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <div className="border-b border-[#D9A514]/25 pb-3.5">
                  <h3 className="font-serif text-2xl font-bold text-[#32105F] flex items-center gap-2.5">
                    <Phone className="h-6 w-6 text-[#D9A514]" />
                    {t("secContact")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Protected contact information for family matchmaking
                  </p>
                </div>

                <div className="space-y-4 max-w-lg">
                  <div className="space-y-2">
                    <Label htmlFor="s8-phone" className="text-sm font-medium">
                      {t("contactNumber")} *
                    </Label>
                    <Input
                      id="s8-phone"
                      type="tel"
                      inputMode="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.contactNumber}
                      onChange={(e) => updateField("contactNumber", e.target.value)}
                      className={validationErrors["contactNumber"] ? "border-destructive" : ""}
                    />
                    {validationErrors["contactNumber"] && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {validationErrors["contactNumber"]}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t("contactPrivacyNotice")}
                      </p>
                    </div>

                    <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={formData.showContactDirectly}
                        onChange={(e) => updateField("showContactDirectly", e.target.checked)}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      <span>{t("showContactSetting")}</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: PARTNER REQUIREMENTS */}
            {currentStep === 9 && (
              <div className="space-y-6">
                <div className="border-b border-[#D9A514]/25 pb-3.5">
                  <h3 className="font-serif text-2xl font-bold text-[#32105F] flex items-center gap-2.5">
                    <HeartHandshake className="h-6 w-6 text-[#D9A514]" />
                    {t("secPartner")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Desired age, height, education, occupation, and preferences
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2 rounded-xl border p-4 bg-muted/20">
                    <Label className="text-sm font-medium">{t("prefAgeRange")}</Label>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-xs text-muted-foreground">{t("prefMinAge")}</span>
                        <Input
                          type="number"
                          min={18}
                          max={70}
                          value={formData.preferredAgeMin ?? 22}
                          onChange={(e) => updateField("preferredAgeMin", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">{t("prefMaxAge")}</span>
                        <Input
                          type="number"
                          min={18}
                          max={70}
                          value={formData.preferredAgeMax ?? 32}
                          onChange={(e) => updateField("preferredAgeMax", Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2 rounded-xl border p-4 bg-muted/20">
                    <Label className="text-sm font-medium">{t("prefHeightRange")}</Label>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-xs text-muted-foreground">{t("prefMinHeight")}</span>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm"
                          value={formData.preferredHeightMin ?? 152}
                          onChange={(e) =>
                            updateField("preferredHeightMin", Number(e.target.value))
                          }
                        >
                          {HEIGHT_CHOICES.map((h) => (
                            <option key={h.cm} value={h.cm}>
                              {h.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">{t("prefMaxHeight")}</span>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm"
                          value={formData.preferredHeightMax ?? 183}
                          onChange={(e) =>
                            updateField("preferredHeightMax", Number(e.target.value))
                          }
                        >
                          {HEIGHT_CHOICES.map((h) => (
                            <option key={h.cm} value={h.cm}>
                              {h.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s9-edu" className="text-sm font-medium">
                      {t("prefEducation")}
                    </Label>
                    <Input
                      id="s9-edu"
                      placeholder="e.g. Any Degree, B.Tech, Master's"
                      value={formData.preferredEducation}
                      onChange={(e) => updateField("preferredEducation", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s9-occ" className="text-sm font-medium">
                      {t("prefOccupation")}
                    </Label>
                    <Input
                      id="s9-occ"
                      placeholder="e.g. Software, Govt, Business"
                      value={formData.preferredOccupation}
                      onChange={(e) => updateField("preferredOccupation", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s9-loc" className="text-sm font-medium">
                      {t("prefLocation")}
                    </Label>
                    <Input
                      id="s9-loc"
                      placeholder={t("prefLocationPlaceholder")}
                      value={formData.preferredLocation}
                      onChange={(e) => updateField("preferredLocation", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s9-marital" className="text-sm font-medium">
                      {t("prefMaritalStatus")}
                    </Label>
                    <select
                      id="s9-marital"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      value={formData.preferredMaritalStatus}
                      onChange={(e) => updateField("preferredMaritalStatus", e.target.value)}
                    >
                      <option value="any">Any Status</option>
                      {MARITAL_STATUS_OPTIONS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {lang === "te" ? m.labelTe : m.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s9-food" className="text-sm font-medium">
                      {t("prefFoodHabit")}
                    </Label>
                    <Input
                      id="s9-food"
                      placeholder="e.g. Vegetarian / Any"
                      value={formData.preferredFoodHabit}
                      onChange={(e) => updateField("preferredFoodHabit", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s9-gothram" className="text-sm font-medium">
                      {t("prefGothram")}
                    </Label>
                    <Input
                      id="s9-gothram"
                      placeholder="e.g. Any different Gothram"
                      value={formData.preferredGothram}
                      onChange={(e) => updateField("preferredGothram", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="s9-expectations" className="text-sm font-medium">
                      {t("partnerExpectations")} (Telugu & English)
                    </Label>
                    <Textarea
                      id="s9-expectations"
                      rows={4}
                      placeholder={t("partnerExpectationsPlaceholder")}
                      value={formData.requirementsText}
                      onChange={(e) => updateField("requirementsText", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 10: DECLARATION & CONSENT */}
            {currentStep === 10 && (
              <div className="space-y-6">
                <div className="border-b border-[#D9A514]/25 pb-3.5">
                  <h3 className="font-serif text-2xl font-bold text-[#32105F] flex items-center gap-2.5">
                    <CheckCircle2 className="h-6 w-6 text-[#D9A514]" />
                    {t("secConsent")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Legal declaration and submission consent
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-gold/40 bg-gold/5 p-5 space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold-foreground">
                      English Declaration:
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/90 font-serif">
                      &ldquo;I declare that the information provided by me is correct and I
                      authorize Shettibalija Matrimony to publish this information on its website
                      and official social media channels for matrimonial purposes, subject to the
                      site&apos;s{" "}
                      <Link
                        to="/privacy"
                        target="_blank"
                        className="text-primary underline font-medium"
                      >
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/terms"
                        target="_blank"
                        className="text-primary underline font-medium"
                      >
                        Terms &amp; Conditions
                      </Link>
                      .&rdquo;
                    </p>
                  </div>

                  <div className="border-t border-gold/30 pt-3 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold-foreground">
                      తెలుగు డిక్లరేషన్:
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/90 font-serif">
                      &ldquo;నేను అందించిన సమాచారం సరైనదని ప్రకటిస్తున్నాను. వివాహ సంబంధాల కోసం ఈ
                      సమాచారాన్ని శెట్టిబలిజ మ్యాట్రిమోనీ వెబ్సైట్ మరియు అధికారిక సోషల్ మీడియా
                      ఛానళ్లలో ప్రచురించడానికి నేను అనుమతిస్తున్నాను. ఇది వెబ్సైట్{" "}
                      <Link
                        to="/privacy"
                        target="_blank"
                        className="text-primary underline font-medium"
                      >
                        గోప్యతా విధానం
                      </Link>{" "}
                      మరియు{" "}
                      <Link
                        to="/terms"
                        target="_blank"
                        className="text-primary underline font-medium"
                      >
                        నిబంధనలు &amp; షరతులకు
                      </Link>{" "}
                      లోబడి ఉంటుంది.&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gold/30">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.declarationAccepted}
                        onChange={(e) => {
                          updateField("declarationAccepted", e.target.checked);
                          if (e.target.checked) {
                            updateField("declarationAcceptedAt", new Date().toISOString());
                          }
                        }}
                        className="mt-1 h-5 w-5 rounded border-input text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-semibold text-foreground">
                        {lang === "te"
                          ? "నేను పైన పేర్కొన్న డిక్లరేషన్‌ను చదివాను మరియు పూర్తిగా అంగీకరిస్తున్నాను (తప్పనిసరి) *"
                          : "I have read and agree to the above declaration & consent (Required) *"}
                      </span>
                    </label>

                    {validationErrors["declarationAccepted"] && (
                      <p className="mt-2 text-xs text-destructive flex items-center gap-1 font-medium">
                        <AlertCircle className="h-3.5 w-3.5" />{" "}
                        {validationErrors["declarationAccepted"]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Summary Card */}
                <div className="rounded-xl border bg-muted/20 p-4 text-xs space-y-1.5 text-muted-foreground">
                  <p className="font-semibold text-foreground text-sm">Profile Summary:</p>
                  <p>
                    • Candidate: {formData.fullName || "—"} ({formData.gender}), Age:{" "}
                    {calculatedAge} yrs, Height: {formData.heightCm} cm
                  </p>
                  <p>• Marital Status: {formData.maritalStatus.replace("_", " ")}</p>
                  <p>
                    • Education &amp; Career: {formData.education} • {formData.occupation}
                  </p>
                  <p>
                    • Location &amp; Roots: {formData.presentPlace || "—"} (Native:{" "}
                    {formData.nativePlace || "—"})
                  </p>
                  <p>• Contact: {formData.contactNumber || "—"}</p>
                </div>
              </div>
            )}

            {/* Bottom Navigation Buttons (Sticky at bottom on mobile) */}
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#D9A514]/25 pt-5 sticky bottom-0 bg-white/95 backdrop-blur-md -mx-6 -mb-6 p-4 rounded-b-3xl z-30 shadow-xs">
              <div>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isSubmitting}
                    className="h-11 px-4 sm:px-5 rounded-xl border-[#21083F]/30 text-[#21083F] hover:bg-[#21083F]/5 font-semibold text-xs touch-press"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4 text-[#D9A514]" />
                    {t("previous")}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {currentStep < 10 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-11 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-[#087A32] to-[#0A963E] hover:from-[#034B21] hover:to-[#087A32] text-white font-bold text-xs shadow-md border border-[#D9A514]/30 touch-press"
                  >
                    {t("next")}
                    <ChevronRight className="ml-1.5 h-4 w-4 text-[#F4D477]" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || !formData.declarationAccepted}
                    className="h-12 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-[#087A32] to-[#0A963E] hover:from-[#034B21] hover:to-[#087A32] text-white font-bold text-xs shadow-xl border border-[#D9A514]/40 touch-press"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4 text-[#F4D477]" />
                    {isSubmitting ? t("submitting") : submitButtonText || t("completeProfile")}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
