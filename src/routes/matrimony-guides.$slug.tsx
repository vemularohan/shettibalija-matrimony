import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StructuredData } from "@/components/seo/structured-data";
import { GUIDE_ARTICLES } from "@/data/seo-content";
import { breadcrumbSchema, pageHead } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/matrimony-guides/$slug")({
  component: GuideArticlePage,
  head: ({ params }) => {
    const article = GUIDE_ARTICLES.find((item) => item.slug === params.slug);
    return pageHead(
      article ? `${article.title} | ${SITE_NAME}` : `Matrimony Guide | ${SITE_NAME}`,
      article?.summary ?? "Practical Settibalija matrimony guidance for candidates and families.",
      `/matrimony-guides/${params.slug}`,
    );
  },
});

function GuideArticlePage() {
  const { slug } = Route.useParams();
  const article = GUIDE_ARTICLES.find((item) => item.slug === slug);
  if (!article) throw notFound();

  return (
    <article className="sbm-page bg-[#FAF8F3]">
      <StructuredData
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Matrimony guides", path: "/matrimony-guides" },
          { name: article.title, path: `/matrimony-guides/${article.slug}` },
        ])}
      />
      <header className="border-b border-[#e5ddd1] bg-white">
        <div className="sbm-container py-14 sm:py-20">
          <Link to="/matrimony-guides" className="sbm-link-arrow">
            <ArrowLeft className="h-3.5 w-3.5" /> All guides
          </Link>
          <h1 className="sbm-heading mt-6 max-w-3xl">{article.title}</h1>
          <p className="sbm-body mt-5 max-w-2xl">{article.summary}</p>
        </div>
      </header>
      <main className="sbm-container max-w-4xl py-12 sm:py-16">
        <div className="space-y-10">
          {article.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className="font-serif text-3xl text-[#24103F]">{heading}</h2>
              <p className="mt-3 max-w-3xl text-[14px] leading-8 text-[#5f5765]">{body}</p>
            </section>
          ))}
        </div>
        <div className="mt-12 border-t border-[#ded5c8] pt-8">
          <p className="text-[14px] leading-7 text-[#5f5765]">
            Ready to begin? Create a profile and involve your family at your own pace.
          </p>
          <Link to="/register" className="sbm-button sbm-button--primary mt-5">
            Join {SITE_NAME} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </article>
  );
}
