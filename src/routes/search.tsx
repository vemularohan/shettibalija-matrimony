import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Filter, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProfileCard, type PublicProfileCardData } from "@/components/profiles/profile-card";
import { RequireAuth } from "@/components/shared/require-auth";
import { useProfileActions } from "@/hooks/use-profile-actions";
import { supabase } from "@/integrations/supabase/client";
import { validateSearchParams, type SearchParams } from "@/lib/search-params";
import { SITE_NAME } from "@/lib/site";
import { useLanguage } from "@/lib/i18n";
import {
  EDUCATION_OPTIONS,
  FOOD_HABIT_OPTIONS,
  HEIGHT_CHOICES,
  MARITAL_STATUS_OPTIONS,
  NAKSHATRA_OPTIONS,
  OCCUPATION_OPTIONS,
  RASHI_OPTIONS,
  STATES,
} from "@/lib/options";

export const Route = createFileRoute("/search")({
  validateSearch: validateSearchParams,
  component: SearchPageRoute,
  head: () => ({
    meta: [
      { title: `Discover Profiles | ${SITE_NAME}` },
      {
        name: "description",
        content: "Discover reviewed Shettibalija matrimony profiles by the details that matter.",
      },
    ],
  }),
});

type Filters = {
  keyword: string;
  profileId: string;
  gender: string;
  minAge: string;
  maxAge: string;
  minHeight: string;
  maxHeight: string;
  state: string;
  education: string;
  occupation: string;
  maritalStatus: string;
  foodHabit: string;
  gothram: string;
  star: string;
  rashi: string;
};

const EMPTY_FILTERS: Filters = {
  keyword: "",
  profileId: "",
  gender: "",
  minAge: "",
  maxAge: "",
  minHeight: "",
  maxHeight: "",
  state: "",
  education: "",
  occupation: "",
  maritalStatus: "",
  foodHabit: "",
  gothram: "",
  star: "",
  rashi: "",
};

function SearchPageRoute() {
  return (
    <RequireAuth>
      <SearchPage />
    </RequireAuth>
  );
}

function SearchPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();
  const actions = useProfileActions();
  const { lang } = useLanguage();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState(searchParams.sort ?? "recommended");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setFilters({
      keyword: searchParams.query ?? "",
      profileId: searchParams.profileId ?? "",
      gender: searchParams.gender ?? "",
      minAge: searchParams.minAge ? String(searchParams.minAge) : "",
      maxAge: searchParams.maxAge ? String(searchParams.maxAge) : "",
      minHeight: searchParams.minHeight ? String(searchParams.minHeight) : "",
      maxHeight: searchParams.maxHeight ? String(searchParams.maxHeight) : "",
      state: searchParams.state ?? "",
      education: searchParams.education ?? "",
      occupation: searchParams.occupation ?? "",
      maritalStatus: searchParams.maritalStatus ?? "",
      foodHabit: searchParams.foodHabit ?? "",
      gothram: searchParams.gothram ?? "",
      star: searchParams.star ?? "",
      rashi: searchParams.rashi ?? "",
    });
    setSortBy(searchParams.sort ?? "recommended");
  }, [searchParams]);

  const activeFilterCount = useMemo(
    () =>
      Object.entries({
        gender: searchParams.gender,
        profileId: searchParams.profileId,
        age: searchParams.minAge || searchParams.maxAge,
        height: searchParams.minHeight || searchParams.maxHeight,
        state: searchParams.state,
        education: searchParams.education,
        occupation: searchParams.occupation,
        maritalStatus: searchParams.maritalStatus,
        foodHabit: searchParams.foodHabit,
        gothram: searchParams.gothram,
        star: searchParams.star,
        rashi: searchParams.rashi,
        query: searchParams.query,
      }).filter(([, value]) => Boolean(value)).length,
    [searchParams],
  );

  function executeSearch(overrides?: Partial<SearchParams>) {
    const next = overrides ?? {};
    void navigate({
      to: "/search",
      search: {
        query: next.query !== undefined ? next.query : filters.keyword || undefined,
        profileId: next.profileId !== undefined ? next.profileId : filters.profileId || undefined,
        gender: next.gender !== undefined ? next.gender : filters.gender || undefined,
        minAge:
          next.minAge !== undefined
            ? next.minAge
            : filters.minAge
              ? Number(filters.minAge)
              : undefined,
        maxAge:
          next.maxAge !== undefined
            ? next.maxAge
            : filters.maxAge
              ? Number(filters.maxAge)
              : undefined,
        minHeight:
          next.minHeight !== undefined
            ? next.minHeight
            : filters.minHeight
              ? Number(filters.minHeight)
              : undefined,
        maxHeight:
          next.maxHeight !== undefined
            ? next.maxHeight
            : filters.maxHeight
              ? Number(filters.maxHeight)
              : undefined,
        state: next.state !== undefined ? next.state : filters.state || undefined,
        education: next.education !== undefined ? next.education : filters.education || undefined,
        occupation:
          next.occupation !== undefined ? next.occupation : filters.occupation || undefined,
        maritalStatus:
          next.maritalStatus !== undefined
            ? next.maritalStatus
            : filters.maritalStatus || undefined,
        foodHabit: next.foodHabit !== undefined ? next.foodHabit : filters.foodHabit || undefined,
        gothram: next.gothram !== undefined ? next.gothram : filters.gothram || undefined,
        star: next.star !== undefined ? next.star : filters.star || undefined,
        rashi: next.rashi !== undefined ? next.rashi : filters.rashi || undefined,
        sort: next.sort !== undefined ? next.sort : sortBy !== "recommended" ? sortBy : undefined,
        page: 1,
      },
    });
  }

  function handleFilterSubmit(event: FormEvent) {
    event.preventDefault();
    executeSearch();
    setMobileFilterOpen(false);
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setSortBy("recommended");
    void navigate({ to: "/search", search: {} });
  }

  function clearFilter(key: keyof Filters) {
    setFilters((current) => ({ ...current, [key]: "" }));
    void navigate({
      to: "/search",
      search: {
        query: key === "keyword" ? undefined : searchParams.query,
        profileId: key === "profileId" ? undefined : searchParams.profileId,
        gender: key === "gender" ? undefined : searchParams.gender,
        minAge: key === "minAge" || key === "maxAge" ? undefined : searchParams.minAge,
        maxAge: key === "minAge" || key === "maxAge" ? undefined : searchParams.maxAge,
        minHeight: key === "minHeight" || key === "maxHeight" ? undefined : searchParams.minHeight,
        maxHeight: key === "minHeight" || key === "maxHeight" ? undefined : searchParams.maxHeight,
        state: key === "state" ? undefined : searchParams.state,
        education: key === "education" ? undefined : searchParams.education,
        occupation: key === "occupation" ? undefined : searchParams.occupation,
        maritalStatus: key === "maritalStatus" ? undefined : searchParams.maritalStatus,
        foodHabit: key === "foodHabit" ? undefined : searchParams.foodHabit,
        gothram: key === "gothram" ? undefined : searchParams.gothram,
        star: key === "star" ? undefined : searchParams.star,
        rashi: key === "rashi" ? undefined : searchParams.rashi,
        sort: sortBy !== "recommended" ? sortBy : undefined,
      },
    });
  }

  const profilesQuery = useQuery({
    queryKey: ["search-profiles", searchParams],
    queryFn: async () => {
      let query = supabase.from("approved_matrimonial_profiles").select("*");

      if (searchParams.gender) query = query.eq("gender", searchParams.gender);
      if (searchParams.minAge != null) query = query.gte("age", searchParams.minAge);
      if (searchParams.maxAge != null) query = query.lte("age", searchParams.maxAge);
      if (searchParams.minHeight != null) query = query.gte("height_cm", searchParams.minHeight);
      if (searchParams.maxHeight != null) query = query.lte("height_cm", searchParams.maxHeight);
      if (searchParams.maritalStatus)
        query = query.eq("marital_status", searchParams.maritalStatus);
      if (searchParams.state) query = query.eq("state", searchParams.state);
      if (searchParams.education) query = query.eq("education", searchParams.education);
      if (searchParams.occupation) query = query.eq("occupation", searchParams.occupation);
      if (searchParams.gothram) query = query.ilike("gothram", `%${searchParams.gothram}%`);
      if (searchParams.star) query = query.eq("star", searchParams.star);
      if (searchParams.rashi) query = query.eq("rashi", searchParams.rashi);
      if (searchParams.foodHabit) query = query.eq("food_habit", searchParams.foodHabit);
      if (searchParams.profileId) {
        query = query.or(
          `profile_code.eq.${searchParams.profileId},id.eq.${searchParams.profileId}`,
        );
      }
      if (searchParams.query) {
        const value = searchParams.query.replace(/[%_]/g, "");
        query = query.or(
          `display_name.ilike.%${value}%,education.ilike.%${value}%,occupation.ilike.%${value}%,city.ilike.%${value}%,profile_code.ilike.%${value}%`,
        );
      }

      query = query.order("created_at", { ascending: false }).limit(60);
      const { data, error } = await query;
      if (error) throw error;
      const results = (data ?? []).filter((profile): profile is typeof profile & { id: string } =>
        Boolean(profile.id),
      ) as PublicProfileCardData[];

      if (searchParams.sort === "age_asc") results.sort((a, b) => (a.age ?? 0) - (b.age ?? 0));
      if (searchParams.sort === "age_desc") results.sort((a, b) => (b.age ?? 0) - (a.age ?? 0));
      return results;
    },
  });

  return (
    <div className="sbm-page min-h-screen bg-[#FAF8F3] pb-16">
      <header className="border-b border-[#e5ddd1] bg-white">
        <div className="sbm-container py-9 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <span className="sbm-kicker">{lang === "te" ? "అన్వేషణ" : "Discover"}</span>
              <h1 className="sbm-heading mt-3 max-w-2xl">
                {lang === "te"
                  ? "మీకు ముఖ్యమైన వివరాలతో ఒక పరిచయాన్ని కనుగొనండి."
                  : "Find a considered introduction."}
              </h1>
              <p className="sbm-body mt-3 max-w-2xl">
                {lang === "te"
                  ? "ప్రొఫైల్స్ సమీక్షించబడి, సమాజానికి సంబంధించిన వివరాలతో ఇక్కడ కనిపిస్తాయి. మీ కుటుంబంతో కలిసి చూడండి."
                  : "Reviewed profiles from the Shettibalija community, with the family, education, work and cultural details families usually ask about."}
              </p>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                executeSearch();
              }}
              className="flex w-full max-w-md items-center gap-2"
            >
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a929e]"
                  aria-hidden
                />
                <Input
                  aria-label={lang === "te" ? "కీవర్డ్ లేదా ప్రొఫైల్ ఐడీ" : "Keyword or profile ID"}
                  value={filters.keyword}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, keyword: event.target.value }))
                  }
                  placeholder={
                    lang === "te" ? "కీవర్డ్ లేదా ప్రొఫైల్ ఐడీ" : "Name, profession or profile ID"
                  }
                  className="h-11 border-[#ded5c8] bg-[#FAF8F3] pl-9 text-sm focus-visible:ring-[#D1A329]"
                />
              </div>
              <button type="submit" className="sbm-button sbm-button--primary h-11 shrink-0">
                {lang === "te" ? "వెతకండి" : "Search"}
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="sbm-container pt-8">
        <div className="mb-5 flex items-center justify-between gap-4 lg:hidden">
          <p className="text-[12px] font-semibold text-[#4f4755]">
            {profilesQuery.isLoading
              ? "Searching..."
              : `${profilesQuery.data?.length ?? 0} ${lang === "te" ? "ప్రొఫైల్స్" : "profiles"}`}
          </p>
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="sbm-button sbm-button--outline h-10"
          >
            <Filter className="h-3.5 w-3.5" aria-hidden />
            {lang === "te" ? "ఫిల్టర్లు" : "Filters"}
            {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[17rem_1fr]">
          <aside className="sticky top-20 hidden lg:block">
            <div className="rounded-sm border border-[#ded5c8] bg-white p-5">
              <div className="flex items-center justify-between border-b border-[#e5ddd1] pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#D1A329]" aria-hidden />
                  <h2 className="text-sm font-bold text-[#24103F]">
                    {lang === "te" ? "పరిధిని సవరించండి" : "Refine"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] font-semibold text-[#087333] hover:underline"
                >
                  {lang === "te" ? "రీసెట్" : "Reset"}
                </button>
              </div>
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                onSubmit={handleFilterSubmit}
                lang={lang}
              />
            </div>
          </aside>

          <main className="min-w-0">
            <div className="mb-5 flex flex-col justify-between gap-3 border-b border-[#ded5c8] pb-4 sm:flex-row sm:items-end">
              <div>
                <p className="sbm-kicker">{lang === "te" ? "ఫలితాలు" : "Results"}</p>
                <h2 className="mt-2 font-serif text-2xl text-[#24103F]">
                  {profilesQuery.isLoading
                    ? lang === "te"
                      ? "వెతుకుతోంది..."
                      : "Looking through the community..."
                    : `${profilesQuery.data?.length ?? 0} ${lang === "te" ? "ప్రొఫైల్స్" : "profiles"}`}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="search-sort" className="text-[11px] font-semibold text-[#6B6570]">
                  {lang === "te" ? "క్రమం" : "Sort"}
                </label>
                <select
                  id="search-sort"
                  value={sortBy}
                  onChange={(event) => {
                    const nextSort = event.target.value;
                    setSortBy(nextSort);
                    executeSearch({ sort: nextSort === "recommended" ? undefined : nextSort });
                  }}
                  className="sbm-field h-9 min-h-0 w-auto py-1 text-[12px]"
                >
                  <option value="recommended">Newest</option>
                  <option value="newest">Recently added</option>
                  <option value="age_asc">Age: low to high</option>
                  <option value="age_desc">Age: high to low</option>
                </select>
              </div>
            </div>

            {activeFilterCount > 0 ? (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {searchParams.gender ? (
                  <Chip
                    label={searchParams.gender === "bride" ? "Bride" : "Groom"}
                    onClear={() => clearFilter("gender")}
                  />
                ) : null}
                {searchParams.state ? (
                  <Chip label={searchParams.state} onClear={() => clearFilter("state")} />
                ) : null}
                {searchParams.minAge || searchParams.maxAge ? (
                  <Chip
                    label={`Age ${searchParams.minAge ?? 18}–${searchParams.maxAge ?? 70}`}
                    onClear={() => clearFilter("minAge")}
                  />
                ) : null}
                {searchParams.education ? (
                  <Chip label={searchParams.education} onClear={() => clearFilter("education")} />
                ) : null}
                {searchParams.occupation ? (
                  <Chip label={searchParams.occupation} onClear={() => clearFilter("occupation")} />
                ) : null}
                {searchParams.maritalStatus ? (
                  <Chip
                    label={
                      MARITAL_STATUS_OPTIONS.find(
                        (item) => item.value === searchParams.maritalStatus,
                      )?.label ?? searchParams.maritalStatus
                    }
                    onClear={() => clearFilter("maritalStatus")}
                  />
                ) : null}
                {searchParams.star ? (
                  <Chip label={searchParams.star} onClear={() => clearFilter("star")} />
                ) : null}
                {searchParams.gothram ? (
                  <Chip label={searchParams.gothram} onClear={() => clearFilter("gothram")} />
                ) : null}
                {searchParams.query ? (
                  <Chip label={`“${searchParams.query}”`} onClear={() => clearFilter("keyword")} />
                ) : null}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="ml-1 text-[11px] font-bold text-[#087333] hover:underline"
                >
                  Clear all
                </button>
              </div>
            ) : null}

            {profilesQuery.isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-sm border border-[#ded5c8] bg-white"
                  >
                    <div className="sbm-skeleton aspect-[4/5] rounded-none" />
                    <div className="space-y-2 p-4">
                      <div className="sbm-skeleton h-3 w-4/5" />
                      <div className="sbm-skeleton h-3 w-3/5" />
                      <div className="sbm-skeleton mt-4 h-8 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : profilesQuery.isError ? (
              <div className="rounded-sm border border-[#ded5c8] bg-white px-6 py-16 text-center">
                <h3 className="font-serif text-2xl text-[#24103F]">Something went wrong.</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#6B6570]">
                  We could not load profiles just now. Please try again.
                </p>
                <button
                  type="button"
                  onClick={() => void profilesQuery.refetch()}
                  className="sbm-button sbm-button--primary mt-6"
                >
                  Try again
                </button>
              </div>
            ) : !profilesQuery.data?.length ? (
              <div className="rounded-sm border border-dashed border-[#cdbfa6] bg-white px-6 py-16 text-center sm:py-20">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#D1A329]/30 bg-[#FAF8F3]">
                  <Search className="h-5 w-5 text-[#D1A329]" aria-hidden />
                </div>
                <h3 className="mt-5 font-serif text-2xl text-[#24103F]">
                  {lang === "te"
                    ? "ఇంకా సరిపోయే ప్రొఫైల్ కనిపించలేదు."
                    : "We couldn't find a close match yet."}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B6570]">
                  {lang === "te"
                    ? "వయస్సు పరిధిని విస్తరించండి లేదా ఒక ఫిల్టర్ తొలగించి మళ్లీ ప్రయత్నించండి."
                    : "Try widening the age range or removing one filter. New profiles appear as members complete their review."}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="sbm-button sbm-button--outline mt-6"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                  {lang === "te" ? "ఫిల్టర్లను రీసెట్ చేయండి" : "Reset all filters"}
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {profilesQuery.data.map((profile) => (
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
            )}
          </main>
        </div>
      </div>

      <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <SheetContent side="right" className="flex w-[min(100%,22rem)] flex-col bg-[#FAF8F3] p-0">
          <SheetHeader className="flex flex-row items-center justify-between border-b border-[#ded5c8] p-4">
            <SheetTitle className="font-serif text-xl text-[#24103F]">
              {lang === "te" ? "ఫిల్టర్లు" : "Filters"}
            </SheetTitle>
            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B6570]"
              aria-label="Close filters"
            >
              <X className="h-4 w-4" />
            </button>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              onSubmit={handleFilterSubmit}
              lang={lang}
              compact
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="sbm-chip">
      {label}
      <button type="button" onClick={onClear} aria-label={`Remove ${label} filter`}>
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function FilterPanel({
  filters,
  setFilters,
  onSubmit,
  lang,
  compact = false,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onSubmit: (event: FormEvent) => void;
  lang: "en" | "te";
  compact?: boolean;
}) {
  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-5" : "mt-4 space-y-4"}>
      <div>
        <label htmlFor="filter-gender" className="sbm-label">
          {lang === "te" ? "వెతుకుతున్నది" : "Looking for"}
        </label>
        <select
          id="filter-gender"
          className="sbm-field"
          value={filters.gender}
          onChange={(event) => update("gender", event.target.value)}
        >
          <option value="">{lang === "te" ? "వధువు లేదా వరుడు" : "Bride or groom"}</option>
          <option value="bride">{lang === "te" ? "వధువు" : "Bride"}</option>
          <option value="groom">{lang === "te" ? "వరుడు" : "Groom"}</option>
        </select>
      </div>

      <div>
        <span className="sbm-label">{lang === "te" ? "వయస్సు" : "Age"}</span>
        <div className="flex items-center gap-2">
          <input
            aria-label={lang === "te" ? "కనిష్ఠ వయస్సు" : "Minimum age"}
            type="number"
            min={18}
            max={70}
            className="sbm-field text-center"
            value={filters.minAge}
            onChange={(event) => update("minAge", event.target.value)}
            placeholder="21"
          />
          <span className="text-xs text-[#9a929e]">to</span>
          <input
            aria-label={lang === "te" ? "గరిష్ఠ వయస్సు" : "Maximum age"}
            type="number"
            min={18}
            max={70}
            className="sbm-field text-center"
            value={filters.maxAge}
            onChange={(event) => update("maxAge", event.target.value)}
            placeholder="35"
          />
        </div>
      </div>

      <div>
        <label htmlFor="filter-state" className="sbm-label">
          {lang === "te" ? "ప్రాంతం" : "Location"}
        </label>
        <select
          id="filter-state"
          className="sbm-field"
          value={filters.state}
          onChange={(event) => update("state", event.target.value)}
        >
          <option value="">{lang === "te" ? "అన్ని ప్రాంతాలు" : "Anywhere"}</option>
          {STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-education" className="sbm-label">
          {lang === "te" ? "విద్య" : "Education"}
        </label>
        <select
          id="filter-education"
          className="sbm-field"
          value={filters.education}
          onChange={(event) => update("education", event.target.value)}
        >
          <option value="">{lang === "te" ? "ఏదైనా" : "Any education"}</option>
          {EDUCATION_OPTIONS.map((education) => (
            <option key={education} value={education}>
              {education}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-occupation" className="sbm-label">
          {lang === "te" ? "ఉద్యోగం" : "Occupation"}
        </label>
        <select
          id="filter-occupation"
          className="sbm-field"
          value={filters.occupation}
          onChange={(event) => update("occupation", event.target.value)}
        >
          <option value="">{lang === "te" ? "ఏదైనా" : "Any occupation"}</option>
          {OCCUPATION_OPTIONS.map((occupation) => (
            <option key={occupation} value={occupation}>
              {occupation}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-marital" className="sbm-label">
          {lang === "te" ? "వైవాహిక స్థితి" : "Marital status"}
        </label>
        <select
          id="filter-marital"
          className="sbm-field"
          value={filters.maritalStatus}
          onChange={(event) => update("maritalStatus", event.target.value)}
        >
          <option value="">{lang === "te" ? "అన్ని స్థితులు" : "Any status"}</option>
          {MARITAL_STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {lang === "te" ? status.labelTe : status.label}
            </option>
          ))}
        </select>
      </div>

      <details className="border-t border-[#e5ddd1] pt-4">
        <summary className="cursor-pointer list-none text-[12px] font-bold text-[#24103F]">
          {lang === "te" ? "మరిన్ని వివరాలు" : "More details"}
        </summary>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="filter-profile-id" className="sbm-label">
              {lang === "te" ? "ప్రొఫైల్ ఐడీ" : "Profile ID"}
            </label>
            <Input
              id="filter-profile-id"
              value={filters.profileId}
              onChange={(event) => update("profileId", event.target.value)}
              className="h-11 border-[#d9d0c3] text-sm"
              placeholder="e.g. SBM-1024"
            />
          </div>

          <div>
            <span className="sbm-label">{lang === "te" ? "ఎత్తు" : "Height"}</span>
            <div className="grid grid-cols-2 gap-2">
              <select
                className="sbm-field"
                value={filters.minHeight}
                onChange={(event) => update("minHeight", event.target.value)}
              >
                <option value="">Min</option>
                {HEIGHT_CHOICES.map((choice) => (
                  <option key={choice.cm} value={choice.cm}>
                    {choice.label}
                  </option>
                ))}
              </select>
              <select
                className="sbm-field"
                value={filters.maxHeight}
                onChange={(event) => update("maxHeight", event.target.value)}
              >
                <option value="">Max</option>
                {HEIGHT_CHOICES.map((choice) => (
                  <option key={choice.cm} value={choice.cm}>
                    {choice.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="filter-star" className="sbm-label">
              {lang === "te" ? "నక్షత్రం" : "Star"}
            </label>
            <select
              id="filter-star"
              className="sbm-field"
              value={filters.star}
              onChange={(event) => update("star", event.target.value)}
            >
              <option value="">{lang === "te" ? "ఏదైనా" : "Any star"}</option>
              {NAKSHATRA_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {lang === "te" ? item.labelTe : item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-rashi" className="sbm-label">
              {lang === "te" ? "రాశి" : "Rashi"}
            </label>
            <select
              id="filter-rashi"
              className="sbm-field"
              value={filters.rashi}
              onChange={(event) => update("rashi", event.target.value)}
            >
              <option value="">{lang === "te" ? "ఏదైనా" : "Any rashi"}</option>
              {RASHI_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {lang === "te" ? item.labelTe : item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-gothram" className="sbm-label">
              {lang === "te" ? "గోత్రం" : "Gothram"}
            </label>
            <Input
              id="filter-gothram"
              value={filters.gothram}
              onChange={(event) => update("gothram", event.target.value)}
              className="h-11 border-[#d9d0c3] text-sm"
              placeholder={lang === "te" ? "ఉదా. జనకుల" : "e.g. Janakula"}
            />
          </div>

          <div>
            <label htmlFor="filter-food" className="sbm-label">
              {lang === "te" ? "ఆహారం" : "Food habit"}
            </label>
            <select
              id="filter-food"
              className="sbm-field"
              value={filters.foodHabit}
              onChange={(event) => update("foodHabit", event.target.value)}
            >
              <option value="">{lang === "te" ? "ఏదైనా" : "Any"}</option>
              {FOOD_HABIT_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {lang === "te" ? item.labelTe : item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </details>

      <div className="flex gap-2 border-t border-[#e5ddd1] pt-4">
        <button type="submit" className="sbm-button sbm-button--primary flex-1">
          {lang === "te" ? "వర్తించండి" : "Apply filters"}
        </button>
        <button
          type="button"
          onClick={() => setFilters(EMPTY_FILTERS)}
          className="sbm-button sbm-button--outline px-3"
          aria-label="Clear filters"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  );
}
