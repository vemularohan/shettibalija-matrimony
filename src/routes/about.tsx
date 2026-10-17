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
    <div className="min-h-screen bg-gradient-to-b from-[#21083F]/[0.02] via-[#F8F7F4] to-[#F8F7F4] py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 flex flex-col items-center">
          <div className="relative mb-6 rounded-3xl bg-white p-3.5 shadow-xl border border-[#D9A514]/30">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#D9A514]/20 to-transparent blur-md -z-10" />
            <ShettibalijaLogo size="xl" priority />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#D9A514]">
            {SITE_NAME_TE} • HERITAGE &amp; COMMUNITY
          </span>

          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#21083F]">
            About {SITE_NAME}
          </h1>

          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            A premium matrimonial platform founded to unite Telugu-speaking {COMMUNITY_NAME}{" "}
            families across Andhra Pradesh, Telangana, and the global diaspora.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="rounded-3xl border border-[#D9A514]/25 bg-white p-2 sm:p-4 shadow-sm">
            <CardContent className="p-6 md:p-8 space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#21083F] border-b border-[#D9A514]/20 pb-3">
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
                diluted, our platform focuses exclusively on verified families, ensuring trust,
                privacy, and authentic matchmaking.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="rounded-3xl border border-[#D9A514]/20 bg-white shadow-xs hover:border-[#D9A514]/50 transition-all">
              <CardContent className="p-6 space-y-2.5">
                <div className="rounded-2xl bg-[#087A32]/10 p-3 w-fit text-[#087A32]">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#21083F]">Verified Profiles</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Every member profile is reviewed before publication to protect candidates from
                  spam and fraudulent listings.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-[#D9A514]/20 bg-white shadow-xs hover:border-[#D9A514]/50 transition-all">
              <CardContent className="p-6 space-y-2.5">
                <div className="rounded-2xl bg-rose-50 p-3 w-fit text-rose-600">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#21083F]">Privacy First</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Photos and family contact details remain locked until mutual interest or access is
                  explicitly authorized.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-[#D9A514]/20 bg-white shadow-xs hover:border-[#D9A514]/50 transition-all">
              <CardContent className="p-6 space-y-2.5">
                <div className="rounded-2xl bg-[#21083F]/10 p-3 w-fit text-[#21083F]">
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

          <div className="rounded-3xl border border-[#D9A514]/30 bg-gradient-to-br from-[#21083F] via-[#2A0A4E] to-[#351064] p-8 sm:p-10 text-center text-white shadow-xl relative overflow-hidden">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#D9A514]/15 blur-3xl" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide">
              Ready to find someone who belongs with you?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-white/80">
              Join verified {COMMUNITY_NAME} families who trust our matrimonial platform.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#087A32] to-[#0A963E] hover:from-[#034B21] hover:to-[#087A32] text-white font-bold shadow-md border border-[#D9A514]/30"
              >
                <Link to="/register">Create Your Profile →</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md font-semibold"
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
