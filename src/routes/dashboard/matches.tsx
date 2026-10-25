import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, HeartHandshake, Search, Send } from "lucide-react";
import { ProfileCard, type PublicProfileCardData } from "@/components/profiles/profile-card";
import { useAuth } from "@/hooks/use-auth";
import { useOwnMatrimonialProfile } from "@/hooks/use-member-data";
import { useProfileActions } from "@/hooks/use-profile-actions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/matches")({
  component: DashboardMatchesPage,
});

function DashboardMatchesPage() {
  const { user } = useAuth();
  const ownProfile = useOwnMatrimonialProfile();
  const actions = useProfileActions();

  const acceptedSent = useQuery({
    queryKey: ["accepted-sent-interests", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("interests")
        .select(
          "id, status, created_at, to_profile_id, matrimonial_profiles:to_profile_id(id, display_name, age, city, state, occupation, education, profile_code)",
        )
        .eq("from_user_id", user.id)
        .eq("status", "accepted")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const acceptedReceived = useQuery({
    queryKey: ["accepted-received-interests", ownProfile.data?.id],
    enabled: Boolean(ownProfile.data?.id),
    queryFn: async () => {
      if (!ownProfile.data?.id) return [];
      const { data, error } = await supabase
        .from("interests")
        .select("id, status, created_at, from_user_id, profiles:from_user_id(id, full_name)")
        .eq("to_profile_id", ownProfile.data.id)
        .eq("status", "accepted")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const isLoading = acceptedSent.isLoading || acceptedReceived.isLoading;
  const hasMatches = Boolean(acceptedSent.data?.length) || Boolean(acceptedReceived.data?.length);

  return (
    <div className="space-y-8">
      <header className="border-b border-[#ded5c8] pb-6">
        <span className="sbm-kicker">Mutual introductions</span>
        <h1 className="sbm-heading mt-3">Matches</h1>
        <p className="sbm-body mt-3 max-w-2xl">
          A match appears here when an interest has been accepted. Take your time, speak with your
          family, and decide what feels right.
        </p>
      </header>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-sm border border-[#ded5c8] bg-white"
            >
              <div className="sbm-skeleton aspect-[4/5] rounded-none" />
              <div className="space-y-2 p-4">
                <div className="sbm-skeleton h-3 w-3/4" />
                <div className="sbm-skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !hasMatches ? (
        <div className="border border-dashed border-[#cdbfa6] bg-white px-6 py-16 text-center sm:py-20">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#D1A329]/30 bg-[#FAF8F3]">
            <HeartHandshake className="h-5 w-5 text-[#D1A329]" aria-hidden />
          </div>
          <h2 className="mt-5 font-serif text-3xl text-[#24103F]">No matches yet.</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#6B6570]">
            When you send an interest and the member accepts, the introduction will appear here. You
            can also review the interests you have received.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/search" className="sbm-button sbm-button--primary">
              <Search className="h-4 w-4" aria-hidden />
              Discover profiles
            </Link>
            <Link to="/dashboard/interests" className="sbm-button sbm-button--outline">
              Review interests
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {acceptedReceived.data && acceptedReceived.data.length > 0 ? (
            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#24103F]">Interests you accepted</h2>
                  <p className="mt-1 text-[12px] text-[#6B6570]">
                    These members expressed interest in your profile and you accepted.
                  </p>
                </div>
                <Link to="/dashboard/interests" className="sbm-link-arrow shrink-0">
                  View interests
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-[#ded5c8] border-y border-[#ded5c8] bg-white">
                {acceptedReceived.data.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-6"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#24103F]">
                        {item.profiles?.full_name || "A community member"}
                      </p>
                      <p className="mt-1 text-[11px] text-[#6B6570]">
                        Accepted on {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link to="/dashboard/interests" className="sbm-link-arrow">
                      Open conversation
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {acceptedSent.data && acceptedSent.data.length > 0 ? (
            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#24103F]">
                    Interests you sent, accepted
                  </h2>
                  <p className="mt-1 text-[12px] text-[#6B6570]">
                    These members accepted the interest you expressed.
                  </p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {acceptedSent.data.map((item) => {
                  const profile = item.matrimonial_profiles;
                  if (!profile?.id) {
                    return (
                      <div
                        key={item.id}
                        className="border border-[#ded5c8] bg-white p-5 text-sm text-[#6B6570]"
                      >
                        This profile is no longer available.
                      </div>
                    );
                  }
                  const card: PublicProfileCardData = {
                    id: profile.id,
                    profile_code: profile.profile_code,
                    display_name: profile.display_name,
                    age: profile.age,
                    height_cm: null,
                    education: profile.education,
                    occupation: profile.occupation,
                    city: profile.city,
                    state: profile.state,
                    family_summary: null,
                  };
                  return (
                    <ProfileCard
                      key={item.id}
                      profile={card}
                      shortlisted={actions.shortlistedIds.has(card.id)}
                      interestSent={true}
                      onShortlist={() => actions.toggleShortlist.mutate(card.id)}
                      onInterest={() => actions.sendInterest.mutate(card.id)}
                    />
                  );
                })}
              </div>
            </section>
          ) : null}

          <div className="flex items-center gap-3 border-t border-[#ded5c8] pt-6 text-[12px] text-[#6B6570]">
            <Send className="h-3.5 w-3.5 text-[#D1A329]" aria-hidden />
            <p>
              Conversations move at your pace. Contact details remain protected until both sides
              choose to share them.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
