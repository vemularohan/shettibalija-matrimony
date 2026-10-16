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
import {
  EDUCATION_OPTIONS,
  OCCUPATION_OPTIONS,
  STATES,
  MARITAL_STATUS_OPTIONS,
  FOOD_HABIT_OPTIONS,
  NAKSHATRA_OPTIONS,
  RASHI_OPTIONS,
  HEIGHT_CHOICES,
} from "@/lib/options";

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

  // Extended matrimonial filters
  const [maritalStatus, setMaritalStatus] = useState(searchParams.maritalStatus ?? "");
  const [foodHabit, setFoodHabit] = useState(searchParams.foodHabit ?? "");
  const [gothram, setGothram] = useState(searchParams.gothram ?? "");
  const [star, setStar] = useState(searchParams.star ?? "");
  const [rashi, setRashi] = useState(searchParams.rashi ?? "");
  const [minHeight, setMinHeight] = useState(
    searchParams.minHeight ? String(searchParams.minHeight) : "",
  );
  const [maxHeight, setMaxHeight] = useState(
    searchParams.maxHeight ? String(searchParams.maxHeight) : "",
  );
  const [showMoreFilters, setShowMoreFilters] = useState(
    Boolean(
      searchParams.maritalStatus ||
      searchParams.foodHabit ||
      searchParams.gothram ||
      searchParams.star ||
      searchParams.rashi ||
      searchParams.minHeight ||
      searchParams.maxHeight,
    ),
  );

  // Synchronize local form when searchParams change in the URL
  useEffect(() => {
    setGender(searchParams.gender ?? "");
    setMinAge(searchParams.minAge ? String(searchParams.minAge) : "");
    setMaxAge(searchParams.maxAge ? String(searchParams.maxAge) : "");
    setState(searchParams.state ?? "");
    setEducation(searchParams.education ?? "");
    setOccupation(searchParams.occupation ?? "");
    setMaritalStatus(searchParams.maritalStatus ?? "");
    setFoodHabit(searchParams.foodHabit ?? "");
    setGothram(searchParams.gothram ?? "");
    setStar(searchParams.star ?? "");
    setRashi(searchParams.rashi ?? "");
    setMinHeight(searchParams.minHeight ? String(searchParams.minHeight) : "");
    setMaxHeight(searchParams.maxHeight ? String(searchParams.maxHeight) : "");
  }, [searchParams]);

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault();
    void navigate({
      to: "/search",
      search: {
        gender: gender || undefined,
        minAge: minAge ? Number(minAge) : undefined,
        maxAge: maxAge ? Number(maxAge) : undefined,
        minHeight: minHeight ? Number(minHeight) : undefined,
        maxHeight: maxHeight ? Number(maxHeight) : undefined,
        state: state || undefined,
        education: education || undefined,
        occupation: occupation || undefined,
        maritalStatus: maritalStatus || undefined,
        foodHabit: foodHabit || undefined,
        gothram: gothram || undefined,
        star: star || undefined,
        rashi: rashi || undefined,
        page: 1,
      },
    });
  }

  function handleResetFilters() {
    setGender("");
    setMinAge("");
    setMaxAge("");
    setMinHeight("");
    setMaxHeight("");
    setState("");
    setEducation("");
    setOccupation("");
    setMaritalStatus("");
    setFoodHabit("");
    setGothram("");
    setStar("");
    setRashi("");
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
        if (searchParams.minHeight != null) {
          query = query.gte("height_cm", searchParams.minHeight);
        }
        if (searchParams.maxHeight != null) {
          query = query.lte("height_cm", searchParams.maxHeight);
        }
        if (searchParams.maritalStatus) {
          query = query.eq("marital_status", searchParams.maritalStatus);
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
        minHeight: searchParams.minHeight,
        maxHeight: searchParams.maxHeight,
        state: searchParams.state,
        education: searchParams.education,
        occupation: searchParams.occupation,
        maritalStatus: searchParams.maritalStatus,
        foodHabit: searchParams.foodHabit,
        gothram: searchParams.gothram,
        star: searchParams.star,
        rashi: searchParams.rashi,
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
        className="mb-10 rounded-2xl border border-[#E8E2D8] bg-white p-6 shadow-sm space-y-5"
      >
        <div className="flex items-center justify-between border-b border-[#D9A514]/25 pb-3">
          <div className="flex items-center gap-2.5">
            <Filter className="h-5 w-5 text-[#D9A514]" />
            <h2 className="text-lg font-serif font-bold text-[#32105F]">Filter Criteria</h2>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowMoreFilters((prev) => !prev)}
            className="text-xs text-primary"
          >
            {showMoreFilters ? "− Less Filters" : "+ More Filters (Horoscope, Diet, Height)"}
          </Button>
        </div>

        {/* Primary Filters Row */}
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
            <Label className="text-xs">Marital Status</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm"
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value)}
            >
              <option value="">Any Status</option>
              {MARITAL_STATUS_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
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

        {/* Secondary / Advanced Filters Row */}
        {showMoreFilters && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 pt-3 border-t">
            <div className="space-y-1">
              <Label className="text-xs">Min Height</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm"
                value={minHeight}
                onChange={(e) => setMinHeight(e.target.value)}
              >
                <option value="">Any Height</option>
                {HEIGHT_CHOICES.map((h) => (
                  <option key={h.cm} value={h.cm}>
                    {h.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Max Height</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm"
                value={maxHeight}
                onChange={(e) => setMaxHeight(e.target.value)}
              >
                <option value="">Any Height</option>
                {HEIGHT_CHOICES.map((h) => (
                  <option key={h.cm} value={h.cm}>
                    {h.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Food Habit</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm"
                value={foodHabit}
                onChange={(e) => setFoodHabit(e.target.value)}
              >
                <option value="">Any Food Habit</option>
                {FOOD_HABIT_OPTIONS.map((fh) => (
                  <option key={fh.value} value={fh.value}>
                    {fh.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Star / Nakshatra</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm"
                value={star}
                onChange={(e) => setStar(e.target.value)}
              >
                <option value="">Any Star</option>
                {NAKSHATRA_OPTIONS.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Rashi</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm"
                value={rashi}
                onChange={(e) => setRashi(e.target.value)}
              >
                <option value="">Any Rashi</option>
                {RASHI_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Gothram</Label>
              <Input
                placeholder="e.g. Janakula"
                value={gothram}
                onChange={(e) => setGothram(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleResetFilters}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Reset All
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
