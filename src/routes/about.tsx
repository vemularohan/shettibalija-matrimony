import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, Lock, Sparkles, Users } from "lucide-react";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { SITE_NAME, SITE_NAME_TE, COMMUNITY_NAME } from "@/lib/site";
import { useLanguage } from "@/lib/i18n";
import { MARKETING_COUPLE_IMAGES } from "@/data/marketing-couples";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: `About Us | ${SITE_NAME}` },
      {
        name: "description",
        content: `About ${SITE_NAME} — a privacy-first matrimonial space for ${COMMUNITY_NAME} families.`,
      },
    ],
  }),
});

const PRINCIPLES = [
  {
    icon: Users,
    title: "Family is part of the story",
    text: "A profile can be created by the candidate or by a parent, sibling or relative. The people who matter can be involved from the beginning.",
  },
  {
    icon: Lock,
    title: "Privacy is the default",
    text: "Contact details and horoscope documents are not placed on the open web. Photos and contact information follow each member's settings and the platform's access rules.",
  },
  {
    icon: HeartHandshake,
    title: "Introductions, not a marketplace",
    text: "There is no compatibility score and no pressure to decide quickly. A shortlist, an interest and a conversation can each move at a family's own pace.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create a profile",
    text: "Share the details your family is comfortable with. You can save your progress and return later.",
  },
  {
    number: "02",
    title: "A human review",
    text: "Administrators review a profile before it appears in discovery. This is a completeness and community review, not an identity verification.",
  },
  {
    number: "03",
    title: "Begin an introduction",
    text: "Shortlist privately, express interest and decide together when contact details are shared.",
  },
];

function AboutPage() {
  const { lang } = useLanguage();
  const isTe = lang === "te";
  const matureCouple = MARKETING_COUPLE_IMAGES["matureCompanionship"]!;

  return (
    <div className="sbm-page bg-[#FAF8F3]">
      <header className="border-b border-[#e5ddd1] bg-white">
        <div className="sbm-container py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
            <div>
              <span className="sbm-kicker">Our story</span>
              <h1 className="sbm-heading mt-4 max-w-2xl">A considered way to begin a family.</h1>
              <p className="sbm-body mt-5 max-w-xl">
                {SITE_NAME} is a matrimonial space for {COMMUNITY_NAME} families — built around
                shared roots, family involvement and the kind of introduction that is given time to
                become comfortable.
              </p>
            </div>

            <div className="border-l-2 border-[#D1A329] pl-5">
              <div className="flex items-center gap-3">
                <ShettibalijaLogo size="md" priority />
                <div>
                  <p className="font-serif text-lg text-[#24103F]">{SITE_NAME}</p>
                  <p className="sbm-telugu mt-1 text-[11px] text-[#087333]">{SITE_NAME_TE}</p>
                </div>
              </div>
              <p className="mt-5 max-w-sm text-[12px] leading-6 text-[#6B6570]">
                For families in Andhra Pradesh, Telangana and wherever the community has made a
                home. The platform is in English and Telugu.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="sbm-container grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <span className="sbm-kicker">Why it exists</span>
            <h2 className="sbm-heading mt-4 max-w-md">
              Marriage is a family decision. The search should reflect that.
            </h2>
          </div>
          <div className="max-w-2xl space-y-5 text-[14px] leading-8 text-[#5f5765]">
            <p>
              Most matrimonial websites ask families to behave like users of a marketplace: browse
              quickly, compare, and move on. That is not how a serious introduction usually begins
              in our community.
            </p>
            <p>
              We built {SITE_NAME} so that the details families actually ask about — family
              background, education, work, native place and horoscope — have room to be read
              properly. The interface is intentionally calm. Nothing is designed to rush a decision.
            </p>
            <p>
              The platform does not replace the conversations that families have with one another.
              It gives those conversations a more private and better organised place to start.
            </p>
          </div>
        </section>

        <section className="bg-[#24103F] text-white">
          <div className="sbm-container grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <span className="sbm-kicker sbm-kicker--light">What we hold to</span>
              <h2 className="sbm-display sbm-display--light sbm-display--member mt-4 max-w-md">
                Rooted in the community. Open to the conversation.
              </h2>
            </div>
            <div className="divide-y divide-white/15 border-y border-white/15">
              {PRINCIPLES.map((principle) => {
                const Icon = principle.icon;
                return (
                  <div key={principle.title} className="grid grid-cols-[2rem_1fr] gap-4 py-6">
                    <Icon className="mt-0.5 h-5 w-5 text-[#D1A329]" aria-hidden />
                    <div>
                      <h3 className="font-serif text-2xl text-[#FAF8F3]">{principle.title}</h3>
                      <p className="mt-2 max-w-xl text-[13px] leading-7 text-white/65">
                        {principle.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* LIFELONG COMPANIONSHIP & MATURE MARRIAGE VALUES */}
        <section className="border-b border-[#e5ddd1] bg-[#FAF8F3] py-14 sm:py-20">
          <div className="sbm-container">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div className="relative">
                <div className="pointer-events-none absolute -left-2 -top-2 h-8 w-8 border-l-2 border-t-2 border-[#D1A329]" />
                <div className="pointer-events-none absolute -bottom-2 -right-2 h-8 w-8 border-b-2 border-r-2 border-[#D1A329]" />
                <div className="overflow-hidden rounded-xs border border-[#ded5c8] bg-white shadow-[0_12px_32px_rgba(36,16,63,0.06)]">
                  <div className="aspect-[4/3] overflow-hidden bg-[#efe9df]">
                    <img
                      src={matureCouple.src}
                      alt={isTe ? matureCouple.altTe : matureCouple.alt}
                      className="h-full w-full object-cover object-[center_20%] transition-transform duration-700 hover:scale-[1.02]"
                      decoding="async"
                    />
                  </div>
                  <div className="border-t border-[#ded5c8] px-5 py-4 text-[12px] italic text-[#5f5765]">
                    {isTe ? matureCouple.captionTe : matureCouple.captionEn}
                  </div>
                </div>
                <p className="mt-2 text-right text-[10px] text-[#8e8594]">
                  {isTe
                    ? "కల్పిత నిదర్శన చిత్రం • దాంపత్య స్థిరత్వ భావన"
                    : "Illustrative brand visual • Lasting companionship & family values"}
                </p>
              </div>

              <div>
                <span className="sbm-kicker">
                  {isTe ? "జీవితకాల విలువలు" : "Enduring companionship"}
                </span>
                <h2 className="sbm-heading mt-4 text-3xl sm:text-4xl">
                  {isTe
                    ? "తరతరాల సంప్రదాయం, కలకాలం నిలిచే దాంపత్య బంధం."
                    : "A lifetime of quiet companionship and family roots."}
                </h2>
                <p className="sbm-body mt-5 text-[14px] leading-7">
                  {isTe
                    ? "వివాహం అనేది కేవలం ఒక వేడుక కాదు; అది రెండు కుటుంబాల కలయిక మరియు దశాబ్దాల పాటు పరస్పర ఆదరణతో సాగే పవిత్రమైన ప్రయాణం. శెట్టిబలిజ సంప్రదాయంలో పెద్దల గౌరవం, గోత్రం మరియు కుటుంబ బాధ్యతలు ఈ బంధానికి బలమైన పునాదులు. మా ప్రతి సేవ ఈ శాశ్వతమైన బంధాన్ని దృష్టిలో ఉంచుకునే రూపొందించబడింది."
                    : "Matrimony in our community is not merely about a wedding ceremony; it is about building a home where two families grow together with enduring trust, dignity, and shared traditions over decades. We design every feature to support this lifelong commitment."}
                </p>
                <div className="mt-6 flex items-center gap-2 text-[12px] font-semibold text-[#087333]">
                  <Sparkles className="h-4 w-4 text-[#D1A329]" />
                  <span>
                    {isTe
                      ? "గౌరవప్రదమైన పరిచయాలు • శాశ్వతమైన అనుబంధాలు"
                      : "Considered introductions • Enduring family happiness"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sbm-container py-14 sm:py-20">
          <div className="grid gap-8 border-b border-[#ded5c8] pb-8 sm:grid-cols-[0.72fr_1.28fr] sm:gap-20">
            <div>
              <span className="sbm-kicker">How it works</span>
              <h2 className="sbm-heading mt-4 max-w-sm">Three unhurried steps.</h2>
            </div>
            <p className="sbm-body max-w-xl sm:pt-8">
              The order is deliberate. You can stop, ask a question, or return to a profile later
              without losing your place.
            </p>
          </div>

          <div className="grid gap-0 md:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="border-b border-[#ded5c8] py-7 md:border-b-0 md:border-r md:px-7 md:last:border-r-0 md:first:pl-0"
              >
                <span className="font-serif text-2xl text-[#D1A329]">{step.number}</span>
                <h3 className="mt-4 font-serif text-2xl text-[#24103F]">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-7 text-[#6B6570]">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="sbm-container pb-16 sm:pb-24">
          <div className="flex flex-col justify-between gap-6 border-t border-[#ded5c8] pt-8 sm:flex-row sm:items-center">
            <div>
              <span className="sbm-kicker">Start here</span>
              <h2 className="sbm-heading mt-3 max-w-xl">
                If this feels like the right place to begin, we would be glad to have you.
              </h2>
            </div>
            <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
              <Link to="/register" className="sbm-button sbm-button--primary">
                Create your profile
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link to="/contact" className="sbm-button sbm-button--outline">
                Talk to us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
