import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { GUIDE_ARTICLES } from "@/data/seo-content";
import { pageHead } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/matrimony-guides")({
  component: GuidesPage,
  head: () =>
    pageHead(
      `Matrimony Guides | ${SITE_NAME}`,
      "Practical guides for Settibalija matrimonial profiles, family conversations, online safety and respectful matchmaking.",
      "/matrimony-guides",
    ),
});

function GuidesPage() {
  return (
    <div className="sbm-page bg-[#FAF8F3]">
      <header className="border-b border-[#e5ddd1] bg-white">
        <div className="sbm-container py-14 sm:py-20">
          <span className="sbm-kicker">Matrimony guides</span>
          <h1 className="sbm-heading mt-4 max-w-3xl">
            Useful guidance for a thoughtful introduction.
          </h1>
          <p className="sbm-body mt-5 max-w-2xl">
            Clear, practical reading for Settibalija candidates and families—from writing a profile
            to protecting privacy and preparing for a first family conversation.
          </p>
        </div>
      </header>
      <main className="sbm-container py-12 sm:py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {GUIDE_ARTICLES.map((article) => (
            <article key={article.slug} className="border border-[#ded5c8] bg-white p-6 sm:p-8">
              <BookOpen className="h-5 w-5 text-[#D1A329]" aria-hidden />
              <h2 className="mt-5 font-serif text-2xl text-[#24103F]">{article.title}</h2>
              <p className="mt-3 text-[13px] leading-7 text-[#6B6570]">{article.summary}</p>
              <Link
                to="/matrimony-guides/$slug"
                params={{ slug: article.slug }}
                className="sbm-link-arrow mt-5"
              >
                Read the guide <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-12 border-t border-[#ded5c8] pt-8">
          <Link to="/register" className="sbm-button sbm-button--primary">
            Create your matrimony profile <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
