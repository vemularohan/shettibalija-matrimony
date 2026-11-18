import { ArrowRight, ChevronDown, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { StructuredData } from "./structured-data";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import type { LandingContent } from "@/data/seo-content";

export function SeoLandingPage({ content, path }: { content: LandingContent; path: string }) {
  return (
    <div className="sbm-page bg-[#FAF8F3]">
      <StructuredData
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: content.title, path },
          ]),
          faqSchema(content.questions),
        ]}
      />
      <header className="border-b border-[#e5ddd1] bg-white">
        <div className="sbm-container py-14 sm:py-20">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#087333]">
            <MapPin className="h-4 w-4 text-[#D1A329]" aria-hidden />
            {content.eyebrow}
          </div>
          <h1 className="sbm-heading mt-5 max-w-3xl">{content.title}</h1>
          <p className="sbm-body mt-5 max-w-2xl">{content.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="sbm-button sbm-button--primary">
              Create your matrimony profile <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/settibalija-brides" className="sbm-button sbm-button--outline">
              Explore community guides
            </Link>
          </div>
        </div>
      </header>
      <main className="sbm-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <span className="sbm-kicker">A considered beginning</span>
            <h2 className="sbm-heading mt-4 max-w-md">{content.focus}</h2>
            <div className="mt-6 flex items-start gap-3 border-l-2 border-[#D1A329] pl-4 text-sm leading-7 text-[#6B6570]">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#087333]" aria-hidden />
              <span>
                Private contact details and authenticated member information are not exposed as SEO
                content.
              </span>
            </div>
          </div>
          <div className="space-y-5 text-[14px] leading-8 text-[#5f5765]">
            {content.practical.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>
              {SITE_NAME} helps families create a profile, discover approved introductions and
              decide together when a conversation should move forward.
            </p>
          </div>
        </div>
        <section className="mt-14 border-t border-[#ded5c8] pt-10">
          <span className="sbm-kicker">Questions families ask</span>
          <div className="mt-5 divide-y divide-[#ded5c8] border-y border-[#ded5c8]">
            {content.questions.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl text-[#24103F]">
                  {faq.question}
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#D1A329] transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 max-w-3xl text-[13px] leading-7 text-[#6B6570]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="mt-14 flex flex-col justify-between gap-5 border-t border-[#ded5c8] pt-8 sm:flex-row sm:items-center">
          <div>
            <span className="sbm-kicker">Continue your search</span>
            <h2 className="sbm-heading mt-3 text-3xl">
              Build a profile with the details that matter.
            </h2>
          </div>
          <Link to="/register" className="sbm-button sbm-button--primary shrink-0">
            Join {SITE_NAME} <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
