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

      if (byCode) return byCode;

      // Fallback: check all matrimonial_profiles (e.g. for owner preview)
      const { data: rawProfile } = await supabase
        .from("matrimonial_profiles")
        .select("*")
        .or(`id.eq.${identifier},profile_code.eq.${identifier}`)
        .maybeSingle();

      return rawProfile ?? null;
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

      <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
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

        {/* Profile Details Column */}
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

          {/* Key Attributes */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-3 shadow-sm">
              <p className="text-xs text-muted-foreground">Age & Height</p>
              <p className="mt-1 font-medium">
                {profile.age ?? "—"} yrs • {formatHeight(profile.height_cm)}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-3 shadow-sm">
              <p className="text-xs text-muted-foreground">Marital Status</p>
              <p className="mt-1 font-medium capitalize">
                {(profile.marital_status || "Never Married").replace("_", " ")}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-3 shadow-sm">
              <p className="text-xs text-muted-foreground">Community</p>
              <p className="mt-1 font-medium">{profile.community || "Shettibalija"}</p>
            </div>
            <div className="rounded-xl border bg-card p-3 shadow-sm">
              <p className="text-xs text-muted-foreground">Mother Tongue</p>
              <p className="mt-1 font-medium">{profile.mother_tongue || "Telugu"}</p>
            </div>
            <div className="rounded-xl border bg-card p-3 shadow-sm">
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="mt-1 font-medium capitalize">{profile.gender || "—"}</p>
            </div>
            <div className="rounded-xl border bg-card p-3 shadow-sm">
              <p className="text-xs text-muted-foreground">Native Place</p>
              <p className="mt-1 font-medium">{profile.native_place || "—"}</p>
            </div>
          </div>

          {/* Education & Career */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <h2 className="font-serif text-xl font-semibold">Education & Occupation</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Highest Education</p>
                    <p className="text-sm font-medium">{profile.education || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Occupation</p>
                    <p className="text-sm font-medium">{profile.occupation || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Me / Introduction */}
          {(profile as { about_me?: string }).about_me ? (
            <Card>
              <CardContent className="p-5">
                <h2 className="font-serif text-xl font-semibold">About Me</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {(profile as { about_me?: string }).about_me}
                </p>
              </CardContent>
            </Card>
          ) : null}

          {/* Family Background */}
          {profile.family_summary ? (
            <Card>
              <CardContent className="p-5">
                <h2 className="font-serif text-xl font-semibold">About Family</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {profile.family_summary}
                </p>
              </CardContent>
            </Card>
          ) : null}

          {/* Partner Preferences */}
          {(() => {
            const rawPrefs = (profile as { partner_preferences?: unknown }).partner_preferences;
            if (!rawPrefs) return null;
            if (typeof rawPrefs === "string") {
              return (
                <Card>
                  <CardContent className="p-5 space-y-3">
                    <h2 className="font-serif text-xl font-semibold">Partner Preferences</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                      {rawPrefs}
                    </p>
                  </CardContent>
                </Card>
              );
            }
            if (typeof rawPrefs === "object" && rawPrefs !== null) {
              const prefs = rawPrefs as {
                min_age?: number;
                max_age?: number;
                min_height_cm?: number;
                max_height_cm?: number;
                education?: string;
                occupation?: string;
                preferred_locations?: string[];
              };
              return (
                <Card>
                  <CardContent className="p-5 space-y-3">
                    <h2 className="font-serif text-xl font-semibold">Partner Preferences</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {prefs.min_age && prefs.max_age ? (
                        <div>
                          <p className="text-xs text-muted-foreground">Preferred Age</p>
                          <p className="text-sm font-medium">
                            {prefs.min_age} - {prefs.max_age} yrs
                          </p>
                        </div>
                      ) : null}
                      {prefs.min_height_cm && prefs.max_height_cm ? (
                        <div>
                          <p className="text-xs text-muted-foreground">Preferred Height</p>
                          <p className="text-sm font-medium">
                            {formatHeight(prefs.min_height_cm)} -{" "}
                            {formatHeight(prefs.max_height_cm)}
                          </p>
                        </div>
                      ) : null}
                      {prefs.education ? (
                        <div>
                          <p className="text-xs text-muted-foreground">Preferred Education</p>
                          <p className="text-sm font-medium">{prefs.education}</p>
                        </div>
                      ) : null}
                      {prefs.occupation ? (
                        <div>
                          <p className="text-xs text-muted-foreground">Preferred Occupation</p>
                          <p className="text-sm font-medium">{prefs.occupation}</p>
                        </div>
                      ) : null}
                      {prefs.preferred_locations?.length ? (
                        <div className="sm:col-span-2">
                          <p className="text-xs text-muted-foreground">Preferred Locations</p>
                          <p className="text-sm font-medium">
                            {prefs.preferred_locations.join(", ")}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
}
