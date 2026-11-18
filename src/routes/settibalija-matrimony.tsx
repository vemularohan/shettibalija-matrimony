import { createFileRoute, Link } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { StructuredData } from "@/components/seo/structured-data";
import { organizationSchema, pageHead, websiteSchema } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

const content = {
  slug: "settibalija-matrimony",
  title: "Settibalija Matrimony for Meaningful Family Introductions",
  description:
    "Settibalija Matrimony helps families discover community brides and grooms through privacy-first profiles, thoughtful search and respectful introductions.",
  eyebrow: "Settibalija community matrimony",
  intro:
    "A community-aware place for Settibalija families to create matrimonial profiles, discover suitable introductions and involve the people who matter.",
  focus: "A more considered way to find a Settibalija bride or groom.",
  practical: [
    "Whether you are searching for a bride, groom or a profile for a family member, the first step is a clear and honest introduction.",
    "Parents, siblings and relatives can participate in registration, while the candidate remains part of the conversation and decision.",
  ],
  questions: [
    {
      question: "Who can register on Settibalija Matrimony?",
      answer:
        "Candidates, parents, siblings and relatives can create a profile for a Settibalija matrimonial introduction. Information should be accurate and shared with the candidate's knowledge.",
    },
    {
      question: "Are member profiles indexed by Google?",
      answer:
        "No. Authenticated member profiles and private search results are not published as public SEO pages. Phone numbers, email addresses, horoscopes and private photographs remain protected.",
    },
  ],
};

export const Route = createFileRoute("/settibalija-matrimony")({
  component: () => (
    <>
      <StructuredData data={[organizationSchema, websiteSchema]} />
      <SeoLandingPage content={content} path="/settibalija-matrimony" />
      <div className="sr-only">
        <Link to="/matrimony-guides">Read Settibalija matrimony guides</Link>
      </div>
    </>
  ),
  head: () =>
    pageHead(
      `${SITE_NAME} | Find Community Brides & Grooms`,
      content.description,
      "/settibalija-matrimony",
    ),
});
