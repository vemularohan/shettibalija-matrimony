import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { pageHead } from "@/lib/seo";
const content = {
  slug: "settibalija-brides",
  title: "Settibalija Brides and Matrimonial Profiles",
  description:
    "Learn how families can create and discover privacy-conscious Settibalija bride profiles for respectful matrimonial introductions.",
  eyebrow: "Settibalija bride profiles",
  intro:
    "A bride profile should help a family understand the person, their expectations and the conversation they are ready to begin—not expose private data.",
  focus: "Useful bride profiles begin with honesty, consent and context.",
  practical: [
    "Families can include education, work, location, interests and expectations that are relevant to a matrimonial introduction.",
    "Use the platform's privacy controls and speak with the family before sharing contact details or making important decisions.",
  ],
  questions: [
    {
      question: "How do I find a Settibalija bride?",
      answer:
        "Create an account, complete an accurate profile and use approved member discovery after authentication. Public pages do not list private member records.",
    },
    {
      question: "What should a bride profile include?",
      answer:
        "Include truthful, current details the candidate and family are comfortable sharing, along with clear expectations and a respectful introduction.",
    },
  ],
};
export const Route = createFileRoute("/settibalija-brides")({
  component: () => <SeoLandingPage content={content} path="/settibalija-brides" />,
  head: () =>
    pageHead(
      "Settibalija Brides | Matrimonial Profiles",
      content.description,
      "/settibalija-brides",
    ),
});
