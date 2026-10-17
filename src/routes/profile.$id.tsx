import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Heart,
  Send,
  PhoneCall,
  Flag,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  User,
  Sparkles,
  Users,
  Compass,
  Utensils,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ProtectedPhoto } from "@/components/profiles/protected-photo";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useProfileActions } from "@/hooks/use-profile-actions";
import { supabase } from "@/integrations/supabase/client";
import { formatHeight, locationLine } from "@/lib/format";
import { REPORT_REASONS } from "@/lib/options";
import { SITE_NAME } from "@/lib/site";
import { useLanguage } from "@/lib/i18n";
import { findDemoProfile } from "@/data/demo-profiles";
import { deserializeDetailedData } from "@/lib/detailed-profile-api";

export const Route = createFileRoute("/profile/$id")({
  component: ProfileDetailPage,
  head: () => ({
    meta: [
      { title: `Profile Details | ${SITE_NAME}` },
      { name: "description", content: "View member matrimonial profile details" },
    ],
  }),
});

export function ProfileDetailPage() {
  const { lang, t } = useLanguage();
  const { id, code } = useParams({ strict: false }) as { id?: string; code?: string };
  const identifier = id || code;
  const actions = useProfileActions();
  const [reportReason, setReportReason] = useState<string>(REPORT_REASONS[0] ?? "Other");
  const [reportOpen, setReportOpen] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["profile-detail", identifier],
    enabled: Boolean(identifier),
    queryFn: async () => {
      if (!identifier) return null;

      // Check if it matches a demo profile first
      const demo = findDemoProfile(identifier);
      if (demo) return demo;

      // Try finding by id first in approved profiles
      const { data: byId } = await supabase
        .from("approved_matrimonial_profiles")
        .select("*")
        .eq("id", identifier)
        .maybeSingle();

      if (byId) return byId;

      // Try finding by profile_code
      const { data: byCode } = await supabase
        .from("approved_matrimonial_profiles")
        .select("*")
        .eq("profile_code", identifier)
        .maybeSingle();

      let rawProfile = null;
      if (!byId && !byCode) {
        const { data: raw } = await supabase
          .from("matrimonial_profiles")
          .select("*")
          .or(`id.eq.${identifier},profile_code.eq.${identifier}`)
          .maybeSingle();
        rawProfile = raw;
      }

      const found = byId || byCode || rawProfile;
      if (!found || !found.id) return null;

      // Query companion tables if accessible
      let priv = null;
      try {
        const { data: privData } = await supabase
          .from("profile_private_details")
          .select("*")
          .eq("profile_id", found.id)
          .maybeSingle();
        priv = privData;
      } catch {
        // restricted
      }

      let prefs = null;
      try {
        const { data: prefData } = await supabase
          .from("partner_preferences")
          .select("*")
          .eq("profile_id", found.id)
          .maybeSingle();
        prefs = prefData;
      } catch {
        // restricted
      }

      return {
        ...found,
        _privateDetails: priv,
        _partnerPreferences: prefs,
      };
    },
  });

  if (profileQuery.isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
          <Skeleton className="h-96 rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <ErrorState
          title="Could not load profile"
          description="There was an error retrieving this matrimonial profile."
          onRetry={() => void profileQuery.refetch()}
        />
      </div>
    );
  }

  const profile = profileQuery.data;

  if (!profile || !profile.id) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          title="Profile not found"
          description="This profile does not exist or may still be pending administrative approval."
        >
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="outline">
              <Link to="/search">Browse Other Profiles</Link>
            </Button>
          </div>
        </EmptyState>
      </div>
    );
  }

  const profileId = profile.id;
  const isShortlisted = actions.shortlistedIds.has(profileId);
  const isInterestSent = actions.sentInterests.has(profileId);
  const displayName = profile.display_name || "Member";

  // Extract structured metadata from privateDetails.family_description if present
  const pRecord = profile as Record<string, unknown>;
  const privObj = pRecord["_privateDetails"] as Record<string, unknown> | null | undefined;
  const rawMeta = privObj ? privObj["family_description"] : null;
  const parsedMeta = deserializeDetailedData(typeof rawMeta === "string" ? rawMeta : null);

  // Computed / merged profile attributes
  const privRecord = (pRecord["_privateDetails"] as Record<string, unknown> | null) || {};
  const prefRecord =
    (pRecord["_partnerPreferences"] as Record<string, unknown> | null) ||
    (pRecord["partner_preferences"] as Record<string, unknown> | null) ||
    {};

  const star = parsedMeta?.star || (pRecord["star"] as string) || (pRecord["nakshatra"] as string);
  const rashi = parsedMeta?.rashi || (pRecord["rashi"] as string);
  const gothram = parsedMeta?.gothram || (pRecord["gothram"] as string);
  const horoscopeAvailable =
    parsedMeta?.horoscopeAvailable || (pRecord["horoscope_available"] ? "yes" : undefined);
  const designation = parsedMeta?.designation || (pRecord["designation"] as string);
  const jobLocation = parsedMeta?.jobLocation || (pRecord["job_location"] as string);
  const employmentType = parsedMeta?.employmentType || (pRecord["employment_type"] as string);
  const salaryAmount = parsedMeta?.salaryAmount || (pRecord["salary_amount"] as string);
  const salaryCurrency =
    parsedMeta?.salaryCurrency || (pRecord["salary_currency"] as string) || "INR";
  const salaryPeriod = parsedMeta?.salaryPeriod || (pRecord["salary_period"] as string) || "annual";
  const complexion = parsedMeta?.complexion || (pRecord["complexion"] as string);
  const communityProfession =
    parsedMeta?.communityProfession || (pRecord["community_profession"] as string);
  const foodHabit = parsedMeta?.foodHabit || (pRecord["food_habit"] as string);
  const smoking = parsedMeta?.smoking || (pRecord["smoking_habit"] as string);
  const drinking = parsedMeta?.drinking || (pRecord["drinking_habit"] as string);
  const fatherName = parsedMeta?.fatherName || (pRecord["father_name"] as string);
  const fatherProfession =
    parsedMeta?.fatherProfession ||
    (privRecord["father_occupation"] as string) ||
    (pRecord["father_profession"] as string);
  const motherName = parsedMeta?.motherName || (pRecord["mother_name"] as string);
  const motherProfession =
    parsedMeta?.motherProfession ||
    (privRecord["mother_occupation"] as string) ||
    (pRecord["mother_profession"] as string);
  const brothersDetails = parsedMeta?.brothersDetails || (pRecord["brothers_details"] as string);
  const sistersDetails = parsedMeta?.sistersDetails || (pRecord["sisters_details"] as string);
  const familyType =
    parsedMeta?.familyType ||
    (privRecord["family_type"] as string) ||
    (pRecord["family_type"] as string);
  const familyLocation =
    parsedMeta?.familyLocation ||
    (privRecord["family_location"] as string) ||
    (pRecord["family_location"] as string);

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs font-medium text-muted-foreground hover:text-[#24103F]"
          >
            <Link to="/search">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5 text-[#D1A329]" />
              {lang === "te" ? "శోధనకు తిరిగి వెళ్లండి" : "Back to Search"}
            </Link>
          </Button>

          <span className="text-xs font-semibold tracking-wide text-[#087333]">
            {SITE_NAME} • {profile.profile_code || "PROFILE"}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          {/* Left Column: Photo & Action Panel (Sticky on Desktop) */}
          <div className="space-y-4">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Photo Box — Handcrafted luxury album mount */}
              <div
                className="relative rounded-2xl p-2.5 sm:p-3 transition-all duration-300"
                style={{
                  background: "linear-gradient(150deg, #ffffff 0%, #FAF8F3 100%)",
                  border: "1px solid rgba(209,163,41,0.30)",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.95), 0 8px 30px rgba(36,16,63,0.08), 0 2px 6px rgba(36,16,63,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                {/* Architectural corner brackets */}
                <span className="arch-corner arch-corner-tl" style={{ width: 16, height: 16, top: 8, left: 8 }} />
                <span className="arch-corner arch-corner-tr" style={{ width: 16, height: 16, top: 8, right: 8 }} />
                <span className="arch-corner arch-corner-bl" style={{ width: 16, height: 16, bottom: 8, left: 8 }} />
                <span className="arch-corner arch-corner-br" style={{ width: 16, height: 16, bottom: 8, right: 8 }} />

                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#FAF8F3] shadow-xs">
                  <ProtectedPhoto
                    profileId={profileId}
                    displayName={displayName}
                    photoUrl={(profile as { photo_url?: string | null })?.photo_url}
                    className="h-full w-full object-cover"
                  />

                  {/* Insignia overlay badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-[#24103F]/90 px-3 py-1 text-[11px] font-medium text-[#FAF8F3] backdrop-blur-xs border border-[#D1A329]/40 shadow-xs">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#D1A329]" />
                    <span>Verified Profile</span>
                  </div>
                </div>

                <div className="p-3 pt-4 text-center">
                  <p className="font-serif text-xl font-medium text-[#24103F] truncate">
                    {displayName}, {profile.age ?? "—"}
                  </p>
                  <p className="flex items-center justify-center gap-1 text-xs text-[#6B6570] mt-1">
                    <MapPin className="h-3.5 w-3.5 text-[#D1A329]" />
                    {locationLine(profile.city, profile.state) || "Andhra Pradesh"}
                  </p>
                </div>
              </div>

              {/* Action Buttons — Physical press depth */}
              <div className="space-y-2.5">
                {/* Primary CTA: Send Interest */}
                <Button
                  className={`w-full py-5 text-sm font-semibold transition-all rounded-md shadow-[0_2px_8px_rgba(36,16,63,0.20)] active:translate-y-px ${
                    isInterestSent
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-[#24103F] hover:bg-[#311552] text-white"
                  }`}
                  disabled={isInterestSent}
                  onClick={() => actions.sendInterest.mutate(profileId)}
                >
                  <Send className="mr-2 h-4 w-4 text-[#D1A329]" />
                  {isInterestSent
                    ? lang === "te"
                      ? "ఆసక్తి పంపబడింది"
                      : "Interest Sent"
                    : lang === "te"
                      ? "ఆసక్తిని పంపండి"
                      : "Send Interest"}
                </Button>

                {/* Secondary Actions: Shortlist & Contact Info */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className={`w-full py-5 text-xs font-medium rounded-md border-[#E4DDD3] hover:border-[#24103F] active:translate-y-px transition-all shadow-xs ${
                      isShortlisted ? "bg-rose-50 text-rose-700 border-rose-300" : "text-[#24103F] bg-white"
                    }`}
                    onClick={() => actions.toggleShortlist.mutate(profileId)}
                  >
                    <Heart
                      className={`mr-1.5 h-4 w-4 ${
                        isShortlisted ? "fill-rose-500 text-rose-500" : "text-[#D1A329]"
                      }`}
                    />
                    {isShortlisted
                      ? lang === "te"
                        ? "షార్ట్‌లిస్ట్ చేయబడింది"
                        : "Shortlisted"
                      : lang === "te"
                        ? "షార్ట్‌లిస్ట్"
                        : "Shortlist"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full py-5 text-xs font-medium rounded-md border-[#E4DDD3] hover:border-[#24103F] text-[#24103F] bg-white active:translate-y-px transition-all shadow-xs"
                    onClick={() => actions.sendContactRequest.mutate(profileId)}
                  >
                    <PhoneCall className="mr-1.5 h-4 w-4 text-[#087333]" />
                    {lang === "te" ? "సంప్రదింపు వివరాలు" : "Contact Info"}
                  </Button>
                </div>

                {/* Report Profile Link */}
                <Dialog open={reportOpen} onOpenChange={setReportOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Flag className="mr-1.5 h-3.5 w-3.5" />
                      {lang === "te" ? "ఈ ప్రొఫైల్‌ను నివేదించండి" : "Report this profile"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-xl border border-[#E4DDD3]">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-xl text-[#21083F]">
                        Report Matrimonial Profile
                      </DialogTitle>
                      <DialogDescription>
                        Help us maintain a safe, authentic community. All reports are confidential
                        and reviewed by community administrators.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-3">
                      <label className="text-sm font-medium text-foreground">
                        Reason for reporting
                      </label>
                      <select
                        className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                      >
                        {REPORT_REASONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setReportOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          actions.reportProfile.mutate({ profileId, reason: reportReason });
                          setReportOpen(false);
                        }}
                      >
                        Submit Report
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Information Cards */}
          <div className="space-y-6">
            {/* Main Profile Summary Banner — Luxury Wedding Album Page */}
            <div
              className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #ffffff 0%, #FAF8F3 100%)",
                border: "1px solid rgba(209,163,41,0.30)",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.95), 0 6px 20px rgba(36,16,63,0.06), 0 1px 3px rgba(36,16,63,0.04), inset 0 1px 0 rgba(255,255,255,0.85)",
              }}
            >
              {/* Subtle gold architectural corner brackets */}
              <span className="arch-corner arch-corner-tl" style={{ width: 18, height: 18, top: 10, left: 10 }} />
              <span className="arch-corner arch-corner-tr" style={{ width: 18, height: 18, top: 10, right: 10 }} />

              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold tracking-wider text-[#087333]">
                  {profile.profile_code || "PROFILE"}
                </span>
                {(profile as { is_demo?: boolean }).is_demo ? (
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-800 border-amber-200 text-xs font-normal"
                  >
                    Demo Profile
                  </Badge>
                ) : null}
                <Badge
                  variant="outline"
                  className="border-[#D1A329]/40 bg-white/80 text-[#087333] text-xs font-normal shadow-2xs"
                >
                  <ShieldCheck className="mr-1 h-3.5 w-3.5 text-[#087333]" />
                  Verified Shettibalija Member
                </Badge>
              </div>

              <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#24103F]">
                {displayName}, {profile.age ?? "—"}
              </h1>

              <p className="mt-1 flex items-center gap-1.5 text-sm text-[#6B6570]">
                <MapPin className="h-4 w-4 text-[#D1A329]" />
                {locationLine(profile.city, profile.state) || "Location not specified"}
              </p>

              {/* Fast highlights grid */}
              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="rounded-lg border border-[#E4DDD3] bg-[#FAF8F3] p-3">
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-[#6B6570]">
                    Marital Status
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-[#24103F] capitalize truncate">
                    {(profile.marital_status || "Never Married").replace("_", " ")}
                  </p>
                </div>

                <div className="rounded-lg border border-[#E4DDD3] bg-[#FAF8F3] p-3">
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-[#6B6570]">
                    Height
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-[#24103F] truncate">
                    {formatHeight(profile.height_cm)}
                  </p>
                </div>

                <div className="rounded-lg border border-[#E4DDD3] bg-[#FAF8F3] p-3">
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-[#6B6570]">
                    Education
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-[#24103F] truncate">
                    {profile.education || "Graduate"}
                  </p>
                </div>

                <div className="rounded-lg border border-[#E4DDD3] bg-[#FAF8F3] p-3">
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-[#6B6570]">
                    Occupation
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-[#24103F] truncate">
                    {profile.occupation || "Professional"}
                  </p>
                </div>
              </div>
            </div>

            {/* 7 Structured Profile Sections in an Accordion (collapsible on mobile, open by default) */}
            <Accordion
              type="multiple"
              defaultValue={[
                "personal",
                "horoscope",
                "career",
                "family",
                "community",
                "lifestyle",
                "partner",
              ]}
              className="space-y-4"
            >
              {/* 1. PERSONAL DETAILS */}
              <AccordionItem
                value="personal"
                className="rounded-xl border border-[#E4DDD3] bg-white overflow-hidden px-5 sm:px-6 border-b-0"
              >
                <AccordionTrigger className="py-5 font-serif text-lg font-bold text-[#21083F] hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-[#D9A514]" />
                    <span>{lang === "te" ? "వ్యక్తిగత వివరాలు" : "Personal Details"}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-1">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Age &amp; Height</p>
                      <p className="font-semibold text-foreground">
                        {profile.age ?? "—"} yrs • {formatHeight(profile.height_cm)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Marital Status</p>
                      <p className="font-semibold text-foreground capitalize">
                        {(profile.marital_status || "Never Married").replace("_", " ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Gender</p>
                      <p className="font-semibold text-foreground capitalize">
                        {profile.gender || "—"}
                      </p>
                    </div>
                    {complexion ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Complexion</p>
                        <p className="font-semibold text-foreground capitalize">
                          {complexion.replace("_", " ")}
                        </p>
                      </div>
                    ) : null}
                    {parsedMeta?.placeOfBirth ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Place of Birth</p>
                        <p className="font-semibold text-foreground">{parsedMeta.placeOfBirth}</p>
                      </div>
                    ) : null}
                    {parsedMeta?.timeOfBirth ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Time of Birth</p>
                        <p className="font-semibold text-foreground">{parsedMeta.timeOfBirth}</p>
                      </div>
                    ) : null}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 2. HOROSCOPE */}
              {horoscopeAvailable || star || rashi || gothram ? (
                <AccordionItem
                  value="horoscope"
                  className="rounded-xl border border-[#E4DDD3] bg-white overflow-hidden px-5 sm:px-6 border-b-0"
                >
                  <AccordionTrigger className="py-5 font-serif text-lg font-bold text-[#21083F] hover:no-underline cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[#D9A514]" />
                      <span>{lang === "te" ? "జాతక వివరాలు" : "Horoscope Details"}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-1">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Horoscope</p>
                        <p className="font-semibold text-foreground">
                          {horoscopeAvailable === "yes" ? "Available" : "Not Provided"}
                        </p>
                      </div>
                      {star ? (
                        <div>
                          <p className="text-xs text-muted-foreground">Nakshatra / Star</p>
                          <p className="font-semibold text-foreground">{star}</p>
                        </div>
                      ) : null}
                      {rashi ? (
                        <div>
                          <p className="text-xs text-muted-foreground">Rashi</p>
                          <p className="font-semibold text-foreground">{rashi}</p>
                        </div>
                      ) : null}
                      {gothram ? (
                        <div>
                          <p className="text-xs text-muted-foreground">Gothram</p>
                          <p className="font-semibold text-[#087A32]">{gothram}</p>
                        </div>
                      ) : null}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ) : null}

              {/* 3. EDUCATION & CAREER */}
              <AccordionItem
                value="career"
                className="rounded-xl border border-[#E4DDD3] bg-white overflow-hidden px-5 sm:px-6 border-b-0"
              >
                <AccordionTrigger className="py-5 font-serif text-lg font-bold text-[#21083F] hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-[#D9A514]" />
                    <span>{lang === "te" ? "విద్య & ఉద్యోగం" : "Education & Career"}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-1">
                  <div className="grid gap-4 sm:grid-cols-2 text-sm">
                    <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-[#F8F7F4]/50 p-3.5">
                      <GraduationCap className="h-5 w-5 text-[#087A32] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Highest Education</p>
                        <p className="font-semibold text-[#21083F]">
                          {profile.education || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-[#F8F7F4]/50 p-3.5">
                      <Briefcase className="h-5 w-5 text-[#087A32] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Occupation / Job</p>
                        <p className="font-semibold text-[#21083F]">
                          {designation ? `${designation} — ` : ""}
                          {profile.occupation || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {employmentType ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Employment Type</p>
                        <p className="font-semibold text-foreground capitalize">
                          {employmentType.replace("_", " ")}
                        </p>
                      </div>
                    ) : null}

                    {jobLocation ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Job Location</p>
                        <p className="font-semibold text-foreground">{jobLocation}</p>
                      </div>
                    ) : null}

                    {salaryAmount ? (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-muted-foreground">Salary / Remuneration</p>
                        <p className="font-semibold text-[#087A32]">
                          {salaryCurrency} {salaryAmount} ({salaryPeriod})
                        </p>
                      </div>
                    ) : null}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 4. FAMILY */}
              <AccordionItem
                value="family"
                className="rounded-xl border border-[#E4DDD3] bg-white overflow-hidden px-5 sm:px-6 border-b-0"
              >
                <AccordionTrigger className="py-5 font-serif text-lg font-bold text-[#21083F] hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#D9A514]" />
                    <span>{lang === "te" ? "కుటుంబ వివరాలు" : "Family Particulars"}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-1">
                  <div className="grid gap-4 sm:grid-cols-2 text-sm">
                    {fatherName || fatherProfession ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Father</p>
                        <p className="font-semibold text-foreground">
                          {fatherName ? `${fatherName} ` : ""}
                          {fatherProfession ? `(${fatherProfession})` : ""}
                        </p>
                      </div>
                    ) : null}

                    {motherName || motherProfession ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Mother</p>
                        <p className="font-semibold text-foreground">
                          {motherName ? `${motherName} ` : ""}
                          {motherProfession ? `(${motherProfession})` : ""}
                        </p>
                      </div>
                    ) : null}

                    {familyType ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Family Type</p>
                        <p className="font-semibold text-foreground capitalize">{familyType}</p>
                      </div>
                    ) : null}

                    {familyLocation ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Family Location</p>
                        <p className="font-semibold text-foreground">{familyLocation}</p>
                      </div>
                    ) : null}

                    {brothersDetails ? (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-muted-foreground">Brothers Details</p>
                        <p className="font-medium text-foreground">{brothersDetails}</p>
                      </div>
                    ) : null}

                    {sistersDetails ? (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-muted-foreground">Sisters Details</p>
                        <p className="font-medium text-foreground">{sistersDetails}</p>
                      </div>
                    ) : null}

                    {profile.family_summary ? (
                      <div className="sm:col-span-2 pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">
                          Family Values &amp; Heritage
                        </p>
                        <p className="mt-1 leading-relaxed text-muted-foreground whitespace-pre-line">
                          {profile.family_summary}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 5. COMMUNITY */}
              <AccordionItem
                value="community"
                className="rounded-xl border border-[#E4DDD3] bg-white overflow-hidden px-5 sm:px-6 border-b-0"
              >
                <AccordionTrigger className="py-5 font-serif text-lg font-bold text-[#21083F] hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-[#D9A514]" />
                    <span>{lang === "te" ? "కుల & మూలాల వివరాలు" : "Community & Roots"}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-1">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Community</p>
                      <p className="font-bold text-[#087A32]">
                        {profile.community || "Shettibalija"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Mother Tongue</p>
                      <p className="font-semibold text-foreground">
                        {profile.mother_tongue || "Telugu"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Native Place</p>
                      <p className="font-semibold text-foreground">
                        {profile.native_place || "Andhra Pradesh"}
                      </p>
                    </div>
                    {communityProfession ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Community Profession</p>
                        <p className="font-semibold text-foreground">{communityProfession}</p>
                      </div>
                    ) : null}
                    {parsedMeta?.presentPlace ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Settled At</p>
                        <p className="font-semibold text-foreground">{parsedMeta.presentPlace}</p>
                      </div>
                    ) : null}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 6. LIFESTYLE */}
              {foodHabit || smoking || drinking ? (
                <AccordionItem
                  value="lifestyle"
                  className="rounded-xl border border-[#E4DDD3] bg-white overflow-hidden px-5 sm:px-6 border-b-0"
                >
                  <AccordionTrigger className="py-5 font-serif text-lg font-bold text-[#21083F] hover:no-underline cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-[#D9A514]" />
                      <span>{lang === "te" ? "ఆహారం & జీవనశైలి" : "Food & Lifestyle"}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-1">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 text-sm">
                      {foodHabit ? (
                        <div>
                          <p className="text-xs text-muted-foreground">Food Habits</p>
                          <p className="font-semibold text-foreground capitalize">
                            {foodHabit.replace("_", " ")}
                          </p>
                        </div>
                      ) : null}
                      {smoking ? (
                        <div>
                          <p className="text-xs text-muted-foreground">Smoking</p>
                          <p className="font-semibold text-foreground capitalize">
                            {smoking.replace("_", " ")}
                          </p>
                        </div>
                      ) : null}
                      {drinking ? (
                        <div>
                          <p className="text-xs text-muted-foreground">Drinking</p>
                          <p className="font-semibold text-foreground capitalize">
                            {drinking.replace("_", " ")}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ) : null}

              {/* 7. PARTNER REQUIREMENTS */}
              {(() => {
                const minAge = parsedMeta?.preferredAgeMin || prefRecord["min_age"];
                const maxAge = parsedMeta?.preferredAgeMax || prefRecord["max_age"];
                const minH = parsedMeta?.preferredHeightMin || prefRecord["min_height_cm"];
                const maxH = parsedMeta?.preferredHeightMax || prefRecord["max_height_cm"];
                const edu = parsedMeta?.preferredEducation || prefRecord["education"];
                const occ = parsedMeta?.preferredOccupation || prefRecord["occupation"];
                const loc =
                  parsedMeta?.preferredLocation ||
                  (Array.isArray(prefRecord["preferred_locations"])
                    ? prefRecord["preferred_locations"].join(", ")
                    : prefRecord["preferred_locations"]);
                const marital =
                  parsedMeta?.preferredMaritalStatus ||
                  (Array.isArray(prefRecord["marital_statuses"])
                    ? prefRecord["marital_statuses"].join(", ")
                    : prefRecord["marital_statuses"]);
                const reqText =
                  parsedMeta?.requirementsText ||
                  prefRecord["other_preferences"] ||
                  (typeof pRecord["partner_preferences"] === "string"
                    ? pRecord["partner_preferences"]
                    : null);

                if (!minAge && !edu && !occ && !reqText && !loc) return null;

                return (
                  <AccordionItem
                    value="partner"
                    className="rounded-xl border border-[#E4DDD3] bg-white overflow-hidden px-5 sm:px-6 border-b-0"
                  >
                    <AccordionTrigger className="py-5 font-serif text-lg font-bold text-[#21083F] hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-2">
                        <HeartHandshake className="h-5 w-5 text-[#D9A514]" />
                        <span>
                          {lang === "te" ? "భాగస్వామి ఆకాంక్షలు" : "Partner Requirements"}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 pt-1">
                      <div className="grid gap-4 sm:grid-cols-2 text-sm">
                        {minAge && maxAge ? (
                          <div>
                            <p className="text-xs text-muted-foreground">Preferred Age</p>
                            <p className="font-semibold text-foreground">
                              {String(minAge)} - {String(maxAge)} yrs
                            </p>
                          </div>
                        ) : null}
                        {minH && maxH ? (
                          <div>
                            <p className="text-xs text-muted-foreground">Preferred Height</p>
                            <p className="font-semibold text-foreground">
                              {formatHeight(Number(minH))} - {formatHeight(Number(maxH))}
                            </p>
                          </div>
                        ) : null}
                        {edu ? (
                          <div>
                            <p className="text-xs text-muted-foreground">Preferred Education</p>
                            <p className="font-semibold text-foreground">{String(edu)}</p>
                          </div>
                        ) : null}
                        {occ ? (
                          <div>
                            <p className="text-xs text-muted-foreground">Preferred Occupation</p>
                            <p className="font-semibold text-foreground">{String(occ)}</p>
                          </div>
                        ) : null}
                        {loc ? (
                          <div>
                            <p className="text-xs text-muted-foreground">Preferred Location</p>
                            <p className="font-semibold text-foreground">{String(loc)}</p>
                          </div>
                        ) : null}
                        {marital ? (
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Preferred Marital Status
                            </p>
                            <p className="font-semibold text-foreground capitalize">
                              {String(marital).replace("_", " ")}
                            </p>
                          </div>
                        ) : null}
                        {reqText ? (
                          <div className="sm:col-span-2 pt-2 border-t border-border/50">
                            <p className="text-xs text-muted-foreground">Expectations / Notes</p>
                            <p className="mt-1 leading-relaxed text-muted-foreground whitespace-pre-line">
                              {String(reqText)}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })()}
            </Accordion>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#D9A514]/30 p-2.5 pb-[env(safe-area-inset-bottom,12px)] flex items-center gap-2 md:hidden shadow-[0_-8px_25px_rgba(33,8,63,0.12)]">
        <Button
          variant="outline"
          size="sm"
          onClick={() => actions.toggleShortlist.mutate(profileId)}
          className={`h-11 px-3.5 rounded-xl border-[#D9A514]/40 touch-press ${
            isShortlisted ? "bg-rose-50 text-rose-700 border-rose-300" : "text-[#21083F]"
          }`}
          aria-label="Shortlist profile"
        >
          <Heart
            className={`h-4 w-4 ${isShortlisted ? "fill-rose-500 text-rose-500" : "text-[#D9A514]"}`}
          />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => actions.sendContactRequest.mutate(profileId)}
          className="h-11 px-3.5 rounded-xl border-[#D9A514]/40 text-[#21083F] font-semibold text-xs touch-press"
        >
          <PhoneCall className="mr-1 h-3.5 w-3.5 text-[#087A32]" />
          <span>Contact</span>
        </Button>

        <Button
          className={`flex-1 h-11 rounded-xl text-xs font-bold shadow-md touch-press ${
            isInterestSent
              ? "bg-muted text-muted-foreground"
              : "bg-gradient-to-r from-[#087A32] to-[#0A963E] text-white border border-[#D9A514]/30"
          }`}
          disabled={isInterestSent}
          onClick={() => actions.sendInterest.mutate(profileId)}
        >
          <Send className="mr-1.5 h-3.5 w-3.5 text-[#F4D477]" />
          <span>
            {isInterestSent
              ? lang === "te"
                ? "ఆసక్తి పంపబడింది"
                : "Interest Sent"
              : lang === "te"
                ? "ఆసక్తిని పంపండి"
                : "Send Interest"}
          </span>
        </Button>
      </div>
    </div>
  );
}
