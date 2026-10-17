import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FormEvent, useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  X,
  Heart,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Send,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProtectedPhoto } from "@/components/profiles/protected-photo";
import { type PublicProfileCardData } from "@/components/profiles/profile-card";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useProfileActions } from "@/hooks/use-profile-actions";
import { supabase } from "@/integrations/supabase/client";
import { filterDemoProfiles, type DemoProfile } from "@/data/demo-profiles";
import { validateSearchParams, type SearchParams } from "@/lib/search-params";
import { SITE_NAME } from "@/lib/site";
import { formatHeight, locationLine } from "@/lib/format";
import { useLanguage } from "@/lib/i18n";
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
  const { lang } = useLanguage();

  // Local filter states
  const [keyword, setKeyword] = useState(searchParams.query ?? "");
  const [profileId, setProfileId] = useState(searchParams.profileId ?? "");
  const [gender, setGender] = useState(searchParams.gender ?? "");
  const [minAge, setMinAge] = useState(searchParams.minAge ? String(searchParams.minAge) : "");
  const [maxAge, setMaxAge] = useState(searchParams.maxAge ? String(searchParams.maxAge) : "");
  const [minHeight, setMinHeight] = useState(
    searchParams.minHeight ? String(searchParams.minHeight) : "",
  );
  const [maxHeight, setMaxHeight] = useState(
    searchParams.maxHeight ? String(searchParams.maxHeight) : "",
  );
  const [state, setState] = useState(searchParams.state ?? "");
  const [education, setEducation] = useState(searchParams.education ?? "");
  const [occupation, setOccupation] = useState(searchParams.occupation ?? "");
  const [maritalStatus, setMaritalStatus] = useState(searchParams.maritalStatus ?? "");
  const [foodHabit, setFoodHabit] = useState(searchParams.foodHabit ?? "");
  const [gothram, setGothram] = useState(searchParams.gothram ?? "");
  const [star, setStar] = useState(searchParams.star ?? "");
  const [rashi, setRashi] = useState(searchParams.rashi ?? "");
  const [photoOnly, setPhotoOnly] = useState(Boolean(searchParams.photoOnly));
  const [horoscopeOnly, setHoroscopeOnly] = useState(Boolean(searchParams.horoscopeOnly));
  const [sortBy, setSortBy] = useState(searchParams.sort ?? "recommended");

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL search params change
  useEffect(() => {
    setKeyword(searchParams.query ?? "");
    setProfileId(searchParams.profileId ?? "");
    setGender(searchParams.gender ?? "");
    setMinAge(searchParams.minAge ? String(searchParams.minAge) : "");
    setMaxAge(searchParams.maxAge ? String(searchParams.maxAge) : "");
    setMinHeight(searchParams.minHeight ? String(searchParams.minHeight) : "");
    setMaxHeight(searchParams.maxHeight ? String(searchParams.maxHeight) : "");
    setState(searchParams.state ?? "");
    setEducation(searchParams.education ?? "");
    setOccupation(searchParams.occupation ?? "");
    setMaritalStatus(searchParams.maritalStatus ?? "");
    setFoodHabit(searchParams.foodHabit ?? "");
    setGothram(searchParams.gothram ?? "");
    setStar(searchParams.star ?? "");
    setRashi(searchParams.rashi ?? "");
    setPhotoOnly(Boolean(searchParams.photoOnly));
    setHoroscopeOnly(Boolean(searchParams.horoscopeOnly));
    setSortBy(searchParams.sort ?? "recommended");
  }, [searchParams]);

  // Active filter count
  const activeFilterCount = [
    keyword,
    profileId,
    gender,
    minAge || maxAge,
    minHeight || maxHeight,
    state,
    education,
    occupation,
    maritalStatus,
    foodHabit,
    gothram,
    star,
    rashi,
    photoOnly,
    horoscopeOnly,
  ].filter(Boolean).length;

  function executeSearch(overrides?: Partial<SearchParams>) {
    void navigate({
      to: "/search",
      search: {
        query: overrides?.query !== undefined ? overrides.query : keyword || undefined,
        profileId:
          overrides?.profileId !== undefined ? overrides.profileId : profileId || undefined,
        gender: overrides?.gender !== undefined ? overrides.gender : gender || undefined,
        minAge: overrides?.minAge !== undefined ? overrides.minAge : minAge ? Number(minAge) : undefined,
        maxAge: overrides?.maxAge !== undefined ? overrides.maxAge : maxAge ? Number(maxAge) : undefined,
        minHeight:
          overrides?.minHeight !== undefined ? overrides.minHeight : minHeight ? Number(minHeight) : undefined,
        maxHeight:
          overrides?.maxHeight !== undefined ? overrides.maxHeight : maxHeight ? Number(maxHeight) : undefined,
        state: overrides?.state !== undefined ? overrides.state : state || undefined,
        education:
          overrides?.education !== undefined ? overrides.education : education || undefined,
        occupation:
          overrides?.occupation !== undefined ? overrides.occupation : occupation || undefined,
        maritalStatus:
          overrides?.maritalStatus !== undefined
            ? overrides.maritalStatus
            : maritalStatus || undefined,
        foodHabit:
          overrides?.foodHabit !== undefined ? overrides.foodHabit : foodHabit || undefined,
        gothram: overrides?.gothram !== undefined ? overrides.gothram : gothram || undefined,
        star: overrides?.star !== undefined ? overrides.star : star || undefined,
        rashi: overrides?.rashi !== undefined ? overrides.rashi : rashi || undefined,
        photoOnly:
          overrides?.photoOnly !== undefined ? overrides.photoOnly : photoOnly || undefined,
        horoscopeOnly:
          overrides?.horoscopeOnly !== undefined
            ? overrides.horoscopeOnly
            : horoscopeOnly || undefined,
        sort: overrides?.sort !== undefined ? overrides.sort : sortBy || undefined,
        page: 1,
      },
    });
  }

  function handleFilterSubmit(e: FormEvent) {
    e.preventDefault();
    executeSearch();
    setMobileFilterOpen(false);
  }

  function handleResetFilters() {
    setKeyword("");
    setProfileId("");
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
    setPhotoOnly(false);
    setHoroscopeOnly(false);
    setSortBy("recommended");
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
        // Fallback to demo profiles
      }

      const filteredDemo = filterDemoProfiles({
        query: searchParams.query,
        profileId: searchParams.profileId,
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
        photoOnly: searchParams.photoOnly,
        horoscopeOnly: searchParams.horoscopeOnly,
      });

      const realIds = new Set(realProfiles.map((p) => p.id));
      const combined = [...realProfiles, ...filteredDemo.filter((d) => !realIds.has(d.id))];

      // Client-side sorting
      if (searchParams.sort === "age_asc") {
        combined.sort((a, b) => (a.age ?? 0) - (b.age ?? 0));
      } else if (searchParams.sort === "age_desc") {
        combined.sort((a, b) => (b.age ?? 0) - (a.age ?? 0));
      }

      return combined;
    },
  });

  return (
    <div className="min-h-screen bg-[#FAF8F3] pt-14 pb-16">
      {/* Top Matrimonial Search Header */}
      <div className="bg-white border-b border-[#E4DDD3] py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#087333]">
                Shettibalija Matrimony Registry
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#24103F]">
                {lang === "te" ? "మ్యాచ్‌ల శోధన" : "Search Profiles"}
              </h1>
              <p className="text-xs text-[#6B6570] mt-1">
                {lang === "te"
                  ? "శెట్టిబలిజ కమ్యూనిటీలో ధృవీకరించబడిన వధువు/వరుల ప్రొఫైల్స్"
                  : "Explore verified matrimonial profiles with detailed cultural, education & horoscope criteria"}
              </p>
            </div>

            {/* Quick Keyword / ID Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeSearch();
              }}
              className="flex items-center gap-2 max-w-md w-full"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B0A8B8]" />
                <Input
                  type="text"
                  placeholder={
                    lang === "te"
                      ? "కీవర్డ్ లేదా ID (ఉదా: SBM-D101, Doctor)"
                      : "Search by Keyword or Profile ID..."
                  }
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pl-9 h-10 text-xs bg-[#FAF8F3] border-[#E4DDD3] focus-visible:ring-1 focus-visible:ring-[#24103F]"
                />
              </div>
              <Button type="submit" className="h-10 px-4 bg-[#24103F] text-xs font-semibold text-white hover:bg-[#311552]">
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Two-Column Search Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4 flex items-center justify-between bg-white p-3 rounded-lg border border-[#E4DDD3]">
          <div className="text-xs font-medium text-[#24103F]">
            {profilesQuery.data ? `${profilesQuery.data.length} Profiles Available` : "Searching..."}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen(true)}
            className="h-8 text-xs font-semibold border-[#D1A329] text-[#24103F] flex items-center gap-1.5"
          >
            <Filter className="h-3.5 w-3.5 text-[#D1A329]" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-8 items-start">
          {/* ========================================================
              LEFT SIDEBAR: Matrimonial Filters (Desktop)
             ======================================================== */}
          <aside className="hidden lg:block sticky top-20 bg-white rounded-xl border border-[#E4DDD3] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E4DDD3]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#087333]" />
                <h2 className="text-sm font-bold text-[#24103F]">Refine Matches</h2>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] text-[#087333] hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              )}
            </div>

            <form onSubmit={handleFilterSubmit} className="space-y-4">
              {/* 1. Looking For */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">Looking For</Label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#242024] focus:border-[#24103F] focus:outline-none"
                >
                  <option value="">Bride / Groom (All)</option>
                  <option value="bride">Bride (వధువు)</option>
                  <option value="groom">Groom (వరుడు)</option>
                </select>
              </div>

              {/* 2. Matrimony / Profile ID */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">Search by Profile ID</Label>
                <Input
                  type="text"
                  placeholder="e.g. SBM-D101"
                  value={profileId}
                  onChange={(e) => setProfileId(e.target.value)}
                  className="h-9 text-xs bg-white border-[#E4DDD3]"
                />
              </div>

              {/* 3. Age Range */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">Age Range (Years)</Label>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min={18}
                    max={70}
                    placeholder="21"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    className="h-9 text-xs px-2 text-center"
                  />
                  <span className="text-xs text-[#6B6570]">to</span>
                  <Input
                    type="number"
                    min={18}
                    max={70}
                    placeholder="35"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    className="h-9 text-xs px-2 text-center"
                  />
                </div>
              </div>

              {/* 4. Height Range */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">Height Range</Label>
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={minHeight}
                    onChange={(e) => setMinHeight(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2 text-xs text-[#242024]"
                  >
                    <option value="">Min Height</option>
                    {HEIGHT_CHOICES.map((h) => (
                      <option key={h.cm} value={h.cm}>
                        {h.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={maxHeight}
                    onChange={(e) => setMaxHeight(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2 text-xs text-[#242024]"
                  >
                    <option value="">Max Height</option>
                    {HEIGHT_CHOICES.map((h) => (
                      <option key={h.cm} value={h.cm}>
                        {h.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. Location / State */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">Location / State</Label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#242024]"
                >
                  <option value="">All Locations</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Education */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">Education</Label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#242024]"
                >
                  <option value="">Any Education</option>
                  {EDUCATION_OPTIONS.map((ed) => (
                    <option key={ed} value={ed}>
                      {ed}
                    </option>
                  ))}
                </select>
              </div>

              {/* 7. Occupation */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">Occupation</Label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#242024]"
                >
                  <option value="">Any Occupation</option>
                  {OCCUPATION_OPTIONS.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ}
                    </option>
                  ))}
                </select>
              </div>

              {/* 8. Marital Status */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">Marital Status</Label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#242024]"
                >
                  <option value="">Any Status</option>
                  {MARITAL_STATUS_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 9. Star / Nakshatra */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">Star / Nakshatra</Label>
                <select
                  value={star}
                  onChange={(e) => setStar(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#242024]"
                >
                  <option value="">Any Star</option>
                  {NAKSHATRA_OPTIONS.map((n) => (
                    <option key={n.value} value={n.value}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 10. Gothram */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">Gothram</Label>
                <Input
                  type="text"
                  placeholder="e.g. Janakula"
                  value={gothram}
                  onChange={(e) => setGothram(e.target.value)}
                  className="h-9 text-xs bg-white border-[#E4DDD3]"
                />
              </div>

              {/* 11. Verification & Trust Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-[#E4DDD3]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={photoOnly}
                    onChange={(e) => setPhotoOnly(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-[#E4DDD3] text-[#24103F] focus:ring-[#24103F]"
                  />
                  <span className="text-xs text-[#4A4550]">Profiles with Photo only</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={horoscopeOnly}
                    onChange={(e) => setHoroscopeOnly(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-[#E4DDD3] text-[#24103F] focus:ring-[#24103F]"
                  />
                  <span className="text-xs text-[#4A4550]">Horoscope Added only</span>
                </label>
              </div>

              {/* Apply Filters Button */}
              <Button
                type="submit"
                className="w-full h-10 rounded-md bg-[#24103F] text-xs font-semibold text-white hover:bg-[#311552] transition-colors shadow-xs"
              >
                Apply Filters
              </Button>
            </form>
          </aside>

          {/* ========================================================
              RIGHT MAIN CONTENT: Search Results & Matrimonial Cards
             ======================================================== */}
          <main className="min-w-0">
            {/* Results Header: Count & Sort */}
            <div className="bg-white rounded-xl border border-[#E4DDD3] p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <h2 className="text-base font-serif font-bold text-[#24103F]">
                  {lang === "te" ? "సిఫార్సు చేసిన మ్యాచ్‌లు" : "Recommended Matches"}
                </h2>
                <p className="text-xs text-[#6B6570]">
                  {profilesQuery.isLoading
                    ? "Searching matching profiles..."
                    : `${profilesQuery.data?.length ?? 0} Matrimonial Profiles Found`}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6B6570] shrink-0">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const nextSort = e.target.value;
                    setSortBy(nextSort);
                    executeSearch({ sort: nextSort });
                  }}
                  className="h-8 rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#242024] focus:border-[#24103F]"
                >
                  <option value="recommended">Recommended</option>
                  <option value="newest">Newest First</option>
                  <option value="age_asc">Age: Low to High</option>
                  <option value="age_desc">Age: High to Low</option>
                </select>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-5">
                <span className="text-xs text-[#6B6570] mr-1">Active Filters:</span>
                {gender && (
                  <Badge variant="outline" className="text-xs bg-white border-[#E4DDD3]">
                    {gender === "bride" ? "Bride" : "Groom"}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => {
                        setGender("");
                        executeSearch({ gender: undefined });
                      }}
                    />
                  </Badge>
                )}
                {state && (
                  <Badge variant="outline" className="text-xs bg-white border-[#E4DDD3]">
                    {state}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => {
                        setState("");
                        executeSearch({ state: undefined });
                      }}
                    />
                  </Badge>
                )}
                {(minAge || maxAge) && (
                  <Badge variant="outline" className="text-xs bg-white border-[#E4DDD3]">
                    Age: {minAge || "18"} - {maxAge || "70"}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => {
                        setMinAge("");
                        setMaxAge("");
                        executeSearch({ minAge: undefined, maxAge: undefined });
                      }}
                    />
                  </Badge>
                )}
                {education && (
                  <Badge variant="outline" className="text-xs bg-white border-[#E4DDD3]">
                    {education}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => {
                        setEducation("");
                        executeSearch({ education: undefined });
                      }}
                    />
                  </Badge>
                )}
                {keyword && (
                  <Badge variant="outline" className="text-xs bg-white border-[#E4DDD3]">
                    "{keyword}"
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => {
                        setKeyword("");
                        executeSearch({ query: undefined });
                      }}
                    />
                  </Badge>
                )}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-[#087333] hover:underline ml-1 font-semibold"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Results Profiles Listing */}
            {profilesQuery.isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-44 w-full rounded-xl" />
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
              <div className="space-y-4">
                {profilesQuery.data.map((profile) => {
                  const isShortlisted = actions.shortlistedIds.has(profile.id);
                  const isInterestSent = actions.sentInterests.has(profile.id);
                  const demoObj = profile as DemoProfile;
                  const candidateName = profile.display_name ?? "Community Member";
                  const candidateCode = profile.profile_code ?? profile.id;
                  const location = locationLine(profile.city, profile.state);
                  const formattedHeight = profile.height_cm ? formatHeight(profile.height_cm) : null;

                  return (
                    <article
                      key={profile.id}
                      className="rounded-xl border border-[#E4DDD3] bg-white p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row gap-5"
                    >
                      {/* Left: Candidate Photo thumbnail with Code */}
                      <div className="sm:w-44 flex-shrink-0 flex flex-col items-center">
                        <div className="relative aspect-[3/4] w-full max-w-[176px] rounded-lg overflow-hidden bg-[#F0EDE6] border border-[#E4DDD3]">
                          <ProtectedPhoto
                            profileId={profile.id}
                            displayName={candidateName}
                            photoUrl={profile.photo_url}
                            className="h-full w-full object-cover"
                            compact
                          />
                          {/* Top-right heart button */}
                          <button
                            type="button"
                            onClick={() => actions.toggleShortlist.mutate(profile.id)}
                            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 flex items-center justify-center text-[#6B6570] hover:text-rose-500 shadow-xs"
                          >
                            <Heart
                              className={`h-3.5 w-3.5 ${
                                isShortlisted ? "fill-rose-500 text-rose-500" : ""
                              }`}
                            />
                          </button>
                        </div>
                        <span className="mt-2 text-[10px] font-semibold tracking-wider text-[#6B6570] bg-[#FAF8F3] px-2 py-0.5 rounded border border-[#E4DDD3]">
                          ID: {candidateCode}
                        </span>
                      </div>

                      {/* Center: Details & Demographics */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          {/* Name & Age Row */}
                          <div className="flex flex-wrap items-baseline gap-2 mb-1">
                            <h3 className="font-serif text-lg font-bold text-[#24103F]">
                              {candidateName}
                            </h3>
                            <span className="text-xs text-[#6B6570]">
                              {profile.age ? `${profile.age} yrs` : "—"}
                              {formattedHeight ? ` • ${formattedHeight}` : ""}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded bg-[#087333]/10 px-2 py-0.5 text-[10px] font-semibold text-[#087333] border border-[#087333]/20">
                              <ShieldCheck className="h-3 w-3" />
                              Verified Member
                            </span>
                          </div>

                          {/* 2-Column Matrimonial Key-Value Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 my-3 text-xs">
                            <div className="flex items-center gap-1.5 text-[#4A4550]">
                              <GraduationCap className="h-3.5 w-3.5 text-[#087333] shrink-0" />
                              <span className="font-medium text-[#242024]">Education:</span>
                              <span className="truncate">{profile.education ?? "—"}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[#4A4550]">
                              <Briefcase className="h-3.5 w-3.5 text-[#087333] shrink-0" />
                              <span className="font-medium text-[#242024]">Profession:</span>
                              <span className="truncate">{profile.occupation ?? "—"}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[#4A4550]">
                              <MapPin className="h-3.5 w-3.5 text-[#087333] shrink-0" />
                              <span className="font-medium text-[#242024]">Location:</span>
                              <span className="truncate">{location || "—"}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[#4A4550]">
                              <Sparkles className="h-3.5 w-3.5 text-[#D1A329] shrink-0" />
                              <span className="font-medium text-[#242024]">Cultural:</span>
                              <span className="truncate">
                                {demoObj.gothram ? `Got: ${demoObj.gothram}` : ""}
                                {demoObj.star ? ` • ${demoObj.star}` : ""}
                              </span>
                            </div>
                          </div>

                          {/* Brief About / Family summary */}
                          {(demoObj.about_me || profile.family_summary) && (
                            <p className="text-xs text-[#6B6570] line-clamp-2 leading-relaxed bg-[#FAF8F3] p-2.5 rounded-md border border-[#E4DDD3]/60 mb-3">
                              {demoObj.about_me || profile.family_summary}
                            </p>
                          )}
                        </div>

                        {/* Action Bar */}
                        <div className="pt-2 border-t border-[#E4DDD3]/60 flex flex-wrap items-center justify-between gap-2.5">
                          <span className="text-[11px] text-[#B0A8B8]">
                            Community: Shettibalija
                          </span>

                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant={isInterestSent ? "outline" : "default"}
                              size="sm"
                              onClick={() => actions.sendInterest.mutate(profile.id)}
                              className={`h-8 text-xs font-semibold ${
                                isInterestSent
                                  ? "border-[#087333] text-[#087333] bg-[#087333]/5"
                                  : "bg-[#24103F] text-white hover:bg-[#311552]"
                              }`}
                            >
                              {isInterestSent ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-[#087333]" />
                                  Interest Sent
                                </>
                              ) : (
                                <>
                                  <Send className="h-3.5 w-3.5 mr-1" />
                                  Send Interest
                                </>
                              )}
                            </Button>

                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs font-medium border-[#E4DDD3] text-[#242024] hover:border-[#24103F]"
                            >
                              <Link
                                to="/profile/$id"
                                params={{ id: profile.id }}
                                className="flex items-center gap-1"
                              >
                                View Profile
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer / Sheet */}
      <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <SheetContent side="right" className="w-[min(100%,22rem)] bg-[#FAF8F3] p-0 flex flex-col">
          <SheetHeader className="p-4 border-b border-[#E4DDD3] flex flex-row items-center justify-between">
            <SheetTitle className="text-base font-serif font-bold text-[#24103F]">
              Search Filters
            </SheetTitle>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-md text-[#6B6570]"
            >
              <X className="h-4 w-4" />
            </button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Looking For */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#24103F]">Looking For</Label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="flex h-10 w-full rounded-md border border-[#E4DDD3] bg-white px-3 text-xs"
              >
                <option value="">Bride / Groom (All)</option>
                <option value="bride">Bride (వధువు)</option>
                <option value="groom">Groom (వరుడు)</option>
              </select>
            </div>

            {/* Profile ID */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#24103F]">Profile ID</Label>
              <Input
                type="text"
                placeholder="e.g. SBM-D101"
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                className="h-10 text-xs bg-white border-[#E4DDD3]"
              />
            </div>

            {/* Age Range */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#24103F]">Age Range</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={18}
                  max={70}
                  placeholder="21"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  className="h-10 text-xs text-center bg-white border-[#E4DDD3]"
                />
                <span className="text-xs text-[#6B6570]">to</span>
                <Input
                  type="number"
                  min={18}
                  max={70}
                  placeholder="35"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  className="h-10 text-xs text-center bg-white border-[#E4DDD3]"
                />
              </div>
            </div>

            {/* State */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#24103F]">Location / State</Label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="flex h-10 w-full rounded-md border border-[#E4DDD3] bg-white px-3 text-xs"
              >
                <option value="">All Locations</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Education */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#24103F]">Education</Label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="flex h-10 w-full rounded-md border border-[#E4DDD3] bg-white px-3 text-xs"
              >
                <option value="">Any Education</option>
                {EDUCATION_OPTIONS.map((ed) => (
                  <option key={ed} value={ed}>
                    {ed}
                  </option>
                ))}
              </select>
            </div>

            {/* Marital Status */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#24103F]">Marital Status</Label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="flex h-10 w-full rounded-md border border-[#E4DDD3] bg-white px-3 text-xs"
              >
                <option value="">Any Status</option>
                {MARITAL_STATUS_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Photo & Horoscope */}
            <div className="space-y-2 pt-2 border-t border-[#E4DDD3]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={photoOnly}
                  onChange={(e) => setPhotoOnly(e.target.checked)}
                  className="h-4 w-4 rounded text-[#24103F]"
                />
                <span className="text-xs text-[#242024]">Profiles with Photo only</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={horoscopeOnly}
                  onChange={(e) => setHoroscopeOnly(e.target.checked)}
                  className="h-4 w-4 rounded text-[#242024]"
                />
                <span className="text-xs text-[#242024]">Horoscope Added only</span>
              </label>
            </div>
          </div>

          <div className="p-4 border-t border-[#E4DDD3] bg-white flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
              className="flex-1 h-10 text-xs"
            >
              Reset All
            </Button>
            <Button
              type="button"
              onClick={handleFilterSubmit}
              className="flex-1 h-10 bg-[#24103F] text-white text-xs font-semibold"
            >
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
