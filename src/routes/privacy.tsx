import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/shared/legal-page";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: `Privacy Policy | ${SITE_NAME}` },
      {
        name: "description",
        content: "Privacy policy and member protection on Shettibalija Matrimony",
      },
    ],
  }),
});

function PrivacyPage() {
  return (
    <LegalPage
      kicker="Privacy"
      title="Privacy policy"
      updated="October 2026"
      intro="This policy explains what information the platform holds, how contact details and photographs are protected, and the choices available to members."
      sections={[
        {
          id: "information-we-collect",
          title: "1. Information we collect",
          body: (
            <p>
              When you create an account, we collect the matrimonial details you choose to provide,
              including name, contact details, date of birth, educational background, professional
              details, photographs and optional family background information.
            </p>
          ),
        },
        {
          id: "contact-details",
          title: "2. Confidentiality of contact details",
          body: (
            <p>
              Direct contact phone numbers and personal email addresses are not displayed publicly
              on the open website. Contact details are released only through the platform&apos;s
              access rules and according to your selected privacy controls.
            </p>
          ),
        },
        {
          id: "photo-protection",
          title: "3. Photo protection",
          body: (
            <p>
              You maintain control over your photograph visibility. You may choose to display your
              photo to signed-in members, or restrict photos so that only members you approve can
              view them. The access rules are enforced at the data layer, not only in the interface.
            </p>
          ),
        },
        {
          id: "data-security",
          title: "4. Data security",
          body: (
            <>
              <p>
                We use encryption in transit, Row Level Security policies in our database and
                restricted access to credentials and private storage. We do not sell or lease
                personal member data to third-party marketing companies.
              </p>
              <p>
                No internet service can promise absolute security. If you believe your account has
                been accessed without permission, contact support immediately.
              </p>
            </>
          ),
        },
        {
          id: "account-deletion",
          title: "5. Account deletion and data rights",
          body: (
            <p>
              Members may update, hide or request deletion of their profile through their dashboard
              settings, or by writing to support@shettibalijamatrimony.org from their registered
              email address. We will explain what will be removed and any records we are required to
              retain.
            </p>
          ),
        },
      ]}
    />
  );
}
