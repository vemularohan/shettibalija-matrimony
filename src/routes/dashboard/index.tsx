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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ProtectedPhoto } from "@/components/profiles/protected-photo";
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
import { profileCompletion } from "@/lib/profile-completion";
import { formatHeight, locationLine } from "@/lib/format";

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

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl border bg-gradient-to-r from-[#fdfbf7] to-[#f7f2ea] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-foreground">
              Member Portal
            </span>
            <h1 className="mt-1 font-serif text-3xl font-bold text-primary">
              Welcome,{" "}
              {account?.full_name ||
                profile?.display_name ||
                user?.email?.split("@")[0] ||
                "Member"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile?.profile_code ? (
                <>
                  Profile Code:{" "}
                  <span className="font-semibold text-foreground">{profile.profile_code}</span>{" "}
                  •{" "}
                </>
              ) : null}
              {membershipQuery.data ? (
                <span className="text-emerald-700 font-medium">Active Member</span>
              ) : (
                <span>Basic Registration</span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link to="/search">
                <Search className="mr-1.5 h-4 w-4" />
                Find Matches
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/dashboard/profile">Edit Profile</Link>
            </Button>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-6 border-t pt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Profile Completeness</span>
            <span className="font-semibold text-primary">{completion.percent}%</span>
          </div>
          <Progress value={completion.percent} className="mt-2 h-2.5" />
          {completion.missing.length > 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Complete {completion.missing.slice(0, 2).join(", ")} to improve your match discovery.
            </p>
          ) : null}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Shortlisted</CardTitle>
            <Heart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actions.shortlistedIds.size}</div>
            <Link
              to="/dashboard/shortlist"
              className="mt-1 inline-flex items-center text-xs text-primary hover:underline"
            >
              View candidates <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Interests Sent
            </CardTitle>
            <UserRound className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actions.sentInterests.size}</div>
            <Link
              to="/dashboard/interests"
              className="mt-1 inline-flex items-center text-xs text-primary hover:underline"
            >
              View all interests <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Notifications
            </CardTitle>
            <Bell className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCountQuery.data ?? 0}</div>
            <Link
              to="/dashboard/notifications"
              className="mt-1 inline-flex items-center text-xs text-primary hover:underline"
            >
              Read messages <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Membership</CardTitle>
            <Crown className="h-4 w-4 text-gold-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">
              {membershipQuery.data?.membership_plans?.name ?? "Standard"}
            </div>
            <Link
              to="/membership"
              className="mt-1 inline-flex items-center text-xs text-primary hover:underline"
            >
              View upgrade plans <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Profile Overview Card */}
      <div className="grid gap-6 md:grid-cols-[1fr_1.8fr]">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-xl">My Public Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ownProfileQuery.isLoading ? (
              <Skeleton className="h-64 w-full rounded-2xl" />
            ) : profile ? (
              <div>
                <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl border">
                  <ProtectedPhoto
                    profileId={profile.id}
                    displayName={profile.display_name}
                    ownerMode={true}
                    storagePath={primaryPhoto?.storage_path}
                    className="h-full w-full"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="font-serif text-lg font-bold">
                    {profile.display_name}, {profile.age}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {profile.age} yrs • {formatHeight(profile.height_cm)} •{" "}
                    {locationLine(profile.city, profile.state)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {[profile.education, profile.occupation].filter(Boolean).join(" • ")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <p>No matrimonial profile found for this account.</p>
                <Button asChild size="sm" className="mt-3">
                  <Link to="/dashboard/profile">Create Profile Now</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Shortcuts */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-xl">Next Steps for Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl border p-3 hover:bg-muted/40 transition">
                <Camera className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Add Profile Photos</p>
                  <p className="text-xs text-muted-foreground">
                    {photosQuery.data?.length
                      ? `${photosQuery.data.length} photo(s) uploaded.`
                      : "Profiles with clear photos receive 8x more alliance responses."}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/dashboard/photos">Manage Photos</Link>
                </Button>
              </div>

              <div className="flex items-start gap-3 rounded-xl border p-3 hover:bg-muted/40 transition">
                <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Privacy & Photo Settings</p>
                  <p className="text-xs text-muted-foreground">
                    Choose whether your photo is visible to logged-in members or locked.
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/dashboard/privacy">Privacy</Link>
                </Button>
              </div>

              <div className="flex items-start gap-3 rounded-xl border p-3 hover:bg-muted/40 transition">
                <Crown className="h-5 w-5 text-gold-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Membership Privileges</p>
                  <p className="text-xs text-muted-foreground">
                    Direct access to parent and candidate contact phone numbers.
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/membership">View Plans</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
