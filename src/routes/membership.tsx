import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Check, CreditCard, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMembership } from "@/hooks/use-member-data";
import { createPaidOrder, verifyPaidOrder } from "@/functions/payments";
import { supabase } from "@/integrations/supabase/client";
import { formatINRFromPaise } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";
import { SITE_NAME } from "@/lib/site";
import { useLanguage } from "@/lib/i18n";
import { MARKETING_COUPLE_IMAGES } from "@/data/marketing-couples";
import type { Json } from "@/integrations/supabase/types";

export const Route = createFileRoute("/membership")({
  component: MembershipPage,
  head: () => ({
    meta: [
      { title: `Membership | ${SITE_NAME}` },
      {
        name: "description",
        content:
          "Current Shettibalija Matrimony membership plans, their benefits and payment options.",
      },
    ],
  }),
});

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = { open: () => void };

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(Boolean(window.Razorpay)));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset["razorpay"] = "true";
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function MembershipPage() {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const activeMembershipQuery = useActiveMembership();
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const createOrder = useServerFn(createPaidOrder);
  const verifyOrder = useServerFn(verifyPaidOrder);

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
      toast.success("Free membership activated.");
      void queryClient.invalidateQueries({ queryKey: ["active-membership"] });
      setActivatingId(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not activate the free plan."));
      setActivatingId(null);
    },
  });

  async function startPaidCheckout(planId: string, planName: string) {
    if (!user) {
      window.location.assign(`/login?returnTo=${encodeURIComponent("/membership")}`);
      return;
    }

    setActivatingId(planId);
    try {
      const order = await createOrder({ data: { planId } });
      if (!order.ok) {
        toast.error(order.message);
        setActivatingId(null);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) {
        toast.error("The payment window could not be loaded. Please try again or contact support.");
        setActivatingId(null);
        return;
      }

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: SITE_NAME,
        description: planName,
        order_id: order.orderId,
        prefill: {
          name: user.user_metadata?.["full_name"] ?? "",
          email: user.email ?? "",
        },
        theme: { color: "#24103F" },
        modal: {
          ondismiss: () => setActivatingId(null),
        },
        handler: async (response: RazorpayResponse) => {
          try {
            const verified = await verifyOrder({
              data: {
                planId,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            });
            if (!verified.ok) {
              toast.error(verified.message);
              return;
            }
            toast.success("Payment confirmed. Your membership is now active.");
            await queryClient.invalidateQueries({ queryKey: ["active-membership"] });
            await queryClient.invalidateQueries({ queryKey: ["payments-history"] });
          } catch (error) {
            toast.error(getErrorMessage(error, "We could not confirm the payment."));
          } finally {
            setActivatingId(null);
          }
        },
      });
      checkout.open();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not start checkout."));
      setActivatingId(null);
    }
  }

  const currentPlanId = activeMembershipQuery.data?.plan_id;
  const currentPlan = activeMembershipQuery.data?.membership_plans;

  return (
    <div className="sbm-page bg-[#FAF8F3]">
      <header className="relative overflow-hidden bg-[#24103F] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#D1A329]/20" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-[#D1A329]/10" />
        </div>
        <div className="sbm-container relative py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <span className="sbm-kicker sbm-kicker--light">
                {lang === "te" ? "సభ్యత్వం" : "Membership"}
              </span>
              <h1 className="sbm-display sbm-display--light sbm-display--member mt-5 max-w-2xl">
                {lang === "te" ? (
                  <>
                    మీ అన్వేషణకు
                    <br />
                    <em>సహాయం, ఒత్తిడి కాదు.</em>
                  </>
                ) : (
                  <>
                    Support for the search,
                    <br />
                    <em>never pressure.</em>
                  </>
                )}
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/70">
                {lang === "te"
                  ? "ఉచిత ఖాతాతో ప్రారంభించండి. చెల్లింపు ప్రణాళికలు అందుబాటులో ఉంటే, వాటి ప్రయోజనాలు మరియు ధర ఇక్కడ కనిపిస్తాయి. మీ అన్వేషణకు నిజంగా సహాయపడితే మాత్రమే ఎంచుకోండి."
                  : "Start with a free account. If paid plans are available, they will appear here with their benefits and price. Choose one only if it genuinely helps your search."}
              </p>
            </div>

            <div className="border-t border-white/15 pt-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#D1A329]" aria-hidden />
                <p className="text-[12px] leading-6 text-white/65">
                  {lang === "te"
                    ? "చెల్లింపులు Razorpay ద్వారా సురక్షితంగా నిర్వహించబడతాయి. చెల్లింపు నిర్ధారణ తర్వాత మాత్రమే సభ్యత్వం యాక్టివ్ అవుతుంది."
                    : "Payments are processed securely by Razorpay. Membership activates only after the payment is confirmed by the server."}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-white/50">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3 w-3" aria-hidden />
                  {lang === "te" ? "సురక్షిత చెల్లింపు" : "Secure checkout"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard className="h-3 w-3" aria-hidden />
                  {lang === "te" ? "భారతీయ రూపాయలు" : "INR payments"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="sbm-container pb-20 pt-10 sm:pt-14">
        {user && activeMembershipQuery.data ? (
          <div className="mb-10 flex flex-col justify-between gap-4 border border-[#087333]/25 bg-[#eef5f0] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#087333]">
                {lang === "te" ? "ప్రస్తుత సభ్యత్వం" : "Current membership"}
              </p>
              <p className="mt-1 font-serif text-2xl text-[#24103F]">
                {currentPlan?.name ?? "Active plan"}
              </p>
              <p className="mt-1 text-[12px] text-[#6B6570]">
                {activeMembershipQuery.data.expires_at
                  ? `${lang === "te" ? "వరకు చెల్లుబాటు" : "Valid until"} ${new Date(
                      activeMembershipQuery.data.expires_at,
                    ).toLocaleDateString()}`
                  : lang === "te"
                    ? "కొనసాగుతున్న ప్లాన్"
                    : "Ongoing plan"}
              </p>
            </div>
            <Link to="/dashboard" className="sbm-button sbm-button--outline shrink-0">
              {lang === "te" ? "డ్యాష్‌బోర్డ్" : "Go to dashboard"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}

        {plansQuery.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="sbm-skeleton h-52 w-full" />
            ))}
          </div>
        ) : plansQuery.isError ? (
          <div className="border border-[#ded5c8] bg-white px-6 py-16 text-center">
            <h2 className="font-serif text-3xl text-[#24103F]">
              {lang === "te" ? "ప్రణాళికలు లోడ్ కాలేదు." : "Plans could not be loaded."}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6B6570]">
              {lang === "te"
                ? "దయచేసి కొద్ది సేపటి తర్వాత మళ్లీ ప్రయత్నించండి."
                : "Please try again in a moment. Your free account is unaffected."}
            </p>
            <button
              type="button"
              onClick={() => void plansQuery.refetch()}
              className="sbm-button sbm-button--primary mt-6"
            >
              {lang === "te" ? "మళ్లీ ప్రయత్నించండి" : "Try again"}
            </button>
          </div>
        ) : !plansQuery.data?.length ? (
          <div className="grid gap-6 border-y border-[#ded5c8] py-10 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h2 className="font-serif text-3xl text-[#24103F]">
                {lang === "te" ? "సభ్యత్వం ఇంకా తెరవలేదు." : "Membership is not open yet."}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#6B6570]">
                {lang === "te"
                  ? "ప్రస్తుతం చురుకైన చెల్లింపు ప్రణాళికలు లేవు. మీ ఉచిత ఖాతా యథావిధిగా పనిచేస్తుంది. ప్రణాళికలు తెరిచినప్పుడు తెలియజేయమని కోరుకుంటే మాకు రాయండి."
                  : "There are no active paid plans at the moment. Your free account continues to work as normal. Write to us if you would like to be told when plans open."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link to="/search" className="sbm-button sbm-button--primary">
                {lang === "te" ? "ప్రొఫైల్స్ చూడండి" : "Discover profiles"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="sbm-button sbm-button--outline">
                {lang === "te" ? "సంప్రదించండి" : "Ask about membership"}
              </Link>
            </div>
          </div>
        ) : (
          <div className="border-y border-[#ded5c8]">
            {plansQuery.data.map((plan) => {
              const isFree = (plan.price_paise ?? 0) <= 0;
              const isCurrent = currentPlanId === plan.id;
              const benefits = asStringList(plan.benefits);
              const price = isFree
                ? lang === "te"
                  ? "ఉచితం"
                  : "Free"
                : formatINRFromPaise(plan.price_paise ?? 0);
              const busy = activatingId === plan.id;

              return (
                <article
                  key={plan.id}
                  className="grid gap-6 border-b border-[#ded5c8] py-8 last:border-b-0 lg:grid-cols-[1.35fr_1fr] lg:gap-12 lg:py-10"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-serif text-3xl text-[#24103F]">{plan.name}</h2>
                      {isCurrent ? (
                        <span className="border border-[#087333]/25 bg-[#087333]/8 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#087333]">
                          {lang === "te" ? "ప్రస్తుతం" : "Current"}
                        </span>
                      ) : null}
                    </div>
                    {plan.description ? (
                      <p className="mt-2 max-w-xl text-[13px] leading-7 text-[#6B6570]">
                        {plan.description}
                      </p>
                    ) : null}

                    {benefits.length > 0 ? (
                      <ul className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                        {benefits.map((benefit) => (
                          <li
                            key={benefit}
                            className="flex items-start gap-2 text-[12px] leading-6 text-[#514a57]"
                          >
                            <Check
                              className="mt-1 h-3.5 w-3.5 shrink-0 text-[#087333]"
                              aria-hidden
                            />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-5 text-[12px] text-[#6B6570]">
                        {lang === "te"
                          ? "ప్రయోజనాల వివరాలు త్వరలో."
                          : "Benefit details are being finalised for this plan."}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col justify-between border-t border-[#e5ddd1] pt-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                    <div>
                      <p className="font-serif text-4xl leading-none text-[#24103F]">{price}</p>
                      <p className="mt-2 text-[11px] text-[#6B6570]">
                        {isFree
                          ? lang === "te"
                            ? "చెల్లింపు అవసరం లేదు"
                            : "No payment required"
                          : plan.duration_days
                            ? `${lang === "te" ? "వ్యవధి" : "For"} ${plan.duration_days} ${lang === "te" ? "రోజులు" : "days"}`
                            : lang === "te"
                              ? "ఒకసారి చెల్లింపు"
                              : "One-time plan"}
                      </p>
                    </div>

                    <div className="mt-6">
                      {!user ? (
                        <Link
                          to="/login"
                          search={{ returnTo: "/membership" }}
                          className="sbm-button sbm-button--primary w-full"
                        >
                          {lang === "te" ? "లాగిన్ చేసి ఎంచుకోండి" : "Sign in to choose"}
                        </Link>
                      ) : isCurrent ? (
                        <button
                          type="button"
                          disabled
                          className="sbm-button w-full cursor-not-allowed border border-[#ded5c8] bg-[#f4f0e9] text-[#6B6570]"
                        >
                          {lang === "te" ? "ప్రస్తుతం యాక్టివ్" : "Currently active"}
                        </button>
                      ) : isFree ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => activateFreePlan.mutate(plan.id)}
                          className="sbm-button sbm-button--outline w-full"
                        >
                          {busy
                            ? lang === "te"
                              ? "యాక్టివేట్ అవుతోంది..."
                              : "Activating..."
                            : lang === "te"
                              ? "ఉచిత ప్లాన్ యాక్టివేట్ చేయండి"
                              : "Activate free plan"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void startPaidCheckout(plan.id, plan.name)}
                          className="sbm-button sbm-button--primary w-full"
                        >
                          {busy
                            ? lang === "te"
                              ? "తయారవుతోంది..."
                              : "Preparing checkout..."
                            : lang === "te"
                              ? "ప్లాన్ ఎంచుకోండి"
                              : "Choose this plan"}
                          {!busy ? <ArrowRight className="h-4 w-4" /> : null}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-14 grid gap-8 border-t border-[#ded5c8] pt-8 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#087333]" aria-hidden />
            <div>
              <h2 className="text-sm font-bold text-[#24103F]">
                {lang === "te" ? "మీ గోప్యత మీ చేతుల్లో" : "Your privacy stays in your hands"}
              </h2>
              <p className="mt-1 text-[12px] leading-6 text-[#6B6570]">
                {lang === "te"
                  ? "సభ్యత్వం మీ ప్రొఫైల్‌ను బహిరంగంగా ప్రచురించదు. ఫోటోలు మరియు సంప్రదింపు వివరాలు మీ సెట్టింగ్‌ల ప్రకారం ఉంటాయి."
                  : "Membership does not make your contact details public. Photos and contact information continue to follow your privacy settings and the platform's access rules."}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#D1A329]" aria-hidden />
            <div>
              <h2 className="text-sm font-bold text-[#24103F]">
                {lang === "te" ? "చెల్లింపు సహాయం" : "Payment help"}
              </h2>
              <p className="mt-1 text-[12px] leading-6 text-[#6B6570]">
                {lang === "te"
                  ? "చెల్లింపు సమస్య ఉంటే, మీ నమోదిత ఇమెయిల్ నుండి సంప్రదించండి. మా రీఫండ్ విధానం కూడా చూడండి."
                  : "If a payment needs attention, write from your registered email. Our refund policy explains how payment issues are handled."}{" "}
                <Link to="/refund" className="font-semibold text-[#087333] underline">
                  {lang === "te" ? "రీఫండ్ విధానం" : "Refund policy"}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* EMOTIONAL OUTCOME BANNER */}
        <div className="mt-14 overflow-hidden rounded-xs border border-[#ded5c8] bg-[#FAF8F3]">
          <div className="grid items-center md:grid-cols-[0.8fr_1.2fr]">
            <div className="relative aspect-[16/10] md:aspect-auto md:h-full overflow-hidden bg-[#efe9df]">
              <img
                src={MARKETING_COUPLE_IMAGES["celebrationJourney"]!.src}
                alt={
                  lang === "te"
                    ? MARKETING_COUPLE_IMAGES["celebrationJourney"]!.altTe
                    : MARKETING_COUPLE_IMAGES["celebrationJourney"]!.alt
                }
                className="h-full w-full object-cover object-[center_20%]"
                decoding="async"
              />
              <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-[10px] font-semibold text-[#F5E5B2] backdrop-blur-xs">
                <Sparkles className="h-3 w-3 text-[#D1A329]" />
                <span>{lang === "te" ? "నిదర్శన చిత్రం" : "Illustrative Visual"}</span>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <span className="sbm-kicker">
                {lang === "te" ? "దాంపత్య లక్ష్యం" : "The Journey's Promise"}
              </span>
              <h3 className="sbm-heading mt-3 text-2xl">
                {lang === "te"
                  ? "గౌరవప్రదమైన అన్వేషణ. ఆనందకరమైన దాంపత్యం."
                  : "A considered search. A joyful lifelong companionship."}
              </h3>
              <p className="sbm-body mt-3 text-[13px] leading-6">
                {lang === "te"
                  ? "సభ్యత్వం అనేది సంభాషణను గౌరవంగా ముందుకు తీసుకెళ్లడానికి ఒక సహాయక సాధనం మాత్రమే. మీ జీవిత భాగస్వామి అన్వేషణలో ప్రతి అడుగు మన సమాజ విలువల ఆధారంగా సాగుతుంది."
                  : "Membership is designed to support families in having thoughtful, unhurried conversations. Every feature protects your dignity while helping you find your partner within the Shettibalija community."}
              </p>
              <div className="mt-5">
                <Link to="/register" className="sbm-link-arrow">
                  {lang === "te" ? "ఉచిత ప్రొఫైల్‌తో ప్రారంభించండి" : "Begin with a free profile"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function asStringList(value: Json | null): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}
