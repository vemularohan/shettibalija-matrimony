import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/shared/legal-page";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: `Terms and Conditions | ${SITE_NAME}` },
      { name: "description", content: "Terms of service for Shettibalija Matrimony" },
    ],
  }),
});

function TermsPage() {
  return (
    <LegalPage
      kicker="Terms"
      title="Terms and conditions"
      updated="October 2026"
      intro={`These terms apply to every account and profile on ${SITE_NAME}. They are written to protect members, families and the integrity of the community.`}
      sections={[
        {
          id: "eligibility",
          title: "1. Eligibility",
          body: (
            <p>
              To register as a member of {SITE_NAME}, you must be legally competent to enter into a
              marriage under applicable laws (minimum age 18 for females and 21 for males). The
              platform is dedicated to matrimonial alliances within the Shettibalija community.
            </p>
          ),
        },
        {
          id: "accurate-information",
          title: "2. Accurate information",
          body: (
            <p>
              Members agree to provide truthful, accurate and current information about identity,
              education, profession, family background and marital status. Misrepresentation or the
              creation of fake accounts is prohibited and may result in immediate termination.
            </p>
          ),
        },
        {
          id: "profile-review",
          title: "3. Profile review and approval",
          body: (
            <p>
              Submitted profiles and photographs are reviewed by administrators before appearing in
              community discovery. {SITE_NAME} may reject or hide profiles that do not comply with
              these terms or community guidelines.
            </p>
          ),
        },
        {
          id: "code-of-conduct",
          title: "4. Code of conduct",
          body: (
            <p>
              Members agree to communicate respectfully with other families and candidates.
              Harassment, unsolicited commercial messaging and abusive conduct may result in account
              blocking and, where appropriate, referral to the authorities.
            </p>
          ),
        },
        {
          id: "disclaimer",
          title: "5. Disclaimer",
          body: (
            <p>
              {SITE_NAME} provides a platform for candidate discovery and introduction. It does not
              guarantee a marriage, a match or the accuracy of information supplied by members.
              Families are advised to make their own independent enquiries, astrological
              consultations and customary checks before finalising an alliance.
            </p>
          ),
        },
      ]}
    />
  );
}
