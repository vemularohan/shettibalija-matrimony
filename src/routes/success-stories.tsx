import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, MapPin, PenLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site";

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
  const stories = useQuery({
    queryKey: ["published-success-stories"],
    retry: false,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("success_stories")
        .select("id, couple_names, city, marriage_year, story, photo_url, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Story[];
    },
  });

  return (
    <div className="sbm-page bg-[#FAF8F3]">
      <header className="border-b border-[#e5ddd1] bg-white">
        <div className="sbm-container py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <span className="sbm-kicker">
                {lang === "te" ? "కుటుంబ కథలు" : "Family stories"}
              </span>
              <h1 className="sbm-heading mt-4 max-w-2xl">
                {lang === "te"
                  ? "ఒక పరిచయం నుండి ఒక కుటుంబం వరకు."
                  : "From an introduction to a family."}
              </h1>
              <p className="sbm-body mt-5 max-w-xl">
                {lang === "te"
                  ? "మేము ఒక కథను ప్రచురించే ముందు జంట మరియు కుటుంబం అనుమతి తీసుకుంటాము. ఇక్కడ కనిపించే ప్రతి కథ నిజమైనది."
                  : "We publish a story only after the couple and their family have given permission. Every story here is shared in their own words, not written for them."}
              </p>
            </div>
            <div className="border-l-2 border-[#D1A329] pl-5">
              <p className="text-[12px] leading-6 text-[#6B6570]">
                {lang === "te"
                  ? "మీ కథను పంచుకోవాలనుకుంటున్నారా? మమ్మల్ని సంప్రదించండి."
                  : "Met through the community and would like to share your story? We would be glad to hear from you."}
              </p>
              <Link to="/contact" className="sbm-link-arrow mt-4">
                {lang === "te" ? "మాకు రాయండి" : "Write to us"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="sbm-container pb-20 pt-10 sm:pt-14">
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
        ) : stories.isError ? (
          <div className="border border-[#ded5c8] bg-white px-6 py-16 text-center">
            <h2 className="font-serif text-3xl text-[#24103F]">
              {lang === "te" ? "కథలు ప్రస్తుతం అందుబాటులో లేవు." : "Family stories are temporarily unavailable."}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#6B6570]">
              {lang === "te"
                ? "మేము అనుమతి ఉన్న కథలను మాత్రమే ప్రచురిస్తాము. దయచేసి కొద్ది సేపటి తర్వాత మళ్లీ చూడండి."
                : "We publish stories only with a family's permission. Please check back shortly, or write to us and we will help."}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={() => void stories.refetch()}
                className="sbm-button sbm-button--primary"
              >
                {lang === "te" ? "మళ్లీ ప్రయత్నించండి" : "Try again"}
              </button>
              <Link to="/contact" className="sbm-button sbm-button--outline">
                {lang === "te" ? "సంప్రదించండి" : "Contact us"}
              </Link>
            </div>
          </div>
        ) : !stories.data?.length ? (
          <EmptyStories lang={lang} />
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {stories.data.map((story) => (
              <article
                key={story.id}
                className="overflow-hidden border border-[#ded5c8] bg-white"
              >
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
        )}
      </main>
    </div>
  );
}

function EmptyStories({ lang }: { lang: "en" | "te" }) {
  return (
    <div className="mx-auto max-w-2xl border border-dashed border-[#cdbfa6] bg-white px-6 py-16 text-center sm:px-12 sm:py-20">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D1A329]/30 bg-[#FAF8F3]">
        <BookOpen className="h-5 w-5 text-[#D1A329]" aria-hidden />
      </div>
      <h2 className="mt-6 font-serif text-3xl text-[#24103F]">
        {lang === "te" ? "ఇంకా ప్రచురించిన కథలు లేవు." : "No stories published yet."}
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#6B6570]">
        {lang === "te"
          ? "జంట మరియు కుటుంబం అనుమతి ఇచ్చిన తర్వాత మాత్రమే మేము కథను ప్రచురిస్తాము. మీ కథ ఉంటే, దయచేసి మాకు రాయండి."
          : "We only share a story when the couple and their family have given permission. If you met through the community and would like to tell yours, we would be glad to hear from you."}
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/contact" className="sbm-button sbm-button--primary">
          <PenLine className="h-4 w-4" aria-hidden />
          {lang === "te" ? "మీ కథను పంచుకోండి" : "Share your story"}
        </Link>
        <Link to="/register" className="sbm-button sbm-button--outline">
          {lang === "te" ? "ప్రొఫైల్ ప్రారంభించండి" : "Begin your profile"}
        </Link>
      </div>
    </div>
  );
}
