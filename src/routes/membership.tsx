import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Crown, Shield, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMembership } from "@/hooks/use-member-data";
import { supabase } from "@/integrations/supabase/client";
import { formatINRFromPaise } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";
import { SITE_NAME } from "@/lib/site";
import type { Json } from "@/integrations/supabase/types";

export const Route = createFileRoute("/membership")({
  component: MembershipPage,
  head: () => ({
    meta: [
      { title: `Membership Plans | ${SITE_NAME}` },
      {
        name: "description",
        content: "Choose a membership plan to unlock contact details and full photos",
      },
    ],
  }),
});

function MembershipPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const activeMembershipQuery = useActiveMembership();
  const [activatingId, setActivatingId] = useState<string | null>(null);

  const plansQuery = useQuery({
    queryKey: ["membership-plans"],
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

  const activateFreePlan = useMutation({
    mutationFn: async (planId: string) => {
      if (!user) throw new Error("Please log in to activate a membership plan.");
      setActivatingId(planId);
      const { data, error } = await supabase.rpc("activate_free_membership", {
        p_plan_id: planId,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Membership plan activated successfully!");
      void queryClient.invalidateQueries({ queryKey: ["active-membership"] });
      setActivatingId(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Could not activate membership plan."));
      setActivatingId(null);
    },
  });

  const currentPlan = activeMembershipQuery.data?.membership_plans;

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Cinematic Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#21083F] via-[#2d0c54] to-[#351064] text-white pt-24 pb-14 px-4 border-b border-[#D9A514]/30">
        <div className="mx-auto max-w-6xl text-center">
          <Badge
            variant="outline"
            className="mb-3 px-3.5 py-1 text-[#F4D477] border-[#D9A514]/40 bg-black/30 backdrop-blur-md"
          >
            <Crown className="mr-1.5 h-3.5 w-3.5 text-[#D9A514]" />
            Sangham Community Membership
          </Badge>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
            Membership Plans
          </h1>
          <p className="mt-3 text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Connect directly with prospective matches, unlock verified contact details, and view
            full photo albums with confidence.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Current Active Plan Status */}
        {user && activeMembershipQuery.data ? (
          <div className="mb-10 rounded-2xl border bg-primary/5 p-6 border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold-foreground" />
                  <h2 className="font-serif text-xl font-semibold">Your Active Membership</h2>
                  <Badge className="bg-emerald-600">Active</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Plan:{" "}
                  <span className="font-medium text-foreground">
                    {currentPlan?.name ?? "Standard"}
                  </span>
                  {activeMembershipQuery.data.expires_at ? (
                    <>
                      {" "}
                      • Valid until{" "}
                      {new Date(activeMembershipQuery.data.expires_at).toLocaleDateString()}
                    </>
                  ) : (
                    <> • Ongoing plan</>
                  )}
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        ) : null}

        {/* Plans List */}
        <div>
          {plansQuery.isLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-2xl" />
              ))}
            </div>
          ) : plansQuery.isError ? (
            <ErrorState
              title="Could not load membership plans"
              description="There was an issue fetching the membership options from the database."
              onRetry={() => void plansQuery.refetch()}
            />
          ) : !plansQuery.data?.length ? (
            <EmptyState
              title="Membership plans are being updated"
              description="Community membership options will be published soon. Please contact the office for assistance."
            >
              <div className="mt-5">
                <Button asChild variant="outline">
                  <Link to="/contact">Contact Community Office</Link>
                </Button>
              </div>
            </EmptyState>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {plansQuery.data.map((plan, idx) => {
                const isFree = (plan.price_paise ?? 0) <= 0;
                const isCurrent = activeMembershipQuery.data?.plan_id === plan.id;
                const isRecommended =
                  plan.name.toLowerCase().includes("vip") ||
                  plan.name.toLowerCase().includes("gold") ||
                  (!isFree && idx === 1);
                const benefits = asStringList(plan.benefits);

                return (
                  <Card
                    key={plan.id}
                    className={`relative flex flex-col rounded-3xl transition-all duration-200 overflow-hidden ${
                      isRecommended
                        ? "border-2 border-[#D9A514] bg-white shadow-xl shadow-[#D9A514]/10 -translate-y-0.5"
                        : isCurrent
                          ? "border-[#087A32] shadow-sm bg-white"
                          : "border-border/70 hover:border-[#D9A514]/50 bg-white"
                    }`}
                  >
                    {isRecommended ? (
                      <div className="bg-gradient-to-r from-[#21083F] via-[#351064] to-[#21083F] text-[#F4D477] py-1.5 px-4 text-center text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 border-b border-[#D9A514]/30">
                        <Sparkles className="h-3.5 w-3.5 text-[#D9A514]" />
                        Sangham Recommended Plan
                      </div>
                    ) : null}

                    <CardHeader className="pt-6">
                      {isCurrent ? (
                        <Badge className="w-fit mb-2 bg-[#087A32] text-white">
                          Current Active Plan
                        </Badge>
                      ) : null}
                      <CardTitle className="font-serif text-2xl text-[#21083F]">
                        {plan.name}
                      </CardTitle>
                      <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-bold text-[#21083F]">
                          {isFree ? "Free" : formatINRFromPaise(plan.price_paise)}
                        </span>
                        {plan.duration_days ? (
                          <span className="text-xs text-muted-foreground font-medium">
                            / {plan.duration_days} days
                          </span>
                        ) : null}
                      </div>
                      {plan.description ? (
                        <CardDescription className="mt-2 text-xs sm:text-sm">
                          {plan.description}
                        </CardDescription>
                      ) : null}
                    </CardHeader>

                    <CardContent className="flex-1">
                      <ul className="space-y-3 text-xs sm:text-sm">
                        {benefits.map((b) => (
                          <li key={b} className="flex items-start gap-2.5">
                            <div className="mt-0.5 rounded-full bg-emerald-50 p-1 text-emerald-600 shrink-0">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-foreground/90">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pt-4 pb-6 border-t border-border/50">
                      {!user ? (
                        <Button
                          asChild
                          className="w-full min-h-[46px] rounded-xl text-sm font-semibold touch-press"
                        >
                          <Link to="/login">Sign In to Choose</Link>
                        </Button>
                      ) : isCurrent ? (
                        <Button
                          className="w-full min-h-[46px] rounded-xl text-sm font-semibold"
                          variant="outline"
                          disabled
                        >
                          Currently Active
                        </Button>
                      ) : isFree ? (
                        <Button
                          className="w-full min-h-[46px] rounded-xl text-sm font-semibold touch-press bg-[#21083F] hover:bg-[#351064] text-white"
                          disabled={activatingId === plan.id}
                          onClick={() => activateFreePlan.mutate(plan.id)}
                        >
                          {activatingId === plan.id ? "Activating..." : "Activate Free Plan"}
                        </Button>
                      ) : (
                        <Button
                          variant={isRecommended ? "premium" : "default"}
                          className={`w-full min-h-[46px] rounded-xl text-sm font-semibold touch-press ${
                            isRecommended
                              ? "bg-gradient-to-r from-[#D9A514] via-[#F4D477] to-[#D9A514] text-[#21083F] hover:brightness-105 shadow-md font-bold"
                              : "bg-[#21083F] hover:bg-[#351064] text-white"
                          }`}
                          onClick={() => {
                            toast.info(
                              "Online payment gateway integration is currently being enabled. Please contact our community coordinators to activate this plan directly.",
                            );
                          }}
                        >
                          Choose {plan.name}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Trust & Safe Guarantee */}
        <div className="mt-16 rounded-3xl border bg-card p-8 text-center max-w-3xl mx-auto shadow-sm">
          <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-serif text-xl font-semibold">100% Verified Community Network</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            All memberships directly support the maintenance and verification of profiles within the
            Shettibalija community. Photo access and contact information requests respect each
            member's privacy choices.
          </p>
        </div>
      </div>
    </div>
  );
}

function asStringList(value: Json): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}
