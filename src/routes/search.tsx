import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FormEvent, useState, useEffect } from "react";
import { Search, Filter, RotateCcw, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
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

  const activeFilterCount = [
    gender,
    minAge || maxAge,
    state,
    education,
    occupation,
    maritalStatus,
    minHeight || maxHeight,
    foodHabit,
    star,
    rashi,
    gothram,
  ].filter(Boolean).length;

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
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Top Banner - Editorial, warm ivory */}
      <div className="border-b border-[#E4DDD3] bg-[#FAF8F3] pt-24 pb-10 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#087333] mb-2">
            Shettibalija Matrimony
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#24103F]">
            Find Your Match
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6B6570] max-w-2xl font-light">
            Browse verified matrimonial profiles within the Shettibalija community with refined
            search criteria.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {/* Mobile Filter Action Card (Block on mobile, hidden on desktop) */}
        <div className="mb-6 block md:hidden">
          <div className="rounded-xl border border-[#E4DDD3] bg-white p-3.5 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#24103F]">Search Criteria</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {activeFilterCount > 0
                    ? `${activeFilterCount} filter criteria applied`
                    : "Age, Gothram, Star, Location..."}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {activeFilterCount > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="h-9 px-2 text-xs text-muted-foreground"
                  >
                    Reset
                  </Button>
                ) : null}

                <Button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="h-9 rounded-lg bg-[#24103F] text-white px-3 text-xs font-medium hover:bg-[#311552] flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-[#D1A329]" />
                  <span>Filters</span>
                  {activeFilterCount > 0 ? (
                    <Badge className="bg-[#D1A329] text-[#24103F] px-1.5 py-0 text-[10px] font-bold h-4">
                      {activeFilterCount}
                    </Badge>
                  ) : null}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Sheet Filter Panel */}
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetContent
              side="bottom"
              className="h-[88vh] rounded-t-3xl p-0 flex flex-col bg-white border-t border-[#D9A514]/40"
            >
              <SheetHeader className="p-4 border-b border-border/80 flex flex-row items-center justify-between text-left">
                <div>
                  <SheetTitle className="font-serif text-lg font-bold text-[#21083F]">
                    Refine Search Filters
                  </SheetTitle>
                  <p className="text-xs text-muted-foreground">
                    Discover Shettibalija matches based on your preferences
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileFilterOpen(false)}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </SheetHeader>

              {/* Scrollable Filters Body on Mobile */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#21083F]">Looking for</Label>
                  <select
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Bride / Groom (All)</option>
                    <option value="bride">Bride (వధువు)</option>
                    <option value="groom">Groom (వరుడు)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#21083F]">Min Age</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={18}
                      max={70}
                      placeholder="18"
                      className="h-11 rounded-xl"
                      value={minAge}
                      onChange={(e) => setMinAge(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#21083F]">Max Age</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={18}
                      max={70}
                      placeholder="60"
                      className="h-11 rounded-xl"
                      value={maxAge}
                      onChange={(e) => setMaxAge(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#21083F]">Location / State</Label>
                  <select
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#21083F]">Marital Status</Label>
                  <select
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
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

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#21083F]">Min Height</Label>
                    <select
                      className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
                      value={minHeight}
                      onChange={(e) => setMinHeight(e.target.value)}
                    >
                      <option value="">Any Height</option>
                      {HEIGHT_CHOICES.map((h) => (
                        <option key={h.value} value={h.value}>
                          {h.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#21083F]">Max Height</Label>
                    <select
                      className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
                      value={maxHeight}
                      onChange={(e) => setMaxHeight(e.target.value)}
                    >
                      <option value="">Any Height</option>
                      {HEIGHT_CHOICES.map((h) => (
                        <option key={h.value} value={h.value}>
                          {h.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#21083F]">Education Level</Label>
                  <select
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                  >
                    <option value="">Any Education</option>
                    {EDUCATION_OPTIONS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#21083F]">Occupation</Label>
                  <select
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                  >
                    <option value="">Any Occupation</option>
                    {OCCUPATION_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#21083F]">Food Habit</Label>
                  <select
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
                    value={foodHabit}
                    onChange={(e) => setFoodHabit(e.target.value)}
                  >
                    <option value="">Any Diet</option>
                    {FOOD_HABIT_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#21083F]">Star / Nakshatra</Label>
                  <select
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
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

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#21083F]">Rashi</Label>
                  <select
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
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

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#21083F]">Gothram</Label>
                  <Input
                    placeholder="e.g. Janakula"
                    value={gothram}
                    onChange={(e) => setGothram(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="border-t border-[#D9A514]/25 bg-white p-3 pb-[env(safe-area-inset-bottom,12px)] flex items-center gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleResetFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="flex-1 h-11 rounded-xl text-xs font-semibold border-border"
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  RESET
                </Button>

                <Button
                  type="button"
                  onClick={(e) => {
                    handleSearchSubmit(e);
                    setMobileFilterOpen(false);
                  }}
                  className="flex-1 h-11 rounded-lg bg-[#24103F] text-white font-medium text-xs hover:bg-[#311552]"
                >
                  <Search className="mr-1.5 h-4 w-4 text-[#D1A329]" />
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filter form (Hidden on mobile) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:block mb-10 rounded-xl border border-[#E4DDD3] bg-white p-6 shadow-xs space-y-5"
        >
          <div className="flex items-center justify-between border-b border-[#E4DDD3] pb-4">
            <div className="flex items-center gap-2.5">
              <Filter className="h-4 w-4 text-[#D1A329]" />
              <h2 className="text-base font-serif font-medium text-[#24103F]">
                Refine Your Search
              </h2>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreFilters((prev) => !prev)}
              className="text-xs font-medium text-[#087333] hover:text-[#087333] hover:bg-[#087333]/10"
            >
              {showMoreFilters ? "− Fewer Filters" : "+ More Filters (Horoscope, Diet, Height)"}
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
            <div className="grid gap-3 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-64 sm:h-96 rounded-2xl" />
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
              <div className="mb-4 flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                <span>
                  Found {profilesQuery.data.length} profile
                  {profilesQuery.data.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid gap-3 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}
