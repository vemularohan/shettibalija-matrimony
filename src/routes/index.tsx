import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { ShieldCheck, HeartHandshake, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileCard, type PublicProfileCardData } from "@/components/profiles/profile-card";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useProfileActions } from "@/hooks/use-profile-actions";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_PROFILES } from "@/data/demo-profiles";
import { SITE_NAME, SITE_NAME_TE, SITE_TAGLINE } from "@/lib/site";
import { EDUCATION_OPTIONS, OCCUPATION_OPTIONS, STATES } from "@/lib/options";
import { formatINRFromPaise } from "@/lib/format";
import type { Json } from "@/integrations/supabase/types";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: `${SITE_NAME} | Find Your Perfect Life Partner` },
      { name: "description", content: SITE_TAGLINE },
    ],
  }),
});

function HomePage() {
  const navigate = useNavigate();
  const [gender, setGender] = useState("");
  const [minAge, setMinAge] = useState("21");
  const [maxAge, setMaxAge] = useState("35");
  const [state, setState] = useState("");
  const [education, setEducation] = useState("");
  const [occupation, setOccupation] = useState("");
  const actions = useProfileActions();

  function onSearch(event: FormEvent) {
    event.preventDefault();
    void navigate({
      to: "/search",
      search: {
        gender: gender || undefined,
        minAge: minAge ? Number(minAge) : undefined,
        maxAge: maxAge ? Number(maxAge) : undefined,
        state: state || undefined,
        education: education || undefined,
        occupation: occupation || undefined,
      },
    });
  }

  const recent = useQuery({
    queryKey: ["recent-profiles"],
    queryFn: async () => {
      let realProfiles: PublicProfileCardData[] = [];
      try {
        const { data, error } = await supabase
          .from("approved_matrimonial_profiles")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(8);
        if (!error && data) {
          realProfiles = data.filter((p): p is typeof p & { id: string } => Boolean(p.id));
        }
      } catch {
        // Fallback to demo profiles
      }
      const realIds = new Set(realProfiles.map((p) => p.id));
      const demoToAdd = DEMO_PROFILES.filter((d) => !realIds.has(d.id));
      return [...realProfiles, ...demoToAdd].slice(0, 8);
    },
  });

  const featured = useQuery({
    queryKey: ["featured-profiles"],
    queryFn: async () => {
      let realProfiles: PublicProfileCardData[] = [];
      try {
        const { data, error } = await supabase
          .from("approved_matrimonial_profiles")
          .select("*")
          .order("created_at", { ascending: true })
          .limit(4);
        if (!error && data) {
          realProfiles = data.filter((p): p is typeof p & { id: string } => Boolean(p.id));
        }
      } catch {
        // Fallback to demo profiles
      }
      const realIds = new Set(realProfiles.map((p) => p.id));
      const demoPool = [...DEMO_PROFILES.slice(8, 14), ...DEMO_PROFILES.slice(0, 8)];
      const demoToAdd = demoPool.filter((d) => !realIds.has(d.id));
      return [...realProfiles, ...demoToAdd].slice(0, 4);
    },
  });

  const plans = useQuery({
    queryKey: ["membership-plans-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("active", true)
        .order("price_paise", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div>
      <section className="border-b bg-[linear-gradient(180deg,#fffaf5_0%,#fcfbf8_100%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-16">
          <div>
            <p className="text-sm text-gold-foreground">{SITE_NAME_TE}</p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-primary md:text-5xl">
              Find Your Perfect Life Partner
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">{SITE_TAGLINE}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/search">Search Profiles</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/register">Create Your Profile</Link>
              </Button>
            </div>
          </div>
          <form onSubmit={onSearch} className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="font-serif text-2xl">Search profiles</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Looking for">
                <select
                  className={selectClass}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Bride or Groom</option>
                  <option value="bride">Bride</option>
                  <option value="groom">Groom</option>
                </select>
              </Field>
              <Field label="Location">
                <select
                  className={selectClass}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">Any state</option>
                  {STATES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Min age">
                <Input
                  type="number"
                  min={18}
                  max={70}
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                />
              </Field>
              <Field label="Max age">
                <Input
                  type="number"
                  min={18}
                  max={70}
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                />
              </Field>
              <Field label="Education">
                <select
                  className={selectClass}
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                >
                  <option value="">Any</option>
                  {EDUCATION_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Occupation">
                <select
                  className={selectClass}
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                >
                  <option value="">Any</option>
                  {OCCUPATION_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Button type="submit" className="mt-4 w-full">
              Search Profiles
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center font-serif text-3xl">Why Choose Shettibalija Matrimony?</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            {
              icon: Users,
              title: "Verified Community Profiles",
              text: "Profiles are reviewed before they appear in public search.",
            },
            {
              icon: Lock,
              title: "Privacy Protected",
              text: "Photos and contact details stay locked until authorization allows access.",
            },
            {
              icon: HeartHandshake,
              title: "Secure Communication",
              text: "Interest and contact requests stay inside the platform.",
            },
            {
              icon: ShieldCheck,
              title: "Trusted Matrimony Platform",
              text: "Built specifically for Shettibalija families in Telangana and Andhra Pradesh.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-none shadow-sm">
              <CardContent className="p-5">
                <item.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-medium">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <ProfileStrip title="Recently Joined Profiles" query={recent} actions={actions} />
      <ProfileStrip title="Featured Profiles" query={featured} actions={actions} muted />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center font-serif text-3xl">How It Works</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {["Create Your Profile", "Discover Matches", "Connect", "Find Your Life Partner"].map(
            (step, index) => (
              <li key={step} className="rounded-2xl border bg-card p-5 shadow-sm">
                <span className="text-sm font-semibold text-gold-foreground">Step {index + 1}</span>
                <p className="mt-2 font-serif text-xl">{step}</p>
              </li>
            ),
          )}
        </ol>
      </section>

      <section className="bg-muted/60 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl">Membership Plans</h2>
            <Button asChild variant="outline">
              <Link to="/membership">View all</Link>
            </Button>
          </div>
          {plans.isLoading ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          ) : plans.isError ? (
            <div className="mt-6">
              <ErrorState onRetry={() => void plans.refetch()} />
            </div>
          ) : !plans.data?.length ? (
            <div className="mt-6">
              <EmptyState
                title="Plans will be published soon"
                description="Membership options are managed from the database. Nothing is listed yet."
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {plans.data.map((plan) => (
                <Card key={plan.id}>
                  <CardContent className="p-6">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-serif text-2xl">{plan.name}</h3>
                      <p className="text-lg font-semibold text-primary">
                        {formatINRFromPaise(plan.price_paise)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                    <ul className="mt-4 space-y-1 text-sm">
                      {asStringArray(plan.benefits).map((benefit) => (
                        <li key={benefit}>• {benefit}</li>
                      ))}
                    </ul>
                    <Button asChild className="mt-5">
                      <Link to="/membership">Choose Plan</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-3xl border bg-card px-6 py-10 text-center shadow-sm md:px-12">
          <h2 className="font-serif text-3xl">Community Focused Matrimony</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Shettibalija Matrimony is created for the Shettibalija community — శెట్టిబలిజ సంఘం —
            with families in Telangana and Andhra Pradesh in mind. The platform stays simple,
            respectful, and private so families can search with confidence.
          </p>
        </div>
      </section>
    </div>
  );
}

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ProfileStrip({
  title,
  query,
  actions,
  muted = false,
}: {
  title: string;
  query: {
    isLoading: boolean;
    isError: boolean;
    data?: PublicProfileCardData[] | undefined;
    refetch: () => unknown;
  };
  actions: ReturnType<typeof useProfileActions>;
  muted?: boolean;
}) {
  return (
    <section className={muted ? "bg-muted/50 py-14" : "py-14"}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-serif text-3xl">{title}</h2>
        {query.isLoading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-80" />
            ))}
          </div>
        ) : query.isError ? (
          <div className="mt-6">
            <ErrorState onRetry={() => void query.refetch()} />
          </div>
        ) : !query.data?.length ? (
          <div className="mt-6">
            <EmptyState
              title="No approved profiles yet"
              description="Approved, visible profiles from the database will appear here."
              actionLabel="Create Your Profile"
              onAction={() => {
                window.location.href = "/register";
              }}
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {query.data
              .filter((p): p is typeof p & { id: string } => Boolean(p.id))
              .map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  shortlisted={actions.shortlistedIds.has(profile.id)}
                  interestSent={actions.sentInterests.has(profile.id)}
                  onShortlist={() => actions.toggleShortlist.mutate(profile.id)}
                  onInterest={() => actions.sendInterest.mutate(profile.id)}
                />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}

async function loadProfiles() {
  const { data, error } = await supabase.from("approved_matrimonial_profiles").select("*").limit(8);
  if (error) throw error;
  return data ?? [];
}

function asStringArray(value: Json): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}
