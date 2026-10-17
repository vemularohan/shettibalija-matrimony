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
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Editorial Plaque Banner */}
      <div
        className="relative overflow-hidden text-white pt-24 pb-16 px-4 border-b border-[#E4DDD3]"
        style={{ background: "linear-gradient(160deg, #1e0c35 0%, #24103F 50%, #1a0b30 100%)" }}
      >
        <div className="mx-auto max-w-4xl text-center">
          {/* Subtle gold ornamental rule */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#D1A329]/50" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#D1A329]">
              Shettibalija Sangham
            </span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#D1A329]/50" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white">
            Membership Plans
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
            Honest, verified matrimonial connections for the Shettibalija community. Unlock contact
            numbers and full family details once both sides express mutual interest.
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {(plansQuery.data && plansQuery.data.length > 0
                ? plansQuery.data
                : [
                    {
                      id: "plan-free",
                      name: "Basic Member",
                      price_paise: 0,
                      duration_days: null,
                      description: "Ideal for registering your profile and browsing verified community matches.",
                      benefits: [
                        "Create & manage matrimonial profile",
                        "Browse verified community profiles",
                        "Send up to 10 interests per month",
                        "Shortlist prospective matches",
                        "Photo protection controls",
                      ],
                    },
                    {
                      id: "plan-gold",
                      name: "Sangham Premium",
                      price_paise: 249900,
                      duration_days: 90,
                      description: "Complete access with verified contact numbers and direct family introductions.",
                      benefits: [
                        "All Basic Member features",
                        "Direct phone & WhatsApp contact unlock",
                        "Unlimited express interest requests",
                        "Full family background & horoscope access",
                        "Sangham coordinator assistance",
                      ],
                    },
                    {
                      id: "plan-vip",
                      name: "Sangham Elite",
                      price_paise: 499900,
                      duration_days: 180,
                      description: "Priority matchmaking with senior community elders & verified distinction badge.",
                      benefits: [
                        "All Premium features included",
                        "Priority profile placement in search",
                        "Personalized horoscope matching review",
                        "Elder introduction assistance",
                        "6 months active validity & dedicated support",
                      ],
                    },
                  ]
              ).map((plan, idx) => {
                const isFree = (plan.price_paise ?? 0) <= 0;
                const isCurrent = activeMembershipQuery.data?.plan_id === plan.id;
                const isRecommended =
                  plan.name.toLowerCase().includes("vip") ||
                  plan.name.toLowerCase().includes("gold") ||
                  (!isFree && idx === 1);
                const benefits = asStringList(plan.benefits);

                return (
                  <div
                    key={plan.id}
                    className="relative flex flex-col rounded-xl p-6 sm:p-7 transition-all duration-300"
                    style={
                      isRecommended
                        ? {
                            background: "linear-gradient(145deg, #fdfcf9 0%, #f5f0e8 100%)",
                            border: "1px solid rgba(209,163,41,0.38)",
                            boxShadow:
                              "0 1px 0 rgba(255,255,255,0.95), 0 8px 24px rgba(36,16,63,0.09), 0 0 0 1px rgba(209,163,41,0.15), inset 0 1px 0 rgba(255,255,255,0.7)",
                          }
                        : {
                            background: "#ffffff",
                            border: "1px solid rgba(228,221,211,1)",
                            boxShadow:
                              "0 1px 2px rgba(36,16,63,0.04), 0 4px 12px rgba(36,16,63,0.05)",
                          }
                    }
                  >
                    {/* Inner gold plaque rule for recommended */}
                    {isRecommended && (
                      <div
                        className="absolute inset-3 rounded-lg pointer-events-none"
                        style={{ border: "1px solid rgba(209,163,41,0.20)" }}
                      />
                    )}

                    {isRecommended && (
                      <div className="absolute -top-3 left-6">
                        <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#087333] text-white px-2.5 py-1 rounded-sm shadow-xs">
                          Sangham Recommended
                        </span>
                      </div>
                    )}

                    <div className="pt-2">
                      {isCurrent ? (
                        <span className="inline-block mb-2 text-[10px] font-semibold tracking-wider uppercase bg-[#087333]/10 text-[#087333] px-2 py-0.5 rounded-sm">
                          Current Active Plan
                        </span>
                      ) : null}
                      <h3 className="font-serif text-2xl text-[#24103F] font-medium">
                        {plan.name}
                      </h3>
                      <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-semibold text-[#24103F]">
                          {isFree ? "Free" : formatINRFromPaise(plan.price_paise)}
                        </span>
                        {plan.duration_days ? (
                          <span className="text-xs text-[#6B6570] font-medium">
                            / {plan.duration_days} days
                          </span>
                        ) : null}
                      </div>
                      {plan.description ? (
                        <p className="mt-2 text-xs sm:text-sm text-[#6B6570]">
                          {plan.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="my-6 h-px bg-[#E4DDD3]" />

                    <div className="flex-1">
                      <ul className="space-y-3 text-xs sm:text-sm">
                        {benefits.map((b) => (
                          <li key={b} className="flex items-start gap-2.5">
                            <div className="mt-0.5 rounded-full bg-[#087333]/10 p-1 text-[#087333] shrink-0">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-[#242024]">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 mt-6 border-t border-[#E4DDD3]">
                      {!user ? (
                        <Button
                          asChild
                          className="w-full min-h-[44px] rounded-md text-xs font-semibold bg-[#24103F] hover:bg-[#311552] text-white shadow-[0_2px_8px_rgba(36,16,63,0.18)] active:translate-y-px transition-all"
                        >
                          <Link to="/login">Sign In to Choose</Link>
                        </Button>
                      ) : isCurrent ? (
                        <Button
                          className="w-full min-h-[44px] rounded-md text-xs font-semibold"
                          variant="outline"
                          disabled
                        >
                          Currently Active
                        </Button>
                      ) : isFree ? (
                        <Button
                          className="w-full min-h-[44px] rounded-md text-xs font-semibold bg-[#24103F] hover:bg-[#311552] text-white shadow-[0_2px_8px_rgba(36,16,63,0.18)] active:translate-y-px transition-all"
                          disabled={activatingId === plan.id}
                          onClick={() => activateFreePlan.mutate(plan.id)}
                        >
                          {activatingId === plan.id ? "Activating..." : "Activate Free Plan"}
                        </Button>
                      ) : (
                        <Button
                          className={`w-full min-h-[44px] rounded-md text-xs font-semibold active:translate-y-px transition-all ${
                            isRecommended
                              ? "bg-[#24103F] hover:bg-[#311552] text-white shadow-[0_2px_8px_rgba(36,16,63,0.22)]"
                              : "bg-[#24103F] hover:bg-[#311552] text-white shadow-xs"
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
                    </div>
                  </div>
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
