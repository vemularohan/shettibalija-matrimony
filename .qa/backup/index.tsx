import { createFileRoute, Link } from "@tanstack/react-router";
import {
  UserRound,
  Heart,
  Bell,
  Crown,
  Search,
  Camera,
  ShieldCheck,
  ArrowRight,
  Mail,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/empty-state";
import { ProtectedPhoto } from "@/components/profiles/protected-photo";
import { ProfileCard, type PublicProfileCardData } from "@/components/profiles/profile-card";
import { useAuth } from "@/hooks/use-auth";
import {
  useOwnMatrimonialProfile,
  useOwnPrivateDetails,
  useOwnPreferences,
  useOwnPhotos,
  useActiveMembership,
  useUnreadNotificationCount,
} from "@/hooks/use-member-data";
import { useProfileActions } from "@/hooks/use-profile-actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productSupabase } from "@/integrations/supabase/product-client";
import { profileCompletion } from "@/lib/profile-completion";
import { formatHeight, locationLine } from "@/lib/format";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverviewPage,
});

function DashboardOverviewPage() {
  const { lang } = useLanguage();
  const isTelugu = lang === "te";
  const { user, account } = useAuth();
  const queryClient = useQueryClient();
  const ownProfileQuery = useOwnMatrimonialProfile();
  const profile = ownProfileQuery.data;
  const privateDetailsQuery = useOwnPrivateDetails(profile?.id);
  const preferencesQuery = useOwnPreferences(profile?.id);
  const photosQuery = useOwnPhotos(profile?.id);
  const membershipQuery = useActiveMembership();
  const unreadCountQuery = useUnreadNotificationCount();
  const actions = useProfileActions();

  const completion = profileCompletion(
    profile ?? null,
    privateDetailsQuery.data ?? null,
    preferencesQuery.data ?? null,
    photosQuery.data?.length ?? 0,
  );
  const completionLoading =
    ownProfileQuery.isLoading ||
    Boolean(
      profile?.id &&
      (privateDetailsQuery.isLoading || preferencesQuery.isLoading || photosQuery.isLoading),
    );
  const completionError =
    ownProfileQuery.isError ||
    Boolean(
      profile?.id &&
      (privateDetailsQuery.isError || preferencesQuery.isError || photosQuery.isError),
    );

  const primaryPhoto = photosQuery.data?.find((p) => p.is_primary) ?? photosQuery.data?.[0];

  // Recommended matches query
  const recommendedQuery = useQuery({
    queryKey: [
      "dashboard-recommended",
      profile?.gender,
      profile?.id,
      preferencesQuery.data,
      [...actions.blockedIds].sort().join(","),
      [...actions.ignoredIds].sort().join(","),
    ],
    enabled:
      Boolean(profile?.id) &&
      !ownProfileQuery.isLoading &&
      !preferencesQuery.isLoading &&
      !actions.isBlockedLoading &&
      !actions.isIgnoredLoading &&
      !actions.isShortlistLoading &&
      !actions.isInterestsLoading &&
      !ownProfileQuery.isError &&
      !preferencesQuery.isError &&
      !actions.isBlockedError &&
      !actions.isIgnoredError &&
      !actions.isShortlistError &&
      !actions.isInterestsError,
    queryFn: async () => {
      const targetGender =
        profile?.gender === "bride" ? "groom" : profile?.gender === "groom" ? "bride" : undefined;

      let q = productSupabase
        .from("approved_matrimonial_profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(12);

      if (targetGender) q = q.eq("gender", targetGender);
      if (profile?.id) q = q.neq("id", profile.id);
      if (preferencesQuery.data?.min_age) q = q.gte("age", preferencesQuery.data.min_age);
      if (preferencesQuery.data?.max_age) q = q.lte("age", preferencesQuery.data.max_age);
      if (preferencesQuery.data?.min_height_cm)
        q = q.gte("height_cm", preferencesQuery.data.min_height_cm);
      if (preferencesQuery.data?.max_height_cm)
        q = q.lte("height_cm", preferencesQuery.data.max_height_cm);
      if (
        preferencesQuery.data?.preferred_food_habit &&
        preferencesQuery.data.preferred_food_habit !== "any"
      ) {
        q = q.eq("food_habit", preferencesQuery.data.preferred_food_habit);
      }
      if (
        preferencesQuery.data?.preferred_gothram &&
        preferencesQuery.data.preferred_gothram !== "Different Gothram"
      ) {
        q = q.eq("gothram", preferencesQuery.data.preferred_gothram);
      }

      const { data, error } = await q;
      if (error) throw error;
      const blocked = actions.blockedIds;
      const ignored = actions.ignoredIds;
      return (data ?? [])
        .filter((p): p is typeof p & { id: string } => Boolean(p.id))
        .filter((p) => !blocked.has(p.id) && !ignored.has(p.id))
        .slice(0, 4) as PublicProfileCardData[];
    },
  });

  return (
    <div className="journey-dashboard space-y-8">
      {/* Personal welcome and profile progress */}
      <section className="border-b border-[#C9A227]/45 pb-6 sm:pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="eyebrow">{isTelugu ? "మీ వివాహ ప్రయాణం" : "Your matrimonial journey"}</p>
            <h1 className="mt-2 font-serif text-4xl font-medium leading-tight text-[#24103F] sm:text-5xl">
              {isTelugu ? "స్వాగతం, " : "Welcome back, "}
              {account?.full_name ||
                profile?.display_name ||
                user?.email?.split("@")[0] ||
                "Member"}
            </h1>
            <p className="mt-2 text-sm text-[#756A61]">
              {profile?.profile_code ? (
                <span className="font-medium text-[#24103F]">
                  Matrimony ID {profile.profile_code} <span className="mx-1 text-[#D8D0C7]">·</span>
                </span>
              ) : null}
              {profile?.moderation_status === "approved"
                ? isTelugu
                  ? "మీ ప్రొఫైల్ ఆమోదించబడింది, సభ్యులకు కనిపిస్తుంది"
                  : "Profile approved and visible to members"
                : profile?.moderation_status === "rejected"
                  ? isTelugu
                    ? "ఆమోదానికి ముందు మీ ప్రొఫైల్‌లో మార్పులు అవసరం"
                    : "Your profile needs an update before approval"
                  : profile?.moderation_status === "suspended" ||
                      profile?.moderation_status === "blocked"
                    ? isTelugu
                      ? "మీ ప్రొఫైల్ ప్రస్తుతం అందుబాటులో లేదు"
                      : "Your profile is currently unavailable"
                    : isTelugu
                      ? "మీ ప్రొఫైల్ కమ్యూనిటీ సమీక్ష కోసం వేచి ఉంది"
                      : "Your profile is awaiting community review"}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {membershipQuery.isLoading ? (
                <Skeleton className="h-6 w-32 rounded-full" />
              ) : membershipQuery.isError ? (
                <Badge variant="outline" className="border-[#E4DDD3] text-[#756A61]">
                  {isTelugu ? "సభ్యత్వ స్థితి అందుబాటులో లేదు" : "Membership status unavailable"}
                </Badge>
              ) : membershipQuery.data ? (
                <Badge
                  variant="outline"
                  className="border-[#087333]/30 bg-[#087333]/5 text-[#087333]"
                >
                  {membershipQuery.data.membership_plans?.name ||
                    (isTelugu ? "సక్రియ సభ్యత్వం" : "Active membership")}
                </Badge>
              ) : (
                <Badge variant="outline" className="border-[#E4DDD3] text-[#756A61]">
                  {isTelugu ? "సక్రియ ప్రణాళిక లేదు" : "No active plan"}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button asChild size="sm">
              <Link to="/search">
                <Search className="h-4 w-4" />
                {isTelugu ? "మ్యాచ్‌లను కనుగొనండి" : "Find Matches"}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard/profile">
                <Edit3 className="h-3.5 w-3.5" />
                {isTelugu ? "ప్రొఫైల్ సవరించండి" : "Edit Profile"}
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 border-t border-[#E4DDD3] pt-5">
          {completionLoading ? (
            <div aria-label="Loading profile completion" className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ) : completionError ? (
            <ErrorState
              title="Could not calculate profile completion"
              description="Some profile details could not be loaded. Retry to see an accurate checklist."
              onRetry={() => {
                void ownProfileQuery.refetch();
                void privateDetailsQuery.refetch();
                void preferencesQuery.refetch();
                void photosQuery.refetch();
              }}
            />
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-[#211D22]">
                  {isTelugu ? "ప్రొఫైల్ పూర్తి" : "Profile completion"}
                </span>
                <span className="font-semibold text-[#24103F]">{completion.percent}%</span>
              </div>
              <div
                className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#EEEAE2]"
                role="progressbar"
                aria-label="Profile completion"
                aria-valuenow={completion.percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-[#087333] transition-[width] duration-300"
                  style={{ width: `${completion.percent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[#756A61]">
                {completion.missing.length > 0
                  ? `Add ${completion.missing.slice(0, 2).join(" and ")} to help families understand your profile.`
                  : "Your profile is complete and ready for matching."}
              </p>
              <div className="mt-4 grid gap-4 border-t border-[#E4DDD3] pt-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold text-[#087333]">Complete</p>
                  <ul className="space-y-1.5 text-xs text-[#756A61]">
                    {completion.items.filter((item) => item.complete).length ? (
                      completion.items
                        .filter((item) => item.complete)
                        .map((item) => <li key={item.label}>✓ {item.label}</li>)
                    ) : (
                      <li>Details will appear as you complete your profile.</li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold text-[#916E14]">Still to add</p>
                  <ul className="space-y-1.5 text-xs text-[#756A61]">
                    {completion.items.filter((item) => !item.complete).length ? (
                      completion.items
                        .filter((item) => !item.complete)
                        .map((item) => <li key={item.label}>○ {item.label}</li>)
                    ) : (
                      <li>Nothing right now. Your profile checklist is complete.</li>
                    )}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 2. Quick Actions Ribbon */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-4">
        <Link
          to="/dashboard/profile"
          className="journey-action group flex items-center gap-3 border-b border-[#E4DDD3] bg-transparent py-3 transition-colors hover:border-[#C9A227]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[#24103F] transition-colors group-hover:text-[#087333]">
            <Edit3 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground group-hover:text-[#21083F] truncate">
              Complete Profile
            </p>
            <p className="text-[10px] text-muted-foreground truncate">Update details</p>
          </div>
        </Link>

        <Link
          to="/search"
          className="journey-action group flex items-center gap-3 border-b border-[#E4DDD3] bg-transparent py-3 transition-colors hover:border-[#C9A227]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[#087333] transition-colors group-hover:text-[#24103F]">
            <Search className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground group-hover:text-[#087A32] truncate">
              Find Matches
            </p>
            <p className="text-[10px] text-muted-foreground truncate">Filter alliances</p>
          </div>
        </Link>

        <Link
          to="/dashboard/interests"
          className="journey-action group flex items-center gap-3 border-b border-[#E4DDD3] bg-transparent py-3 transition-colors hover:border-[#C9A227]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[#24103F] transition-colors group-hover:text-[#087333]">
            <Mail className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground group-hover:text-[#351064] truncate">
              View Interests
            </p>
            <p className="text-[10px] text-muted-foreground truncate">Sent & received</p>
          </div>
        </Link>

        <Link
          to="/membership"
          className="journey-action group flex items-center gap-3 border-b border-[#E4DDD3] bg-transparent py-3 transition-colors hover:border-[#C9A227]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[#A88724] transition-colors group-hover:text-[#24103F]">
            <Crown className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground group-hover:text-[#C9A227] truncate">
              Upgrade Plan
            </p>
            <p className="text-[10px] text-muted-foreground truncate">Unlock contact info</p>
          </div>
        </Link>
      </div>

      {/* 3. Quick Stats Grid */}
      <div className="journey-metrics grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="journey-metric rounded-lg border border-[#E4DDD3] bg-white shadow-none hover:border-[#087333]/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Shortlisted
            </CardTitle>
            <div className="journey-metric-icon rounded-full bg-rose-50 p-2 text-rose-600">
              <Heart className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-serif text-3xl font-bold text-[#21083F]">
              {actions.isShortlistLoading ? (
                <Skeleton className="h-9 w-12" />
              ) : actions.isShortlistError ? (
                "—"
              ) : (
                actions.shortlistedIds.size
              )}
            </div>
            <Link
              to="/dashboard/shortlist"
              className="mt-2 inline-flex items-center text-xs font-semibold text-[#087A32] hover:text-[#034B21]"
            >
              View candidates <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="journey-metric rounded-lg border border-[#E4DDD3] bg-white shadow-none hover:border-[#087333]/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Interests Sent
            </CardTitle>
            <div className="journey-metric-icon rounded-full bg-purple-50 p-2 text-[#351064]">
              <UserRound className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-serif text-3xl font-bold text-[#21083F]">
              {actions.isInterestsLoading ? (
                <Skeleton className="h-9 w-12" />
              ) : actions.isInterestsError ? (
                "—"
              ) : (
                actions.sentInterests.size
              )}
            </div>
            <Link
              to="/dashboard/interests"
              className="mt-2 inline-flex items-center text-xs font-semibold text-[#087A32] hover:text-[#034B21]"
            >
              Track proposals <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="journey-metric rounded-lg border border-[#E4DDD3] bg-white shadow-none hover:border-[#087333]/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notifications
            </CardTitle>
            <div className="journey-metric-icon rounded-full bg-amber-50 p-2 text-[#C9A227]">
              <Bell className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-serif text-3xl font-bold text-[#21083F]">
              {unreadCountQuery.isLoading ? (
                <Skeleton className="h-9 w-12" />
              ) : unreadCountQuery.isError ? (
                "—"
              ) : (
                (unreadCountQuery.data ?? 0)
              )}
            </div>
            <Link
              to="/dashboard/notifications"
              className="mt-2 inline-flex items-center text-xs font-semibold text-[#087A32] hover:text-[#034B21]"
            >
              View updates <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="journey-metric rounded-lg border border-[#E4DDD3] bg-white shadow-none hover:border-[#087333]/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Membership
            </CardTitle>
            <div className="journey-metric-icon rounded-full bg-yellow-50 p-2 text-[#C9A227]">
              <Crown className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-serif text-xl font-bold text-[#21083F] truncate">
              {membershipQuery.isLoading ? (
                <Skeleton className="h-7 w-28" />
              ) : membershipQuery.isError ? (
                "Unavailable"
              ) : (
                (membershipQuery.data?.membership_plans?.name ?? "No active plan")
              )}
            </div>
            <Link
              to="/membership"
              className="mt-2 inline-flex items-center text-xs font-semibold text-[#087A32] hover:text-[#034B21]"
            >
              Upgrade benefits <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 4. Profile Overview & Next Steps */}
      <div className="grid gap-6 md:grid-cols-[1fr_1.6fr]">
        {/* Profile Card Preview */}
        <Card className="journey-panel overflow-hidden rounded-lg border border-[#E4DDD3] bg-white shadow-none">
          <CardHeader className="border-b border-[#E4DDD3] pb-3.5">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-lg font-bold text-[#21083F]">
                {isTelugu ? "మీ పబ్లిక్ ప్రొఫైల్" : "Your public profile"}
              </CardTitle>
              <Badge
                variant="outline"
                className={
                  profile?.moderation_status === "approved"
                    ? "border-[#087A32]/40 text-[#087A32] text-[10px]"
                    : "border-amber-500/40 text-amber-700 text-[10px]"
                }
              >
                <ShieldCheck className="mr-1 h-3 w-3" />
                {profile?.moderation_status === "approved"
                  ? "Approved"
                  : profile?.moderation_status === "rejected"
                    ? "Needs changes"
                    : profile?.moderation_status === "blocked" ||
                        profile?.moderation_status === "suspended"
                      ? "Unavailable"
                      : "Pending review"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {ownProfileQuery.isLoading ? (
              <Skeleton className="aspect-[4/5] w-full rounded-md" />
            ) : ownProfileQuery.isError ? (
              <ErrorState
                title="Could not load your profile"
                description="Retry to load your profile details."
                onRetry={() => void ownProfileQuery.refetch()}
              />
            ) : profile ? (
              <div>
                <div className="aspect-[4/5] w-full overflow-hidden rounded-md border border-[#E4DDD3] bg-[#F3EFE6]">
                  <ProtectedPhoto
                    profileId={profile.id}
                    displayName={profile.display_name}
                    ownerMode={true}
                    storagePath={primaryPhoto?.storage_path}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-3">
                  <p className="font-serif text-xl font-medium text-[#24103F]">
                    {profile.display_name}, {profile.age ?? "—"}
                  </p>
                  <p className="mt-0.5 text-xs text-[#756A61]">
                    {locationLine(profile.city, profile.state) ||
                      (isTelugu ? "ప్రాంతం పంచుకోలేదు" : "Location not shared")}
                  </p>
                </div>

                <div className="mt-4 space-y-1.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between border-b pb-1.5 text-muted-foreground">
                    <span>Height</span>
                    <span className="font-semibold text-foreground">
                      {formatHeight(profile.height_cm)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-1.5 text-muted-foreground">
                    <span>Education</span>
                    <span className="font-semibold text-foreground truncate max-w-[160px]">
                      {profile.education || (isTelugu ? "పంచుకోలేదు" : "Not shared")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5 text-muted-foreground">
                    <span>Occupation</span>
                    <span className="font-semibold text-foreground truncate max-w-[160px]">
                      {profile.occupation || (isTelugu ? "పంచుకోలేదు" : "Not shared")}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-[#21083F] hover:bg-[#351064] text-white"
                  >
                    <Link to="/dashboard/profile">
                      {isTelugu ? "వివరాలు సవరించండి" : "Edit Details"}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full border-[#C9A227]/40"
                  >
                    <Link to="/profile/$id" params={{ id: profile.id }}>
                      {isTelugu ? "పబ్లిక్‌గా చూడండి" : "View as Public"}
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                <p>No matrimonial profile found for this account.</p>
                <Button
                  asChild
                  size="sm"
                  className="mt-4 bg-[#21083F] hover:bg-[#351064] text-white font-semibold"
                >
                  <Link to="/dashboard/profile">Create Your Profile</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Shortcuts & Best Practices */}
        <div className="space-y-4">
          <Card className="journey-panel overflow-hidden rounded-lg border border-[#E4DDD3] bg-white shadow-none">
            <CardHeader className="border-b border-[#E4DDD3] pb-3.5">
              <CardTitle className="font-serif text-lg font-bold text-[#21083F]">
                {isTelugu ? "ప్రొఫైల్‌కు సహాయం" : "A thoughtful profile"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3.5">
              <div className="flex items-start gap-3.5 border-b border-[#E4DDD3] py-4 last:border-0">
                <div className="rounded-md bg-[#F3F0F7] p-2.5 text-[#24103F]">
                  <Camera className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#21083F]">
                    {isTelugu ? "స్పష్టమైన ప్రొఫైల్ ఫోటోలు" : "Clear profile photos"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {photosQuery.data?.length
                      ? isTelugu
                        ? `${photosQuery.data.length} ఫోటోలు అప్‌లోడ్ చేయబడ్డాయి.`
                        : `${photosQuery.data.length} photo(s) uploaded and active.`
                      : isTelugu
                        ? "స్పష్టమైన, సహజమైన పోర్ట్రెయిట్ కుటుంబాలకు మీ ప్రొఫైల్‌ను అర్థం చేసుకోవడంలో సహాయపడుతుంది."
                        : "A clear, natural portrait helps families understand your profile."}
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-[#C9A227]/40"
                >
                  <Link to="/dashboard/photos">
                    {isTelugu ? "ఫోటోలను నిర్వహించండి" : "Manage Photos"}
                  </Link>
                </Button>
              </div>

              <div className="flex items-start gap-3.5 border-b border-[#E4DDD3] py-4 last:border-0">
                <div className="rounded-md bg-[#EDF4EF] p-2.5 text-[#087333]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#087A32]">
                    {isTelugu ? "గోప్యత & సంప్రదింపు అనుమతులు" : "Privacy & Contact Permissions"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {isTelugu
                      ? "పరస్పర అంగీకారం ఏర్పడే వరకు ఫోన్ నంబర్లు, జాతక పత్రాలు గోప్యంగా ఉంటాయి."
                      : "Phone numbers and horoscope documents stay private unless the member's access settings allow sharing."}
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-[#C9A227]/40"
                >
                  <Link to="/dashboard/privacy">{isTelugu ? "గోప్యత" : "Privacy"}</Link>
                </Button>
              </div>

              <div className="flex items-start gap-3.5 py-4">
                <div className="rounded-md bg-[#F5F1E8] p-2.5 text-[#916E14]">
                  <Crown className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#21083F]">
                    {isTelugu ? "సభ్యత్వంతో పరిచయాలు" : "Membership and connections"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {isTelugu
                      ? "తగిన సభ్యత్వంతో సంప్రదింపు అభ్యర్థనలను పంపండి. యజమాని ఆమోదించిన తర్వాత మాత్రమే అనుమతించిన వివరాలు కనిపిస్తాయి."
                      : "Eligible membership can unlock contact access after the profile owner accepts your request."}
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-[#C9A227]/40"
                >
                  <Link to="/membership">{isTelugu ? "ప్రణాళికలు చూడండి" : "View Plans"}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 5. Recommended Matches Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col gap-2 border-b border-[#E4DDD3] pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#21083F]">
              {isTelugu ? "మీ కోసం సూచించిన మ్యాచ్‌లు" : "Recommended Matches for You"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Profiles matched from your partner preferences and approved member data.
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs font-semibold text-[#087A32] hover:text-[#034B21]"
          >
            <Link to="/search">
              View All Matches <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {recommendedQuery.isLoading ||
        actions.isBlockedLoading ||
        actions.isIgnoredLoading ||
        actions.isShortlistLoading ||
        actions.isInterestsLoading ||
        preferencesQuery.isLoading ? (
          <div className="home-profile-discovery grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-none" />
            ))}
          </div>
        ) : ownProfileQuery.isError ||
          preferencesQuery.isError ||
          actions.isBlockedError ||
          actions.isIgnoredError ||
          actions.isShortlistError ||
          actions.isInterestsError ||
          recommendedQuery.isError ? (
          <ErrorState
            title="Could not load match recommendations"
            description="Your profile, preferences, or privacy settings could not be loaded. Retry to refresh the recommendations."
            onRetry={() => {
              void Promise.all([
                ownProfileQuery.refetch(),
                preferencesQuery.refetch(),
                queryClient.invalidateQueries({ queryKey: ["blocked-profile-ids"] }),
                queryClient.invalidateQueries({ queryKey: ["ignored-profile-ids"] }),
                queryClient.invalidateQueries({ queryKey: ["shortlist-ids"] }),
                queryClient.invalidateQueries({ queryKey: ["sent-interest-ids"] }),
              ]);
            }}
          />
        ) : recommendedQuery.data?.length ? (
          <div className="home-profile-discovery grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            {recommendedQuery.data.map((match, index) => (
              <ProfileCard
                key={match.id}
                profile={match}
                className={index === 0 ? "home-featured-profile" : "home-list-profile"}
                shortlisted={actions.shortlistedIds.has(match.id)}
                interestSent={actions.sentInterests.has(match.id)}
                onShortlist={() => actions.toggleShortlist.mutate(match.id)}
                onInterest={() => actions.sendInterest.mutate(match.id)}
              />
            ))}
          </div>
        ) : !profile ? (
          <div className="rounded-lg border border-dashed border-[#D8D0C7] p-8 text-center text-sm text-muted-foreground">
            <p>Complete your profile to get recommendations based on your preferences.</p>
            <Button asChild size="sm" className="mt-3 bg-[#21083F] text-white">
              <Link to="/dashboard/profile">Complete Profile</Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[#D8D0C7] p-8 text-center text-sm text-muted-foreground">
            <p>No new match recommendations found currently.</p>
            <Button asChild size="sm" className="mt-3 bg-[#21083F] text-white">
              <Link to="/search">Browse Community Directory</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
