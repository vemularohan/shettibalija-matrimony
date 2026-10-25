import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ChevronDown, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/help")({
  component: HelpPage,
  head: () => ({
    meta: [
      { title: `Help Centre | ${SITE_NAME}` },
      {
        name: "description",
        content:
          "Answers about creating a profile, privacy, membership and safety on Shettibalija Matrimony.",
      },
    ],
  }),
});

const HELP_TOPICS = [
  {
    icon: UserRound,
    title: "Creating a profile",
    titleTe: "ప్రొఫైల్ సృష్టించడం",
    text: "Choose who the profile is for, add the details your family is comfortable sharing, and complete the sections that matter. You can save your progress and return later.",
    textTe:
      "ప్రొఫైల్ ఎవరి కోసమో ఎంచుకోండి, మీ కుటుంబం పంచుకోవడానికి సిద్ధంగా ఉన్న వివరాలను జోడించండి. మీ పురోగతిని సేవ్ చేసి తర్వాత కొనసాగించవచ్చు.",
    link: "/register",
    cta: "Create a profile",
    ctaTe: "ప్రొఫైల్ సృష్టించండి",
  },
  {
    icon: Lock,
    title: "Privacy and contact details",
    titleTe: "గోప్యత మరియు సంప్రదింపు వివరాలు",
    text: "Contact details and horoscope documents are not shown on the public website. Photos and contact information are governed by each member's privacy settings and the platform's access rules.",
    textTe:
      "సంప్రదింపు వివరాలు మరియు జాతక పత్రాలు పబ్లిక్ వెబ్‌సైట్‌లో కనిపించవు. ఫోటోలు మరియు సంప్రదింపు సమాచారం సభ్యుల గోప్యతా సెట్టింగ్‌లు మరియు వేదిక యాక్సెస్ నియమాల ప్రకారం ఉంటాయి.",
    link: "/dashboard/privacy",
    cta: "Privacy settings",
    ctaTe: "గోప్యతా సెట్టింగ్‌లు",
  },
  {
    icon: ShieldCheck,
    title: "Review and safety",
    titleTe: "సమీక్ష మరియు భద్రత",
    text: "Profiles are reviewed by administrators before appearing in discovery. This is a review for completeness and community fit, not an identity verification. Always speak with the family and make your own enquiries.",
    textTe:
      "ప్రొఫైల్స్ అన్వేషణలో కనిపించే ముందు నిర్వాహకులు సమీక్షిస్తారు. ఇది పూర్తితనం మరియు సమాజ అనుకూలత కోసం చేసే సమీక్ష, గుర్తింపు ధృవీకరణ కాదు. కుటుంబంతో మాట్లాడి మీ స్వంత విచారణలు చేయండి.",
    link: "/terms",
    cta: "Read the terms",
    ctaTe: "నిబంధనలు చదవండి",
  },
  {
    icon: Mail,
    title: "Membership and payments",
    titleTe: "సభ్యత్వం మరియు చెల్లింపులు",
    text: "Current plans and their benefits are listed on the membership page. If a payment or plan change needs attention, contact support with your registered email and any payment reference.",
    textTe:
      "ప్రస్తుత ప్రణాళికలు మరియు వాటి ప్రయోజనాలు సభ్యత్వ పేజీలో ఉన్నాయి. చెల్లింపు లేదా ప్లాన్ మార్పు గురించి సహాయం కావాలంటే, మీ నమోదిత ఇమెయిల్ మరియు చెల్లింపు సూచనతో సంప్రదించండి.",
    link: "/membership",
    cta: "View membership",
    ctaTe: "సభ్యత్వం చూడండి",
  },
];

const HELP_FAQS = [
  {
    id: "registration",
    q: "How does registration work?",
    qTe: "రిజిస్ట్రేషన్ ఎలా పనిచేస్తుంది?",
    a: "Registration is free and multi-step. You choose who the profile is for (myself, son, daughter, brother, sister, relative), fill in basic education and family details, and upload photos. You can save your draft and finish whenever you want.",
    aTe: "నమోదు ఉచితం మరియు దశలవారీగా ఉంటుంది. ప్రొఫైల్ ఎవరి కోసం (స్వంతంగా, కుమారుడు, కుమార్తె, సోదరుడు, సోదరి, బంధువు) ఎంచుకుని, విద్య, కుటుంబ వివరాలు జోడించి ఫోటోలను అప్‌లోడ్ చేయవచ్చు. డ్రాఫ్ట్‌ను సేవ్ చేసి తర్వాత పూర్తి చేసుకోవచ్చు.",
  },
  {
    id: "profile-review",
    q: "How does profile review work?",
    qTe: "ప్రొఫైల్ సమీక్ష ప్రక్రియ ఎలా జరుగుతుంది?",
    a: "Every new profile and major update goes to the community moderation queue. Administrators check for completeness, respectful language, and accurate Shettibalija community details before approving it to appear in member discovery.",
    aTe: "ప్రతి కొత్త ప్రొఫైల్ మరియు ముఖ్యమైన మార్పు సమాజ నిర్వాహకుల పరిశీలనకు వెళ్తుంది. వివరాల సమగ్రత, సరైన భాష మరియు శెట్టిబలిజ సమాజ నిబంధనలను నిర్ధారించిన తర్వాత మాత్రమే అన్వేషణలో ప్రదర్శించబడుతుంది.",
  },
  {
    id: "contact-privacy",
    q: "Who can see my contact information?",
    qTe: "నా సంప్రదింపు వివరాలు ఎవరికి కనిపిస్తాయి?",
    a: "Your phone number and email are never displayed publicly. They are protected at the database layer with Row Level Security. Only logged-in members with accepted mutual interests or authorized permissions can request contact details.",
    aTe: "మీ మొబైల్ నంబర్ మరియు ఇమెయిల్ బహిరంగంగా కనిపించవు. అవి డేటాబేస్ స్థాయిలో రక్షించబడతాయి. పరస్పర ఆసక్తిని అంగీకరించిన సభ్యులు లేదా అనుమతి ఉన్న సభ్యులు మాత్రమే సంప్రదింపు వివరాలను చూడగలరు.",
  },
  {
    id: "send-interest",
    q: "How do I send and manage interests?",
    qTe: "ఆసక్తిని (Interest) ఎలా పంపాలి మరియు నిర్వహించాలి?",
    a: "When you find a prospective alliance, click 'Send Interest'. The recipient gets an instant notification. In your Dashboard under 'Interests', you can track pending, accepted, declined, or withdraw a pending interest at any time.",
    aTe: "మీకు సరిపోయే ప్రొఫైల్ కనిపించినప్పుడు 'Send Interest' పై క్లిక్ చేయండి. ఎదుటి సభ్యునికి నోటిఫికేషన్ వెళ్తుంది. మీ డాష్‌బోర్డ్‌లోని 'Interests' విభాగంలో పెండింగ్, ఆమోదించబడిన లేదా తిరస్కరించబడిన ఆసక్తులను చూడవచ్చు మరియు పెండింగ్ ఆసక్తిని ఉపసంహరించుకోవచ్చు.",
  },
  {
    id: "matching",
    q: "How does matching work?",
    qTe: "మ్యాచ్‌లు (Matches) ఎలా ఏర్పడతాయి?",
    a: "A match is established when an interest you sent is accepted by another member, or when you accept an interest received from another family. Matches appear in your Matches workspace so families can discuss next steps respectfully.",
    aTe: "మీరు పంపిన ఆసక్తిని ఎదుటి సభ్యుడు అంగీకరించినప్పుడు, లేదా వారు పంపిన ఆసక్తిని మీరు ఆమోదించినప్పుడు అధికారిక 'మ్యాచ్' ఏర్పడుతుంది. ఇది మీ డాష్‌బోర్డ్‌లో కనిపిస్తుంది.",
  },
  {
    id: "reporting",
    q: "How do I report an incorrect or suspicious profile?",
    qTe: "సరికాని లేదా అనుమానాస్పద ప్రొఫైల్‌ను ఎలా నివేదించాలి?",
    a: "On any profile page, click 'Report this profile'. Select the reason (fake profile, harassment, incorrect information) and submit. All reports are confidential and reviewed immediately by our Trust & Safety administrators.",
    aTe: "ఏ ప్రొఫైల్ పేజీలోనైనా 'Report this profile' పై క్లిక్ చేయండి. తగిన కారణాన్ని ఎంచుకుని సమర్పించండి. ఈ నివేదికలు గోప్యంగా ఉంచబడి మా భద్రతా నిర్వాహకులచే వెంటనే సమీక్షించబడతాయి.",
  },
  {
    id: "blocking",
    q: "How does blocking work?",
    qTe: "బ్లాకింగ్ (Blocking) ఎలా పనిచేస్తుంది?",
    a: "When you block a profile, database constraints immediately prevent that member from sending you interests, viewing your updates, or connecting with you. The block is enforced at the database level.",
    aTe: "మీరు ఒక ప్రొఫైల్‌ను బ్లాక్ చేసినప్పుడు, ఆ సభ్యుడు మీకు ఆసక్తులు పంపకుండా మరియు మీ సమాచారాన్ని చూడకుండా డేటాబేస్ స్థాయిలో తక్షణమే నిరోధించబడతారు.",
  },
  {
    id: "membership",
    q: "How does membership work?",
    qTe: "సభ్యత్వం (Membership) ఎలా పనిచేస్తుంది?",
    a: "Every member starts with a Free account allowing full profile creation, photo upload, community search, and receiving interests. Upgraded plans provide extended photo access, priority support, and direct contact options.",
    aTe: "ప్రతి సభ్యుడు ఉచిత ఖాతాతో ప్రారంభించవచ్చు. ఇందులో ప్రొఫైల్ నమోదు, ఫోటోల అప్‌లోడ్, అన్వేషణ మరియు ఆసక్తులు స్వీకరించడం ఉంటాయి. ప్రీమియం ప్లాన్లు అదనపు ఫోటో యాక్సెస్ మరియు ప్రాధాన్యత సహాయాన్ని అందిస్తాయి.",
  },
  {
    id: "payments",
    q: "How do payments work and are they secure?",
    qTe: "చెల్లింపులు ఎలా జరుగుతాయి మరియు అవి ఎంతవరకు సురక్షితం?",
    a: "Online payments are processed through RBI-licensed payment gateways using 256-bit SSL encryption. We never store credit or debit card numbers on our servers. When payments are being configured, honest status indicators are clearly displayed.",
    aTe: "ఆన్‌లైన్ చెల్లింపులు RBI-లైసెన్స్ పొందిన పేమెంట్ గేట్‌వేల ద్వారా అత్యంత సురక్షితంగా నిర్వహించబడతాయి. మీ కార్డు లేదా బ్యాంకింగ్ వివరాలు మా సర్వర్లలో ఎప్పటికీ నిల్వ చేయబడవు.",
  },
  {
    id: "delete-account",
    q: "How can I pause or delete my account?",
    qTe: "నా ఖాతాను తాత్కాలికంగా దాచడం లేదా తొలగించడం ఎలా?",
    a: "In your Dashboard under 'Settings', you can choose 'Pause Profile Visibility' to temporarily hide your profile from search, or 'Delete Profile' to permanently remove your matrimonial records and uploaded photos.",
    aTe: "మీ డాష్‌బోర్డ్‌లోని 'Settings' లో, ప్రొఫైల్‌ను తాత్కాలికంగా దాచడానికి 'Pause Profile' లేదా శాశ్వతంగా తొలగించడానికి 'Delete Profile' ఎంపికలు అందుబాటులో ఉన్నాయి.",
  },
  {
    id: "contact-support",
    q: "How do I contact customer support?",
    qTe: "సహాయక బృందాన్ని ఎలా సంప్రదించాలి?",
    a: "You can submit an inquiry through our Contact page to receive a ticket reference code (e.g. SBM-REQ-XXXX), or email us directly at support@shettibalijamatrimony.org. Our community desk responds within 24–48 hours.",
    aTe: "మీరు మా Contact పేజీ ద్వారా విచారణను సమర్పించి రిఫరెన్స్ కోడ్ పొందవచ్చు, లేదా support@shettibalijamatrimony.org కు నేరుగా ఇమెయిల్ చేయవచ్చు. మా బృందం 24–48 గంటల్లో ప్రతిస్పందిస్తుంది.",
  },
];

function HelpPage() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);
  const isTe = lang === "te";

  return (
    <div className="sbm-page bg-[#FAF8F3]">
      <header className="border-b border-[#e5ddd1] bg-white">
        <div className="sbm-container py-12 sm:py-16">
          <span className="sbm-kicker">{isTe ? "సహాయ కేంద్రం" : "Help centre"}</span>
          <h1 className="sbm-heading mt-4 max-w-2xl">
            {isTe ? "ఒక చిన్న ప్రశ్నకు స్పష్టమైన సమాధానం." : "A clear answer, when you need one."}
          </h1>
          <p className="sbm-body mt-5 max-w-2xl">
            {isTe
              ? "ప్రొఫైల్, గోప్యత, సభ్యత్వం మరియు భద్రత గురించి సాధారణ ప్రశ్నలు. మీకు కావాల్సినది ఇక్కడ లేకపోతే, మాకు రాయండి."
              : "Practical answers about profiles, privacy, membership and safety. If something is still unclear, write to us and a person will read it."}
          </p>
        </div>
      </header>

      <main className="sbm-container pb-20 pt-10 sm:pt-14">
        <div className="grid gap-8 sm:grid-cols-2">
          {HELP_TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <section
                key={topic.title}
                className="border border-[#ded5c8] bg-white p-6 sm:p-8 shadow-xs"
              >
                <Icon className="h-5 w-5 text-[#D1A329]" aria-hidden />
                <h2 className="mt-4 font-serif text-2xl text-[#24103F]">
                  {isTe ? topic.titleTe : topic.title}
                </h2>
                <p className="mt-3 text-[13px] leading-7 text-[#6B6570]">
                  {isTe ? topic.textTe : topic.text}
                </p>
                <Link to={topic.link} className="sbm-link-arrow mt-5">
                  {isTe ? topic.ctaTe : topic.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </section>
            );
          })}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <span className="sbm-kicker">{isTe ? "సాధారణ ప్రశ్నలు" : "Common questions"}</span>
            <h2 className="sbm-heading mt-4 max-w-sm">
              {isTe ? "తరచుగా అడిగే ప్రశ్నలు." : "A few more details."}
            </h2>
            <p className="sbm-body mt-4 max-w-sm">
              {isTe
                ? "మీకు సహాయం కావాలంటే, మీ నమోదిత ఇమెయిల్ నుండి మాకు రాయండి లేదా సంప్రదింపు పేజీని ఉపయోగించండి."
                : "If you need help with your account, write from your registered email so we can assist you quickly."}
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <Link to="/contact" className="sbm-button sbm-button--primary inline-flex">
                {isTe ? "మమ్మల్ని సంప్రదించండి" : "Contact our team"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:support@shettibalijamatrimony.org"
                className="sbm-link-arrow text-[12px]"
              >
                support@shettibalijamatrimony.org
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="border-t border-[#ded5c8]">
            {HELP_FAQS.map((item, index) => {
              const isOpen = open === index;
              return (
                <div key={item.id} className="border-b border-[#ded5c8]">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-[#087333]"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-lg font-medium text-[#24103F]">
                      {isTe ? item.qTe : item.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#D1A329] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                  </button>
                  {isOpen ? (
                    <div className="pb-6 pr-6 text-[13px] leading-7 text-[#6B6570]">
                      {isTe ? item.aTe : item.a}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
