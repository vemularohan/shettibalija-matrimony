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
    q: "Can a parent create a profile for their son or daughter?",
    a: "Yes. Registration lets you choose who the profile is for, including a son, daughter, sibling or relative. The candidate can be involved at every step, and the profile can be updated later.",
  },
  {
    q: "Why can I not see contact details immediately?",
    a: "Contact details are protected at the data layer. They are shared according to the member's privacy settings and the platform's access rules, rather than being displayed openly.",
  },
  {
    q: "How do I send interest or shortlist a profile?",
    a: "Sign in, open a profile or use the actions on a profile card. Shortlisting is private to you. An interest is visible to the member concerned and can be accepted or declined.",
  },
  {
    q: "How do I report a profile or a concern?",
    a: "Use the report action on the profile, or write to support with the profile ID and a short description. Our team will review the concern.",
  },
  {
    q: "Can I delete my profile?",
    a: "Write to support from your registered email address and request deletion. We will confirm what will be removed and any records we are required to retain.",
  },
];

function HelpPage() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="sbm-page bg-[#FAF8F3]">
      <header className="border-b border-[#e5ddd1] bg-white">
        <div className="sbm-container py-12 sm:py-16">
          <span className="sbm-kicker">{lang === "te" ? "సహాయ కేంద్రం" : "Help centre"}</span>
          <h1 className="sbm-heading mt-4 max-w-2xl">
            {lang === "te"
              ? "ఒక చిన్న ప్రశ్నకు స్పష్టమైన సమాధానం."
              : "A clear answer, when you need one."}
          </h1>
          <p className="sbm-body mt-5 max-w-2xl">
            {lang === "te"
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
              <section key={topic.title} className="border border-[#ded5c8] bg-white p-6 sm:p-8">
                <Icon className="h-5 w-5 text-[#D1A329]" aria-hidden />
                <h2 className="mt-4 font-serif text-2xl text-[#24103F]">
                  {lang === "te" ? topic.titleTe : topic.title}
                </h2>
                <p className="mt-3 text-[13px] leading-7 text-[#6B6570]">
                  {lang === "te" ? topic.textTe : topic.text}
                </p>
                <Link to={topic.link} className="sbm-link-arrow mt-5">
                  {lang === "te" ? topic.ctaTe : topic.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </section>
            );
          })}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <span className="sbm-kicker">{lang === "te" ? "సాధారణ ప్రశ్నలు" : "Common questions"}</span>
            <h2 className="sbm-heading mt-4 max-w-sm">
              {lang === "te" ? "మరికొన్ని వివరాలు." : "A few more details."}
            </h2>
            <p className="sbm-body mt-4 max-w-sm">
              {lang === "te"
                ? "మీకు సహాయం కావాలంటే, మీ నమోదిత ఇమెయిల్ నుండి మాకు రాయండి."
                : "If you need help with your account, write from your registered email so we can find you quickly."}
            </p>
            <a
              href="mailto:support@shettibalijamatrimony.org"
              className="sbm-link-arrow mt-6"
            >
              support@shettibalijamatrimony.org
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="border-t border-[#ded5c8]">
            {HELP_FAQS.map((item, index) => {
              const isOpen = open === index;
              return (
                <div key={item.q} className="border-b border-[#ded5c8]">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold leading-6 text-[#24103F]">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`mt-1 h-4 w-4 shrink-0 text-[#6B6570] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen ? (
                    <p className="max-w-2xl pb-5 text-[13px] leading-7 text-[#6B6570]">
                      {item.a}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-[#ded5c8] pt-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-2xl text-[#24103F]">
              {lang === "te" ? "మాట్లాడాలనుకుంటున్నారా?" : "Would you rather talk to us?"}
            </h2>
            <p className="mt-1 text-[13px] text-[#6B6570]">
              {lang === "te"
                ? "మా సంప్రదింపు పేజీలో మీ ప్రశ్నను పంపండి."
                : "Send your question through the contact page and our team will respond."}
            </p>
          </div>
          <Link to="/contact" className="sbm-button sbm-button--primary shrink-0">
            {lang === "te" ? "సంప్రదించండి" : "Contact support"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
