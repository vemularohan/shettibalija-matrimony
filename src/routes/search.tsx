import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FormEvent, useState, useEffect } from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileCard, type PublicProfileCardData } from "@/components/profiles/profile-card";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useProfileActions } from "@/hooks/use-profile-actions";
import { supabase } from "@/integrations/supabase/client";
import { filterDemoProfiles } from "@/data/demo-profiles";
import { validateSearchParams, type SearchParams } from "@/lib/search-params";
import { SITE_NAME } from "@/lib/site";
import { EDUCATION_OPTIONS, OCCUPATION_OPTIONS, STATES } from "@/lib/options";

export const Route = createFileRoute("/search")({
  validateSearch: validateSearchParams,
  component: SearchPage,
  head: () => ({
    meta: [
      { title: `Search Profiles | ${SITE_NAME}` },
      { name: "description", content: "Search verified Shettibalija matrimony profiles" },
    ],
  }),
});

function SearchPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();
  const actions = useProfileActions();

  const [gender, setGender] = useState(searchParams.gender ?? "");
  const [minAge, setMinAge] = useState(searchParams.minAge ? String(searchParams.minAge) : "");
  const [maxAge, setMaxAge] = useState(searchParams.maxAge ? String(searchParams.maxAge) : "");
  const [state, setState] = useState(searchParams.state ?? "");
  const [education, setEducation] = useState(searchParams.education ?? "");
  const [occupation, setOccupation] = useState(searchParams.occupation ?? "");

  // Synchronize local form when searchParams change in the URL
  useEffect(() => {
    setGender(searchParams.gender ?? "");
    setMinAge(searchParams.minAge ? String(searchParams.minAge) : "");
    setMaxAge(searchParams.maxAge ? String(searchParams.maxAge) : "");
    setState(searchParams.state ?? "");
    setEducation(searchParams.education ?? "");
    setOccupation(searchParams.occupation ?? "");
  }, [searchParams]);

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault();
    void navigate({
      to: "/search",
      search: {
        gender: gender || undefined,
        minAge: minAge ? Number(minAge) : undefined,
        maxAge: maxAge ? Number(maxAge) : undefined,
        state: state || undefined,
        education: education || undefined,
        occupation: occupation || undefined,
        page: 1,
      },
    });
  }

  function handleResetFilters() {
    setGender("");
    setMinAge("");
    setMaxAge("");
    setState("");
    setEducation("");
    setOccupation("");
    void navigate({
      to: "/search",
      search: {},
    });
  }

  const profilesQuery = useQuery({
    queryKey: ["search-profiles", searchParams],
    queryFn: async () => {
      let realProfiles: PublicProfileCardData[] = [];
      try {
        let query = supabase.from("approved_matrimonial_profiles").select("*");

        if (searchParams.gender) {
          query = query.eq("gender", searchParams.gender);
        }
        if (searchParams.minAge != null) {
          query = query.gte("age", searchParams.minAge);
        }
        if (searchParams.maxAge != null) {
          query = query.lte("age", searchParams.maxAge);
        }
        if (searchParams.state) {
          query = query.eq("state", searchParams.state);
        }
        if (searchParams.education) {
          query = query.eq("education", searchParams.education);
        }
        if (searchParams.occupation) {
          query = query.eq("occupation", searchParams.occupation);
        }

        query = query.order("created_at", { ascending: false }).limit(40);

        const { data, error } = await query;
        if (!error && data) {
          realProfiles = data.filter((p): p is typeof p & { id: string } => Boolean(p.id));
        }
      } catch {
        // Continue with demo profiles
      }

      const filteredDemo = filterDemoProfiles({
        gender: searchParams.gender,
        minAge: searchParams.minAge,
        maxAge: searchParams.maxAge,
        state: searchParams.state,
        education: searchParams.education,
        occupation: searchParams.occupation,
      });

      const realIds = new Set(realProfiles.map((p) => p.id));
      const combined = [...realProfiles, ...filteredDemo.filter((d) => !realIds.has(d.id))];
      return combined;
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary md:text-4xl">Search Profiles</h1>
        <p className="mt-1 text-muted-foreground">
          Browse verified brides and grooms from the Shettibalija community
        </p>
      </div>

      {/* Filter form */}
      <form
        onSubmit={handleSearchSubmit}
        className="mb-10 rounded-2xl border bg-card p-5 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold">Filter Criteria</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div className="space-y-1">
            <Label className="text-xs">Looking for</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Bride / Groom</option>
              <option value="bride">Bride</option>
              <option value="groom">Groom</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Min Age</Label>
            <Input
              type="number"
              min={18}
              max={70}
              placeholder="18"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Max Age</Label>
            <Input
              type="number"
              min={18}
              max={70}
              placeholder="60"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">State</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Any State</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Education</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            >
              <option value="">Any Education</option>
              {EDUCATION_OPTIONS.map((edu) => (
                <option key={edu} value={edu}>
                  {edu}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Occupation</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            >
              <option value="">Any Occupation</option>
              {OCCUPATION_OPTIONS.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleResetFilters}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Reset
          </Button>
          <Button type="submit" size="sm">
            <Search className="mr-1.5 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </form>

      {/* Results */}
      <div>
        {profilesQuery.isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-96 rounded-2xl" />
            ))}
          </div>
        ) : profilesQuery.isError ? (
          <ErrorState
            title="Failed to load profiles"
            description="There was an error querying the matrimonial database. Please try again."
            onRetry={() => void profilesQuery.refetch()}
          />
        ) : !profilesQuery.data?.length ? (
          <EmptyState
            title="No matching profiles found"
            description="Try adjusting or clearing your search filters to view more profiles."
            actionLabel="Reset All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Found {profilesQuery.data.length} profile
                {profilesQuery.data.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {profilesQuery.data
                .filter((p): p is typeof p & { id: string } => Boolean(p.id))
                .map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    shortlisted={actions.shortlistedIds.has(profile.id)}
                    interestSent={actions.sentInterests.has(profile.id)}
                    onShortlist={() => actions.toggleShortlist.mutate(profile.id)}
                    onInterest={() => actions.sendInterest.mutate(profile.id)}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
