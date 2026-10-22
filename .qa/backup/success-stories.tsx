import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { productSupabase } from "@/integrations/supabase/product-client";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/success-stories")({
  component: SuccessStoriesPage,
  head: () => ({ meta: [{ title: `Success Stories | ${SITE_NAME}` }] }),
});

function SuccessStoriesPage() {
  const { lang } = useLanguage();
  const storiesQuery = useQuery({
    queryKey: ["published-success-stories"],
    queryFn: async () => {
      const { data, error } = await productSupabase
        .from("success_stories")
        .select("id, couple_names, city, marriage_year, story, photo_url")
        .eq("is_published", true)
        .order("marriage_year", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <main className="min-h-[70vh] bg-[#F7F3EA] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#087333]">
            {lang === "te" ? "విజయ గాథలు" : "Success Stories"}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-[#24103F] sm:text-5xl">
            {lang === "te"
              ? "కుటుంబాలు పంచుకున్న నిజమైన కథలు"
              : "A beginning shared by two families"}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#756A61] sm:text-base">
            {lang === "te"
              ? "జంటలు మరియు వారి కుటుంబాలు మాతో పంచుకుని ప్రచురణకు అంగీకరించిన కథలు మాత్రమే ఇక్కడ ఉంటాయి."
              : "Stories couples and families have chosen to share with the Shettibalija community."}
          </p>
        </header>

        {storiesQuery.isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        ) : storiesQuery.isError ? (
          <ErrorState
            title={lang === "te" ? "కథలను లోడ్ చేయలేకపోయాము" : "Could not load success stories"}
            onRetry={() => void storiesQuery.refetch()}
          />
        ) : !storiesQuery.data?.length ? (
          <EmptyState
            title={
              lang === "te" ? "ప్రచురించిన కథలు ఇంకా లేవు" : "No stories have been published yet"
            }
            description={
              lang === "te"
                ? "ఒక జంట తమ కథను ప్రచురించడానికి అంగీకరించిన తర్వాత ఇక్కడ కనిపిస్తుంది."
                : "A couple's story will appear here after they choose to share it."
            }
          />
        ) : (
          <div className="space-y-8 sm:space-y-12">
            {storiesQuery.data.map((story) => {
              return (
                <article key={story.id} className="story-editorial gap-6 py-7 sm:gap-10 sm:py-10">
                  <div className="story-editorial-photo relative aspect-[4/3] overflow-hidden bg-[#EDE5D6] sm:aspect-[1.18/1]">
                    {story.photo_url ? (
                      <img
                        src={story.photo_url}
                        alt={story.couple_names}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center border border-[#C9A227]/50">
                        <div className="text-center">
                          <ShettibalijaLogo size="lg" />
                          <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#756A61]">
                            {lang === "te" ? "శెట్టిబలిజ కుటుంబ కథ" : "A community story"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center py-4 sm:py-8">
                    <p className="eyebrow">{lang === "te" ? "కుటుంబ కథ" : "A family story"}</p>
                    <p className="mt-5 font-serif text-2xl italic leading-tight text-[#24103F] sm:text-3xl">
                      {lang === "te"
                        ? "రెండు కుటుంబాలు. ఒక అందమైన ఆరంభం."
                        : "Two families. One beautiful beginning."}
                    </p>
                    <h2 className="mt-3 font-serif text-3xl font-medium leading-tight text-[#24103F] sm:text-4xl">
                      {story.couple_names}
                    </h2>
                    {(story.city || story.marriage_year) && (
                      <p className="mt-2 text-sm text-[#756A61]">
                        {[story.city, story.marriage_year]
                          .filter(Boolean)
                          .map((detail) => String(detail))
                          .join(" · ")}
                      </p>
                    )}
                    <p className="mt-4 max-w-xl whitespace-pre-line text-sm leading-7 text-[#514B55]">
                      {story.story}
                    </p>
                    <p className="mt-5 flex items-center gap-3 border-t border-[#C9A227]/50 pt-4 text-xs text-[#756A61]">
                      <span className="h-px w-8 bg-[#C9A227]" />
                      {lang === "te"
                        ? "కుటుంబం పంచుకున్న కథ"
                        : "Shared with the family's permission"}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <p className="mt-10 border-t border-[#E4DDD3] pt-6 text-sm text-[#756A61]">
          {lang === "te"
            ? "మీ కథను పంచుకోవాలనుకుంటున్నారా?"
            : "Would you like to share your story?"}{" "}
          <Link to="/contact" className="font-semibold text-[#24103F] underline underline-offset-4">
            {lang === "te" ? "మమ్మల్ని సంప్రదించండి" : "Contact our team"}
          </Link>
        </p>
      </div>
    </main>
  );
}
