import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Heart, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME, SITE_NAME_TE, COMMUNITY_NAME } from "@/lib/site";
import { ShettibalijaLogo } from "@/components/brand/logo";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: `About Us | ${SITE_NAME}` },
      {
        name: "description",
        content: `About ${SITE_NAME} - Dedicated matrimonial platform for ${COMMUNITY_NAME} families`,
      },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EA] py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 flex flex-col items-center">
          <div className="mb-6 rounded-xl border border-[#E4DDD3] bg-white p-3.5 shadow-sm">
            <ShettibalijaLogo size="xl" priority />
          </div>

          <span className="text-xs font-semibold uppercase tracking-widest text-[#087333]">
            {SITE_NAME_TE} • HERITAGE &amp; COMMUNITY
          </span>

          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#24103F] sm:text-5xl">
            About {SITE_NAME}
          </h1>

          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            A premium matrimonial platform founded to unite Telugu-speaking {COMMUNITY_NAME}{" "}
            families across Andhra Pradesh, Telangana, and the global diaspora.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="rounded-xl border border-[#E4DDD3] bg-white p-2 shadow-none sm:p-4">
            <CardContent className="p-6 md:p-8 space-y-4">
              <h2 className="border-b border-[#E4DDD3] pb-3 font-serif text-2xl font-semibold text-[#24103F]">
                Our Purpose &amp; Heritage
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Marriage is a sacred union of two families, traditions, and values. {SITE_NAME} was
                established to provide a dedicated, secure, and respectful matrimonial platform
                tailored specifically for the {COMMUNITY_NAME} community.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                We understand the unique cultural heritage, customs, and aspirations of our
                community. Unlike generic mass matrimonial websites where cultural context is
                diluted, our platform focuses on community-specific discovery, thoughtful profile
                review, privacy, and authentic matchmaking.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="rounded-xl border border-[#E4DDD3] bg-white shadow-none transition-colors hover:border-[#087333]/40">
              <CardContent className="p-6 space-y-2.5">
                <div className="w-fit rounded-lg bg-[#087333]/10 p-3 text-[#087333]">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#21083F]">Reviewed Profiles</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Every member profile is reviewed before publication to protect candidates from
                  spam and fraudulent listings.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-[#E4DDD3] bg-white shadow-none transition-colors hover:border-[#087333]/40">
              <CardContent className="p-6 space-y-2.5">
                <div className="w-fit rounded-lg bg-rose-50 p-3 text-rose-700">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#21083F]">Privacy First</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Photos and family contact details remain locked until mutual interest or access is
                  explicitly authorized.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-[#E4DDD3] bg-white shadow-none transition-colors hover:border-[#087333]/40">
              <CardContent className="p-6 space-y-2.5">
                <div className="w-fit rounded-lg bg-[#24103F]/5 p-3 text-[#24103F]">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#21083F]">Community Centric</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Connect with prospective brides and grooms within our gothrams, native towns, and
                  professional spheres with confidence.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-[#24103F] p-8 text-center text-white sm:p-10">
            <h2 className="font-serif text-2xl font-semibold tracking-wide sm:text-3xl">
              Ready to find someone who belongs with you?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-white/80">
              Join {COMMUNITY_NAME} families who are looking for a respectful matrimonial platform.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-white font-semibold text-[#24103F] hover:bg-[#F7F3EA]"
              >
                <Link to="/register">Create Your Profile →</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent font-semibold text-white hover:bg-white/10"
              >
                <Link to="/search">Explore Matches</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
