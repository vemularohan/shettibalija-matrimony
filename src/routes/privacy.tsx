import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="min-h-screen bg-gradient-to-b from-[#21083F]/[0.02] via-[#F8F7F4] to-[#F8F7F4] py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D9A514]">
            COMMUNITY SECURITY &amp; DATA PRIVACY
          </span>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#21083F]">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Last updated: October 2026
          </p>
        </div>

        <Card className="rounded-3xl border border-[#D9A514]/25 bg-white shadow-sm overflow-hidden">
          <CardContent className="p-6 md:p-10 space-y-6 text-sm text-foreground/90 leading-relaxed">
            <section className="space-y-2 border-b border-[#D9A514]/15 pb-4">
              <h2 className="font-serif text-lg font-bold text-[#21083F]">
                1. Information We Collect
              </h2>
              <p>
                When you create an account, we collect necessary matrimonial details including name,
                contact details, date of birth, educational background, professional details,
                photographs, and optional family background information.
              </p>
            </section>

            <section className="space-y-2 border-b border-[#D9A514]/15 pb-4">
              <h2 className="font-serif text-lg font-bold text-[#21083F]">
                2. Confidentiality of Contact Details
              </h2>
              <p>
                Direct contact phone numbers and personal email addresses are NEVER displayed
                publicly on the open website. Only verified members who request contact and are
                authorized will receive access according to your selected privacy controls.
              </p>
            </section>

            <section className="space-y-2 border-b border-[#D9A514]/15 pb-4">
              <h2 className="font-serif text-lg font-bold text-[#21083F]">3. Photo Protection</h2>
              <p>
                You maintain control over your photograph visibility. You may choose to display your
                photo to logged-in members or lock photos so that only members you explicitly
                approve can view them.
              </p>
            </section>

            <section className="space-y-2 border-b border-[#D9A514]/15 pb-4">
              <h2 className="font-serif text-lg font-bold text-[#21083F]">4. Data Security</h2>
              <p>
                We implement industry-standard encryption, Row Level Security (RLS) policies in our
                cloud database, and secure credential handling. We do not sell or lease personal
                member data to third-party marketing companies.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#21083F]">
                5. Account Deletion &amp; Data Rights
              </h2>
              <p>
                Members may update, hide, or request deletion of their profile at any time through
                their dashboard settings or by reaching out to support@shettibalijamatrimony.org.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
