import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin, PenLine, Sparkles, HeartHandshake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site";
import { DEMO_SUCCESS_STORIES, type DemoSuccessStory } from "@/data/demo-success-stories";

export const Route = createFileRoute("/success-stories")({
  component: SuccessStoriesPage,
  head: () => ({
    meta: [
      { title: `Family Stories | ${SITE_NAME}` },
      {
        name: "description",
        content:
          "Stories shared with permission by Shettibalija families who found a meaningful introduction through the community.",
      },
    ],
  }),
});

type Story = {
  city: string | null;
  couple_names: string;
  created_at: string;
  id: string;
  marriage_year: number | null;
  photo_url: string | null;
  story: string;
};

function SuccessStoriesPage() {
  const { lang } = useLanguage();
  const isTe = lang === "te";

  const stories = useQuery({
    queryKey: ["published-success-stories"],
    retry: false,
    queryFn: async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from("success_stories")
          .select("id, couple_names, city, marriage_year, story, photo_url, created_at")
          .eq("is_published", true)
          .order("created_at", { ascending: false });
        if (error) return [];
        return (data ?? []) as Story[];
      } catch {
        return [];
      }
    },
  });

  const hasLiveStories = Boolean(stories.data && stories.data.length > 0);

  return (
    <div className="sbm-page bg-[#FAF8F3]">
      <header className="border-b border-[#e5ddd1] bg-white">
        <div className="sbm-container py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <span className="sbm-kicker">{isTe ? "కుటుంబ కథలు" : "Family stories"}</span>
              <h1 className="sbm-heading mt-4 max-w-2xl">
                {isTe ? "ఒక పరిచయం నుండి ఒక కుటుంబం వరకు." : "From an introduction to a family."}
              </h1>
              <p className="sbm-body mt-5 max-w-xl">
                {isTe
                  ? "మేము ఒక కథను ప్రచురించే ముందు జంట మరియు వారి కుటుంబం అనుమతి తీసుకుంటాము. ఇక్కడ కనిపించే అనుభవాలు మన సంప్రదాయాలు మరియు పరస్పర గౌరవంతో సాగిన ప్రయాణానికి నిదర్శనం."
                  : "We publish a story only after the couple and their family have given written permission. Every story represents the emotional journey from finding a match to lifelong companionship."}
              </p>
            </div>
            <div className="border-l-2 border-[#D1A329] pl-5">
              <p className="text-[12px] leading-6 text-[#6B6570]">
                {isTe
                  ? "సమాజ పరిచయం ద్వారా వివాహం చేసుకుని మీ కథను పంచుకోవాలనుకుంటున్నారా? మాకు తెలియజేయండి."
                  : "Met through the community and would like to share your story? We would be glad to hear from you."}
              </p>
              <Link to="/contact" className="sbm-link-arrow mt-4">
                {isTe ? "మాకు రాయండి" : "Write to us"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="sbm-container pb-20 pt-10 sm:pt-14">
        {/* Illustrative Notice Banner when demo stories are shown */}
        {!hasLiveStories ? (
          <div className="mb-10 rounded-xs border border-[#e2d7c5] bg-[#fffcf5] p-5 sm:p-6">
            <div className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAF8F3] border border-[#D1A329]/40 text-[#D1A329]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#24103F]">
                  {isTe
                    ? "నిదర్శన కథనాలు • Illustrative Demo Stories"
                    : "Illustrative Stories • Community Previews"}
                </h2>
                <p className="mt-1 text-[13px] leading-6 text-[#6B6570]">
                  {isTe
                    ? "దిగువన ఉన్న కథనాలు శెట్టిబలిజ సమాజంలో కుటుంబాలు ఎలా కనెక్ట్ అవుతాయో చూపించే నిదర్శనాలు. వాస్తవ సభ్యుల కథనాలు వారి స్పష్టమైన సమ్మతితో మాత్రమే ప్రచురించబడతాయి."
                    : "The stories below illustrate how families connect, respect shared values, and build lasting marriages through thoughtful introductions. Actual member stories are published solely with verified family consent."}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {stories.isLoading ? (
          <div className="grid gap-8 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="border border-[#ded5c8] bg-white p-6">
                <div className="sbm-skeleton h-4 w-1/3" />
                <div className="sbm-skeleton mt-4 h-8 w-3/4" />
                <div className="sbm-skeleton mt-5 h-24 w-full" />
              </div>
            ))}
          </div>
        ) : hasLiveStories ? (
          /* Render Live Stories from Supabase */
          <div className="grid gap-8 md:grid-cols-2">
            {stories.data!.map((story) => (
              <article key={story.id} className="overflow-hidden border border-[#ded5c8] bg-white">
                {story.photo_url ? (
                  <div className="aspect-[16/10] overflow-hidden bg-[#efe9df]">
                    <img
                      src={story.photo_url}
                      alt={`${story.couple_names} together`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B6570]">
                    {story.marriage_year ? <span>{story.marriage_year}</span> : null}
                    {story.city ? (
                      <span className="flex items-center gap-1 normal-case tracking-normal">
                        <MapPin className="h-3 w-3" aria-hidden />
                        {story.city}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-4 font-serif text-3xl leading-tight text-[#24103F]">
                    {story.couple_names}
                  </h2>
                  <div className="mt-5 h-px w-12 bg-[#D1A329]" />
                  <p className="mt-5 whitespace-pre-line text-[14px] leading-7 text-[#5f5765]">
                    {story.story}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Render Curated Demo Stories with Fictional Couple Imagery */
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {DEMO_SUCCESS_STORIES.map((demo) => (
              <DemoStoryCard key={demo.id} story={demo} isTe={isTe} />
            ))}
          </div>
        )}

        {/* Closing Invitation Box */}
        <div className="mt-16 rounded-xs border border-dashed border-[#cdbfa6] bg-white p-8 sm:p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF8F3] border border-[#D1A329]/40 text-[#087333]">
            <HeartHandshake className="h-6 w-6 text-[#087333]" />
          </div>
          <h2 className="mt-5 font-serif text-2xl sm:text-3xl text-[#24103F]">
            {isTe ? "మీ అందమైన ప్రయాణాన్ని ప్రారంభించండి" : "Your story could be next"}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[13px] leading-6 text-[#6B6570]">
            {isTe
              ? "మీ కుటుంబ విలువలను గౌరవించే జీవిత భాగస్వామి కోసం నేడే ప్రొఫైల్ సృష్టించండి లేదా మీ అనుభవాన్ని పంచుకోవడానికి మమ్మల్ని సంప్రదించండి."
              : "Create your profile to begin thoughtful community introductions, or contact our team if you met through the platform and wish to share your experience."}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register" className="sbm-button sbm-button--primary">
              {isTe ? "ప్రొఫైల్ సృష్టించండి" : "Create a profile"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="sbm-button sbm-button--outline">
              <PenLine className="h-4 w-4" />
              {isTe ? "మాకు రాయండి" : "Write to us"}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function DemoStoryCard({ story, isTe }: { story: DemoSuccessStory; isTe: boolean }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xs border border-[#ded5c8] bg-white transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(36,16,63,0.08)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#efe9df]">
        <img
          src={story.photo_url}
          alt={story.photo_alt}
          className="h-full w-full object-cover object-[center_25%] transition-transform duration-700 group-hover:scale-[1.03]"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

        {/* Subtle Illustrative Badge */}
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-[10px] font-semibold text-[#F5E5B2] backdrop-blur-xs">
          <Sparkles className="h-3 w-3 text-[#D1A329]" />
          <span>{isTe ? "నిదర్శన కథనం" : "Illustrative Preview"}</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="font-serif text-2xl font-bold tracking-tight">
            {isTe ? story.couple_names_te : story.couple_names}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/80">
            <MapPin className="h-3 w-3 text-[#D1A329]" />
            <span>{isTe ? story.city_te : story.city}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#6B6570]">
            <span>{story.marriage_year}</span>
            <span>•</span>
            <span className="text-[#087333] font-medium">{story.theme}</span>
          </div>

          <h3 className="mt-3 font-serif text-xl font-bold leading-snug text-[#24103F]">
            {isTe ? story.headline_te : story.headline}
          </h3>

          <div className="mt-3 h-px w-10 bg-[#D1A329]" />

          <p className="mt-4 text-[13px] leading-6 text-[#5f5765]">
            {isTe ? story.story_te : story.story}
          </p>
        </div>

        <div className="mt-6 border-t border-[#ded5c8] pt-4 text-[11px] text-[#8e8594]">
          {isTe
            ? "సమాజ పరిచయాల ద్వారా మొదలైన అనుబంధం."
            : "Introduced through community connections."}
        </div>
      </div>
    </article>
  );
}
