import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  HeartHandshake,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  Users2,
} from "lucide-react";
import { HeroPhotoGallery } from "@/components/home/hero-photo-gallery";
import { ProfileCard, type PublicProfileCardData } from "@/components/profiles/profile-card";
import { useProfileActions } from "@/hooks/use-profile-actions";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { EDUCATION_OPTIONS, MARITAL_STATUS_OPTIONS, STATES } from "@/lib/options";
import { formatINRFromPaise } from "@/lib/format";
import type { Json } from "@/integrations/supabase/types";
import { ShettibalijaLogo } from "@/components/brand/logo";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: `${SITE_NAME} | A life partner. A shared future.` },
      { name: "description", content: SITE_TAGLINE },
    ],
  }),
});

const FAQ_ITEMS = [
  {
    q: "How does registration work?",
    qTe: "రిజిస్ట్రేషన్ ఎలా పనిచేస్తుంది?",
    a: "Creating an account is free. Choose who the profile is for, add the details you are comfortable sharing, and complete the sections that matter to your family. You can return and edit your profile at any time.",
    aTe: "ఖాతా సృష్టించడం ఉచితం. ప్రొఫైల్ ఎవరి కోసమో ఎంచుకుని, మీ కుటుంబానికి ముఖ్యమైన వివరాలను నమోదు చేయండి. తర్వాత ఎప్పుడైనా ప్రొఫైల్‌ను సవరించుకోవచ్చు.",
  },
  {
    q: "Who can see my contact details and horoscope?",
    qTe: "నా సంప్రదింపు వివరాలు, జాతకం ఎవరు చూడగలరు?",
    a: "Contact details and horoscope documents are not shown on the public website. They are governed by your privacy settings and by the access rules of the platform. You decide when to take a conversation forward.",
    aTe: "మీ ఫోన్ నంబర్ మరియు జాతక పత్రాలు పబ్లిక్ వెబ్‌సైట్‌లో కనిపించవు. అవి మీ గోప్యతా సెట్టింగ్‌లు మరియు వేదిక యాక్సెస్ నియమాల ప్రకారం రక్షించబడతాయి.",
  },
  {
    q: "Can parents create a profile for their son or daughter?",
    qTe: "తల్లిదండ్రులు కుమారుడు లేదా కుమార్తె కోసం ప్రొఫైల్ సృష్టించవచ్చా?",
    a: "Yes. Parents, siblings and relatives can create and manage a profile on behalf of the candidate. Registration lets you select who the profile is for, and the candidate can be involved at every step.",
    aTe: "అవును. తల్లిదండ్రులు, సోదరులు మరియు బంధువులు అభ్యర్థి తరపున ప్రొఫైల్ సృష్టించి నిర్వహించవచ్చు. ప్రొఫైల్ ఎవరి కోసమో ఎంచుకునే సౌలభ్యం రిజిస్ట్రేషన్‌లో ఉంది.",
  },
  {
    q: "How are profiles reviewed?",
    qTe: "ప్రొఫైల్స్ ఎలా సమీక్షించబడతాయి?",
    a: "Profiles are reviewed by community administrators before they appear in discovery. This is a review for completeness and community fit, not an identity verification. Please speak with the family and satisfy yourself before making a decision.",
    aTe: "ప్రొఫైల్స్ అన్వేషణలో కనిపించే ముందు సమాజ నిర్వాహకులు వాటిని సమీక్షిస్తారు. ఇది పూర్తితనం మరియు సమాజ అనుకూలత కోసం చేసే సమీక్ష, గుర్తింపు ధృవీకరణ కాదు. నిర్ణయం తీసుకునే ముందు కుటుంబంతో మాట్లాడండి.",
  },
  {
    q: "What does membership include?",
    qTe: "సభ్యత్వంలో ఏమి ఉంటుంది?",
    a: "Membership plans are listed with their current benefits on the membership page. Features differ by plan. You can continue using the free account without choosing a paid plan.",
    aTe: "సభ్యత్వ ప్రణాళికలు మరియు వాటి ప్రయోజనాలు సభ్యత్వ పేజీలో ఉన్నాయి. ప్రతి ప్లాన్‌లో సౌలభ్యాలు భిన్నంగా ఉంటాయి. చెల్లింపు ప్లాన్ ఎంచుకోకుండా ఉచిత ఖాతాను కొనసాగించవచ్చు.",
  },
];

function HomePage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { user } = useAuth();
  const actions = useProfileActions();

  const [gender, setGender] = useState("");
  const [minAge, setMinAge] = useState("21");
  const [maxAge, setMaxAge] = useState("35");
  const [state, setState] = useState("");
  const [education, setEducation] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  function onQuickSearch(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (gender) params.set("gender", gender);
    if (minAge) params.set("minAge", minAge);
    if (maxAge) params.set("maxAge", maxAge);
    if (state) params.set("state", state);
    if (education) params.set("education", education);
    if (maritalStatus) params.set("maritalStatus", maritalStatus);

    if (!user) {
      window.location.assign(`/login?returnTo=${encodeURIComponent(`/search?${params.toString()}`)}`);
      return;
    }

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
    queryKey: ["recent-profiles", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("approved_matrimonial_profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return (data ?? []).filter((profile): profile is typeof profile & { id: string } =>
        Boolean(profile.id),
      ) as PublicProfileCardData[];
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
    <div className="flex w-full flex-col bg-[#FAF8F3]">
      <HeroPhotoGallery />

      {/* BEGIN WITH WHAT MATTERS */}
      <section id="find-your-match" className="border-b border-[#e5ddd1] bg-[#FAF8F3]">
        <div className="sbm-container sbm-section--tight">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.5fr] lg:gap-16">
            <div>
              <span className="sbm-kicker">
                {lang === "te" ? "ఇక్కడ ప్రారంభించండి" : "Begin with what matters"}
              </span>
              <h2 className="sbm-heading mt-4 max-w-sm">
                {lang === "te"
                  ? "కొన్ని వివరాలు చాలు. మిగతాది మీ కుటుంబం చూసుకుంటుంది."
                  : "A few details are enough to begin."}
              </h2>
              <p className="sbm-body mt-4 max-w-sm">
                {lang === "te"
                  ? "మీకు ముఖ్యమైన విలువలను ఎంచుకోండి. మిగిలిన ప్రొఫైల్‌ను ప్రశాంతంగా పూర్తి చేయవచ్చు."
                  : "Search by the things you would actually discuss with your family. Discovery is available to signed-in members."}
              </p>
            </div>

            <form onSubmit={onQuickSearch} className="lg:pt-1">
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="home-looking" className="sbm-label">
                    {lang === "te" ? "నేను వెతుకుతున్నది" : "I am looking for"}
                  </label>
                  <select
                    id="home-looking"
                    className="sbm-field"
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                  >
                    <option value="">{lang === "te" ? "వధువు లేదా వరుడు" : "Bride or groom"}</option>
                    <option value="bride">{lang === "te" ? "వధువు" : "Bride"}</option>
                    <option value="groom">{lang === "te" ? "వరుడు" : "Groom"}</option>
                  </select>
                </div>

                <div>
                  <span className="sbm-label">{lang === "te" ? "వయస్సు" : "Age range"}</span>
                  <div className="flex items-center gap-2">
                    <input
                      aria-label={lang === "te" ? "కనిష్ఠ వయస్సు" : "Minimum age"}
                      type="number"
                      min={18}
                      max={70}
                      className="sbm-field text-center"
                      value={minAge}
                      onChange={(event) => setMinAge(event.target.value)}
                    />
                    <span className="text-xs text-[#6B6570]">to</span>
                    <input
                      aria-label={lang === "te" ? "గరిష్ఠ వయస్సు" : "Maximum age"}
                      type="number"
                      min={18}
                      max={70}
                      className="sbm-field text-center"
                      value={maxAge}
                      onChange={(event) => setMaxAge(event.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="home-location" className="sbm-label">
                    {lang === "te" ? "ప్రాంతం" : "Location"}
                  </label>
                  <select
                    id="home-location"
                    className="sbm-field"
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                  >
                    <option value="">{lang === "te" ? "అన్ని ప్రాంతాలు" : "Anywhere"}</option>
                    {STATES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="home-education" className="sbm-label">
                    {lang === "te" ? "విద్య" : "Education"}
                  </label>
                  <select
                    id="home-education"
                    className="sbm-field"
                    value={education}
                    onChange={(event) => setEducation(event.target.value)}
                  >
                    <option value="">{lang === "te" ? "ఏదైనా" : "Any education"}</option>
                    {EDUCATION_OPTIONS.slice(0, 8).map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="home-marital" className="sbm-label">
                    {lang === "te" ? "వైవాహిక స్థితి" : "Marital status"}
                  </label>
                  <select
                    id="home-marital"
                    className="sbm-field"
                    value={maritalStatus}
                    onChange={(event) => setMaritalStatus(event.target.value)}
                  >
                    <option value="">{lang === "te" ? "అన్ని స్థితులు" : "Any status"}</option>
                    {MARITAL_STATUS_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {lang === "te" ? item.labelTe : item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button type="submit" className="sbm-button sbm-button--primary w-full">
                    <Search className="h-4 w-4" />
                    {lang === "te" ? "అన్వేషించండి" : "Discover profiles"}
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#ded5c8] pt-4">
                <Link to="/search" className="sbm-link-arrow">
                  {lang === "te" ? "అధునాతన శోధన" : "Advanced search"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <span className="text-[11px] leading-5 text-[#6B6570]">
                  {lang === "te"
                    ? "ప్రొఫైల్స్ మరియు సంప్రదింపు వివరాలు సభ్యులకు మాత్రమే."
                    : "Profile discovery and contact details are available to signed-in members."}
                </span>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAMILY-IN-THE-ROOM PRINCIPLES */}
      <section className="border-b border-[#e5ddd1] bg-white">
        <div className="sbm-container sbm-section">
          <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="relative overflow-hidden rounded-sm bg-[#24103F] px-8 py-12 text-white sm:px-12 sm:py-16">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#D1A329]/20" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full border border-[#D1A329]/10" />
              <div className="relative">
                <p className="sbm-kicker sbm-kicker--light">
                  {lang === "te" ? "మన సమాజం" : "The Shettibalija way"}
                </p>
                <p className="sbm-telugu mt-8 text-3xl leading-[1.35] text-[#F5E5B2] sm:text-4xl">
                  మన మూలాలు.
                  <br />
                  మన భవిష్యత్తు.
                </p>
                <p className="mt-8 max-w-sm text-sm leading-7 text-white/70">
                  {lang === "te"
                    ? "పెద్దల ఆశీర్వాదం, కుటుంబాల సమ్మతి, మరియు పరస్పర గౌరవంతో మొదలయ్యే బంధం."
                    : "A marriage is rarely only two people. It is a conversation between families, held with care, patience and respect."}
                </p>
                <div className="mt-10 h-px w-16 bg-[#D1A329]" />
                <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-white/45">
                  {SITE_NAME}
                </p>
              </div>
            </div>

            <div>
              <span className="sbm-kicker">
                {lang === "te" ? "మా విధానం" : "Why families stay"}
              </span>
              <h2 className="sbm-heading mt-4 max-w-lg">
                {lang === "te"
                  ? "ఒక ప్రశాంతమైన పరిచయం. ఒక బాధ్యతాయుతమైన నిర్ణయం."
                  : "Matrimony, with the family in the room."}
              </h2>
              <p className="sbm-body mt-5 max-w-xl">
                {lang === "te"
                  ? "మ్యాట్రిమోనీ అనేది ఫోటోలు మరియు ఫిల్టర్ల చుట్టూ తిరగకూడదు. అది కుటుంబం, విలువలు మరియు భవిష్యత్తు గురించిన సంభాషణ."
                  : "This is not a place for hurried swipes. It is a considered space for the questions families actually ask: values, education, work, roots and the life you hope to build."}
              </p>

              <dl className="mt-10 divide-y divide-[#e5ddd1] border-t border-[#e5ddd1]">
                {[
                  {
                    number: "01",
                    title: lang === "te" ? "సమాజం మొదట" : "Community first",
                    text:
                      lang === "te"
                        ? "శెట్టిబలిజ కుటుంబాలు, గోత్రాలు మరియు సంప్రదాయాలను గౌరవించే వేదిక."
                        : "Built for Shettibalija families, with room for gothram, native place and the traditions that shape a family.",
                  },
                  {
                    number: "02",
                    title: lang === "te" ? "గోప్యత రూపకల్పనలోనే" : "Privacy by design",
                    text:
                      lang === "te"
                        ? "సంప్రదింపు వివరాలు, జాతక పత్రాలు మరియు ఫోటోలు యాక్సెస్ నియమాలతో రక్షించబడతాయి."
                        : "Contact details, horoscope documents and private photos sit behind access rules, not just hidden interface elements.",
                  },
                  {
                    number: "03",
                    title: lang === "te" ? "అర్థవంతమైన శోధన" : "Search with substance",
                    text:
                      lang === "te"
                        ? "విద్య, ఉద్యోగం, ప్రాంతం, నక్షత్రం మరియు కుటుంబ నేపథ్యం ఆధారంగా వెతకండి."
                        : "Filter by education, work, location, star, rashi and family background, not by appearance alone.",
                  },
                  {
                    number: "04",
                    title: lang === "te" ? "కుటుంబ భాగస్వామ్యం" : "Family participation",
                    text:
                      lang === "te"
                        ? "తల్లిదండ్రులు మరియు బంధువులు ప్రొఫైల్‌ను సృష్టించి, పరిచయాలను కలిసి చూడవచ్చు."
                        : "Parents and relatives can create and manage a profile, because the decision is rarely made alone.",
                  },
                ].map((item) => (
                  <div key={item.number} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5 sm:grid-cols-[3.5rem_1fr] sm:gap-6">
                    <span className="font-serif text-xl text-[#D1A329]">{item.number}</span>
                    <div>
                      <dt className="text-sm font-bold text-[#24103F]">{item.title}</dt>
                      <dd className="mt-1.5 text-[13px] leading-6 text-[#6B6570]">{item.text}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-b border-[#e5ddd1] bg-[#FAF8F3]">
        <div className="sbm-container sbm-section">
          <div className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:gap-16">
            <div>
              <span className="sbm-kicker">{lang === "te" ? "ప్రయాణం" : "The journey"}</span>
              <h2 className="sbm-heading mt-4 max-w-xs">
                {lang === "te" ? "మూడు ప్రశాంతమైన అడుగులు." : "Three unhurried steps."}
              </h2>
              <p className="sbm-body mt-4 max-w-xs">
                {lang === "te"
                  ? "మీ వేగంతో ప్రారంభించండి. ఏ దశలోనైనా ఆగి, ఆలోచించి, కుటుంబంతో చర్చించవచ్చు."
                  : "Start at your own pace. You can pause, talk things over, and return whenever you are ready."}
              </p>
            </div>

            <ol className="grid gap-0 divide-y divide-[#ded5c8] border-t border-[#ded5c8] sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:border-t-0">
              {[
                {
                  n: "01",
                  title: lang === "te" ? "మీ ప్రొఫైల్" : "Tell your story",
                  text:
                    lang === "te"
                      ? "పేరు, కుటుంబం, చదువు, ఉద్యోగం మరియు జాతక వివరాలను మీ సౌకర్యంగా జోడించండి."
                      : "Add the details your family would want to understand: background, education, work, family and horoscope.",
                  link: "/register",
                  cta: lang === "te" ? "ప్రారంభించండి" : "Begin",
                },
                {
                  n: "02",
                  title: lang === "te" ? "జాగ్రత్తగా అన్వేషించండి" : "Look with care",
                  text:
                    lang === "te"
                      ? "మీకు ముఖ్యమైన అంశాలతో వెతకండి, షార్ట్‌లిస్ట్ చేయండి మరియు కుటుంబంతో చర్చించండి."
                      : "Use filters that reflect your priorities. Keep a shortlist, compare notes and involve your family.",
                  link: "/search",
                  cta: lang === "te" ? "అన్వేషించండి" : "Discover",
                },
                {
                  n: "03",
                  title: lang === "te" ? "గౌరవంగా కనెక్ట్ అవ్వండి" : "Make contact",
                  text:
                    lang === "te"
                      ? "ఆసక్తిని తెలియజేయండి. పరస్పర సమ్మతితో సంభాషణను కుటుంబాలకు విస్తరించండి."
                      : "Express interest, wait for a response, and take the conversation forward with consent on both sides.",
                  link: "/membership",
                  cta: lang === "te" ? "సభ్యత్వం" : "Membership",
                },
              ].map((step) => (
                <li key={step.n} className="flex flex-col justify-between py-8 sm:px-6 sm:py-0 sm:first:pl-0 sm:last:pr-0">
                  <div>
                    <span className="font-serif text-4xl font-medium text-[#D1A329]">{step.n}</span>
                    <h3 className="mt-6 text-lg font-semibold tracking-tight text-[#24103F]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-6 text-[#6B6570]">{step.text}</p>
                  </div>
                  <Link to={step.link} className="sbm-link-arrow mt-7">
                    {step.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* INSIDE A PROFILE */}
      <section className="border-b border-[#e5ddd1] bg-white">
        <div className="sbm-container sbm-section">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <span className="sbm-kicker">{lang === "te" ? "ప్రొఫైల్ లోపల" : "Inside a profile"}</span>
              <h2 className="sbm-heading mt-4 max-w-md">
                {lang === "te" ? "ఒక ఫోటో కంటే ఎక్కువ." : "More than a photograph."}
              </h2>
              <p className="sbm-body mt-5 max-w-md">
                {lang === "te"
                  ? "ఒక కుటుంబం అడిగే ప్రశ్నలకు స్థలం ఇవ్వండి: మీరు ఎక్కడ నుండి వచ్చారు, ఏమి చదివారు, ఎలా జీవిస్తారు, ఏమి ఆశిస్తున్నారు."
                  : "A matrimonial profile should answer the questions a family actually asks. These are the sections that make a profile useful, not just attractive."}
              </p>
              <div className="mt-8 flex items-start gap-3 border-l-2 border-[#D1A329] pl-4">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#087333]" />
                <p className="text-[12px] leading-6 text-[#6B6570]">
                  {lang === "te"
                    ? "సంప్రదింపు వివరాలు మరియు జాతక పత్రాలు మీ అనుమతి లేకుండా బహిరంగంగా కనిపించవు."
                    : "Contact details and horoscope documents are never placed on the open web. They are shared according to the member's privacy settings."}
                </p>
              </div>
            </div>

            <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {[
                {
                  icon: Users2,
                  title: lang === "te" ? "కుటుంబం & మూలాలు" : "Family & roots",
                  text:
                    lang === "te"
                      ? "తల్లిదండ్రులు, సోదరులు, సొంత ఊరు, గోత్రం మరియు కుటుంబ విలువలు."
                      : "Parents, siblings, native place, gothram and the values a family is rooted in.",
                },
                {
                  icon: BookOpen,
                  title: lang === "te" ? "విద్య & ఉద్యోగం" : "Education & work",
                  text:
                    lang === "te"
                      ? "చదువు, ఉద్యోగం, కార్యాలయ స్థలం మరియు వృత్తిపరమైన ఆశయాలు."
                      : "Qualification, profession, work location and the shape of a working life.",
                },
                {
                  icon: Sparkles,
                  title: lang === "te" ? "జాతకం" : "Horoscope",
                  text:
                    lang === "te"
                      ? "నక్షత్రం, రాశి మరియు జాతక వివరాలు, కుటుంబం కోరినప్పుడు మాత్రమే."
                      : "Star, rashi and horoscope details, available when both families wish to consider them.",
                },
                {
                  icon: HeartHandshake,
                  title: lang === "te" ? "ఆశలు" : "What they hope for",
                  text:
                    lang === "te"
                      ? "భాగస్వామి వయస్సు, విద్య, ప్రాంతం మరియు కుటుంబ అంచనాలు."
                      : "The age, education, location and family expectations a candidate is looking for.",
                },
                {
                  icon: ShieldCheck,
                  title: lang === "te" ? "జీవనశైలి" : "Everyday life",
                  text:
                    lang === "te"
                      ? "ఆహారం, అలవాట్లు మరియు రోజువారీ జీవితంలో ముఖ్యమైన విషయాలు."
                      : "Food, habits and the small, practical details that make daily life together easier.",
                },
                {
                  icon: Lock,
                  title: lang === "te" ? "సంప్రదింపు" : "Contact, with consent",
                  text:
                    lang === "te"
                      ? "మీరు మరియు మీ కుటుంబం సిద్ధమైనప్పుడు మాత్రమే సంభాషణ ప్రారంభమవుతుంది."
                      : "A conversation begins only when you and your family are ready to take it forward.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="border-t border-[#e5ddd1] pt-4">
                    <Icon className="h-4 w-4 text-[#D1A329]" aria-hidden />
                    <dt className="mt-3 text-sm font-bold text-[#24103F]">{item.title}</dt>
                    <dd className="mt-1.5 text-[13px] leading-6 text-[#6B6570]">{item.text}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </section>

      {/* RECENT PROFILES FOR MEMBERS ONLY */}
      {user && recent.data && recent.data.length > 0 ? (
        <section className="border-b border-[#e5ddd1] bg-[#FAF8F3]">
          <div className="sbm-container sbm-section--tight">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="sbm-kicker">{lang === "te" ? "కొత్తగా చేరినవారు" : "Recently joined"}</span>
                <h2 className="sbm-heading mt-3">{lang === "te" ? "సమాజం నుండి కొత్త ప్రొఫైల్స్." : "New profiles from the community."}</h2>
              </div>
              <Link to="/search" className="sbm-link-arrow shrink-0">
                {lang === "te" ? "అందరినీ చూడండి" : "See everyone"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
          </div>
        </section>
      ) : null}

      {/* MEMBERSHIP */}
      {plans.data && plans.data.length > 0 ? (
        <section className="border-b border-[#e5ddd1] bg-white">
          <div className="sbm-container sbm-section">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <span className="sbm-kicker">{lang === "te" ? "సభ్యత్వం" : "Membership"}</span>
                <h2 className="sbm-heading mt-4 max-w-sm">
                  {lang === "te" ? "మీ అన్వేషణకు సహాయపడే ఎంపిక." : "Support for the search, never pressure."}
                </h2>
                <p className="sbm-body mt-5 max-w-sm">
                  {lang === "te"
                    ? "ఉచిత ఖాతాతో ప్రారంభించండి. మీకు ఉపయోగపడితే మాత్రమే చెల్లింపు ప్లాన్ ఎంచుకోండి."
                    : "Start with a free account. Choose a paid plan only if its current benefits are useful to you."}
                </p>
                <Link to="/membership" className="sbm-link-arrow mt-7">
                  {lang === "te" ? "పూర్తి వివరాలు" : "Compare every plan"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-[#e5ddd1] border-y border-[#e5ddd1]">
                {plans.data.slice(0, 3).map((plan) => {
                  const benefits = asStringArray(plan.benefits);
                  const price = (plan.price_paise ?? 0) <= 0 ? "Free" : formatINRFromPaise(plan.price_paise);
                  return (
                    <div key={plan.id} className="grid gap-4 py-6 sm:grid-cols-[1fr_auto] sm:items-start">
                      <div>
                        <h3 className="font-serif text-xl text-[#24103F]">{plan.name}</h3>
                        {plan.description ? (
                          <p className="mt-1 text-[12px] leading-6 text-[#6B6570]">{plan.description}</p>
                        ) : null}
                        {benefits.length > 0 ? (
                          <ul className="mt-3 space-y-1.5">
                            {benefits.slice(0, 3).map((benefit) => (
                              <li key={benefit} className="flex items-start gap-2 text-[12px] leading-5 text-[#5f5765]">
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#087333]" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                      <div className="sm:text-right">
                        <p className="font-serif text-2xl text-[#24103F]">{price}</p>
                        {plan.duration_days ? (
                          <p className="mt-0.5 text-[11px] text-[#6B6570]">for {plan.duration_days} days</p>
                        ) : null}
                        <Link to="/membership" className="sbm-link-arrow mt-3 justify-start sm:justify-end">
                          {lang === "te" ? "వివరాలు" : "Details"}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* COMMUNITY BAND */}
      <section className="sbm-dark-band">
        <div className="sbm-container sbm-section">
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <ShettibalijaLogo size="sm" theme="dark" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D1A329]">
                  {SITE_NAME}
                </span>
              </div>
              <p className="sbm-telugu mt-8 text-4xl leading-[1.3] text-[#F5E5B2] sm:text-5xl">
                మనం కలిసి
                <br />
                మంచి భవిష్యత్తును నిర్మిద్దాం.
              </p>
              <p className="mt-7 max-w-lg text-sm leading-7 text-white/65">
                {lang === "te"
                  ? "శెట్టిబలిజ కుటుంబాల మధ్య గౌరవప్రదమైన పరిచయాలకు ఒక ప్రశాంతమైన స్థలం."
                  : "A considered place for Shettibalija families to meet, talk and begin something lasting."}
              </p>
            </div>
            <div className="lg:pb-2">
              <p className="border-t border-white/15 pt-5 text-[11px] uppercase tracking-[0.16em] text-white/45">
                {lang === "te" ? "మీ ప్రయాణం ఇక్కడ ప్రారంభమవుతుంది" : "Your journey can begin here"}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="sbm-button sbm-button--gold">
                  {lang === "te" ? "ప్రొఫైల్ సృష్టించండి" : "Create your profile"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/about"
                  className="sbm-button border border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/5"
                >
                  {lang === "te" ? "సంఘం గురించి" : "About the Sangham"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-[#FAF8F3]">
        <div className="sbm-container sbm-section">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <span className="sbm-kicker">{lang === "te" ? "ప్రశ్నలు" : "Questions"}</span>
              <h2 className="sbm-heading mt-4 max-w-xs">
                {lang === "te" ? "మీకు తెలుసుకోవాల్సినవి." : "The things worth knowing."}
              </h2>
              <p className="sbm-body mt-4 max-w-xs">
                {lang === "te"
                  ? "మరింత సహాయం కావాలా? మా సహాయ కేంద్రం చూడండి."
                  : "If something is still unclear, the help centre has more detail, or write to us directly."}
              </p>
              <Link to="/help" className="sbm-link-arrow mt-6">
                {lang === "te" ? "సహాయ కేంద్రం" : "Visit the help centre"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="border-t border-[#ded5c8]">
              {FAQ_ITEMS.map((item, index) => {
                const open = openFaq === index;
                return (
                  <div key={item.q} className="border-b border-[#ded5c8]">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : index)}
                      className="flex w-full items-start justify-between gap-6 py-5 text-left"
                      aria-expanded={open}
                    >
                      <span className="text-sm font-semibold leading-6 text-[#24103F]">
                        {lang === "te" ? item.qTe : item.q}
                      </span>
                      <ChevronDown
                        className={`mt-1 h-4 w-4 shrink-0 text-[#6B6570] transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open ? (
                      <p className="max-w-2xl pb-5 text-[13px] leading-7 text-[#6B6570]">
                        {lang === "te" ? item.aTe : item.a}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
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
