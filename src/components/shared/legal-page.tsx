import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export type LegalSection = {
  id: string;
  title: string;
  body: ReactNode;
};

export function LegalPage({
  kicker,
  title,
  updated,
  intro,
  sections,
}: {
  kicker: string;
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
}) {
  return (
    <div className="sbm-page bg-[#FAF8F3]">
      <header className="border-b border-[#e5ddd1] bg-white">
        <div className="sbm-container py-12 sm:py-16">
          <span className="sbm-kicker">{kicker}</span>
          <h1 className="sbm-heading mt-4 max-w-3xl">{title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#6B6570]">
            <span>Last updated: {updated}</span>
            <span className="h-3 w-px bg-[#ded5c8]" />
            <Link to="/contact" className="font-semibold text-[#087333] underline">
              Questions? Contact us
            </Link>
          </div>
          {intro ? <p className="sbm-body mt-5 max-w-2xl">{intro}</p> : null}
        </div>
      </header>

      <main className="sbm-container grid gap-10 pb-20 pt-10 lg:grid-cols-[14rem_1fr] lg:gap-16 lg:pt-14">
        <aside className="self-start lg:sticky lg:top-20">
          <p className="sbm-kicker">On this page</p>
          <nav className="mt-4 border-t border-[#ded5c8]" aria-label={`${title} sections`}>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block border-b border-[#ded5c8] py-2.5 text-[11px] leading-5 text-[#6B6570] transition-colors hover:text-[#24103F]"
              >
                {section.title}
              </a>
            ))}
          </nav>
          <div className="mt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#6B6570]">
              Still unsure?
            </p>
            <a
              href="mailto:support@shettibalijamatrimony.org"
              className="mt-2 block break-words text-[11px] font-semibold text-[#087333] underline"
            >
              support@shettibalijamatrimony.org
            </a>
          </div>
        </aside>

        <article className="min-w-0 max-w-3xl">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="sbm-legal__section border-b border-[#ded5c8] py-7 first:pt-0 last:border-b-0"
            >
              <h2 className="font-serif text-2xl leading-snug text-[#24103F] sm:text-3xl">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-[13px] leading-7 text-[#5f5765]">
                {section.body}
              </div>
            </section>
          ))}
        </article>
      </main>
    </div>
  );
}
