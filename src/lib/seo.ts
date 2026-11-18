import { SITE_LOGO_URL, SITE_NAME, SITE_URL, SITE_TAGLINE } from "./site";

export function canonicalUrl(pathname: string): string {
  const path = pathname === "/" ? "" : `/${pathname.replace(/^\/|\/$/g, "")}`;
  return `${SITE_URL}${path}`;
}

export function pageHead(title: string, description: string, pathname: string) {
  const url = canonicalUrl(pathname);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: canonicalUrl(SITE_LOGO_URL) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: canonicalUrl(SITE_LOGO_URL) },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: canonicalUrl(SITE_LOGO_URL),
  description: SITE_TAGLINE,
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: ["Shettibalija Matrimony", "Setti Balija Matrimony"],
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/settibalija-matrimony?query={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
