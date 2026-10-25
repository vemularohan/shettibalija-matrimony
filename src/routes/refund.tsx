import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/shared/legal-page";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/refund")({
  component: RefundPage,
  head: () => ({
    meta: [
      { title: `Refund & Cancellation Policy | ${SITE_NAME}` },
      {
        name: "description",
        content: "Refund and cancellation guidelines for Shettibalija Matrimony",
      },
    ],
  }),
});

function RefundPage() {
  return (
    <LegalPage
      kicker="Refunds"
      title="Refund and cancellation policy"
      updated="October 2026"
      intro="This policy applies to paid membership plans purchased through the platform. It does not change any rights available to you under applicable consumer law."
      sections={[
        {
          id: "membership-services",
          title: "1. Membership services",
          body: (
            <p>
              {SITE_NAME} offers matrimonial discovery and introduction features. Because a
              membership provides immediate digital access to those features, payments that have
              been successfully processed are generally non-refundable once the plan is active.
            </p>
          ),
        },
        {
          id: "duplicate-charges",
          title: "2. Duplicate or erroneous charges",
          body: (
            <p>
              If an account is charged more than once because of a payment gateway error or
              technical fault, the excess amount will be returned to the original payment method
              within 5 to 7 working days after verification.
            </p>
          ),
        },
        {
          id: "profile-suspension",
          title: "3. Profile rejection or policy violation",
          body: (
            <p>
              If a profile is suspended or terminated because of intentionally fraudulent
              information, harassment or a violation of community standards, the member is not
              entitled to a refund.
            </p>
          ),
        },
        {
          id: "support",
          title: "4. Support and dispute enquiries",
          body: (
            <p>
              For a payment dispute or a question about membership activation, write to
              support@shettibalijamatrimony.org from your registered email address and include the
              transaction or order ID. Please do not send card numbers or banking passwords by
              email.
            </p>
          ),
        },
      ]}
    />
  );
}
