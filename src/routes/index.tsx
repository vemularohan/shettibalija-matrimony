import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import {
  Search,
  ArrowRight,
  Check,
  ShieldCheck,
  Lock,
  SlidersHorizontal,
  Users2,
  ChevronDown,
  Quote,
  Heart,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileCard, type PublicProfileCardData } from "@/components/profiles/profile-card";
import { ErrorState } from "@/components/shared/empty-state";
import { useProfileActions } from "@/hooks/use-profile-actions";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_PROFILES } from "@/data/demo-profiles";
import { HeroPhotoGallery } from "@/components/home/hero-photo-gallery";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { STATES, EDUCATION_OPTIONS, MARITAL_STATUS_OPTIONS } from "@/lib/options";
import { formatINRFromPaise } from "@/lib/format";
import type { Json } from "@/integrations/supabase/types";
import { ShettibalijaLogo } from "@/components/brand/logo";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: `${SITE_NAME} | Find a life partner who shares your values` },
      { name: "description", content: SITE_TAGLINE },
    ],
  }),
});

const SUCCESS_STORIES = [
  {
    id: "story-1",
    couple: "Rajesh & Sravani",
    coupleTe: "రాజేష్ & శ్రావణి",
    location: "Hyderabad & Kakinada",
    locationTe: "హైదరాబాద్ & కాకినాడ",
    marriageYear: "2024",
    image: "/profiles/ranjit.jpg",
    quote:
      "Our families connected through Shettibalija Matrimony. Both of us valued education, culture, and family harmony, and we found our perfect companion here.",
    quoteTe:
      "శెట్టిబలిజ మ్యాట్రిమోనీ ద్వారా మా కుటుంబాలు కలిశాయి. సంప్రదాయాలు మరియు కుటుంబ విలువల పరంగా మాకు ఎంతో సరిపోయే సంబంధం దొరికింది.",
  },
  {
    id: "story-2",
    couple: "Phani Kumar & Divya",
    coupleTe: "ఫణి కుమార్ & దివ్య",
    location: "Visakhapatnam",
    locationTe: "విశాఖపట్నం",
    marriageYear: "2023",
    image: "/profiles/harshita.jpg",
    quote:
      "The verified community platform gave our parents complete peace of mind. Finding a partner with matching values made all the difference.",
    quoteTe:
      "వెరిఫై చేయబడిన ప్రొఫైల్స్ మా తల్లిదండ్రులకు పూర్తి నమ్మకాన్ని ఇచ్చాయి. అనుకూలమైన జీవిత భాగస్వామిని ఎంచుకోవడం చాలా సులువైంది.",
  },
  {
    id: "story-3",
    couple: "Suresh & Madhavi",
    coupleTe: "సురేష్ & మాధవి",
    location: "Rajahmundry & Vijayawada",
    locationTe: "రాజమండ్రి & విజయవాడ",
    marriageYear: "2024",
    image: "/profiles/sravani.jpg",
    quote:
      "From gothram and horoscope compatibility to direct family conversations, everything was smooth, dignified, and authentic.",
    quoteTe:
      "గోత్రం మరియు జాతక సరిపోలిక నుండి కుటుంబ సంప్రదింపుల వరకు ప్రతిదీ ఎంతో గౌరవప్రదంగా మరియు నిష్కపటంగా జరిగింది.",
  },
];

const FAQ_ITEMS = [
  {
    q: "How do I register on Shettibalija Matrimony?",
    qTe: "శెట్టిబలిజ మ్యాట్రిమోనీలో ఎలా రిజిస్టర్ అవ్వాలి?",
    a: "Registration is 100% free. Simply select who the profile is for, provide basic candidate details, and complete your profile with education, occupation, and family details.",
    aTe: "రిజిస్ట్రేషన్ పూర్తిగా ఉచితం. ప్రొఫైల్ ఎవరి కోసమో ఎంచుకుని, అభ్యర్థి వివరాలు నమోదు చేసి సులభంగా మీ ఖాతాను ప్రారంభించవచ్చు.",
  },
  {
    q: "How is personal privacy and contact information protected?",
    qTe: "వ్యక్తిగత గోప్యత మరియు ఫోన్ నంబర్లు ఎలా రక్షించబడతాయి?",
    a: "Your phone number and private documents are never displayed publicly. Contact details are only visible to verified community members according to your privacy settings.",
    aTe: "మీ ఫోన్ నంబర్ మరియు ప్రైవేట్ పత్రాలు పబ్లిక్‌గా ఎప్పుడూ కనిపించవు. మీ అనుమతి మరియు గోప్యతా సెట్టింగ్‌ల ఆధారంగా మాత్రమే ధృవీకరించబడిన సభ్యులకు కనిపిస్తాయి.",
  },
  {
    q: "Can parents create a profile for their son or daughter?",
    qTe: "తల్లిదండ్రులు తమ కుమారుడు లేదా కుమార్తె కోసం ప్రొఫైల్ సృష్టించవచ్చా?",
    a: "Yes, parents and relatives actively create and manage profiles on behalf of candidates. You can select 'Daughter', 'Son', 'Sister', or 'Brother' during registration.",
    aTe: "ఖచ్చితంగా. తల్లిదండ్రులు, సోదరులు లేదా బంధువులు కూడా అభ్యర్థి తరపున ప్రొఫైల్ సృష్టించి సంబంధాలను సంప్రదించవచ్చు.",
  },
  {
    q: "How are community profiles verified?",
    qTe: "కమ్యూనిటీ ప్రొఫైల్స్ ఎలా ధృవీకరించబడతాయి?",
    a: "Each profile undergoes review by Shettibalija Sangham administrators to ensure community authenticity and accurate demographic details.",
    aTe: "శెట్టిబలిజ సమాజ అడ్మిన్‌లు ప్రతి ప్రొఫైల్‌ను సమీక్షించి, సమాజ ప్రామాణికతను నిర్ధారిస్తారు.",
  },
  {
    q: "What benefits does a Membership plan provide?",
    qTe: "సభ్యత్వ ప్రణాళిక (Membership) ద్వారా లభించే ప్రయోజనాలు ఏమిటి?",
    a: "Paid plans unlock verified direct phone contacts, full photo galleries, horoscope viewing, and priority listing in search results.",
    aTe: "ప్రీమియం ప్లాన్స్ ద్వారా వెరిఫై చేసిన ఫోన్ నంబర్లు, పూర్తి ఫోటో గ్యాలరీ, జాతక వివరాలు మరియు శోధనలో ప్రాధాన్యత లభిస్తాయి.",
  },
];

function HomePage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const actions = useProfileActions();

  // Quick match search state
  const [gender, setGender] = useState("");
  const [minAge, setMinAge] = useState("21");
  const [maxAge, setMaxAge] = useState("35");
  const [state, setState] = useState("");
  const [education, setEducation] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  function onQuickSearch(event: FormEvent) {
    event.preventDefault();
    void navigate({
      to: "/search",
      search: {
        gender: gender || undefined,
        minAge: minAge ? Number(minAge) : undefined,
        maxAge: maxAge ? Number(maxAge) : undefined,
        state: state || undefined,
        education: education || undefined,
        maritalStatus: maritalStatus || undefined,
        page: 1,
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
      {/* 1. HERO + REGISTRATION INTERACTION */}
      <HeroPhotoGallery />

      {/* 2. QUICK MATCH SEARCH — Real Matrimonial Search Tool */}
      <section className="bg-white border-b border-[#E4DDD3] shadow-[0_2px_8px_rgba(36,16,63,0.02)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div
            className="rounded-xl p-6 sm:p-8 relative"
            style={{
              background: "linear-gradient(150deg, #FFFFFF 0%, #FAF8F3 100%)",
              border: "1px solid rgba(209,163,41,0.30)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.95), 0 4px 20px rgba(36,16,63,0.05), inset 0 1px 0 rgba(255,255,255,0.85)",
            }}
          >
            {/* Subtle gold corner accents */}
            <span
              className="arch-corner arch-corner-tl"
              style={{ width: 14, height: 14, top: 6, left: 6 }}
            />
            <span
              className="arch-corner arch-corner-tr"
              style={{ width: 14, height: 14, top: 6, right: 6 }}
            />

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E4DDD3] pb-4">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#087333]">
                  {lang === "te" ? "శోధన సాధనం" : "Matrimonial Search"}
                </span>
                <h2 className="mt-0.5 font-serif text-xl sm:text-2xl font-bold text-[#24103F]">
                  {lang === "te" ? "మీకు సరిపోయే మ్యాచ్‌లను కనుగొనండి" : "Find Your Perfect Match"}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B6570]">
                <span className="text-[#D1A329]">◆</span>
                <span>{lang === "te" ? "శెట్టిబలిజ కమ్యూనిటీ శోధన" : "Shettibalija Community Search"}</span>
              </div>
            </div>

            <form onSubmit={onQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 items-end">
              {/* 1. I'm looking for */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">
                  {lang === "te" ? "నేను వెతుకుతున్నది" : "I'm looking for"}
                </Label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#242024] focus:border-[#24103F] focus:outline-none"
                >
                  <option value="">{lang === "te" ? "వధువు లేదా వరుడు" : "Bride or Groom"}</option>
                  <option value="bride">{lang === "te" ? "వధువు (Bride)" : "Bride"}</option>
                  <option value="groom">{lang === "te" ? "వరుడు (Groom)" : "Groom"}</option>
                </select>
              </div>

              {/* 2. Age Range */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">
                  {lang === "te" ? "వయస్సు (Age)" : "Age range"}
                </Label>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min={18}
                    max={70}
                    placeholder="21"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    className="h-9 rounded-md border-[#E4DDD3] bg-white text-xs px-2 text-center"
                  />
                  <span className="text-xs text-[#6B6570] shrink-0">to</span>
                  <Input
                    type="number"
                    min={18}
                    max={70}
                    placeholder="35"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    className="h-9 rounded-md border-[#E4DDD3] bg-white text-xs px-2 text-center"
                  />
                </div>
              </div>

              {/* 3. Location */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">
                  {lang === "te" ? "ప్రాంతం (Location)" : "Location"}
                </Label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#242024] focus:border-[#24103F] focus:outline-none"
                >
                  <option value="">{lang === "te" ? "అన్ని ప్రాంతాలు" : "All Locations"}</option>
                  {STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Education */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">
                  {lang === "te" ? "విద్య (Education)" : "Education"}
                </Label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#242024] focus:border-[#24103F] focus:outline-none"
                >
                  <option value="">{lang === "te" ? "ఏదైనా చదువు" : "Any Education"}</option>
                  {EDUCATION_OPTIONS.slice(0, 7).map((ed) => (
                    <option key={ed} value={ed}>
                      {ed}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Marital Status */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#24103F]">
                  {lang === "te" ? "వైవాహిక స్థితి" : "Marital Status"}
                </Label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-[#E4DDD3] bg-white px-2.5 text-xs text-[#242024] focus:border-[#24103F] focus:outline-none"
                >
                  <option value="">{lang === "te" ? "అన్ని స్థితులు" : "Any Status"}</option>
                  {MARITAL_STATUS_OPTIONS.map((ms) => (
                    <option key={ms.value} value={ms.value}>
                      {lang === "te" ? ms.labelTe : ms.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Submit Button */}
              <div>
                <Button
                  type="submit"
                  className="h-9 w-full rounded-md bg-[#24103F] text-xs font-semibold text-white hover:bg-[#311552] transition-all shadow-xs"
                >
                  <Search className="mr-1.5 h-3.5 w-3.5 text-[#D1A329]" />
                  {lang === "te" ? "శోధించండి" : "Search Profiles"}
                </Button>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-[#E4DDD3]/60 flex flex-wrap items-center justify-between text-xs text-[#6B6570] gap-2">
              <Link
                to="/search"
                className="text-[#087333] hover:text-[#24103F] transition-colors inline-flex items-center gap-1 font-semibold"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {lang === "te"
                  ? "అదనపు శోధన ఎంపికలు (గోత్రం, నక్షత్రం, ఉద్యోగం, జీతం) →"
                  : "More Search Options (Gothram, Star, Occupation, Salary) →"}
              </Link>
              <span className="text-[11px] text-[#B0A8B8]">
                Search by Matrimony ID &amp; Keyword available in Advanced Search
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST SECTION — Why Shettibalija Matrimony? (4 Pillars) */}
      <section className="bg-[#FAF8F3] border-b border-[#E4DDD3] py-14 sm:py-18">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#087333]">
              {lang === "te" ? "విశ్వసనీయత" : "Trust & Authenticity"}
            </span>
            <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-bold text-[#24103F]">
              {lang === "te" ? "ఎందుకు శెట్టిబలిజ మ్యాట్రిమోనీ?" : "Why Shettibalija Matrimony?"}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6B6570]">
              {lang === "te"
                ? "శెట్టిబలిజ కుటుంబాలు విశ్వసించే నిబద్ధత మరియు విలువలతో కూడిన వేదిక."
                : "Created exclusively to help Shettibalija families find meaningful alliances with trust, security, and cultural harmony."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Community Focused */}
            <div className="rounded-xl border border-[#E4DDD3] bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-[#24103F]/5 border border-[#D1A329]/30 flex items-center justify-center mb-4">
                <Users2 className="h-5 w-5 text-[#24103F]" />
              </div>
              <h3 className="font-semibold text-sm text-[#24103F] mb-1.5">
                {lang === "te" ? "కమ్యూనిటీ కేంద్రీకృతం" : "Community Focused"}
              </h3>
              <p className="text-xs text-[#6B6570] leading-relaxed">
                {lang === "te"
                  ? "శెట్టిబలిజ సమాజం కోసం ప్రత్యేకంగా నిర్మించబడింది. గోత్రాలు మరియు సంప్రదాయాలకు ప్రాధాన్యత."
                  : "Created specifically for the Shettibalija community, honoring shared heritage, gothrams, and family traditions."}
              </p>
            </div>

            {/* Pillar 2: Privacy Protected */}
            <div className="rounded-xl border border-[#E4DDD3] bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-[#087333]/10 border border-[#087333]/30 flex items-center justify-center mb-4">
                <Lock className="h-5 w-5 text-[#087333]" />
              </div>
              <h3 className="font-semibold text-sm text-[#24103F] mb-1.5">
                {lang === "te" ? "పూర్తి గోప్యతా రక్షణ" : "Privacy Protected"}
              </h3>
              <p className="text-xs text-[#6B6570] leading-relaxed">
                {lang === "te"
                  ? "మీ వ్యక్తిగత ఫోన్ నంబర్లు మరియు ఫోటోలు సురక్షితంగా ఉంటాయి. అనుమతి లేకుండా బహిర్గతం కావు."
                  : "Your phone number and sensitive details are never publicly revealed. Full control over who views your contacts."}
              </p>
            </div>

            {/* Pillar 3: Meaningful Search */}
            <div className="rounded-xl border border-[#E4DDD3] bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-[#D1A329]/15 border border-[#D1A329]/40 flex items-center justify-center mb-4">
                <SlidersHorizontal className="h-5 w-5 text-[#916E14]" />
              </div>
              <h3 className="font-semibold text-sm text-[#24103F] mb-1.5">
                {lang === "te" ? "అర్థవంతమైన శోధన" : "Meaningful Search"}
              </h3>
              <p className="text-xs text-[#6B6570] leading-relaxed">
                {lang === "te"
                  ? "విద్య, ఉద్యోగం, జాతకం, నక్షత్రం మరియు జీవనశైలి ప్రాధాన్యతల ఆధారంగా ఖచ్చితమైన సరిపోలిక."
                  : "Find matches using granular filters including education, job location, star, rashi, and family background."}
              </p>
            </div>

            {/* Pillar 4: Family Friendly */}
            <div className="rounded-xl border border-[#E4DDD3] bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-[#24103F]/5 border border-[#24103F]/20 flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5 text-[#24103F]" />
              </div>
              <h3 className="font-semibold text-sm text-[#24103F] mb-1.5">
                {lang === "te" ? "కుటుంబ అనుకూల వేదిక" : "Family Friendly"}
              </h3>
              <p className="text-xs text-[#6B6570] leading-relaxed">
                {lang === "te"
                  ? "తల్లిదండ్రులు మరియు కుటుంబాలు నమ్మకంగా ప్రొఫైల్స్ పరిశీలించి సంప్రదించడానికి అనుకూలం."
                  : "Designed for individuals and families searching for suitable matches together in a respectful environment."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED / RECOMMENDED PROFILES */}
      <section className="bg-white border-b border-[#E4DDD3] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 pb-4 border-b border-[#E4DDD3]">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#087333]">
                {lang === "te" ? "తాజా ప్రొఫైల్స్" : "Verified Matches"}
              </span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#24103F]">
                {lang === "te" ? "శెట్టిబలిజ కమ్యూనిటీ మ్యాచ్‌లు" : "Recommended Community Profiles"}
              </h2>
            </div>
            <Button asChild variant="outline" size="sm" className="h-8 border-[#E4DDD3] text-xs">
              <Link to="/search" className="flex items-center gap-1.5">
                {lang === "te" ? "అన్ని ప్రొఫైల్స్ చూడండి" : "View All Profiles"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {recent.isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
              ))}
            </div>
          ) : recent.isError ? (
            <ErrorState onRetry={() => void recent.refetch()} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {recent.data?.map((profile) => (
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
        </div>
      </section>

      {/* 5. HOW IT WORKS — 3 Clear Matrimonial Steps */}
      <section id="how-it-works" className="bg-[#FAF8F3] border-b border-[#E4DDD3] py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#087333]">
              {lang === "te" ? "విధానం" : "Process"}
            </span>
            <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-bold text-[#24103F]">
              {lang === "te" ? "మూడు సరళమైన దశలలో మీ సంబంధం" : "How It Works"}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6B6570]">
              {lang === "te"
                ? "సరళమైన విధానంతో మీ సంప్రదాయాలకు తగిన సంబంధాన్ని ఎంచుకోండి."
                : "Simple, transparent, and respectful process to find your life partner."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: lang === "te" ? "ప్రొఫైల్ సృష్టించండి" : "Create Your Profile",
                desc:
                  lang === "te"
                    ? "ఉచితంగా రిజిస్టర్ అవ్వండి. చదువు, ఉద్యోగం, కుటుంబం మరియు జాతక వివరాలను నమోదు చేయండి."
                    : "Register free in minutes. Add candidate's education, career, family details, and horoscope preferences.",
              },
              {
                num: "02",
                title:
                  lang === "te" ? "అనుకూలమైన మ్యాచ్‌లు చూడండి" : "Discover Meaningful Matches",
                desc:
                  lang === "te"
                    ? "గోత్రం, నక్షత్రం, విద్య మరియు నివాసం ఆధారంగా ధృవీకరించబడిన శెట్టిబలిజ సంబంధాలను శోధించండి."
                    : "Filter verified Shettibalija profiles by gothram, star, education, occupation, and location.",
              },
              {
                num: "03",
                title: lang === "te" ? "కుటుంబాలతో కనెక్ట్ అవ్వండి" : "Begin Your Journey",
                desc:
                  lang === "te"
                    ? "ఆసక్తిని పంపండి. పరస్పర సమ్మతితో నేరుగా కుటుంబాలతో సంప్రదించి వివాహ ప్రయాణాన్ని ప్రారంభించండి."
                    : "Express interest, connect directly with family consent, and take the first step towards a blessed union.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="relative rounded-xl border border-[#E4DDD3] bg-white p-6 shadow-xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-2xl font-bold text-[#D1A329]">{step.num}</span>
                  <div className="h-2 w-2 rounded-full bg-[#087333]" />
                </div>
                <h3 className="text-base font-semibold text-[#24103F] mb-2">{step.title}</h3>
                <p className="text-xs text-[#6B6570] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MEMBERSHIP SECTION — Transparent Plans */}
      <section className="bg-white border-b border-[#E4DDD3] py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#087333]">
              {lang === "te" ? "సభ్యత్వ ప్రణాళికలు" : "Membership"}
            </span>
            <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-bold text-[#24103F]">
              {lang === "te" ? "పారదర్శక సభ్యత్వ ప్రణాళికలు" : "Simple, Transparent Plans"}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6B6570]">
              {lang === "te"
                ? "వెరిఫై చేసిన సంప్రదింపు వివరాలు అన్‌లాక్ చేయండి మరియు నేరుగా కుటుంబాలతో మాట్లాడండి."
                : "Unlock verified phone contacts, view horoscopes, and connect directly with candidate families."}
            </p>
          </div>

          {plans.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : plans.isError ? (
            <ErrorState onRetry={() => void plans.refetch()} />
          ) : plans.data && plans.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    className={`relative flex flex-col rounded-xl p-6 transition-all duration-200 ${
                      isFeatured
                        ? "bg-[#FAF8F3] border-2 border-[#D1A329] shadow-md"
                        : "bg-white border border-[#E4DDD3] shadow-xs"
                    }`}
                  >
                    {isFeatured && (
                      <div className="absolute -top-3 left-6">
                        <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#087333] text-white px-2.5 py-0.5 rounded-full shadow-xs">
                          {lang === "te" ? "సిఫార్సు చేసినది" : "Recommended"}
                        </span>
                      </div>
                    )}

                    <div className="mb-4">
                      <h3 className="font-bold text-[#24103F] text-base">{plan.name}</h3>
                      {plan.description && (
                        <p className="mt-1 text-xs text-[#6B6570]">{plan.description}</p>
                      )}
                    </div>

                    <div className="mb-5 pb-5 border-b border-[#E4DDD3]">
                      <span className="font-serif text-3xl font-bold text-[#24103F]">
                        {isFree ? "Free" : formatINRFromPaise(plan.price_paise)}
                      </span>
                      {plan.duration_days && !isFree && (
                        <span className="ml-2 text-xs text-[#6B6570]">
                          / {plan.duration_days} days
                        </span>
                      )}
                    </div>

                    <ul className="flex-1 space-y-2.5 text-xs mb-6">
                      {benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-[#087333] mt-0.5 shrink-0" />
                          <span className="text-[#4A4550]">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      asChild
                      className={`w-full h-10 rounded-md text-xs sm:text-sm font-semibold transition-colors ${
                        isFeatured
                          ? "bg-[#24103F] text-white hover:bg-[#311552]"
                          : "bg-white border border-[#E4DDD3] text-[#24103F] hover:bg-[#FAF8F3]"
                      }`}
                    >
                      <Link to="/membership">
                        {isFree
                          ? lang === "te"
                            ? "ఉచితంగా చేరండి"
                            : "Join Free"
                          : lang === "te"
                            ? "ఈ ప్లాన్ ఎంచుకోండి"
                            : `Choose ${plan.name}`}
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Fallback default plans */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
              <div className="rounded-xl border border-[#E4DDD3] bg-white p-6 shadow-xs">
                <h3 className="font-bold text-[#24103F]">Basic Free</h3>
                <div className="my-3 pb-3 border-b border-[#E4DDD3]">
                  <span className="font-serif text-3xl font-bold text-[#24103F]">Free</span>
                </div>
                <ul className="space-y-2 text-xs text-[#6B6570] mb-5">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#087333]" /> Browse all verified profiles
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#087333]" /> Create matrimonial profile
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#087333]" /> Send express interest
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full text-xs">
                  <Link to="/register">Join Free</Link>
                </Button>
              </div>

              <div className="rounded-xl border-2 border-[#D1A329] bg-[#FAF8F3] p-6 shadow-md relative">
                <span className="absolute -top-3 left-6 text-[10px] font-semibold uppercase bg-[#087333] text-white px-2.5 py-0.5 rounded-full">
                  Recommended
                </span>
                <h3 className="font-bold text-[#24103F]">Premium Assisted</h3>
                <div className="my-3 pb-3 border-b border-[#E4DDD3]">
                  <span className="font-serif text-3xl font-bold text-[#24103F]">₹1,999</span>
                  <span className="text-xs text-[#6B6570] ml-2">/ 90 days</span>
                </div>
                <ul className="space-y-2 text-xs text-[#6B6570] mb-5">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#087333]" /> 25 Verified Contact Numbers
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#087333]" /> Full Protected Photo Access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#087333]" /> Complete Horoscope Viewing
                  </li>
                </ul>
                <Button asChild className="w-full bg-[#24103F] text-white text-xs">
                  <Link to="/membership">Choose Premium</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. SUCCESS STORIES — Happy Couples (Matrimonial Editorial Style) */}
      <section id="success-stories" className="bg-[#FAF8F3] border-b border-[#E4DDD3] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#087333]">
              {lang === "te" ? "విజయ గాథలు" : "Success Stories"}
            </span>
            <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-bold text-[#24103F]">
              {lang === "te" ? "సంతోషకరమైన జంటలు" : "Happy Couples"}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6B6570]">
              {lang === "te"
                ? "శెట్టిబలిజ మ్యాట్రిమోనీ ద్వారా పరిచయమై ఒక్కటైన కుటుంబాల అనుభవాలు."
                : "Real stories from Shettibalija families who found their perfect match through our platform."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUCCESS_STORIES.map((story) => (
              <div
                key={story.id}
                className="rounded-xl border border-[#E4DDD3] bg-white overflow-hidden shadow-xs hover:shadow-sm transition-shadow flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E4DDD3]">
                  <img
                    src={story.image}
                    alt={story.couple}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2.5 right-2.5 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white backdrop-blur-xs font-medium">
                    Married {story.marriageYear}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#24103F]">
                      {lang === "te" ? story.coupleTe : story.couple}
                    </h3>
                    <p className="text-xs text-[#087333] font-medium mt-0.5">
                      {lang === "te" ? story.locationTe : story.location}
                    </p>
                    <p className="mt-3 text-xs text-[#6B6570] italic leading-relaxed">
                      "{lang === "te" ? story.quoteTe : story.quote}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E4DDD3]/60 flex items-center gap-1.5 text-[11px] text-[#B0A8B8]">
                    <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                    <span>Shettibalija Community Union</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-[#6B6570]">
            <span>Are you a Shettibalija couple who met here? </span>
            <Link to="/contact" className="text-[#24103F] font-semibold underline">
              Share your story with us
            </Link>
          </div>
        </div>
      </section>

      {/* 8. COMMUNITY SECTION — Distinctive Shettibalija Identity */}
      <section className="bg-[#24103F] text-white py-16 sm:py-24 relative overflow-hidden">
        {/* Subtle background ornamentation */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: "radial-gradient(#D1A329 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Logo Crest */}
            <div className="p-2.5 rounded-2xl bg-white/5 border border-[#D1A329]/30 mb-5 shadow-sm">
              <ShettibalijaLogo size="md" theme="dark" linkToHome />
            </div>

            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D1A329]">
              {SITE_NAME}
            </span>

            <h2 className="mt-3 font-serif text-2xl sm:text-4xl font-bold text-white max-w-xl leading-tight">
              {lang === "te"
                ? "శెట్టిబలిజ కమ్యూనిటీ కోసం ప్రత్యేకంగా నిర్మించబడింది"
                : "Built for the Shettibalija Community."}
            </h2>

            <p className="mt-4 text-sm sm:text-base text-white/75 max-w-xl leading-relaxed">
              {lang === "te"
                ? "అర్థవంతమైన సంబంధాలు భాగస్వామ్య విలువలు, కుటుంబం, సంస్కృతి మరియు సంప్రదాయాల నుండి ప్రారంభమవుతాయి."
                : "Meaningful relationships begin with shared values, family, culture and tradition. Rooted in community trust across Andhra Pradesh, Telangana, and worldwide."}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                className="h-10 rounded-md bg-[#087333] px-6 text-xs sm:text-sm font-semibold text-white hover:bg-[#065b28] shadow-sm"
              >
                <Link to="/register">
                  {lang === "te" ? "ఉచితంగా ప్రొఫైల్ సృష్టించండి" : "Register Your Profile"}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-md border-white/30 bg-transparent px-6 text-xs sm:text-sm font-medium text-white hover:bg-white/10 hover:border-white/50"
              >
                <Link to="/about">{lang === "te" ? "సంఘం గురించి" : "About Shettibalija Sangham"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ / HELP SECTION */}
      <section id="faq" className="bg-white border-b border-[#E4DDD3] py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#087333]">
              {lang === "te" ? "సహాయం & మద్దతు" : "Help & Information"}
            </span>
            <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-bold text-[#24103F]">
              {lang === "te" ? "తరచూ అడిగే ప్రశ్నలు (FAQ)" : "Frequently Asked Questions"}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6B6570]">
              {lang === "te"
                ? "శెట్టిబలిజ మ్యాట్రిమోనీ సేవలకు సంబంధించిన ముఖ్యమైన వివరాలు."
                : "Common questions about registration, profile privacy, and matchmaking."}
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-[#E4DDD3] bg-[#FAF8F3] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-medium text-xs sm:text-sm text-[#24103F] hover:bg-[#F2EDE4] transition-colors"
                  >
                    <span>{lang === "te" ? item.qTe : item.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#6B6570] transition-transform duration-200 shrink-0 ml-2 ${
                        isOpen ? "rotate-180 text-[#24103F]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#6B6570] leading-relaxed border-t border-[#E4DDD3]/50">
                      {lang === "te" ? item.aTe : item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center text-xs text-[#6B6570]">
            <span>Have additional questions? </span>
            <Link to="/contact" className="text-[#24103F] font-semibold underline">
              Contact our Support Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function asStringArray(value: Json): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}
