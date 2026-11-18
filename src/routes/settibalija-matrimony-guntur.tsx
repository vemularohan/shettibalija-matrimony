import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { LOCATION_PAGES } from "@/data/seo-content";
import { pageHead } from "@/lib/seo";
const content = LOCATION_PAGES.find((item) => item.slug === "guntur")!;
export const Route = createFileRoute("/settibalija-matrimony-guntur")({
  component: () => <SeoLandingPage content={content} path="/settibalija-matrimony-guntur" />,
  head: () =>
    pageHead(
      `${content.title} | Settibalija Matrimony`,
      content.description,
      "/settibalija-matrimony-guntur",
    ),
});
