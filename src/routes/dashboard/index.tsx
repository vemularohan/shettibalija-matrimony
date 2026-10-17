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
  Sparkles,
  CheckCircle2,
  Mail,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_PROFILES } from "@/data/demo-profiles";
import { profileCompletion } from "@/lib/profile-completion";
import { formatHeight, locationLine } from "@/lib/format";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { SITE_NAME_TE } from "@/lib/site";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverviewPage,
});

function DashboardOverviewPage() {
  const { user, account } = useAuth();
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

  const primaryPhoto = photosQuery.data?.find((p) => p.is_primary) ?? photosQuery.data?.[0];

  // Recommended matches query
  const recommendedQuery = useQuery({
    queryKey: ["dashboard-recommended", profile?.gender, profile?.id],
    queryFn: async () => {
      const targetGender =
        profile?.gender === "male" ? "female" : profile?.gender === "female" ? "male" : undefined;

      let dbMatches: PublicProfileCardData[] = [];
      try {
        let q = supabase
          .from("approved_matrimonial_profiles")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);

        if (targetGender) {
          q = q.eq("gender", targetGender);
        }
        if (profile?.id) {
          q = q.neq("id", profile.id);
        }

        const { data, error } = await q;
        if (!error && data) {
          dbMatches = data as PublicProfileCardData[];
        }
      } catch {
        // Fallback to demo profiles
      }

      const existingIds = new Set(dbMatches.map((p) => p.id));
      const targetDemoGender =
        targetGender === "male" ? "groom" : targetGender === "female" ? "bride" : undefined;
      const demoMatches = DEMO_PROFILES.filter((d) => {
        if (existingIds.has(d.id)) return false;
        if (profile?.id && d.id === profile.id) return false;
        if (targetDemoGender && d.gender !== targetDemoGender) return false;
        return true;
      });

      return [...dbMatches, ...demoMatches].slice(0, 4);
    },
  });

  return (
    <div className="space-y-8">
      {/* 1. Cinematic Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#D9A514]/30 bg-gradient-to-br from-[#21083F] via-[#2A0A4E] to-[#351064] p-6 sm:p-8 text-white shadow-xl">
        {/* Ambient background glow & subtle watermark */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#D9A514]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-[#087A32]/20 blur-3xl" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative shrink-0 rounded-2xl bg-white/10 p-2.5 backdrop-blur-md border border-[#D9A514]/30 shadow-inner">
                <ShettibalijaLogo size="lg" priority />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D9A514] text-[9px] text-[#21083F]">
                  ★
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-[#F4D477]">
                    {SITE_NAME_TE} • MEMBER PORTAL
                  </span>
                  {membershipQuery.data ? (
                    <Badge className="bg-gradient-to-r from-[#D9A514] to-[#F4D477] text-[#21083F] font-bold text-[10px] border-0">
                      ★ {membershipQuery.data?.membership_plans?.name || "VIP MEMBER"}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-white/80 border-white/20 text-[10px]">
                      Basic Registration
                    </Badge>
                  )}
                </div>

                <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-wide text-white">
                  Welcome,{" "}
                  <span className="text-[#F4D477]">
                    {account?.full_name ||
                      profile?.display_name ||
                      user?.email?.split("@")[0] ||
                      "Member"}
                  </span>
                </h1>

                <p className="mt-1 text-xs sm:text-sm text-white/70">
                  {profile?.profile_code ? (
                    <>
                      Profile Code:{" "}
                      <span className="font-semibold text-white tracking-wider">
                        {profile.profile_code}
                      </span>{" "}
                      •{" "}
                    </>
                  ) : null}
                  <span>Verified Shettibalija Community Matchmaking</span>
                </p>
              </div>
            </div>

            {/* Quick CTAs inside banner */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-[#087A32] to-[#0A963E] hover:from-[#034B21] hover:to-[#087A32] text-white font-semibold shadow-md border border-[#D9A514]/30"
              >
                <Link to="/search">
                  <Search className="mr-1.5 h-4 w-4" />
                  Find Matches
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-white/25 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md font-medium"
              >
                <Link to="/dashboard/profile">
                  <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-medium text-white/90 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#F4D477]" />
                Profile Completeness Score
              </span>
              <span className="font-bold text-[#F4D477] text-sm">
                {completion.percent}% Complete
              </span>
            </div>
            <div className="relative mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#D9A514] via-[#F4D477] to-[#D9A514] transition-all duration-500 shadow-sm"
                style={{ width: `${completion.percent}%` }}
              />
            </div>
            {completion.missing.length > 0 ? (
              <p className="mt-2 text-xs text-white/60">
                Tip: Add {completion.missing.slice(0, 2).join(" & ")} to increase verified family
                interest responses by 5x.
              </p>
            ) : (
              <p className="mt-2 text-xs text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Your profile is fully complete and ready
                for matching!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Quick Actions Ribbon */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link
          to="/dashboard/profile"
          className="group flex items-center gap-3 rounded-2xl border border-[#D9A514]/20 bg-white p-4 shadow-xs hover:border-[#D9A514] hover:shadow-md transition-all duration-200"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#21083F]/5 text-[#21083F] group-hover:bg-[#21083F] group-hover:text-[#F4D477] transition-colors">
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
          className="group flex items-center gap-3 rounded-2xl border border-[#D9A514]/20 bg-white p-4 shadow-xs hover:border-[#D9A514] hover:shadow-md transition-all duration-200"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#087A32]/10 text-[#087A32] group-hover:bg-[#087A32] group-hover:text-white transition-colors">
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
          className="group flex items-center gap-3 rounded-2xl border border-[#D9A514]/20 bg-white p-4 shadow-xs hover:border-[#D9A514] hover:shadow-md transition-all duration-200"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#351064]/5 text-[#351064] group-hover:bg-[#351064] group-hover:text-white transition-colors">
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
          className="group flex items-center gap-3 rounded-2xl border border-[#D9A514]/20 bg-white p-4 shadow-xs hover:border-[#D9A514] hover:shadow-md transition-all duration-200"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D9A514]/15 text-[#D9A514] group-hover:bg-[#D9A514] group-hover:text-[#21083F] transition-colors">
            <Crown className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground group-hover:text-[#D9A514] truncate">
              Upgrade Plan
            </p>
            <p className="text-[10px] text-muted-foreground truncate">Unlock contact info</p>
          </div>
        </Link>
      </div>

      {/* 3. Quick Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border border-[#D9A514]/20 bg-white shadow-xs hover:border-[#D9A514]/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Shortlisted
            </CardTitle>
            <div className="rounded-full bg-rose-50 p-2 text-rose-600">
              <Heart className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-serif text-3xl font-bold text-[#21083F]">
              {actions.shortlistedIds.size}
            </div>
            <Link
              to="/dashboard/shortlist"
              className="mt-2 inline-flex items-center text-xs font-semibold text-[#087A32] hover:text-[#034B21]"
            >
              View candidates <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#D9A514]/20 bg-white shadow-xs hover:border-[#D9A514]/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Interests Sent
            </CardTitle>
            <div className="rounded-full bg-purple-50 p-2 text-[#351064]">
              <UserRound className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-serif text-3xl font-bold text-[#21083F]">
              {actions.sentInterests.size}
            </div>
            <Link
              to="/dashboard/interests"
              className="mt-2 inline-flex items-center text-xs font-semibold text-[#087A32] hover:text-[#034B21]"
            >
              Track proposals <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#D9A514]/20 bg-white shadow-xs hover:border-[#D9A514]/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notifications
            </CardTitle>
            <div className="rounded-full bg-amber-50 p-2 text-[#D9A514]">
              <Bell className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-serif text-3xl font-bold text-[#21083F]">
              {unreadCountQuery.data ?? 0}
            </div>
            <Link
              to="/dashboard/notifications"
              className="mt-2 inline-flex items-center text-xs font-semibold text-[#087A32] hover:text-[#034B21]"
            >
              View updates <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#D9A514]/20 bg-white shadow-xs hover:border-[#D9A514]/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Membership
            </CardTitle>
            <div className="rounded-full bg-yellow-50 p-2 text-[#D9A514]">
              <Crown className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-serif text-xl font-bold text-[#21083F] truncate">
              {membershipQuery.data?.membership_plans?.name ?? "Standard"}
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
        <Card className="overflow-hidden rounded-3xl border border-[#D9A514]/25 bg-white shadow-sm">
          <CardHeader className="border-b border-[#D9A514]/15 bg-gradient-to-r from-[#21083F]/5 to-transparent pb-3.5">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-lg font-bold text-[#21083F]">
                My Public Profile Card
              </CardTitle>
              <Badge variant="outline" className="border-[#087A32]/40 text-[#087A32] text-[10px]">
                <ShieldCheck className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {ownProfileQuery.isLoading ? (
              <Skeleton className="h-72 w-full rounded-2xl" />
            ) : profile ? (
              <div>
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[#D9A514]/30 shadow-md">
                  <ProtectedPhoto
                    profileId={profile.id}
                    displayName={profile.display_name}
                    ownerMode={true}
                    storagePath={primaryPhoto?.storage_path}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#21083F]/90 via-[#21083F]/40 to-transparent p-4 text-white">
                    <p className="font-serif text-xl font-bold tracking-wide">
                      {profile.display_name}, {profile.age}
                    </p>
                    <p className="text-xs text-[#F4D477]">
                      {locationLine(profile.city, profile.state) || "Andhra Pradesh"}
                    </p>
                  </div>
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
                      {profile.education || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5 text-muted-foreground">
                    <span>Occupation</span>
                    <span className="font-semibold text-foreground truncate max-w-[160px]">
                      {profile.occupation || "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-[#21083F] hover:bg-[#351064] text-white"
                  >
                    <Link to="/dashboard/profile">Edit Details</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full border-[#D9A514]/40"
                  >
                    <Link to="/profile/$id" params={{ id: profile.id }}>
                      View as Public
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
          <Card className="rounded-3xl border border-[#D9A514]/25 bg-white shadow-sm overflow-hidden">
            <CardHeader className="border-b border-[#D9A514]/15 bg-gradient-to-r from-[#21083F]/5 to-transparent pb-3.5">
              <CardTitle className="font-serif text-lg font-bold text-[#21083F]">
                Alliance Boost &amp; Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3.5">
              <div className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-[#F8F7F4]/50 p-4 hover:border-[#D9A514]/60 hover:bg-[#F8F7F4] transition-all">
                <div className="rounded-xl bg-[#21083F]/10 p-2.5 text-[#21083F]">
                  <Camera className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#21083F]">
                    High-Quality Profile Photos
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {photosQuery.data?.length
                      ? `${photosQuery.data.length} photo(s) uploaded and active.`
                      : "Shettibalija families prioritize profiles with clear, authentic portraits."}
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-[#D9A514]/40"
                >
                  <Link to="/dashboard/photos">Manage Photos</Link>
                </Button>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-[#F8F7F4]/50 p-4 hover:border-[#D9A514]/60 hover:bg-[#F8F7F4] transition-all">
                <div className="rounded-xl bg-[#087A32]/10 p-2.5 text-[#087A32]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#087A32]">
                    Privacy &amp; Contact Permissions
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    Protect phone numbers and horoscope documents until family intent is mutually
                    confirmed.
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-[#D9A514]/40"
                >
                  <Link to="/dashboard/privacy">Privacy</Link>
                </Button>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-[#F8F7F4]/50 p-4 hover:border-[#D9A514]/60 hover:bg-[#F8F7F4] transition-all">
                <div className="rounded-xl bg-[#D9A514]/20 p-2.5 text-[#D9A514]">
                  <Crown className="h-5 w-5 text-[#D9A514]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#21083F]">
                    Premium Membership Privileges
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    Direct access to parent contact numbers, horoscope downloads, and priority
                    support.
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-[#D9A514]/40"
                >
                  <Link to="/membership">View Plans</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 5. Recommended Matches Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#D9A514]/25 pb-3">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#21083F]">
              Recommended Matches for You
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Handpicked verified matrimonial profiles from the Shettibalija community
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

        {recommendedQuery.isLoading ? (
          <div className="flex overflow-x-auto gap-3.5 pb-3 snap-x no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-88 w-[230px] shrink-0 snap-start md:w-auto rounded-3xl"
              />
            ))}
          </div>
        ) : recommendedQuery.data?.length ? (
          <div className="flex overflow-x-auto gap-3.5 pb-3 snap-x no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4">
            {recommendedQuery.data.map((match) => (
              <div key={match.id} className="w-[230px] sm:w-[260px] shrink-0 snap-start md:w-auto">
                <ProfileCard profile={match} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#D9A514]/30 p-8 text-center text-sm text-muted-foreground">
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
