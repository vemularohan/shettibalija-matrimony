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

      {/* 2. QUICK SEARCH — Premium 3D surface with subtle depth & gold detail */}
      <section className="surface-silk border-b border-[#E4DDD3]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div
            className="relative rounded-2xl p-6 sm:p-8"
            style={{
              background: "linear-gradient(145deg, #ffffff 0%, #FAF8F3 100%)",
              border: "1px solid rgba(209,163,41,0.30)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.95), 0 4px 20px rgba(36,16,63,0.06), 0 1px 3px rgba(36,16,63,0.04), inset 0 1px 0 rgba(255,255,255,0.85)",
            }}
          >
            {/* Subtle architectural gold corner accents */}
            <span className="arch-corner arch-corner-tl" style={{ width: 16, height: 16, top: 8, left: 8 }} />
            <span className="arch-corner arch-corner-tr" style={{ width: 16, height: 16, top: 8, right: 8 }} />

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E4DDD3] pb-4">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#087333]">
                  {lang === "te" ? "శోధన" : "Search Profiles"}
                </span>
                <h2 className="mt-1 font-serif text-2xl font-semibold text-[#24103F]">
                  {lang === "te" ? "మీకు సరిపోయే వ్యక్తులను కనుగొనండి." : "Find your match."}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B6570]">
                <span className="text-[#D1A329]">◆</span>
                <span>{lang === "te" ? "సమాజ శోధన" : "Shettibalija Community Search"}</span>
              </div>
            </div>

            <form onSubmit={onSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              {/* Looking For */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#24103F]">
                  {lang === "te" ? "వెతుకుతున్నది" : "Looking for"}
                </Label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-[#E4DDD3] bg-white px-3 text-sm text-[#242024] focus:border-[#24103F] focus:outline-none focus:ring-1 focus:ring-[#24103F]/20 shadow-xs"
                >
                  <option value="">{lang === "te" ? "వధువు లేదా వరుడు" : "Bride or Groom"}</option>
                  <option value="bride">{lang === "te" ? "వధువు" : "Bride"}</option>
                  <option value="groom">{lang === "te" ? "వరుడు" : "Groom"}</option>
                </select>
              </div>

              {/* Age Range */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#24103F]">
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
                    className="h-10 rounded-md border-[#E4DDD3] bg-white text-sm focus-visible:ring-1 focus-visible:ring-[#24103F]/20 focus-visible:border-[#24103F] shadow-xs"
                  />
                  <span className="text-xs text-[#B0A8B8] shrink-0">–</span>
                  <Input
                    type="number"
                    min={18}
                    max={70}
                    placeholder="35"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    className="h-10 rounded-md border-[#E4DDD3] bg-white text-sm focus-visible:ring-1 focus-visible:ring-[#24103F]/20 focus-visible:border-[#24103F] shadow-xs"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#24103F]">
                  {lang === "te" ? "ప్రాంతం" : "Location"}
                </Label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-[#E4DDD3] bg-white px-3 text-sm text-[#242024] focus:border-[#24103F] focus:outline-none focus:ring-1 focus:ring-[#24103F]/20 shadow-xs"
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
                className="h-10 w-full rounded-md bg-[#24103F] text-sm font-semibold text-white hover:bg-[#311552] transition-all shadow-[0_2px_8px_rgba(36,16,63,0.18)] active:translate-y-px"
              >
                <Search className="mr-2 h-4 w-4 text-[#D1A329]" />
                {lang === "te" ? "మ్యాచ్‌లు కనుగొనండి" : "Find Matches"}
              </Button>
            </form>

            <div className="mt-4 flex items-center justify-between text-xs text-[#6B6570]">
              <Link
                to="/search"
                className="hover:text-[#24103F] transition-colors inline-flex items-center gap-1 font-medium"
              >
                {lang === "te" ? "అదనపు ఫిల్టర్లు (గోత్రం, నక్షత్రం, విద్య) →" : "Advanced filters (Gothram, Star, Education) →"}
              </Link>
              <span className="hidden sm:inline text-[#D1A329]/60 text-[10px]">100% Confidential &amp; Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS — Handcrafted, engraved step numbers */}
      <section id="how-it-works" className="surface-silk border-b border-[#E4DDD3]">
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
            ].map((step, i) => (
              <div key={step.num} className="flex flex-col">
                {/* Engraved gold numeral on warm surface */}
                <div className="mb-5 flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, #fdfcf9 0%, #f0ece2 100%)",
                      border: "1px solid rgba(209,163,41,0.25)",
                      boxShadow: "0 1px 0 rgba(255,255,255,0.9), 0 2px 6px rgba(36,16,63,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
                    }}
                  >
                    <span className="font-serif text-lg font-semibold text-[#D1A329]">{step.num}</span>
                  </div>
                  {/* Horizontal line connecting steps on md+ */}
                  {i < 2 && (
                    <div className="hidden md:flex flex-1 items-center mt-6">
                      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(209,163,41,0.3), rgba(228,221,211,0.5))" }} />
                    </div>
                  )}
                </div>
                <h3 className="text-base font-semibold text-[#242024] leading-snug mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-[#6B6570] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROFILES & ALBUM SHOWCASE — Luxury Wedding Album Composition */}
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
            <div className="space-y-12">
              {/* Luxury Wedding Album 3D Composition: 1 large featured + 2 companion profiles sitting on distinct depth planes */}
              {recent.data.length >= 3 && recent.data[0] && (() => {
                const featured = recent.data[0];
                return (
                  <div
                    className="rounded-2xl p-6 sm:p-8 lg:p-10 relative overflow-hidden"
                    style={{
                      background: "linear-gradient(155deg, #FAF8F3 0%, #F5F0E8 50%, #ECE4D6 100%)",
                      border: "1px solid rgba(209,163,41,0.35)",
                      boxShadow:
                        "0 1px 0 rgba(255,255,255,0.95), 0 8px 32px rgba(36,16,63,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                    }}
                  >
                    {/* Subtle gold corner brackets */}
                    <span className="arch-corner arch-corner-tl" style={{ width: 22, height: 22, top: 12, left: 12 }} />
                    <span className="arch-corner arch-corner-tr" style={{ width: 22, height: 22, top: 12, right: 12 }} />

                    {/* Header of the album showcase */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8 pb-4 border-b border-[#D1A329]/25">
                      <div>
                        <span className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[#087333]">
                          {lang === "te" ? "విశిష్ట ప్రొఫైల్ సంకలనం" : "Curated Profiles • Album Showcase"}
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#24103F] mt-0.5">
                          {lang === "te" ? "శెట్టిబలిజ ప్రముఖ మ్యాచ్‌లు" : "Featured Community Matches"}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#D1A329]">
                        <span>◆</span>
                        <span className="font-serif italic text-[#6B6570]">Traditional Matrimony Portfolio</span>
                      </div>
                    </div>

                    {/* Multi-plane depth composition */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      {/* Plane 1: Large Featured Portrait (elevated, primary depth plane) */}
                      <div className="lg:col-span-7">
                        <div
                          className="relative rounded-xl overflow-hidden bg-white p-2.5 transition-all duration-300"
                          style={{
                            boxShadow:
                              "0 2px 4px rgba(36,16,63,0.06), 0 12px 28px rgba(36,16,63,0.12), 0 0 0 1px rgba(209,163,41,0.25)",
                          }}
                        >
                          <ProfileCard
                            profile={featured}
                            shortlisted={actions.shortlistedIds.has(featured.id)}
                            interestSent={actions.sentInterests.has(featured.id)}
                            onShortlist={() => actions.toggleShortlist.mutate(featured.id)}
                            onInterest={() => actions.sendInterest.mutate(featured.id)}
                            className="border-0 shadow-none"
                          />
                        </div>
                      </div>

                    {/* Plane 2: Two Supporting Companion Profiles (nested on secondary depth plane) */}
                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                      {recent.data.slice(1, 3).map((companion) => (
                        <div
                          key={companion.id}
                          className="relative rounded-lg overflow-hidden bg-white p-1.5 transition-all duration-300"
                          style={{
                            boxShadow:
                              "0 1px 3px rgba(36,16,63,0.04), 0 6px 16px rgba(36,16,63,0.08), 0 0 0 1px rgba(209,163,41,0.18)",
                          }}
                        >
                          <ProfileCard
                            profile={companion}
                            shortlisted={actions.shortlistedIds.has(companion.id)}
                            interestSent={actions.sentInterests.has(companion.id)}
                            onShortlist={() => actions.toggleShortlist.mutate(companion.id)}
                            onInterest={() => actions.sendInterest.mutate(companion.id)}
                            className="border-0 shadow-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                );
              })()}

              {/* Remaining Recent Profiles Grid */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E4DDD3]" />
                  <span className="text-xs font-medium text-[#6B6570] uppercase tracking-wider">
                    {lang === "te" ? "మరిన్ని ప్రొఫైల్స్" : "More Recent Profiles"}
                  </span>
                  <div className="h-px flex-1 bg-[#E4DDD3]" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                  {recent.data.slice(recent.data.length >= 3 ? 3 : 0).map((profile) => (
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

      {/* 5. COMMUNITY SECTION — Deep purple surface with ornamental depth */}
      <section className="surface-deep text-white" style={{ background: "linear-gradient(160deg, #1e0c35 0%, #24103F 50%, #1a0b30 100%)" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          {/* Ornamental header rule */}
          <div className="mb-14 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(209,163,41,0.15) 0%, rgba(209,163,41,0.4) 100%)" }} />
            <span className="text-[#D1A329]/50 text-[10px] tracking-[0.3em] uppercase">Shettibalija Sangham</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(209,163,41,0.4) 0%, rgba(209,163,41,0.15) 100%)" }} />
          </div>

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

            {/* Values — typographic list, engraved feel */}
            <div
              className="space-y-8 border-l pl-10 lg:pl-14"
              style={{ borderColor: "rgba(209,163,41,0.2)" }}
            >
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
                <div key={item.title} className="relative pl-5">
                  {/* Gold dot bullet */}
                  <span
                    className="absolute left-0 top-1 w-1.5 h-1.5 rounded-full"
                    style={{ background: "rgba(209,163,41,0.6)", boxShadow: "0 0 4px rgba(209,163,41,0.3)" }}
                  />
                  <p className="text-sm font-semibold text-white/90 mb-1.5">{item.title}</p>
                  <p className="text-sm text-white/55 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom ornament */}
          <div className="mt-16 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(209,163,41,0.15) 0%, rgba(209,163,41,0.4) 100%)" }} />
            <span className="text-[#D1A329]/30 text-[8px]">◆</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(209,163,41,0.4) 0%, rgba(209,163,41,0.15) 100%)" }} />
          </div>
        </div>
      </section>

      {/* 6. MEMBERSHIP — Embossed plaque cards, from database */}
      <section className="surface-silk border-b border-[#E4DDD3]">
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
                    className="relative flex flex-col rounded-md p-6 transition-all duration-200"
                    style={isFeatured ? {
                      background: "linear-gradient(145deg, #fdfcf9 0%, #f5f0e8 100%)",
                      border: "1px solid rgba(209,163,41,0.35)",
                      boxShadow: "0 1px 0 rgba(255,255,255,0.9), 0 4px 16px rgba(36,16,63,0.10), 0 0 0 1px rgba(209,163,41,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
                    } : {
                      background: "#ffffff",
                      border: "1px solid rgba(228,221,211,1)",
                      boxShadow: "0 1px 2px rgba(36,16,63,0.04), 0 4px 8px rgba(36,16,63,0.04)",
                    }}
                  >
                    {/* Inner plaque rule for featured */}
                    {isFeatured && (
                      <div className="absolute inset-3 rounded-sm pointer-events-none" style={{ border: "1px solid rgba(209,163,41,0.15)" }} />
                    )}
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
