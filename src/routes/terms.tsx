import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary md:text-4xl">
          Terms & Conditions
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: October 2026</p>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8 space-y-6 text-sm text-foreground/90 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-primary">1. Eligibility</h2>
            <p>
              To register as a member of {SITE_NAME}, you must be legally competent to enter into a
              marriage under applicable laws (minimum age 18 for females, 21 for males). This
              platform is dedicated to matrimonial alliances within the Shettibalija community.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-primary">
              2. Accurate Information
            </h2>
            <p>
              Members agree to provide truthful, accurate, and current information regarding
              identity, education, profession, family background, and marital status.
              Misrepresentation of facts or creating fake accounts is strictly prohibited and
              grounds for immediate termination.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-primary">
              3. Profile Moderation & Approval
            </h2>
            <p>
              All submitted profiles and photographs undergo administrative review before appearing
              in public community searches. {SITE_NAME} reserves the right to reject or hide
              profiles that do not comply with community guidelines.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-primary">4. Code of Conduct</h2>
            <p>
              Members agree to communicate respectfully with fellow families and candidates.
              Harassment, unsolicited commercial messaging, and abusive conduct will result in
              account blocking and possible legal reporting.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-primary">5. Disclaimer</h2>
            <p>
              {SITE_NAME} acts as a matrimonial platform to facilitate candidate discovery. Families
              are advised to conduct their own independent background checks, astrological matches,
              and customary verifications before finalizing alliances.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
