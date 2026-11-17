import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
  Camera,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMembership } from "@/hooks/use-member-data";
import { SITE_NAME, SITE_NAME_TE, ONE_TIME_REGISTRATION_FEE_INR } from "@/lib/site";
import { useLanguage } from "@/lib/i18n";
import { MARKETING_COUPLE_IMAGES } from "@/data/marketing-couples";

export const Route = createFileRoute("/membership")({
  component: MembershipPage,
  head: () => ({
    meta: [
      { title: `One-Time Registration Fee | ${SITE_NAME}` },
      {
        name: "description",
        content: `Settibalija Matrimony charges a one-time registration fee of ₹${ONE_TIME_REGISTRATION_FEE_INR}. Pay once. No annual renewal. No recurring charges.`,
      },
    ],
  }),
});

export function MembershipPage() {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const activeMembershipQuery = useActiveMembership();
  const isTe = lang === "te";

  const isAlreadyActive = activeMembershipQuery.data?.status === "active";

  const benefits = [
    {
      titleEn: "Lifetime Matrimonial Profile Publication",
      titleTe: "జీవితకాల ప్రొఫైల్ ప్రచురణ",
      descEn:
        "Your profile remains published in the verified Settibalija directory with no annual subscription renewals or expiration dates.",
      descTe:
        "మీ ప్రొఫైల్ సెట్టిబలిజ సమాజ అన్వేషణలో ఎలాంటి పునరుద్ధరణ ఫీజులు లేకుండా శాశ్వతంగా ప్రదర్శించబడుతుంది.",
    },
    {
      titleEn: "Unlimited Community Profile Discovery",
      titleTe: "అపరిమిత సంబంధాల అన్వేషణ",
      descEn:
        "Search and filter through eligible community brides and grooms across Andhra Pradesh, Telangana, and worldwide.",
      descTe:
        "ఆంధ్రప్రదేశ్, తెలంగాణ మరియు ప్రపంచవ్యాప్తంగా ఉన్న సెట్టిబలిజ వధూవరుల వివరాలను వెతకండి.",
    },
    {
      titleEn: "Send & Receive Introduction Interests",
      titleTe: "ఆసక్తులు పంపడం & స్వీకరించడం",
      descEn:
        "Express serious interest in profiles that match your values and receive responses directly from prospective families.",
      descTe: "మీ కుటుంబ విలువలకు సరిపోయే ప్రొఫైల్స్‌కు గౌరవప్రదమైన ఆసక్తులను పంపండి.",
    },
    {
      titleEn: "Direct Family Contact Requests",
      titleTe: "ప్రత్యక్ష కుటుంబ పరిచయాలు",
      descEn:
        "Exchange verified phone numbers and contact details securely once both sides agree to move forward.",
      descTe: "ఇరువైపులా పరస్పర అంగీకారం లభించిన తర్వాత ఫోన్ నంబర్లు మరియు వివరాలను పంచుకోండి.",
    },
    {
      titleEn: "Verified Member Photo & Horoscope Access",
      titleTe: "ఫోటోలు & జాతక పత్రాల యాక్సెస్",
      descEn:
        "Full access to photos and astrological details for profiles that allow member photo visibility.",
      descTe: "ధృవీకరించబడిన సభ్యుల ఫోటోలు మరియు జాతక వివరాలను భద్రంగా పరిశీలించండి.",
    },
    {
      titleEn: "Community Office Verification & Support",
      titleTe: "సమాజ కార్యాలయ మద్దతు",
      descEn:
        "Manual profile review and phone-based assistance from our community coordinator desk.",
      descTe:
        "మాన్యువల్ ప్రొఫైల్ సమీక్ష మరియు ఫోన్ ద్వారా మార్గదర్శకత్వం మా కార్యాలయం నుండి అందుబాటులో ఉంటాయి.",
    },
  ];

  return (
    <div className="sbm-page bg-[#FAF8F3]">
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-[#24103F] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#D1A329]/20" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-[#D1A329]/10" />
        </div>
        <div className="sbm-container relative py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <span className="sbm-kicker sbm-kicker--light">
                {isTe ? "సభ్యత్వ రిజిస్ట్రేషన్" : "Community Membership"}
              </span>
              <h1 className="sbm-display sbm-display--light sbm-display--member mt-5 max-w-2xl">
                {isTe ? (
                  <>
                    ఒకేసారి రిజిస్ట్రేషన్ రుసుము.
                    <br />
                    <em>జీవితకాల సభ్యత్వం.</em>
                  </>
                ) : (
                  <>
                    One-Time Registration Fee.
                    <br />
                    <em>Lifetime Membership.</em>
                  </>
                )}
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/80">
                {isTe
                  ? `సెట్టిబలిజ మ్యాట్రిమోనీ ప్రతి సభ్యుడి నుండి ఒకేసారి ₹${ONE_TIME_REGISTRATION_FEE_INR} రిజిస్ట్రేషన్ రుసుము మాత్రమే తీసుకుంటుంది. ఇది వార్షిక చందా కాదు, ప్రతి నెలా చెల్లించేది కాదు. ఒక్కసారి చెల్లించండి — మీ దాంపత్య ప్రయాణం పూర్తయ్యే వరకు ఉపయోగించుకోండి.`
                  : `Settibalija Matrimony charges every member a simple, one-time registration fee of ₹${ONE_TIME_REGISTRATION_FEE_INR}. This is not an annual subscription or a recurring fee. Pay once to activate your community matrimonial membership.`}
              </p>
            </div>

            <div className="border-t border-white/15 pt-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#D1A329]" aria-hidden />
                <p className="text-[12px] leading-6 text-white/70">
                  {isTe
                    ? "చెల్లింపులు Razorpay ద్వారా భద్రంగా నిర్వహించబడతాయి. ధృవీకరించబడిన తర్వాత మాత్రమే సభ్యత్వం యాక్టివేట్ అవుతుంది."
                    : "Payments are processed securely via encrypted gateway. Membership activates immediately upon verified server confirmation."}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-white/50">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3 w-3" aria-hidden />
                  {isTe ? "సురక్షిత చెల్లింపు" : "256-bit Secure Checkout"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard className="h-3 w-3" aria-hidden />
                  {isTe ? "భారతీయ రూపాయలు (INR)" : "INR Currency (₹)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="sbm-container pb-20 pt-10 sm:pt-14">
        {/* Active Membership Banner for already-paid users */}
        {isAlreadyActive ? (
          <div className="mb-10 flex flex-col justify-between gap-4 border border-[#087333]/30 bg-[#eef5f0] p-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#087333]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#087333]">
                  {isTe ? "సభ్యత్వ స్థితి" : "Membership Status"}
                </p>
              </div>
              <p className="mt-1 font-serif text-2xl text-[#24103F]">
                {isTe ? "మీ సభ్యత్వం యాక్టివ్‌గా ఉంది" : "Your Membership is Active"}
              </p>
              <p className="mt-1 text-xs text-[#6B6570]">
                {isTe
                  ? "మీరు ఒకేసారి రిజిస్ట్రేషన్ రుసుము చెల్లించారు. అదనపు రుసుము చెల్లించాల్సిన అవసరం లేదు."
                  : "You have completed your one-time registration fee payment. Your lifetime membership is active."}
              </p>
            </div>
            <Link to="/dashboard" className="sbm-button sbm-button--primary shrink-0">
              {isTe ? "డ్యాష్‌బోర్డ్‌కు వెళ్లండి" : "Go to Member Dashboard"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}

        {/* The One-Time ₹999 Registration Plan Card */}
        <section className="overflow-hidden border border-[#ded5c8] bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.3fr_0.9fr]">
            {/* Left: Fee & Highlights */}
            <div className="p-6 sm:p-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a37d1c]">
                  {SITE_NAME}
                </span>
                <span className="rounded bg-[#087333]/10 px-2.5 py-1 text-[11px] font-bold text-[#087333]">
                  {isTe ? "జీవితకాల చెల్లుబాటు" : "Lifetime Access"}
                </span>
              </div>

              <h2 className="mt-3 font-serif text-3xl font-bold text-[#24103F] sm:text-4xl">
                {isTe ? "ఒకేసారి రిజిస్ట్రేషన్ రుసుము" : "One-Time Registration Fee"}
              </h2>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-serif text-5xl font-bold text-[#24103F]">
                  ₹{ONE_TIME_REGISTRATION_FEE_INR}
                </span>
                <span className="text-xs font-semibold text-[#6B6570]">
                  {isTe ? "/ ఒకేసారి చెల్లింపు" : "/ one-time payment"}
                </span>
              </div>

              <p className="mt-3 text-xs leading-6 text-[#6B6570]">
                {isTe
                  ? "వార్షిక చందాలు లేవు. ప్రతి 3 నెలలకు రెన్యువల్ ఛార్జీలు లేవు. ఒక్కసారి చెల్లించి మా సమాజ వధూవరుల పరిచయ వేదికలో సభ్యత్వం పొందండి."
                  : "No quarterly subscriptions. No annual renewal demands. A single transparent registration fee that covers your complete matrimonial journey."}
              </p>

              {/* Benefits Checklist */}
              <div className="mt-8 border-t border-[#ded5c8] pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#24103F]">
                  {isTe ? "సభ్యత్వ ప్రయోజనాలు:" : "Included Membership Benefits:"}
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#087333]" />
                      <div>
                        <p className="text-xs font-bold text-[#24103F]">
                          {isTe ? benefit.titleTe : benefit.titleEn}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-5 text-[#6B6570]">
                          {isTe ? benefit.descTe : benefit.descEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Payment Call to Action */}
            <div className="flex flex-col justify-between border-t border-[#ded5c8] bg-[#FAF8F3] p-6 sm:p-10 lg:border-l lg:border-t-0">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6570]">
                  {isTe ? "చెల్లింపు సారాంశం" : "Pricing Summary"}
                </span>
                <div className="mt-4 space-y-3 rounded border border-[#ded5c8] bg-white p-5 text-xs">
                  <div className="flex justify-between text-[#6B6570]">
                    <span>{isTe ? "రిజిస్ట్రేషన్ ఫీజు" : "Registration Fee"}</span>
                    <span>₹{ONE_TIME_REGISTRATION_FEE_INR}.00</span>
                  </div>
                  <div className="flex justify-between text-[#6B6570]">
                    <span>{isTe ? "పునరుద్ధరణ ఫీజు" : "Renewal Fee"}</span>
                    <span className="font-semibold text-[#087333]">₹0 (None)</span>
                  </div>
                  <div className="border-t border-[#ded5c8] pt-3 flex justify-between text-sm font-bold text-[#24103F]">
                    <span>{isTe ? "మొత్తం" : "Total"}</span>
                    <span className="text-base text-[#24103F]">
                      ₹{ONE_TIME_REGISTRATION_FEE_INR}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-[11px] leading-5 text-[#6B6570]">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#087333]" />
                    <span>
                      {isTe ? "దాచిన ఛార్జీలు లేవు" : "No hidden charges or per-match fees"}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#087333]" />
                    <span>
                      {isTe ? "నేరుగా కుటుంబ పరిచయాలు" : "Direct family contact requests"}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#087333]" />
                    <span>
                      {isTe ? "సమాజ ఆమోదం పొందిన వేదిక" : "Dedicated Settibalija platform"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-8">
                {isAlreadyActive ? (
                  <Link
                    to="/dashboard"
                    className="sbm-button sbm-button--primary w-full text-center"
                  >
                    {isTe ? "డ్యాష్‌బోర్డ్‌కు వెళ్లండి" : "Go to Member Dashboard"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : user ? (
                  <Link
                    to="/payment"
                    className="sbm-button sbm-button--primary w-full text-center text-sm py-3.5"
                  >
                    <span>
                      {isTe
                        ? `₹${ONE_TIME_REGISTRATION_FEE_INR} చెల్లించండి`
                        : `Pay ₹${ONE_TIME_REGISTRATION_FEE_INR} & Activate Membership`}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    search={{ returnTo: "/payment" }}
                    className="sbm-button sbm-button--primary w-full text-center text-sm py-3.5"
                  >
                    <span>
                      {isTe
                        ? `రిజిస్టర్ చేసుకోండి (₹${ONE_TIME_REGISTRATION_FEE_INR})`
                        : `Register Now (₹${ONE_TIME_REGISTRATION_FEE_INR})`}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}

                <p className="mt-3 text-center text-[11px] text-[#6B6570]">
                  <Link to="/refund" className="underline hover:text-[#24103F]">
                    {isTe ? "రీఫండ్ విధానం" : "Refund Policy"}
                  </Link>
                  {" • "}
                  <Link to="/terms" className="underline hover:text-[#24103F]">
                    {isTe ? "నిబంధనలు" : "Terms"}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison: Why Settibalija Matrimony is Different */}
        <section className="mt-14">
          <div className="text-center">
            <span className="sbm-kicker justify-center">
              {isTe ? "సమాజానికి ప్రాధాన్యత" : "A Community First Approach"}
            </span>
            <h2 className="sbm-heading mt-3 text-2xl sm:text-3xl">
              {isTe
                ? "వాణిజ్య వెబ్‌సైట్‌లు vs సెట్టిబలిజ మ్యాట్రిమోనీ"
                : "Commercial Portals vs Settibalija Matrimony"}
            </h2>
          </div>

          <div className="mt-8 overflow-hidden border border-[#ded5c8] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#ded5c8] bg-[#FAF8F3]">
                    <th className="p-4 font-bold text-[#24103F]">
                      {isTe ? "లక్షణం / ఫీచర్" : "Feature / Policy"}
                    </th>
                    <th className="p-4 font-bold text-[#6B6570]">
                      {isTe ? "ఇతర వాణిజ్య పోర్టల్స్" : "Commercial Portals"}
                    </th>
                    <th className="p-4 font-bold text-[#087333] bg-[#087333]/5">{SITE_NAME}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ded5c8]">
                  <tr>
                    <td className="p-4 font-semibold text-[#24103F]">
                      {isTe ? "సభ్యత్వ రుసుము విధానం" : "Membership Fee Structure"}
                    </td>
                    <td className="p-4 text-[#6B6570]">₹3,500 – ₹10,000 ప్రతి 3 నెలలకు</td>
                    <td className="p-4 font-bold text-[#087333] bg-[#087333]/5">
                      ₹{ONE_TIME_REGISTRATION_FEE_INR} ఒకేసారి (జీవితకాలం)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#24103F]">
                      {isTe ? "పునరుద్ధరణ ఛార్జీలు" : "Renewal / Recurring Charges"}
                    </td>
                    <td className="p-4 text-[#6B6570]">పునరావృత చందా / ఆటో-రెన్యువల్</td>
                    <td className="p-4 font-bold text-[#087333] bg-[#087333]/5">
                      సున్నా (పునరుద్ధరణ లేదు)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#24103F]">
                      {isTe ? "సమాజ ప్రత్యేకత" : "Community Focus"}
                    </td>
                    <td className="p-4 text-[#6B6570]">సాధారణ వ్యాపార వేదిక</td>
                    <td className="p-4 font-bold text-[#087333] bg-[#087333]/5">
                      100% సెట్టిబలిజ కుటుంబాలకు మాత్రమే
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#24103F]">
                      {isTe ? "సంప్రదింపు వివరాల మార్పిడి" : "Contact Exchange"}
                    </td>
                    <td className="p-4 text-[#6B6570]">పరిమిత కాంటాక్ట్ క్రెడిట్స్</td>
                    <td className="p-4 font-bold text-[#087333] bg-[#087333]/5">
                      పరస్పర ఆమోదంతో అపరిమిత సంప్రదింపులు
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Emotional couple banner */}
        <div className="mt-14 overflow-hidden rounded-xs border border-[#ded5c8] bg-[#FAF8F3]">
          <div className="grid items-center md:grid-cols-[0.8fr_1.2fr]">
            <div className="relative aspect-[16/10] md:aspect-auto md:h-full overflow-hidden bg-[#efe9df]">
              <img
                src={MARKETING_COUPLE_IMAGES["celebrationJourney"]!.src}
                alt={
                  isTe
                    ? MARKETING_COUPLE_IMAGES["celebrationJourney"]!.altTe
                    : MARKETING_COUPLE_IMAGES["celebrationJourney"]!.alt
                }
                className="h-full w-full object-cover object-[center_20%]"
                decoding="async"
              />
            </div>
            <div className="p-6 sm:p-8">
              <span className="sbm-kicker">
                {isTe ? "దాంపత్య లక్ష్యం" : "The Journey's Promise"}
              </span>
              <h3 className="sbm-heading mt-3 text-2xl">
                {isTe
                  ? "గౌరవప్రదమైన అన్వేషణ. ఆనందకరమైన దాంపత్యం."
                  : "A considered search. A joyful lifelong companionship."}
              </h3>
              <p className="sbm-body mt-3 text-[13px] leading-6">
                {isTe
                  ? "సభ్యత్వం అనేది సంభాషణను గౌరవంగా ముందుకు తీసుకెళ్లడానికి ఒక సహాయక సాధనం మాత్రమే. మీ జీవిత భాగస్వామి అన్వేషణలో ప్రతి అడుగు మన సమాజ విలువల ఆధారంగా సాగుతుంది."
                  : "Every feature protects your dignity while helping you find your partner within the Settibalija community. Pay the one-time registration fee to start your journey."}
              </p>
              <div className="mt-5">
                <Link to={user ? "/payment" : "/register"} className="sbm-link-arrow">
                  {isTe
                    ? `రిజిస్ట్రేషన్ ప్రారంభించండి (₹${ONE_TIME_REGISTRATION_FEE_INR})`
                    : `Start Registration (₹${ONE_TIME_REGISTRATION_FEE_INR})`}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
