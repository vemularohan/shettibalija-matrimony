import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  Clock3,
  Save,
  EyeOff,
  LayoutGrid,
  Rows3,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProtectedPhoto } from "@/components/profiles/protected-photo";
import { type PublicProfileCardData } from "@/components/profiles/profile-card";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useProfileActions } from "@/hooks/use-profile-actions";
import { validateSearchParams, type SearchParams } from "@/lib/search-params";
import { SITE_NAME } from "@/lib/site";
import { formatHeight, locationLine } from "@/lib/format";
import { useLanguage } from "@/lib/i18n";
import { productSupabase } from "@/integrations/supabase/product-client";
import { useOwnMatrimonialProfile } from "@/hooks/use-member-data";
import { useAuth } from "@/hooks/use-auth";
import { RequireAuth } from "@/components/shared/require-auth";
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
      { name: "description", content: "Search reviewed Shettibalija matrimony profiles" },
    ],
  }),
});

function SearchPage() {
  const { user, loading } = useAuth();
  const searchParams = Route.useSearch();
  const navigate = useNavigate();
  const actions = useProfileActions();
  const queryClient = useQueryClient();
  const ownProfileQuery = useOwnMatrimonialProfile();
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
  const [onlineOnly, setOnlineOnly] = useState(Boolean(searchParams.onlineOnly));
  const [motherTongue, setMotherTongue] = useState(searchParams.motherTongue ?? "");
  const [community, setCommunity] = useState(searchParams.community ?? "");
  const [city, setCity] = useState(searchParams.city ?? "");
  const [citizenship, setCitizenship] = useState(searchParams.citizenship ?? "");
  const [createdWithinDays, setCreatedWithinDays] = useState(
    searchParams.createdWithinDays ? String(searchParams.createdWithinDays) : "",
  );
  const [searchMode, setSearchMode] = useState<
    "quick" | "regular" | "advanced" | "keyword" | "id" | "online"
  >("regular");
  const [viewMode, setViewMode] = useState<"editorial" | "compact">("editorial");
  const [saveSearchOpen, setSaveSearchOpen] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState("");

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
    setOnlineOnly(Boolean(searchParams.onlineOnly));
    setMotherTongue(searchParams.motherTongue ?? "");
    setCommunity(searchParams.community ?? "");
    setCity(searchParams.city ?? "");
    setCitizenship(searchParams.citizenship ?? "");
    setCreatedWithinDays(
      searchParams.createdWithinDays ? String(searchParams.createdWithinDays) : "",
    );
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
    onlineOnly,
    motherTongue,
    community,
    city,
    citizenship,
    createdWithinDays,
  ].filter(Boolean).length;

  function executeSearch(overrides?: Partial<SearchParams>) {
    function pick<K extends keyof SearchParams>(
      key: K,
      fallback: SearchParams[K],
    ): SearchParams[K] {
      return overrides && Object.prototype.hasOwnProperty.call(overrides, key)
        ? (overrides[key] as SearchParams[K])
        : fallback;
    }
    void navigate({
      to: "/search",
      search: {
        query: pick("query", keyword || undefined),
        profileId: pick("profileId", profileId || undefined),
        gender: pick("gender", gender || undefined),
        minAge: pick("minAge", minAge ? Number(minAge) : undefined),
        maxAge: pick("maxAge", maxAge ? Number(maxAge) : undefined),
        minHeight: pick("minHeight", minHeight ? Number(minHeight) : undefined),
        maxHeight: pick("maxHeight", maxHeight ? Number(maxHeight) : undefined),
        state: pick("state", state || undefined),
        city: pick("city", city || undefined),
        education: pick("education", education || undefined),
        occupation: pick("occupation", occupation || undefined),
        maritalStatus: pick("maritalStatus", maritalStatus || undefined),
        motherTongue: pick("motherTongue", motherTongue || undefined),
        community: pick("community", community || undefined),
        foodHabit: pick("foodHabit", foodHabit || undefined),
        gothram: pick("gothram", gothram || undefined),
        star: pick("star", star || undefined),
        rashi: pick("rashi", rashi || undefined),
        citizenship: pick("citizenship", citizenship || undefined),
        photoOnly: pick("photoOnly", photoOnly || undefined),
        horoscopeOnly: pick("horoscopeOnly", horoscopeOnly || undefined),
        onlineOnly: pick("onlineOnly", onlineOnly || undefined),
        createdWithinDays: pick(
          "createdWithinDays",
          createdWithinDays ? Number(createdWithinDays) : undefined,
        ),
        sort: pick("sort", sortBy || undefined),
        page: pick("page", 1),
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
    setOnlineOnly(false);
    setMotherTongue("");
    setCommunity("");
    setCity("");
    setCitizenship("");
    setCreatedWithinDays("");
    void navigate({
      to: "/search",
      search: {},
    });
  }

  const profilesQuery = useQuery({
    queryKey: [
      "search-profiles",
      searchParams,
      ownProfileQuery.data?.id,
      [...actions.blockedIds].sort().join(","),
      [...actions.ignoredIds].sort().join(","),
    ],
    enabled:
      Boolean(user) &&
      !ownProfileQuery.isLoading &&
      !actions.isBlockedLoading &&
      !actions.isIgnoredLoading &&
      !actions.isShortlistLoading &&
      !actions.isInterestsLoading &&
      !ownProfileQuery.isError &&
      !actions.isBlockedError &&
      !actions.isIgnoredError &&
      !actions.isShortlistError &&
      !actions.isInterestsError,
    queryFn: async () => {
      let query = productSupabase
        .from("approved_matrimonial_profiles")
        .select("*", { count: "exact" });

      const excludedIds = new Set([...actions.blockedIds, ...actions.ignoredIds]);
      if (ownProfileQuery.data?.id) excludedIds.add(ownProfileQuery.data.id);
      if (excludedIds.size) {
        query = query.not("id", "in", `(${[...excludedIds].join(",")})`);
      }
      if (searchParams.gender) query = query.eq("gender", searchParams.gender);
      if (searchParams.minAge != null) query = query.gte("age", searchParams.minAge);
      if (searchParams.maxAge != null) query = query.lte("age", searchParams.maxAge);
      if (searchParams.minHeight != null) query = query.gte("height_cm", searchParams.minHeight);
      if (searchParams.maxHeight != null) query = query.lte("height_cm", searchParams.maxHeight);
      if (searchParams.maritalStatus)
        query = query.eq("marital_status", searchParams.maritalStatus);
      if (searchParams.state) query = query.eq("state", searchParams.state);
      if (searchParams.city) query = query.ilike("city", `%${searchParams.city}%`);
      if (searchParams.education) query = query.ilike("education", `%${searchParams.education}%`);
      if (searchParams.occupation)
        query = query.ilike("occupation", `%${searchParams.occupation}%`);
      if (searchParams.motherTongue) query = query.eq("mother_tongue", searchParams.motherTongue);
      if (searchParams.community) query = query.ilike("community", `%${searchParams.community}%`);
      if (searchParams.foodHabit) query = query.eq("food_habit", searchParams.foodHabit);
      if (searchParams.gothram) query = query.ilike("gothram", `%${searchParams.gothram}%`);
      if (searchParams.star) query = query.eq("star", searchParams.star);
      if (searchParams.rashi) query = query.eq("rashi", searchParams.rashi);
      if (searchParams.citizenship)
        query = query.ilike("citizenship", `%${searchParams.citizenship}%`);
      if (searchParams.photoOnly) query = query.eq("has_profile_photo", true);
      if (searchParams.horoscopeOnly) query = query.eq("horoscope_available", true);
      if (searchParams.onlineOnly) {
        query = query.gte("last_active_at", new Date(Date.now() - 15 * 60 * 1000).toISOString());
      }
      if (searchParams.createdWithinDays) {
        const cutoff = new Date(
          Date.now() - searchParams.createdWithinDays * 86400000,
        ).toISOString();
        query = query.gte("created_at", cutoff);
      }
      if (searchParams.profileId) {
        const lookup = searchParams.profileId.trim();
        if (/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(lookup)) query = query.eq("id", lookup);
        else query = query.eq("profile_code", lookup.toUpperCase());
      }
      if (searchParams.query) {
        const term = searchParams.query
          .trim()
          .replace(/[,%()\\"']/g, " ")
          .replace(/\s+/g, " ");
        if (term) {
          const match = `%${term}%`;
          query = query.or(
            [
              `display_name.ilike.${match}`,
              `family_summary.ilike.${match}`,
              `about_me.ilike.${match}`,
              `education.ilike.${match}`,
              `occupation.ilike.${match}`,
              `designation.ilike.${match}`,
              `community_profession.ilike.${match}`,
              `city.ilike.${match}`,
              `state.ilike.${match}`,
              `native_place.ilike.${match}`,
              `job_location.ilike.${match}`,
            ].join(","),
          );
        }
      }

      const sortColumn =
        searchParams.sort === "recently_active"
          ? "last_active_at"
          : searchParams.sort === "age_asc" || searchParams.sort === "age_desc"
            ? "age"
            : "created_at";
      const ascending = searchParams.sort === "age_asc";
      query = query.order(sortColumn, { ascending, nullsFirst: false });
      const page = Math.max(1, searchParams.page ?? 1);
      const { data, error, count } = await query.range((page - 1) * 20, page * 20 - 1);
      if (error) throw error;

      const items = (data ?? [])
        .filter((profile): profile is typeof profile & { id: string } => Boolean(profile.id))
        .map((profile) => profile as PublicProfileCardData);
      return { items, count: count ?? items.length };
    },
  });

  const saveSearch = useMutation({
    mutationFn: async () => {
      if (!actions.user) throw new Error("Sign in to save searches.");
      if (saveSearchName.trim().length < 2) throw new Error("Give this search a name.");
      const { error } = await productSupabase.from("saved_searches").insert({
        owner_id: actions.user.id,
        name: saveSearchName.trim(),
        criteria: { ...searchParams, page: 1 },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Search saved");
      setSaveSearchName("");
      setSaveSearchOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not save this search."),
  });

  if (!loading && !user) {
    return <RequireAuth>{null}</RequireAuth>;
  }

  return (
    <div className="min-h-screen bg-[#F7F3EA] pt-14 pb-16">
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
              <p className="text-xs text-[#756A61] mt-1">
                {lang === "te"
                  ? "శెట్టిబలిజ కమ్యూనిటీలో సమీక్షించిన వధువు/వరుల ప్రొఫైల్‌లు"
                  : "Explore reviewed matrimonial profiles with detailed cultural, education & horoscope criteria"}
              </p>
            </div>

            {/* Quick Keyword / ID Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchMode === "id") {
                  executeSearch({ profileId: profileId || keyword, query: undefined });
                } else {
                  executeSearch({ query: keyword || undefined, profileId: undefined });
                }
              }}
              className="flex items-center gap-2 max-w-md w-full"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B0A8B8]" />
                <Input
                  type="text"
                  placeholder={
                    searchMode === "id"
                      ? lang === "te"
                        ? "మ్యాట్రిమోనీ ID నమోదు చేయండి"
                        : "Enter Matrimony ID, e.g. SBM123456"
                      : lang === "te"
                        ? "వృత్తి, నగరం లేదా వివరణ ద్వారా వెతకండి"
                        : "Software Engineer, Hyderabad, Government Employee…"
                  }
                  value={searchMode === "id" ? profileId : keyword}
                  onChange={(e) =>
                    searchMode === "id" ? setProfileId(e.target.value) : setKeyword(e.target.value)
                  }
                  className="pl-9 h-10 text-xs bg-[#F7F3EA] border-[#E4DDD3] focus-visible:ring-1 focus-visible:ring-[#24103F]"
                />
              </div>
              <Button
                type="submit"
                className="h-10 px-4 bg-[#24103F] text-xs font-semibold text-white hover:bg-[#311552]"
              >
                {lang === "te" ? "శోధించండి" : "Search"}
              </Button>
            </form>
          </div>
          <div
            className="mt-5 flex gap-2 overflow-x-auto pb-1"
            role="tablist"
            aria-label="Search modes"
          >
            {(
              [
                ["quick", lang === "te" ? "త్వరిత శోధన" : "Quick Search"],
                ["regular", lang === "te" ? "సాధారణ శోధన" : "Regular Search"],
                ["advanced", lang === "te" ? "విస్తృత శోధన" : "Advanced Search"],
                ["keyword", lang === "te" ? "కీవర్డ్" : "Keyword Search"],
                ["id", lang === "te" ? "మ్యాట్రిమోనీ ID" : "Search by ID"],
                ["online", lang === "te" ? "ఆన్‌లైన్ సభ్యులు" : "Online Members"],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={searchMode === mode}
                onClick={() => {
                  setSearchMode(mode);
                  if (mode === "online") {
                    setOnlineOnly(true);
                    executeSearch({ onlineOnly: true });
                  } else if (onlineOnly) {
                    setOnlineOnly(false);
                    executeSearch({ onlineOnly: false });
                  }
                  if (mode === "advanced") setMobileFilterOpen(true);
                }}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${searchMode === mode ? "border-[#24103F] bg-[#24103F] text-white" : "border-[#E4DDD3] bg-white text-[#756A61] hover:border-[#24103F] hover:text-[#24103F]"}`}
              >
                {mode === "online" ? <Clock3 className="mr-1.5 inline h-3.5 w-3.5" /> : null}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Column Search Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4 flex items-center justify-between bg-white p-3 rounded-lg border border-[#E4DDD3]">
          <div className="text-xs font-medium text-[#24103F]">
            {profilesQuery.isLoading ||
            actions.isBlockedLoading ||
            actions.isIgnoredLoading ||
            actions.isShortlistLoading ||
            actions.isInterestsLoading
              ? "Loading profiles…"
              : profilesQuery.isError ||
                  actions.isBlockedError ||
                  actions.isIgnoredError ||
                  actions.isShortlistError ||
                  actions.isInterestsError
                ? "Profiles unavailable"
                : `${profilesQuery.data?.count ?? 0} Profiles Found`}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen(true)}
            className="h-8 text-xs font-semibold border-[#C9A227] text-[#24103F] flex items-center gap-1.5"
          >
            <Filter className="h-3.5 w-3.5 text-[#C9A227]" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-8 items-start">
          {/* ========================================================
              LEFT SIDEBAR: Matrimonial Filters (Desktop)
             ======================================================== */}
          <aside className="sticky top-20 hidden rounded-lg border border-[#E4DDD3] bg-white p-5 lg:block">
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
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#211D22] focus:border-[#24103F] focus:outline-none"
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
                  placeholder="e.g. SBM12345678"
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
                  <span className="text-xs text-[#756A61]">to</span>
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
                    className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2 text-xs text-[#211D22]"
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
                    className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2 text-xs text-[#211D22]"
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
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#211D22]"
                >
                  <option value="">All Locations</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">City</Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Hyderabad, Kakinada…"
                  className="h-9 text-xs"
                />
              </div>

              {/* 6. Education */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">Education</Label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#211D22]"
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
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#211D22]"
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
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#211D22]"
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
                <Label className="text-xs font-semibold text-[#24103F]">Mother Tongue</Label>
                <select
                  value={motherTongue}
                  onChange={(e) => setMotherTongue(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#211D22]"
                >
                  <option value="">Any</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">Food Habit</Label>
                <select
                  value={foodHabit}
                  onChange={(e) => setFoodHabit(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#211D22]"
                >
                  <option value="">Any</option>
                  {FOOD_HABIT_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
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
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#211D22]"
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
                <Label className="text-xs font-semibold text-[#24103F]">Rashi</Label>
                <select
                  value={rashi}
                  onChange={(e) => setRashi(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#211D22]"
                >
                  <option value="">Any Rashi</option>
                  {RASHI_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
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

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">Citizenship</Label>
                <Input
                  value={citizenship}
                  onChange={(e) => setCitizenship(e.target.value)}
                  placeholder="India, USA…"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">Profile posted</Label>
                <select
                  value={createdWithinDays}
                  onChange={(e) => setCreatedWithinDays(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#211D22]"
                >
                  <option value="">Any time</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                </select>
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
            <div className="mb-5 flex flex-col justify-between gap-3 border-b border-[#C9A227]/50 pb-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-serif text-2xl font-medium text-[#24103F] sm:text-3xl">
                  {lang === "te" ? "శోధన ఫలితాలు" : "Profiles Found"}
                </h2>
                <p className="mt-1 text-xs text-[#756A61]">
                  {profilesQuery.isLoading ||
                  actions.isBlockedLoading ||
                  actions.isIgnoredLoading ||
                  actions.isShortlistLoading ||
                  actions.isInterestsLoading
                    ? "Searching matching profiles..."
                    : profilesQuery.isError ||
                        actions.isBlockedError ||
                        actions.isIgnoredError ||
                        actions.isShortlistError ||
                        actions.isInterestsError
                      ? "Profile results are unavailable"
                      : lang === "te"
                        ? `శెట్టిబలిజ సమాజంలో ${profilesQuery.data?.count ?? 0} ప్రొఫైల్స్`
                        : `${profilesQuery.data?.count ?? 0} profiles from the Shettibalija community`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="flex items-center gap-1 border-r border-[#E4DDD3] pr-2 sm:pr-3"
                  role="group"
                  aria-label={lang === "te" ? "ఫలితాల వీక్షణ" : "Result view"}
                >
                  <span className="mr-1 hidden text-[11px] text-[#756A61] sm:inline">
                    {lang === "te" ? "వీక్షణ" : "View"}
                  </span>
                  <button
                    type="button"
                    aria-pressed={viewMode === "editorial"}
                    aria-label="Editorial view"
                    onClick={() => setViewMode("editorial")}
                    className={`flex h-8 w-8 items-center justify-center border transition-colors ${viewMode === "editorial" ? "border-[#24103F] bg-[#24103F] text-white" : "border-[#E4DDD3] text-[#756A61] hover:border-[#C9A227]"}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-pressed={viewMode === "compact"}
                    aria-label="Compact view"
                    onClick={() => setViewMode("compact")}
                    className={`flex h-8 w-8 items-center justify-center border transition-colors ${viewMode === "compact" ? "border-[#24103F] bg-[#24103F] text-white" : "border-[#E4DDD3] text-[#756A61] hover:border-[#C9A227]"}`}
                  >
                    <Rows3 className="h-4 w-4" />
                  </button>
                </div>
                {actions.user ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSaveSearchOpen(true)}
                    className="h-8 text-xs"
                  >
                    <Save className="mr-1.5 h-3.5 w-3.5" /> Save Search
                  </Button>
                ) : (
                  <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                    <Link to="/login">Login to save</Link>
                  </Button>
                )}
                <label className="flex items-center gap-2">
                  <span className="text-xs text-[#756A61] shrink-0">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      const nextSort = e.target.value;
                      setSortBy(nextSort);
                      executeSearch({ sort: nextSort });
                    }}
                    className="h-8 rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#211D22] focus:border-[#24103F]"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="newest">Newest Profiles</option>
                    <option value="recently_active">Recently Active</option>
                    <option value="age_asc">Age: Low to High</option>
                    <option value="age_desc">Age: High to Low</option>
                  </select>
                </label>
              </div>
            </div>

            <Dialog open={saveSearchOpen} onOpenChange={setSaveSearchOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save this search</DialogTitle>
                  <DialogDescription>
                    Give these filters a name so you can run them again from your member dashboard.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  autoFocus
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                  placeholder="Hyderabad software professionals"
                  maxLength={80}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSaveSearchOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    disabled={saveSearch.isPending || saveSearchName.trim().length < 2}
                    onClick={() => saveSearch.mutate()}
                  >
                    {saveSearch.isPending ? "Saving…" : "Save Search"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-5">
                <span className="text-xs text-[#756A61] mr-1">Active Filters:</span>
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
            {profilesQuery.isLoading ||
            actions.isBlockedLoading ||
            actions.isIgnoredLoading ||
            actions.isShortlistLoading ||
            actions.isInterestsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-44 w-full rounded-xl" />
                ))}
              </div>
            ) : profilesQuery.isError ||
              actions.isBlockedError ||
              actions.isIgnoredError ||
              actions.isShortlistError ||
              actions.isInterestsError ? (
              <ErrorState
                title="Failed to load profiles or member settings"
                description="Profile results, privacy settings, or connection states could not be loaded. Retry to search safely."
                onRetry={() => {
                  void Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["blocked-profile-ids"] }),
                    queryClient.invalidateQueries({ queryKey: ["ignored-profile-ids"] }),
                    queryClient.invalidateQueries({ queryKey: ["shortlist-ids"] }),
                    queryClient.invalidateQueries({ queryKey: ["sent-interest-ids"] }),
                    ownProfileQuery.refetch(),
                  ]);
                }}
              />
            ) : !profilesQuery.data?.items.length ? (
              <EmptyState
                title="No matching profiles found"
                description="Try adjusting or clearing your search filters to view more profiles."
                actionLabel="Reset All Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <div className="space-y-4">
                {profilesQuery.data.items.map((profile) => {
                  const isShortlisted = actions.shortlistedIds.has(profile.id);
                  const isInterestSent = actions.sentInterests.has(profile.id);
                  const candidateName = profile.display_name ?? "Community Member";
                  const candidateCode = profile.profile_code ?? profile.id;
                  const location = locationLine(profile.city, profile.state);
                  const formattedHeight = profile.height_cm
                    ? formatHeight(profile.height_cm)
                    : null;

                  return (
                    <article
                      key={profile.id}
                      className={`group flex flex-col gap-5 border-b border-[#E4DDD3] py-5 transition-colors hover:border-[#C9A227] sm:flex-row sm:gap-7 ${viewMode === "editorial" ? "search-result-editorial" : "search-result-compact"}`}
                    >
                      {/* Left: Candidate Photo thumbnail with Code */}
                      <div
                        className={`flex w-full flex-shrink-0 flex-col items-center ${viewMode === "editorial" ? "sm:w-60" : "sm:w-36"}`}
                      >
                        <div
                          className={`relative aspect-[4/5] w-full overflow-hidden border border-[#E4DDD3] bg-[#EDE5D6] ${viewMode === "editorial" ? "max-w-[420px] sm:max-w-none" : "max-w-[240px] sm:max-w-none"}`}
                        >
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
                            className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full border border-[#E4DDD3] bg-white text-[#756A61] transition-colors hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24103F]"
                            aria-label={
                              isShortlisted ? "Remove from shortlist" : "Add to shortlist"
                            }
                            aria-pressed={isShortlisted}
                          >
                            <Heart
                              className={`h-3.5 w-3.5 ${
                                isShortlisted ? "fill-rose-500 text-rose-500" : ""
                              }`}
                            />
                          </button>
                        </div>
                        <span className="mt-2 text-[10px] font-semibold tracking-wider text-[#756A61]">
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
                            <span className="text-xs text-[#756A61]">
                              {profile.age ? `${profile.age} yrs` : "—"}
                              {formattedHeight ? ` • ${formattedHeight}` : ""}
                            </span>
                            {profile.verified_at ? (
                              <span className="inline-flex items-center gap-1 rounded bg-[#087333]/10 px-2 py-0.5 text-[10px] font-semibold text-[#087333] border border-[#087333]/20">
                                <ShieldCheck className="h-3 w-3" />
                                Profile reviewed
                              </span>
                            ) : null}
                          </div>

                          {/* 2-Column Matrimonial Key-Value Details */}
                          <div className="search-result-details grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 my-3 text-xs">
                            <div className="flex items-center gap-1.5 text-[#4A4550]">
                              <GraduationCap className="h-3.5 w-3.5 text-[#087333] shrink-0" />
                              <span className="font-medium text-[#211D22]">Education:</span>
                              <span className="truncate">{profile.education ?? "—"}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[#4A4550]">
                              <Briefcase className="h-3.5 w-3.5 text-[#087333] shrink-0" />
                              <span className="font-medium text-[#211D22]">Profession:</span>
                              <span className="truncate">{profile.occupation ?? "—"}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[#4A4550]">
                              <MapPin className="h-3.5 w-3.5 text-[#087333] shrink-0" />
                              <span className="font-medium text-[#211D22]">Location:</span>
                              <span className="truncate">{location || "—"}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[#4A4550]">
                              <Sparkles className="h-3.5 w-3.5 text-[#C9A227] shrink-0" />
                              <span className="font-medium text-[#211D22]">Cultural:</span>
                              <span className="truncate">
                                {profile.gothram ? `Got: ${profile.gothram}` : ""}
                                {profile.star ? ` • ${profile.star}` : ""}
                              </span>
                            </div>
                          </div>

                          {/* Brief About / Family summary */}
                          {(profile.about_me || profile.family_summary) && (
                            <p className="search-result-summary mb-3 line-clamp-2 border-l border-[#C9A227] pl-3 text-xs leading-relaxed text-[#756A61]">
                              {profile.about_me || profile.family_summary}
                            </p>
                          )}
                        </div>

                        {/* Action Bar */}
                        <div className="search-result-actions pt-2 border-t border-[#E4DDD3]/60 flex flex-wrap items-center justify-between gap-2.5">
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
                              className="h-8 text-xs font-medium border-[#E4DDD3] text-[#211D22] hover:border-[#24103F]"
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

                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              disabled={actions.ignoredIds.has(profile.id)}
                              onClick={() => actions.ignoreProfile.mutate(profile.id)}
                              className="h-8 text-xs text-[#756A61]"
                            >
                              <EyeOff className="mr-1 h-3.5 w-3.5" />
                              {actions.ignoredIds.has(profile.id) ? "Ignored" : "Ignore"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
            {profilesQuery.data && profilesQuery.data.count > 20 ? (
              <div className="mt-6 flex items-center justify-between rounded-xl border border-[#E4DDD3] bg-white p-3">
                <span className="text-xs text-[#756A61]">
                  Page {Math.max(1, searchParams.page ?? 1)} of{" "}
                  {Math.max(1, Math.ceil(profilesQuery.data.count / 20))}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={(searchParams.page ?? 1) <= 1}
                    onClick={() =>
                      executeSearch({ page: Math.max(1, (searchParams.page ?? 1) - 1) })
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={(searchParams.page ?? 1) >= Math.ceil(profilesQuery.data.count / 20)}
                    onClick={() => executeSearch({ page: (searchParams.page ?? 1) + 1 })}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer / Sheet */}
      <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <SheetContent side="right" className="filter-surface w-[min(100%,22rem)] p-0 flex flex-col">
          <SheetHeader className="p-4 border-b border-[#E4DDD3] flex flex-row items-center justify-between">
            <SheetTitle className="text-base font-serif font-bold text-[#24103F]">
              Search Filters
            </SheetTitle>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-md text-[#756A61]"
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
                <span className="text-xs text-[#756A61]">to</span>
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

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#24103F]">Height Range (cm)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={120}
                  max={230}
                  placeholder="150"
                  value={minHeight}
                  onChange={(e) => setMinHeight(e.target.value)}
                  className="h-10 text-xs text-center bg-white border-[#E4DDD3]"
                />
                <span className="text-xs text-[#756A61]">to</span>
                <Input
                  type="number"
                  min={120}
                  max={230}
                  placeholder="190"
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(e.target.value)}
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

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#24103F]">City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter a city"
                className="h-10 text-xs bg-white border-[#E4DDD3]"
              />
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

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#24103F]">Occupation</Label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="flex h-10 w-full rounded-md border border-[#E4DDD3] bg-white px-3 text-xs"
              >
                <option value="">Any Occupation</option>
                {OCCUPATION_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#24103F]">Mother Tongue</Label>
              <Input
                value={motherTongue}
                onChange={(e) => setMotherTongue(e.target.value)}
                placeholder="e.g. Telugu"
                className="h-10 text-xs bg-white border-[#E4DDD3]"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#24103F]">Community</Label>
              <Input
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                placeholder="Community"
                className="h-10 text-xs bg-white border-[#E4DDD3]"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#24103F]">Citizenship</Label>
              <Input
                value={citizenship}
                onChange={(e) => setCitizenship(e.target.value)}
                placeholder="e.g. India"
                className="h-10 text-xs bg-white border-[#E4DDD3]"
              />
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

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#24103F]">Food Habit</Label>
              <select
                value={foodHabit}
                onChange={(e) => setFoodHabit(e.target.value)}
                className="flex h-10 w-full rounded-md border border-[#E4DDD3] bg-white px-3 text-xs"
              >
                <option value="">Any</option>
                {FOOD_HABIT_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#24103F]">Gothram</Label>
              <Input
                value={gothram}
                onChange={(e) => setGothram(e.target.value)}
                placeholder="Gothram"
                className="h-10 text-xs bg-white border-[#E4DDD3]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1 text-xs font-semibold text-[#24103F]">
                Star
                <select
                  value={star}
                  onChange={(e) => setStar(e.target.value)}
                  className="mt-1 flex h-10 w-full rounded-md border border-[#E4DDD3] bg-white px-2 text-xs font-normal"
                >
                  <option value="">Any</option>
                  {NAKSHATRA_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs font-semibold text-[#24103F]">
                Rashi
                <select
                  value={rashi}
                  onChange={(e) => setRashi(e.target.value)}
                  className="mt-1 flex h-10 w-full rounded-md border border-[#E4DDD3] bg-white px-2 text-xs font-normal"
                >
                  <option value="">Any</option>
                  {RASHI_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#24103F]">Profile Posted</Label>
              <select
                value={createdWithinDays}
                onChange={(e) => setCreatedWithinDays(e.target.value)}
                className="flex h-10 w-full rounded-md border border-[#E4DDD3] bg-white px-3 text-xs"
              >
                <option value="">Any time</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>

            <label className="flex items-center gap-2 border-t border-[#E4DDD3] pt-3">
              <input
                type="checkbox"
                checked={onlineOnly}
                onChange={(e) => setOnlineOnly(e.target.checked)}
                className="h-4 w-4 rounded text-[#24103F]"
              />
              <span className="text-xs text-[#211D22]">Recently active members</span>
            </label>

            {/* Photo & Horoscope */}
            <div className="space-y-2 pt-2 border-t border-[#E4DDD3]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={photoOnly}
                  onChange={(e) => setPhotoOnly(e.target.checked)}
                  className="h-4 w-4 rounded text-[#24103F]"
                />
                <span className="text-xs text-[#211D22]">Profiles with Photo only</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={horoscopeOnly}
                  onChange={(e) => setHoroscopeOnly(e.target.checked)}
                  className="h-4 w-4 rounded text-[#211D22]"
                />
                <span className="text-xs text-[#211D22]">Horoscope Added only</span>
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
