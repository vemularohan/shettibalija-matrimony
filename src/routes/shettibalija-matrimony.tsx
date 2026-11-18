import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { pageHead } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

const content = {
  slug: "shettibalija-matrimony",
  title: "Shettibalija Matrimony for Community Families",
  description:
    "Shettibalija Matrimony is a privacy-first community platform for families seeking meaningful brides, grooms and matrimonial introductions.",
  eyebrow: "Shettibalija • Settibalija matrimony",
  intro:
    "Shettibalija and Settibalija families can use one calm, community-focused place to begin a matrimonial search with family participation.",
  focus: "Shared roots, clear profiles and introductions at your family's pace.",
  practical: [
    "The spelling people use may vary, but the need is the same: a trustworthy way to introduce candidates and families without exposing sensitive information.",
    "Create a profile with the details you are comfortable sharing, then use approved discovery and member privacy controls to guide the next conversation.",
  ],
  questions: [
    {
      question: "Is Shettibalija Matrimony the same community service?",
      answer:
        "This platform uses Shettibalija as an alternate spelling for Settibalija and is designed around the same community-focused matrimonial experience.",
    },
    {
      question: "Can a parent create a profile?",
      answer:
        "Yes. Parents and relatives can help create a profile, while the candidate should be involved in the information shared and any decision to continue.",
    },
  ],
};

export const Route = createFileRoute("/shettibalija-matrimony")({
  component: () => <SeoLandingPage content={content} path="/shettibalija-matrimony" />,
  head: () =>
    pageHead(
      `Shettibalija Matrimony | ${SITE_NAME}`,
      content.description,
      "/shettibalija-matrimony",
    ),
});
