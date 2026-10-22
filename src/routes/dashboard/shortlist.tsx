import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileCard, type PublicProfileCardData } from "@/components/profiles/profile-card";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { useProfileActions } from "@/hooks/use-profile-actions";
import { supabase } from "@/integrations/supabase/client";
import { MemberPageHeader } from "@/components/dashboard/member-page-header";

export const Route = createFileRoute("/dashboard/shortlist")({
  component: DashboardShortlistPage,
});

function DashboardShortlistPage() {
  const { user } = useAuth();
  const actions = useProfileActions();

  const shortlistQuery = useQuery({
    queryKey: ["shortlist-profiles", user?.id, Array.from(actions.shortlistedIds).join(",")],
    queryFn: async () => {
      let dbProfiles: PublicProfileCardData[] = [];
      if (user) {
        try {
          const { data, error } = await supabase
            .from("shortlisted_profiles")
            .select("profile_id, created_at, approved_matrimonial_profiles(*)")
            .eq("owner_id", user.id)
            .order("created_at", { ascending: false });

          if (!error && data) {
            dbProfiles = data
              .map((row) => row.approved_matrimonial_profiles)
              .filter((p): p is NonNullable<typeof p> =>
                Boolean(p && p.id),
              ) as PublicProfileCardData[];
          }
        } catch {
          // Keep the page usable if a profile is no longer available.
        }
      }

      return dbProfiles;
    },
  });

  return (
    <div className="space-y-6">
      <MemberPageHeader
        kicker="Shortlist"
        title="Shortlisted profiles"
        description="Profiles you have set aside for family review, horoscope matching or a later conversation."
      />

      {shortlistQuery.isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 sm:h-80 rounded-2xl" />
          ))}
        </div>
      ) : shortlistQuery.isError ? (
        <ErrorState
          title="Could not load shortlist"
          description="There was an issue loading your shortlisted profiles."
          onRetry={() => void shortlistQuery.refetch()}
        />
      ) : !shortlistQuery.data?.length ? (
        <EmptyState
          icon={<Heart className="h-6 w-6 text-rose-500" />}
          title="Your shortlist is empty"
          description="Browse profiles and click 'Shortlist' to save candidates you are interested in."
        >
          <div className="mt-4">
            <Button asChild className="min-h-[44px] rounded-xl bg-[#24103F] text-white">
              <Link to="/search">
                <Search className="mr-1.5 h-4 w-4" />
                Search Profiles
              </Link>
            </Button>
          </div>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {shortlistQuery.data
            .filter((p): p is typeof p & { id: string } => Boolean(p && p.id))
            .map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                shortlisted={true}
                interestSent={actions.sentInterests.has(profile.id)}
                onShortlist={() => actions.toggleShortlist.mutate(profile.id)}
                onInterest={() => actions.sendInterest.mutate(profile.id)}
              />
            ))}
        </div>
      )}
    </div>
  );
}
