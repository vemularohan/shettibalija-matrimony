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
  EyeOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { productSupabase } from "@/integrations/supabase/product-client";
import { useOwnMatrimonialProfile } from "@/hooks/use-member-data";
import { formatHeight, locationLine } from "@/lib/format";
import { REPORT_REASONS } from "@/lib/options";
import { SITE_NAME } from "@/lib/site";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { RequireAuth } from "@/components/shared/require-auth";

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
  const { user, loading } = useAuth();
  const { lang, t } = useLanguage();
  const { id, code } = useParams({ strict: false }) as { id?: string; code?: string };
  const identifier = id || code;
  const actions = useProfileActions();
  const ownProfileQuery = useOwnMatrimonialProfile();
  const [reportReason, setReportReason] = useState<string>(REPORT_REASONS[0] ?? "Other");
  const [reportOpen, setReportOpen] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["profile-detail", identifier, ownProfileQuery.data?.id],
    enabled: Boolean(identifier && user),
    queryFn: async () => {
      if (!identifier) return null;

      const isUuid = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(identifier);
      const { data: found, error: profileError } = await productSupabase
        .from("approved_matrimonial_profiles")
        .select("*")
        .eq(isUuid ? "id" : "profile_code", isUuid ? identifier : identifier.toUpperCase())
        .maybeSingle();
      if (profileError) throw profileError;
      if (!found || !found.id) return null;

      const canReadPrivateSections = ownProfileQuery.data?.id === found.id;
      const [{ data: family }, { data: prefs }] = canReadPrivateSections
        ? await Promise.all([
            productSupabase
              .from("family_details")
              .select("*")
              .eq("profile_id", found.id)
              .maybeSingle(),
            productSupabase
              .from("partner_preferences")
              .select("*")
              .eq("profile_id", found.id)
              .maybeSingle(),
          ])
        : [{ data: null }, { data: null }];

      return {
        ...found,
        _familyDetails: family,
        _partnerPreferences: prefs,
      };
    },
  });

  useEffect(() => {
    const viewedProfileId = profileQuery.data?.id;
    if (!viewedProfileId || !actions.user || ownProfileQuery.data?.id === viewedProfileId) return;
    void productSupabase.rpc("record_profile_view", { p_viewed_profile_id: viewedProfileId });
  }, [profileQuery.data?.id, actions.user, ownProfileQuery.data?.id]);

  if (!loading && !user) {
    return <RequireAuth>{null}</RequireAuth>;
  }

  if (profileQuery.isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
          <Skeleton className="h-96 rounded-2xl" />
          <div className="space-y-0">
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
  const displayName = profile.display_name || "Name not shared";

  const pRecord = profile as Record<string, unknown>;
  const familyObj = pRecord["_familyDetails"] as Record<string, unknown> | null | undefined;

  // Computed / merged profile attributes
  const prefRecord =
    (pRecord["_partnerPreferences"] as Record<string, unknown> | null) ||
    (pRecord["partner_preferences"] as Record<string, unknown> | null) ||
    {};

  const star = pRecord["star"] as string | undefined;
  const rashi = pRecord["rashi"] as string | undefined;
  const gothram = pRecord["gothram"] as string | undefined;
  const horoscopeAvailable = pRecord["horoscope_available"] ? "yes" : undefined;
  const designation = pRecord["designation"] as string | undefined;
  const jobLocation = pRecord["job_location"] as string | undefined;
  const employmentType = pRecord["employment_type"] as string | undefined;
  const salaryAmount: string | undefined = undefined;
  const salaryCurrency = "INR";
  const salaryPeriod = "annual";
  const complexion = pRecord["complexion"] as string | undefined;
  const communityProfession = pRecord["community_profession"] as string | undefined;
  const foodHabit = pRecord["food_habit"] as string | undefined;
  const smoking = pRecord["smoking_habit"] as string | undefined;
  const drinking = pRecord["drinking_habit"] as string | undefined;
  const fatherName = familyObj?.["father_name"] as string | undefined;
  const fatherProfession = familyObj?.["father_profession"] as string | undefined;
  const motherName = familyObj?.["mother_name"] as string | undefined;
  const motherProfession = familyObj?.["mother_profession"] as string | undefined;
  const brothersDetails = familyObj?.["brothers_details"] as string | undefined;
  const sistersDetails = familyObj?.["sisters_details"] as string | undefined;
  const familyType = familyObj?.["family_type"] as string | undefined;
  const familyLocation = familyObj?.["family_location"] as string | undefined;
  const placeOfBirth = pRecord["place_of_birth"] as string | undefined;
  const timeOfBirth = pRecord["time_of_birth"] as string | undefined;

  const aboutMe = (profile as { about_me?: string | null })?.about_me;
  return (
    <div className="min-h-screen bg-[#F7F3EA] pb-12 pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs font-medium text-muted-foreground hover:text-[#24103F]"
          >
            <Link to="/search">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5 text-[#087333]" />
              {lang === "te" ? "శోధనకు తిరిగి వెళ్లండి" : "Back to Search"}
            </Link>
          </Button>

          <span className="text-xs font-semibold tracking-wide text-[#A88724]">
            {SITE_NAME} · {lang === "te" ? "మ్యాట్రిమోనీ ID" : "ID"} {profile.profile_code || "—"}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          {/* Left Column: Photo & Action Panel (Sticky on Desktop) */}
          <div className="space-y-4">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="border border-[#C9A227]/65 bg-white p-1.5 shadow-[8px_10px_0_rgba(36,16,63,0.045)]">
                <div className="aspect-[4/5] w-full overflow-hidden bg-[#EDE5D6]">
                  <ProtectedPhoto
                    profileId={profileId}
                    displayName={displayName}
                    photoUrl={(profile as { photo_url?: string | null })?.photo_url}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="mt-3 lg:hidden">
                <h1 className="font-serif text-2xl font-medium text-[#24103F]">
                  {displayName}, {profile.age ?? "—"}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-[#756A61]">
                  <MapPin className="h-4 w-4 text-[#087333]" />
                  {locationLine(profile.city, profile.state) || "Location not specified"}
                </p>
              </div>

              {/* Action Buttons — Physical press depth */}
              <div className="space-y-2.5">
                {/* Primary CTA: Send Interest */}
                <Button
                  className={`w-full min-h-11 rounded-md text-sm font-semibold transition-colors ${
                    isInterestSent
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-[#24103F] hover:bg-[#311552] text-white"
                  }`}
                  disabled={isInterestSent}
                  onClick={() => actions.sendInterest.mutate(profileId)}
                >
                  <Send className="mr-2 h-4 w-4 text-[#087333]" />
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
                    className={`w-full min-h-11 rounded-md border-[#E4DDD3] text-sm font-medium ${
                      isShortlisted
                        ? "bg-rose-50 text-rose-700 border-rose-300"
                        : "text-[#24103F] bg-white"
                    }`}
                    onClick={() => actions.toggleShortlist.mutate(profileId)}
                  >
                    <Heart
                      className={`mr-1.5 h-4 w-4 ${
                        isShortlisted ? "fill-rose-500 text-rose-500" : "text-[#087333]"
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
                    className="w-full min-h-11 rounded-md border-[#E4DDD3] bg-white text-xs font-medium text-[#24103F]"
                    onClick={() => actions.sendContactRequest.mutate(profileId)}
                  >
                    <PhoneCall className="mr-1.5 h-4 w-4 text-[#087333]" />
                    {lang === "te" ? "సంప్రదింపు అభ్యర్థన" : "Request Contact"}
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

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actions.blockedIds.has(profileId)}
                    onClick={() => actions.blockProfile.mutate(profileId)}
                    className="text-xs"
                  >
                    <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                    {actions.blockedIds.has(profileId) ? "Blocked" : "Block"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actions.ignoredIds.has(profileId)}
                    onClick={() => actions.ignoreProfile.mutate(profileId)}
                    className="text-xs"
                  >
                    <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                    {actions.ignoredIds.has(profileId) ? "Ignored" : "Ignore"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Information Cards */}
          <div className="space-y-6">
            {/* Main Profile Summary Banner — Luxury Wedding Album Page */}
            <div className="border-y border-[#C9A227]/45 bg-transparent py-5 sm:py-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A88724]">
                  {lang === "te" ? "శెట్టిబలిజ మ్యాట్రిమోనీ ID" : "Matrimony ID"} ·{" "}
                  {profile.profile_code || "—"}
                </span>
              </div>

              <h1 className="mt-3 hidden font-serif text-3xl font-medium tracking-tight text-[#24103F] lg:block sm:text-4xl">
                {displayName}, {profile.age ?? "—"}
              </h1>

              <p className="mt-1 hidden items-center gap-1.5 text-sm text-[#756A61] lg:flex">
                <MapPin className="h-4 w-4 text-[#087333]" />
                {locationLine(profile.city, profile.state) || "Location not specified"}
              </p>

              {/* Fast highlights grid */}
              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="border-t border-[#E4DDD3] bg-transparent p-3">
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-[#756A61]">
                    {lang === "te" ? "వైవాహిక స్థితి" : "Marital Status"}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-[#24103F] capitalize truncate">
                    {profile.marital_status
                      ? profile.marital_status.replace("_", " ")
                      : lang === "te"
                        ? "పంచుకోలేదు"
                        : "Not shared"}
                  </p>
                </div>

                <div className="border-t border-[#E4DDD3] bg-transparent p-3">
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-[#756A61]">
                    {lang === "te" ? "ఎత్తు" : "Height"}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-[#24103F] truncate">
                    {formatHeight(profile.height_cm)}
                  </p>
                </div>

                <div className="border-t border-[#E4DDD3] bg-transparent p-3">
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-[#756A61]">
                    {lang === "te" ? "విద్య" : "Education"}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-[#24103F] truncate">
                    {profile.education || (lang === "te" ? "పంచుకోలేదు" : "Not shared")}
                  </p>
                </div>

                <div className="border-t border-[#E4DDD3] bg-transparent p-3">
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-[#756A61]">
                    {lang === "te" ? "వృత్తి" : "Occupation"}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-[#24103F] truncate">
                    {profile.occupation || (lang === "te" ? "పంచుకోలేదు" : "Not shared")}
                  </p>
                </div>
              </div>
            </div>

            {/* About / Bio Card */}
            {aboutMe ? (
              <div className="border-t border-[#E4DDD3] bg-transparent p-0 pt-5">
                <h2 className="font-serif text-lg font-bold text-[#24103F] mb-2.5 flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-[#087333]" />
                  <span>{lang === "te" ? `${displayName} గురించి` : `About ${displayName}`}</span>
                </h2>
                <p className="text-sm leading-relaxed text-[#211D22]/85 whitespace-pre-line">
                  {aboutMe}
                </p>
              </div>
            ) : null}

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
              className="space-y-0"
            >
              {/* 1. PERSONAL DETAILS */}
              <AccordionItem
                value="personal"
                className="border-t border-[#E4DDD3] bg-transparent px-1 sm:px-2"
              >
                <AccordionTrigger className="py-5 font-serif text-lg font-medium text-[#24103F] hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-[#C9A227]" />
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
                        {profile.marital_status
                          ? profile.marital_status.replace("_", " ")
                          : "Not shared"}
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
                    {placeOfBirth ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Place of Birth</p>
                        <p className="font-semibold text-foreground">{placeOfBirth}</p>
                      </div>
                    ) : null}
                    {timeOfBirth ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Time of Birth</p>
                        <p className="font-semibold text-foreground">{timeOfBirth}</p>
                      </div>
                    ) : null}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 2. HOROSCOPE */}
              {horoscopeAvailable || star || rashi || gothram ? (
                <AccordionItem
                  value="horoscope"
                  className="border-t border-[#E4DDD3] bg-transparent px-1 sm:px-2"
                >
                  <AccordionTrigger className="py-5 font-serif text-lg font-medium text-[#24103F] hover:no-underline cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[#C9A227]" />
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

                    <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#C9A227]/25 bg-[#F7F3EA] p-3 text-xs text-[#24103F]">
                      <ShieldCheck className="h-4 w-4 text-[#087333] shrink-0" />
                      <span>
                        {lang === "te"
                          ? "జాతక పత్రం మరియు గ్రహ స్థానాలు గోప్యంగా ఉంచబడతాయి. పరస్పర ఆసక్తిని అంగీకరించిన కుటుంబాలకు మాత్రమే వివరాలు లభిస్తాయి."
                          : "Horoscope document remains strictly private. Astrological planetary chart and coordinates are shared only upon accepted family interest."}
                      </span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ) : null}

              {/* 3. EDUCATION & CAREER */}
              <AccordionItem
                value="career"
                className="border-t border-[#E4DDD3] bg-transparent px-1 sm:px-2"
              >
                <AccordionTrigger className="py-5 font-serif text-lg font-medium text-[#24103F] hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-[#C9A227]" />
                    <span>{lang === "te" ? "విద్య & ఉద్యోగం" : "Education & Career"}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-1">
                  <div className="grid gap-4 sm:grid-cols-2 text-sm">
                    <div className="flex items-start gap-3 border-t border-[#E4DDD3] py-3.5">
                      <GraduationCap className="h-5 w-5 text-[#087A32] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Highest Education</p>
                        <p className="font-semibold text-[#21083F]">
                          {profile.education || "Not shared"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-[#E4DDD3] py-3.5">
                      <Briefcase className="h-5 w-5 text-[#087A32] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Occupation / Job</p>
                        <p className="font-semibold text-[#21083F]">
                          {designation ? `${designation} — ` : ""}
                          {profile.occupation || "Not shared"}
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
                className="border-t border-[#E4DDD3] bg-transparent px-1 sm:px-2"
              >
                <AccordionTrigger className="py-5 font-serif text-lg font-medium text-[#24103F] hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#C9A227]" />
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
                className="border-t border-[#E4DDD3] bg-transparent px-1 sm:px-2"
              >
                <AccordionTrigger className="py-5 font-serif text-lg font-medium text-[#24103F] hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-[#C9A227]" />
                    <span>{lang === "te" ? "కుల & మూలాల వివరాలు" : "Community & Roots"}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-1">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Community</p>
                      <p className="font-bold text-[#087A32]">
                        {profile.community || "Not shared"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Mother Tongue</p>
                      <p className="font-semibold text-foreground">
                        {profile.mother_tongue || "Not shared"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Native Place</p>
                      <p className="font-semibold text-foreground">
                        {profile.native_place || "Not shared"}
                      </p>
                    </div>
                    {communityProfession ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Community Profession</p>
                        <p className="font-semibold text-foreground">{communityProfession}</p>
                      </div>
                    ) : null}
                    {pRecord["present_location"] ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Settled At</p>
                        <p className="font-semibold text-foreground">
                          {String(pRecord["present_location"])}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 6. LIFESTYLE */}
              {foodHabit || smoking || drinking ? (
                <AccordionItem
                  value="lifestyle"
                  className="border-t border-[#E4DDD3] bg-transparent px-1 sm:px-2"
                >
                  <AccordionTrigger className="py-5 font-serif text-lg font-medium text-[#24103F] hover:no-underline cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-[#C9A227]" />
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
                const minAge = prefRecord["min_age"];
                const maxAge = prefRecord["max_age"];
                const minH = prefRecord["min_height_cm"];
                const maxH = prefRecord["max_height_cm"];
                const edu = prefRecord["education"];
                const occ = prefRecord["occupation"];
                const loc = Array.isArray(prefRecord["preferred_locations"])
                  ? prefRecord["preferred_locations"].join(", ")
                  : prefRecord["preferred_locations"];
                const marital = Array.isArray(prefRecord["marital_statuses"])
                  ? prefRecord["marital_statuses"].join(", ")
                  : prefRecord["marital_statuses"];
                const reqText =
                  prefRecord["family_preferences"] ||
                  prefRecord["requirements_text"] ||
                  prefRecord["other_preferences"] ||
                  (typeof pRecord["partner_preferences"] === "string"
                    ? pRecord["partner_preferences"]
                    : null);

                if (!minAge && !edu && !occ && !reqText && !loc) return null;

                return (
                  <AccordionItem
                    value="partner"
                    className="border-t border-[#E4DDD3] bg-transparent px-1 sm:px-2"
                  >
                    <AccordionTrigger className="py-5 font-serif text-lg font-medium text-[#24103F] hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-2">
                        <HeartHandshake className="h-5 w-5 text-[#C9A227]" />
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
        <div className="profile-sticky-actions lg:hidden">
          <Button
            variant="outline"
            className={`min-h-11 flex-1 border-[#C9A227]/55 text-sm ${isShortlisted ? "text-rose-700" : "text-[#24103F]"}`}
            aria-pressed={isShortlisted}
            onClick={() => actions.toggleShortlist.mutate(profileId)}
          >
            <Heart className={`mr-1.5 h-4 w-4 ${isShortlisted ? "fill-current" : ""}`} />
            {isShortlisted
              ? lang === "te"
                ? "షార్ట్‌లిస్ట్"
                : "Shortlisted"
              : lang === "te"
                ? "షార్ట్‌లిస్ట్"
                : "Shortlist"}
          </Button>
          <Button
            className="min-h-11 flex-1 text-sm"
            disabled={isInterestSent}
            onClick={() => actions.sendInterest.mutate(profileId)}
          >
            <Send className="mr-1.5 h-4 w-4" />
            {isInterestSent
              ? lang === "te"
                ? "ఆసక్తి పంపబడింది"
                : "Interest Sent"
              : lang === "te"
                ? "ఆసక్తిని పంపండి"
                : "Send Interest"}
          </Button>
        </div>
      </div>
    </div>
  );
}
