import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Shield, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMembership } from "@/hooks/use-member-data";
import { supabase } from "@/integrations/supabase/client";
import { formatINRFromPaise } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";
import { SITE_NAME } from "@/lib/site";
import { createPaidOrder, verifyPaidOrder } from "@/functions/payments";
import type { Json } from "@/integrations/supabase/types";
import { useLanguage } from "@/lib/i18n";
import { RequireAuth } from "@/components/shared/require-auth";

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

type RazorpayCheckoutResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name?: string; email?: string };
  theme: { color: string };
  handler: (response: RazorpayCheckoutResponse) => void;
  modal?: { ondismiss?: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => { open: () => void };
  }
}

let razorpayScriptPromise: Promise<void> | null = null;

function ensureRazorpayScript() {
  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;
  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      razorpayScriptPromise = null;
      reject(new Error("Could not load the payment checkout. Please try again."));
    };
    document.head.appendChild(script);
  });
  return razorpayScriptPromise;
}

function MembershipPage() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const isTelugu = lang === "te";
  const queryClient = useQueryClient();
  const activeMembershipQuery = useActiveMembership();
  const [activatingId, setActivatingId] = useState<string | null>(null);

  const plansQuery = useQuery({
    queryKey: ["membership-plans"],
    enabled: Boolean(user),
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

  if (!user) return <RequireAuth>{null}</RequireAuth>;

  async function startPaidPlan(planId: string) {
    if (!user) {
      toast.error("Please sign in before choosing a membership.");
      return;
    }
    setActivatingId(planId);
    try {
      const order = await createPaidOrder({ data: { planId } });
      if (!order.ok) throw new Error(order.message);
      await ensureRazorpayScript();
      if (!window.Razorpay) throw new Error("Payment checkout is unavailable. Please try again.");
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: SITE_NAME,
        description: `${order.planName} membership`,
        order_id: order.orderId,
        prefill: {
          name: String(user.user_metadata?.["full_name"] ?? ""),
          email: user.email ?? "",
        },
        theme: { color: "#24103F" },
        handler: async (response) => {
          try {
            const result = await verifyPaidOrder({
              data: {
                planId: order.planId,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            });
            if (!result.ok) {
              toast.error(result.message);
              setActivatingId(null);
              return;
            }
            toast.success("Payment verified. Your membership is active.");
            void queryClient.invalidateQueries({ queryKey: ["active-membership"] });
            void queryClient.invalidateQueries({ queryKey: ["payments-history"] });
            setActivatingId(null);
          } catch (error) {
            toast.error(
              getErrorMessage(error, "Payment was completed, but membership verification failed."),
            );
            setActivatingId(null);
          }
        },
        modal: { ondismiss: () => setActivatingId(null) },
      });
      checkout.open();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not start the payment."));
      setActivatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3EA]">
      <header className="border-b border-[#E4DDD3] bg-[#F7F3EA] px-4 pb-9 pt-24 sm:pb-12">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">{isTelugu ? "శెట్టిబలిజ సభ్యత్వం" : "Shettibalija membership"}</p>
          <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight text-[#24103F] sm:text-6xl">
            {isTelugu ? "మీ ప్రయాణాన్ని ఎంచుకోండి" : "Choose your journey"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#756A61] sm:text-base">
            {isTelugu
              ? "సమీక్షించిన ప్రొఫైల్‌లను చూడండి. ప్రొఫైల్ యజమాని అభ్యర్థనను అంగీకరించి, తగిన సభ్యత్వం ఉన్నప్పుడే సంప్రదింపు వివరాలు అందుతాయి."
              : "Browse approved profiles. Contact details are shared only after the profile owner accepts a request and an eligible active membership is in place."}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Current Active Plan Status */}
        {user && activeMembershipQuery.isError ? (
          <ErrorState
            title="Could not verify your membership"
            description="Refresh membership status before choosing a plan. This avoids starting a second membership while the current one is unknown."
            onRetry={() => void activeMembershipQuery.refetch()}
          />
        ) : null}

        {user && activeMembershipQuery.data ? (
          <div className="mb-10 rounded-lg border border-[#E4DDD3] bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#087333]" />
                  <h2 className="font-serif text-xl font-medium text-[#24103F]">
                    Your active membership
                  </h2>
                  <Badge variant="outline" className="border-[#087333]/30 text-[#087333]">
                    Active
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Plan:{" "}
                  <span className="font-medium text-foreground">
                    {currentPlan?.name ?? "Active membership"}
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
              title="Membership plans are not available yet"
              description="Please check back later or contact the community office for current membership information."
            />
          ) : (
            <div className="divide-y divide-[#E4DDD3] border-y border-[#E4DDD3]">
              {plansQuery.data.map((plan) => {
                const isFree = (plan.price_paise ?? 0) <= 0;
                const isCurrent = activeMembershipQuery.data?.plan_id === plan.id;
                const benefits = asStringList(plan.benefits);

                return (
                  <div
                    key={plan.id}
                    className={`membership-plan-row ${isCurrent ? "is-current" : ""}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="eyebrow">
                          {isFree
                            ? isTelugu
                              ? "ఉచిత ప్రవేశం"
                              : "Free access"
                            : isTelugu
                              ? "సభ్యత్వ ప్రణాళిక"
                              : "Membership plan"}
                        </p>
                        {isCurrent ? (
                          <Badge
                            variant="outline"
                            className="border-[#087333]/30 text-[10px] text-[#087333]"
                          >
                            {isTelugu ? "ప్రస్తుత ప్రణాళిక" : "Current plan"}
                          </Badge>
                        ) : null}
                      </div>
                      <h3 className="mt-2 font-serif text-2xl font-medium text-[#24103F]">
                        {plan.name}
                      </h3>
                      {plan.description ? (
                        <p className="mt-2 text-sm leading-6 text-[#756A61]">{plan.description}</p>
                      ) : null}
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif text-3xl font-medium text-[#24103F] sm:text-4xl">
                        {isFree ? "Free" : formatINRFromPaise(plan.price_paise)}
                      </span>
                      {plan.duration_days ? (
                        <span className="text-xs font-medium text-[#756A61]">
                          / {plan.duration_days} {isTelugu ? "రోజులు" : "days"}
                        </span>
                      ) : null}
                    </div>

                    <div className="plan-description">
                      <ul className="space-y-2 text-sm">
                        {benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2.5">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#087333]" />
                            <span className="text-[#211D22]">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="plan-action">
                      {!user ? (
                        <Button asChild className="min-h-11 w-full text-sm">
                          <Link to="/login">
                            {isTelugu ? "ఎంచుకోవడానికి లాగిన్ అవ్వండి" : "Sign In to Choose"}
                          </Link>
                        </Button>
                      ) : activeMembershipQuery.isLoading || activeMembershipQuery.isFetching ? (
                        <Button className="min-h-11 w-full text-sm" variant="outline" disabled>
                          {isTelugu ? "సభ్యత్వ స్థితిని చూస్తున్నాం…" : "Checking membership..."}
                        </Button>
                      ) : activeMembershipQuery.isError ? (
                        <Button className="min-h-11 w-full text-sm" variant="outline" disabled>
                          {isTelugu
                            ? "సభ్యత్వ స్థితి అందుబాటులో లేదు"
                            : "Membership status unavailable"}
                        </Button>
                      ) : isCurrent ? (
                        <Button className="min-h-11 w-full text-sm" variant="outline" disabled>
                          {isTelugu ? "ప్రస్తుతం సక్రియంగా ఉంది" : "Currently Active"}
                        </Button>
                      ) : isFree ? (
                        <Button
                          className="min-h-11 w-full text-sm"
                          disabled={activatingId === plan.id}
                          onClick={() => activateFreePlan.mutate(plan.id)}
                        >
                          {activatingId === plan.id
                            ? isTelugu
                              ? "సక్రియం చేస్తున్నాం…"
                              : "Activating..."
                            : isTelugu
                              ? "ఉచిత ప్రణాళికను ప్రారంభించండి"
                              : "Activate Free Plan"}
                        </Button>
                      ) : (
                        <Button
                          className="min-h-11 w-full text-sm"
                          disabled={activatingId === plan.id}
                          onClick={() => void startPaidPlan(plan.id)}
                        >
                          {activatingId === plan.id
                            ? isTelugu
                              ? "చెల్లింపును సిద్ధం చేస్తున్నాం…"
                              : "Preparing checkout..."
                            : isTelugu
                              ? `${plan.name} ఎంచుకోండి`
                              : "Choose " + plan.name}
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
        <div className="mx-auto mt-12 max-w-3xl border-t border-[#E4DDD3] px-4 pt-8 text-center">
          <Shield className="mx-auto mb-3 h-6 w-6 text-[#087333]" />
          <h3 className="font-serif text-xl font-medium text-[#24103F]">
            {isTelugu ? "కమ్యూనిటీకి ప్రాధాన్యతనిచ్చే పరిచయాలు" : "Community-first matchmaking"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#756A61]">
            {isTelugu
              ? "శెట్టిబలిజ సమాజంలో ప్రొఫైల్‌లను కనుగొని కుటుంబాలతో పరిచయం కావడానికి సభ్యత్వ ఫీచర్లు సహాయపడతాయి. ఫోటోలు మరియు సంప్రదింపు వివరాల అభ్యర్థనలు ప్రతి సభ్యుని గోప్యతా ఎంపికలను అనుసరిస్తాయి."
              : "Membership features support profile discovery and member connections within the Shettibalija community. Photo access and contact information requests follow each member's privacy choices."}
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
