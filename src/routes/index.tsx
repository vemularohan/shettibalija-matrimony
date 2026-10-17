import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { Search, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileCard, type PublicProfileCardData } from "@/components/profiles/profile-card";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useProfileActions } from "@/hooks/use-profile-actions";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_PROFILES } from "@/data/demo-profiles";
import { HeroPhotoGallery } from "@/components/home/hero-photo-gallery";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { STATES } from "@/lib/options";
import { formatINRFromPaise } from "@/lib/format";
import type { Json } from "@/integrations/supabase/types";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: `${SITE_NAME} | Find a partner who feels like home` },
      { name: "description", content: SITE_TAGLINE },
    ],
  }),
});

function HomePage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const actions = useProfileActions();

  // Search state — simplified to 3 key fields
  const [gender, setGender] = useState("");
  const [minAge, setMinAge] = useState("21");
  const [maxAge, setMaxAge] = useState("35");
  const [state, setState] = useState("");

  function onSearch(event: FormEvent) {
    event.preventDefault();
    void navigate({
      to: "/search",
      search: {
        gender: gender || undefined,
        minAge: minAge ? Number(minAge) : undefined,
        maxAge: maxAge ? Number(maxAge) : undefined,
        state: state || undefined,
      },
    });
  }

  const recent = useQuery({
    queryKey: ["recent-profiles"],
    queryFn: async () => {
      let realProfiles: PublicProfileCardData[] = [];
      try {
        const { data, error } = await supabase
          .from("approved_matrimonial_profiles")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(8);
        if (!error && data) {
          realProfiles = data.filter((p): p is typeof p & { id: string } => Boolean(p.id));
        }
      } catch {
        // Fallback to demo profiles
      }
      const realIds = new Set(realProfiles.map((p) => p.id));
      const demoToAdd = DEMO_PROFILES.filter((d) => !realIds.has(d.id));
      return [...realProfiles, ...demoToAdd].slice(0, 8);
    },
  });

  const plans = useQuery({
    queryKey: ["membership-plans-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("active", true)
        .order("price_paise", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="flex flex-col w-full">
      {/* 1. EDITORIAL HERO */}
      <HeroPhotoGallery />

      {/* 2. QUICK SEARCH — Clean, 3 fields only */}
      <section className="bg-white border-b border-[#E4DDD3]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-8">
            <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#087333]">
              {lang === "te" ? "శోధన" : "Search Profiles"}
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold text-[#242024]">
              {lang === "te" ? "మీకు సరిపోయే వ్యక్తులను కనుగొనండి." : "Find your match."}
            </h2>
          </div>

          <form onSubmit={onSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            {/* Looking For */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#6B6570]">
                {lang === "te" ? "వెతుకుతున్నది" : "Looking for"}
              </Label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="flex h-10 w-full rounded-md border border-[#E4DDD3] bg-white px-3 text-sm text-[#242024] focus:border-[#24103F] focus:outline-none focus:ring-1 focus:ring-[#24103F]/20"
              >
                <option value="">{lang === "te" ? "వధువు లేదా వరుడు" : "Bride or Groom"}</option>
                <option value="bride">{lang === "te" ? "వధువు" : "Bride"}</option>
                <option value="groom">{lang === "te" ? "వరుడు" : "Groom"}</option>
              </select>
            </div>

            {/* Age Range */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#6B6570]">
                {lang === "te" ? "వయస్సు పరిధి" : "Age range"}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={18}
                  max={70}
                  placeholder="21"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  className="h-10 rounded-md border-[#E4DDD3] bg-white text-sm focus-visible:ring-1 focus-visible:ring-[#24103F]/20 focus-visible:border-[#24103F]"
                />
                <span className="text-xs text-[#B0A8B8] shrink-0">–</span>
                <Input
                  type="number"
                  min={18}
                  max={70}
                  placeholder="35"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  className="h-10 rounded-md border-[#E4DDD3] bg-white text-sm focus-visible:ring-1 focus-visible:ring-[#24103F]/20 focus-visible:border-[#24103F]"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#6B6570]">
                {lang === "te" ? "ప్రాంతం" : "Location"}
              </Label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="flex h-10 w-full rounded-md border border-[#E4DDD3] bg-white px-3 text-sm text-[#242024] focus:border-[#24103F] focus:outline-none focus:ring-1 focus:ring-[#24103F]/20"
              >
                <option value="">{lang === "te" ? "అన్ని ప్రాంతాలు" : "All locations"}</option>
                {STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="h-10 w-full rounded-md bg-[#24103F] text-sm font-semibold text-white hover:bg-[#311552] transition-colors"
            >
              <Search className="mr-2 h-4 w-4" />
              {lang === "te" ? "మ్యాచ్‌లు కనుగొనండి" : "Find Matches"}
            </Button>
          </form>

          <div className="mt-4">
            <Link
              to="/search"
              className="text-xs text-[#6B6570] hover:text-[#24103F] transition-colors"
            >
              {lang === "te" ? "అదనపు ఫిల్టర్లు →" : "Advanced filters →"}
            </Link>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS — Typographic, minimal */}
      <section id="how-it-works" className="bg-[#FAF8F3] border-b border-[#E4DDD3]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="mb-14">
            <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#087333]">
              {lang === "te" ? "ప్రక్రియ" : "How it works"}
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold text-[#242024]">
              {lang === "te" ? "మూడు సరళమైన దశలు" : "Three simple steps."}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {[
              {
                num: "01",
                title: lang === "te" ? "మీ ప్రొఫైల్ సృష్టించండి" : "Create your profile",
                desc:
                  lang === "te"
                    ? "జాతకం, చదువు మరియు కుటుంబ వివరాలు నమోదు చేయండి."
                    : "Register with your horoscope, education, and family details. Your privacy is always protected.",
              },
              {
                num: "02",
                title:
                  lang === "te" ? "అర్థవంతమైన మ్యాచ్‌లు కనుగొనండి" : "Discover meaningful matches",
                desc:
                  lang === "te"
                    ? "గోత్రం, విద్య మరియు నగరం ఆధారంగా శెట్టిబలిజ ప్రొఫైల్స్ బ్రౌజ్ చేయండి."
                    : "Browse Shettibalija profiles by gothram, education, location, and lifestyle.",
              },
              {
                num: "03",
                title: lang === "te" ? "విశ్వాసంతో కనెక్ట్ అవ్వండి" : "Connect with confidence",
                desc:
                  lang === "te"
                    ? "ఆసక్తి వ్యక్తం చేయండి మరియు నేరుగా కుటుంబాలతో మాట్లాడండి."
                    : "Express interest and connect directly with families once both sides agree.",
              },
            ].map((step) => (
              <div key={step.num} className="flex flex-col">
                <span className="font-serif text-4xl font-light text-[#D1A329] leading-none mb-5">
                  {step.num}
                </span>
                <div className="w-8 h-px bg-[#E4DDD3] mb-5" />
                <h3 className="text-base font-semibold text-[#242024] leading-snug mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-[#6B6570] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROFILE GRID — Editorial composition */}
      <section className="bg-white border-b border-[#E4DDD3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#087333]">
                {lang === "te" ? "తాజా చేరికలు" : "Community Profiles"}
              </span>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold text-[#242024]">
                {lang === "te" ? "ఇటీవల చేరిన ప్రొఫైల్స్" : "Recently joined."}
              </h2>
            </div>
            <Link
              to="/search"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#24103F] hover:text-[#087333] transition-colors"
            >
              {lang === "te" ? "అన్నీ చూడండి" : "View all"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recent.isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-md" />
              ))}
            </div>
          ) : recent.isError ? (
            <ErrorState onRetry={() => void recent.refetch()} />
          ) : !recent.data?.length ? (
            <EmptyState
              title="No approved profiles yet"
              description="Approved profiles will appear here as members register."
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {recent.data.map((profile) => (
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

          <div className="mt-8 sm:hidden text-center">
            <Link
              to="/search"
              className="text-sm font-medium text-[#24103F] hover:text-[#087333] transition-colors inline-flex items-center gap-1"
            >
              {lang === "te" ? "అన్ని ప్రొఫైల్స్" : "View all profiles"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. COMMUNITY SECTION — Deep purple, typographic, subtle decorative */}
      <section className="bg-[#24103F] text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Subtle gold line accent */}
              <div className="w-8 h-px bg-[#D1A329] mb-8" />
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">
                {lang === "te" ? (
                  <>
                    కేవలం మ్యాచ్
                    <br />
                    మాత్రమే కాదు.
                  </>
                ) : (
                  <>
                    More than
                    <br />
                    matchmaking.
                  </>
                )}
              </h2>
              <p className="mt-6 text-base text-white/70 leading-relaxed max-w-md">
                {lang === "te"
                  ? "కుటుంబం, సమాజం మరియు అర్థవంతమైన సంబంధాల చుట్టూ నిర్మించబడింది. శెట్టిబలిజ సంప్రదాయాలను గౌరవిస్తూ ఆధునిక వేదికగా పనిచేస్తుంది."
                  : "Built around community, family and meaningful relationships. Rooted in Shettibalija heritage, designed for modern families who value tradition."}
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-md border-white/30 bg-transparent text-white text-sm font-medium hover:bg-white/10 hover:border-white/50 transition-colors"
                >
                  <Link to="/about">{lang === "te" ? "మా గురించి" : "About Sangham"}</Link>
                </Button>
              </div>
            </div>

            {/* Values — typographic list, no cards */}
            <div className="space-y-8 border-l border-white/15 pl-10 lg:pl-14">
              {[
                {
                  title: lang === "te" ? "కమ్యూనిటీ వెరిఫై" : "Community Verified",
                  desc:
                    lang === "te"
                      ? "ప్రతి ప్రొఫైల్ కమ్యూనిటీ అడ్మిన్‌లచే ధృవీకరించబడుతుంది."
                      : "Every profile is reviewed by community administrators before being listed.",
                },
                {
                  title: lang === "te" ? "గోప్యత రక్షణ" : "Privacy Protected",
                  desc:
                    lang === "te"
                      ? "ఫోటోలు మరియు సంప్రదింపు వివరాలు అనుమతి తర్వాత మాత్రమే."
                      : "Photos and contact details are protected until both families express mutual interest.",
                },
                {
                  title: lang === "te" ? "సాంస్కృతిక గుర్తింపు" : "Cultural Identity",
                  desc:
                    lang === "te"
                      ? "గోత్రం, నక్షత్రం మరియు రాశి ఆధారంగా వివరంగా శోధించండి."
                      : "Search by gothram, star, rashi and other meaningful cultural details.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <p className="text-sm font-semibold text-white/90 mb-1.5">{item.title}</p>
                  <p className="text-sm text-white/55 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. MEMBERSHIP — Clean, no glow, from database */}
      <section className="bg-[#FAF8F3] border-b border-[#E4DDD3]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="mb-12">
            <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#087333]">
              {lang === "te" ? "సభ్యత్వం" : "Membership"}
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold text-[#242024]">
              {lang === "te" ? "ప్రణాళికలు" : "Simple, transparent plans."}
            </h2>
            <p className="mt-3 text-sm text-[#6B6570] max-w-lg">
              {lang === "te"
                ? "వెరిఫై చేయబడిన సంప్రదింపు వివరాలు అన్‌లాక్ చేయండి మరియు నేరుగా కుటుంబాలతో కనెక్ట్ అవ్వండి."
                : "Unlock verified contact details and connect directly with families."}
            </p>
          </div>

          {plans.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-md" />
              ))}
            </div>
          ) : plans.isError ? (
            <ErrorState onRetry={() => void plans.refetch()} />
          ) : plans.data && plans.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.data.map((plan, idx) => {
                const isFree = (plan.price_paise ?? 0) <= 0;
                const isFeatured =
                  idx === 1 ||
                  plan.name.toLowerCase().includes("premium") ||
                  plan.name.toLowerCase().includes("vip");
                const benefits = asStringArray(plan.benefits);
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-md border p-6 transition-all duration-200 ${
                      isFeatured
                        ? "border-[#24103F] bg-white shadow-[0_4px_20px_rgba(36,16,63,0.08)]"
                        : "border-[#E4DDD3] bg-white hover:border-[#24103F]/30"
                    }`}
                  >
                    {isFeatured && (
                      <div className="absolute -top-3 left-5">
                        <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#087333] text-white px-2.5 py-1 rounded-sm">
                          {lang === "te" ? "సిఫార్సు" : "Recommended"}
                        </span>
                      </div>
                    )}

                    <div className="mb-5">
                      <h3 className="font-semibold text-[#242024] text-base">{plan.name}</h3>
                      {plan.description && (
                        <p className="mt-1 text-xs text-[#6B6570]">{plan.description}</p>
                      )}
                    </div>

                    <div className="mb-5 pb-5 border-b border-[#E4DDD3]">
                      <span className="font-serif text-3xl font-semibold text-[#242024]">
                        {isFree ? "Free" : formatINRFromPaise(plan.price_paise)}
                      </span>
                      {plan.duration_days && !isFree && (
                        <span className="ml-2 text-xs text-[#6B6570]">
                          / {plan.duration_days} days
                        </span>
                      )}
                    </div>

                    <ul className="flex-1 space-y-2.5 text-sm mb-6">
                      {benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2.5">
                          <Check className="h-3.5 w-3.5 text-[#087333] mt-0.5 shrink-0" />
                          <span className="text-[#6B6570] text-xs leading-snug">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      asChild
                      className={`w-full h-10 rounded-md text-sm font-semibold transition-colors ${
                        isFeatured
                          ? "bg-[#24103F] text-white hover:bg-[#311552]"
                          : "bg-transparent border border-[#E4DDD3] text-[#242024] hover:border-[#24103F] hover:bg-[#FAF8F3]"
                      }`}
                      variant={isFeatured ? "default" : "outline"}
                    >
                      <Link to="/membership">
                        {isFree
                          ? lang === "te"
                            ? "ఉచితంగా చేరండి"
                            : "Join Free"
                          : lang === "te"
                            ? "ఈ ప్రణాళిక ఎంచుకోండి"
                            : `Choose ${plan.name}`}
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Fallback when no plans in database */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-xl">
              <div className="flex flex-col rounded-md border border-[#E4DDD3] bg-white p-6">
                <h3 className="font-semibold text-[#242024]">
                  {lang === "te" ? "ప్రాథమిక" : "Basic"}
                </h3>
                <p className="mt-1 text-xs text-[#6B6570]">
                  {lang === "te" ? "ప్రారంభ శోధనకు" : "To start your search"}
                </p>
                <div className="my-4 pb-4 border-b border-[#E4DDD3]">
                  <span className="font-serif text-3xl font-semibold text-[#242024]">
                    {lang === "te" ? "ఉచితం" : "Free"}
                  </span>
                </div>
                <ul className="flex-1 space-y-2 mb-5">
                  {[
                    lang === "te"
                      ? "అన్ని ప్రొఫైల్స్ బ్రౌజ్ చేయండి"
                      : "Browse all community profiles",
                    lang === "te" ? "ప్రొఫైల్ సృష్టించండి" : "Create your matrimonial profile",
                    lang === "te" ? "షార్ట్‌లిస్ట్ పంపండి" : "Send shortlist requests",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-[#087333] mt-0.5 shrink-0" />
                      <span className="text-xs text-[#6B6570]">{b}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-md border-[#E4DDD3] text-sm text-[#242024]"
                >
                  <Link to="/register">{lang === "te" ? "ఉచితంగా చేరండి" : "Join Free"}</Link>
                </Button>
              </div>

              <div className="flex flex-col rounded-md border border-[#24103F] bg-white p-6 shadow-[0_4px_20px_rgba(36,16,63,0.08)] relative">
                <div className="absolute -top-3 left-5">
                  <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#087333] text-white px-2.5 py-1 rounded-sm">
                    {lang === "te" ? "సిఫార్సు" : "Recommended"}
                  </span>
                </div>
                <h3 className="font-semibold text-[#242024]">
                  {lang === "te" ? "ప్రీమియం" : "Premium"}
                </h3>
                <p className="mt-1 text-xs text-[#6B6570]">
                  {lang === "te" ? "నేరుగా కుటుంబ కనెక్షన్‌లు" : "Direct family connections"}
                </p>
                <div className="my-4 pb-4 border-b border-[#E4DDD3]">
                  <span className="font-serif text-3xl font-semibold text-[#242024]">₹1,999</span>
                  <span className="ml-2 text-xs text-[#6B6570]">/ 90 days</span>
                </div>
                <ul className="flex-1 space-y-2 mb-5">
                  {[
                    lang === "te"
                      ? "25 వెరిఫై చేయబడిన సంప్రదింపు నంబర్లు"
                      : "Unlock 25 verified contact numbers",
                    lang === "te" ? "పూర్తి ఫోటో గ్యాలరీ" : "View full protected photo gallery",
                    lang === "te" ? "జాతకం వీక్షణ" : "Horoscope viewing access",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-[#087333] mt-0.5 shrink-0" />
                      <span className="text-xs text-[#6B6570]">{b}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="h-10 rounded-md bg-[#24103F] text-sm font-semibold text-white hover:bg-[#311552]"
                >
                  <Link to="/membership">
                    {lang === "te" ? "ప్రీమియం ఎంచుకోండి" : "Choose Premium"}
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function asStringArray(value: Json): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}
