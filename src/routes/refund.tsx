import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary md:text-4xl">
          Refund & Cancellation Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: October 2026</p>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8 space-y-6 text-sm text-foreground/90 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-primary">
              1. Membership Services
            </h2>
            <p>
              {SITE_NAME} offers matrimonial matchmaking services and community verification. Since
              membership subscriptions provide immediate digital access to features and contact
              discovery, payments once successfully processed are generally non-refundable.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-primary">
              2. Duplicate or Erroneous Charges
            </h2>
            <p>
              In the event that an account is charged multiple times due to a payment gateway error
              or technical fault, the excess amount will be refunded back to the original source of
              payment within 5 to 7 working days upon verification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-primary">
              3. Profile Rejection or Policy Violation
            </h2>
            <p>
              If a profile is permanently suspended or terminated due to intentional fraudulent
              data, harassment, or violation of community standards, the member is not entitled to a
              refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-primary">
              4. Support & Dispute Inquiries
            </h2>
            <p>
              For any payment-related disputes or questions regarding your membership activation,
              please contact our support team at support@shettibalijamatrimony.org with your
              transaction order ID.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
