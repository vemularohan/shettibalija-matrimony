import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { DEMO_SUCCESS_STORIES } from "@/data/demo-success-stories";

export function SuccessStoriesSpotlight() {
  const { lang } = useLanguage();
  const isTe = lang === "te";
  // Showcase top 2 stories on homepage
  const stories = DEMO_SUCCESS_STORIES.slice(0, 2);

  return (
    <section className="border-b border-[#e5ddd1] bg-white py-14 sm:py-20">
      <div className="sbm-container">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="sbm-kicker">{isTe ? "కుటుంబ కథల నిదర్శనాలు" : "Family stories"}</span>
            <h2 className="sbm-heading mt-3 max-w-xl text-3xl sm:text-4xl">
              {isTe
                ? "ఒక పరిచయం నుండి మొదలైన అందమైన దాంపత్యం."
                : "From an introduction to a lifelong companionship."}
            </h2>
            <p className="sbm-body mt-3 max-w-lg text-[13px] leading-6">
              {isTe
                ? "శెట్టిబలిజ కుటుంబాలు కలిసి తమ విలువలను, సంప్రదాయాలను ఎలా ముందుకు తీసుకెళ్తున్నాయో తెలిపే నిదర్శన కథనాలు."
                : "Illustrative glimpses into how community introductions grow into lasting marriages rooted in shared values."}
            </p>
          </div>

          <Link to="/success-stories" className="sbm-link-arrow shrink-0">
            {isTe ? "అన్ని కథలు చదవండి" : "Explore all stories"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Stories Grid */}
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {stories.map((story) => (
            <article
              key={story.id}
              className="group flex flex-col overflow-hidden rounded-xs border border-[#ded5c8] bg-[#FAF8F3] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(36,16,63,0.08)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#efe9df]">
                <img
                  src={story.photo_url}
                  alt={story.photo_alt}
                  className="h-full w-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-[1.03]"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Demo Story Pill Badge */}
                <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-2.5 py-0.5 text-[10px] font-semibold text-[#F5E5B2] backdrop-blur-xs">
                  <Sparkles className="h-3 w-3 text-[#D1A329]" />
                  <span>{isTe ? "నిదర్శన కథనం" : "Illustrative Preview"}</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <h3 className="font-serif text-2xl font-bold tracking-tight">
                    {isTe ? story.couple_names_te : story.couple_names}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-white/80">
                    <MapPin className="h-3 w-3 text-[#D1A329]" />
                    <span>{isTe ? story.city_te : story.city}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#6B6570]">
                    <span>{story.marriage_year}</span>
                    <span>•</span>
                    <span className="text-[#087333] font-medium">{story.theme}</span>
                  </div>

                  <h4 className="mt-2 font-serif text-lg font-bold text-[#24103F]">
                    {isTe ? story.headline_te : story.headline}
                  </h4>

                  <p className="mt-3 text-[13px] leading-6 text-[#5f5765]">
                    {isTe ? story.story_te : story.story}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#ded5c8] pt-4">
                  <Link
                    to="/success-stories"
                    className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#087333] hover:text-[#24103F] transition-colors"
                  >
                    <span>{isTe ? "వివరాలు చదవండి" : "Read full story"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
