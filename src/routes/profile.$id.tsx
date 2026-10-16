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
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/search">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Search
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">
        {/* Photo Column */}
        <div>
          <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <ProtectedPhoto
              profileId={profileId}
              displayName={displayName}
              className="aspect-[3/4] w-full"
            />
          </div>

          {/* Action buttons */}
          <div className="mt-4 space-y-2">
            <Button
              className="w-full"
              variant={isInterestSent ? "secondary" : "default"}
              disabled={isInterestSent}
              onClick={() => actions.sendInterest.mutate(profileId)}
            >
              <Send className="mr-2 h-4 w-4" />
              {isInterestSent ? "Interest Sent" : "Express Interest"}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={isShortlisted ? "secondary" : "outline"}
                className="w-full"
                onClick={() => actions.toggleShortlist.mutate(profileId)}
              >
                <Heart
                  className={`mr-1.5 h-4 w-4 ${isShortlisted ? "fill-primary text-primary" : ""}`}
                />
                {isShortlisted ? "Shortlisted" : "Shortlist"}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => actions.sendContactRequest.mutate(profileId)}
              >
                <PhoneCall className="mr-1.5 h-4 w-4" />
                Contact Info
              </Button>
            </div>

            <Dialog open={reportOpen} onOpenChange={setReportOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground hover:text-destructive"
                >
                  <Flag className="mr-1.5 h-3.5 w-3.5" />
                  Report this profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report Profile</DialogTitle>
                  <DialogDescription>
                    Help us maintain trust and security in the community. Reports are reviewed by
                    staff.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <label className="text-sm font-medium">Reason for reporting</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
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

        {/* Profile Details Column (Organized into structured cards) */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold tracking-wider text-primary">
                {profile.profile_code || "PROFILE"}
              </span>
              {(profile as { is_demo?: boolean }).is_demo ? (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-800 border-amber-300 text-xs"
                >
                  Demo Profile
                </Badge>
              ) : null}
              <Badge variant="outline" className="text-xs">
                <ShieldCheck className="mr-1 h-3 w-3 text-emerald-600" />
                Verified Community Member
              </Badge>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold text-foreground">
              {displayName}, {profile.age ?? "—"}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {locationLine(profile.city, profile.state) || "Location not specified"}
            </p>
          </div>

          {/* 1. PERSONAL DETAILS CARD */}
          <Card className="bg-white border-[#E8E2D8] shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <h2 className="font-serif text-lg font-bold text-[#32105F] flex items-center gap-2 border-b border-[#D9A514]/25 pb-2.5">
                <User className="h-5 w-5 text-[#D9A514]" />
                Personal Details
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Age &amp; Height</p>
                  <p className="font-medium">
                    {profile.age ?? "—"} yrs • {formatHeight(profile.height_cm)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Marital Status</p>
                  <p className="font-medium capitalize">
                    {(profile.marital_status || "Never Married").replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{profile.gender || "—"}</p>
                </div>
                {complexion ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Complexion</p>
                    <p className="font-medium capitalize">{complexion.replace("_", " ")}</p>
                  </div>
                ) : null}
                {parsedMeta?.placeOfBirth ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Place of Birth</p>
                    <p className="font-medium">{parsedMeta.placeOfBirth}</p>
                  </div>
                ) : null}
                {parsedMeta?.timeOfBirth ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Time of Birth</p>
                    <p className="font-medium">{parsedMeta.timeOfBirth}</p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* 2. EDUCATION & CAREER CARD */}
          <Card className="bg-white border-[#E8E2D8] shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <h2 className="font-serif text-lg font-bold text-[#32105F] flex items-center gap-2 border-b border-[#D9A514]/25 pb-2.5">
                <GraduationCap className="h-5 w-5 text-[#D9A514]" />
                Education &amp; Career
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                <div className="flex items-start gap-2">
                  <GraduationCap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Highest Education</p>
                    <p className="font-medium">{profile.education || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Occupation / Job</p>
                    <p className="font-medium">
                      {designation ? `${designation} — ` : ""}
                      {profile.occupation || "Not specified"}
                    </p>
                  </div>
                </div>
                {employmentType ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Employment Type</p>
                    <p className="font-medium capitalize">{employmentType.replace("_", " ")}</p>
                  </div>
                ) : null}
                {jobLocation ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Job Location</p>
                    <p className="font-medium">{jobLocation}</p>
                  </div>
                ) : null}
                {salaryAmount ? (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Salary / Remuneration</p>
                    <p className="font-medium">
                      {salaryCurrency} {salaryAmount} ({salaryPeriod})
                    </p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* 3. HOROSCOPE CARD */}
          {horoscopeAvailable || star || rashi || gothram ? (
            <Card className="bg-white border-[#E8E2D8] shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-5 sm:p-6 space-y-3">
                <h2 className="font-serif text-lg font-bold text-[#32105F] flex items-center gap-2 border-b border-[#D9A514]/25 pb-2.5">
                  <Sparkles className="h-5 w-5 text-[#D9A514]" />
                  Horoscope Details
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Horoscope</p>
                    <p className="font-medium">
                      {horoscopeAvailable === "yes" ? "Available" : "Not Provided"}
                    </p>
                  </div>
                  {star ? (
                    <div>
                      <p className="text-xs text-muted-foreground">Nakshatra / Star</p>
                      <p className="font-medium">{star}</p>
                    </div>
                  ) : null}
                  {rashi ? (
                    <div>
                      <p className="text-xs text-muted-foreground">Rashi</p>
                      <p className="font-medium">{rashi}</p>
                    </div>
                  ) : null}
                  {gothram ? (
                    <div>
                      <p className="text-xs text-muted-foreground">Gothram</p>
                      <p className="font-medium">{gothram}</p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* 4. FAMILY DETAILS CARD */}
          <Card className="bg-white border-[#E8E2D8] shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <h2 className="font-serif text-lg font-bold text-[#32105F] flex items-center gap-2 border-b border-[#D9A514]/25 pb-2.5">
                <Users className="h-5 w-5 text-[#D9A514]" />
                Family Particulars
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                {fatherName || fatherProfession ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Father</p>
                    <p className="font-medium">
                      {fatherName ? `${fatherName} ` : ""}
                      {fatherProfession ? `(${fatherProfession})` : ""}
                    </p>
                  </div>
                ) : null}
                {motherName || motherProfession ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Mother</p>
                    <p className="font-medium">
                      {motherName ? `${motherName} ` : ""}
                      {motherProfession ? `(${motherProfession})` : ""}
                    </p>
                  </div>
                ) : null}
                {familyType ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Family Type</p>
                    <p className="font-medium capitalize">{familyType}</p>
                  </div>
                ) : null}
                {familyLocation ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Family Location</p>
                    <p className="font-medium">{familyLocation}</p>
                  </div>
                ) : null}
                {brothersDetails ? (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Brothers&apos; Details</p>
                    <p className="font-medium">{brothersDetails}</p>
                  </div>
                ) : null}
                {sistersDetails ? (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Sisters&apos; Details</p>
                    <p className="font-medium">{sistersDetails}</p>
                  </div>
                ) : null}
                {profile.family_summary ? (
                  <div className="sm:col-span-2 pt-1 border-t">
                    <p className="text-xs text-muted-foreground">Family Background</p>
                    <p className="mt-1 leading-relaxed text-muted-foreground whitespace-pre-line">
                      {profile.family_summary}
                    </p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* 5. COMMUNITY DETAILS CARD */}
          <Card className="bg-white border-[#E8E2D8] shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <h2 className="font-serif text-lg font-bold text-[#32105F] flex items-center gap-2 border-b border-[#D9A514]/25 pb-2.5">
                <Compass className="h-5 w-5 text-[#D9A514]" />
                Community &amp; Roots
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Community</p>
                  <p className="font-medium">{profile.community || "Shettibalija"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mother Tongue</p>
                  <p className="font-medium">{profile.mother_tongue || "Telugu"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Native Place</p>
                  <p className="font-medium">{profile.native_place || "—"}</p>
                </div>
                {communityProfession ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Community Profession</p>
                    <p className="font-medium">{communityProfession}</p>
                  </div>
                ) : null}
                {parsedMeta?.presentPlace ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Settled At</p>
                    <p className="font-medium">{parsedMeta.presentPlace}</p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* 6. LIFESTYLE CARD */}
          {foodHabit || smoking || drinking ? (
            <Card className="bg-white border-[#E8E2D8] shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-5 sm:p-6 space-y-3">
                <h2 className="font-serif text-lg font-bold text-[#32105F] flex items-center gap-2 border-b border-[#D9A514]/25 pb-2.5">
                  <Utensils className="h-5 w-5 text-[#D9A514]" />
                  Food &amp; Lifestyle
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-sm">
                  {foodHabit ? (
                    <div>
                      <p className="text-xs text-muted-foreground">Food Habits</p>
                      <p className="font-medium capitalize">{foodHabit.replace("_", " ")}</p>
                    </div>
                  ) : null}
                  {smoking ? (
                    <div>
                      <p className="text-xs text-muted-foreground">Smoking</p>
                      <p className="font-medium capitalize">{smoking.replace("_", " ")}</p>
                    </div>
                  ) : null}
                  {drinking ? (
                    <div>
                      <p className="text-xs text-muted-foreground">Drinking</p>
                      <p className="font-medium capitalize">{drinking.replace("_", " ")}</p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* 7. PARTNER REQUIREMENTS CARD */}
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
              <Card className="bg-white border-[#E8E2D8] shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-5 sm:p-6 space-y-3">
                  <h2 className="font-serif text-lg font-bold text-[#32105F] flex items-center gap-2 border-b border-[#D9A514]/25 pb-2.5">
                    <HeartHandshake className="h-5 w-5 text-[#D9A514]" />
                    Partner Requirements
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2 text-sm">
                    {minAge && maxAge ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Preferred Age</p>
                        <p className="font-medium">
                          {String(minAge)} - {String(maxAge)} yrs
                        </p>
                      </div>
                    ) : null}
                    {minH && maxH ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Preferred Height</p>
                        <p className="font-medium">
                          {formatHeight(Number(minH))} - {formatHeight(Number(maxH))}
                        </p>
                      </div>
                    ) : null}
                    {edu ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Preferred Education</p>
                        <p className="font-medium">{String(edu)}</p>
                      </div>
                    ) : null}
                    {occ ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Preferred Occupation</p>
                        <p className="font-medium">{String(occ)}</p>
                      </div>
                    ) : null}
                    {loc ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Preferred Location</p>
                        <p className="font-medium">{String(loc)}</p>
                      </div>
                    ) : null}
                    {marital ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Preferred Marital Status</p>
                        <p className="font-medium capitalize">
                          {String(marital).replace("_", " ")}
                        </p>
                      </div>
                    ) : null}
                    {reqText ? (
                      <div className="sm:col-span-2 pt-2 border-t">
                        <p className="text-xs text-muted-foreground">Expectations / Requirements</p>
                        <p className="mt-1 leading-relaxed text-muted-foreground whitespace-pre-line">
                          {String(reqText)}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
