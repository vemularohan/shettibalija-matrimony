import { Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, Home, Sparkles, Users } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { MARKETING_COUPLE_IMAGES } from "@/data/marketing-couples";

export function CoupleDestinationSection() {
  const { lang } = useLanguage();
  const isTe = lang === "te";
  const image = MARKETING_COUPLE_IMAGES["homeCompanion"]!;

  return (
    <section className="border-b border-[#e5ddd1] bg-[#FAF8F3] py-14 sm:py-20">
      <div className="sbm-container">
        {/* Editorial Split Grid */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Couple Image Showcase */}
          <div className="relative">
            {/* Subtle decorative gold corner framing */}
            <div className="pointer-events-none absolute -left-2 -top-2 h-10 w-10 border-l-2 border-t-2 border-[#D1A329]" />
            <div className="pointer-events-none absolute -bottom-2 -right-2 h-10 w-10 border-b-2 border-r-2 border-[#D1A329]" />

            <div className="relative overflow-hidden rounded-xs border border-[#ded5c8] bg-white shadow-[0_16px_40px_rgba(36,16,63,0.06)]">
              <div className="aspect-[16/10] overflow-hidden bg-[#efe9df]">
                <img
                  src={image.src}
                  alt={isTe ? image.altTe : image.alt}
                  className="h-full w-full object-cover object-[center_35%] transition-transform duration-700 hover:scale-[1.02]"
                  decoding="async"
                />
              </div>

              {/* Bottom Subtle Editorial Caption Bar */}
              <div className="flex flex-col justify-between gap-2 border-t border-[#ded5c8] bg-white px-5 py-4 sm:flex-row sm:items-center">
                <p className="text-[12px] italic leading-relaxed text-[#5f5765]">
                  {isTe ? image.captionTe : image.captionEn}
                </p>
                <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#D1A329]">
                  <Sparkles className="h-3 w-3" />
                  {isTe ? "దాంపత్య ఆనందం" : "Emotional Promise"}
                </span>
              </div>
            </div>

            {/* Subtle Illustrative Badge */}
            <p className="mt-2 text-right text-[10px] text-[#8e8594]">
              {isTe
                ? "కల్పిత నిదర్శన చిత్రం • దాంపత్య లక్ష్య భావన"
                : "Illustrative brand visual • The destination of matrimonial companionship"}
            </p>
          </div>

          {/* Emotional Narrative Copy */}
          <div>
            <span className="sbm-kicker">{isTe ? "జీవిత గమ్యం" : "The destination"}</span>

            <h2 className="sbm-heading mt-4 text-3xl sm:text-4xl">
              {isTe ? (
                <>
                  పరిచయం నుండి దాంపత్యం వరకు.
                  <br />
                  <span className="text-[#087333]">మన కుటుంబం, మన ఆనందం.</span>
                </>
              ) : (
                <>
                  From finding a match
                  <br />
                  <span className="text-[#087333]">to building a life together.</span>
                </>
              )}
            </h2>

            <p className="sbm-body mt-5 max-w-lg text-[14px] leading-7">
              {isTe
                ? "మ్యాట్రిమోనీ ప్రొఫైల్ అనేది కేవలం ఒక ప్రశాంతమైన ప్రారంభం మాత్రమే. పరస్పర గౌరవం, పంచుకునే పండుగలు, సంప్రదాయాలు మరియు జీవితకాల సహచర్యమే అసలైన గమ్యం."
                : "A matrimonial profile is only where the journey begins. The true outcome is a life of shared laughter, enduring trust, family blessings, and quiet daily companionship."}
            </p>

            {/* 3 Emotional Pillars */}
            <div className="mt-8 space-y-4 border-t border-[#ded5c8] pt-6">
              <div className="flex items-start gap-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAF8F3] border border-[#D1A329]/40 text-[#24103F]">
                  <Home className="h-4 w-4 text-[#087333]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#24103F]">
                    {isTe ? "సంతోషకరమైన ఇల్లు & తోడు" : "Companionship & a peaceful home"}
                  </h3>
                  <p className="mt-0.5 text-[12px] leading-5 text-[#6B6570]">
                    {isTe
                      ? "ప్రతిరోజూ గౌరవప్రదమైన అనురాగంతో సాగే శాంతియుత దాంపత్యం."
                      : "Shared morning cups of tea, easy conversation, and the comfort of being understood."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAF8F3] border border-[#D1A329]/40 text-[#24103F]">
                  <Users className="h-4 w-4 text-[#D1A329]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#24103F]">
                    {isTe ? "కుటుంబ బంధాలు & సంస్కృతి" : "Two families, one shared heritage"}
                  </h3>
                  <p className="mt-0.5 text-[12px] leading-5 text-[#6B6570]">
                    {isTe
                      ? "మన శెట్టిబలిజ సంప్రదాయాలను మరియు పెద్దల ఆశీర్వాదాలను నిలబెట్టే ఐక్యత."
                      : "Rooted in Shettibalija traditions, gothram respect, and values passed across generations."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAF8F3] border border-[#D1A329]/40 text-[#24103F]">
                  <HeartHandshake className="h-4 w-4 text-[#24103F]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#24103F]">
                    {isTe ? "జీవితకాల నమ్మకం" : "Lifelong partnership"}
                  </h3>
                  <p className="mt-0.5 text-[12px] leading-5 text-[#6B6570]">
                    {isTe
                      ? "అందమైన పరిచయాలు కాలక్రమంలో బలమైన దాంపత్య బంధాలుగా మారతాయి."
                      : "Where thoughtful introductions grow into enduring bonds of affection and trust."}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA button */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/register" className="sbm-button sbm-button--primary">
                {isTe ? "మీ ప్రయాణాన్ని ప్రారంభించండి" : "Begin your journey"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/success-stories" className="sbm-button sbm-button--outline">
                {isTe ? "కుటుంబ కథలు చూడండి" : "View family stories"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
