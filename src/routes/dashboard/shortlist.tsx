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
import { findDemoProfile, isDemoId } from "@/data/demo-profiles";

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
          // Continue to include demo profiles
        }
      }

      const dbIds = new Set(dbProfiles.map((p) => p.id));
      const demoProfiles: PublicProfileCardData[] = [];
      for (const id of actions.shortlistedIds) {
        if (isDemoId(id) && !dbIds.has(id)) {
          const found = findDemoProfile(id);
          if (found) demoProfiles.push(found);
        }
      }

      return [...dbProfiles, ...demoProfiles];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">Shortlisted Profiles</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Candidate profiles you have bookmarked for family review and discussion.
        </p>
      </div>

      {shortlistQuery.isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
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
          title="Your shortlist is empty"
          description="Browse profiles and click 'Shortlist' to save candidates you are interested in."
        >
          <div className="mt-4">
            <Button asChild>
              <Link to="/search">
                <Search className="mr-1.5 h-4 w-4" />
                Search Profiles
              </Link>
            </Button>
          </div>
        </EmptyState>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
