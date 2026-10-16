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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center">
        <ShettibalijaLogo size="xl" className="mb-4" />
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          {SITE_NAME_TE}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-primary md:text-5xl">
          About {SITE_NAME}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          A matrimonial service founded to unite Telugu-speaking {COMMUNITY_NAME} families across
          Telangana, Andhra Pradesh, and abroad.
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardContent className="p-6 md:p-8 space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">Our Purpose</h2>
            <p className="text-muted-foreground leading-relaxed">
              Marriage is a union of two families, traditions, and values. {SITE_NAME} was
              established to provide a dedicated, secure, and respectful matrimonial platform
              tailored specifically for the {COMMUNITY_NAME} community.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We understand the unique cultural heritage, customs, and aspirations of our community.
              Unlike mass matrimonial websites where community context is lost, our platform focuses
              exclusively on verified families, ensuring trust, privacy, and genuine matchmaking.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 space-y-2">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="font-serif text-xl font-semibold">Verified Profiles</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every member profile is reviewed before publication to protect candidates from spam
                and fraudulent listings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2">
              <Heart className="h-6 w-6 text-primary" />
              <h3 className="font-serif text-xl font-semibold">Privacy First</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Photos and family contact details remain locked until mutual interest or access is
                explicitly granted.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2">
              <Users className="h-6 w-6 text-primary" />
              <h3 className="font-serif text-xl font-semibold">Community Centric</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect with prospective brides and grooms within our sub-sects and native regions
                with confidence.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-3xl border bg-muted/30 p-8 text-center">
          <h2 className="font-serif text-2xl font-bold">Ready to find your life partner?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Join hundreds of {COMMUNITY_NAME} families who trust our matrimonial community.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/register">Create Profile</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/search">Search Profiles</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
