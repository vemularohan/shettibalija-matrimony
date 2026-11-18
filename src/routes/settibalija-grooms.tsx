import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { pageHead } from "@/lib/seo";
const content = {
  slug: "settibalija-grooms",
  title: "Settibalija Grooms and Matrimonial Profiles",
  description:
    "Learn how families can create and discover privacy-conscious Settibalija groom profiles for respectful matrimonial introductions.",
  eyebrow: "Settibalija groom profiles",
  intro:
    "A groom profile should offer enough context for a meaningful family conversation while keeping personal contact information private.",
  focus: "Clear expectations make a matrimonial introduction more useful.",
  practical: [
    "Share accurate education, work, location, interests and family expectations that help another family understand the candidate.",
    "Profiles are introductions, not guarantees. Speak with the family and make independent enquiries before moving forward.",
  ],
  questions: [
    {
      question: "How do I find a Settibalija groom?",
      answer:
        "Register, complete a truthful profile and use authenticated discovery to review approved introductions. Private member information is not indexed publicly.",
    },
    {
      question: "Can families manage a groom profile?",
      answer:
        "Parents, siblings and relatives can assist with a profile when the candidate is involved and the information shared is accurate.",
    },
  ],
};
export const Route = createFileRoute("/settibalija-grooms")({
  component: () => <SeoLandingPage content={content} path="/settibalija-grooms" />,
  head: () =>
    pageHead(
      "Settibalija Grooms | Matrimonial Profiles",
      content.description,
      "/settibalija-grooms",
    ),
});
